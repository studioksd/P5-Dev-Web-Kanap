var str = window.location.href;
var url = new URL(str);
var id = url.searchParams.get("id");

function displayOrderId() { // affiche le numéro de commande sur la page
    let orderId = document.getElementById('orderId');
    orderId.innerText = id;
}

displayOrderId();