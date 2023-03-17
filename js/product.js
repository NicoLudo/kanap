// L'URL de l'API
const apiUrl = `http://localhost:3000/api/products/`;

// Récupère l'ID des produits
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get(`id`);

// Récupère les données du produit et les utilise
fetch(apiUrl + productId)
    .then(response => response.json())
    .then(product => {
        console.log(product)

        // Affiche les infos du produits
        document.querySelector(`.item__img`).innerHTML = `
                <img src="${product.imageUrl}" alt="${product.altTxt}">`
        document.querySelector(`#title`).innerHTML = `
                <span>${product.name}</span>`
        document.querySelector(`#price`).innerHTML = `
                <span>${product.price}</span>`
        document.querySelector(`#description`).innerHTML = `
                <span>${product.description}</span>`

        // Ajoute les options de couleur
        product.colors.forEach((color) => {
            const option = document.createElement(`option`);
            option.value = color;
            option.innerHTML = color;
            document.querySelector(`#colors`).append(option);
        })

        // Écouteur d'événement de clic pour ajouter le produit au panier
        document.querySelector(`#addToCart`).addEventListener(`click`, () => {
            const quantity = document.querySelector(`#quantity`).value;
            const color = document.querySelector(`#colors`).value;

            // Vérifie que la quantité est valide
            if (quantity <= 0) {
                alert(`Veuillez sélectionner une quantité valide.`);
                return;
            }
            if (quantity > 100) {
                alert(`Vous ne pouvez pas sélectionner plus de 100 quantités.`);
                return;
            }

            // Vérifie que la couleur est sélectionnée
            if (color === ``) {
                alert(`Veuillez sélectionner une couleur.`);
                return;
            }

            // Crée un objet avec les infos nécessaires pour la page panier
            const item = {
                productId: product._id,
                quantity: parseInt(quantity),
                color: color,
            };

            // Cré un tableau d'objet ou un tableau vide
            let selectedProducts = JSON.parse(localStorage.getItem(`selectedProducts`)) || [];
            if (!Array.isArray(selectedProducts)) {
                selectedProducts = [];
            }

            // Vérifie si le produit sélectionné existe déjà dans le panier
            const existingProductIndex = selectedProducts.findIndex(p => p.productId === item.productId && p.color === item.color);
            if (existingProductIndex !== -1) {
                // Si le produit existe déjà, met à jour la quantité
                selectedProducts[existingProductIndex].quantity += item.quantity;
            } else {
                // Sinon, ajoute le produit au panier
                selectedProducts.push(item);
            }

            // Mets à jour le localStorage
            localStorage.setItem(`selectedProducts`, JSON.stringify(selectedProducts));

            // Redirige l'utilisateur vers la page panier
            window.location.assign(`./cart.html`);
            alert(`Ajout de ${quantity} ${product.name} en ${color} au panier.`);
        });
    })
    .catch(error => console.error(error));
