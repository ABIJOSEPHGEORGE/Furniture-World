let cart_count = document.getElementById("cart-count");

let cart_icon = document.getElementById("cart-icon");

//wishlist
let wishlistIcon = document.getElementById("wishlist-icon");

window.onload = cartCount();

//fetching  cart count

function cartCount() {
  fetch("https://www.furnitureworld.site/users/cart-count")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      JSON.stringify(data) === "{}"
        ? (cart_count.innerHTML = 0)
        : (cart_count.innerHTML = data);
    });
}

// Handling the Confirm form resubmission
if ( window.history.replaceState ) {
  window.history.replaceState( null, null, window.location.href );
} 