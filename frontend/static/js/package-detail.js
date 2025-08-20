// JavaScript para la página de detalle de paquetes
const API_BASE_URL = window.location.protocol + '//' + window.location.host;
let currentPackage = null;
let allPackages = [];
let config = { whatsapp_number: '1132551565', recipient_email: 'info.armansolutions@gmail.com' };
let contactConfig = {};


// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    loadConfig();
    initNavigation();
    loadContactConfig();
    loadPackageDetail();
    loadAllPackages();
    initReservationForm();
});

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

// Actualizar información de contacto en la página
function updateContactInfo() {
    // Actualizar enlaces de WhatsApp
    document.querySelectorAll('a[href*="wa.me"]').forEach(link => {
        link.href = `https://wa.me/${config.whatsapp_number}`;
    });
    
    // Actualizar números mostrados
    document.querySelectorAll('.whatsapp-number').forEach(element => {
        element.textContent = config.whatsapp_number;
    });
    
    // Actualizar emails mostrados
    document.querySelectorAll('.contact-email').forEach(element => {
        element.textContent = config.recipient_email;
    });
}

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
async function displayGallery(galleryImages, mainImage, title) {
    const galleryContainer = document.getElementById('packageGallery');
    
    // Intentar cargar galería real desde la base de datos
    let realGalleryImages = [];
    if (currentPackage && currentPackage.id) {
        try {
            const response = await fetch(`${API_BASE_URL}/packages/${currentPackage.id}/gallery`);
            if (response.ok) {
                realGalleryImages = await response.json();
            }
        } catch (error) {
            console.log('No se pudo cargar galería desde BD:', error);
        }
    }
    
    let images = [];
    
    if (realGalleryImages.length > 0) {
        // Usar imágenes reales de la galería
        images = realGalleryImages.map(img => ({
            url: img.image_url,
            caption: img.caption || `${title} - Imagen`,
            isCover: img.is_cover
        }));
        
        // Ordenar por cover primero, luego por orden
        images.sort((a, b) => {
            if (a.isCover && !b.isCover) return -1;
            if (!a.isCover && b.isCover) return 1;
            return 0;
        });
    } else if (galleryImages && galleryImages.length > 0) {
        // Usar imágenes del campo JSON legacy
        images = galleryImages.map((image, index) => ({
            url: image,
            caption: `${title} - Imagen ${index + 1}`,
            isCover: false
        }));
    } else {
        // Solo imagen principal disponible
        images = [{
            url: mainImage,
            caption: `${title} - Imagen principal`,
            isCover: true
        }];
    }

    // Asegurar que siempre tenemos al menos la imagen principal
    if (images.length === 0 || !images.find(img => img.url === mainImage)) {
        images.unshift({
            url: mainImage,
            caption: `${title} - Imagen principal`,
            isCover: true
        });
    }

    galleryContainer.innerHTML = images.map((image, index) => `
        <div class="gallery-image-wrapper">
            <img src="${image.url}" 
                 alt="${image.caption}" 
                 class="gallery-image ${image.isCover ? 'cover-image' : ''}" 
                 onclick="openImageModal('${image.url}', '${image.caption}')"
                 onerror="this.style.display='none'">
        </div>
    `).join('');
}

// Mostrar itinerario
function displayItinerary(itinerary) {
    const itineraryContainer = document.getElementById('packageItinerary');
    
    if (itinerary.length === 0) return;

    const defaultIcons = ['fas fa-plane', 'fas fa-camera', 'fas fa-utensils', 'fas fa-map-marked-alt', 'fas fa-star', 'fas fa-mountain', 'fas fa-swimming-pool'];
    
    itineraryContainer.innerHTML = itinerary.map((item, index) => {
        // Manejar diferentes formatos de itinerario
        let title, description, activities = [], icon;
        
        if (typeof item === 'string') {
            // Formato legacy: solo string
            title = `Día ${index + 1}`;
            description = item;
            icon = defaultIcons[index % defaultIcons.length];
        } else if (item.title && item.description) {
            // Formato nuevo: objeto con título, descripción, actividades e icono
            title = item.title;
            description = item.description;
            activities = item.activities || [];
            icon = item.icon || defaultIcons[index % defaultIcons.length];
        } else {
            // Formato legacy objeto: solo descripción
            title = `Día ${index + 1}`;
            description = item.description || item;
            icon = item.icon || defaultIcons[index % defaultIcons.length];
        }
        
        // Renderizar actividades si las hay
        const activitiesHtml = activities.length > 0 ? `
            <div class="timeline-activities">
                <h5>Actividades:</h5>
                <ul>
                    ${activities.map(activity => `<li>${activity}</li>`).join('')}
                </ul>
            </div>
        ` : '';
        
        return `
            <div class="timeline-item">
                <div class="timeline-icon">
                    <i class="${icon}"></i>
                </div>
                <div class="timeline-content">
                    <h4>${title}</h4>
                    <p>${description}</p>
                    ${activitiesHtml}
                </div>
            </div>
        `;
    }).join('');
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

function openImageModal(imageSrc, caption = '') {
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
        flex-direction: column;
        z-index: 9999;
        cursor: pointer;
    `;
    
    const img = document.createElement('img');
    img.src = imageSrc;
    img.style.cssText = `
        max-width: 90%;
        max-height: 80%;
        object-fit: contain;
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
    `;
    
    modal.appendChild(img);
    
    if (caption) {
        const captionEl = document.createElement('div');
        captionEl.textContent = caption;
        captionEl.style.cssText = `
            color: white;
            text-align: center;
            margin-top: 1rem;
            font-size: 1.1rem;
            padding: 0.5rem 1rem;
            background: rgba(0, 0, 0, 0.5);
            border-radius: 5px;
            max-width: 80%;
        `;
        modal.appendChild(captionEl);
    }
    
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