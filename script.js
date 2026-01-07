const joinGroupBtn = document.getElementById('joinGroupBtn');
const confirmJoinDiv = document.getElementById('confirmJoinDiv');
const submitBtn = document.getElementById('submitBtn');
const statusDiv = document.getElementById('status');

let joinedGroup = false;

// Step 1: Join Group
joinGroupBtn.addEventListener('click', () => {
  const sessionId = document.getElementById('sessionId').value;
  if (!sessionId) return alert('Enter session ID');

  // Open group link (hardcoded for now, later can fetch from API)
  window.open('https://chat.whatsapp.com/YOUR_GROUP_LINK', '_blank');

  confirmJoinDiv.style.display = 'block';
});

// Step 2: Submit after joining
submitBtn.addEventListener('click', async () => {
  const sessionId = document.getElementById('sessionId').value;
  const name = document.getElementById('name').value;
  const phone = document.getElementById('phone').value;
  const countryCode = document.getElementById('countryCode').value;

  if (!sessionId || !name || !phone || !countryCode) {
    return alert('All fields are required');
  }

  // Call backend API
  try {
    const res = await fetch('https://YOUR_BACKEND_URL/api/participants/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        session_id: sessionId,
        name,
        phone_e164: phone,
        country_code: countryCode,
        joined_group: true
      })
    });

    const data = await res.json();

    if (data.success) {
      statusDiv.innerText = 'Contact added successfully! ✅';
    } else {
      statusDiv.innerText = `Error: ${data.error}`;
    }
  } catch (err) {
    console.error(err);
    statusDiv.innerText = 'Error submitting contact.';
  }
});
