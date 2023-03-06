apiUrl = `http://localhost:3000/api/products/`;

/**
 * @param {Array} selectedProducts Listes des produits
 */
const selectedProducts = JSON.parse(localStorage.getItem(`selectedProducts`));

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
 * Met à jour le panier (prix, quantité et message panier vide).
 * 
 * @param {Array} selectedProducts Listes des produits
 */
function updateCart(selectedProducts) {
    let { totalQuantity, totalPrice } = initTotalValues();

    if (selectedProducts.length === 0) {
        displayEmptyCartMessage()
    } else {
        updateTotalValues(totalQuantity, totalPrice);
    }

    selectedProducts.forEach((selectedProduct, index) => {
        const cartItem = document.querySelector(`.cart__item:nth-of-type(${index + 1})`);
        const itemQuantityInput = cartItem.querySelector(`.itemQuantity`);

        selectedProduct.quantity = parseInt(itemQuantityInput.value);
        itemQuantityInput.value = selectedProduct.quantity;

        const itemPrice = parseFloat(selectedProduct.price);
        const itemTotalPrice = itemPrice * selectedProduct.quantity;

        cartItem.querySelector(`.cart__item__content__description p:last-of-type`).textContent = `${itemTotalPrice} €`;
        totalPrice += itemTotalPrice;
        totalQuantity += selectedProduct.quantity;
    });

    updateTotalValues(totalQuantity, totalPrice);
}

if (selectedProducts && selectedProducts.length > 0) {
    let { totalQuantity, totalPrice } = initTotalValues();

    selectedProducts.forEach((selectedProduct, index) => {
        const cartItem = document.createElement(`article`);
        cartItem.classList.add(`cart__item`);
        cartItem.innerHTML = `
    <div class="cart__item__img">
        <img src="${selectedProduct.imageUrl}" alt="${selectedProduct.altTxt}">
    </div>
    <div class="cart__item__content">
        <div class="cart__item__content__description">
            <h2>${selectedProduct.name}</h2>
            <p>${selectedProduct.color}</p>
            <p>${selectedProduct.price} €</p>
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

        const itemQuantityInput = cartItem.querySelector(`.itemQuantity`);
        itemQuantityInput.addEventListener(`change`, () => {
            updateCart(selectedProducts);
            localStorage.setItem(`selectedProducts`, JSON.stringify(selectedProducts));
            const newQuantity = parseInt(itemQuantityInput.value);
            if (newQuantity > 0) {
                selectedProduct.quantity = newQuantity;
                localStorage.setItem(`selectedProducts`, JSON.stringify(selectedProducts));
            } else {
                selectedProducts.splice(index, 1);
                localStorage.setItem(`selectedProducts`, JSON.stringify(selectedProducts));
                cartItem.remove();
            }
        });

        cartItem.querySelector(`.deleteItem`).addEventListener(`click`, () => {
            selectedProducts.splice(index, 1);
            localStorage.setItem(`selectedProducts`, JSON.stringify(selectedProducts));
            cartItem.remove();
            updateCart(selectedProducts);
        });

        totalQuantity += parseInt(selectedProduct.quantity);
        const itemPrice = parseFloat(selectedProduct.price);
        const itemTotalPrice = itemPrice * selectedProduct.quantity;
        totalPrice += itemTotalPrice;
    });

    updateTotalValues(totalQuantity, totalPrice);
} else {
    displayEmptyCartMessage()
}

/* FORMULAIRE */

function validateForm(input, inputError, inputLabel, regExp) {

    let tester = false
    input = document.querySelector(input)
    inputError = document.querySelector(inputError)

    if (input.value === ``) {
        inputError.textContent = `Le ${inputLabel} est obligatoire`;
    } else if (!regExp.test(input.value)) {
        inputError.textContent = `Le ${inputLabel} est mal renseigné`;
    } else {
        inputError.textContent = ``;
        tester = true
    }

    return tester
}

const orderButton = document.querySelector(`#order`);

document.querySelector(`form`).addEventListener(`submit`, (event) => {
    event.preventDefault();
})

orderButton.addEventListener(`click`, () => {

    if (selectedProducts && selectedProducts.length > 0) {
        if (
            validateForm(`#firstName`, `#firstNameErrorMsg`, `prénom`, /^[a-zA-ZàáâäçèéêëìíîïñòóôöùúûüÿÀÁÂÄÇÈÉÊËÌÍÎÏÑÒÓÔÖÙÚÛÜŸ-]+$/) &&
            validateForm(`#lastName`, `#lastNameErrorMsg`, `nom`, /^[a-zA-ZàáâäçèéêëìíîïñòóôöùúûüÿÀÁÂÄÇÈÉÊËÌÍÎÏÑÒÓÔÖÙÚÛÜŸ-]+$/) &&
            validateForm(`#address`, `#addressErrorMsg`, `adresse`, /^\d+\s+[a-zA-Z0-9\s.`-]+$/) &&
            validateForm(`#city`, `#cityErrorMsg`, `ville`, /^[a-zA-ZàáâäçèéêëìíîïñòóôöùúûüÿÀÁÂÄÇÈÉÊËÌÍÎÏÑÒÓÔÖÙÚÛÜŸ-]+\s?([a-zA-ZàáâäçèéêëìíîïñòóôöùúûüÿÀÁÂÄÇÈÉÊËÌÍÎÏÑÒÓÔÖÙÚÛÜŸ-]+\s?)*$/) &&
            validateForm(`#email`, `#emailErrorMsg`, `email`, /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
        ) {

            let products = []

            JSON.parse(localStorage.getItem(`selectedProducts`)).forEach(item => {
                products.push(item.productId)
            })

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
                    localStorage.clear()
                    window.location.href = `./confirmation.html?orderId=${data.orderId}`
                })
                .catch(error => console.error(error));

        }
    } else {
        alert(`Vous devez ajouter au moins un produit au panier pour commander.`);
    }
});
