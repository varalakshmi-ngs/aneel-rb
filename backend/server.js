const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pool = require('./db');

dotenv.config();

const app = express();
app.set('trust proxy', true);
const PORT = Number(process.env.PORT || 4000);
const UPLOAD_DIR = process.env.UPLOAD_DIR || 'uploads';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
const FRONTEND_URLS = process.env.FRONTEND_URLS;
const JWT_SECRET = process.env.JWT_SECRET || 'secret-token';
console.log('JWT_SECRET configured:', JWT_SECRET ? 'yes' : 'no');
const isProduction = process.env.NODE_ENV === 'production';
const BACKEND_URL = process.env.BACKEND_URL || (isProduction ? 'https://robochurch.nuhvin.com' : `http://localhost:${PORT}`);
const PUBLIC_BASE_URL = process.env.PUBLIC_BASE_URL || BACKEND_URL;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const allowedOrigins = (FRONTEND_URLS || FRONTEND_URL)
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

// Always allow the production frontend
if (!allowedOrigins.includes('https://robochurch.nuhvin.com')) {
  allowedOrigins.push('https://robochurch.nuhvin.com');
}

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }

      // In dev, allow any localhost port to prevent CORS issues when Next picks
      // an available port (e.g. 3000 vs 3001).
      if (!isProduction) {
        try {
          const url = new URL(origin);
          if (url.protocol === 'http:' && (url.hostname === 'localhost' || url.hostname === '127.0.0.1')) {
            return callback(null, true);
          }
        } catch {
          // ignore and fall through to whitelist logic
        }
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);

const UPLOAD_PATH = path.join(__dirname, UPLOAD_DIR);
fs.mkdirSync(UPLOAD_PATH, { recursive: true });

app.use(`/uploads`, express.static(UPLOAD_PATH));
app.use(`/api/uploads`, express.static(UPLOAD_PATH));

function getHost(req) {
  const forwardedHost = req.get('X-Forwarded-Host') || req.get('Forwarded');
  if (forwardedHost) {
    const hostCandidate = forwardedHost.split(',')[0].trim();
    const hostMatch = hostCandidate.match(/host=([^;]+)/i);
    return hostMatch ? hostMatch[1].trim() : hostCandidate;
  }
  return req.get('host');
}

function normalizeBodyUrls(body, req) {
  if (Array.isArray(body)) {
    return body.map((item) => normalizeBodyUrls(item, req));
  }
  if (body && typeof body === 'object') {
    return Object.fromEntries(
      Object.entries(body).map(([key, value]) => [key, normalizeBodyUrls(value, req)])
    );
  }
  return normalizeUploadUrl(body, req);
}

app.use((req, res, next) => {
  const originalJson = res.json.bind(res);
  res.json = (body) => originalJson(normalizeBodyUrls(body, req));
  next();
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dest = path.join(__dirname, UPLOAD_DIR);
    fs.mkdirSync(dest, { recursive: true });
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const safeName = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    cb(null, `${timestamp}-${safeName}`);
  },
});

const upload = multer({ storage });

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Missing token' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
}

function getProtocol(req) {
  // Check for forwarded protocol headers (common with reverse proxies/load balancers)
  const forwardedProto = req.get('X-Forwarded-Proto') || req.get('X-Forwarded-Protocol');
  if (forwardedProto) {
    return forwardedProto.split(',')[0].trim(); // Take first protocol if multiple
  }

  // Check for Cloudflare header
  if (req.get('CF-Visitor')) {
    try {
      const cfVisitor = JSON.parse(req.get('CF-Visitor'));
      if (cfVisitor.scheme) return cfVisitor.scheme;
    } catch {}
  }

  // Fallback to req.protocol
  return req.protocol;
}

function getBaseUrl(req) {
  if (process.env.PUBLIC_BASE_URL) {
    return process.env.PUBLIC_BASE_URL;
  }

  if (process.env.BACKEND_URL) {
    return process.env.BACKEND_URL;
  }

  const protocol = getProtocol(req);
  const host = getHost(req);
  return `${protocol}://${host}`;
}

function sanitizeDate(dateStr) {
  if (!dateStr || dateStr === '' || dateStr === 'null' || dateStr === 'undefined' || dateStr === '0000-00-00') {
    return null;
  }
  return dateStr;
}

function normalizeUploadUrl(url, req) {

  if (!url || typeof url !== 'string') return url;
  
  const baseUrl = getBaseUrl(req);

  // If it's a relative path starting with /uploads, make it absolute using current host
  if (url.startsWith('/uploads/')) {
    return `${baseUrl}/api${url}`;
  }

  try {
    const parsed = new URL(url);
    const currentProtocol = getProtocol(req);
    const currentHost = getHost(req);

    // Convert localhost URLs to the externally visible host.
    if (parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1') {
      parsed.protocol = currentProtocol + ':';
      parsed.hostname = currentHost.split(':')[0];
      if (currentHost.includes(':')) parsed.port = currentHost.split(':')[1];
      else parsed.port = '';
    }

    // In local development, rewrite production upload hostnames to the current backend host.
    const knownProductionUploadHosts = ['robochurch.nuhvin.com', 'www.robochurch.nuhvin.com'];
    if (
      !isProduction &&
      knownProductionUploadHosts.includes(parsed.hostname) &&
      parsed.pathname.startsWith('/api/uploads')
    ) {
      parsed.protocol = currentProtocol + ':';
      parsed.hostname = currentHost.split(':')[0];
      if (currentHost.includes(':')) parsed.port = currentHost.split(':')[1];
      else parsed.port = '';
    }

    // Convert HTTP URLs to HTTPS when request is over HTTPS or if it's production domain
    if (parsed.protocol === 'http:' && (currentProtocol === 'https' || parsed.hostname.includes('nuhvin.com'))) {
      parsed.protocol = 'https:';
    }

    if (parsed.pathname.startsWith('/uploads/')) {
      parsed.pathname = '/api' + parsed.pathname;
    }

    return parsed.toString();
  } catch {
    // If it's not a valid absolute URL but contains 'uploads/', try to fix it
    if (url.includes('uploads/')) {
        const parts = url.split('uploads/');
        return `${baseUrl}/api/uploads/${parts[parts.length - 1]}`;
    }
  }
  return url;
}

function normalizeStoredUrl(url) {
  if (!url || typeof url !== 'string') return url;

  const publicBaseUrl = process.env.PUBLIC_BASE_URL || process.env.BACKEND_URL;

  // If it's a relative path starting with /uploads, make it absolute using PUBLIC_BASE_URL
  if (url.startsWith('/uploads/') && publicBaseUrl) {
    return `${publicBaseUrl}/api${url}`;
  }

  try {
    const parsed = new URL(url);
    const publicBase = process.env.PUBLIC_BASE_URL ? new URL(process.env.PUBLIC_BASE_URL) : null;

    if (parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1') {
      if (publicBase) {
        parsed.protocol = publicBase.protocol;
        parsed.hostname = publicBase.hostname;
        parsed.port = publicBase.port || '';
      }
    } else if (publicBase && parsed.protocol === 'http:') {
      parsed.protocol = publicBase.protocol;
      parsed.hostname = publicBase.hostname;
      parsed.port = publicBase.port || '';
    }

    // Force https for production domains and environments
    if (parsed.protocol === 'http:' && (parsed.hostname.includes('nuhvin.com') || process.env.NODE_ENV === 'production')) {
      parsed.protocol = 'https:';
    }

    // NGINX proxies only /api to the backend, so static path /uploads must be /api/uploads
    if (parsed.pathname.startsWith('/uploads/')) {
      parsed.pathname = '/api' + parsed.pathname;
    }

    return parsed.toString();
  } catch {
    // If it's not a valid absolute URL but contains 'uploads/', try to fix it
    if (url.includes('uploads/') && publicBaseUrl) {
        const parts = url.split('uploads/');
        return `${publicBaseUrl}/api/uploads/${parts[parts.length - 1]}`;
    }
  }

  return url;
}

async function initializeDatabase() {
  let connection;
  try {
    connection = await pool.getConnection();
    await connection.query(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB;
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS home_sections (
        id INT AUTO_INCREMENT PRIMARY KEY,
        section_key VARCHAR(100) NOT NULL UNIQUE,
        title VARCHAR(255),
        subtitle VARCHAR(255),
        description TEXT,
        image_url VARCHAR(500),
        meta JSON,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB;
    `);

    const [homeSectionColumns] = await connection.query(
      `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
       WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'home_sections'`
    );
    const existingHomeColumns = homeSectionColumns.map((row) => row.COLUMN_NAME.toLowerCase());

    if (!existingHomeColumns.includes('meta')) {
      await connection.query(`ALTER TABLE home_sections ADD COLUMN meta JSON`);
    }
    if (!existingHomeColumns.includes('hero_pastor_name')) {
      await connection.query(`ALTER TABLE home_sections ADD COLUMN hero_pastor_name VARCHAR(255)`);
    }
    if (!existingHomeColumns.includes('hero_pastor_image_url')) {
      await connection.query(`ALTER TABLE home_sections ADD COLUMN hero_pastor_image_url VARCHAR(500)`);
    }
    if (!existingHomeColumns.includes('updated_at')) {
      await connection.query(`ALTER TABLE home_sections ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
    }

    await connection.query(`
      CREATE TABLE IF NOT EXISTS pastors (
        id INT AUTO_INCREMENT PRIMARY KEY,
        home_section_id INT NOT NULL,
        name VARCHAR(255) NOT NULL,
        image_url VARCHAR(500),
        position INT NOT NULL DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (home_section_id) REFERENCES home_sections(id) ON DELETE CASCADE,
        UNIQUE KEY unique_position (home_section_id, position)
      ) ENGINE=InnoDB;
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS events (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        event_date DATE,
        location VARCHAR(255),
        image_url VARCHAR(500),
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB;
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS gallery_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        image_url VARCHAR(500) NOT NULL,
        category VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB;
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS pcc_members (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(200),
        bio TEXT,
        photo_url VARCHAR(500),
        mobile VARCHAR(50),
        email VARCHAR(255),
        family_details TEXT,
        passcode VARCHAR(100),
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_passcode (passcode)
      ) ENGINE=InnoDB;
    `);

    const [pccMemberColumns] = await connection.query(
      `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
       WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'pcc_members'`
    );
    const existingPccColumns = pccMemberColumns.map((row) => row.COLUMN_NAME.toLowerCase());

    if (!existingPccColumns.includes('mobile')) {
      await connection.query(`ALTER TABLE pcc_members ADD COLUMN mobile VARCHAR(50)`);
    }
    if (!existingPccColumns.includes('email')) {
      await connection.query(`ALTER TABLE pcc_members ADD COLUMN email VARCHAR(255)`);
    }
    if (!existingPccColumns.includes('family_details')) {
      await connection.query(`ALTER TABLE pcc_members ADD COLUMN family_details TEXT`);
    }
    if (!existingPccColumns.includes('passcode')) {
      await connection.query(`ALTER TABLE pcc_members ADD COLUMN passcode VARCHAR(100)`);
    }
    if (!existingPccColumns.includes('status')) {
      await connection.query(`ALTER TABLE pcc_members ADD COLUMN status VARCHAR(50) DEFAULT 'pending'`);
    }

    const [passcodeIndex] = await connection.query(
      `SELECT INDEX_NAME FROM INFORMATION_SCHEMA.STATISTICS
       WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'pcc_members' AND INDEX_NAME = 'unique_passcode'`
    );
    if (passcodeIndex.length === 0) {
      await connection.query(`ALTER TABLE pcc_members ADD UNIQUE INDEX unique_passcode (passcode)`);
    }

    const [missingPasscodes] = await connection.query(
      'SELECT id FROM pcc_members WHERE passcode IS NULL OR passcode = ""'
    );
    for (const row of missingPasscodes) {
      const passcode = await generateUniquePccPasscode();
      await connection.query('UPDATE pcc_members SET passcode = ? WHERE id = ?', [passcode, row.id]);
    }

    await connection.query(`
      CREATE TABLE IF NOT EXISTS pcc_social_links (
        id INT AUTO_INCREMENT PRIMARY KEY,
        pcc_member_id INT NOT NULL,
        platform VARCHAR(50) NOT NULL,
        url VARCHAR(500) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (pcc_member_id) REFERENCES pcc_members(id) ON DELETE CASCADE,
        UNIQUE KEY unique_platform (pcc_member_id, platform)
      ) ENGINE=InnoDB;
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS church_pastors (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(200),
        image_url VARCHAR(500),
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB;
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS members (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(200),
        bio TEXT,
        photo_url VARCHAR(500),
        email VARCHAR(255),
        phone VARCHAR(50),
        address TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB;
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(100),
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        processed BOOLEAN DEFAULT FALSE
      ) ENGINE=InnoDB;
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS uploads (
        id INT AUTO_INCREMENT PRIMARY KEY,
        filename VARCHAR(500) NOT NULL,
        url VARCHAR(1000) NOT NULL,
        uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB;
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS registered_members (
        id INT AUTO_INCREMENT PRIMARY KEY,
        first_name VARCHAR(255) NOT NULL,
        surname VARCHAR(255) NOT NULL,
        gender ENUM('Male', 'Female', 'Other') NOT NULL,
        dob DATE NOT NULL,
        mobile_number VARCHAR(50) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        photo_url VARCHAR(500),
        marital_status ENUM('Single', 'Married') NOT NULL,
        status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB;
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS member_spouses (
        id INT AUTO_INCREMENT PRIMARY KEY,
        member_id INT NOT NULL,
        first_name VARCHAR(255) NOT NULL,
        surname VARCHAR(255) NOT NULL,
        dob DATE NOT NULL,
        photo_url VARCHAR(500),
        marriage_date DATE,
        FOREIGN KEY (member_id) REFERENCES registered_members(id) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS member_children (
        id INT AUTO_INCREMENT PRIMARY KEY,
        member_id INT NOT NULL,
        name VARCHAR(255) NOT NULL,
        gender ENUM('Male', 'Female', 'Other') NOT NULL,
        dob DATE NOT NULL,
        photo_url VARCHAR(500),
        FOREIGN KEY (member_id) REFERENCES registered_members(id) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS member_church_records (
        id INT AUTO_INCREMENT PRIMARY KEY,
        member_id INT NOT NULL,
        baptism_date DATE,
        confirmation_date DATE,
        joining_date DATE,
        FOREIGN KEY (member_id) REFERENCES registered_members(id) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `);

    const [rows] = await connection.query('SELECT id FROM admin_users LIMIT 1');
    if (rows.length === 0) {
      const defaultUsername = process.env.ADMIN_USERNAME || 'admin';
      const defaultPassword = process.env.ADMIN_PASSWORD || 'admin123';
      const passwordHash = await bcrypt.hash(defaultPassword, 10);
      await connection.query('INSERT INTO admin_users (username, password_hash) VALUES (?, ?)', [defaultUsername, passwordHash]);
      console.log(`Created default admin account: ${defaultUsername}`);
    }
  } catch (error) {
    console.error('Database initialization error', { code: error?.code, message: error?.message });
    throw error;
  } finally {
    connection?.release();
  }
}

function generateToken(user) {
  console.log('Generating token for user:', user.username);
  const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '12h' });
  console.log('Token generated successfully');
  return token;
}

function generatePccPasscode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return `STJLC-${Array.from({ length: 5 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')}`;
}

async function generateUniquePccPasscode() {
  let passcode = generatePccPasscode();
  let [rows] = await pool.query('SELECT id FROM pcc_members WHERE passcode = ?', [passcode]);
  while (rows.length > 0) {
    passcode = generatePccPasscode();
    [rows] = await pool.query('SELECT id FROM pcc_members WHERE passcode = ?', [passcode]);
  }
  return passcode;
}

app.post('/api/admin/create-default', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id FROM admin_users LIMIT 1');
    if (rows.length > 0) {
      return res.json({ message: 'Admin user already exists' });
    }

    const defaultUsername = process.env.ADMIN_USERNAME || 'admin';
    const defaultPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const passwordHash = await bcrypt.hash(defaultPassword, 10);
    await pool.query('INSERT INTO admin_users (username, password_hash) VALUES (?, ?)', [defaultUsername, passwordHash]);

    res.json({ message: `Created default admin account: ${defaultUsername}` });
  } catch (error) {
    console.error('Error creating admin user:', error);
    res.status(500).json({ message: 'Failed to create admin user', error: error.message });
  }
});

app.post('/api/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log('Login attempt for username:', username);

    if (!username || !password) {
      console.log('Missing username or password');
      return res.status(400).json({ message: 'Username and password are required' });
    }

    console.log('Querying database for user:', username);
    const [rows] = await pool.query('SELECT * FROM admin_users WHERE username = ?', [username]);
    console.log('Database query result:', rows.length, 'rows found');

    if (rows.length === 0) {
      console.log('User not found, creating default admin user');
      // Create default admin user
      const defaultUsername = process.env.ADMIN_USERNAME || 'admin';
      const defaultPassword = process.env.ADMIN_PASSWORD || 'admin123';
      const passwordHash = await bcrypt.hash(defaultPassword, 10);
      await pool.query('INSERT INTO admin_users (username, password_hash) VALUES (?, ?)', [defaultUsername, passwordHash]);
      console.log(`Created default admin account: ${defaultUsername}`);

      // Now try login again
      const [newRows] = await pool.query('SELECT * FROM admin_users WHERE username = ?', [username]);
      if (newRows.length === 0) {
        console.log('Failed to create admin user');
        return res.status(500).json({ message: 'Failed to create admin user' });
      }
      rows.push(...newRows);
    }

    const user = rows[0];
    console.log('User found, checking password');
    const valid = await bcrypt.compare(password, user.password_hash);
    console.log('Password check result:', valid);

    if (!valid) {
      console.log('Invalid password for user:', username);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log('Login successful for user:', username);
    const token = generateToken(user);
    res.json({ message: 'Login successful', token, user: { id: user.id, username: user.username } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
});

app.get('/api/home', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM home_sections ORDER BY id');

    // For each home section, fetch associated pastors
    for (const section of rows) {
      const [pastors] = await pool.query(
        'SELECT id, name, image_url, position FROM pastors WHERE home_section_id = ? ORDER BY position',
        [section.id]
      );
      section.pastors = pastors;
    }

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Unable to load home sections' });
  }
});

app.put('/api/home/:key', authenticateToken, async (req, res) => {
  try {
    const sectionKey = req.params.key;
    const { title, subtitle, description, image_url, hero_pastor_name, hero_pastor_image_url, pastors } = req.body;

    console.log('Updating home section:', sectionKey, { title, subtitle, description, image_url, hero_pastor_name, hero_pastor_image_url });
    console.log('Pastors data:', pastors);

    // First, get or create the home section
    let [existing] = await pool.query('SELECT id FROM home_sections WHERE section_key = ?', [sectionKey]);

    let sectionId;
    if (existing.length === 0) {
      const [result] = await pool.query(
        'INSERT INTO home_sections (section_key, title, subtitle, description, image_url, hero_pastor_name, hero_pastor_image_url) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [sectionKey, title || null, subtitle || null, description || null, image_url || null, hero_pastor_name || null, hero_pastor_image_url || null]
      );
      sectionId = result.insertId;
      console.log('Created new home section with ID:', sectionId);
    } else {
      sectionId = existing[0].id;
      await pool.query(
        'UPDATE home_sections SET title = ?, subtitle = ?, description = ?, image_url = ?, hero_pastor_name = ?, hero_pastor_image_url = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [title || null, subtitle || null, description || null, image_url || null, hero_pastor_name || null, hero_pastor_image_url || null, sectionId]
      );
      console.log('Updated existing home section with ID:', sectionId);
    }

    // Handle pastors if provided
    if (Array.isArray(pastors)) {
      console.log('Processing pastors array with length:', pastors.length);
      // Delete existing pastors for this section
      await pool.query('DELETE FROM pastors WHERE home_section_id = ?', [sectionId]);
      console.log('Deleted existing pastors for section:', sectionId);

      // Insert new pastors
      for (let i = 0; i < pastors.length; i++) {
        const pastor = pastors[i];
        console.log('Processing pastor at index', i, ':', pastor);
        if (pastor && typeof pastor === 'object' && pastor.name) {
          await pool.query(
            'INSERT INTO pastors (home_section_id, name, image_url, position) VALUES (?, ?, ?, ?)',
            [sectionId, pastor.name, pastor.image_url || null, i]
          );
          console.log('Inserted pastor:', pastor.name, 'at position:', i);
        } else {
          console.log('Skipping invalid pastor at index', i, ':', pastor);
        }
      }
    } else {
      console.log('No pastors array provided or not an array');
    }

    res.json({ message: 'Home section updated' });
  } catch (error) {
    console.error('Error updating home section:', error);
    res.status(500).json({ message: 'Unable to update home section', error: error.message });
  }
});

app.get('/api/events', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM events ORDER BY event_date DESC, created_at DESC');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Unable to load events' });
  }
});

app.post('/api/events', authenticateToken, async (req, res) => {
  try {
    const { title, description, event_date, location, image_url, is_active } = req.body;
    await pool.query(
      'INSERT INTO events (title, description, event_date, location, image_url, is_active) VALUES (?, ?, ?, ?, ?, ?)',
      [title, description || null, event_date || null, location || null, image_url || null, is_active === false ? 0 : 1]
    );
    res.json({ message: 'Event created' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Unable to create event' });
  }
});

app.put('/api/events/:id', authenticateToken, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { title, description, event_date, location, image_url, is_active } = req.body;
    await pool.query(
      'UPDATE events SET title = ?, description = ?, event_date = ?, location = ?, image_url = ?, is_active = ? WHERE id = ?',
      [title, description || null, event_date || null, location || null, image_url || null, is_active === false ? 0 : 1, id]
    );
    res.json({ message: 'Event updated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Unable to update event' });
  }
});

app.delete('/api/events/:id', authenticateToken, async (req, res) => {
  try {
    const id = Number(req.params.id);
    await pool.query('DELETE FROM events WHERE id = ?', [id]);
    res.json({ message: 'Event deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Unable to delete event' });
  }
});

app.get('/api/gallery', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM gallery_items ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Unable to load gallery' });
  }
});

app.post('/api/gallery', authenticateToken, async (req, res) => {
  try {
    const { title, description, image_url, category } = req.body;
    await pool.query(
      'INSERT INTO gallery_items (title, description, image_url, category) VALUES (?, ?, ?, ?)',
      [title, description || null, image_url || null, category || null]
    );
    res.json({ message: 'Gallery item added' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Unable to add gallery item' });
  }
});

app.put('/api/gallery/:id', authenticateToken, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { title, description, image_url, category } = req.body;
    await pool.query(
      'UPDATE gallery_items SET title = ?, description = ?, image_url = ?, category = ? WHERE id = ?',
      [title, description || null, image_url || null, category || null, id]
    );
    res.json({ message: 'Gallery item updated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Unable to update gallery item' });
  }
});

app.delete('/api/gallery/:id', authenticateToken, async (req, res) => {
  try {
    const id = Number(req.params.id);
    await pool.query('DELETE FROM gallery_items WHERE id = ?', [id]);
    res.json({ message: 'Gallery item deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Unable to delete gallery item' });
  }
});

app.get('/api/pcc-members', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM pcc_members ORDER BY created_at DESC');

    // For each PCC member, fetch associated social links
    for (const member of rows) {
      const [socialLinks] = await pool.query(
        'SELECT platform, url FROM pcc_social_links WHERE pcc_member_id = ?',
        [member.id]
      );
      member.social_links = socialLinks;
      member.family_details = member.family_details ? JSON.parse(member.family_details) : [];
    }

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Unable to load PCC members' });
  }
});

app.get('/api/pcc-members/lookup', async (req, res) => {
  try {
    const passcode = req.query.passcode;
    if (!passcode) {
      return res.status(400).json({ message: 'Passcode is required' });
    }

    const [rows] = await pool.query('SELECT * FROM pcc_members WHERE passcode = ?', [passcode]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Member not found' });
    }

    const member = rows[0];
    const [socialLinks] = await pool.query(
      'SELECT platform, url FROM pcc_social_links WHERE pcc_member_id = ?',
      [member.id]
    );
    member.social_links = socialLinks;
    member.family_details = member.family_details ? JSON.parse(member.family_details) : [];

    res.json(member);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Unable to lookup PCC member' });
  }
});

app.post('/api/pcc-members/register', async (req, res) => {
  try {
    const { name, role, bio, photo_url, social_links, mobile, email, family_details } = req.body;
    const passcode = await generateUniquePccPasscode();
    const formattedFamilyDetails = Array.isArray(family_details)
      ? JSON.stringify(family_details.filter((detail) => typeof detail === 'string' && detail.trim() !== ''))
      : family_details
      ? JSON.stringify(String(family_details).split('\n').map((item) => item.trim()).filter(Boolean))
      : null;

    const [result] = await pool.query(
      'INSERT INTO pcc_members (name, role, bio, photo_url, mobile, email, family_details, passcode, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [name, role || null, bio || null, photo_url || null, mobile || null, email || null, formattedFamilyDetails, passcode, 'pending']
    );

    const memberId = result.insertId;

    // Handle social links if provided
    if (Array.isArray(social_links)) {
      for (const link of social_links) {
        if (link.platform && link.url) {
          await pool.query(
            'INSERT INTO pcc_social_links (pcc_member_id, platform, url) VALUES (?, ?, ?)',
            [memberId, link.platform, link.url]
          );
        }
      }
    }

    res.json({ message: 'PCC member added successfully. Pending admin approval.', passcode });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Unable to register PCC member' });
  }
});

app.post('/api/pcc-members', authenticateToken, async (req, res) => {
  try {
    const { name, role, bio, photo_url, social_links, mobile, email, family_details, status } = req.body;
    const passcode = await generateUniquePccPasscode();
    const formattedFamilyDetails = Array.isArray(family_details)
      ? JSON.stringify(family_details.filter((detail) => typeof detail === 'string' && detail.trim() !== ''))
      : family_details
      ? JSON.stringify(String(family_details).split('\n').map((item) => item.trim()).filter(Boolean))
      : null;
    const finalStatus = status || 'pending';

    const [result] = await pool.query(
      'INSERT INTO pcc_members (name, role, bio, photo_url, mobile, email, family_details, passcode, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [name, role || null, bio || null, photo_url || null, mobile || null, email || null, formattedFamilyDetails, passcode, finalStatus]
    );

    const memberId = result.insertId;

    // Handle social links if provided
    if (Array.isArray(social_links)) {
      for (const link of social_links) {
        if (link.platform && link.url) {
          await pool.query(
            'INSERT INTO pcc_social_links (pcc_member_id, platform, url) VALUES (?, ?, ?)',
            [memberId, link.platform, link.url]
          );
        }
      }
    }

    res.json({ message: 'PCC member added', passcode });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Unable to add PCC member' });
  }
});

app.put('/api/pcc-members/:id', authenticateToken, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { name, role, bio, photo_url, social_links, mobile, email, family_details, status } = req.body;
    const formattedFamilyDetails = Array.isArray(family_details)
      ? JSON.stringify(family_details.filter((detail) => typeof detail === 'string' && detail.trim() !== ''))
      : family_details
      ? JSON.stringify(String(family_details).split('\n').map((item) => item.trim()).filter(Boolean))
      : null;

    const [existing] = await pool.query('SELECT status FROM pcc_members WHERE id = ?', [id]);
    if (existing.length === 0) return res.status(404).json({ message: 'Not found' });
    const finalStatus = status || existing[0].status || 'pending';

    await pool.query(
      'UPDATE pcc_members SET name = ?, role = ?, bio = ?, photo_url = ?, mobile = ?, email = ?, family_details = ?, status = ? WHERE id = ?',
      [name, role || null, bio || null, photo_url || null, mobile || null, email || null, formattedFamilyDetails, finalStatus, id]
    );

    // Handle social links
    if (Array.isArray(social_links)) {
      // Delete existing social links
      await pool.query('DELETE FROM pcc_social_links WHERE pcc_member_id = ?', [id]);

      // Insert new social links
      for (const link of social_links) {
        if (link.platform && link.url) {
          await pool.query(
            'INSERT INTO pcc_social_links (pcc_member_id, platform, url) VALUES (?, ?, ?)',
            [id, link.platform, link.url]
          );
        }
      }
    }

    res.json({ message: 'PCC member updated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Unable to update PCC member' });
  }
});

app.put('/api/pcc-members/:id/status', authenticateToken, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;
    await pool.query('UPDATE pcc_members SET status = ? WHERE id = ?', [status, id]);
    res.json({ message: 'PCC member status updated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Unable to update PCC member status' });
  }
});

app.delete('/api/pcc-members/:id', authenticateToken, async (req, res) => {
  try {
    const id = Number(req.params.id);
    await pool.query('DELETE FROM pcc_members WHERE id = ?', [id]);
    res.json({ message: 'PCC member deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Unable to delete PCC member' });
  }
});

app.get('/api/church-pastors', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM church_pastors ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Unable to load church pastors' });
  }
});

app.post('/api/church-pastors', authenticateToken, async (req, res) => {
  try {
    const { name, role, image_url, is_active } = req.body;
    await pool.query(
      'INSERT INTO church_pastors (name, role, image_url, is_active) VALUES (?, ?, ?, ?)',
      [name, role || null, image_url || null, is_active === false ? 0 : 1]
    );
    res.json({ message: 'Church pastor added' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Unable to add church pastor' });
  }
});

app.put('/api/church-pastors/:id', authenticateToken, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { name, role, image_url, is_active } = req.body;
    await pool.query(
      'UPDATE church_pastors SET name = ?, role = ?, image_url = ?, is_active = ? WHERE id = ?',
      [name, role || null, image_url || null, is_active === false ? 0 : 1, id]
    );
    res.json({ message: 'Church pastor updated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Unable to update church pastor' });
  }
});

app.delete('/api/church-pastors/:id', authenticateToken, async (req, res) => {
  try {
    const id = Number(req.params.id);
    await pool.query('DELETE FROM church_pastors WHERE id = ?', [id]);
    res.json({ message: 'Church pastor deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Unable to delete church pastor' });
  }
});

app.get('/api/members', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM members ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Unable to load members' });
  }
});

app.post('/api/members', authenticateToken, async (req, res) => {
  try {
    const { name, role, bio, photo_url, email, phone, address } = req.body;
    await pool.query(
      'INSERT INTO members (name, role, bio, photo_url, email, phone, address) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, role || null, bio || null, photo_url || null, email || null, phone || null, address || null]
    );
    res.json({ message: 'Member added' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Unable to add member' });
  }
});

app.put('/api/members/:id', authenticateToken, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { name, role, bio, photo_url, email, phone, address } = req.body;
    await pool.query(
      'UPDATE members SET name = ?, role = ?, bio = ?, photo_url = ?, email = ?, phone = ?, address = ? WHERE id = ?',
      [name, role || null, bio || null, photo_url || null, email || null, phone || null, address || null, id]
    );
    res.json({ message: 'Member updated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Unable to update member' });
  }
});

app.delete('/api/members/:id', authenticateToken, async (req, res) => {
  try {
    const id = Number(req.params.id);
    await pool.query('DELETE FROM members WHERE id = ?', [id]);
    res.json({ message: 'Member deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Unable to delete member' });
  }
});

app.get('/api/contact', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM contact_messages ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Unable to load contact messages' });
  }
});

app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    await pool.query(
      'INSERT INTO contact_messages (name, email, phone, message) VALUES (?, ?, ?, ?)',
      [name, email, phone || null, message]
    );
    res.json({ message: 'Contact message received' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Unable to submit contact message' });
  }
});

app.post('/api/upload', authenticateToken, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const baseUrl = getBaseUrl(req);
    const url = `${baseUrl}/uploads/${req.file.filename}`;
    await pool.query('INSERT INTO uploads (filename, url) VALUES (?, ?)', [req.file.filename, url]);
    res.json({ message: 'File uploaded', url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'File upload failed' });
  }
});

app.post('/api/upload-public', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const baseUrl = getBaseUrl(req);
    const url = `${baseUrl}/uploads/${req.file.filename}`;
    await pool.query('INSERT INTO uploads (filename, url) VALUES (?, ?)', [req.file.filename, url]);
    res.json({ message: 'File uploaded', url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'File upload failed' });
  }
});

app.get('/api/uploads', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM uploads ORDER BY uploaded_at DESC');
    const normalizedRows = rows.map((row) => ({ ...row, url: normalizeUploadUrl(row.url, req) }));
    res.json(normalizedRows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Unable to load uploads' });
  }
});

app.get('/api/fix-upload-urls', async (req, res) => {
  try {
    console.log('Fix upload URLs triggered from', req.headers['x-forwarded-for'] || req.ip, 'host:', req.get('host'));

    // Normalize stored upload URLs to use a public HTTPS base URL whenever possible.
    const [uploadRows] = await pool.query('SELECT id, url FROM uploads');
    for (const row of uploadRows) {
      if (!row.url || typeof row.url !== 'string') continue;
      const normalizedUrl = normalizeStoredUrl(row.url);
      if (normalizedUrl !== row.url) {
        await pool.query('UPDATE uploads SET url = ? WHERE id = ?', [normalizedUrl, row.id]);
      }
    }

    const tableColumns = {
      home_sections: ['image_url'],
      events: ['image_url'],
      gallery_items: ['image_url'],
      church_pastors: ['image_url'],
      members: ['photo_url'],
      pcc_members: ['photo_url'],
    };

    for (const [table, columns] of Object.entries(tableColumns)) {
      for (const column of columns) {
        const [rows] = await pool.query(`SELECT id, ${column} FROM ${table}`);
        for (const row of rows) {
          if (!row[column] || typeof row[column] !== 'string') continue;
          const normalizedUrl = normalizeStoredUrl(row[column]);
          if (normalizedUrl !== row[column]) {
            await pool.query(`UPDATE ${table} SET ${column} = ? WHERE id = ?`, [normalizedUrl, row.id]);
          }
        }
      }

      if (table === 'home_sections') {
        const [heroRows] = await pool.query(`SELECT id, meta FROM ${table} WHERE meta IS NOT NULL`);
        for (const row of heroRows) {
          if (row.meta) {
            try {
              const meta = JSON.parse(row.meta);
              if (meta.hero_pastor_image_url && typeof meta.hero_pastor_image_url === 'string') {
                const normalizedUrl = normalizeStoredUrl(meta.hero_pastor_image_url);
                if (normalizedUrl !== meta.hero_pastor_image_url) {
                  meta.hero_pastor_image_url = normalizedUrl;
                  await pool.query(`UPDATE ${table} SET meta = ? WHERE id = ?`, [JSON.stringify(meta), row.id]);
                }
              }
            } catch (parseError) {
              console.error(`Invalid JSON in home_sections.meta for id=${row.id}:`, parseError);
            }
          }
        }
      }
    }

    res.json({ message: 'Upload URLs normalized to HTTPS/public base URL' });
  } catch (error) {
    console.error('Error updating URLs:', error);
    res.status(500).json({ message: 'Failed to update URLs', error: error.message });
  }
});

// --- Member Authentication & Registration APIs ---
const otpStorage = new Map(); // mobile -> { otp, expiry }

app.post('/api/members/send-otp', async (req, res) => {
  const { mobile_number } = req.body;
  if (!mobile_number) return res.status(400).json({ message: 'Mobile number is required' });

  const otp = Math.floor(1000 + Math.random() * 9000).toString(); // 4-digit OTP
  const expiry = Date.now() + 5 * 60 * 1000; // 5 minutes validity
  otpStorage.set(mobile_number, { otp, expiry });

  console.log(`[SIMULATED OTP] Mobile: ${mobile_number}, OTP: ${otp}`);
  // In development, we can return the OTP directly for ease of testing
  res.json({ message: 'OTP sent successfully', otp: process.env.NODE_ENV !== 'production' ? otp : undefined });
});

app.post('/api/members/verify-otp', async (req, res) => {
  const { mobile_number, otp } = req.body;
  
  if (!mobile_number || !otp) return res.status(400).json({ message: 'Mobile number and OTP are required' });

  const storedData = otpStorage.get(mobile_number);
  if (!storedData) return res.status(400).json({ message: 'OTP not requested for this number' });

  if (Date.now() > storedData.expiry) {
    otpStorage.delete(mobile_number);
    return res.status(400).json({ message: 'OTP has expired' });
  }

  if (storedData.otp !== otp) {
    return res.status(400).json({ message: 'Invalid OTP' });
  }

  // Verification successful
  otpStorage.delete(mobile_number);
  res.json({ message: 'OTP verified successfully' });
});

app.post('/api/members/register', upload.fields([
  { name: 'profile_photo', maxCount: 1 },
  { name: 'spouse_photo', maxCount: 1 },
  { name: 'child_photos', maxCount: 10 }
]), async (req, res) => {
  let connection;
  try {
    const {
      first_name, surname, gender, dob, mobile_number, password, marital_status,
      spouse_first_name, spouse_surname, spouse_dob, marriage_date,
      children, // JSON string array of objects
      baptism_date, confirmation_date, joining_date
    } = req.body;

    const clean_dob = sanitizeDate(dob);
    const clean_spouse_dob = sanitizeDate(spouse_dob);
    const clean_marriage_date = sanitizeDate(marriage_date);
    const clean_baptism_date = sanitizeDate(baptism_date);
    const clean_confirmation_date = sanitizeDate(confirmation_date);
    const clean_joining_date = sanitizeDate(joining_date);


    // Validate main required fields
    if (!first_name || !surname || !gender || !dob || !mobile_number || !password || !marital_status) {
      return res.status(400).json({ message: 'Missing required basic details' });
    }

    // Validate Church Records (Step 4) are strictly populated
    if (!baptism_date || !confirmation_date || !joining_date) {
      return res.status(400).json({ message: 'Missing required church records. All dates are mandatory for registration.' });
    }

    // Check if mobile number already exists
    const [existing] = await pool.query('SELECT id FROM registered_members WHERE mobile_number = ?', [mobile_number]);
    if (existing.length > 0) {
      return res.status(400).json({ message: 'Mobile number is already registered' });
    }

    let profile_photo_url = null;
    if (req.files && req.files['profile_photo']) {
      profile_photo_url = `/uploads/${req.files['profile_photo'][0].filename}`;
    }

    const password_hash = await bcrypt.hash(password, 10);

    connection = await pool.getConnection();
    await connection.beginTransaction();

    // Insert Member
    const [memberResult] = await connection.query(
      `INSERT INTO registered_members (first_name, surname, gender, dob, mobile_number, password_hash, photo_url, marital_status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [first_name, surname, gender, dob, mobile_number, password_hash, profile_photo_url, marital_status]
    );

    const memberId = memberResult.insertId;

    // Insert Spouse
    if (marital_status === 'Married' && spouse_first_name && spouse_surname && spouse_dob) {
      let spouse_photo_url = null;
      if (req.files && req.files['spouse_photo']) {
        spouse_photo_url = `/uploads/${req.files['spouse_photo'][0].filename}`;
      }
      
      await connection.query(
        `INSERT INTO member_spouses (member_id, first_name, surname, dob, photo_url, marriage_date)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [memberId, spouse_first_name, spouse_surname, spouse_dob, spouse_photo_url, marriage_date || null]
      );
    }

    // Insert Children
    if (children) {
      try {
        const parsedChildren = JSON.parse(children); // Ensure frontend sends stringified array of objects
        if (Array.isArray(parsedChildren)) {
          let childPhotoIndex = 0;
          for (const child of parsedChildren) {
            let child_photo_url = null;
            if (child.has_photo && req.files && req.files['child_photos'] && req.files['child_photos'][childPhotoIndex]) {
              child_photo_url = `/uploads/${req.files['child_photos'][childPhotoIndex].filename}`;
              childPhotoIndex++;
            }
            if (child.name && child.gender && child.dob) {
              await connection.query(
                `INSERT INTO member_children (member_id, name, gender, dob, photo_url) VALUES (?, ?, ?, ?, ?)`,
                [memberId, child.name, child.gender, child.dob, child_photo_url]
              );
            }
          }
        }
      } catch (e) {
        console.error('Error parsing children data', e);
      }
    }

    // Insert Church Records
    if (clean_baptism_date || clean_confirmation_date || clean_joining_date) {
      await connection.query(
        `INSERT INTO member_church_records (member_id, baptism_date, confirmation_date, joining_date)
         VALUES (?, ?, ?, ?)`,
        [memberId, clean_baptism_date, clean_confirmation_date, clean_joining_date]
      );
    }


    await connection.commit();
    res.json({ message: 'Registration successful' });
  } catch (error) {
    if (connection) await connection.rollback();
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed', error: error.message });
  } finally {
    if (connection) connection.release();
  }
});

app.post('/api/members/login', async (req, res) => {
  try {
    const { mobile_number, password } = req.body;
    if (!mobile_number || !password) {
      return res.status(400).json({ message: 'Mobile number and password are required' });
    }

    const [rows] = await pool.query('SELECT * FROM registered_members WHERE mobile_number = ?', [mobile_number]);
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (user.status === 'Pending') {
      return res.status(403).json({ message: 'Your account is pending admin approval. Please wait until an administrator reviews your application.' });
    } else if (user.status === 'Rejected') {
      return res.status(403).json({ message: 'Your registration was rejected. Please contact administration.' });
    }

    const token = jwt.sign({ id: user.id, mobile_number: user.mobile_number, role: 'member' }, JWT_SECRET, { expiresIn: '12h' });
    
    const userInfo = {
      id: user.id,
      first_name: user.first_name,
      surname: user.surname,
      mobile_number: user.mobile_number,
      photo_url: user.photo_url
    };

    res.json({ message: 'Login successful', token, user: userInfo });
  } catch (error) {
    console.error('Member login error:', error);
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
});

// GET Member details by ID (Public for profile viewing or protected)
app.get('/api/members/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Fetch base member info
    const [memberRows] = await pool.query('SELECT id, first_name, surname, gender, dob, mobile_number, photo_url, marital_status, status, created_at FROM registered_members WHERE id = ?', [id]);
    
    if (memberRows.length === 0) {
      return res.status(404).json({ message: 'Member not found' });
    }
    
    const member = memberRows[0];
    
    // Fetch spouse info
    const [spouseRows] = await pool.query('SELECT * FROM member_spouses WHERE member_id = ?', [id]);
    member.spouse = spouseRows.length > 0 ? spouseRows[0] : null;
    
    // Fetch children
    const [childrenRows] = await pool.query('SELECT * FROM member_children WHERE member_id = ?', [id]);
    member.children = childrenRows;
    
    // Fetch church records
    const [churchRows] = await pool.query('SELECT * FROM member_church_records WHERE member_id = ?', [id]);
    member.church_records = churchRows.length > 0 ? churchRows[0] : null;
    
    res.json(member);
  } catch (error) {
    console.error('Error fetching member profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// UPDATE Member details by ID
app.put('/api/members/:id', authenticateToken, upload.fields([
  { name: 'profile_photo', maxCount: 1 },
  { name: 'spouse_photo', maxCount: 1 },
  { name: 'child_photos', maxCount: 10 }
]), async (req, res) => {
  let connection;
  try {
    const { id } = req.params;
    const {
      first_name, surname, gender, dob, marital_status,
      spouse_first_name, spouse_surname, spouse_dob, marriage_date,
      children, // JSON string array
      baptism_date, confirmation_date, joining_date
    } = req.body;

    // Authorization check: Only the user themselves or an admin can update
    if (req.user.id != id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized to update this profile' });
    }

    connection = await pool.getConnection();
    await connection.beginTransaction();

    // 1. Update Basic Info
    let profile_photo_url = req.body.photo_url || null; // Fallback to existing if provided as string
    if (req.files && req.files['profile_photo']) {
      profile_photo_url = `/uploads/${req.files['profile_photo'][0].filename}`;
    }

    await connection.query(
      `UPDATE registered_members SET first_name = ?, surname = ?, gender = ?, dob = ?, photo_url = ?, marital_status = ?
       WHERE id = ?`,
      [first_name, surname, gender, dob, profile_photo_url, marital_status, id]
    );

    // 2. Update Spouse Info
    // First, check if spouse exists
    const [existingSpouse] = await connection.query('SELECT id FROM member_spouses WHERE member_id = ?', [id]);
    
    if (marital_status === 'Married') {
      let spouse_photo_url = req.body.spouse_photo_url || null;
      if (req.files && req.files['spouse_photo']) {
        spouse_photo_url = `/uploads/${req.files['spouse_photo'][0].filename}`;
      }

      if (existingSpouse.length > 0) {
        await connection.query(
          `UPDATE member_spouses SET first_name = ?, surname = ?, dob = ?, photo_url = ?, marriage_date = ?
           WHERE member_id = ?`,
          [spouse_first_name, spouse_surname, spouse_dob, spouse_photo_url, marriage_date || null, id]
        );
      } else {
        await connection.query(
          `INSERT INTO member_spouses (member_id, first_name, surname, dob, photo_url, marriage_date)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [id, spouse_first_name, spouse_surname, spouse_dob, spouse_photo_url, marriage_date || null]
        );
      }
    } else {
      // If Single, delete spouse records if they exist
      await connection.query('DELETE FROM member_spouses WHERE member_id = ?', [id]);
    }

    // 3. Update Children (Delete and Re-insert is often cleaner for list updates)
    if (marital_status === 'Married' && children) {
        await connection.query('DELETE FROM member_children WHERE member_id = ?', [id]);
        try {
            const parsedChildren = JSON.parse(children);
            if (Array.isArray(parsedChildren)) {
                let childPhotoIndex = 0;
                for (const child of parsedChildren) {
                    let child_photo_url = child.photo_url || null;
                    if (child.has_photo && req.files && req.files['child_photos'] && req.files['child_photos'][childPhotoIndex]) {
                        child_photo_url = `/uploads/${req.files['child_photos'][childPhotoIndex].filename}`;
                        childPhotoIndex++;
                    }
                    if (child.name && child.gender && child.dob) {
                        await connection.query(
                            `INSERT INTO member_children (member_id, name, gender, dob, photo_url) VALUES (?, ?, ?, ?, ?)`,
                            [id, child.name, child.gender, child.dob, child_photo_url]
                        );
                    }
                }
            }
        } catch (e) {
            console.error('Error updating children data', e);
        }
    } else {
        await connection.query('DELETE FROM member_children WHERE member_id = ?', [id]);
    }

    // 4. Update Church Records
    const clean_baptism_date = sanitizeDate(baptism_date);
    const clean_confirmation_date = sanitizeDate(confirmation_date);
    const clean_joining_date = sanitizeDate(joining_date);

    const [existingChurch] = await connection.query('SELECT id FROM member_church_records WHERE member_id = ?', [id]);
    if (existingChurch.length > 0) {
        await connection.query(
            `UPDATE member_church_records SET baptism_date = ?, confirmation_date = ?, joining_date = ?
             WHERE member_id = ?`,
            [clean_baptism_date, clean_confirmation_date, clean_joining_date, id]
        );
    } else {
        await connection.query(
            `INSERT INTO member_church_records (member_id, baptism_date, confirmation_date, joining_date)
             VALUES (?, ?, ?, ?)`,
            [id, clean_baptism_date, clean_confirmation_date, clean_joining_date]
        );
    }


    await connection.commit();
    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    if (connection) await connection.rollback();
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Update failed', error: error.message });
  } finally {
    if (connection) connection.release();
  }
});



// Admin API to fetch pending members
app.get('/api/admin/members/pending', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM registered_members WHERE status = ? ORDER BY created_at DESC', ['Pending']);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch pending members', error: error.message });
  }
});

// Admin API to fetch all registered members
app.get('/api/admin/members/all', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM registered_members ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch all members', error: error.message });
  }
});

// Admin API to update member status
app.put('/api/admin/members/:id/status', authenticateToken, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Pending', 'Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    await pool.query('UPDATE registered_members SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ message: `Member status successfully updated to ${status}` });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update member status', error: error.message });
  }
});

// Admin API to delete a member
app.delete('/api/admin/members/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    // Cascading delete handles related tables (spouses, children, church records)
    const [result] = await pool.query('DELETE FROM registered_members WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Member not found' });
    }
    
    res.json({ message: 'Member and all associated records successfully deleted' });
  } catch (error) {
    console.error('Member deletion error:', error);
    res.status(500).json({ message: 'Failed to delete member', error: error.message });
  }
});

app.use((err, req, res, next) => {
  if (err && err.message === 'Not allowed by CORS') {
    return res.status(403).json({ message: err.message });
  }
  return next(err);
});

app.use((req, res) => {
  res.status(404).json({ message: 'API route not found' });
});

initializeDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Backend server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Database initialization failed', error);
    process.exit(1);
  });
