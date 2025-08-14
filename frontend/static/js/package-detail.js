// JavaScript para la página de detalle de paquetes
const API_BASE_URL = window.location.protocol + '//' + window.location.host;
let currentPackage = null;
let allPackages = [];
let contactConfig = {};

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    loadContactConfig();
    loadPackageDetail();
    loadAllPackages();
    initReservationForm();
});

// Navegación móvil (reutilizado del script principal)
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (hamburger) hamburger.classList.remove('active');
            if (navMenu) navMenu.classList.remove('active');
        });
    });
}

// Obtener ID del paquete desde URL
function getPackageIdFromURL() {
    // Obtener el ID desde la URL tipo /package-detail/123
    const pathSegments = window.location.pathname.split('/');
    const packageId = pathSegments[pathSegments.length - 1];
    console.log('URL completa:', window.location.pathname);
    console.log('Segmentos de URL:', pathSegments);
    console.log('Package ID extraído:', packageId);
    return packageId;
}

// Cargar detalle del paquete
async function loadPackageDetail() {
    const packageId = getPackageIdFromURL();
    console.log('Cargando paquete con ID:', packageId);
    
    if (!packageId || packageId === '' || isNaN(packageId)) {
        console.error('ID de paquete inválido:', packageId);
        showError(`ID de paquete no válido: "${packageId}"`);
        return;
    }

    try {
        showLoading(true);
        const apiUrl = `${API_BASE_URL}/packages/${packageId}`;
        console.log('Haciendo fetch a:', apiUrl);
        
        const response = await fetch(apiUrl);
        console.log('Respuesta del servidor:', response.status, response.statusText);
        
        if (response.ok) {
            currentPackage = await response.json();
            console.log('Datos del paquete cargados:', currentPackage);
            displayPackageDetail(currentPackage);
        } else if (response.status === 404) {
            console.error('Paquete no encontrado');
            showError('Paquete no encontrado');
        } else {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
    } catch (error) {
        console.error('Error completo:', error);
        showError(`Error al cargar la información del paquete: ${error.message}`);
    } finally {
        showLoading(false);
    }
}

// Mostrar detalle del paquete
function displayPackageDetail(package) {
    // Actualizar título de la página
    document.title = `${package.title} - ARMAN TRAVEL`;
    document.getElementById('pageTitle').textContent = `${package.title} - ARMAN TRAVEL`;

    // Actualizar breadcrumb
    document.getElementById('breadcrumbTitle').textContent = package.title;

    // Hero section
    document.getElementById('heroImage').src = package.image;
    document.getElementById('heroImage').alt = package.title;
    document.getElementById('heroTitle').textContent = package.title;
    document.getElementById('heroDescription').textContent = package.description;
    document.getElementById('heroPrice').textContent = package.price;
    
    const heroCategory = document.getElementById('heroCategory');
    heroCategory.querySelector('span').textContent = getCategoryName(package.category);

    // Quick info
    document.getElementById('duration').textContent = package.duration || 'Consultar';
    document.getElementById('idealFor').textContent = package.ideal_for || 'Todos los públicos';
    document.getElementById('destination').textContent = package.destination || getDestinationFromTitle(package.title);
    document.getElementById('categoryInfo').textContent = getCategoryName(package.category);

    // Descripción completa
    document.getElementById('fullDescription').innerHTML = formatDescription(package.description);

    // Características/Features
    displayFeatures(package.features);

    // Sidebar precio
    document.getElementById('sidebarPrice').textContent = package.price;
    updateTotalPrice();

    // Galería
    displayGallery(package.gallery_images, package.image, package.title);

    // Itinerario
    if (package.itinerary && package.itinerary.length > 0) {
        displayItinerary(package.itinerary);
    }
}

// Obtener nombre de categoría
function getCategoryName(category) {
    const categoryNames = {
        'nacional': 'Nacional',
        'internacional': 'Internacional', 
        'aventura': 'Aventura',
        'relax': 'Relax'
    };
    return categoryNames[category] || category;
}

// Obtener destino desde el título
function getDestinationFromTitle(title) {
    const destinations = ['Buenos Aires', 'Bariloche', 'Mendoza', 'Miami', 'Europa', 'Cataratas'];
    for (const dest of destinations) {
        if (title.toLowerCase().includes(dest.toLowerCase())) {
            return dest;
        }
    }
    return 'Destino especial';
}

// Formatear descripción
function formatDescription(description) {
    // Convertir texto simple en párrafos
    const paragraphs = description.split('\n').filter(p => p.trim() !== '');
    if (paragraphs.length <= 1) {
        return `<p>${description}</p>`;
    }
    return paragraphs.map(p => `<p>${p.trim()}</p>`).join('');
}

// Mostrar características
function displayFeatures(features) {
    const featuresContainer = document.getElementById('packageFeatures');
    
    if (!features || features.length === 0) {
        featuresContainer.innerHTML = '<p>Información de características no disponible</p>';
        return;
    }

    featuresContainer.innerHTML = features.map(feature => `
        <div class="feature-item">
            <i class="fas fa-check"></i>
            <span>${feature}</span>
        </div>
    `).join('');
}

// Mostrar galería
function displayGallery(galleryImages, mainImage, title) {
    const galleryContainer = document.getElementById('packageGallery');
    
    // Si no hay galería, usar imagen principal
    let images = galleryImages && galleryImages.length > 0 ? galleryImages : [mainImage];
    
    // Agregar algunas imágenes de ejemplo si no hay galería
    if (images.length === 1) {
        images = [
            mainImage,
            'https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
            'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
            'https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
        ];
    }

    galleryContainer.innerHTML = images.map((image, index) => `
        <img src="${image}" alt="${title} - Imagen ${index + 1}" class="gallery-image" onclick="openImageModal('${image}')">
    `).join('');
}

// Mostrar itinerario
function displayItinerary(itinerary) {
    const itineraryContainer = document.getElementById('packageItinerary');
    
    if (itinerary.length === 0) return;

    const icons = ['fas fa-plane', 'fas fa-camera', 'fas fa-utensils', 'fas fa-map-marked-alt', 'fas fa-star'];
    
    itineraryContainer.innerHTML = itinerary.map((item, index) => `
        <div class="timeline-item">
            <div class="timeline-icon">
                <i class="${icons[index % icons.length]}"></i>
            </div>
            <div class="timeline-content">
                <h4>${item.title || `Día ${index + 1}`}</h4>
                <p>${item.description || item}</p>
            </div>
        </div>
    `).join('');
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
    // Actualizar enlaces de WhatsApp
    const whatsappLinks = document.querySelectorAll('a[href*="wa.me"]');
    whatsappLinks.forEach(link => {
        link.href = contactConfig.whatsapp_url || `https://wa.me/${contactConfig.whatsapp}`;
    });

    // Actualizar enlaces de email
    const emailLinks = document.querySelectorAll('a[href*="mailto:"]');
    emailLinks.forEach(link => {
        link.href = `mailto:${contactConfig.email}`;
        if (link.textContent.includes('@')) {
            link.textContent = contactConfig.email;
        }
    });
}

// Cargar todos los paquetes para sugerencias
async function loadAllPackages() {
    try {
        const response = await fetch(`${API_BASE_URL}/packages`);
        if (response.ok) {
            allPackages = await response.json();
            displayRelatedPackages();
        }
    } catch (error) {
        console.error('Error al cargar paquetes relacionados:', error);
    }
}

// Mostrar paquetes relacionados
function displayRelatedPackages() {
    if (!currentPackage || allPackages.length === 0) return;

    const relatedContainer = document.getElementById('relatedPackages');
    
    // Filtrar paquetes relacionados (misma categoría, excluyendo el actual)
    let related = allPackages.filter(pkg => 
        pkg.category === currentPackage.category && 
        pkg.id !== currentPackage.id
    );

    // Si no hay suficientes de la misma categoría, agregar otros
    if (related.length < 3) {
        const others = allPackages.filter(pkg => 
            pkg.id !== currentPackage.id && 
            !related.find(r => r.id === pkg.id)
        );
        related = [...related, ...others].slice(0, 3);
    }

    if (related.length === 0) {
        relatedContainer.innerHTML = '<p>No hay paquetes relacionados disponibles</p>';
        return;
    }

    relatedContainer.innerHTML = related.map(pkg => `
        <div class="related-item">
            <img src="${pkg.image}" alt="${pkg.title}" class="related-image">
            <div class="related-content">
                <a href="/package-detail/${pkg.id}">
                    <h4>${pkg.title}</h4>
                </a>
                <div class="price">${pkg.price}</div>
            </div>
        </div>
    `).join('');
}

// Inicializar formulario de reserva
function initReservationForm() {
    const form = document.getElementById('reservationForm');
    const travelersSelect = document.getElementById('travelers');

    // Actualizar precio total cuando cambie cantidad de viajeros
    travelersSelect.addEventListener('change', updateTotalPrice);

    // Manejar envío del formulario
    form.addEventListener('submit', handleReservationSubmit);

    // Establecer fecha mínima como hoy
    const dateInput = document.getElementById('departure');
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
}

// Actualizar precio total
function updateTotalPrice() {
    const travelers = document.getElementById('travelers').value;
    const totalPriceElement = document.getElementById('totalPrice');
    
    if (!currentPackage || !travelers) {
        totalPriceElement.innerHTML = '<strong>Total: Selecciona cantidad</strong>';
        return;
    }

    // Extraer número del precio (simplificado)
    const priceText = currentPackage.price;
    const priceMatch = priceText.match(/[\d,]+/);
    
    if (priceMatch) {
        const basePrice = parseInt(priceMatch[0].replace(/,/g, ''));
        const total = basePrice * parseInt(travelers);
        const currency = priceText.includes('USD') ? 'USD' : '$';
        totalPriceElement.innerHTML = `<strong>Total: ${currency} ${total.toLocaleString()}</strong>`;
    } else {
        totalPriceElement.innerHTML = `<strong>Total: ${priceText} x ${travelers}</strong>`;
    }
}

// Manejar envío del formulario de reserva
async function handleReservationSubmit(e) {
    e.preventDefault();
    
    if (!currentPackage) {
        showNotification('Error: Información del paquete no disponible', 'error');
        return;
    }

    const formData = new FormData(e.target);
    const reservationData = {
        name: formData.get('fullName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        message: `Consulta por el paquete: ${currentPackage.title}

Detalles de la consulta:
- Paquete: ${currentPackage.title}
- Cantidad de viajeros: ${formData.get('travelers')} personas
- Fecha preferida: ${formData.get('departure')}
- Comentarios adicionales: ${formData.get('comments') || 'Ninguno'}

Por favor contactarme para coordinar la reserva.`
    };

    try {
        showLoading(true);
        const response = await fetch(`${API_BASE_URL}/contact`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(reservationData)
        });
        
        if (response.ok) {
            showNotification('¡Consulta enviada correctamente! Te contactaremos pronto.', 'success');
            e.target.reset();
            updateTotalPrice();
        } else {
            throw new Error('Error al enviar la consulta');
        }
    } catch (error) {
        console.error('Error:', error);
        showNotification('Hubo un error al enviar la consulta. Por favor intenta nuevamente.', 'error');
    } finally {
        showLoading(false);
    }
}

// Funciones de utilidad
function showLoading(show) {
    // Podrías agregar un overlay de loading aquí
    if (show) {
        document.body.style.cursor = 'wait';
    } else {
        document.body.style.cursor = 'default';
    }
}

function showError(message) {
    // Mostrar error más detallado
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #dc3545;
        color: white;
        padding: 2rem;
        border-radius: 10px;
        z-index: 9999;
        max-width: 400px;
        text-align: center;
    `;
    errorDiv.innerHTML = `
        <h3>Error</h3>
        <p>${message}</p>
        <button onclick="window.location.href='/'" style="margin-top: 1rem; padding: 0.5rem 1rem; background: white; color: #dc3545; border: none; border-radius: 5px; cursor: pointer;">
            Volver al Inicio
        </button>
    `;
    document.body.appendChild(errorDiv);
}

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
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 9999;
        animation: slideInRight 0.3s ease;
        max-width: 400px;
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

function openImageModal(imageSrc) {
    // Crear modal simple para imagen
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        cursor: pointer;
    `;
    
    const img = document.createElement('img');
    img.src = imageSrc;
    img.style.cssText = `
        max-width: 90%;
        max-height: 90%;
        object-fit: contain;
        border-radius: 10px;
    `;
    
    modal.appendChild(img);
    document.body.appendChild(modal);
    
    // Cerrar modal al hacer click
    modal.addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    // Cerrar con Escape
    const closeOnEscape = (e) => {
        if (e.key === 'Escape') {
            document.body.removeChild(modal);
            document.removeEventListener('keydown', closeOnEscape);
        }
    };
    document.addEventListener('keydown', closeOnEscape);
}

// Animaciones CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);