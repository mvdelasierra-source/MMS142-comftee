// COMFTEE PRIVACY POLICY JAVASCRIPT //

// 1. NAVIGATION LINK INTERACTION

const navLinks = document.querySelectorAll(".nav-links a");

navLinks.forEach(function(link) {

    link.addEventListener("click", function() {

        navLinks.forEach(function(item) {
            item.classList.remove("active");
        });

        this.classList.add("active");

    });

});


// 2. BACK TO TOP BUTTON

const backToTop = document.createElement("button");

backToTop.innerHTML = '<i class="bi bi-arrow-up"></i>';

backToTop.setAttribute("aria-label", "Back to top");

backToTop.classList.add("back-to-top");

document.body.appendChild(backToTop);


// 3. SHOW BUTTON WHEN SCROLLING

window.addEventListener("scroll", function() {

    if (window.scrollY > 200) {
        backToTop.classList.add("show");
    } else {
        backToTop.classList.remove("show");
    }

});


// 4. SCROLL TO TOP WHEN CLICKED

backToTop.addEventListener("click", function() {

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

});
