const token = new URLSearchParams(window.location.search).get('token');
document.getElementById('resetForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const newPassword = document.getElementById('newPassword').value;
  const res = await fetch('/reset-password', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, newPassword })
  });
  const result = await res.json();
  alert(result.message);
  if (res.ok) window.location.href = 'index.html';
});
