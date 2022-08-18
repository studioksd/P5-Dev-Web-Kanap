function getProducts() {
    fetch("http://localhost:3000/api/products")
    .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("NETWORK RESPONSE ERROR");
        }
      })
      .then(canapes => {
        console.log(canapes);
        displayItems(canapes)
      })
    }

displayItems = canapes => {
    const itemsDiv = document.querySelector('#items')
    canapes.forEach(canapes => {
        const itemElement = document.createElement('a');
        itemElement.setAttribute('href', '../html/product.html?id=' + canapes._id);
        const itemArticle = itemElement.appendChild(document.createElement('article'));
        const itemHeading = itemArticle.appendChild(document.createElement('h3'));
        itemHeading.innerHTML = canapes.name;
        const itemImg = itemArticle.appendChild(document.createElement('img'));
        itemImg.setAttribute('src', canapes.imageUrl);
        itemImg.setAttribute('alt', canapes.altTxt);
        const itemDesc = itemArticle.appendChild(document.createElement('p'));
        itemDesc.innerHTML = canapes.description;
        itemsDiv.append(itemElement);
    });
}

getProducts();