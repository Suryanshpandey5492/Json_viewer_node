const pool = require('../config/database');

async function saveFile(userId, content) {
    const query = `
      INSERT INTO files (user_id, content) 
      VALUES ($1, $2) RETURNING id;
    `;
    const values = [userId, JSON.stringify(content)];  // Ensure content is properly stringified
    
    try {
      const result = await pool.query(query, values);
      return result.rows[0];  // Return the saved file data
    } catch (err) {
      console.error("Error during DB query:", err);
      throw err;  // Rethrow the error to be handled by the controller
    }
  }

const getFilesByUserId = async (userId) => {
  const res = await pool.query('SELECT * FROM files WHERE user_id = $1', [userId]);
  return res.rows;
};

module.exports = { saveFile, getFilesByUserId };
