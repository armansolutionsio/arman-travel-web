// Variables globales
let packages = [];
let currentFilter = 'all';
let config = { whatsapp_number: '1132551565', recipient_email: 'info.armansolutions@gmail.com' };
let contactConfig = {};

// Función para formatear precios con puntos como separadores de miles
function formatPrice(priceString) {
    if (!priceString) return priceString;

    // Extraer la parte numérica y la moneda
    const match = priceString.match(/^(.*?)(\d+(?:,\d+)*)(.*?)$/);
    if (!match) return priceString;

    const prefix = match[1]; // Ejemplo: "USD ", "$", etc.
    const numberPart = match[2]; // Ejemplo: "1500", "1,500"
    const suffix = match[3]; // Ejemplo: " por persona", etc.

    // Remover comas existentes y convertir a número
    const number = parseInt(numberPart.replace(/,/g, ''));

    // Formatear con puntos como separadores de miles
    const formattedNumber = number.toLocaleString('es-AR');

    return prefix + formattedNumber + suffix;
}

// Detección de dispositivos móviles
const isMobile = () => {
    return window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

// API Base URL
const API_BASE_URL = window.location.protocol + '//' + window.location.host;

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    loadConfig();
    initNavigation();
    initScrollEffects();
    initFAQ();
    initTestimonials();
    initContactForm();
    initAdminModal();
    loadContactConfig();
    loadPackages();
    initPackageFilters();
    initHeroCarousel();

    // Manejar cambios de orientación en móviles
    window.addEventListener('orientationchange', () => {
        setTimeout(() => {
            const carouselContainer = document.querySelector('.hero-carousel');
            if (carouselContainer) {
                if (isMobile() && !carouselContainer.classList.contains('mobile-optimized')) {
                    carouselContainer.classList.add('mobile-optimized');
                } else if (!isMobile() && carouselContainer.classList.contains('mobile-optimized')) {
                    carouselContainer.classList.remove('mobile-optimized');
                }
            }
        }, 200);
    });

    // Manejar redimensionamiento de ventana
    window.addEventListener('resize', () => {
        const carouselContainer = document.querySelector('.hero-carousel');
        if (carouselContainer) {
            if (isMobile() && !carouselContainer.classList.contains('mobile-optimized')) {
                carouselContainer.classList.add('mobile-optimized');
            } else if (!isMobile() && carouselContainer.classList.contains('mobile-optimized')) {
                carouselContainer.classList.remove('mobile-optimized');
            }
        }
    });
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

// Cargar configuración desde el backend
async function loadConfig() {
    try {
        const response = await fetch(`${API_BASE_URL}/config`);
        if (response.ok) {
            config = await response.json();
            updateContactInfo();
        }
    } catch (error) {
        console.log('Usando configuración por defecto');
    }
}

// Cargar configuración de contacto
async function loadContactConfig() {
    try {
        const response = await fetch(`${API_BASE_URL}/config/contact`);
        if (response.ok) {
            contactConfig = await response.json();
            updateContactInfo();
        } else {
            console.error('Error al cargar configuración de contacto');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Actualizar información de contacto en el DOM
function updateContactInfo() {
    // Usar configuración de contacto específica si está disponible, sino usar config general
    const whatsappNumber = contactConfig.whatsapp || config.whatsapp_number;
    const email = contactConfig.email || config.recipient_email;
    
    // Actualizar enlaces de WhatsApp
    const whatsappLinks = document.querySelectorAll('a[href*="wa.me"]');
    whatsappLinks.forEach(link => {
        link.href = contactConfig.whatsapp_url || `https://wa.me/${whatsappNumber}`;
    });

    // Actualizar enlaces de email
    const emailLinks = document.querySelectorAll('a[href*="mailto:"]');
    emailLinks.forEach(link => {
        link.href = `mailto:${email}`;
        if (link.textContent.includes('@')) {
            link.textContent = email;
        }
    });
    
    // Actualizar números mostrados
    document.querySelectorAll('.whatsapp-number').forEach(element => {
        element.textContent = whatsappNumber;
    });
    
    // Actualizar números de teléfono mostrados
    document.querySelectorAll('.phone-number').forEach(element => {
        const formattedPhone = formatPhoneNumber(whatsappNumber);
        element.textContent = formattedPhone;
        element.href = `tel:+${whatsappNumber}`;
    });
    
    // Actualizar emails mostrados
    document.querySelectorAll('.contact-email').forEach(element => {
        element.textContent = email;
    });
}

// Formatear número de teléfono
function formatPhoneNumber(phoneNumber) {
    // Si el número empieza con 549, formatear como +54 11 xxxx-xxxx
    if (phoneNumber.startsWith('549')) {
        const cleanNumber = phoneNumber.substring(2); // Quitar '54'
        if (cleanNumber.startsWith('11')) {
            return `+54 11 ${cleanNumber.substring(2, 6)}-${cleanNumber.substring(6)}`;
        }
    }
    // Si el número empieza con 11, formatear como +54 11 xxxx-xxxx
    else if (phoneNumber.startsWith('11')) {
        return `+54 11 ${phoneNumber.substring(2, 6)}-${phoneNumber.substring(6)}`;
    }
    // Formato por defecto
    return `+${phoneNumber}`;
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
            showEmptyPackages();
        }
    } catch (error) {
        console.error('Error:', error);
        showEmptyPackages();
    }
}

// Mostrar mensaje cuando no hay paquetes
function showEmptyPackages() {
    const packagesGrid = document.getElementById('packagesGrid');
    if (packagesGrid) {
        packagesGrid.innerHTML = '<div class="empty-packages">No hay paquetes disponibles en este momento.</div>';
    }
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
                <div class="package-price">${formatPrice(pkg.price)}</div>
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

// === HERO CAROUSEL ===

let carouselPackages = [];
let currentSlide = 0;
let carouselInterval;

// Inicializar carrusel hero
async function initHeroCarousel() {
    try {
        // Aplicar clase móvil si es necesario
        const carouselContainer = document.querySelector('.hero-carousel');
        if (carouselContainer && isMobile()) {
            carouselContainer.classList.add('mobile-optimized');
        }

        // Cargar paquetes promocionados
        const response = await fetch(`${API_BASE_URL}/packages/promoted`);
        if (response.ok) {
            carouselPackages = await response.json();
        } else {
            carouselPackages = [];
        }

        if (carouselPackages.length > 0) {
            // Hay paquetes promocionados - mostrar carrusel normal
            createCarouselSlides();
            createCarouselIndicators();
            initCarouselControls();
            startCarouselAutoplay();
        } else {
            // No hay paquetes promocionados - mostrar carrusel con imagen random
            createFallbackCarouselSlide();
        }
    } catch (error) {
        console.error('Error inicializando carrusel:', error);
        // En caso de error, mostrar carrusel con imagen random
        createFallbackCarouselSlide();
    }
}

// Crear slides del carrusel
function createCarouselSlides() {
    const carouselTrack = document.getElementById('carouselTrack');
    if (!carouselTrack) return;
    
    carouselTrack.innerHTML = carouselPackages.map(pkg => `
        <li class="carousel-slide" style="background-image: url('${pkg.image}')">
            <div class="carousel-content">
                <h3>${pkg.title}</h3>
                <p>${pkg.description}</p>
                <a href="/package-detail/${pkg.id}" class="carousel-btn">Ver más</a>
            </div>
        </li>
    `).join('');
    
    // Mostrar botones de navegación cuando hay múltiples slides
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');
    if (carouselPackages.length > 1) {
        if (prevButton) prevButton.style.display = 'block';
        if (nextButton) nextButton.style.display = 'block';
    } else {
        if (prevButton) prevButton.style.display = 'none';
        if (nextButton) nextButton.style.display = 'none';
    }
}

// Crear indicadores del carrusel
function createCarouselIndicators() {
    const carouselNav = document.getElementById('carouselNav');
    if (!carouselNav) return;
    
    carouselNav.innerHTML = carouselPackages.map((_, index) => `
        <button class="carousel-indicator ${index === 0 ? 'active' : ''}" data-slide="${index}"></button>
    `).join('');
}

// Inicializar controles del carrusel
function initCarouselControls() {
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');
    const indicators = document.querySelectorAll('.carousel-indicator');

    // Botones anterior/siguiente
    if (prevButton) {
        prevButton.addEventListener('click', () => {
            stopCarouselAutoplay();
            prevSlide();
            startCarouselAutoplay();
        });
    }

    if (nextButton) {
        nextButton.addEventListener('click', () => {
            stopCarouselAutoplay();
            nextSlide();
            startCarouselAutoplay();
        });
    }

    // Indicadores
    indicators.forEach(indicator => {
        indicator.addEventListener('click', (e) => {
            stopCarouselAutoplay();
            const slideIndex = parseInt(e.target.dataset.slide);
            goToSlide(slideIndex);
            startCarouselAutoplay();
        });
    });

    // Gestos táctiles para móviles
    if (isMobile()) {
        initTouchGestures();
    }
}

// Ir a slide anterior
function prevSlide() {
    currentSlide = currentSlide === 0 ? carouselPackages.length - 1 : currentSlide - 1;
    updateCarousel();
}

// Ir a slide siguiente
function nextSlide() {
    currentSlide = currentSlide === carouselPackages.length - 1 ? 0 : currentSlide + 1;
    updateCarousel();
}

// Ir a slide específico
function goToSlide(slideIndex) {
    currentSlide = slideIndex;
    updateCarousel();
}

// Actualizar carrusel
function updateCarousel() {
    const carouselTrack = document.getElementById('carouselTrack');
    const indicators = document.querySelectorAll('.carousel-indicator');
    
    if (carouselTrack) {
        const translateX = -currentSlide * 100;
        carouselTrack.style.transform = `translateX(${translateX}%)`;
    }
    
    // Actualizar indicadores
    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentSlide);
    });
}

// Iniciar autoplay
function startCarouselAutoplay() {
    stopCarouselAutoplay(); // Limpiar cualquier intervalo existente
    carouselInterval = setInterval(() => {
        nextSlide();
    }, 5000); // Cambiar slide cada 5 segundos
}

// Detener autoplay
function stopCarouselAutoplay() {
    if (carouselInterval) {
        clearInterval(carouselInterval);
        carouselInterval = null;
    }
}

// Inicializar gestos táctiles para móviles
function initTouchGestures() {
    const carouselContainer = document.querySelector('.carousel-track-container');
    if (!carouselContainer) return;

    let startX = 0;
    let currentX = 0;
    let isDragging = false;
    const sensitivity = 50; // Píxeles mínimos para activar el swipe

    // Inicio del toque
    carouselContainer.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
        stopCarouselAutoplay();
    }, { passive: true });

    // Movimiento del toque
    carouselContainer.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        currentX = e.touches[0].clientX;
    }, { passive: true });

    // Fin del toque
    carouselContainer.addEventListener('touchend', (e) => {
        if (!isDragging) return;
        isDragging = false;

        const diffX = startX - currentX;

        // Swipe hacia la izquierda (siguiente slide)
        if (diffX > sensitivity) {
            nextSlide();
        }
        // Swipe hacia la derecha (slide anterior)
        else if (diffX < -sensitivity) {
            prevSlide();
        }

        // Reiniciar autoplay después de un breve delay
        setTimeout(() => {
            startCarouselAutoplay();
        }, 100);
    }, { passive: true });

    // Cancelar el gesto si se va fuera del área
    carouselContainer.addEventListener('touchcancel', () => {
        isDragging = false;
        startCarouselAutoplay();
    }, { passive: true });
}

// Pausar autoplay cuando el usuario interactúa
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        stopCarouselAutoplay();
    } else {
        startCarouselAutoplay();
    }
});


// Crear carrusel con imagen random cuando no hay promocionados
function createFallbackCarouselSlide() {
    const carouselTrack = document.getElementById('carouselTrack');
    const carouselNav = document.getElementById('carouselNav');
    
    if (!carouselTrack) return;
    
    // Imagen random (la misma del hero)
    const fallbackImage = "https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80";
    
    // Crear slide único con imagen random
    carouselTrack.innerHTML = `
        <li class="carousel-slide" style="background-image: url('${fallbackImage}')">
            <div class="carousel-content">
                <h3>Descubre Destinos Únicos</h3>
                <p>Explora nuestros increíbles paquetes de viaje y encuentra tu próxima aventura.</p>
                <a href="#packages" class="carousel-btn" onclick="scrollToPackages(event)">Ver Más</a>
            </div>
        </li>
    `;
    
    // Limpiar indicadores (solo una imagen)
    if (carouselNav) {
        carouselNav.innerHTML = '';
    }
    
    // Ocultar botones de navegación (solo una imagen)
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');
    if (prevButton) prevButton.style.display = 'none';
    if (nextButton) nextButton.style.display = 'none';
}

// Función para scroll suave a paquetes
function scrollToPackages(event) {
    event.preventDefault();
    const packagesSection = document.getElementById('packages');
    if (packagesSection) {
        const offsetTop = packagesSection.offsetTop - 80;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}