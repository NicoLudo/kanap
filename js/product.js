const apiUrl = `http://localhost:3000/api/products/`;

const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get(`id`);

fetch(apiUrl + productId)
    .then(response => response.json())
    .then(product => {
        console.log(product)

        document.querySelector(`.item__img`).innerHTML = `
                <img src="${product.imageUrl}" alt="${product.altTxt}">`

        document.querySelector(`#title`).innerHTML = `
                <span>${product.name}</span>`

        document.querySelector(`#price`).innerHTML = `
                <span>${product.price}</span>`

        document.querySelector(`#description`).innerHTML = `
                <span>${product.description}</span>`

        product.colors.forEach((color) => {
            const option = document.createElement(`option`);
            option.value = color;
            option.innerHTML = color;
            document.querySelector(`#colors`).append(option);
        })

        document.querySelector(`#addToCart`).addEventListener(`click`, () => {
            const quantity = document.querySelector(`#quantity`).value;
            const color = document.querySelector(`#colors`).value;

            if (quantity <= 0) {
                alert(`Veuillez sélectionner une quantité valide.`);
                return;
            }
            if (quantity > 100) {
                alert(`Vous ne pouvez pas sélectionner plus de 100 quantités.`);
                return;
            }

            if (color === ``) {
                alert(`Veuillez sélectionner une couleur.`);
                return;
            }

            const item = {
                productId: product._id,
                quantity: parseInt(quantity),
                color: color,
            };

            let selectedProducts = JSON.parse(localStorage.getItem(`selectedProducts`)) || [];
            if (!Array.isArray(selectedProducts)) {
                selectedProducts = [];
            }

            const existingProductIndex = selectedProducts.findIndex(p => p.productId === item.productId && p.color === item.color);
            if (existingProductIndex !== -1) {
                selectedProducts[existingProductIndex].quantity += item.quantity;
            } else {
                selectedProducts.push(item);
            }

            localStorage.setItem(`selectedProducts`, JSON.stringify(selectedProducts));

            window.location.assign(`./cart.html`);
            alert(`Ajout de ${quantity} ${product.name} en ${color} au panier.`);
        });
    })
    .catch(error => console.error(error));
