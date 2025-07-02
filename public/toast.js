function showToast(message, type = "success") {
  const toast = document.getElementById("toast");
  const icon = toast.querySelector(".toast-icon");
  const msg = toast.querySelector(".toast-msg");

  switch (type) {
    case "error":
      icon.textContent = "❌";
      break;
    case "email":
      icon.textContent = "📧";
      break;
    case "info":
      icon.textContent = "ℹ️";
      break;
    default:
      icon.textContent = "✅";
  }

  msg.textContent = message;
  toast.classList.add("show");

  const hideTimeout = setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);

  toast.onclick = () => {
    clearTimeout(hideTimeout);
    toast.classList.remove("show");
  };
}
