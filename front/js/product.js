var str = window.location.href;
var url = new URL(str);
var id = url.searchParams.get("id");
console.log(id);

function getProduct() {
    fetch("http://localhost:3000/api/products")
    .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("NETWORK RESPONSE ERROR");
        }
      })
      .then(canapes => {
        for (let i = 0; i < canapes.length; i++) {
            if id == canapes._id
            then 
        }
        
        displayItems(canapes)
      })
    }



let itemImg = document.getElementsByClassName('item__img');
