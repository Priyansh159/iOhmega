let iconCart = document.querySelector('.icon-cart');
let closeCart = document.querySelector('.close');
let body = document.querySelector('body');
let listProductHTML = document.querySelector(".listProduct");
let listCartHTML = document.querySelector('.listCart');
let iconCartSpan = document.querySelector('.icon-cart span')

let listProducts = []
let carts = [];

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

const addCartToHTML = ()=>{
    listCartHTML.innerHTML = '';
    let totalQuantity = 0;
    if(carts.length > 0){
        carts.forEach(cart =>{
            totalQuantity += cart.quantity;
            let newCart = document.createElement('div');
            newCart.classList.add('items');
            newCart.dataset.id = cart.product_id;
            let positionProduct = listProducts.findIndex((value) => value.id == cart.product_id )
            let info = listProducts[positionProduct];

        
            // newCart.dataset.id = cart.product_id;

            newCart.innerHTML=`
            <div class="image">
                    <img src = "${info.image}">
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
        })
    }
    iconCartSpan.innerText = totalQuantity;
}

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
const changeQuantity = (product_id, type) =>{
    let positionItemCart = carts.findIndex((value) => value.product_id == product_id)
    if(positionItemCart >= 0){
        switch(type){
            case 'plus':
                carts[positionItemCart].quantity = carts[positionItemCart].quantity + 1;
                break;
            case 'minus':
                let valueChange = carts[positionItemCart].quantity - 1;
                if (valueChange > 0){
                    carts[positionItemCart].quantity = carts[positionItemCart].quantity - 1;
                }else{
                    carts.splice(positionItemCart, 1);
                }
                break;
        }
    }
    addCartToHTML();
}

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