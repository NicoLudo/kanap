const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get(`orderId`);
document.querySelector('#orderId').textContent = productId