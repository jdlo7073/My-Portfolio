const yearElement = document.querySelector("#current-year");
const cartDrawer = document.querySelector("#cart-drawer");
const cartTrigger = document.querySelector(".cart-trigger");
const cartClose = document.querySelector(".close-cart");
const cartBackdrop = document.querySelector(".drawer-backdrop");
const cartItemsElement = document.querySelector(".cart-items");
const cartEmptyMessage = document.querySelector(".cart-empty");
const cartSummary = document.querySelector(".cart-summary");
const cartCounts = document.querySelectorAll(".cart-count, .drawer-count");
const cartSubtotal = document.querySelector(".cart-subtotal");
const checkoutLink = document.querySelector(".checkout-link");
const menuToggle = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector("#mobile-menu");
const skillTrack = document.querySelector("#skill-track");
const products = {
  "portfolio-template": { name: "Portfolio Starter", price: 29 },
  "frontend-review": { name: "Frontend Review", price: 99 },
};
const cart = new Map();

if (yearElement) {
  yearElement.textContent = String(new Date().getFullYear());
}

function renderCart() {
  const entries = [...cart.entries()];
  const itemCount = entries.reduce((sum, [, quantity]) => sum + quantity, 0);
  const subtotal = entries.reduce(
    (sum, [id, quantity]) => sum + products[id].price * quantity,
    0,
  );

  cartCounts.forEach((element) => {
    element.textContent =
      element.classList.contains("drawer-count")
        ? `(${itemCount})`
        : String(itemCount);
  });
  cartItemsElement.replaceChildren();

  entries.forEach(([id, quantity]) => {
    const product = products[id];
    const item = document.createElement("article");
    item.className = "cart-item";

    const name = document.createElement("strong");
    name.textContent = product.name;
    const price = document.createElement("span");
    price.textContent = `$${product.price} × ${quantity}`;
    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.textContent = "Remove";
    removeButton.setAttribute("aria-label", `Remove ${product.name} from cart`);
    removeButton.addEventListener("click", () => {
      cart.delete(id);
      renderCart();
    });

    item.append(name, price, removeButton);
    cartItemsElement.append(item);
  });

  cartEmptyMessage.hidden = itemCount > 0;
  cartSummary.hidden = itemCount === 0;
  cartSubtotal.textContent = `$${subtotal}`;

  const inquiry = entries
    .map(([id, quantity]) => `${products[id].name} × ${quantity}`)
    .join("\n");
  checkoutLink.href = `mailto:hello@jawadahmad.dev?subject=${encodeURIComponent("Digital product inquiry")}&body=${encodeURIComponent(`Hi Jawad,\n\nI'm interested in:\n${inquiry}\n\nPlease share the next steps.`)}`;

  document.querySelectorAll(".add-to-cart").forEach((button) => {
    const isAdded = cart.has(button.dataset.product);
    button.classList.toggle("added", isAdded);
    button.setAttribute("aria-pressed", String(isAdded));
    button.lastElementChild.textContent = isAdded ? "✓" : "+";
  });
}

function setCartOpen(isOpen) {
  cartDrawer.classList.toggle("is-open", isOpen);
  cartDrawer.setAttribute("aria-hidden", String(!isOpen));
  cartTrigger.setAttribute("aria-expanded", String(isOpen));
  cartBackdrop.hidden = !isOpen;
  document.body.classList.toggle("drawer-open", isOpen);

  if (isOpen) {
    cartClose.focus();
  } else {
    cartTrigger.focus();
  }
}

cartTrigger.addEventListener("click", () => {
  setCartOpen(true);
});

cartClose.addEventListener("click", () => {
  setCartOpen(false);
});

cartBackdrop.addEventListener("click", () => {
  setCartOpen(false);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && cartDrawer.classList.contains("is-open")) {
    setCartOpen(false);
  }

  if (event.key === "Escape" && !mobileMenu.hidden) {
    mobileMenu.hidden = true;
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
  }

  if (event.key === "Tab" && cartDrawer.classList.contains("is-open")) {
    const focusableElements = cartDrawer.querySelectorAll(
      'a[href], button:not([disabled])',
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  }
});

document.querySelectorAll(".add-to-cart").forEach((button) => {
  button.setAttribute("aria-pressed", "false");
  button.addEventListener("click", () => {
    const id = button.dataset.product;
    cart.set(id, (cart.get(id) ?? 0) + 1);
    renderCart();
  });
});

menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") !== "true";
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute(
    "aria-label",
    isOpen ? "Close navigation menu" : "Open navigation menu",
  );
  mobileMenu.hidden = !isOpen;
});

mobileMenu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    mobileMenu.hidden = true;
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
  });
});

document.querySelectorAll(".carousel-button").forEach((button) => {
  button.addEventListener("click", () => {
    const firstCard = skillTrack.querySelector(".skill-card");
    const gap = Number.parseFloat(getComputedStyle(skillTrack).columnGap) || 0;
    const distance = firstCard.getBoundingClientRect().width + gap;
    skillTrack.scrollBy({
      left: distance * Number(button.dataset.direction),
      behavior: "smooth",
    });
  });
});

renderCart();
