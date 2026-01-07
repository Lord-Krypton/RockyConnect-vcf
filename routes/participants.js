const express = require('express');
const router = express.Router();
const pool = require('../db');

// Submit participant (after join-group confirmation)
router.post('/submit', async (req, res) => {
  try {
    const { session_id, name, phone_e164, country_code, joined_group } = req.body;

    if (!joined_group) return res.status(400).json({ error: 'Participant must join the group first' });

    // Check session status
    const sessionRes = await pool.query(`SELECT * FROM sessions WHERE id=$1 AND status='active'`, [session_id]);
    if (sessionRes.rowCount === 0) return res.status(400).json({ error: 'Session closed or not found' });

    // Check max participants
    const countRes = await pool.query(`SELECT COUNT(*) AS total FROM participants WHERE session_id=$1`, [session_id]);
    if (parseInt(countRes.rows[0].total) >= sessionRes.rows[0].max_participants) {
      return res.status(400).json({ error: 'Session full' });
    }

    // Insert participant
    const insertRes = await pool.query(
      `INSERT INTO participants (session_id, name, phone_e164, country_code, joined_group)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [session_id, name, phone_e164, country_code, true]
    );

    res.json({ success: true, participant: insertRes.rows[0] });
  } catch (err) {
    // Handle duplicate phone number gracefully
    if (err.code === '23505') {
      return res.status(400).json({ error: 'This number is already added in the session' });
    }
    console.error(err);
    res.status(500).json({ error: 'Failed to submit participant' });
  }
});

module.exports = router;
