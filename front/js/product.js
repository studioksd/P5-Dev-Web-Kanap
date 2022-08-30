var str = window.location.href;
var url = new URL(str);
var id = url.searchParams.get("id");

function getProduct() { // récupère le produit demandé à l'API
  fetch("http://localhost:3000/api/products/" + id)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("NETWORK RESPONSE ERROR");
      }
    })
    .then(canapes => {
      console.log(canapes)
      displayImg(canapes);
      displayTitle(canapes);
      displayPrice(canapes);
      displayDesc(canapes);
      displayColors(canapes);
    })
}

getProduct();

displayImg = canapes => { // affiche l'image du produit
  let itemImgDiv = document.getElementsByClassName('item__img');
  const itemImg = itemImgDiv[0].appendChild(document.createElement('img'));
  itemImg.setAttribute('src', canapes.imageUrl);
  itemImg.setAttribute('alt', canapes.altTxt);
}

displayTitle = canapes => { // affiche le nom du produit
  let itemTitle = document.getElementById('title');
  itemTitle.innerHTML = canapes.name;
}

displayPrice = canapes => { // affiche le prix du produit
  let itemPrice = document.getElementById('price');
  itemPrice.innerHTML = canapes.price;
}

displayDesc = canapes => { // affiche la description du produit
  let itemDesc = document.getElementById('description');
  itemDesc.innerHTML = canapes.description;
}

displayColors = canapes => { // affiche les options de couleurs du produit
  let itemColorsDiv = document.getElementById('colors');
  for (let i = 0; i < canapes.colors.length; i++) {
    const itemColors = document.createElement('option');
    itemColorsDiv.append(itemColors);
    itemColors.setAttribute('value', canapes.colors[i]);
    itemColors.innerHTML = canapes.colors[i];
  }
}

var objNames = []
for (i = 0; i < 10; i++) {
  objNames[i] = "item" + i;
}

document.getElementById('addToCart').onclick = function () { storeData() };

function storeData() { // stocke l'id ainsi que les options de quantité et de couleur choisies dans le local storage
  let cartObjJSON = {
    itemID: id,
    itemColor: document.getElementById('colors').value,
    itemQuantity: parseInt(document.getElementById('quantity').value)
  }

  let color = document.getElementById('colors').value;
  let qty = document.getElementById('quantity').value;
  if (qty <= 0 || qty > 100) {
    alert('Quantité invalide');
  } else {
    if (color == '') {
      alert('Choisissez une couleur');
    } else {
      let tableauProduit = JSON.parse(localStorage.getItem('products'));
      if (!tableauProduit || tableauProduit == '') {
        tableauProduit = [];
      }
      let tableauFinalProduit = [];
      let produitTrouve = false;
      tableauProduit.forEach(function (produit) {
        if (produit.itemID == cartObjJSON.itemID && produit.itemColor == cartObjJSON.itemColor) {
          produitTrouve = true;
          cartObjJSON.itemQuantity += produit.itemQuantity;
          tableauFinalProduit.push(cartObjJSON);
          console.log(cartObjJSON + 'cartObj')
        } else {
          tableauFinalProduit.push(produit);
          console.log(produit + 'produit')
        }
      });
      if (!produitTrouve) {
        tableauFinalProduit.push(cartObjJSON);
      }
      localStorage.setItem('products', JSON.stringify(tableauFinalProduit));
      if (confirm('Votre produit a été ajouté au panier. Voulez vous continuer vers le panier ?')) {
        window.location.href = 'cart.html';
      } else {
        window.location.href = 'index.html';
      }
    }
  }
}
