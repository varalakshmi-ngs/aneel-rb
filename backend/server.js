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
app.use(`/uploads`, express.static(path.join(__dirname, UPLOAD_DIR)));

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
  // Use BACKEND_URL if set
  if (process.env.BACKEND_URL) {
    return process.env.BACKEND_URL;
  }

  // Otherwise construct from request
  const protocol = getProtocol(req);
  const host = req.get('host');
  return `${protocol}://${host}`;
}

function normalizeUploadUrl(url, req) {
  if (!url || typeof url !== 'string') return url;
  try {
    const parsed = new URL(url);
    if (parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1') {
      const protocol = getProtocol(req);
      return `${protocol}://${req.get('host')}${parsed.pathname}${parsed.search}`;
    }
  } catch {
    // Leave invalid URLs unchanged.
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
        hero_pastor_name VARCHAR(255),
        hero_pastor_image_url VARCHAR(500),
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB;
    `);

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

    // First, get or create the home section
    let [existing] = await pool.query('SELECT id FROM home_sections WHERE section_key = ?', [sectionKey]);

    let sectionId;
    if (existing.length === 0) {
      const [result] = await pool.query(
        'INSERT INTO home_sections (section_key, title, subtitle, description, image_url, hero_pastor_name, hero_pastor_image_url) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [sectionKey, title || null, subtitle || null, description || null, image_url || null, hero_pastor_name || null, hero_pastor_image_url || null]
      );
      sectionId = result.insertId;
    } else {
      sectionId = existing[0].id;
      await pool.query(
        'UPDATE home_sections SET title = ?, subtitle = ?, description = ?, image_url = ?, hero_pastor_name = ?, hero_pastor_image_url = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [title || null, subtitle || null, description || null, image_url || null, hero_pastor_name || null, hero_pastor_image_url || null, sectionId]
      );
    }

    // Handle pastors if provided
    if (Array.isArray(pastors)) {
      // Delete existing pastors for this section
      await pool.query('DELETE FROM pastors WHERE home_section_id = ?', [sectionId]);

      // Insert new pastors
      for (let i = 0; i < pastors.length; i++) {
        const pastor = pastors[i];
        if (pastor && typeof pastor === 'object' && pastor.name) {
          await pool.query(
            'INSERT INTO pastors (home_section_id, name, image_url, position) VALUES (?, ?, ?, ?)',
            [sectionId, pastor.name, pastor.image_url || null, i]
          );
        }
      }
    }

    res.json({ message: 'Home section updated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Unable to update home section' });
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

app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    let adminCount = 0;
    try {
      const [adminRows] = await pool.query('SELECT COUNT(*) as count FROM admin_users');
      adminCount = adminRows[0].count;
    } catch (tableError) {
      console.log('admin_users table does not exist');
    }
    res.json({ status: 'ok', db: 'up', admin_users: adminCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', db: 'down' });
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
