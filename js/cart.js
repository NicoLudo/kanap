// L'URL de l'API.
apiUrl = `http://localhost:3000/api/products/`;

/**
 * @param {Array} selectedProducts Listes des produits.
 */
let selectedProducts = JSON.parse(localStorage.getItem(`selectedProducts`));

/**
 * Récupère les détails d'un produit à partir de son ID via l'API.
 *
 * @param {string} productId L'ID du produit à récupérer.
 * @returns {Object} Un objet contenant les détails du produit.
 */
async function fetchProductDetails(productId) {
    try {
        const response = await fetch(apiUrl + productId);
        const product = await response.json();
        return product;
    } catch (error) {
        console.error(error);
        return null;
    }
}

/**
 * Crée et affiche un message indiquant que le panier est vide.
 */
function displayEmptyCartMessage() {
    const emptyCartMessage = document.createElement(`p`);
    emptyCartMessage.innerHTML = `Votre panier est vide.`;
    document.querySelector(`#cart__items`).innerHTML = ``;
    document.querySelector(`#cart__items`).append(emptyCartMessage);
}

/**
 * Initialise les valeurs de quantité et de prix à zéro.
 *
 * @returns {Object} Un objet contenant les propriétés `totalQuantity` et `totalPrice`, toutes deux initialisées à zéro.
 */
function initTotalValues() {
    let totalQuantity = 0;
    let totalPrice = 0;
    return { totalQuantity, totalPrice };
}

/**
 * Met à jour les valeurs du total de quantité et de prix dans le panier.
 *
 * @param {number} totalQuantity La quantité totale des produits dans le panier.
 * @param {number} totalPrice Le prix total des produits dans le panier.
 */
function updateTotalValues(totalQuantity, totalPrice) {
    const totalQuantityElement = document.querySelector(`#totalQuantity`);
    const totalPriceElement = document.querySelector(`#totalPrice`);

    totalQuantityElement.textContent = totalQuantity;
    totalPriceElement.textContent = totalPrice.toFixed(2);
}

/**
 * Retourne l'élément du panier à un index spécifique.
 * 
 * @param {number} index - L'index de l'élément dans le panier.
 * @returns {Promise<HTMLElement>} - L'élément du panier à l'index spécifié.
 */
async function getCartItem(index) {
    return document.querySelector(`.cart__item:nth-of-type(${index + 1})`);
}

/**
 * Met à jour le panier avec les produits sélectionnés, et calcule et affiche les totaux.
 * 
 * @param {Array} selectedProducts - Un tableau des produits sélectionnés.
 */
async function updateCart(selectedProducts) {
    let { totalQuantity, totalPrice } = initTotalValues();

    if (selectedProducts.length === 0) {
        displayEmptyCartMessage();
    } else {
        updateTotalValues(totalQuantity, totalPrice);
    }

    // Parcour les produits sélectionnés.
    for (let index = 0; index < selectedProducts.length; index++) {
        const selectedProduct = selectedProducts[index];
        const cartItem = await getCartItem(index);
        const itemQuantityInput = cartItem.querySelector(`.itemQuantity`);

        // Mets à jour la quantité du produit sélectionné.
        selectedProduct.quantity = parseInt(itemQuantityInput.value);
        itemQuantityInput.value = selectedProduct.quantity;

        // Récupère les détails du produit à partir de l'ID.
        const productDetails = await fetchProductDetails(selectedProduct.productId);
        if (!productDetails) {
            return;
        }

        // Calcule le prix total en multipliant le prix unitaire par la quantité.
        const itemPrice = parseFloat(productDetails.price);
        const itemTotalPrice = itemPrice * selectedProduct.quantity;

        // Mets à jour les totaux du panier.
        totalPrice += itemTotalPrice;
        totalQuantity += selectedProduct.quantity;
    }

    updateTotalValues(totalQuantity, totalPrice);
}

// Vérifie si les produits sélectionnés existent et si leur longueur est supérieure à 0.
if (selectedProducts && selectedProducts.length > 0) {
    let { totalQuantity, totalPrice } = initTotalValues();

    selectedProducts.forEach(async (selectedProduct, index) => {
        // Récupère les détails du produit à partir de l'ID.
        const productDetails = await fetchProductDetails(selectedProduct.productId);
        if (!productDetails) {
            return;
        }
        // Crée un nouvel élément pour les produits.
        const cartItem = document.createElement(`article`);
        cartItem.classList.add(`cart__item`);
        cartItem.innerHTML = `
            <div class="cart__item__img">
                <img src="${productDetails.imageUrl}" alt="${productDetails.altTxt}">
            </div>
            <div class="cart__item__content">
                <div class="cart__item__content__description">
                    <h2>${productDetails.name}</h2>
                    <p>${selectedProduct.color}</p>
                    <p>${productDetails.price} €</p>
                </div>
                <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                        <p>Qté : </p>
                        <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${selectedProduct.quantity}">
                    </div>
                    <div class="cart__item__content__settings__delete">
                        <p class="deleteItem">Supprimer</p>
                    </div>
                </div>
            </div>`;
        document.querySelector(`#cart__items`).append(cartItem);
        updateCart(selectedProducts);

        // Gère l'événement de changement de quantité d'un produit.
        const itemQuantityInput = cartItem.querySelector(`.itemQuantity`);
        itemQuantityInput.addEventListener(`change`, () => {
            updateCart(selectedProducts);
            localStorage.setItem(`selectedProducts`, JSON.stringify(selectedProducts));
            let newQuantity = parseInt(itemQuantityInput.value);
            if (newQuantity > 0) { // Mets à jour la quantité du produit.
                selectedProduct.quantity = newQuantity;
                localStorage.setItem(`selectedProducts`, JSON.stringify(selectedProducts));
            } else { // Supprime le produit.
                selectedProducts.splice(index, 1);
                localStorage.setItem(`selectedProducts`, JSON.stringify(selectedProducts));
                cartItem.remove();
            }
        });

        // Gère l'événement de clic pour supprimer un produit.
        cartItem.querySelector(`.deleteItem`).addEventListener(`click`, () => {
            selectedProducts = selectedProducts.filter(product => product.productId !== selectedProduct.productId || product.color !== selectedProduct.color);
            localStorage.setItem(`selectedProducts`, JSON.stringify(selectedProducts));
            cartItem.remove();
            updateCart(selectedProducts);
        });

        // Mets à jour les totaux du panier.
        totalQuantity += parseInt(selectedProduct.quantity);
        const itemPrice = parseFloat(productDetails.price);
        const itemTotalPrice = itemPrice * selectedProduct.quantity;
        totalPrice += itemTotalPrice;
    });

    updateTotalValues(totalQuantity, totalPrice);
} else {
    displayEmptyCartMessage()
}

/* FORMULAIRE */

/**
 * Valide champ de formulaire en utilisant une expression régulière.
 *
 * @param {string} input - Élément d'entrée à valider.
 * @param {string} inputError - Élément d'erreur à afficher.
 * @param {string} inputLabel - Label de l'élément d'entrée (pour les messages d'erreur).
 * @param {RegExp} regExp - Expression régulière utilisée pour valider l'entrée.
 * @returns {boolean} - Retourne true si la validation réussit, sinon false.
 */
function validateForm(input, inputError, inputLabel, regExp) {
    let tester = false
    input = document.querySelector(input)
    inputError = document.querySelector(inputError)

    // Vérifie si l'entrée est vide.
    if (input.value === ``) {
        inputError.textContent = `Le ${inputLabel} est obligatoire`;
    }
    // Vérifie si l'entrée ne correspond pas à l'expression régulière.
    else if (!regExp.test(input.value)) {
        inputError.textContent = `Le ${inputLabel} est mal renseigné`;
    }
    // Si la validation réussit, effacer le message d'erreur et définir tester sur true.
    else {
        inputError.textContent = ``;
        tester = true
    }
    return tester
}

// Récupère le bouton de commande.
const orderButton = document.querySelector(`#order`);

// Ajoute un écouteur d'événements pour empêcher la soumission du formulaire par défaut.
document.querySelector(`form`).addEventListener(`submit`, (event) => {
    event.preventDefault();
})

// Ajoute un écouteur d'événements au bouton de commande pour effectuer la validation et la soumission.
orderButton.addEventListener(`click`, () => {
    if (selectedProducts && selectedProducts.length > 0) {
        // Valide les champs du formulaire en utilisant la fonction validateForm.
        if (
            validateForm(`#firstName`, `#firstNameErrorMsg`, `prénom`, /^[a-zA-ZàáâäçèéêëìíîïñòóôöùúûüÿÀÁÂÄÇÈÉÊËÌÍÎÏÑÒÓÔÖÙÚÛÜŸ-]+$/) &&
            validateForm(`#lastName`, `#lastNameErrorMsg`, `nom`, /^[a-zA-ZàáâäçèéêëìíîïñòóôöùúûüÿÀÁÂÄÇÈÉÊËÌÍÎÏÑÒÓÔÖÙÚÛÜŸ-]+$/) &&
            validateForm(`#address`, `#addressErrorMsg`, `adresse`, /^\d+\s+[a-zA-Z0-9\s.`-]+$/) &&
            validateForm(`#city`, `#cityErrorMsg`, `ville`, /^[a-zA-ZàáâäçèéêëìíîïñòóôöùúûüÿÀÁÂÄÇÈÉÊËÌÍÎÏÑÒÓÔÖÙÚÛÜŸ-]+\s?([a-zA-ZàáâäçèéêëìíîïñòóôöùúûüÿÀÁÂÄÇÈÉÊËÌÍÎÏÑÒÓÔÖÙÚÛÜŸ-]+\s?)*$/) &&
            validateForm(`#email`, `#emailErrorMsg`, `email`, /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
        ) {
            let products = []

            // Récupére les IDs des produits à partir du localStorage.
            JSON.parse(localStorage.getItem(`selectedProducts`)).forEach(item => {
                products.push(item.productId)
            })

            // Envoye la commande à l'API.
            fetch(`http://localhost:3000/api/products/order`, {
                method: `POST`,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contact: {
                        firstName: document.querySelector(`#firstName`).value,
                        lastName: document.querySelector(`#lastName`).value,
                        address: document.querySelector(`#address`).value,
                        city: document.querySelector(`#city`).value,
                        email: document.querySelector(`#email`).value
                    },
                    products
                })
            })
                .then(response => response.json())
                .then(data => {
                    // Vide le localStorage et redirige vers la page de confirmation.
                    localStorage.clear()
                    window.location.assign(`./confirmation.html?orderId=${data.orderId}`);
                })
                .catch(error => console.error(error));
        }
    } else {
        // Affiche un message d'erreur si aucun produit n'est présent dans le panier.
        alert(`Vous devez ajouter au moins un produit au panier pour commander.`);
    }
});

