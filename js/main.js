// WISHLIST FUNCTION
function toggleWishlist(button) {
    button.classList.toggle('active');

    const icon = button.querySelector('i');

    if (button.classList.contains('active')) {
        icon.classList.remove('bi-heart');
        icon.classList.add('bi-heart-fill');
    } else {
        icon.classList.remove('bi-heart-fill');
        icon.classList.add('bi-heart');
    }
}

function addToCart(productKey, productName) {
    const storageKey = "comfteeCartItems";
    let cartItems = [];

    try {
        const savedItems = JSON.parse(localStorage.getItem(storageKey) || "[]");
        cartItems = Array.isArray(savedItems) ? savedItems : [];
    } catch (error) {
        cartItems = [];
    }

    const size = "M";
    const color = "Gray";
    const existingItem = cartItems.find(item =>
        item.productKey === productKey &&
        item.size === size &&
        item.color === color
    );

    if (existingItem) {
        existingItem.quantity = (Number(existingItem.quantity) || 0) + 1;
    } else {
        cartItems.push({
            productKey,
            productName,
            size,
            color,
            quantity: 1
        });
    }

    try {
        localStorage.setItem(storageKey, JSON.stringify(cartItems));
    } catch (error) {
        alert("Your item could not be added to the cart. Please try again.");
        return;
    }

    const cartCount = document.getElementById("cartCount");
    if (cartCount) {
        cartCount.textContent = cartItems.reduce(
            (total, item) => total + (Number(item.quantity) || 0), 0
        );
    }
}
