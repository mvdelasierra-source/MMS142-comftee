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
