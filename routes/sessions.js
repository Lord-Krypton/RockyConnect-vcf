const express = require('express');
const router = express.Router();
const pool = require('../db');

// Create a new session
router.post('/create', async (req, res) => {
  try {
    const { title, group_link, max_participants, expires_at } = req.body;

    const result = await pool.query(
      `INSERT INTO sessions (title, group_link, max_participants, expires_at)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [title, group_link, max_participants, expires_at]
    );

    res.json({ success: true, session: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create session' });
  }
});

// Close a session manually
router.post('/close/:id', async (req, res) => {
  try {
    const sessionId = req.params.id;

    const result = await pool.query(
      `UPDATE sessions SET status='closed' WHERE id=$1 RETURNING *`,
      [sessionId]
    );

    if (result.rowCount === 0) return res.status(404).json({ error: 'Session not found' });

    res.json({ success: true, session: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to close session' });
  }
});

// Get session info & analytics
router.get('/:id', async (req, res) => {
  try {
    const sessionId = req.params.id;

    // Session info
    const sessionResult = await pool.query(`SELECT * FROM sessions WHERE id=$1`, [sessionId]);
    if (sessionResult.rowCount === 0) return res.status(404).json({ error: 'Session not found' });

    // Participants count
    const participantsResult = await pool.query(
      `SELECT COUNT(*) AS total_participants FROM participants WHERE session_id=$1`,
      [sessionId]
    );

    res.json({
      session: sessionResult.rows[0],
      total_participants: participantsResult.rows[0].total_participants
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch session info' });
  }
});

module.exports = router;
