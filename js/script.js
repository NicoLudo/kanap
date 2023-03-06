apiUrl = `http://localhost:3000/api/products/`;

fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
        let content = ``;
        data.forEach(kanap => {
            console.log(kanap);
            content += `
            <a href="./product.html?id=${kanap._id}">
                <article>
                    <img src="${kanap.imageUrl}" alt="${kanap.altTxt}">
                    <h3 class="productName">${kanap.name}</h3>
                    <p class="productDescription">${kanap.description}</p>
                </article>
            </a>`
        });
        document.querySelector(`#items`).innerHTML = content;
    })
    .catch(error => console.error(error));