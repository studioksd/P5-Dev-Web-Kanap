// var objNames = []
// for (i = 0; i < localStorage.length; i++) {
// objNames[i] = "item" + i;
// }
    
// for (i in objNames) {
// var cartObj = localStorage.getItem(objNames[i]);
// var cartObjJSON = JSON.parse(cartObj);
// console.log(objNames[i])

afficherPanier();

function afficherPanier() {
    let tableauProduit = JSON.parse(localStorage.getItem('products'));
    if (!tableauProduit || tableauProduit == '') {
    tableauProduit = [];
    }
    tableauProduit.forEach(function(produit){
    getProduct(produit);
    });
}

function getProduct(cartObjJSON) {
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
            addEvent();
        })
}

displayCartItems = canapes => {
    let cartItemsDiv = document.getElementById('cart__items');

    const cartItem = cartItemsDiv.appendChild(document.createElement('article'));
    cartItem.setAttribute('class', 'cart__item')
    cartItem.setAttribute('data-id', canapes.itemID)
    cartItem.setAttribute('data-color', canapes.itemColor)
    console.log(cartItem)

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
    cartItemName.innerHTML = canapes.name;

    const cartItemColor = cartItemDesc.appendChild(document.createElement('p'));
    cartItemColor.innerHTML = canapes.itemColor;

    const cartItemPrice = cartItemDesc.appendChild(document.createElement('p'));
    cartItemPrice.innerHTML = canapes.price;

    const cartItemSettings = cartItemContent.appendChild(document.createElement('div'))
    cartItemSettings.setAttribute('class', 'cart__item__content__settings');
    
    const cartItemQty = cartItemSettings.appendChild(document.createElement('div'));
    cartItemQty.setAttribute('class', 'cart__item__content__settings__quantity');
    cartItemQty.innerHTML = '<p>Qté : </p>'
    const cartItemQtyInput = cartItemQty.appendChild(document.createElement('input'));
    cartItemQtyInput.setAttribute('type', 'number');
    cartItemQtyInput.setAttribute('class','itemQuantity');
    cartItemQtyInput.setAttribute('name', 'itemQuantity');
    cartItemQtyInput.setAttribute('min','1');
    cartItemQtyInput.setAttribute('max','100');
    cartItemQtyInput.setAttribute('value', canapes.itemQuantity);

    const cartItemDelete = cartItemSettings.appendChild(document.createElement('div'));
    cartItemDelete.setAttribute('class', 'cart__item__content__settings__delete');
    let balisep = document.createElement('p');
    balisep.classList.add('deleteItem');
    balisep.innerText = 'Supprimer';
    cartItemDelete.appendChild(balisep);
}

function deleteItem(element) {
    let article = element.closest('article');
    let id = article.dataset.id;
    let color = article.dataset.color;
    let listeFinaleProduit = [];
    
    let cart = JSON.parse(localStorage.getItem('products'));
      if (!cart || cart == '') {
        cart = [];
      }
    cart.forEach(function(product){
        if (!(product.itemID == id && product.itemColor == color)) {
            listeFinaleProduit.push(product);
        }
    })
    localStorage.setItem('products', JSON.stringify(listeFinaleProduit));
    article.remove();
}

function addEvent() {
    let deleteButton = document.querySelectorAll('.deleteItem');
    deleteButton.forEach(function(btn){
        btn.addEventListener('click', deleteItem(btn));
    })
}

