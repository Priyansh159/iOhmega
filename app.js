let iconCart = document.querySelector('.icon-cart');
let closeCart = document.querySelector('.close');
let body = document.querySelector('body');
let listProductHTML = document.querySelector(".listProduct");
let listCartHTML = document.querySelector('.listCart');
let iconCartSpan = document.querySelector('.icon-cart span')

let totalAmt = document.querySelector('#totalAmount')
let advAddToCartButton = document.querySelector(".advertisement .addToCart");

let listProducts = []
let carts = [];
let totalSum = 0;

iconCart.addEventListener('click', ()=>{
    body.classList.toggle('showCart')
})

closeCart.addEventListener('click', ()=>{
    body.classList.toggle('showCart')
})

const addDataToHTML=()=>{
    listProductHTML.innerHTML = '';
    if(listProducts.length > 0){
        listProducts.forEach(product => {
            let newProduct = document.createElement('div');
            newProduct.classList.add('item');
            newProduct.dataset.id = product.id;

            newProduct.innerHTML=`
                <img class="item-img" src="${product.image}">
                <h2>${product.name}</h2>
                <h2>₹${product.price}</h2>
                <button class="addToCart">Add to Cart</button>
                `;
                listProductHTML.appendChild(newProduct)
        })
    }
}

listProductHTML.addEventListener('click',(event)=>{
    let positionClick = event.target;
    if(positionClick.classList.contains('addToCart')){
        let product_id = positionClick.parentElement.dataset.id;
        addToCart(product_id);
    }
})

const addToCart = (product_id) =>{
    let positionThisProductInCart = carts.findIndex((value) => value.product_id == product_id);

    if(carts.length <= 0){
        carts = [{
            product_id: product_id,
            quantity: 1
        }]
    }else if(positionThisProductInCart < 0){
        carts.push({
            product_id:product_id,
            quantity:1
        })
    }else{
        carts[positionThisProductInCart].quantity += 1;
    }
    addCartToHTML();
}

const addCartToHTML = () => {
    listCartHTML.innerHTML = '';
    let totalQuantity = 0;
    let totalSum = 0; // Reset totalSum before recalculating

    if (carts.length > 0) {
        carts.forEach(cart => {
            let positionProduct = listProducts.findIndex(value => value.id == cart.product_id);
            let info = listProducts[positionProduct];

            totalQuantity += cart.quantity;
            totalSum += info.price * cart.quantity; // Correctly sum the total price

            let newCart = document.createElement('div');
            newCart.classList.add('items');
            newCart.dataset.id = cart.product_id;

            newCart.innerHTML = `
                <div class="image">
                    <img src="${info.image}">
                </div>
                <div class="name">
                    ${info.name}
                </div>
                <div class="totalPrice">
                    ₹${info.price * cart.quantity}
                </div>
                <div class="quantity">
                    <span class="minus"> - </span>
                    <span>${cart.quantity}</span>
                    <span class="plus"> + </span>
                </div>
            `;
            listCartHTML.appendChild(newCart);
        });
    }

    iconCartSpan.innerText = totalQuantity;
    totalAmt.innerText = `Total : ₹${totalSum}`; // Update the total price in real-time
};


document.addEventListener("DOMContentLoaded", () => {
    let bigImages = ["./assets/1.png", "./assets/4.png", "./assets/5.png"];
    let smallImages = ["./assets/3.png", "./assets/6.png", "./assets/7.png"];   //
    
    let bigImgElement = document.getElementById("big-img");
    let smallImgElement = document.getElementById("small-img");

    let index = 0;

    setInterval(() => {
        index = (index + 1) % bigImages.length; // Loop back
        bigImgElement.src = bigImages[index];
        smallImgElement.src = smallImages[index];
    }, 6000); // 3 seconds interval
});



listCartHTML.addEventListener('click', (event)=>{
    let positionClick = event.target;
    if(positionClick.classList.contains('minus') || positionClick.classList.contains('plus')){
        let product_id = positionClick.parentElement.parentElement.dataset.id;
        let type = 'minus';
        if(positionClick.classList.contains('plus')){
            type='plus';
        }
        changeQuantity(product_id, type);
    }
})
const changeQuantity = (product_id, type) => {
    let positionItemCart = carts.findIndex(value => value.product_id == product_id);

    if (positionItemCart >= 0) {
        if (type === 'plus') {
            carts[positionItemCart].quantity += 1;
        } else if (type === 'minus') {
            carts[positionItemCart].quantity -= 1;
            if (carts[positionItemCart].quantity <= 0) {
                carts.splice(positionItemCart, 1); // Remove the item if quantity is 0
            }
        }
    }

    addCartToHTML(); // Update totalSum after changing quantity
};

const initApp = () =>{
    //data from json
    fetch('products.json')
    .then(response => response.json())
    .then(data =>{
        listProducts = data;
        addDataToHTML();
    })
}
initApp();



// Advertisement add to cart button
advAddToCartButton.addEventListener("click", () => {
    // Ensure products are loaded first
    if (listProducts.length > 0) {
        let firstProduct = listProducts[0]; // Get the first product (iPhone 16 Pro Max)
        addToCart(firstProduct.id); // Add it to the cart
    }
});

//to clear every thing from the cart
document.querySelector('.clear').addEventListener('click', () => {
    carts = []; // Empty the cart array
    iconCartSpan.innerText = 0; // Reset cart count
    totalAmt.innerText = "Total : ₹0.00"; // Reset total amount
    listCartHTML.innerHTML = ''; // Clear the cart display
});
