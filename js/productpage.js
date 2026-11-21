document.addEventListener("DOMContentLoaded", () => {
  const imagePaths = [
    "images/dont-be-late-front.png",
    "images/dont-be-late-back.png",
    "images/dont-be-late-side.png"
  ];
  const mainImage = document.getElementById("mainProductImage");
  const thumbnails = [...document.querySelectorAll(".thumbnail")];
  const dots = [...document.querySelectorAll(".gallery-dot")];
  const zoomedImage = document.getElementById("zoomedProductImage");
  let activeImageIndex = 0;

  function showImage(index) {
    activeImageIndex = (index + imagePaths.length) % imagePaths.length;
    const image = imagePaths[activeImageIndex];
    mainImage.src = image;
    zoomedImage.src = image;
    const descriptions = [
      "Don't Be Late Tee in charcoal gray, front view",
      "Don't Be Late Tee, alternate view",
      "Don't Be Late Tee, side view"
    ];
    mainImage.alt = descriptions[activeImageIndex];
    thumbnails.forEach((button, i) => {
      const active = i === activeImageIndex;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    dots.forEach((button, i) => {
      const active = i === activeImageIndex;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
  }
  thumbnails.forEach((button, index) => button.addEventListener("click", () => showImage(index)));
  dots.forEach((button, index) => button.addEventListener("click", () => showImage(index)));

  const galleryImageArea = document.querySelector(".main-image-wrap");
  let swipeStartX = null;
  galleryImageArea.addEventListener("pointerdown", event => {
    swipeStartX = event.clientX;
  });
  galleryImageArea.addEventListener("pointerup", event => {
    if (swipeStartX === null) return;
    const distance = event.clientX - swipeStartX;
    if (Math.abs(distance) > 45) showImage(activeImageIndex + (distance < 0 ? 1 : -1));
    swipeStartX = null;
  });
  galleryImageArea.addEventListener("pointercancel", () => { swipeStartX = null; });

  const zoomModal = new bootstrap.Modal(document.getElementById("imageModal"));
  document.getElementById("zoomButton").addEventListener("click", () => {
    zoomedImage.src = mainImage.src;
    zoomModal.show();
  });

  document.querySelectorAll(".color-swatch").forEach(button => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".color-swatch").forEach(swatch => {
        swatch.classList.remove("selected");
        swatch.setAttribute("aria-pressed", "false");
      });
      button.classList.add("selected");
      button.setAttribute("aria-pressed", "true");
      document.getElementById("selectedColorName").textContent = button.dataset.color;
    });
  });
  document.querySelectorAll(".size-button").forEach(button => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".size-button").forEach(size => {
        size.classList.remove("selected");
        size.setAttribute("aria-pressed", "false");
      });
      button.classList.add("selected");
      button.setAttribute("aria-pressed", "true");
      document.getElementById("selectedSizeName").textContent = button.dataset.size;
    });
  });

  let quantity = 1;
  const quantityOutput = document.getElementById("quantity");
  function updateQuantity() { quantityOutput.textContent = quantity; }
  document.getElementById("decreaseQty").addEventListener("click", () => {
    quantity = Math.max(1, quantity - 1);
    updateQuantity();
  });
  document.getElementById("increaseQty").addEventListener("click", () => {
    quantity = Math.min(50, quantity + 1);
    updateQuantity();
  });

  const CART_STORAGE_KEY = "comfteeCartItems";
  const cartCountElement = document.getElementById("cartCount");
  const feedback = document.getElementById("cartFeedback");
  function readCartItems() {
    try {
      const savedItems = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || "[]");
      return Array.isArray(savedItems) ? savedItems : [];
    } catch (error) {
      return [];
    }
  }
  function saveCartItems(items) {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
    }
  }
  function updateCartCount() {
    const totalItems = readCartItems().reduce((total, item) => total + (Number(item.quantity) || 0), 0);
    cartCountElement.textContent = totalItems;
  }
  updateCartCount();

  document.getElementById("addToCart").addEventListener("click", () => {
    const size = document.getElementById("selectedSizeName").textContent;
    const color = document.getElementById("selectedColorName").textContent;
    const productName = document.getElementById("productTitle").textContent;
    const productKey = new URLSearchParams(window.location.search).get("product") || "dont-be-late-tee";
    const cartItems = readCartItems();
    const existingItem = cartItems.find(item =>
      item.productKey === productKey && item.size === size && item.color === color
    );

    if (existingItem) {
      existingItem.quantity = (Number(existingItem.quantity) || 0) + quantity;
    } else {
      cartItems.push({ productKey, productName, size, color, quantity });
    }

    saveCartItems(cartItems);
    updateCartCount();
    feedback.textContent = `${quantity} × ${productName} (${color}, ${size}) added to cart.`;
  });

  const orderLink = document.getElementById("orderNow");
  function updateOrderLink() {
    const size = document.getElementById("selectedSizeName").textContent;
    const color = document.getElementById("selectedColorName").textContent;
    const productName = document.getElementById("productTitle").textContent;
    const subject = encodeURIComponent(`COMFTEE Order - ${productName}`);
    const body = encodeURIComponent(
      `Hello COMFTEE! I would like to order:\n\nProduct: ${productName}\nColor: ${color}\nSize: ${size}\nQuantity: ${quantity}\nUnit Price: ₱499\nTotal: ₱${499 * quantity}\n\nThank you!`
    );
    orderLink.href = `mailto:orders@comftee142.com?subject=${subject}&body=${body}`;
  }
  orderLink.addEventListener("click", updateOrderLink);
  document.querySelectorAll(".size-button, .color-swatch, #increaseQty, #decreaseQty").forEach(el => {
    el.addEventListener("click", updateOrderLink);
  });

  const favoriteButton = document.getElementById("favoriteButton");
  favoriteButton.addEventListener("click", () => {
    const isFavorite = favoriteButton.getAttribute("aria-pressed") === "true";
    favoriteButton.setAttribute("aria-pressed", String(!isFavorite));
    favoriteButton.setAttribute("aria-label", isFavorite ? "Add to favorites" : "Remove from favorites");
  });

  const detailsTab = document.getElementById("detailsTab");
  const reviewsTab = document.getElementById("reviewsTab");
  const detailsPanel = document.getElementById("detailsPanel");
  const reviewsPanel = document.getElementById("reviewsPanel");
  function activateTab(showReviews) {
    detailsTab.classList.toggle("active", !showReviews);
    reviewsTab.classList.toggle("active", showReviews);
    detailsTab.setAttribute("aria-selected", String(!showReviews));
    reviewsTab.setAttribute("aria-selected", String(showReviews));
    detailsPanel.hidden = showReviews;
    reviewsPanel.hidden = !showReviews;
  }
  detailsTab.addEventListener("click", () => activateTab(false));
  reviewsTab.addEventListener("click", () => activateTab(true));

  document.getElementById("shopNavLink")?.addEventListener("click", () => activateTab(false));

  const reviewSlider = document.getElementById("reviewSlider");
  if (reviewSlider) {
    [...reviewSlider.children].forEach(card => reviewSlider.appendChild(card.cloneNode(true)));
    const slide = direction => {
      const card = reviewSlider.querySelector(".review-card");
      if (!card) return;
      const gap = parseFloat(getComputedStyle(reviewSlider).gap) || 0;
      reviewSlider.scrollBy({left: direction * (card.getBoundingClientRect().width + gap), behavior:"smooth"});
    };
    document.querySelector(".review-prev").addEventListener("click", () => slide(-1));
    document.querySelector(".review-next").addEventListener("click", () => slide(1));
  }

  const productCatalog = {
    "dont-be-late-tee": {
      name: "Don’t Be Late Tee",
      image: "images/dont-be-late-front.png",
      rating: "4.5",
      reviews: "1k+ Reviews"
    },
    "everyday-comfort-tee": {
      name: "Everyday Comfort Tee",
      image: "images/everyday-comfort-tee.png",
      rating: "4.5",
      reviews: "1k+ Reviews"
    },
    "do-good-work-tee": {
      name: "Do Good Work Tee",
      image: "images/do-good-work-tee.png",
      rating: "4.5",
      reviews: "1k+ Reviews"
    }
  };

  const requestedProductKey = new URLSearchParams(window.location.search).get("product") || "dont-be-late-tee";
  const relatedKey = productCatalog[requestedProductKey] ? requestedProductKey : "dont-be-late-tee";
  const activeProduct = productCatalog[relatedKey];
  const productTitle = document.getElementById("productTitle");
  const breadcrumbProduct = document.getElementById("breadcrumbProduct");
  const ratingLine = document.querySelector(".rating-line");

  productTitle.textContent = activeProduct.name;
  breadcrumbProduct.textContent = activeProduct.name;
  document.title = `${activeProduct.name} | COMFTEE`;
  ratingLine.innerHTML = `<span class="stars" aria-hidden="true">★★★★<span class="half-star">★</span></span><span>${activeProduct.rating} (${activeProduct.reviews})</span>`;

  if (relatedKey !== "dont-be-late-tee") {
    imagePaths.splice(0, imagePaths.length, activeProduct.image);
    thumbnails[0].querySelector("img").src = activeProduct.image;
    thumbnails[0].querySelector("img").alt = activeProduct.name;
    thumbnails[0].dataset.image = activeProduct.image;
    showImage(0);
    thumbnails.slice(1).forEach(button => { button.hidden = true; });
    dots.slice(1).forEach(button => { button.hidden = true; });
    document.getElementById("mainProductImage").alt = activeProduct.name;
  }

  const recommendationCatalog = [
    { key: "dont-be-late-tee", name: "Don’t Be Late Tee", image: "images/dont-be-late-front.png", rating: "4.5" },
    { key: "everyday-comfort-tee", name: "Everyday Comfort Tee", image: "images/everyday-comfort-tee.png", rating: "4.5" },
    { key: "do-good-work-tee", name: "Do Good Work Tee", image: "images/do-good-work-tee.png", rating: "4.5" }
  ];
  const recommendationGrid = document.getElementById("recommendationGrid");
  recommendationGrid.innerHTML = recommendationCatalog
    .filter(product => product.key !== relatedKey)
    .map(product => `
      <a class="recommendation-card" data-product="${product.key}" href="productpage.html?product=${product.key}#productTop">
        <div class="recommendation-image">
          <span class="recommendation-discount">16% OFF</span>
          <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="recommendation-meta">
          <h3>${product.name}</h3>
          <span class="recommendation-rating">★ ${product.rating}</span>
        </div>
        <p>₱499 <del>₱599</del></p>
      </a>
    `).join("");


});