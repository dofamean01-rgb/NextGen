
const products = [
    {
        id: 1,
        name: "Видеокарта RTX 4070",
        price: 55000,
        img: "images/4070img.webp",
        fullImg: "images/4070fullimg.webp",
        description: "Мощная видеокарта на архитектуре Ada Lovelace. 12 ГБ видеопамяти GDDR6X, поддержка трассировки лучей и DLSS 3. Идеально для игр в 4K."
    },
    {
        id: 2,
        name: "Процессор Intel Core i7 13700K",
        price: 32000,
        img: "images/proc1.jpeg",
        fullImg: "images/proc2.webp",
        description: "16 ядер и 24 потока. Турбо-частота до 5.4 ГГц. Поддержка DDR5 и PCIe 5.0. Отличный выбор для рабочих станций."
    },
    {
        id: 3,
        name: "ОЗУ 32 ГБ DDR5",
        price: 8000,
        img: "images/ozu1.webp",
        fullImg: "images/ozu2.webp",
        description: "Высокоскоростная память DDR5 с частотой 5600 МГц. Низкие тайминги, радиатор для охлаждения. Быстрая работа любых приложений."
    },
    {
        id: 4,
        name: "SSD 1 ТБ NVMe",
        price: 9000,
        img: "images/ssd1.webp",
        fullImg: "images/ssd2.webp",
        description: "Скоростной NVMe накопитель. Чтение до 7000 МБ/с. Загрузка системы за секунды. Формат M.2, 3D NAND память."
    },
    {
        id: 5,
        name: "Блок питания 750W",
        price: 7000,
        img: "images/bp1.webp",
        fullImg: "images/bp2.webp",
        description: "Надёжный блок питания 80 Plus Gold. Полностью модульные кабели, тихий вентилятор. Защита от перегрузок."
    },
    {
        id: 6,
        name: "Материнская плата Z790",
        price: 18000,
        img: "images/mat1.webp",
        fullImg: "images/mat2.webp",
        description: "Флагманская плата на Z790. Поддержка 12/13/14 поколения. Wi-Fi 6E, Bluetooth 5.3, 4 слота M.2."
    }
];

let cart = [];

function displayProducts() {
    const productList = document.getElementById('product-list');
    if (!productList) return; 

    productList.innerHTML = ''; 

    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.setAttribute('data-id', product.id);
        card.innerHTML = `
            <img src="${product.img}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p class="price">${product.price.toLocaleString()} ₽</p>
            <button class="add-to-cart" data-id="${product.id}">Добавить в корзину</button>
        `;
        productList.appendChild(card);
    });

    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', function(event) {
            if (event.target.classList.contains('add-to-cart')) {
                return;
            }
            const productId = parseInt(this.getAttribute('data-id'));
            openModal(productId);
        });
    });

    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function(event) {
            event.stopPropagation(); // Чтобы клик не ушёл на карточку
            const productId = parseInt(this.getAttribute('data-id'));
            addToCartById(productId);
        });
    });
}

function openModal(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    document.getElementById('modal-img').src = product.fullImg;
    document.getElementById('modal-img').alt = product.name;
    document.getElementById('modal-title').textContent = product.name;
    document.getElementById('modal-price').textContent = product.price.toLocaleString() + ' ₽';
    document.getElementById('modal-description').textContent = product.description;
    document.getElementById('modal-add-btn').setAttribute('data-id', product.id);

    document.getElementById('modal-overlay').classList.add('active');
    document.body.style.overflow = 'hidden'; 
}

function closeModal() {
    document.getElementById('modal-overlay').classList.remove('active');
    document.body.style.overflow = ''; 
}

function addToCartById(productId) {
    const productToAdd = products.find(p => p.id === productId);
    if (!productToAdd) return;

    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1; 
    } else {
        cart.push({ ...productToAdd, quantity: 1 });
    }

    saveCart(); 
    showNotification('Добавлено в корзину'); 
}

function displayCart() {
    const cartContainer = document.getElementById('cart-items');
    const totalElement = document.getElementById('total-price');
    const checkoutBtn = document.getElementById('checkout-btn');

    if (!cartContainer) return; 

    cartContainer.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
        cartContainer.innerHTML = '<p style="color: #6e6e73; text-align: center; padding: 40px;">Корзина пуста</p>';
        totalElement.textContent = '0 ₽';
        if (checkoutBtn) checkoutBtn.disabled = true; 
        return;
    }

    if (checkoutBtn) checkoutBtn.disabled = false;

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <span>${item.name}</span>
                <span style="color: #6e6e73;">×${item.quantity}</span>
            </div>
            <div style="display: flex; align-items: center; gap: 20px;">
                <span style="font-weight: 500;">${itemTotal.toLocaleString()} ₽</span>
                <button class="remove-btn" data-index="${index}">Удалить</button>
            </div>
        `;
        cartContainer.appendChild(cartItem);
    });

    totalElement.textContent = total.toLocaleString() + ' ₽';

    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            cart.splice(index, 1); 
            saveCart(); 
            displayCart(); 
        });
    });
}

function clearCart() {
    cart = [];
    saveCart();
    displayCart();
}

function saveCart() {
    localStorage.setItem('nextgenCart', JSON.stringify(cart));
}

function loadCart() {
    const saved = localStorage.getItem('nextgenCart');
    if (saved) {
        cart = JSON.parse(saved);
    }
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 2200);
}

document.addEventListener('DOMContentLoaded', () => {
    loadCart(); 
    displayProducts(); 
    displayCart(); 

    const clearBtn = document.getElementById('clear-cart');
    if (clearBtn) {
        clearBtn.addEventListener('click', clearCart);
    }

    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            const paymentLink = this.getAttribute('data-link');
            if (paymentLink && cart.length > 0) {
                window.location.href = paymentLink;
            }
        });
    }

    const closeBtn = document.getElementById('modal-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    const overlay = document.getElementById('modal-overlay');
    if (overlay) {
        overlay.addEventListener('click', function(event) {
            if (event.target === overlay) {
                closeModal();
            }
        });
    }

    const modalAddBtn = document.getElementById('modal-add-btn');
    if (modalAddBtn) {
        modalAddBtn.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            addToCartById(productId);
            closeModal();
        });
    }

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeModal();
        }
    });
});