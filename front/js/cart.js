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
    console.log('afficherpanier()')
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
            addClickEvent();
            addChangeEvent();
            total();
        })
}


displayCartItems = canapes => {
    let cartItemsDiv = document.getElementById('cart__items');
    // cartItemsDiv.innerText = '';

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

function total() {
    let items = document.getElementsByTagName('article');
    let itemsNumber = items.length;

    let prix = document.getElementsByClassName('price');
    let qty = document.getElementsByClassName('itemQuantity');

    let totalPriceDiv = document.getElementById('totalPrice');
    // totalPriceDiv.innerText = '';
    let totalQuantityDiv = document.getElementById('totalQuantity');
    // totalQuantityDiv.innerText = '';

    let totalPrice = 0;
    let totalQty = 0;
    
    for (i = 0; i < itemsNumber; i++) {
        totalQty += parseInt(qty[i].value);
        totalPrice += parseInt(prix[i].innerText) * qty[i].value;
    } 

    totalPriceDiv.innerText = totalPrice;
    totalQuantityDiv.innerText = totalQty;
}

function addClickEvent() {
    let deleteButton = document.querySelectorAll('.deleteItem');
    deleteButton.forEach(function(article){
        article.addEventListener('click', deleteItem);
    })
}

function deleteItem(item) {
    let article = item.srcElement.closest('article');
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
    console.log(JSON.stringify(listeFinaleProduit))
    localStorage.setItem('products', JSON.stringify(listeFinaleProduit));
    article.remove();
    total();
}

function addChangeEvent() {
    let input = document.querySelectorAll('input.itemQuantity');
    input.forEach(function(inp){
        inp.addEventListener('change', function(event){
            let cart = JSON.parse(localStorage.getItem('products'));
            let article = inp.closest('article');
            let id = article.dataset.id;
            let color = article.dataset.color;
            let newCart = [];
            console.log(cart);

            cart.forEach(function(item) {
                if (item.itemColor == color && item.itemID == id) {
                    item.itemQuantity = parseInt(inp.value);
                }
                newCart.push(item);
            });
            console.log(newCart);
            localStorage.setItem('products', JSON.stringify(newCart));
            
            total();
        });
    })
}
