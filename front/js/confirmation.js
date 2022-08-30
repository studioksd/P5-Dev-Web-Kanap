var str = window.location.href;
var url = new URL(str);
var id = url.searchParams.get("id");

function displayOrderId() {
    let orderId = document.getElementById('orderId');
    orderId.innerText = id;
}

displayOrderId();