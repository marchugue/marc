document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = {
    email:    document.getElementById('email').value,
    password: document.getElementById('password').value
  };
  const res = await fetch('/login', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  const result = await res.json();
  alert(result.message);
});
