apiUrl = `http://localhost:3000/api/products/`;

/**
 * @param {Array} selectedProducts Listes des produits
 */
const selectedProducts = JSON.parse(localStorage.getItem(`selectedProducts`));

/**
 * Met à jour le panier (prix, quantité et message panier vide).
 * @param {Array} selectedProducts Listes des produits
 */
function updateCart(selectedProducts) {
    let totalQuantity = 0;
    let totalPrice = 0;

    if (selectedProducts.length === 0) {
        document.querySelector(`#cart__items`).innerHTML = '';

        const emptyCartMessage = document.createElement(`p`);
        emptyCartMessage.innerHTML = `Votre panier est vide.`;
        document.querySelector(`#cart__items`).append(emptyCartMessage);
    } else {
        document.querySelector(`#totalQuantity`).textContent = 0;
        document.querySelector(`#totalPrice`).textContent = 0;
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

    document.querySelector(`#totalQuantity`).textContent = totalQuantity;
    document.querySelector(`#totalPrice`).textContent = totalPrice.toFixed(2);
}

if (selectedProducts && selectedProducts.length > 0) {
    let totalQuantity = 0;
    let totalPrice = 0;

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

    document.querySelector(`#totalQuantity`).textContent = totalQuantity;
    document.querySelector(`#totalPrice`).textContent = totalPrice.toFixed(2);
} else {
    const emptyCartMessage = document.createElement(`p`);
    emptyCartMessage.innerHTML = `Votre panier est vide.`;
    document.querySelector(`#cart__items`).append(emptyCartMessage);
}

const firstNameInput = document.querySelector(`#firstName`);
const lastNameInput = document.querySelector(`#lastName`);
const addressInput = document.querySelector(`#address`);
const cityInput = document.querySelector(`#city`);
const emailInput = document.querySelector(`#email`);
const orderButton = document.querySelector(`#order`);
const firstNameErrorMsg = document.querySelector(`#firstNameErrorMsg`);
const lastNameErrorMsg = document.querySelector(`#lastNameErrorMsg`);
const addressErrorMsg = document.querySelector(`#addressErrorMsg`);
const cityErrorMsg = document.querySelector(`#cityErrorMsg`);
const emailErrorMsg = document.querySelector(`#emailErrorMsg`);

function validateForm() {
    let valid = true;

    if (firstNameInput.value === ``) {
        firstNameErrorMsg.textContent = `Le prénom est obligatoire`;
        valid = false;
    } else {
        firstNameErrorMsg.textContent = ``;
    }

    if (lastNameInput.value === ``) {
        lastNameErrorMsg.textContent = `Le nom est obligatoire`;
        valid = false;
    } else {
        lastNameErrorMsg.textContent = ``;
    }

    if (addressInput.value === ``) {
        addressErrorMsg.textContent = `L'adresse est obligatoire`;
        valid = false;
    } else {
        addressErrorMsg.textContent = ``;
    }

    if (cityInput.value === ``) {
        cityErrorMsg.textContent = `La ville est obligatoire`;
        valid = false;
    } else {
        cityErrorMsg.textContent = ``;
    }

    if (emailInput.value === ``) {
        emailErrorMsg.textContent = `L'email est obligatoire`;
        valid = false;
    } else if (!isValidEmail(emailInput.value)) {
        emailErrorMsg.textContent = `L'email n'est pas valide`;
        valid = false;
    } else {
        emailErrorMsg.textContent = ``;
    }

    return valid;
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

orderButton.addEventListener(`click`, (event) => {
    event.preventDefault();

    if (selectedProducts && selectedProducts.length > 0) {
        if (validateForm()) {
            window.location.href = './confirmation.html';
            localStorage.removeItem(`selectedProducts`);
            document.querySelector(`#cart__items`).innerHTML = ``;
            document.querySelector(`#totalQuantity`).textContent = 0;
            document.querySelector(`#totalPrice`).textContent = 0;
        }
    } else {
        alert('Vous devez ajouter au moins un produit au panier pour commander.');
    }
});
