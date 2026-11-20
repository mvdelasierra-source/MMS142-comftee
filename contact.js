
const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');

if (menuToggle && mainNav) {
  menuToggle.addEventListener('click', function () {
    const isOpen = mainNav.classList.toggle('open');

    menuToggle.setAttribute('aria-expanded', isOpen);

    menuToggle.innerHTML = isOpen
      ? '<i class="bi bi-x-lg"></i>'
      : '<i class="bi bi-list"></i>';
  });
}
