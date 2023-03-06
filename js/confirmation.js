const apiUrl = `http://localhost:3000/api/products`;

fetch(apiUrl)
    .then(response => response.json())
    .then(products => {
        const productIds = products.map(product => product._id);
        const randomIndex = Math.floor(Math.random() * productIds.length);
        const randomProductId = productIds[randomIndex];
        document.querySelector(`#orderId`).textContent = randomProductId;
    })
    .catch(error => console.error(error));
