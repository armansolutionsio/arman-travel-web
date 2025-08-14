// Variables globales
let packages = [];
let currentFilter = 'all';

// API Base URL
const API_BASE_URL = window.location.protocol + '//' + window.location.host;

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initScrollEffects();
    initFAQ();
    initTestimonials();
    initContactForm();
    initAdminModal();
    loadPackages();
    initPackageFilters();
});

// Navegación móvil
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Smooth scrolling
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Efectos de scroll
function initScrollEffects() {
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// FAQ
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Cerrar todos los FAQ
            faqItems.forEach(faq => faq.classList.remove('active'));
            
            // Abrir el clickeado si no estaba activo
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

// Testimonios slider
function initTestimonials() {
    const testimonials = document.querySelectorAll('.testimonial');
    let currentTestimonial = 0;

    function showTestimonial(index) {
        testimonials.forEach((testimonial, i) => {
            testimonial.classList.toggle('active', i === index);
        });
    }

    function nextTestimonial() {
        currentTestimonial = (currentTestimonial + 1) % testimonials.length;
        showTestimonial(currentTestimonial);
    }

    // Auto-advance testimonials
    setInterval(nextTestimonial, 5000);
}

// Formulario de contacto
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        
        try {
            const response = await fetch(`${API_BASE_URL}/contact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            if (response.ok) {
                showNotification('¡Mensaje enviado correctamente! Te contactaremos pronto.', 'success');
                contactForm.reset();
            } else {
                throw new Error('Error al enviar el mensaje');
            }
        } catch (error) {
            console.error('Error:', error);
            showNotification('Hubo un error al enviar el mensaje. Por favor intenta nuevamente.', 'error');
        }
    });
}

// Modal de administrador - ahora redirige directamente
function initAdminModal() {
    const adminBtn = document.getElementById('adminLoginBtn');
    
    adminBtn.addEventListener('click', () => {
        window.location.href = 'admin.html';
    });
}

// Cargar paquetes
async function loadPackages() {
    try {
        const response = await fetch(`${API_BASE_URL}/packages`);
        if (response.ok) {
            packages = await response.json();
            displayPackages(packages);
        } else {
            console.error('Error al cargar paquetes');
            // Mostrar paquetes de ejemplo si falla la API
            showSamplePackages();
        }
    } catch (error) {
        console.error('Error:', error);
        // Mostrar paquetes de ejemplo si falla la API
        showSamplePackages();
    }
}

// Mostrar paquetes de ejemplo
function showSamplePackages() {
    const samplePackages = [
        {
            id: 1,
            title: "Buenos Aires Clásico",
            description: "Descubre la capital argentina con este paquete completo de 3 días.",
            price: "$45.000",
            image: "https://images.unsplash.com/photo-1589909202802-8f4aadce1849?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
            category: "nacional",
            features: ["3 días / 2 noches", "Desayuno incluido", "City tour", "Tango show"]
        },
        {
            id: 2,
            title: "Bariloche Aventura",
            description: "Vive la aventura patagónica con deportes extremos y paisajes únicos.",
            price: "$75.000",
            image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
            category: "aventura",
            features: ["5 días / 4 noches", "Pensión completa", "Rafting", "Cerro Catedral"]
        },
        {
            id: 3,
            title: "Miami Beach",
            description: "Disfruta de las mejores playas de Florida en este paquete internacional.",
            price: "USD 899",
            image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
            category: "internacional",
            features: ["7 días / 6 noches", "Hotel 4 estrellas", "Vuelos incluidos", "Traslados"]
        },
        {
            id: 4,
            title: "Mendoza Relax",
            description: "Relájate entre viñedos y montañas en la capital del vino argentino.",
            price: "$55.000",
            image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
            category: "relax",
            features: ["4 días / 3 noches", "Spa incluido", "Tour de bodegas", "Cena gourmet"]
        }
    ];
    
    packages = samplePackages;
    displayPackages(packages);
}

// Mostrar paquetes en el DOM
function displayPackages(packagesToShow) {
    const packagesGrid = document.getElementById('packagesGrid');
    
    if (!packagesGrid) return;
    
    packagesGrid.innerHTML = packagesToShow.map(pkg => `
        <div class="package-card" data-category="${pkg.category}">
            <img src="${pkg.image}" alt="${pkg.title}" class="package-image">
            <div class="package-content">
                <h3 class="package-title">${pkg.title}</h3>
                <p class="package-description">${pkg.description}</p>
                <div class="package-price">${pkg.price}</div>
                <ul class="package-features">
                    ${pkg.features.map(feature => `<li>${feature}</li>`).join('')}
                </ul>
                <a href="/package-detail/${pkg.id}" class="btn btn-primary">
                    <i class="fas fa-eye"></i> Ver Detalles
                </a>
            </div>
        </div>
    `).join('');
}

// Filtros de paquetes
function initPackageFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;
            
            // Actualizar botones activos
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Filtrar paquetes
            filterPackages(filter);
        });
    });
}

// Filtrar paquetes
function filterPackages(filter) {
    currentFilter = filter;
    
    if (filter === 'all') {
        displayPackages(packages);
    } else {
        const filteredPackages = packages.filter(pkg => pkg.category === filter);
        displayPackages(filteredPackages);
    }
}

// Utilidades
function showNotification(message, type = 'success') {
    // Crear notificación
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Estilos
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 2rem;
        border-radius: 5px;
        color: white;
        font-weight: 500;
        z-index: 9999;
        animation: slideInRight 0.3s ease;
        background: ${type === 'success' ? '#28a745' : '#dc3545'};
    `;
    
    document.body.appendChild(notification);
    
    // Remover después de 5 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Animaciones CSS adicionales
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);