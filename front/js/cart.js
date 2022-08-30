afficherPanier();

function afficherPanier() { // affiche le panier stocké dans le local storage
    let tableauProduit = JSON.parse(localStorage.getItem('products'));
    if (!tableauProduit || tableauProduit == '') {
        tableauProduit = [];
    }
    tableauProduit.forEach(function (produit) {
        getProduct(produit);
    });
}

function getProduct(cartObjJSON) { // récupère les données liées aux produits du panier auprès de l'API
    fetch("http://localhost:3000/api/products/" + cartObjJSON.itemID)
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("NETWORK RESPONSE ERROR");
            }
        })
        .then(canapes => {
            canapes.itemID = cartObjJSON.itemID;
            canapes.itemColor = cartObjJSON.itemColor;
            canapes.itemQuantity = cartObjJSON.itemQuantity;
            displayCartItems(canapes);
            addClickEvent();
            addChangeEvent();
            total();

        })
}


displayCartItems = canapes => { // affiche les objets du panier
    let cartItemsDiv = document.getElementById('cart__items');

    const cartItem = cartItemsDiv.appendChild(document.createElement('article'));
    cartItem.setAttribute('class', 'cart__item');
    cartItem.setAttribute('data-id', canapes.itemID);
    cartItem.setAttribute('data-color', canapes.itemColor);

    const cartItemImgDiv = cartItem.appendChild(document.createElement('div'));
    cartItemImgDiv.setAttribute('class', 'cart__item__img')

    const cartItemImg = cartItemImgDiv.appendChild(document.createElement('img'));
    cartItemImg.setAttribute('src', canapes.imageUrl);
    cartItemImg.setAttribute('alt', canapes.altTxt);

    const cartItemContent = cartItem.appendChild(document.createElement('div'));
    cartItemContent.setAttribute('class', 'cart__item__content');

    const cartItemDesc = cartItemContent.appendChild(document.createElement('div'));
    cartItemDesc.setAttribute('class', 'cart__item__content__description');

    const cartItemName = cartItemDesc.appendChild(document.createElement('h2'));
    cartItemName.innerText = canapes.name;

    const cartItemColor = cartItemDesc.appendChild(document.createElement('p'));
    cartItemColor.innerText = canapes.itemColor;

    const cartItemPrice = cartItemDesc.appendChild(document.createElement('p'));
    cartItemPrice.classList.add('price');
    cartItemPrice.innerText = canapes.price;

    const cartItemSettings = cartItemContent.appendChild(document.createElement('div'))
    cartItemSettings.setAttribute('class', 'cart__item__content__settings');

    const cartItemQty = cartItemSettings.appendChild(document.createElement('div'));
    cartItemQty.setAttribute('class', 'cart__item__content__settings__quantity');
    cartItemQty.innerHTML = '<p>Qté : </p>'
    const cartItemQtyInput = cartItemQty.appendChild(document.createElement('input'));
    cartItemQtyInput.setAttribute('type', 'number');
    cartItemQtyInput.setAttribute('class', 'itemQuantity');
    cartItemQtyInput.setAttribute('name', 'itemQuantity');
    cartItemQtyInput.setAttribute('min', '1');
    cartItemQtyInput.setAttribute('max', '100');
    cartItemQtyInput.setAttribute('value', canapes.itemQuantity);

    const cartItemDelete = cartItemSettings.appendChild(document.createElement('div'));
    cartItemDelete.setAttribute('class', 'cart__item__content__settings__delete');
    let balisep = document.createElement('p');
    balisep.classList.add('deleteItem');
    balisep.innerText = 'Supprimer';
    cartItemDelete.appendChild(balisep);
}

function total() { // affiche le prix et la quantité totale
    let items = document.getElementsByTagName('article');
    let itemsNumber = items.length;

    let prix = document.getElementsByClassName('price');
    let qty = document.getElementsByClassName('itemQuantity');

    let totalPriceDiv = document.getElementById('totalPrice');
    let totalQuantityDiv = document.getElementById('totalQuantity');

    let totalPrice = 0;
    let totalQty = 0;

    for (i = 0; i < itemsNumber; i++) {
        totalQty += parseInt(qty[i].value);
        totalPrice += parseInt(prix[i].innerText) * qty[i].value;
    }

    totalPriceDiv.innerText = totalPrice;
    totalQuantityDiv.innerText = totalQty;
}

function addClickEvent() { // ajoute un évènement cliquable au bouton "supprimer"
    let deleteButton = document.querySelectorAll('.deleteItem');
    deleteButton.forEach(function (article) {
        article.addEventListener('click', deleteItem);
    })
}

function deleteItem(item) { // supprime l'article du panier lorsque l'on clique sur son bouton "supprimer"
    let article = item.srcElement.closest('article');
    let id = article.dataset.id;
    let color = article.dataset.color;
    let listeFinaleProduit = [];

    let cart = JSON.parse(localStorage.getItem('products'));
    if (!cart || cart == '') {
        cart = [];
    }
    cart.forEach(function (product) {
        if (!(product.itemID == id && product.itemColor == color)) {
            listeFinaleProduit.push(product);
        }
    })
    localStorage.setItem('products', JSON.stringify(listeFinaleProduit));
    article.remove();
    total();
}

function addChangeEvent() { // permet de modifier le panier lorsqu'il y a une modification de quantité
    let input = document.querySelectorAll('input.itemQuantity');
    input.forEach(function (inp) {
        inp.addEventListener('change', function (event) {
            let cart = JSON.parse(localStorage.getItem('products'));
            let article = inp.closest('article');
            let id = article.dataset.id;
            let color = article.dataset.color;
            let newCart = [];

            cart.forEach(function (item) {
                if (item.itemColor == color && item.itemID == id) {
                    item.itemQuantity = parseInt(inp.value);
                }
                newCart.push(item);
            });
            localStorage.setItem('products', JSON.stringify(newCart));

            total();
        });
    })
}

function checkForm() { // vérifie que les champs du formulaire sont corrects avant de les envoyer au serveur
    let firstNameInp = document.getElementById('firstName');
    let lastNameInp = document.getElementById('lastName');
    let addressInp = document.getElementById('address');
    let cityInp = document.getElementById('city');
    let emailInp = document.getElementById('email');

    let nameRGEX = /^([a-zA-Z\s]{1,})$/;
    let addressRGEX = /^(\d{1,5}) ([a-zA-Z\s]{1,})$/;
    let emailRGEX = /^[a-zA-Z0–9+_.-]+@[a-zA-Z0–9.-]+$/;

    firstNameInp.addEventListener('change', function () {
        let firstNameErr = document.getElementById('firstNameErrorMsg');
        let firstName = document.getElementById('firstName').value;
        let firstNameResult = nameRGEX.test(firstName);
        if (firstNameResult == false) {
            firstNameErr.innerText = 'Veuillez entrer un prénom valide';
            return false;
        } else {
            firstNameErr.innerText = '';
        }
    });

    lastNameInp.addEventListener('change', function () {
        let lastNameErr = document.getElementById('lastNameErrorMsg');
        let lastName = document.getElementById('lastName').value;
        let lastNameResult = nameRGEX.test(lastName);
        if (lastNameResult == false) {
            lastNameErr.innerText = 'Veuillez entrer un nom valide';
            return false;
        } else {
            lastNameErr.innerText = '';
        }
    });

    addressInp.addEventListener('change', function () {
        let addressErr = document.getElementById('addressErrorMsg');
        let address = document.getElementById('address').value;
        let addressResult = addressRGEX.test(address);
        if (addressResult == false) {
            addressErr.innerText = 'Veuillez entrer une adresse valide';
            return false;
        } else {
            addressErr.innerText = '';
        }
    });

    cityInp.addEventListener('change', function () {
        let cityErr = document.getElementById('cityErrorMsg');
        let city = document.getElementById('city').value;
        let cityResult = nameRGEX.test(city);
        if (cityResult == false) {
            cityErr.innerText = 'Veuillez entrer une ville valide';
            return false;
        } else {
            cityErr.innerText = '';
        }
    });

    emailInp.addEventListener('change', function () {
        let emailErr = document.getElementById('emailErrorMsg');
        let email = document.getElementById('email').value;
        let emailResult = emailRGEX.test(email);
        if (emailResult == false) {
            emailErr.innerText = 'Veuillez entrer un email valide';
            return false;
        } else {
            emailErr.innerText = '';
        }
    });
}

function submit() { // ajoute un évènement cliquable sur le bouton 'Commander !'
    let orderBtn = document.getElementById('order');
    orderBtn.addEventListener('click', function () { // envoie au serveur l'objet contact et l'array of strings produits afin d'obtenir un numéro de commande en réponse
        let firstNameErr = document.getElementById('firstNameErrorMsg').innerText;
        let lastNameErr = document.getElementById('lastNameErrorMsg').innerText;
        let addressErr = document.getElementById('addressErrorMsg').innerText;
        let cityErr = document.getElementById('cityErrorMsg').innerText;
        let emailErr = document.getElementById('emailErrorMsg').innerText;

        console.log(firstNameErr == '' && lastNameErr == '');

        if (firstNameErr == '' && lastNameErr == '' && addressErr == '' && cityErr == '' && emailErr == '') {
            let contact = {
                firstName: firstName,
                lastName: lastName,
                address: address,
                city: city,
                email: email
            };

            let finalProducts = JSON.parse(localStorage.getItem('products'));
            let productsID = [];

            for (i = 0; i < finalProducts.length; i++) {
                productsID[i] = finalProducts[i].itemID;
            }

            let POSTparams = {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contact: contact,
                    products: productsID
                })
            }

            if (typeof contact == 'object' && typeof productsID == 'object') {
                fetch('http://localhost:3000/api/products/order', POSTparams)
                    .then(response => {
                        if (response.ok) {
                            return response.json();
                        } else {
                            throw new Error("NETWORK RESPONSE ERROR");
                        }
                    })
                    .then(value => {
                        confirmOrder(value);
                        localStorage.clear();
                    })
                    .catch(function (err) {
                        console.log(err);
                    });
            }
        } else {
            alert('Veuillez vérifier vos coordonnées');
        }
    });
}

confirmOrder = result => { // redirige vers la page de confirmation une fois la commande passée
    console.log(result.orderId)
    window.location.href = 'confirmation.html?id=' + result.orderId;
}

checkForm();
submit();