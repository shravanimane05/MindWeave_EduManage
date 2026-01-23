// Script to clear all uploaded data
fetch('http://localhost:4000/api/clear-data', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' }
})
  .then(res => res.json())
  .then(data => console.log('✅', data.message))
  .catch(err => console.error('❌ Error:', err));
