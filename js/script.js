// L'URL de l'API
apiUrl = `http://localhost:3000/api/products/`;

// Utilisation de la méthode fetch pour récupérer les données de l'API
fetch(apiUrl)
    .then(response => response.json()) // Conversion de la réponse en format JSON
    .then(data => {
        let content = ``; // Initialisation d'une variable content vide
        // Boucle pour parcourir chaque produit récupéré depuis l'API
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
        // Ajout du contenu HTML à la page web
        document.querySelector(`#items`).innerHTML = content;
    })
    // Gestion des erreurs et affichage dans la console en cas de problème
    .catch(error => console.error(error));