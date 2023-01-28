
let cart_count = document.getElementById('cart-count');
let decrementBtn = document.getElementById('decrement');
let incrementBtn = document.getElementById('increment');
let qtyBtn = document.getElementById('input-number');
let cart_icon = document.getElementById('cart-icon');
let modalBox = document.querySelector('.modal');
let closeBtn = document.getElementById('close-btn');
let proceedBtn = document.getElementById('proceed-btn');
let closeIcon = document.getElementById('close-icon');


//wishlist
let wishlistIcon = document.getElementById('wishlist-icon');


window.onload = cartCount();


//fetching  cart count

function cartCount(){
    fetch('http://localhost:3000/users/cart-count')
    .then((response)=>{
        return response.json()
    })
    .then((data)=>{
        console.log(data)
        JSON.stringify(data) === "{}" ? cart_count.innerHTML=0 : cart_count.innerHTML= data;
    });
}


//confirm popup

function confirmDelete(prodId){
    modalBox.classList.add('d-block');
    closeBtn.addEventListener('click',closeModal);
    closeIcon.addEventListener('click',closeModal);
    proceedBtn.innerHTML = `<a href="/users/remove-item/${prodId}?_method=DELETE" class="text-white" id="proceed-anchor">Delete</a>`
}




function closeModal(){
    modalBox.classList.remove('d-block');
}


//disabling decrement and increment btn on limit

if(qtyBtn.value==1){
    decrementBtn.href = "#products"
    
}


//wishlist icon setup

function addToWishlist(prodId){
     fetch(`http://localhost:3000/users/add-to-wishlist/${prodId}`,
     {
        method:"get"
     })
     .then((response)=>{
        return response.json()
     })
     .then((response)=>{
        if(response==true){
            wishlistIcon.innerHTML = `<i class="ti-heart text-danger" onclick="removeWishlist('<%-product._id%>')">`
        }
     })
}
// href="/users/remove-wishlist-item/<%-product._id%>?_method=PUT"
// href="/users/add-to-wishlist/<%-product._id%>"