let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentCarouselIndex = 0;

// Sample products data
const products = [
    {
        id: 1,
        name: "Silk Blush Dress",
        price: 89.99,
        image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=500&fit=crop",
        category: "dresses"
    },
    {
        id: 2,
        name: "Lavender Cashmere Sweater",
        price: 125.00,
        image: "https://images.unsplash.com/photo-1564859228273-274232fdb516?w=400&h=500&fit=crop",
        category: "tops"
    },
    {
        id: 4,
        name: "Rose Gold Midi Skirt",
        price: 75.00,
        image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=500&fit=crop",
        category: "bottoms"
    },
    {
        id: 5,
        name: "Vintage Pearl Necklace",
        price: 45.99,
        image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=400&h=500&fit=crop",
        category: "accessories"
    },
    {
        id: 6,
        name: "Floral Wrap Dress",
        price: 110.00,
        image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&h=500&fit=crop",
        category: "dresses"
    },
    {
        id: 7,
        name: "Satin Hair Ribbon Set",
        price: 25.99,
        image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=500&fit=crop",
        category: "accessories"
    },
    {
        id: 8,
        name: "Cream Linen Pants",
        price: 85.00,
        image: "https://images.unsplash.com/photo-1524863479829-916d8e77f114?w=400&h=500&fit=crop",
        category: "bottoms"
    }
];

// Initialize the website
document.addEventListener('DOMContentLoaded', function() {
    console.log('Website initialized');
    
    // Load products
    loadProducts();
    
    // Update cart count
    updateCartCount();
    
    // Initialize mobile menu
    initializeMobileMenu();

    initializeCountdown();
    
    // Initialize file upload
    initializeFileUpload();
    
    // Initialize newsletter form
    initializeNewsletterForm();
    
    // Initialize scroll animations
    initializeScrollAnimations();
    
    // Initialize smooth scrolling
    initializeSmoothScrolling();
});

// Mobile menu functionality
function initializeMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });
    }
}

// Load products into the carousel
function loadProducts() {
    const productsContainer = document.getElementById('products-container');
    if (!productsContainer) return;
    
    productsContainer.innerHTML = '';
    
    products.forEach(product => {
        const productCard = createProductCard(product);
        productsContainer.appendChild(productCard);
    });
    
    console.log(`Loaded ${products.length} products`);
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card fade-in';
    
    card.innerHTML = `
        <div class="product-image">
            <img src="${product.image}" alt="${product.name}" loading="lazy" />
        </div>
        <div class="product-info">
            <h3 class="product-name">${product.name}</h3>
            <p class="product-price">$${product.price.toFixed(2)}</p>
            <button class="add-to-cart" onclick="addToCart(${product.id})">
                Add to Cart
            </button>
        </div>
    `;
    
    return card;
}

// Add item to cart
function addToCart(productId) {
    console.log(`Adding product ${productId} to cart`);
    
    const product = products.find(p => p.id === productId);
    if (!product) {
        console.error('Product not found');
        return;
    }
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update UI
    updateCartCount();
    updateCartDisplay();
    
    // Show success feedback
    showAddToCartFeedback(product.name);
    
    console.log('Cart updated:', cart);
}
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    updateCartDisplay();
    console.log(`Removed product ${productId} from cart`);
}

// Update cart count in navigation
function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

// Toggle cart sidebar
function toggleCart() {
    const cartSidebar = document.getElementById('cart-sidebar');
    if (cartSidebar) {
        cartSidebar.classList.toggle('open');
        updateCartDisplay();
    }
}
function updateCartDisplay() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    if (!cartItems || !cartTotal) return;
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; color: #8A8A8A; padding: 2rem;">Your cart is empty</p>';
        cartTotal.textContent = '0.00';
        return;
    }
    
    cartItems.innerHTML = '';
    let total = 0;
    
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" />
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p class="cart-item-price">$${item.price.toFixed(2)} x ${item.quantity}</p>
            </div>
            <button onclick="removeFromCart(${item.id})" style="background: none; border: none; color: #D4A4A4; cursor: pointer;">×</button>
        `;
        cartItems.appendChild(cartItem);
        total += item.price * item.quantity;
    });
    cartTotal.textContent = total.toFixed(2);
}

// Show add to cart feedback
function showAddToCartFeedback(productName) {
    // Create temporary notification
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #D4A4A4;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 25px;
        z-index: 1002;
        animation: slideIn 0.3s ease-out;
        box-shadow: 0 4px 20px rgba(244, 194, 194, 0.3);
    `;
    notification.textContent = `${productName} added to cart!`;
    
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 2000);
}

// Carousel functionality
function moveCarousel(direction) {
    const container = document.getElementById('products-container');
    if (!container) return;
    
    const cardWidth = 300; // Approximate width including gap
    const scrollAmount = cardWidth * direction;
    
    container.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
    });
    
    console.log(`Carousel moved ${direction > 0 ? 'right' : 'left'}`);
}
function initializeCountdown() {
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 3);
    endDate.setHours(23, 59, 59, 999);
    
    function updateCountdown() {
        const now = new Date();
        const timeLeft = endDate - now;
        
        if (timeLeft > 0) {
            const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            
            const daysEl = document.getElementById('days');
            const hoursEl = document.getElementById('hours');
            const minutesEl = document.getElementById('minutes');
            
            if (daysEl) daysEl.textContent = days.toString().padStart(2, '0');
            if (hoursEl) hoursEl.textContent = hours.toString().padStart(2, '0');
            if (minutesEl) minutesEl.textContent = minutes.toString().padStart(2, '0');
        }
    }
    updateCountdown();
    setInterval(updateCountdown, 60000); // Update every minute
}

// File upload functionality
function initializeFileUpload() {
    const fileInput = document.getElementById('design-upload');
    const uploadedFiles = document.getElementById('uploaded-files');
    
    if (!fileInput || !uploadedFiles) return;
    
    fileInput.addEventListener('change', function(e) {
        const files = Array.from(e.target.files);
        
        files.forEach(file => {
            if (file.type.startsWith('image/')) {
                const fileDiv = document.createElement('div');
                fileDiv.className = 'uploaded-file fade-in';
                fileDiv.textContent = file.name;
                uploadedFiles.appendChild(fileDiv);
                
                console.log(`File uploaded: ${file.name}`);
            }
        });
        if (files.length > 0) {
            showUploadSuccess(files.length);
        }
    });
    
    // Drag and drop functionality
    const uploadSection = document.querySelector('.file-upload');
    if (uploadSection) {
        uploadSection.addEventListener('dragover', function(e) {
            e.preventDefault();
            uploadSection.style.borderColor = '#D4A4A4';
            uploadSection.style.backgroundColor = '#F8F8F8';
        });
        
        uploadSection.addEventListener('dragleave', function(e) {
            e.preventDefault();
            uploadSection.style.borderColor = '#F4C2C2';
            uploadSection.style.backgroundColor = 'white';
        });
        
        uploadSection.addEventListener('drop', function(e) {
            e.preventDefault();
             uploadSection.style.borderColor = '#F4C2C2';
            uploadSection.style.backgroundColor = 'white';
            
            const files = Array.from(e.dataTransfer.files);
            const imageFiles = files.filter(file => file.type.startsWith('image/'));
            
            if (imageFiles.length > 0) {
                // Trigger the file input change event
                const dt = new DataTransfer();
                imageFiles.forEach(file => dt.items.add(file));
                fileInput.files = dt.files;
                fileInput.dispatchEvent(new Event('change', { bubbles: true }));
            }
        });
    }
}

function showUploadSuccess(fileCount) {
    const message = fileCount === 1 ? '1 file uploaded successfully!' : `${fileCount} files uploaded successfully!`;
    
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #D4A4A4;
        color: white;
        padding: 1rem 2rem;
        border-radius: 25px;
        z-index: 1002;
        animation: fadeIn 0.3s ease-out;
        box-shadow: 0 8px 30px rgba(244, 194, 194, 0.3);
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => {
             document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Newsletter form functionality
function initializeNewsletterForm() {
    const form = document.getElementById('newsletter-form');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('newsletter-name').value;
        const email = document.getElementById('newsletter-email').value;
        let message = document.getElementById('message').value;


        
        if (name && email) {
            // Simulate subscription process
            const button = form.querySelector('.newsletter-btn');
            const originalText = button.textContent;
            
            button.textContent = 'Subscribing...';
            button.disabled = true;
            setTimeout(() => {
                button.textContent = 'Subscribed! ✓';
                
                setTimeout(() => {
                    button.textContent = originalText;
                    button.disabled = false;
                    form.reset();
                    
                    showNewsletterSuccess(name);
                }, 1500);
            }, 1000);

            
                gtag('event', 'newsletter_subscription', {
                        'name': name,
                        'email': email,
                         'message': message,
                         'message_char_count': message.length,
                         'submission_count':1
                 });

            console.log('event sent successfully')
            console.log(`Newsletter subscription: ${name} - ${email}`);
        }
    });
}

// Show newsletter success message
function showNewsletterSuccess(name) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #D4A4A4, #F4C2C2);
        color: white;
        padding: 2rem;
        border-radius: 20px;
        z-index: 1002;
        animation: fadeIn 0.3s ease-out;
        box-shadow: 0 8px 30px rgba(244, 194, 194, 0.3);
        text-align: center;
        max-width: 400px;
    `;
    notification.innerHTML = `
        <h3 style="margin-bottom: 1rem; font-family: 'Playfair Display', serif;">Welcome to Bloom, ${name}!</h3>
        <p>Thank you for subscribing. You'll be the first to know about new collections and exclusive offers.</p>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 4000);
}

// Scroll animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.category-card, .product-card, .testimonial-card, .lookbook-item');
    animatedElements.forEach(el => {
        observer.observe(el);
        });
}

// Smooth scrolling for navigation links
function initializeSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // Account for fixed header
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        const offsetTop = element.offsetTop - 80;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// Category filter functionality
function filterByCategory(category) {
    console.log(`Filtering products by category: ${category}`);
    
    const filteredProducts = category === 'all' 
        ? products 
        : products.filter(product => product.category === category);
    
    const productsContainer = document.getElementById('products-container');
    if (!productsContainer) return;
    
    productsContainer.innerHTML = '';
    
    filteredProducts.forEach(product => {
        const productCard = createProductCard(product);
        productsContainer.appendChild(productCard);
    });
    // Add click event to category cards
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            if (category) {
                filterByCategory(category);
                scrollToSection('products-container');
            }
        });
    });
}

// Initialize category filtering
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            if (category) {
                filterByCategory(category);
                scrollToSection('featured-products');
            }
        });
    });
});
// Handle page visibility change (pause/resume animations)
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        console.log('Page hidden - pausing animations');
    } else {
        console.log('Page visible - resuming animations');
    }
});

// Handle window resize for responsive adjustments
window.addEventListener('resize', function() {
    // Close mobile menu on resize
    const navMenu = document.getElementById('nav-menu');
    const hamburger = document.getElementById('hamburger');
    
    if (window.innerWidth > 768 && navMenu && hamburger) {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    }
});
console.log(`
🌸 Welcome to Bloom Boutique! 🌸
Built with love using vanilla HTML, CSS, and JavaScript
Features:
- Responsive design
- Shopping cart functionality
- Product carousel
- File upload
- Newsletter subscription
- Smooth animations
- Mobile-friendly navigation
`);
