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
        itemElement.innerHTML = '<article><h3>' + canapes.name + '</h3><img src="' + canapes.imageUrl + '" alt="' + canapes.altTxt + '"></br><p>' + canapes.description + '</p></article>';
        itemsDiv.append(itemElement);
    });
}

getProducts();