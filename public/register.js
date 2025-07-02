document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = {
    username: document.getElementById('username').value,
    email:    document.getElementById('email').value,
    password: document.getElementById('password').value
  };
  const res = await fetch('/register', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  const result = await res.json();
  alert(result.message);
});
