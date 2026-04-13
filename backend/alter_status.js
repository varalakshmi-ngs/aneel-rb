const pool = require('./db');

async function migrate() {
    try {
        console.log('Running ALTER TABLE registered_members mapping status...');
        const [result] = await pool.query("ALTER TABLE registered_members ADD COLUMN status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending' AFTER marital_status;");
        console.log('Successfully completed schema layout update.', result);
    } catch (e) {
        if (e.code === 'ER_DUP_FIELDNAME') {
            console.log('Column already exists, ignoring.');
        } else {
            console.error('Migration failed:', e);
        }
    } finally {
        process.exit();
    }
}
migrate();
