// Variables globales
const API_BASE_URL = window.location.protocol + '//' + window.location.host;
let currentPackageId = null;
let packages = [];
let messages = [];

// Verificar autenticación al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('admin_token');
    if (!token) {
        // Si no hay token, mostrar solo el formulario de login
        showLoginOnly();
        return;
    }

    // Si hay token, verificar si es válido
    verifyTokenAndInitialize();
});

// Mostrar solo el formulario de login
function showLoginOnly() {
    // Ocultar el sidebar y main content
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    
    if (sidebar) sidebar.style.display = 'none';
    if (mainContent) mainContent.style.display = 'none';
    
    // Crear y mostrar el formulario de login
    createLoginForm();
}

// Verificar token y inicializar si es válido
async function verifyTokenAndInitialize() {
    const token = localStorage.getItem('admin_token');
    if (!token) {
        showLoginOnly();
        return;
    }

    try {
        // Verificar si el token es válido haciendo una petición a un endpoint protegido
        const response = await fetch(`${API_BASE_URL}/admin/contact-messages`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            // Token válido, inicializar admin
            initializeAdmin();
        } else {
            // Token inválido, limpiar y mostrar login
            localStorage.removeItem('admin_token');
            showLoginOnly();
        }
    } catch (error) {
        console.error('Error verificando token:', error);
        showLoginOnly();
    }
}

// Crear formulario de login
function createLoginForm() {
    const body = document.body;
    
    // Limpiar contenido existente
    body.innerHTML = `
        <div class="login-container">
            <div class="login-card">
                <div class="login-header">
                    <img src="static/images/logo_arman.PNG" alt="ARMAN TRAVEL" class="login-logo">
                    <h1>ARMAN TRAVEL</h1>
                    <h2>Panel de Administración</h2>
                </div>
                
                <form id="loginForm" class="login-form">
                    <div class="form-group">
                        <label for="username">Usuario</label>
                        <input type="text" id="username" name="username" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="password">Contraseña</label>
                        <input type="password" id="password" name="password" required>
                    </div>
                    
                    <button type="submit" class="btn btn-primary btn-login">
                        <i class="fas fa-sign-in-alt"></i>
                        Iniciar Sesión
                    </button>
                </form>
                
                <div class="login-footer">
                    <a href="/" class="back-link">
                        <i class="fas fa-arrow-left"></i>
                        Volver al sitio web
                    </a>
                </div>
            </div>
        </div>
    `;
    
    // Agregar estilos para el login
    addLoginStyles();
    
    // Agregar event listener al formulario
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
}

// Agregar estilos para la página de login
function addLoginStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .login-container {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #7b4397, #dc2430);
            padding: 2rem;
        }
        
        .login-card {
            background: white;
            border-radius: 20px;
            padding: 3rem;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
            width: 100%;
            max-width: 400px;
            text-align: center;
        }
        
        .login-header {
            margin-bottom: 2rem;
        }
        
        .login-logo {
            width: 60px;
            height: 60px;
            border-radius: 15px;
            margin-bottom: 1rem;
        }
        
        .login-header h1 {
            color: #7b4397;
            font-size: 1.8rem;
            font-weight: 700;
            margin-bottom: 0.5rem;
        }
        
        .login-header h2 {
            color: #6c757d;
            font-size: 1.1rem;
            font-weight: 400;
        }
        
        .login-form {
            text-align: left;
        }
        
        .form-group {
            margin-bottom: 1.5rem;
        }
        
        .form-group label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 600;
            color: #343a40;
        }
        
        .form-group input {
            width: 100%;
            padding: 12px 16px;
            border: 2px solid #dee2e6;
            border-radius: 10px;
            font-size: 1rem;
            transition: border-color 0.3s ease;
        }
        
        .form-group input:focus {
            outline: none;
            border-color: #7b4397;
        }
        
        .btn-login {
            width: 100%;
            padding: 15px;
            font-size: 1.1rem;
            font-weight: 600;
            border-radius: 10px;
            margin-top: 1rem;
        }
        
        .login-footer {
            margin-top: 2rem;
            padding-top: 1rem;
            border-top: 1px solid #dee2e6;
        }
        
        .back-link {
            color: #6c757d;
            text-decoration: none;
            font-size: 0.9rem;
            transition: color 0.3s ease;
        }
        
        .back-link:hover {
            color: #7b4397;
        }
        
        .back-link i {
            margin-right: 0.5rem;
        }
    `;
    document.head.appendChild(style);
}

// Manejar el login
async function handleLogin(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const credentials = {
        username: formData.get('username'),
        password: formData.get('password')
    };
    
    try {
        const response = await fetch(`${API_BASE_URL}/admin/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials)
        });
        
        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('admin_token', data.access_token);
            
            // Recargar la página para mostrar el panel
            window.location.reload();
        } else {
            alert('Credenciales incorrectas');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error de conexión');
    }
}

// Inicializar panel de administración
function initializeAdmin() {
    initSidebar();
    initModal();
    loadDashboardData();
    loadPackages();
    loadMessages();
    
    // Event listeners
    document.getElementById('logoutBtn').addEventListener('click', logout);
    document.getElementById('addPackageBtn').addEventListener('click', () => openPackageModal());
    document.getElementById('refreshMessagesBtn').addEventListener('click', loadMessages);
    document.getElementById('packageForm').addEventListener('submit', handlePackageSubmit);

    // Validación del textarea de características
    initFeaturesTextareaValidation();

    // Inicializar timer de renovación de sesión
    initializeSessionTimer();
}

// Inicializar sidebar
function initSidebar() {
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.querySelector('.sidebar');
    const menuLinks = document.querySelectorAll('.menu-link:not(.logout):not(.external-link)');

    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });

    menuLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = link.dataset.section;
            
            if (section) {
                // Actualizar navegación activa
                document.querySelectorAll('.menu-item').forEach(item => {
                    item.classList.remove('active');
                });
                link.parentElement.classList.add('active');
                
                // Mostrar sección correspondiente
                showSection(section);
                
                // Actualizar título
                const titles = {
                    'dashboard': 'Dashboard',
                    'packages': 'Gestión de Paquetes',
                    'messages': 'Mensajes de Contacto'
                };
                document.querySelector('.page-title').textContent = titles[section] || 'Panel de Administración';
                
                // Cerrar sidebar en móvil
                if (window.innerWidth <= 1024) {
                    sidebar.classList.remove('active');
                }
            }
        });
    });
}

// Mostrar sección
function showSection(sectionName) {
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    const targetSection = document.getElementById(sectionName);
    if (targetSection) {
        targetSection.classList.add('active');
        
        // Cargar datos específicos según la sección
        if (sectionName === 'packages') {
            loadPackages();
        } else if (sectionName === 'messages') {
            loadMessages();
        } else if (sectionName === 'dashboard') {
            loadDashboardData();
        }
    }
}

// Inicializar modal
function initModal() {
    const modal = document.getElementById('packageModal');
    const closeModal = document.getElementById('closeModal');
    const cancelBtn = document.getElementById('cancelBtn');

    function closeModalHandler() {
        modal.style.display = 'none';
        // No remover handlers al cerrar - mantenerlos activos
        // removeItineraryHandlers(); 
    }

    closeModal.addEventListener('click', () => showExitConfirmationPopup(closeModalHandler));
    cancelBtn.addEventListener('click', () => showExitConfirmationPopup(closeModalHandler));

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            showExitConfirmationPopup(closeModalHandler);
        }
    });
}

// Cargar datos del dashboard
async function loadDashboardData() {
    try {
        showLoading(true);
        
        // Cargar paquetes para estadísticas
        await loadPackages();
        await loadMessages();
        
        updateDashboardStats();
        updateRecentActivity();
        
    } catch (error) {
        console.error('Error al cargar datos del dashboard:', error);
        showNotification('Error al cargar datos del dashboard', 'error');
    } finally {
        showLoading(false);
    }
}

// Actualizar estadísticas del dashboard
function updateDashboardStats() {
    const totalPackages = packages.length;
    const internationalPackages = packages.filter(p => p.category === 'internacional').length;
    const nationalPackages = packages.filter(p => p.category === 'nacional').length;
    const totalMessages = messages.length;

    document.getElementById('totalPackages').textContent = totalPackages;
    document.getElementById('internationalPackages').textContent = internationalPackages;
    document.getElementById('nationalPackages').textContent = nationalPackages;
    document.getElementById('totalMessages').textContent = totalMessages;
}

// Actualizar actividad reciente
function updateRecentActivity() {
    const activityList = document.getElementById('recentActivity');
    
    // Crear actividades de ejemplo basadas en los datos
    const activities = [];
    
    if (messages.length > 0) {
        const latestMessage = messages[0];
        activities.push({
            icon: 'fas fa-envelope',
            text: `Nuevo mensaje de ${latestMessage.name || 'Cliente'}`,
            time: formatDate(latestMessage.created_at || new Date())
        });
    }
    
    if (packages.length > 0) {
        activities.push({
            icon: 'fas fa-suitcase-rolling',
            text: `${packages.length} paquetes disponibles`,
            time: 'Hoy'
        });
    }

    activities.push({
        icon: 'fas fa-user-shield',
        text: 'Sesión de administrador iniciada',
        time: 'Hace unos minutos'
    });

    if (activities.length === 0) {
        activityList.innerHTML = '<p class="text-center text-muted">No hay actividad reciente</p>';
        return;
    }

    activityList.innerHTML = activities.map(activity => `
        <div class="activity-item">
            <div class="activity-icon">
                <i class="${activity.icon}"></i>
            </div>
            <div class="activity-content">
                <p>${activity.text}</p>
                <small>${activity.time}</small>
            </div>
        </div>
    `).join('');
}

// Cargar paquetes
async function loadPackages() {
    try {
        const response = await fetch(`${API_BASE_URL}/packages`);
        if (response.ok) {
            packages = await response.json();
            displayPackages();
        } else {
            throw new Error('Error al cargar paquetes');
        }
    } catch (error) {
        console.error('Error:', error);
        showNotification('Error al cargar paquetes', 'error');
    }
}

// Mostrar paquetes en la tabla
function displayPackages() {
    const tbody = document.querySelector('#packagesTable tbody');
    
    if (packages.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center">No hay paquetes disponibles</td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = '';

    packages.forEach(package => {
        const row = document.createElement('tr');
        row.style.cursor = 'pointer';
        row.className = 'package-row';

        row.innerHTML = `
            <td class="package-image-cell">
                <img src="${package.image}" alt="${package.title}" onerror="this.src='https://via.placeholder.com/60x40?text=IMG'">
            </td>
            <td>
                <strong>${package.title}</strong>
                <br>
                <small class="text-muted">${package.description.substring(0, 50)}...</small>
            </td>
            <td>
                <span class="package-category category-${package.category}">${package.category}</span>
            </td>
            <td><strong>${formatDisplayPrice(package.price)}</strong></td>
            <td class="actions-cell">
                <button class="btn btn-sm btn-secondary" onclick="editPackage(${package.id}); event.stopPropagation();">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button class="btn btn-sm btn-danger" onclick="deletePackage(${package.id}); event.stopPropagation();">
                    <i class="fas fa-trash"></i> Eliminar
                </button>
            </td>
        `;

        // Agregar click handler para toda la fila
        row.addEventListener('click', function(e) {
            // Solo redirigir si no se hizo click en los botones de acciones
            if (!e.target.closest('.actions-cell')) {
                window.open(`/package-detail.html?id=${package.id}`, '_blank');
            }
        });

        tbody.appendChild(row);
    });
}

// Cargar mensajes
async function loadMessages() {
    try {
        const token = localStorage.getItem('admin_token');
        const response = await fetch(`${API_BASE_URL}/admin/contact-messages`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            messages = await response.json();
            displayMessages();
        } else {
            throw new Error('Error al cargar mensajes');
        }
    } catch (error) {
        console.error('Error:', error);
        // Mostrar mensajes de ejemplo si falla
        messages = [];
        displayMessages();
    }
}

// Mostrar mensajes
function displayMessages() {
    const messagesList = document.getElementById('messagesList');
    
    if (messages.length === 0) {
        messagesList.innerHTML = `
            <div class="message-card">
                <div class="message-content">
                    <p class="text-center text-muted">No hay mensajes disponibles</p>
                </div>
            </div>
        `;
        return;
    }

    messagesList.innerHTML = messages.map(message => `
        <div class="message-card">
            <div class="message-header">
                <div class="message-info">
                    <h4>${message.name}</h4>
                    <p>${message.email}${message.phone ? ` • ${message.phone}` : ''}</p>
                </div>
                <div class="message-date">
                    ${formatDate(message.created_at)}
                </div>
            </div>
            <div class="message-content">
                ${message.message}
            </div>
        </div>
    `).join('');
}

// Abrir modal de paquete
function openPackageModal(packageId = null) {
    const modal = document.getElementById('packageModal');
    const modalTitle = document.getElementById('modalTitle');
    const form = document.getElementById('packageForm');
    const submitBtn = document.getElementById('submitBtnText');
    const gallerySection = document.getElementById('gallerySection');

    currentPackageId = packageId;

    if (packageId) {
        // Editar paquete existente
        const package = packages.find(p => p.id === packageId);
        if (package) {
            modalTitle.textContent = 'Editar Paquete';
            submitBtn.textContent = 'Actualizar Paquete';
            
            // Establecer packageId global y en el dataset del formulario
            window.currentPackageId = packageId;
            document.getElementById('packageForm').dataset.packageId = packageId;
            
            // Llenar formulario con datos existentes
            document.getElementById('title').value = package.title;
            document.getElementById('description').value = package.description;
            
            // Parsear y cargar precio con moneda
            const parsedPrice = parseHotelPrice(package.price);
            document.getElementById('priceCurrency').value = parsedPrice.currency;
            document.getElementById('price').value = parsedPrice.amount;
            
            document.getElementById('priceTag').value = package.price_tag || 'DESDE';
            document.getElementById('image').value = package.image;
            document.getElementById('category').value = package.category;
            // Cargar características desde la nueva API
            loadFeaturesIntoTextarea(packageId);
            
            // Llenar campos adicionales
            document.getElementById('duration').value = package.duration || '';
            document.getElementById('destination').value = package.destination || '';
            document.getElementById('idealFor').value = package.ideal_for || '';
            
            // Mostrar sección de galería y cargarla
            gallerySection.style.display = 'block';
            loadPackageGallery(packageId);
            
            // Mostrar sección de hoteles y cargarlos
            const hotelsSection = document.getElementById('hotelsSection');
            hotelsSection.style.display = 'block';
            loadPackageHotels(packageId);
            
            // Mostrar sección de información del paquete y cargarla
            const packageInfoSection = document.getElementById('packageInfoSection');
            packageInfoSection.style.display = 'block';
            loadPackageInfo(packageId);
            
            // Mostrar sección de características y cargarlas
            const packageFeaturesSection = document.getElementById('packageFeaturesSection');
            packageFeaturesSection.style.display = 'block';
            loadPackageFeatures(packageId);
            
            // Cargar itinerario
            loadItineraryData(package.itinerary || []);
        }
    } else {
        // Crear nuevo paquete
        modalTitle.textContent = 'Agregar Paquete';
        submitBtn.textContent = 'Guardar Paquete';
        form.reset();
        
        // Ocultar sección de galería para paquetes nuevos
        gallerySection.style.display = 'none';
        
        // Ocultar sección de hoteles para paquetes nuevos
        const hotelsSection = document.getElementById('hotelsSection');
        hotelsSection.style.display = 'none';
        
        // Ocultar secciones de información y características para paquetes nuevos
        const packageInfoSection = document.getElementById('packageInfoSection');
        packageInfoSection.style.display = 'none';
        const packageFeaturesSection = document.getElementById('packageFeaturesSection');
        packageFeaturesSection.style.display = 'none';
        
        // Limpiar datos temporales
        clearTempHotels();
        clearItineraryData();
    }

    // Inicializar manejadores de galería
    initializeGalleryHandlers();
    
    // Inicializar manejadores de imagen de portada
    initializeCoverImageHandlers();
    
    // Inicializar manejadores de hoteles
    initializeHotelHandlers();
    
    // Ocultar áreas de input de hoteles al abrir modal y limpiar formularios
    hideHotelAddOptions();
    clearHotelUrlForm();
    clearHotelUploadForm();
    clearSelectedAmenities(); // Limpiar todas las amenities
    
    modal.style.display = 'block';
    
    // Inicializar manejadores de itinerario DESPUÉS de mostrar el modal
    setTimeout(() => {
        initializeItineraryHandlers();
    }, 10);
}

// Editar paquete
function editPackage(id) {
    openPackageModal(id);
}

// Eliminar paquete
async function deletePackage(id) {
    if (!confirm('¿Estás seguro de que quieres eliminar este paquete?')) {
        return;
    }

    try {
        showLoading(true);
        const token = localStorage.getItem('admin_token');
        
        const response = await fetch(`${API_BASE_URL}/admin/packages/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            showNotification('Paquete eliminado correctamente', 'success');
            await loadPackages();
            updateDashboardStats();
        } else {
            throw new Error('Error al eliminar el paquete');
        }
    } catch (error) {
        console.error('Error:', error);
        showNotification('Error al eliminar el paquete', 'error');
    } finally {
        showLoading(false);
    }
}

// Manejar envío del formulario de paquete
// Capturar hotel pendiente en formulario sin agregar a la lista
function collectPendingHotel() {
    // Chequear formulario de URL
    const urlInput = document.getElementById('hotelUrlInput');
    if (urlInput && urlInput.style.display !== 'none') {
        const name = document.getElementById('hotelUrlName').value.trim();
        const amount = document.getElementById('hotelUrlPrice').value.trim();
        const imageUrl = document.getElementById('hotelImageUrl').value.trim();
        const destination = document.getElementById('hotelUrlDestination').value.trim();
        if (name && amount && imageUrl && destination) {
            addHotelFromUrl();
            return true;
        }
    }
    // Chequear formulario de upload
    const uploadArea = document.getElementById('hotelUploadArea');
    if (uploadArea && uploadArea.style.display !== 'none') {
        const name = document.getElementById('hotelName').value.trim();
        const amount = document.getElementById('hotelPrice').value.trim();
        const destination = document.getElementById('hotelDestination').value.trim();
        if (name && amount && destination && window.tempHotelImageUrl) {
            addHotelFromUpload();
            return true;
        }
    }
    return false;
}

async function handlePackageSubmit(e) {
    e.preventDefault();

    // Auto-agregar hotel pendiente si hay datos completos en el formulario
    collectPendingHotel();

    console.log('=== INICIANDO GUARDADO DE PAQUETE ===');
    console.log('Hoteles temporales antes del guardado:', tempHotels);

    // Verificar validez del formulario
    const form = e.target;
    if (!form.checkValidity()) {
        console.error('Formulario inválido');
        form.reportValidity();
        return;
    }
    
    // Validar que haya una imagen (URL o subida)
    const imageValue = document.getElementById('image').value.trim();
    if (!imageValue) {
        showNotification('Debes proporcionar una URL de imagen o subir un archivo', 'error');
        return;
    }
    
    const formData = new FormData(e.target);
    
    // Formatear precio con moneda
    const priceCurrency = document.getElementById('priceCurrency').value;
    const priceAmount = formData.get('price');
    const formattedPrice = formatHotelPrice(priceCurrency, priceAmount);
    console.log('=== DEBUG PRECIO ===');
    console.log('currentPackageId:', currentPackageId);
    console.log('priceCurrency:', priceCurrency);
    console.log('priceAmount:', priceAmount);
    console.log('formattedPrice:', formattedPrice);

    // Manejar features - puede estar vacío
    const featuresText = formData.get('features') || '';
    const featuresArray = featuresText.split('\n').filter(f => f.trim());

    const packageData = {
        title: formData.get('title'),
        description: formData.get('description'),
        price: formattedPrice,
        price_tag: document.getElementById('priceTag').value,
        image: formData.get('image'),
        category: formData.get('category'),
        features: featuresArray,
        duration: formData.get('duration') || null,
        destination: formData.get('destination') || null,
        ideal_for: formData.get('idealFor') || null,
        itinerary: collectItineraryData()
    };

    try {
        showLoading(true);
        const token = localStorage.getItem('admin_token');
        
        const url = currentPackageId 
            ? `${API_BASE_URL}/admin/packages/${currentPackageId}`
            : `${API_BASE_URL}/admin/packages`;
            
        const method = currentPackageId ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(packageData)
        });

        if (response.ok) {
            const savedPackage = await response.json();
            const packageId = savedPackage.id || currentPackageId;
            console.log('Paquete guardado, ID:', packageId);
            
            // Guardar/actualizar hoteles después de guardar el paquete
            try {
                if (tempHotels.length > 0) {
                    console.log('Iniciando guardado de hoteles...');
                    await saveHotelsToPackage(packageId);
                    console.log('Hoteles guardados exitosamente');
                } else {
                    console.log('No hay hoteles que guardar');
                }
            } catch (hotelError) {
                console.error('Error al guardar hoteles:', hotelError);
                showNotification('Paquete guardado, pero hubo errores con los hoteles: ' + hotelError.message, 'warning');
            }

            // Sincronizar características del textarea a la tabla PackageFeature
            try {
                if (featuresArray.length > 0) {
                    console.log('Sincronizando características a PackageFeature...');
                    await syncFeaturesToPackageFeatureTable(packageId, featuresArray);
                    console.log('Características sincronizadas exitosamente');
                }
            } catch (featError) {
                console.error('Error al sincronizar características:', featError);
            }
            
            const action = currentPackageId ? 'actualizado' : 'creado';
            showNotification(`Paquete ${action} correctamente`, 'success');
            
            document.getElementById('packageModal').style.display = 'none';
            
            // Limpiar datos temporales SOLO después de que todo se haya guardado
            console.log('Limpiando datos temporales...');
            clearTempHotels();
            clearItineraryData();
            
            await loadPackages();
            updateDashboardStats();
        } else {
            const errorText = await response.text();
            console.error('Error del servidor:', errorText);
            throw new Error('Error al guardar el paquete: ' + errorText);
        }
    } catch (error) {
        console.error('Error:', error);
        showNotification('Error al guardar el paquete', 'error');
    } finally {
        showLoading(false);
    }
}

// Cerrar sesión
function logout() {
    if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
        localStorage.removeItem('admin_token');
        showLoginOnly();
    }
}

// Mostrar/ocultar loading
function showLoading(show) {
    const loadingOverlay = document.getElementById('loadingOverlay');
    loadingOverlay.style.display = show ? 'block' : 'none';
}

// Mostrar notificaciones
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
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
        background: ${type === 'success' ? '#28a745' : type === 'warning' ? '#ffc107' : '#dc3545'};
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Formatear fecha
function formatDate(dateString) {
    if (!dateString) return 'Fecha no disponible';
    
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-AR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (error) {
        return 'Fecha no válida';
    }
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
    
    .text-center {
        text-align: center;
    }
    
    .text-muted {
        color: var(--gray) !important;
    }
`;
document.head.appendChild(style);

// === FUNCIONES PARA GESTIÓN DE GALERÍA ===

// Inicializar manejadores de galería
function initializeGalleryHandlers() {
    // Botones principales
    const addImageUrlBtn = document.getElementById('addImageUrlBtn');
    const addImageFileBtn = document.getElementById('addImageFileBtn');
    const uploadZone = document.getElementById('uploadZone');
    const fileInput = document.getElementById('fileInput');
    const addUrlImageBtn = document.getElementById('addUrlImageBtn');
    const cancelUrlBtn = document.getElementById('cancelUrlBtn');

    // Limpiar event listeners previos
    if (addImageUrlBtn) {
        addImageUrlBtn.replaceWith(addImageUrlBtn.cloneNode(true));
        document.getElementById('addImageUrlBtn').addEventListener('click', showUrlInput);
    }
    
    if (addImageFileBtn) {
        addImageFileBtn.replaceWith(addImageFileBtn.cloneNode(true));
        document.getElementById('addImageFileBtn').addEventListener('click', showFileUpload);
    }

    // Upload zone
    if (uploadZone) {
        uploadZone.replaceWith(uploadZone.cloneNode(true));
        const newUploadZone = document.getElementById('uploadZone');
        newUploadZone.addEventListener('click', () => document.getElementById('fileInput').click());
        
        // Drag & Drop
        newUploadZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            newUploadZone.classList.add('dragover');
        });
        
        newUploadZone.addEventListener('dragleave', () => {
            newUploadZone.classList.remove('dragover');
        });
        
        newUploadZone.addEventListener('drop', (e) => {
            e.preventDefault();
            newUploadZone.classList.remove('dragover');
            const files = e.dataTransfer.files;
            handleFileUpload(files);
        });
    }

    // File input
    if (fileInput) {
        fileInput.replaceWith(fileInput.cloneNode(true));
        document.getElementById('fileInput').addEventListener('change', (e) => {
            handleFileUpload(e.target.files);
        });
    }

    // Botones de URL
    if (addUrlImageBtn) {
        addUrlImageBtn.replaceWith(addUrlImageBtn.cloneNode(true));
        document.getElementById('addUrlImageBtn').addEventListener('click', addImageByUrl);
    }
    
    if (cancelUrlBtn) {
        cancelUrlBtn.replaceWith(cancelUrlBtn.cloneNode(true));
        document.getElementById('cancelUrlBtn').addEventListener('click', hideUrlInput);
    }
}

// Cargar galería de un paquete
async function loadPackageGallery(packageId) {
    try {
        const response = await fetch(`${API_BASE_URL}/packages/${packageId}/gallery`);
        if (response.ok) {
            const galleryImages = await response.json();
            
            // Si no hay imágenes en galería, crear una entrada para la imagen principal
            if (galleryImages.length === 0) {
                await createMainImageInGallery(packageId);
                // Recargar después de crear
                const retryResponse = await fetch(`${API_BASE_URL}/packages/${packageId}/gallery`);
                if (retryResponse.ok) {
                    const retryGalleryImages = await retryResponse.json();
                    displayGallery(retryGalleryImages);
                } else {
                    displayGallery([]);
                }
            } else {
                displayGallery(galleryImages);
            }
        } else {
            displayGallery([]);
        }
    } catch (error) {
        console.error('Error cargando galería:', error);
        displayGallery([]);
    }
}

// Mostrar galería
function displayGallery(images) {
    const galleryManagement = document.getElementById('galleryManagement');
    
    if (images.length === 0) {
        galleryManagement.innerHTML = `
            <div class="gallery-empty">
                <i class="fas fa-images"></i>
                <p>No hay imágenes en la galería</p>
            </div>
        `;
        return;
    }

    const galleryGrid = images.map(image => `
        <div class="gallery-item" data-image-id="${image.id}">
            <img src="${image.image_url}" alt="${image.caption || 'Imagen'}" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22120%22 height=%2280%22><rect width=%22100%25%22 height=%22100%25%22 fill=%22%23f0f0f0%22/><text x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 fill=%22%23999%22 font-size=%2212%22>Error</text></svg>'">
            <div class="gallery-item-info">
                <div class="gallery-item-caption" onclick="event.stopPropagation(); editGalleryImageCaption(${image.id}, '${(image.caption || '').replace(/'/g, "\\'")}')}" title="Click para editar descripción">${image.caption || 'Sin descripción'}</div>
                <div class="gallery-item-actions">
                    <button type="button" class="btn-edit" onclick="event.stopPropagation(); editGalleryImageCaption(${image.id}, '${(image.caption || '').replace(/'/g, "\\'")}');" title="Editar descripción">
                        <i class="fas fa-edit"></i>
                    </button>
                    ${!image.is_cover ? `
                        <button type="button" class="btn-cover" onclick="event.stopPropagation(); setCoverImage(${image.id});" title="Marcar como principal">
                            <i class="fas fa-star"></i>
                        </button>
                    ` : ''}
                    <button type="button" class="btn-delete" onclick="event.stopPropagation(); deleteGalleryImage(${image.id});" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    galleryManagement.innerHTML = `<div class="gallery-grid">${galleryGrid}</div>`;
}

// Mostrar input de URL
function showUrlInput() {
    document.getElementById('urlInput').style.display = 'block';
    document.getElementById('uploadArea').style.display = 'none';
    document.getElementById('imageUrl').focus();
}

// Ocultar input de URL
function hideUrlInput() {
    document.getElementById('urlInput').style.display = 'none';
    document.getElementById('imageUrl').value = '';
    document.getElementById('imageCaption').value = '';
}

// Mostrar área de subida de archivos
function showFileUpload() {
    document.getElementById('uploadArea').style.display = 'block';
    document.getElementById('urlInput').style.display = 'none';
}

// Agregar imagen por URL
async function addImageByUrl() {
    const imageUrl = document.getElementById('imageUrl').value.trim();
    const caption = document.getElementById('imageCaption').value.trim();
    
    if (!imageUrl) {
        showGalleryNotification('Por favor ingresa una URL', 'error');
        return;
    }

    try {
        const token = localStorage.getItem('admin_token');
        const response = await fetch(`${API_BASE_URL}/admin/packages/${currentPackageId}/gallery/url`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                image_url: imageUrl,
                caption: caption || null
            })
        });

        if (response.ok) {
            showGalleryNotification('Imagen agregada correctamente', 'success');
            hideUrlInput();
            loadPackageGallery(currentPackageId);
        } else {
            throw new Error('Error al agregar imagen');
        }
    } catch (error) {
        console.error('Error:', error);
        showGalleryNotification('Error al agregar imagen por URL', 'error');
    }
}

// Manejar subida de archivos
async function handleFileUpload(files) {
    if (!files || files.length === 0) return;

    const token = localStorage.getItem('admin_token');
    const uploadProgress = document.getElementById('uploadProgress');
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');

    uploadProgress.style.display = 'block';

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Validar archivo
        if (!file.type.startsWith('image/')) {
            showGalleryNotification(`${file.name} no es un archivo de imagen válido`, 'error');
            continue;
        }

        if (file.size > 5 * 1024 * 1024) { // 5MB
            showGalleryNotification(`${file.name} es muy grande (máximo 5MB)`, 'error');
            continue;
        }

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('caption', file.name.replace(/\.[^/.]+$/, ""));

            // Actualizar progreso
            const progress = ((i + 1) / files.length) * 100;
            progressFill.style.width = progress + '%';
            progressText.textContent = `${Math.round(progress)}% (${i + 1}/${files.length})`;

            const response = await fetch(`${API_BASE_URL}/admin/packages/${currentPackageId}/gallery/upload`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error(`Error al subir ${file.name}`);
            }

        } catch (error) {
            console.error('Error subiendo archivo:', error);
            showGalleryNotification(`Error al subir ${file.name}`, 'error');
        }
    }

    // Ocultar progreso y recargar galería
    setTimeout(() => {
        uploadProgress.style.display = 'none';
        progressFill.style.width = '0%';
        progressText.textContent = '0%';
        loadPackageGallery(currentPackageId);
        showGalleryNotification('Imágenes subidas a Cloudinary correctamente', 'success');
    }, 500);
}

// Editar descripción de imagen de galería
function editGalleryImageCaption(imageId, currentCaption = '') {
    const caption = prompt('Descripción de la imagen:', currentCaption);
    if (caption === null) return; // Usuario canceló

    updateGalleryImage(imageId, { caption: caption.trim() || null });
}

// Marcar como imagen principal
async function setCoverImage(imageId) {
    if (!confirm('¿Marcar esta imagen como principal?')) return;

    await updateGalleryImage(imageId, { is_cover: 1 });
}

// Actualizar imagen de galería
async function updateGalleryImage(imageId, data) {
    try {
        const token = localStorage.getItem('admin_token');
        const response = await fetch(`${API_BASE_URL}/admin/packages/${currentPackageId}/gallery/${imageId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            showGalleryNotification('Imagen actualizada correctamente', 'success');
            loadPackageGallery(currentPackageId);
        } else {
            throw new Error('Error al actualizar imagen');
        }
    } catch (error) {
        console.error('Error:', error);
        showGalleryNotification('Error al actualizar imagen', 'error');
    }
}

// Eliminar imagen de galería
async function deleteGalleryImage(imageId) {
    if (!confirm('¿Eliminar esta imagen de la galería?')) return;

    try {
        const token = localStorage.getItem('admin_token');
        const response = await fetch(`${API_BASE_URL}/admin/packages/${currentPackageId}/gallery/${imageId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            showGalleryNotification('Imagen eliminada correctamente', 'success');
            loadPackageGallery(currentPackageId);
        } else {
            throw new Error('Error al eliminar imagen');
        }
    } catch (error) {
        console.error('Error:', error);
        showGalleryNotification('Error al eliminar imagen', 'error');
    }
}

// Mostrar notificación específica para galería
function showGalleryNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `gallery-notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Mostrar
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Ocultar
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// === FUNCIONES PARA IMAGEN DE PORTADA ===

// Inicializar manejadores de imagen de portada
function initializeCoverImageHandlers() {
    const uploadCoverBtn = document.getElementById('uploadCoverImageBtn');
    const coverUploadArea = document.getElementById('coverUploadArea');
    const coverUploadZone = document.getElementById('coverUploadZone');
    const coverFileInput = document.getElementById('coverFileInput');
    const imageInput = document.getElementById('image');
    const removeCoverPreview = document.getElementById('removeCoverPreview');

    // Limpiar event listeners previos
    if (uploadCoverBtn) {
        uploadCoverBtn.replaceWith(uploadCoverBtn.cloneNode(true));
        document.getElementById('uploadCoverImageBtn').addEventListener('click', toggleCoverUploadArea);
    }

    // Upload zone
    if (coverUploadZone) {
        coverUploadZone.replaceWith(coverUploadZone.cloneNode(true));
        const newCoverUploadZone = document.getElementById('coverUploadZone');
        newCoverUploadZone.addEventListener('click', () => document.getElementById('coverFileInput').click());
        
        // Drag & Drop para imagen de portada
        newCoverUploadZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            newCoverUploadZone.classList.add('dragover');
        });
        
        newCoverUploadZone.addEventListener('dragleave', () => {
            newCoverUploadZone.classList.remove('dragover');
        });
        
        newCoverUploadZone.addEventListener('drop', (e) => {
            e.preventDefault();
            newCoverUploadZone.classList.remove('dragover');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                handleCoverImageUpload(files[0]);
            }
        });
    }

    // File input para imagen de portada
    if (coverFileInput) {
        coverFileInput.replaceWith(coverFileInput.cloneNode(true));
        document.getElementById('coverFileInput').addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                handleCoverImageUpload(e.target.files[0]);
            }
        });
    }

    // Actualizar preview cuando cambie la URL manualmente
    if (imageInput) {
        imageInput.addEventListener('input', updateCoverImagePreview);
        imageInput.addEventListener('blur', updateCoverImagePreview);
    }

    // Botón para quitar preview
    if (removeCoverPreview) {
        removeCoverPreview.replaceWith(removeCoverPreview.cloneNode(true));
        document.getElementById('removeCoverPreview').addEventListener('click', removeCoverImagePreview);
    }

    // Inicializar preview si ya hay una URL
    updateCoverImagePreview();
}

// Mostrar/ocultar área de subida de portada
function toggleCoverUploadArea() {
    const coverUploadArea = document.getElementById('coverUploadArea');
    const isVisible = coverUploadArea.style.display !== 'none';
    
    coverUploadArea.style.display = isVisible ? 'none' : 'block';
    
    if (!isVisible) {
        // Reset file input
        document.getElementById('coverFileInput').value = '';
    }
}

// Manejar subida de imagen de portada
async function handleCoverImageUpload(file) {
    if (!file) return;

    // Validar archivo
    if (!file.type.startsWith('image/')) {
        showGalleryNotification('El archivo debe ser una imagen', 'error');
        return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB
        showGalleryNotification('El archivo es muy grande (máximo 5MB)', 'error');
        return;
    }

    const token = localStorage.getItem('admin_token');
    const coverUploadProgress = document.getElementById('coverUploadProgress');
    const coverProgressFill = document.getElementById('coverProgressFill');
    const coverProgressText = document.getElementById('coverProgressText');

    try {
        // Mostrar progreso
        coverUploadProgress.style.display = 'block';
        
        // Temporalmente indicar que se está subiendo en el campo de URL
        const imageInput = document.getElementById('image');
        const originalPlaceholder = imageInput.placeholder;
        imageInput.placeholder = 'Subiendo imagen...';
        
        const formData = new FormData();
        formData.append('file', file);

        // Simular progreso
        let progress = 0;
        const progressInterval = setInterval(() => {
            progress += 10;
            if (progress <= 90) {
                coverProgressFill.style.width = progress + '%';
                coverProgressText.textContent = progress + '%';
            }
        }, 100);

        const response = await fetch(`${API_BASE_URL}/admin/upload-cover-image`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        clearInterval(progressInterval);

        if (response.ok) {
            const result = await response.json();
            
            // Completar progreso
            coverProgressFill.style.width = '100%';
            coverProgressText.textContent = '100%';
            
            // Actualizar campo de URL con la imagen subida
            const imageInput = document.getElementById('image');
            imageInput.value = result.image_url;
            
            // Quitar cualquier estado de error de validación
            imageInput.setCustomValidity('');
            imageInput.classList.remove('error');
            
            // Actualizar preview
            updateCoverImagePreview();
            
            // Restaurar placeholder
            imageInput.placeholder = originalPlaceholder;
            
            // Ocultar área de upload
            setTimeout(() => {
                document.getElementById('coverUploadArea').style.display = 'none';
                coverUploadProgress.style.display = 'none';
                coverProgressFill.style.width = '0%';
                coverProgressText.textContent = '0%';
            }, 1000);
            
            // Mostrar mensaje apropiado según donde se guardó
            const message = result.image_url.includes('cloudinary.com') 
                ? 'Imagen subida a Cloudinary correctamente' 
                : 'Imagen subida localmente correctamente';
            showGalleryNotification(message, 'success');
        } else {
            throw new Error('Error al subir imagen');
        }
    } catch (error) {
        console.error('Error:', error);
        showGalleryNotification('Error al subir imagen de portada', 'error');
        
        // Restaurar placeholder
        const imageInput = document.getElementById('image');
        imageInput.placeholder = 'https://... o sube una imagen';
        
        // Ocultar progreso
        coverUploadProgress.style.display = 'none';
        coverProgressFill.style.width = '0%';
        coverProgressText.textContent = '0%';
    }
}

// Actualizar preview de imagen de portada
function updateCoverImagePreview() {
    const imageInput = document.getElementById('image');
    const coverImagePreview = document.getElementById('coverImagePreview');
    const coverPreviewImg = document.getElementById('coverPreviewImg');
    
    const imageUrl = imageInput.value.trim();
    
    if (imageUrl && (imageUrl.startsWith('http') || imageUrl.startsWith('/static'))) {
        coverPreviewImg.src = imageUrl;
        coverImagePreview.style.display = 'block';
        
        // Manejar error de carga de imagen
        coverPreviewImg.onerror = () => {
            coverImagePreview.style.display = 'none';
        };
    } else {
        coverImagePreview.style.display = 'none';
    }
}

// Quitar preview de imagen de portada
function removeCoverImagePreview() {
    document.getElementById('image').value = '';
    document.getElementById('coverImagePreview').style.display = 'none';
    
    // También ocultar área de upload si está visible
    document.getElementById('coverUploadArea').style.display = 'none';
}

// Crear entrada en galería para imagen principal
async function createMainImageInGallery(packageId) {
    try {
        // Obtener datos del paquete para conseguir la imagen principal
        const packageResponse = await fetch(`${API_BASE_URL}/packages/${packageId}`);
        if (!packageResponse.ok) return;
        
        const packageData = await packageResponse.json();
        const mainImageUrl = packageData.image;
        
        if (!mainImageUrl) return;
        
        const token = localStorage.getItem('admin_token');
        const response = await fetch(`${API_BASE_URL}/admin/packages/${packageId}/gallery/url`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                image_url: mainImageUrl,
                caption: `${packageData.title} - Imagen principal`,
                is_cover: 1
            })
        });

        if (!response.ok) {
            console.error('Error creando imagen principal en galería');
        }
    } catch (error) {
        console.error('Error al crear imagen principal en galería:', error);
    }
}

// === CAROUSEL MANAGEMENT ===

// Initialize carousel management
function initCarouselManagement() {
    const refreshBtn = document.getElementById('refreshCarouselBtn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', loadCarouselPackages);
    }
}

// Load packages for carousel management
async function loadCarouselPackages() {
    try {
        const token = localStorage.getItem('admin_token');
        const response = await fetch(`${API_BASE_URL}/packages`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const allPackages = await response.json();
            displayCarouselPackages(allPackages);
        } else {
            showNotification('Error al cargar paquetes', 'error');
        }
    } catch (error) {
        console.error('Error loading carousel packages:', error);
        showNotification('Error al cargar paquetes', 'error');
    }
}

// Display packages in carousel management interface
function displayCarouselPackages(packages) {
    const promotedContainer = document.getElementById('promotedPackages');
    const nonPromotedContainer = document.getElementById('nonPromotedPackages');

    if (!promotedContainer || !nonPromotedContainer) return;

    // Separate promoted and non-promoted packages
    const promoted = packages.filter(pkg => pkg.promoted).sort((a, b) => a.carousel_order - b.carousel_order);
    const nonPromoted = packages.filter(pkg => !pkg.promoted);

    // Display promoted packages
    if (promoted.length === 0) {
        promotedContainer.innerHTML = '<div class="carousel-empty">No hay paquetes promocionados</div>';
    } else {
        promotedContainer.innerHTML = promoted.map((pkg, index) => createCarouselPackageCard(pkg, true, index + 1)).join('');
        addCarouselClickHandlers(promotedContainer);
    }

    // Display non-promoted packages
    if (nonPromoted.length === 0) {
        nonPromotedContainer.innerHTML = '<div class="carousel-empty">Todos los paquetes están promocionados</div>';
    } else {
        nonPromotedContainer.innerHTML = nonPromoted.map(pkg => createCarouselPackageCard(pkg, false)).join('');
        addCarouselClickHandlers(nonPromotedContainer);
    }

    // Initialize drag and drop
    initCarouselDragAndDrop();
}

// Create carousel package card
function createCarouselPackageCard(pkg, isPromoted, order = null) {
    const statusClass = isPromoted ? 'promoted' : 'not-promoted';
    const statusText = isPromoted ? 'Promocionado' : 'Sin Promocionar';
    const buttonClass = isPromoted ? 'demote' : 'promote';
    const buttonText = isPromoted ? 'Despromocionar' : 'Promocionar';
    const buttonIcon = isPromoted ? 'fas fa-star-half-alt' : 'fas fa-star';

    return `
        <div class="carousel-package-item clickable-card" data-package-id="${pkg.id}" data-promoted="${isPromoted}" style="cursor: pointer;">
            ${isPromoted ? `<div class="carousel-order-badge">Orden: ${order}</div>` : ''}

            <div class="carousel-package-header">
                <div class="carousel-package-info">
                    <h4>${pkg.title}</h4>
                    <p>${pkg.category} - ${formatDisplayPrice(pkg.price)}</p>
                </div>

                <div class="carousel-package-controls" onclick="event.stopPropagation();">
                    <span class="promotion-status ${statusClass}">${statusText}</span>
                    <button class="btn-toggle-promotion ${buttonClass}"
                            onclick="togglePackagePromotion(${pkg.id}, ${!isPromoted}); event.stopPropagation();">
                        <i class="${buttonIcon}"></i>
                        ${buttonText}
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Add click handlers to carousel package cards
function addCarouselClickHandlers(container) {
    const cards = container.querySelectorAll('.clickable-card');
    cards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Solo redirigir si no se hizo click en los controles
            if (!e.target.closest('.carousel-package-controls')) {
                const packageId = card.dataset.packageId;
                window.open(`/package-detail.html?id=${packageId}`, '_blank');
            }
        });
    });
}

// Toggle package promotion
async function togglePackagePromotion(packageId, promote) {
    try {
        const token = localStorage.getItem('admin_token');
        const response = await fetch(`${API_BASE_URL}/admin/packages/${packageId}/promote?promoted=${promote}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            showNotification(promote ? 'Paquete promocionado exitosamente' : 'Paquete despromovido exitosamente', 'success');
            loadCarouselPackages(); // Reload to reflect changes
        } else {
            showNotification('Error al cambiar promoción', 'error');
        }
    } catch (error) {
        console.error('Error toggling promotion:', error);
        showNotification('Error al cambiar promoción', 'error');
    }
}

// Initialize drag and drop for carousel ordering
function initCarouselDragAndDrop() {
    const packageItems = document.querySelectorAll('.carousel-package-item');
    const promotedContainer = document.getElementById('promotedPackages');

    packageItems.forEach(item => {
        item.draggable = true;
        
        item.addEventListener('dragstart', (e) => {
            item.classList.add('dragging');
            e.dataTransfer.setData('text/plain', item.dataset.packageId);
        });

        item.addEventListener('dragend', () => {
            item.classList.remove('dragging');
        });
    });

    // Add drop functionality to promoted packages container
    if (promotedContainer) {
        promotedContainer.addEventListener('dragover', (e) => {
            e.preventDefault();
            promotedContainer.classList.add('drag-over');
        });

        promotedContainer.addEventListener('dragleave', () => {
            promotedContainer.classList.remove('drag-over');
        });

        promotedContainer.addEventListener('drop', (e) => {
            e.preventDefault();
            promotedContainer.classList.remove('drag-over');
            
            const packageId = e.dataTransfer.getData('text/plain');
            const draggedItem = document.querySelector(`[data-package-id="${packageId}"]`);
            
            if (draggedItem && draggedItem.dataset.promoted === 'true') {
                // Reorder within promoted packages
                reorderPromotedPackages(e, packageId);
            }
        });
    }
}

// Reorder promoted packages
async function reorderPromotedPackages(dropEvent, draggedPackageId) {
    const promotedContainer = document.getElementById('promotedPackages');
    const promotedItems = Array.from(promotedContainer.querySelectorAll('.carousel-package-item'));
    
    // Find the position where to insert
    const afterElement = getDragAfterElement(promotedContainer, dropEvent.clientY);
    const draggedElement = document.querySelector(`[data-package-id="${draggedPackageId}"]`);
    
    if (afterElement == null) {
        promotedContainer.appendChild(draggedElement);
    } else {
        promotedContainer.insertBefore(draggedElement, afterElement);
    }

    // Update order in backend
    const newOrder = Array.from(promotedContainer.querySelectorAll('.carousel-package-item'))
        .map((item, index) => ({
            id: parseInt(item.dataset.packageId),
            order: index + 1
        }));

    try {
        const token = localStorage.getItem('admin_token');
        const response = await fetch(`${API_BASE_URL}/admin/packages/reorder-carousel`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(newOrder)
        });

        if (response.ok) {
            showNotification('Orden actualizado exitosamente', 'success');
            loadCarouselPackages(); // Reload to reflect new order
        } else {
            showNotification('Error al actualizar orden', 'error');
            loadCarouselPackages(); // Reload to revert changes
        }
    } catch (error) {
        console.error('Error updating order:', error);
        showNotification('Error al actualizar orden', 'error');
        loadCarouselPackages(); // Reload to revert changes
    }
}

// Helper function to find drag position
function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.carousel-package-item:not(.dragging)')];
    
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// Add carousel management to navigation
document.addEventListener('DOMContentLoaded', function() {
    // Add to existing navigation handler
    const menuLinks = document.querySelectorAll('.menu-link');
    menuLinks.forEach(link => {
        if (link.dataset.section === 'carousel') {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                showSection('carousel');
                loadCarouselPackages();
            });
        }
    });
    
    // Initialize carousel management
    initCarouselManagement();
});

// === FUNCIONES DE ITINERARIO ===
let currentItinerary = [];

// Variables para almacenar references a los event listeners
let itineraryEventListeners = {
    addDayHandler: null,
    clickHandler: null,
    keypressHandler: null,
    changeHandler: null,
    documentClickHandler: null,
    isInitialized: false
};

// Inicializar manejadores de itinerario
function initializeItineraryHandlers() {
    // Siempre intentar agregar listeners - remover anteriores primero
    const addDayBtn = document.getElementById('addItineraryDayBtn');
    
    if (addDayBtn) {
        // Remover listener anterior si existe
        if (itineraryEventListeners.addDayHandler) {
            addDayBtn.removeEventListener('click', itineraryEventListeners.addDayHandler);
        }
        
        itineraryEventListeners.addDayHandler = addItineraryDay;
        addDayBtn.addEventListener('click', itineraryEventListeners.addDayHandler);
    }
    
    // Event delegation para elementos dinámicos del itinerario
    const itineraryContainer = document.getElementById('itineraryManagement');
    
    if (itineraryContainer) {
        // Remover listeners anteriores si existen
        if (itineraryEventListeners.clickHandler) {
            itineraryContainer.removeEventListener('click', itineraryEventListeners.clickHandler);
        }
        if (itineraryEventListeners.keypressHandler) {
            itineraryContainer.removeEventListener('keypress', itineraryEventListeners.keypressHandler);
        }
        if (itineraryEventListeners.changeHandler) {
            itineraryContainer.removeEventListener('change', itineraryEventListeners.changeHandler);
        }
        
        itineraryEventListeners.clickHandler = handleItineraryClick;
        itineraryEventListeners.keypressHandler = handleItineraryKeypress;
        itineraryEventListeners.changeHandler = handleItineraryChange;
        
        itineraryContainer.addEventListener('click', itineraryEventListeners.clickHandler);
        itineraryContainer.addEventListener('keypress', itineraryEventListeners.keypressHandler);
        itineraryContainer.addEventListener('change', itineraryEventListeners.changeHandler);
    }
    
    // Cerrar dropdowns cuando se hace click fuera (solo una vez)
    if (!itineraryEventListeners.documentClickHandler) {
        itineraryEventListeners.documentClickHandler = function(e) {
            if (!e.target.closest('.day-icon-selector')) {
                document.querySelectorAll('.icon-dropdown').forEach(d => d.style.display = 'none');
            }
        };
        document.addEventListener('click', itineraryEventListeners.documentClickHandler);
    }
    
    itineraryEventListeners.isInitialized = true;
}

// Remover manejadores de itinerario
function removeItineraryHandlers() {
    if (!itineraryEventListeners.isInitialized) return;
    
    const addDayBtn = document.getElementById('addItineraryDayBtn');
    if (addDayBtn && itineraryEventListeners.addDayHandler) {
        addDayBtn.removeEventListener('click', itineraryEventListeners.addDayHandler);
    }
    
    const itineraryContainer = document.getElementById('itineraryManagement');
    if (itineraryContainer) {
        if (itineraryEventListeners.clickHandler) {
            itineraryContainer.removeEventListener('click', itineraryEventListeners.clickHandler);
        }
        if (itineraryEventListeners.keypressHandler) {
            itineraryContainer.removeEventListener('keypress', itineraryEventListeners.keypressHandler);
        }
        if (itineraryEventListeners.changeHandler) {
            itineraryContainer.removeEventListener('change', itineraryEventListeners.changeHandler);
        }
    }
    
    if (itineraryEventListeners.documentClickHandler) {
        document.removeEventListener('click', itineraryEventListeners.documentClickHandler);
    }
    
    // Resetear el objeto
    itineraryEventListeners = {
        addDayHandler: null,
        clickHandler: null,
        keypressHandler: null,
        changeHandler: null,
        documentClickHandler: null,
        isInitialized: false
    };
}

// Manejar eventos de click en itinerario
function handleItineraryClick(e) {
    const target = e.target.closest('[data-action]');
    if (!target) return;
    
    const action = target.dataset.action;
    const dayIndex = parseInt(target.dataset.dayIndex);
    const activityIndex = parseInt(target.dataset.activityIndex);
    
    switch (action) {
        case 'move-day':
            const direction = parseInt(target.dataset.direction);
            moveDay(dayIndex, direction);
            break;
        case 'remove-day':
            removeDay(dayIndex);
            break;
        case 'add-activity':
            addActivity(dayIndex);
            break;
        case 'edit-activity':
            editActivity(dayIndex, activityIndex);
            break;
        case 'remove-activity':
            removeActivity(dayIndex, activityIndex);
            break;
        case 'select-icon':
            toggleIconDropdown(dayIndex);
            break;
        case 'select-icon-option':
            const iconClass = target.dataset.icon;
            const parentDayIndex = parseInt(target.closest('.itinerary-day').dataset.dayIndex);
            selectIcon(parentDayIndex, iconClass);
            break;
    }
}

// Toggle dropdown de iconos
function toggleIconDropdown(dayIndex) {
    const dropdown = document.getElementById(`iconDropdown-${dayIndex}`);
    const isVisible = dropdown.style.display === 'block';
    
    // Cerrar todos los dropdowns
    document.querySelectorAll('.icon-dropdown').forEach(d => d.style.display = 'none');
    
    if (!isVisible) {
        dropdown.style.display = 'block';
    }
}

// Seleccionar icono
function selectIcon(dayIndex, iconClass) {
    if (currentItinerary[dayIndex]) {
        currentItinerary[dayIndex].icon = iconClass;
        
        // Actualizar el botón del icono
        const iconBtn = document.querySelector(`[data-action="select-icon"][data-day-index="${dayIndex}"] i`);
        if (iconBtn) {
            iconBtn.className = iconClass;
        }
        
        // Cerrar dropdown
        const dropdown = document.getElementById(`iconDropdown-${dayIndex}`);
        if (dropdown) {
            dropdown.style.display = 'none';
        }
    }
}

// Manejar eventos de keypress
function handleItineraryKeypress(e) {
    if (e.key === 'Enter' && e.target.classList.contains('add-activity-input')) {
        e.preventDefault();
        const dayIndex = parseInt(e.target.dataset.dayIndex);
        addActivity(dayIndex);
    }
}

// Manejar eventos de change
function handleItineraryChange(e) {
    if (e.target.classList.contains('day-title-input')) {
        const dayIndex = parseInt(e.target.dataset.dayIndex);
        updateDayTitle(dayIndex, e.target.value);
    } else if (e.target.classList.contains('day-description-textarea')) {
        const dayIndex = parseInt(e.target.dataset.dayIndex);
        updateDayDescription(dayIndex, e.target.value);
    }
}

// Agregar día al itinerario
function addItineraryDay() {
    const dayNumber = currentItinerary.length + 1;
    const dayData = {
        day: dayNumber,
        title: `Día ${dayNumber}`,
        description: '',
        activities: [],
        icon: 'fas fa-plane' // Icono por defecto
    };
    
    currentItinerary.push(dayData);
    renderItinerary();
}

// Renderizar itinerario completo
function renderItinerary() {
    const container = document.getElementById('itineraryManagement');
    
    if (currentItinerary.length === 0) {
        container.innerHTML = `
            <div class="itinerary-placeholder" id="itineraryPlaceholder">
                <i class="fas fa-route"></i>
                <p>No hay días en el itinerario. Haz clic en "Agregar Día" para comenzar.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = '';
    
    currentItinerary.forEach((day, index) => {
        const dayElement = createDayElement(day, index);
        container.appendChild(dayElement);
    });
}

// Crear elemento de día
function createDayElement(day, index) {
    const dayDiv = document.createElement('div');
    dayDiv.className = 'itinerary-day';
    dayDiv.dataset.dayIndex = index;
    
    dayDiv.innerHTML = `
        <div class="itinerary-day-header">
            <div class="itinerary-day-title">
                <div class="day-icon-selector" style="position: relative;">
                    <button type="button" class="day-icon-btn" data-action="select-icon" data-day-index="${index}">
                        <i class="${day.icon || 'fas fa-plane'}"></i>
                    </button>
                    <div class="icon-dropdown" id="iconDropdown-${index}" style="display: none;">
                        ${renderIconOptions()}
                    </div>
                </div>
                <input type="text" value="${day.title}" class="day-title-input" data-day-index="${index}"
                       style="border: none; background: transparent; font-weight: 600; color: var(--primary-color); font-size: 1rem;">
            </div>
            <div class="itinerary-day-controls">
                <button type="button" class="btn btn-sm btn-secondary" data-action="move-day" data-day-index="${index}" data-direction="-1" ${index === 0 ? 'disabled' : ''}>
                    <i class="fas fa-arrow-up"></i>
                </button>
                <button type="button" class="btn btn-sm btn-secondary" data-action="move-day" data-day-index="${index}" data-direction="1" ${index === currentItinerary.length - 1 ? 'disabled' : ''}>
                    <i class="fas fa-arrow-down"></i>
                </button>
                <button type="button" class="btn btn-sm btn-danger" data-action="remove-day" data-day-index="${index}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
        <div class="itinerary-day-content">
            <div class="itinerary-form-group">
                <label>Descripción general del día</label>
                <textarea class="day-description-textarea" data-day-index="${index}"
                          placeholder="Descripción general de las actividades del día">${day.description}</textarea>
            </div>
            
            <div class="itinerary-form-group">
                <label>Actividades específicas</label>
                <div class="activities-list" id="activities-${index}">
                    ${renderActivities(day.activities, index)}
                </div>
                <div class="add-activity-form">
                    <input type="text" class="add-activity-input" data-day-index="${index}" 
                           placeholder="Nueva actividad...">
                    <button type="button" class="btn-add-activity" data-action="add-activity" data-day-index="${index}">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
    
    return dayDiv;
}

// Renderizar actividades
function renderActivities(activities, dayIndex) {
    return activities.map((activity, actIndex) => `
        <div class="itinerary-activity">
            <span class="activity-text">${activity}</span>
            <div class="activity-controls">
                <button type="button" class="btn-activity" data-action="edit-activity" data-day-index="${dayIndex}" data-activity-index="${actIndex}" title="Editar">
                    <i class="fas fa-edit"></i>
                </button>
                <button type="button" class="btn-activity delete" data-action="remove-activity" data-day-index="${dayIndex}" data-activity-index="${actIndex}" title="Eliminar">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

// Renderizar opciones de iconos
function renderIconOptions() {
    const icons = [
        'fas fa-plane', 'fas fa-camera', 'fas fa-utensils', 'fas fa-map-marked-alt', 
        'fas fa-star', 'fas fa-mountain', 'fas fa-swimming-pool', 'fas fa-bus',
        'fas fa-bed', 'fas fa-walking', 'fas fa-binoculars', 'fas fa-ship',
        'fas fa-bicycle', 'fas fa-tree', 'fas fa-sun', 'fas fa-moon',
        'fas fa-glass-cheers', 'fas fa-shopping-bag', 'fas fa-music', 'fas fa-heart'
    ];
    
    return icons.map(icon => `
        <button type="button" class="icon-option" data-action="select-icon-option" data-icon="${icon}">
            <i class="${icon}"></i>
        </button>
    `).join('');
}

// Actualizar título del día
function updateDayTitle(dayIndex, newTitle) {
    if (currentItinerary[dayIndex]) {
        currentItinerary[dayIndex].title = newTitle;
    }
}

// Actualizar descripción del día
function updateDayDescription(dayIndex, newDescription) {
    if (currentItinerary[dayIndex]) {
        currentItinerary[dayIndex].description = newDescription;
    }
}

// Mover día
function moveDay(dayIndex, direction) {
    const newIndex = dayIndex + direction;
    if (newIndex >= 0 && newIndex < currentItinerary.length) {
        // Intercambiar elementos
        const temp = currentItinerary[dayIndex];
        currentItinerary[dayIndex] = currentItinerary[newIndex];
        currentItinerary[newIndex] = temp;
        
        // Renumerar todos los días
        renumberDays();
        
        // Re-renderizar completamente
        renderItinerary();
    }
}

// Función helper para renumerar días
function renumberDays() {
    currentItinerary.forEach((day, index) => {
        day.day = index + 1;
        // Solo actualizar título si mantiene formato por defecto
        if (day.title.match(/^Día \d+/)) {
            day.title = `Día ${index + 1}`;
        }
    });
}

// Eliminar día
function removeDay(dayIndex) {
    if (confirm('¿Estás seguro de que quieres eliminar este día?')) {
        currentItinerary.splice(dayIndex, 1);
        
        // Renumerar días
        renumberDays();
        
        // Re-renderizar completamente
        renderItinerary();
    }
}

// Agregar actividad
function addActivity(dayIndex) {
    const input = document.querySelector(`[data-day-index="${dayIndex}"].add-activity-input`);
    const activity = input.value.trim();
    
    if (activity) {
        currentItinerary[dayIndex].activities.push(activity);
        input.value = '';
        
        // Re-renderizar solo las actividades de este día
        const activitiesContainer = document.getElementById(`activities-${dayIndex}`);
        activitiesContainer.innerHTML = renderActivities(currentItinerary[dayIndex].activities, dayIndex);
    }
}

// Manejar Enter en input de actividad
function handleActivityKeypress(event, dayIndex) {
    if (event.key === 'Enter') {
        event.preventDefault();
        addActivity(dayIndex);
    }
}

// Editar actividad
function editActivity(dayIndex, activityIndex) {
    const currentActivity = currentItinerary[dayIndex].activities[activityIndex];
    const newActivity = prompt('Editar actividad:', currentActivity);
    
    if (newActivity !== null && newActivity.trim()) {
        currentItinerary[dayIndex].activities[activityIndex] = newActivity.trim();
        
        // Re-renderizar actividades
        const activitiesContainer = document.getElementById(`activities-${dayIndex}`);
        activitiesContainer.innerHTML = renderActivities(currentItinerary[dayIndex].activities, dayIndex);
    }
}

// Eliminar actividad
function removeActivity(dayIndex, activityIndex) {
    if (confirm('¿Eliminar esta actividad?')) {
        currentItinerary[dayIndex].activities.splice(activityIndex, 1);
        
        // Re-renderizar actividades
        const activitiesContainer = document.getElementById(`activities-${dayIndex}`);
        activitiesContainer.innerHTML = renderActivities(currentItinerary[dayIndex].activities, dayIndex);
    }
}

// Cargar datos de itinerario
function loadItineraryData(itinerary) {
    const icons = ['fas fa-plane', 'fas fa-camera', 'fas fa-utensils', 'fas fa-map-marked-alt', 'fas fa-star', 'fas fa-mountain', 'fas fa-swimming-pool'];
    
    currentItinerary = itinerary.map((item, index) => {
        // Convertir diferentes formatos a nuestro formato estándar
        if (typeof item === 'string') {
            return {
                day: index + 1,
                title: `Día ${index + 1}`,
                description: item,
                activities: [],
                icon: icons[index % icons.length]
            };
        } else if (item.title && item.description) {
            return {
                day: index + 1,
                title: item.title,
                description: item.description,
                activities: item.activities || [],
                icon: item.icon || icons[index % icons.length]
            };
        } else {
            return {
                day: index + 1,
                title: `Día ${index + 1}`,
                description: item.description || '',
                activities: item.activities || [],
                icon: item.icon || icons[index % icons.length]
            };
        }
    });
    
    renderItinerary();
}

// Limpiar datos de itinerario
function clearItineraryData() {
    currentItinerary = [];
    renderItinerary();
}

// Recolectar datos de itinerario para enviar
function collectItineraryData() {
    return currentItinerary.map(day => ({
        title: day.title,
        description: day.description,
        activities: day.activities,
        icon: day.icon
    }));
}

// === FUNCIONES PARA GESTIÓN DE HOTELES ===

// Array temporal para almacenar hoteles antes de confirmar
let tempHotels = [];

// Arrays temporales para amenities de hoteles
let selectedAmenities = []; // Para formulario de upload
let selectedUrlAmenities = []; // Para formulario de URL

// Lista completa de amenities de hotel disponibles
const HOTEL_AMENITIES = [
    { icon: 'fas fa-wifi', name: 'WiFi Gratuito' },
    { icon: 'fas fa-swimming-pool', name: 'Piscina' },
    { icon: 'fas fa-utensils', name: 'Restaurante' },
    { icon: 'fas fa-dumbbell', name: 'Gimnasio' },
    { icon: 'fas fa-spa', name: 'Spa' },
    { icon: 'fas fa-car', name: 'Estacionamiento' },
    { icon: 'fas fa-concierge-bell', name: 'Room Service' },
    { icon: 'fas fa-wind', name: 'Aire Acondicionado' },
    { icon: 'fas fa-tv', name: 'TV Cable' },
    { icon: 'fas fa-phone', name: 'Teléfono' },
    { icon: 'fas fa-bath', name: 'Baño Privado' },
    { icon: 'fas fa-shower', name: 'Ducha' },
    { icon: 'fas fa-hot-tub', name: 'Jacuzzi' },
    { icon: 'fas fa-elevator', name: 'Ascensor' },
    { icon: 'fas fa-wheelchair', name: 'Acceso Discapacitados' },
    { icon: 'fas fa-baby', name: 'Cuna Disponible' },
    { icon: 'fas fa-paw', name: 'Pet Friendly' },
    { icon: 'fas fa-cocktail', name: 'Bar' },
    { icon: 'fas fa-coffee', name: 'Cafetera' },
    { icon: 'fas fa-wine-bottle', name: 'Minibar' },
    { icon: 'fas fa-tshirt', name: 'Lavandería' },
    { icon: 'fas fa-iron', name: 'Plancha' },
    { icon: 'fas fa-snowflake', name: 'Calefacción' },
    { icon: 'fas fa-key', name: 'Caja Fuerte' },
    { icon: 'fas fa-desktop', name: 'Centro de Negocios' },
    { icon: 'fas fa-calendar-check', name: 'Recepción 24h' },
    { icon: 'fas fa-shuttle-van', name: 'Transfer Aeropuerto' },
    { icon: 'fas fa-map-signs', name: 'Tours' },
    { icon: 'fas fa-smoking-ban', name: 'No Fumar' },
    { icon: 'fas fa-heart', name: 'Romántico' },
    { icon: 'fas fa-users', name: 'Familiar' },
    { icon: 'fas fa-briefcase', name: 'Negocios' },
    { icon: 'fas fa-mountain', name: 'Vista Montaña' },
    { icon: 'fas fa-water', name: 'Vista al Mar' },
    { icon: 'fas fa-city', name: 'Vista Ciudad' },
    { icon: 'fas fa-sun', name: 'Terraza' },
    { icon: 'fas fa-leaf', name: 'Jardín' },
    { icon: 'fas fa-fire', name: 'Chimenea' },
    { icon: 'fas fa-gamepad', name: 'Sala de Juegos' },
    { icon: 'fas fa-volleyball-ball', name: 'Deportes' }
];

// Inicializar manejadores de hoteles
function initializeHotelHandlers() {
    const addHotelBtn = document.getElementById('addHotelBtn');
    // const addHotelUrlBtn = document.getElementById('addHotelUrlBtn'); // Removido
    const addHotelFileBtn = document.getElementById('addHotelFileBtn');
    const cancelAddHotelBtn = document.getElementById('cancelAddHotelBtn');
    const hotelUploadZone = document.getElementById('hotelUploadZone');
    const hotelFileInput = document.getElementById('hotelFileInput');
    const addHotelToListBtn = document.getElementById('addHotelToListBtn');
    const cancelHotelUploadBtn = document.getElementById('cancelHotelUploadBtn');
    const addHotelUrlToListBtn = document.getElementById('addHotelUrlToListBtn');
    const cancelHotelUrlBtn = document.getElementById('cancelHotelUrlBtn');

    // Limpiar event listeners previos y agregar nuevos
    if (addHotelBtn) {
        addHotelBtn.replaceWith(addHotelBtn.cloneNode(true));
        document.getElementById('addHotelBtn').addEventListener('click', showHotelAddOptions);
    }

    if (cancelAddHotelBtn) {
        cancelAddHotelBtn.replaceWith(cancelAddHotelBtn.cloneNode(true));
        document.getElementById('cancelAddHotelBtn').addEventListener('click', hideHotelAddOptions);
    }
    
    // Botón de URL removido - solo mantenemos subida de archivos
    
    if (addHotelFileBtn) {
        addHotelFileBtn.replaceWith(addHotelFileBtn.cloneNode(true));
        document.getElementById('addHotelFileBtn').addEventListener('click', showHotelFileUpload);
    }

    // Upload zone
    if (hotelUploadZone) {
        hotelUploadZone.replaceWith(hotelUploadZone.cloneNode(true));
        const newHotelUploadZone = document.getElementById('hotelUploadZone');
        newHotelUploadZone.addEventListener('click', () => document.getElementById('hotelFileInput').click());
        
        // Drag & Drop
        newHotelUploadZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            newHotelUploadZone.classList.add('dragover');
        });
        
        newHotelUploadZone.addEventListener('dragleave', () => {
            newHotelUploadZone.classList.remove('dragover');
        });
        
        newHotelUploadZone.addEventListener('drop', (e) => {
            e.preventDefault();
            newHotelUploadZone.classList.remove('dragover');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                // Auto-subir la imagen cuando se arrastra
                uploadHotelImage(files[0]);
                // También actualizar el input para mantener consistencia
                document.getElementById('hotelFileInput').files = files;
            }
        });
    }

    // File input
    if (hotelFileInput) {
        hotelFileInput.replaceWith(hotelFileInput.cloneNode(true));

        // Agregar event listener para carga automática
        document.getElementById('hotelFileInput').addEventListener('change', function(e) {
            if (e.target.files && e.target.files[0]) {
                // Auto-subir la imagen cuando se selecciona
                uploadHotelImage(e.target.files[0]);
            }
        });
    }

    // Botones
    if (addHotelToListBtn) {
        addHotelToListBtn.replaceWith(addHotelToListBtn.cloneNode(true));
        document.getElementById('addHotelToListBtn').addEventListener('click', addHotelFromUpload);
    }
    
    if (cancelHotelUploadBtn) {
        cancelHotelUploadBtn.replaceWith(cancelHotelUploadBtn.cloneNode(true));
        document.getElementById('cancelHotelUploadBtn').addEventListener('click', hideHotelUploadArea);
    }

    if (addHotelUrlToListBtn) {
        addHotelUrlToListBtn.replaceWith(addHotelUrlToListBtn.cloneNode(true));
        document.getElementById('addHotelUrlToListBtn').addEventListener('click', addHotelFromUrl);
    }
    
    if (cancelHotelUrlBtn) {
        cancelHotelUrlBtn.replaceWith(cancelHotelUrlBtn.cloneNode(true));
        document.getElementById('cancelHotelUrlBtn').addEventListener('click', hideHotelUrlInput);
    }

    // Inicializar manejadores de amenities
    initializeAmenityHandlers();
}

// === NUEVAS FUNCIONES DE GESTIÓN TEMPORAL DE HOTELES ===

// Mostrar opciones de agregar hotel
function showHotelAddOptions() {
    // Asegurar que todo esté limpio antes de mostrar las opciones
    hideHotelUploadArea();
    hideHotelUrlInput();
    document.getElementById('hotelAddOptions').style.display = 'block';
}

// Ocultar opciones de agregar hotel
function hideHotelAddOptions() {
    document.getElementById('hotelAddOptions').style.display = 'none';
    hideHotelUploadArea();
    hideHotelUrlInput();
}

// Combinar precio con moneda
function formatHotelPrice(currency, amount) {
    return `${currency} ${amount}`;
}

// Función para formatear precios para mostrar en la interfaz del admin
function formatDisplayPrice(priceString) {
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

    // Asegurar que siempre hay un símbolo de moneda
    let currencySymbol = prefix.trim();
    if (!currencySymbol || (!currencySymbol.includes('USD') && !currencySymbol.includes('$'))) {
        // Si no hay símbolo de moneda o no es reconocido, usar $ por defecto
        currencySymbol = '$';
    }

    // Asegurar que el símbolo tenga el formato correcto
    if (currencySymbol === 'USD') {
        currencySymbol = 'USD ';
    } else if (currencySymbol === '$') {
        currencySymbol = '$';
    } else if (!currencySymbol.endsWith(' ') && currencySymbol.includes('USD')) {
        currencySymbol = currencySymbol.replace('USD', 'USD ');
    }

    return currencySymbol + formattedNumber + suffix;
}

// Extraer precio y moneda de un string formateado
function parseHotelPrice(priceString) {
    const parts = priceString.split(' ');
    if (parts.length >= 2) {
        return { currency: parts[0], amount: parts.slice(1).join(' ') };
    }
    return { currency: 'USD', amount: priceString };
}

// Cargar hoteles de un paquete (ahora carga a tempHotels)
async function loadPackageHotels(packageId) {
    try {
        const response = await fetch(`${API_BASE_URL}/packages/${packageId}/hotels`);
        if (response.ok) {
            const hotelsData = await response.json();
            // Si el nuevo formato devuelve un objeto agrupado por destinos, aplanarlo
            let hotels = [];
            if (typeof hotelsData === 'object' && !Array.isArray(hotelsData)) {
                // Nuevo formato: { "Destino 1": [hotels], "Destino 2": [hotels] }
                Object.values(hotelsData).forEach(destinationHotels => {
                    hotels = hotels.concat(destinationHotels);
                });
            } else {
                // Formato legacy: array directo
                hotels = hotelsData;
            }

            // Cargar hoteles existentes al array temporal
            tempHotels = hotels.map(hotel => ({
                id: hotel.id,
                name: hotel.name,
                description: hotel.description,
                image_url: hotel.image_url,
                price: hotel.price,
                destination: hotel.destination || 'Destino principal',
                days: hotel.days || 1,
                allow_user_days: hotel.allow_user_days || false,
                allow_multiple_per_destination: hotel.allow_multiple_per_destination || false,
                isExisting: true // Marcar como existente para no eliminarlo si no se modifica
            }));
            displayTempHotels();
        } else {
            tempHotels = [];
            displayTempHotels();
        }
    } catch (error) {
        console.error('Error cargando hoteles:', error);
        tempHotels = [];
        displayTempHotels();
    }
}

// Mostrar hoteles temporales
function displayTempHotels() {
    const hotelsManagement = document.getElementById('hotelsManagement');
    
    if (tempHotels.length === 0) {
        hotelsManagement.innerHTML = `
            <div class="hotels-empty">
                <i class="fas fa-bed"></i>
                <p>No hay hoteles agregados</p>
            </div>
        `;
        return;
    }

    const hotelsGrid = tempHotels.map((hotel, index) => `
        <div class="hotel-item" data-temp-index="${index}">
            <img src="${hotel.image_url}" alt="${hotel.name}" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22120%22 height=%2280%22><rect width=%22100%25%22 height=%22100%25%22 fill=%22%23f0f0f0%22/><text x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 fill=%22%23999%22 font-size=%2212%22>Hotel</text></svg>'">
            <div class="hotel-info">
                <h4>${hotel.name}</h4>
                <p class="hotel-description">${hotel.description || 'Sin descripción'}</p>
                <div class="hotel-details">
                    <div class="hotel-price">${formatDisplayPrice(hotel.price)}/noche</div>
                    <div class="hotel-destination"><i class="fas fa-map-marker-alt"></i> ${hotel.destination}</div>
                    <div class="hotel-days"><i class="fas fa-calendar-alt"></i> ${hotel.days} día${hotel.days > 1 ? 's' : ''}</div>
                    <div class="hotel-user-days">
                        <i class="fas ${hotel.allow_user_days ? 'fa-user-edit' : 'fa-lock'}"></i>
                        ${hotel.allow_user_days ? 'Usuario puede cambiar días' : 'Días fijos'}
                    </div>
                    <div class="hotel-multiple-selection">
                        <i class="fas ${hotel.allow_multiple_per_destination ? 'fa-layer-group' : 'fa-hand-pointer'}"></i>
                        ${hotel.allow_multiple_per_destination ? 'Múltiples selecciones permitidas' : 'Solo una selección'}
                    </div>
                </div>
                <div class="hotel-actions">
                    <button type="button" class="btn-edit" onclick="editTempHotel(${index})" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button type="button" class="btn-delete" onclick="removeTempHotel(${index})" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                ${!hotel.isExisting ? '<div class="hotel-status">Nuevo</div>' : ''}
            </div>
        </div>
    `).join('');

    hotelsManagement.innerHTML = `<div class="hotels-grid">${hotelsGrid}</div>`;
}

// Mostrar input de URL para hotel
function showHotelUrlInput() {
    document.getElementById('hotelAddOptions').style.display = 'none';
    document.getElementById('hotelUrlInput').style.display = 'block';
    document.getElementById('hotelUploadArea').style.display = 'none';
    document.getElementById('hotelUrlName').focus();
}

// Ocultar input de URL para hotel
function hideHotelUrlInput() {
    document.getElementById('hotelUrlInput').style.display = 'none';
    editingHotelIndex = null;
    // Restaurar botón a modo agregar
    const addBtn = document.getElementById('addHotelUrlToListBtn');
    if (addBtn) addBtn.innerHTML = '<i class="fas fa-plus"></i> Agregar a la Lista';
    clearHotelUrlForm();
}

// Mostrar área de subida de archivos para hotel
function showHotelFileUpload() {
    // Limpiar cualquier estado previo
    clearHotelUploadForm();
    clearSelectedAmenities('upload'); // Limpiar amenities

    document.getElementById('hotelAddOptions').style.display = 'none';
    document.getElementById('hotelUploadArea').style.display = 'block';
    document.getElementById('hotelUrlInput').style.display = 'none';

    // Asegurar que la zona de upload esté visible
    const uploadZone = document.getElementById('hotelUploadZone');
    const progressContainer = document.getElementById('hotelUploadProgress');
    if (uploadZone) uploadZone.style.display = 'block';
    if (progressContainer) progressContainer.style.display = 'none';

    document.getElementById('hotelName').focus();
}

// Ocultar área de subida de archivos para hotel
function hideHotelUploadArea() {
    document.getElementById('hotelUploadArea').style.display = 'none';

    // Limpiar preview si existe
    const previewContainer = document.getElementById('hotelImagePreview');
    if (previewContainer) {
        previewContainer.style.display = 'none';
        previewContainer.remove(); // Eliminar completamente el preview
    }

    // Limpiar variables temporales
    window.tempHotelImageUrl = null;

    // Restablecer zona de upload
    const uploadZone = document.getElementById('hotelUploadZone');
    const progressContainer = document.getElementById('hotelUploadProgress');
    if (uploadZone) uploadZone.style.display = 'block';
    if (progressContainer) progressContainer.style.display = 'none';

    clearHotelUploadForm();
}

// Limpiar formulario de URL de hotel
function clearHotelUrlForm() {
    document.getElementById('hotelUrlName').value = '';
    document.getElementById('hotelUrlDescription').value = '';
    document.getElementById('hotelUrlPrice').value = '';
    document.getElementById('hotelUrlPriceCurrency').value = 'USD';
    document.getElementById('hotelUrlDestination').value = '';
    document.getElementById('hotelUrlDays').value = '1';
    document.getElementById('hotelUrlAllowUserDays').checked = false;
    document.getElementById('hotelUrlAllowMultiple').checked = false;
    document.getElementById('hotelImageUrl').value = '';
}

// Limpiar formulario de subida de hotel
function clearHotelUploadForm() {
    document.getElementById('hotelName').value = '';
    document.getElementById('hotelDescription').value = '';
    document.getElementById('hotelPrice').value = '';
    document.getElementById('hotelPriceCurrency').value = 'USD';
    document.getElementById('hotelDestination').value = '';
    document.getElementById('hotelDays').value = '1';
    document.getElementById('hotelAllowUserDays').checked = false;
    document.getElementById('hotelAllowMultiple').checked = false;
    document.getElementById('hotelFileInput').value = '';

    // Limpiar imagen temporal y preview
    window.tempHotelImageUrl = null;
    const previewContainer = document.getElementById('hotelImagePreview');
    if (previewContainer) {
        previewContainer.style.display = 'none';
        previewContainer.remove();
    }

    // Mostrar zona de upload nuevamente
    const uploadZone = document.getElementById('hotelUploadZone');
    const progressContainer = document.getElementById('hotelUploadProgress');
    if (uploadZone) uploadZone.style.display = 'block';
    if (progressContainer) progressContainer.style.display = 'none';
}

// Agregar hotel desde URL al array temporal
function addHotelFromUrl() {
    const name = document.getElementById('hotelUrlName').value.trim();
    const description = document.getElementById('hotelUrlDescription').value.trim();
    const amount = document.getElementById('hotelUrlPrice').value.trim();
    const currency = document.getElementById('hotelUrlPriceCurrency').value;
    const imageUrl = document.getElementById('hotelImageUrl').value.trim();
    const destination = document.getElementById('hotelUrlDestination').value.trim();
    const days = parseInt(document.getElementById('hotelUrlDays').value) || 1;
    const allowUserDays = document.getElementById('hotelUrlAllowUserDays').checked;
    const allowMultiple = document.getElementById('hotelUrlAllowMultiple').checked;

    if (!name || !amount || !imageUrl || !destination) {
        showGalleryNotification('Por favor completa todos los campos requeridos', 'error');
        return;
    }

    const price = formatHotelPrice(currency, amount);

    const hotelData = {
        name: name,
        description: description || null,
        price: price,
        image_url: imageUrl,
        destination: destination,
        days: days,
        allow_user_days: allowUserDays,
        allow_multiple_per_destination: allowMultiple,
        amenities: [...selectedUrlAmenities]
    };

    if (editingHotelIndex !== null) {
        // Modo edición: actualizar hotel existente
        tempHotels[editingHotelIndex] = {
            ...tempHotels[editingHotelIndex],
            ...hotelData
        };
        editingHotelIndex = null;
        showGalleryNotification('Hotel actualizado', 'success');
    } else {
        // Modo agregar: nuevo hotel
        hotelData.isExisting = false;
        tempHotels.push(hotelData);
        showGalleryNotification('Hotel agregado a la lista', 'success');
    }

    // Restaurar botón a modo agregar
    const addBtn = document.getElementById('addHotelUrlToListBtn');
    addBtn.innerHTML = '<i class="fas fa-plus"></i> Agregar a la Lista';

    hideHotelUrlInput();
    clearSelectedAmenities('url');
    displayTempHotels();
}


// Mostrar preview de imagen de hotel cargada
function showHotelImagePreview(imageUrl) {
    const uploadZone = document.getElementById('hotelUploadZone');
    const progressContainer = document.getElementById('hotelUploadProgress');

    // Ocultar zona de upload y progreso
    uploadZone.style.display = 'none';
    progressContainer.style.display = 'none';

    // Crear o actualizar el preview
    let previewContainer = document.getElementById('hotelImagePreview');
    if (!previewContainer) {
        previewContainer = document.createElement('div');
        previewContainer.id = 'hotelImagePreview';
        previewContainer.className = 'hotel-image-preview';
        uploadZone.parentNode.insertBefore(previewContainer, uploadZone.nextSibling);
    }

    previewContainer.innerHTML = `
        <div class="image-preview-content">
            <img src="${imageUrl}" alt="Vista previa del hotel" class="preview-image">
            <button type="button" class="btn-remove-hotel-image" onclick="removeHotelImagePreview()" title="Eliminar imagen">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    previewContainer.style.display = 'block';
}

// Eliminar preview de imagen de hotel
function removeHotelImagePreview() {
    const previewContainer = document.getElementById('hotelImagePreview');
    const uploadZone = document.getElementById('hotelUploadZone');
    const fileInput = document.getElementById('hotelFileInput');

    if (previewContainer) {
        previewContainer.style.display = 'none';
    }

    // Mostrar zona de upload nuevamente
    uploadZone.style.display = 'block';

    // Limpiar variables y input
    window.tempHotelImageUrl = null;
    fileInput.value = '';

    showGalleryNotification('Imagen eliminada', 'success');
}

// Subir imagen de hotel automáticamente
async function uploadHotelImage(file) {
    if (!file.type.startsWith('image/')) {
        showGalleryNotification('El archivo debe ser una imagen', 'error');
        return;
    }

    try {
        // Mostrar barra de progreso
        const progressContainer = document.getElementById('hotelUploadProgress');
        const progressFill = document.getElementById('hotelProgressFill');
        const progressText = document.getElementById('hotelProgressText');

        progressContainer.style.display = 'block';

        const formData = new FormData();
        formData.append('file', file);

        const xhr = new XMLHttpRequest();

        // Manejar progreso de carga
        xhr.upload.addEventListener('progress', (e) => {
            if (e.lengthComputable) {
                const percentage = Math.round((e.loaded / e.total) * 100);
                progressFill.style.width = percentage + '%';
                progressText.textContent = percentage + '%';
            }
        });

        // Manejar respuesta
        xhr.addEventListener('load', () => {
            if (xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                // Guardar la URL en una variable temporal para el hotel
                window.tempHotelImageUrl = response.image_url || response.url;
                showHotelImagePreview(window.tempHotelImageUrl);
                showGalleryNotification('Imagen cargada exitosamente', 'success');
            } else {
                showGalleryNotification('Error al cargar imagen', 'error');
            }
            progressContainer.style.display = 'none';
        });

        xhr.addEventListener('error', () => {
            showGalleryNotification('Error al cargar imagen', 'error');
            progressContainer.style.display = 'none';
        });

        // Enviar archivo
        const token = localStorage.getItem('admin_token');
        xhr.open('POST', `${API_BASE_URL}/admin/upload-cover-image`);
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        xhr.send(formData);

    } catch (error) {
        console.error('Error subiendo imagen:', error);
        showGalleryNotification('Error al cargar imagen: ' + error.message, 'error');
    }
}

// Agregar hotel desde upload al array temporal
async function addHotelFromUpload() {
    const name = document.getElementById('hotelName').value.trim();
    const description = document.getElementById('hotelDescription').value.trim();
    const amount = document.getElementById('hotelPrice').value.trim();
    const currency = document.getElementById('hotelPriceCurrency').value;
    const destination = document.getElementById('hotelDestination').value.trim();
    const days = parseInt(document.getElementById('hotelDays').value) || 1;
    const allowUserDays = document.getElementById('hotelAllowUserDays').checked;
    const allowMultiple = document.getElementById('hotelAllowMultiple').checked;

    if (!name || !amount || !destination) {
        showGalleryNotification('Por favor completa todos los campos requeridos', 'error');
        return;
    }

    // Verificar que se haya cargado una imagen
    if (!window.tempHotelImageUrl) {
        showGalleryNotification('Por favor sube una imagen primero', 'error');
        return;
    }

    try {
        const price = formatHotelPrice(currency, amount);

        // Agregar al array temporal con amenities usando la imagen ya cargada
        tempHotels.push({
                name: name,
                description: description || null,
                price: price,
                image_url: window.tempHotelImageUrl,
                destination: destination,
                days: days,
                allow_user_days: allowUserDays,
                allow_multiple_per_destination: allowMultiple,
                amenities: [...selectedAmenities], // Copia de las amenities seleccionadas
                isExisting: false
            });

        // Limpiar variables temporales y preview
        window.tempHotelImageUrl = null;
        const previewContainer = document.getElementById('hotelImagePreview');
        if (previewContainer) {
            previewContainer.style.display = 'none';
        }
        hideHotelUploadArea();
        clearSelectedAmenities('upload'); // Limpiar amenities después de agregar
        displayTempHotels();
        showGalleryNotification('Hotel agregado a la lista', 'success');

    } catch (error) {
        console.error('Error:', error);
        showGalleryNotification('Error al agregar hotel', 'error');
    }
}

// Editar hotel temporal - abre el formulario de URL pre-llenado
let editingHotelIndex = null;

function editTempHotel(index) {
    const hotel = tempHotels[index];
    const parsedPrice = parseHotelPrice(hotel.price);
    editingHotelIndex = index;

    // Pre-llenar el formulario de URL con los datos del hotel
    document.getElementById('hotelUrlName').value = hotel.name || '';
    document.getElementById('hotelUrlDescription').value = hotel.description || '';
    document.getElementById('hotelUrlPriceCurrency').value = parsedPrice.currency;
    document.getElementById('hotelUrlPrice').value = parsedPrice.amount;
    document.getElementById('hotelImageUrl').value = hotel.image_url || '';
    document.getElementById('hotelUrlDestination').value = hotel.destination || '';
    document.getElementById('hotelUrlDays').value = hotel.days || 1;
    document.getElementById('hotelUrlAllowUserDays').checked = !!hotel.allow_user_days;
    document.getElementById('hotelUrlAllowMultiple').checked = !!hotel.allow_multiple_per_destination;

    // Cargar amenities del hotel
    selectedUrlAmenities = hotel.amenities ? [...hotel.amenities] : [];
    displaySelectedAmenities('url');

    // Cambiar el botón a "Guardar cambios"
    const addBtn = document.getElementById('addHotelUrlToListBtn');
    addBtn.innerHTML = '<i class="fas fa-save"></i> Guardar Cambios';

    // Mostrar formulario
    document.getElementById('hotelAddOptions').style.display = 'none';
    document.getElementById('hotelUrlInput').style.display = 'block';
    document.getElementById('hotelUploadArea').style.display = 'none';
    document.getElementById('hotelUrlName').focus();

    // Scroll al formulario
    document.getElementById('hotelUrlInput').scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Eliminar hotel temporal
async function removeTempHotel(index) {
    const hotel = tempHotels[index];
    if (!hotel) return;

    if (!confirm('¿Eliminar este hotel permanentemente?')) return;

    // Si es un hotel existente, eliminarlo de la base de datos inmediatamente
    if (hotel.isExisting && hotel.id) {
        try {
            // Obtener el ID del paquete de las variables globales
            const packageId = window.currentPackageId || document.getElementById('packageForm')?.dataset?.packageId;
            console.log('Package ID encontrado:', packageId);
            console.log('Hotel a eliminar:', hotel);

            if (!packageId) {
                console.error('No se pudo obtener el packageId. window.currentPackageId:', window.currentPackageId);
                console.error('Dataset del form:', document.getElementById('packageForm')?.dataset);
                showGalleryNotification('Error: No se puede identificar el paquete', 'error');
                return;
            }

            const token = localStorage.getItem('admin_token');
            console.log('Eliminando hotel con URL:', `${API_BASE_URL}/admin/packages/${packageId}/hotels/${hotel.id}`);

            const response = await fetch(`${API_BASE_URL}/admin/packages/${packageId}/hotels/${hotel.id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            console.log('Respuesta del servidor:', response.status, response.statusText);

            if (!response.ok) {
                if (response.status === 401) {
                    // Token expirado, intentar renovar y reintentar
                    console.log('Token expirado, intentando renovar...');
                    await renewToken();

                    // Reintentar la eliminación con el nuevo token
                    const newToken = localStorage.getItem('admin_token');
                    if (newToken) {
                        const retryResponse = await fetch(`${API_BASE_URL}/admin/packages/${packageId}/hotels/${hotel.id}`, {
                            method: 'DELETE',
                            headers: { 'Authorization': `Bearer ${newToken}` }
                        });

                        if (!retryResponse.ok) {
                            const errorText = await retryResponse.text();
                            console.error('Error del servidor después de renovar token:', errorText);
                            throw new Error(`Error al eliminar hotel del servidor: ${retryResponse.status} - ${errorText}`);
                        }
                    } else {
                        throw new Error('No se pudo renovar el token. Por favor, vuelve a hacer login.');
                    }
                } else {
                    const errorText = await response.text();
                    console.error('Error del servidor:', errorText);
                    throw new Error(`Error al eliminar hotel del servidor: ${response.status} - ${errorText}`);
                }
            }

            showGalleryNotification('Hotel eliminado permanentemente', 'success');

            // Actualizar la lista de paquetes para reflejar el nuevo precio
            await loadPackages();
        } catch (error) {
            console.error('Error eliminando hotel:', error);
            showGalleryNotification('Error al eliminar hotel: ' + error.message, 'error');
            return; // No continuar si hay error
        }
    } else {
        showGalleryNotification('Hotel eliminado de la lista', 'success');
    }

    // Eliminar del array temporal
    tempHotels.splice(index, 1);
    displayTempHotels();
}

// Guardar hoteles al confirmar el paquete
async function saveHotelsToPackage(packageId) {
    console.log('Guardando hoteles para el paquete:', packageId);
    console.log('Hoteles temporales:', tempHotels);
    
    if (tempHotels.length === 0) {
        console.log('No hay hoteles que guardar');
        return;
    }

    const token = localStorage.getItem('admin_token');
    
    try {
        // Primero obtener hoteles existentes para comparar
        const existingResponse = await fetch(`${API_BASE_URL}/packages/${packageId}/hotels`);
        let existingHotels = [];
        if (existingResponse.ok) {
            const hotelsData = await existingResponse.json();
            // Si el nuevo formato devuelve un objeto agrupado por destinos, aplanarlo
            if (typeof hotelsData === 'object' && !Array.isArray(hotelsData)) {
                // Nuevo formato: { "Destino 1": [hotels], "Destino 2": [hotels] }
                Object.values(hotelsData).forEach(destinationHotels => {
                    existingHotels = existingHotels.concat(destinationHotels);
                });
            } else {
                // Formato legacy: array directo
                existingHotels = hotelsData;
            }
        }

        console.log('Hoteles existentes:', existingHotels);

        // Eliminar hoteles que ya no están en tempHotels
        const tempHotelIds = tempHotels.filter(h => h.isExisting && h.id).map(h => h.id);
        for (const existingHotel of existingHotels) {
            if (!tempHotelIds.includes(existingHotel.id)) {
                console.log('Eliminando hotel:', existingHotel.name);
                await fetch(`${API_BASE_URL}/admin/packages/${packageId}/hotels/${existingHotel.id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
            }
        }
        
        // Actualizar hoteles existentes que fueron modificados
        for (const hotel of tempHotels.filter(h => h.isExisting && h.id)) {
            console.log('Actualizando hotel existente:', hotel.name);
            await fetch(`${API_BASE_URL}/admin/packages/${packageId}/hotels/${hotel.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: hotel.name,
                    description: hotel.description,
                    price: hotel.price,
                    image_url: hotel.image_url,
                    destination: hotel.destination || 'Destino principal',
                    days: hotel.days || 1,
                    allow_user_days: hotel.allow_user_days || false,
                    allow_multiple_per_destination: hotel.allow_multiple_per_destination || false,
                    amenities: hotel.amenities || []
                })
            });
        }
        
        // Crear nuevos hoteles
        const newHotels = tempHotels.filter(hotel => !hotel.isExisting);
        console.log('Creando hoteles nuevos:', newHotels.length);
        
        for (const hotel of newHotels) {
            console.log('Creando hotel:', hotel.name);
            const hotelDataToSend = {
                name: hotel.name,
                description: hotel.description,
                price: hotel.price,
                image_url: hotel.image_url,
                destination: hotel.destination || 'Destino principal',
                days: hotel.days || 1,
                allow_user_days: hotel.allow_user_days || false,
                allow_multiple_per_destination: hotel.allow_multiple_per_destination || false,
                amenities: hotel.amenities || []
            };
            console.log('Datos del hotel a enviar:', JSON.stringify(hotelDataToSend, null, 2));
            const response = await fetch(`${API_BASE_URL}/admin/packages/${packageId}/hotels`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(hotelDataToSend)
            });

            if (!response.ok) {
                const errorData = await response.text();
                console.error('Error al guardar hotel:', hotel.name, errorData);
                throw new Error(`Error al guardar hotel: ${hotel.name}`);
            } else {
                console.log('Hotel guardado exitosamente:', hotel.name);
            }
        }
        
        console.log('Todos los hoteles guardados correctamente');
        showGalleryNotification('Hoteles actualizados correctamente', 'success');
    } catch (error) {
        console.error('Error al guardar hoteles:', error);
        showGalleryNotification('Error al guardar hoteles: ' + error.message, 'error');
        throw error; // Re-lanzar el error para que se muestre en la UI principal
    }
}

// Agregar estilos CSS para los nuevos campos de hoteles
const adminHotelStyle = document.createElement('style');
adminHotelStyle.textContent = `
    .hotel-details {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        margin-top: 0.5rem;
    }

    .hotel-destination,
    .hotel-days,
    .hotel-user-days,
    .hotel-multiple-selection {
        font-size: 0.85rem;
        color: #666;
        display: flex;
        align-items: center;
        gap: 0.25rem;
    }

    .hotel-destination i,
    .hotel-days i,
    .hotel-user-days i,
    .hotel-multiple-selection i {
        color: #007bff;
        width: 12px;
    }

    .hotel-user-days i.fa-lock {
        color: #dc3545;
    }

    .hotel-user-days i.fa-user-edit {
        color: #28a745;
    }

    .hotel-multiple-selection i.fa-hand-pointer {
        color: #ffc107;
    }

    .hotel-multiple-selection i.fa-layer-group {
        color: #17a2b8;
    }

    .hotel-item {
        border: 1px solid #e1e5e9;
        border-radius: 8px;
        overflow: hidden;
        transition: box-shadow 0.2s ease;
    }

    .hotel-item:hover {
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    /* Estilos mejorados para checkboxes */
    .checkbox-section {
        background: #f8f9fa;
        border: 1px solid #e9ecef;
        border-radius: 8px;
        padding: 1.5rem;
        margin: 0.5rem 0;
    }

    .checkbox-section-title {
        margin: 0 0 1rem 0;
        color: #495057;
        font-size: 16px;
        font-weight: 600;
        border-bottom: 2px solid #007bff;
        padding-bottom: 0.5rem;
    }

    .checkbox-container {
        margin-bottom: 1rem;
    }

    .checkbox-container:last-child {
        margin-bottom: 0;
    }

    .checkbox-label {
        display: flex;
        align-items: flex-start;
        cursor: pointer;
        position: relative;
        margin-bottom: 0.5rem;
        padding-left: 2rem;
    }

    .checkbox-label input[type="checkbox"] {
        position: absolute;
        opacity: 0;
        cursor: pointer;
        height: 0;
        width: 0;
    }

    .checkmark {
        position: absolute;
        left: 0;
        top: 2px;
        height: 18px;
        width: 18px;
        background-color: #fff;
        border: 2px solid #ddd;
        border-radius: 4px;
        transition: all 0.2s ease;
    }

    .checkbox-label:hover .checkmark {
        border-color: #007bff;
    }

    .checkbox-label input:checked ~ .checkmark {
        background-color: #007bff;
        border-color: #007bff;
    }

    .checkmark:after {
        content: "";
        position: absolute;
        display: none;
        left: 5px;
        top: 2px;
        width: 6px;
        height: 10px;
        border: solid white;
        border-width: 0 2px 2px 0;
        transform: rotate(45deg);
    }

    .checkbox-label input:checked ~ .checkmark:after {
        display: block;
    }

    .checkbox-text {
        color: #495057;
        font-weight: 500;
        line-height: 1.4;
    }

    .form-help {
        display: block;
        color: #6c757d;
        font-size: 13px;
        line-height: 1.3;
        margin-top: 0.25rem;
        margin-left: 2rem;
    }
`;
document.head.appendChild(adminHotelStyle);

// Limpiar array temporal de hoteles
function clearTempHotels() {
    tempHotels = [];
}

// === FUNCIONES PARA GESTIÓN DE AMENITIES ===

// Inicializar manejadores de amenities
function initializeAmenityHandlers() {
    // Poblar dropdowns con amenities disponibles
    populateAmenityDropdowns();
    
    // Manejadores para formulario de upload
    const addAmenityBtn = document.getElementById('addAmenityBtn');
    const amenitySelector = document.getElementById('amenitySelector');
    const confirmAmenityBtn = document.getElementById('confirmAmenityBtn');
    const cancelAmenityBtn = document.getElementById('cancelAmenityBtn');
    
    if (addAmenityBtn) {
        addAmenityBtn.replaceWith(addAmenityBtn.cloneNode(true));
        document.getElementById('addAmenityBtn').addEventListener('click', () => showAmenitySelector('upload'));
    }
    
    if (confirmAmenityBtn) {
        confirmAmenityBtn.replaceWith(confirmAmenityBtn.cloneNode(true));
        document.getElementById('confirmAmenityBtn').addEventListener('click', () => addSelectedAmenity('upload'));
    }
    
    if (cancelAmenityBtn) {
        cancelAmenityBtn.replaceWith(cancelAmenityBtn.cloneNode(true));
        document.getElementById('cancelAmenityBtn').addEventListener('click', () => hideAmenitySelector('upload'));
    }
    
    // Manejadores para formulario de URL
    const addUrlAmenityBtn = document.getElementById('addUrlAmenityBtn');
    const confirmUrlAmenityBtn = document.getElementById('confirmUrlAmenityBtn');
    const cancelUrlAmenityBtn = document.getElementById('cancelUrlAmenityBtn');
    
    if (addUrlAmenityBtn) {
        addUrlAmenityBtn.replaceWith(addUrlAmenityBtn.cloneNode(true));
        document.getElementById('addUrlAmenityBtn').addEventListener('click', () => showAmenitySelector('url'));
    }
    
    if (confirmUrlAmenityBtn) {
        confirmUrlAmenityBtn.replaceWith(confirmUrlAmenityBtn.cloneNode(true));
        document.getElementById('confirmUrlAmenityBtn').addEventListener('click', () => addSelectedAmenity('url'));
    }
    
    if (cancelUrlAmenityBtn) {
        cancelUrlAmenityBtn.replaceWith(cancelUrlAmenityBtn.cloneNode(true));
        document.getElementById('cancelUrlAmenityBtn').addEventListener('click', () => hideAmenitySelector('url'));
    }
}

// Poblar dropdowns con amenities disponibles
function populateAmenityDropdowns() {
    const uploadDropdown = document.getElementById('amenityDropdown');
    const urlDropdown = document.getElementById('urlAmenityDropdown');
    
    const optionsHtml = HOTEL_AMENITIES.map(amenity => 
        `<option value="${amenity.icon}|${amenity.name}">
            ${amenity.name}
        </option>`
    ).join('');
    
    if (uploadDropdown) {
        uploadDropdown.innerHTML = '<option value="">Selecciona un amenity</option>' + optionsHtml;
    }
    
    if (urlDropdown) {
        urlDropdown.innerHTML = '<option value="">Selecciona un amenity</option>' + optionsHtml;
    }
}

// Mostrar selector de amenity
function showAmenitySelector(type) {
    const selectorId = type === 'upload' ? 'amenitySelector' : 'urlAmenitySelector';
    const dropdownId = type === 'upload' ? 'amenityDropdown' : 'urlAmenityDropdown';
    
    document.getElementById(selectorId).style.display = 'block';
    document.getElementById(dropdownId).value = '';
}

// Ocultar selector de amenity
function hideAmenitySelector(type) {
    const selectorId = type === 'upload' ? 'amenitySelector' : 'urlAmenitySelector';
    document.getElementById(selectorId).style.display = 'none';
}

// Agregar amenity seleccionado
function addSelectedAmenity(type) {
    const dropdownId = type === 'upload' ? 'amenityDropdown' : 'urlAmenityDropdown';
    const dropdown = document.getElementById(dropdownId);
    const value = dropdown.value;
    
    if (!value) {
        showGalleryNotification('Selecciona un amenity', 'error');
        return;
    }
    
    const [icon, name] = value.split('|');
    const amenitiesArray = type === 'upload' ? selectedAmenities : selectedUrlAmenities;
    
    // Verificar si ya está agregado
    if (amenitiesArray.some(a => a.icon === icon)) {
        showGalleryNotification('Este amenity ya está agregado', 'error');
        return;
    }
    
    // Agregar al array
    amenitiesArray.push({ icon, name });
    
    // Actualizar vista
    displaySelectedAmenities(type);
    hideAmenitySelector(type);
    showGalleryNotification('Amenity agregado', 'success');
}

// Mostrar amenities seleccionados
function displaySelectedAmenities(type) {
    const containerId = type === 'upload' ? 'selectedAmenities' : 'selectedUrlAmenities';
    const container = document.getElementById(containerId);
    const amenitiesArray = type === 'upload' ? selectedAmenities : selectedUrlAmenities;
    
    if (amenitiesArray.length === 0) {
        container.innerHTML = '';
        return;
    }
    
    const amenitiesHtml = amenitiesArray.map((amenity, index) => `
        <div class="amenity-tag">
            <i class="${amenity.icon}"></i>
            <span>${amenity.name}</span>
            <button type="button" class="amenity-remove" onclick="removeAmenity('${type}', ${index})" title="Eliminar">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `).join('');
    
    container.innerHTML = amenitiesHtml;
}

// Eliminar amenity
function removeAmenity(type, index) {
    const amenitiesArray = type === 'upload' ? selectedAmenities : selectedUrlAmenities;
    amenitiesArray.splice(index, 1);
    displaySelectedAmenities(type);
    showGalleryNotification('Amenity eliminado', 'success');
}

// Limpiar amenities seleccionados
function clearSelectedAmenities(type) {
    if (type === 'upload') {
        selectedAmenities = [];
        displaySelectedAmenities('upload');
    } else if (type === 'url') {
        selectedUrlAmenities = [];
        displaySelectedAmenities('url');
    } else {
        // Limpiar ambos
        selectedAmenities = [];
        selectedUrlAmenities = [];
        displaySelectedAmenities('upload');
        displaySelectedAmenities('url');
    }
}

// ========================================
// SISTEMA DE RENOVACIÓN DE TOKEN
// ========================================

let sessionTimer = null;
let renewalPopupShown = false;

// Inicializar el timer de renovación de token
function initializeSessionTimer() {
    clearSessionTimer();
    
    // Configurar timer para mostrar popup 15 minutos antes del vencimiento
    // 5 horas - 15 minutos = 285 minutos = 17100000 ms
    sessionTimer = setTimeout(() => {
        showSessionRenewalPopup();
    }, 17100000); // 285 minutos
}

// Limpiar timer existente
function clearSessionTimer() {
    if (sessionTimer) {
        clearTimeout(sessionTimer);
        sessionTimer = null;
    }
    renewalPopupShown = false;
}

// Mostrar popup de renovación de sesión
function showSessionRenewalPopup() {
    if (renewalPopupShown) return;
    renewalPopupShown = true;

    const popup = document.createElement('div');
    popup.className = 'session-renewal-popup';
    popup.innerHTML = `
        <div class="session-renewal-content">
            <div class="session-renewal-header">
                <i class="fas fa-clock"></i>
                <h3>¿Seguís conectado?</h3>
            </div>
            <p>Tu sesión expirará en 15 minutos por seguridad.</p>
            <p>¿Querés renovar tu sesión?</p>
            <div class="session-renewal-buttons">
                <button id="renewSession" class="btn-renew">Sí, renovar</button>
                <button id="logoutSession" class="btn-logout">No, cerrar sesión</button>
            </div>
        </div>
        <div class="session-renewal-overlay"></div>
    `;

    // Agregar estilos
    const style = document.createElement('style');
    style.textContent = `
        .session-renewal-popup {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 99999;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .session-renewal-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            z-index: -1;
        }

        .session-renewal-content {
            position: relative;
            background: white;
            padding: 30px;
            border-radius: 15px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
            text-align: center;
            max-width: 400px;
            width: 90%;
            animation: popupSlideIn 0.3s ease-out;
            z-index: 100000;
            pointer-events: auto;
        }

        @keyframes popupSlideIn {
            from {
                opacity: 0;
                transform: scale(0.8) translateY(-20px);
            }
            to {
                opacity: 1;
                transform: scale(1) translateY(0);
            }
        }

        .session-renewal-header {
            margin-bottom: 20px;
        }

        .session-renewal-header i {
            font-size: 48px;
            color: #ff6b35;
            margin-bottom: 10px;
        }

        .session-renewal-header h3 {
            margin: 0;
            color: #333;
            font-size: 24px;
        }

        .session-renewal-content p {
            color: #666;
            margin-bottom: 15px;
            line-height: 1.5;
        }

        .session-renewal-buttons {
            margin-top: 25px;
            display: flex;
            gap: 15px;
            justify-content: center;
        }

        .btn-renew, .btn-logout {
            padding: 12px 25px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            font-size: 16px;
            transition: all 0.3s ease;
            min-width: 120px;
            pointer-events: auto;
            position: relative;
            z-index: 100001;
        }

        .btn-renew {
            background: #4CAF50;
            color: white;
        }

        .btn-renew:hover {
            background: #45a049;
            transform: translateY(-2px);
        }

        .btn-logout {
            background: #f44336;
            color: white;
        }

        .btn-logout:hover {
            background: #da190b;
            transform: translateY(-2px);
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(popup);

    // Event listeners
    document.getElementById('renewSession').addEventListener('click', async () => {
        await renewToken();
        closeSessionPopup(popup, style);
    });

    document.getElementById('logoutSession').addEventListener('click', () => {
        logout();
        closeSessionPopup(popup, style);
    });

    // Auto-logout después de 15 minutos si no se responde
    setTimeout(() => {
        if (document.body.contains(popup)) {
            logout();
            closeSessionPopup(popup, style);
        }
    }, 900000); // 15 minutos
}

// Cerrar popup de sesión
function closeSessionPopup(popup, style) {
    if (document.body.contains(popup)) {
        document.body.removeChild(popup);
    }
    if (document.head.contains(style)) {
        document.head.removeChild(style);
    }
    renewalPopupShown = false;
}

// Renovar token
async function renewToken() {
    try {
        const token = localStorage.getItem('admin_token');
        if (!token) {
            logout();
            return;
        }

        const response = await fetch(`${API_BASE_URL}/admin/refresh-token`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('admin_token', data.access_token);
            
            // Reinicializar el timer
            initializeSessionTimer();
            
            // Mostrar notificación de éxito
            showNotification('Sesión renovada exitosamente', 'success');
        } else {
            // Token expirado o inválido
            logout();
        }
    } catch (error) {
        console.error('Error renovando token:', error);
        logout();
    }
}

// Logout
function logout() {
    localStorage.removeItem('admin_token');
    clearSessionTimer();
    window.location.reload();
}

// ========================================
// GESTIÓN DE CARACTERÍSTICAS
// ========================================

// Event listener para el botón de actualizar características
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, configurando event listener para updateFeaturesBtn');

    // Usar delegación de eventos para asegurar que funcione
    document.addEventListener('click', function(e) {
        console.log('Click detectado en:', e.target.id, e.target.tagName);
        if (e.target && e.target.id === 'updateFeaturesBtn') {
            console.log('Botón actualizar características clickeado');
            e.preventDefault();
            updatePackageFeatures();
        }
    });
});

// Función para actualizar características desde el textarea a la sección "¿Qué Incluye?"
async function updatePackageFeatures() {
    console.log('=== updatePackageFeatures iniciado ===');

    const featuresTextarea = document.getElementById('features');
    const packageId = window.currentPackageId;

    console.log('Textarea encontrado:', !!featuresTextarea);
    console.log('Package ID:', packageId);
    console.log('Valor del textarea:', featuresTextarea?.value);

    if (!packageId) {
        console.error('No package ID found');
        showNotification('Error: No se puede identificar el paquete actual', 'error');
        return;
    }

    if (!featuresTextarea.value.trim()) {
        console.log('Textarea vacío');
        try {
            showNotification('Por favor, escribe algunas características primero', 'warning');
        } catch (e) {
            console.error('Error en showNotification:', e);
            alert('Por favor, escribe algunas características primero');
        }
        return;
    }

    const newFeatures = featuresTextarea.value
        .split('\n')
        .map(f => f.trim())
        .filter(f => f.length > 0);

    if (newFeatures.length === 0) {
        showNotification('No hay características válidas para sincronizar', 'warning');
        return;
    }

    try {
        const token = localStorage.getItem('admin_token');

        // PASO 1: Obtener características existentes
        const existingResponse = await fetch(`${API_BASE_URL}/packages/${packageId}/features`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        let existingFeatures = [];
        if (existingResponse.ok) {
            existingFeatures = await existingResponse.json();
        }

        // PASO 2: Eliminar todas las características existentes
        console.log('Eliminando características existentes:', existingFeatures.length);
        for (const feature of existingFeatures) {
            await fetch(`${API_BASE_URL}/admin/packages/${packageId}/features/${feature.id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
        }

        // PASO 3: Agregar todas las características del textarea
        console.log('Agregando nuevas características:', newFeatures.length);
        let addedCount = 0;
        for (const feature of newFeatures) {
            const response = await fetch(`${API_BASE_URL}/admin/packages/${packageId}/features`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text: feature })
            });

            if (response.ok) {
                addedCount++;
            } else {
                console.error(`Error al agregar característica "${feature}":`, response.statusText);
            }
        }

        if (addedCount > 0) {
            showNotification(`Características sincronizadas exitosamente (${addedCount} características)`, 'success');

            // NO limpiar el textarea - mantener el contenido
            // featuresTextarea.value = '';

            // Recargar las características en la sección "¿Qué Incluye?"
            loadPackageFeatures(packageId);
        } else {
            showNotification('No se pudieron sincronizar las características', 'error');
        }

    } catch (error) {
        console.error('Error al actualizar características:', error);
        showNotification('Error al actualizar características', 'error');
    }
}

// Sincronizar un array de features al PackageFeature table (reemplaza todas las existentes)
async function syncFeaturesToPackageFeatureTable(packageId, featuresArray) {
    const token = localStorage.getItem('admin_token');

    // PASO 1: Obtener características existentes
    const existingResponse = await fetch(`${API_BASE_URL}/packages/${packageId}/features`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });

    let existingFeatures = [];
    if (existingResponse.ok) {
        existingFeatures = await existingResponse.json();
    }

    // PASO 2: Eliminar todas las características existentes
    for (const feature of existingFeatures) {
        await fetch(`${API_BASE_URL}/admin/packages/${packageId}/features/${feature.id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
    }

    // PASO 3: Agregar todas las nuevas características
    for (const featureText of featuresArray) {
        const trimmed = featureText.trim();
        if (trimmed.length === 0) continue;
        await fetch(`${API_BASE_URL}/admin/packages/${packageId}/features`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text: trimmed })
        });
    }
}

// Sanitizar texto de características: quitar especiales/emojis, limitar largo y líneas
function sanitizeFeatures(text) {
    const MAX_LINES = 15;
    const MAX_CHARS_PER_LINE = Infinity;

    let lines = text.split('\n');
    // Limitar a 6 líneas
    lines = lines.slice(0, MAX_LINES);
    // Limpiar cada línea
    lines = lines.map(line => {
        // Quitar emojis (todos los bloques unicode de emojis + variation selectors + ZWJ)
        line = line.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE00}-\u{FE0F}\u{200D}\u{20E3}\u{E0020}-\u{E007F}]/gu, '');
        // Quitar caracteres especiales de viñetas/listas y símbolos
        line = line.replace(/[-*•●○◆◇▪▸►→↔➤✓✔✗✘✦★☆·∙⁃–—⭐↩️]/g, '');
        // Quitar espacios extra al inicio y espacios dobles
        line = line.replace(/\s{2,}/g, ' ').trim();
        // Cortar a 10 caracteres
        return line.slice(0, MAX_CHARS_PER_LINE);
    });
    return lines.join('\n');
}

function initFeaturesTextareaValidation() {
    const textarea = document.getElementById('features');
    if (!textarea) return;

    textarea.addEventListener('input', function () {
        const cursorPos = this.selectionStart;
        const sanitized = sanitizeFeatures(this.value);
        if (this.value !== sanitized) {
            this.value = sanitized;
            // Intentar mantener cursor en posición razonable
            this.selectionStart = this.selectionEnd = Math.min(cursorPos, sanitized.length);
        }
    });

    // También sanitizar al pegar
    textarea.addEventListener('paste', function () {
        setTimeout(() => {
            this.value = sanitizeFeatures(this.value);
        }, 0);
    });

    // Bloquear Enter si ya hay 6 líneas
    textarea.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            const lineCount = this.value.split('\n').length;
            if (lineCount >= 15) {
                e.preventDefault();
            }
        }
    });
}

// Función para cargar características en el textarea
async function loadFeaturesIntoTextarea(packageId) {
    try {
        const token = localStorage.getItem('admin_token');
        const response = await fetch(`${API_BASE_URL}/packages/${packageId}/features`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            const features = await response.json();
            const featuresTextarea = document.getElementById('features');
            if (featuresTextarea) {
                let text = '';
                if (features.length > 0) {
                    // Usar features de la tabla PackageFeature
                    text = features.map(f => f.text).join('\n');
                } else {
                    // Fallback: usar el array features del paquete (columna JSON)
                    const pkg = packages.find(p => p.id === packageId);
                    if (pkg && pkg.features && pkg.features.length > 0) {
                        text = pkg.features.join('\n');
                    }
                }
                featuresTextarea.value = sanitizeFeatures(text);
            }
        } else {
            console.error('Error al cargar características para textarea:', response.statusText);
        }
    } catch (error) {
        console.error('Error al cargar características para textarea:', error);
    }
}

// Función para cargar características del paquete
async function loadPackageFeatures(packageId) {
    try {
        const token = localStorage.getItem('admin_token');
        const response = await fetch(`${API_BASE_URL}/packages/${packageId}/features`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const features = await response.json();
            displayPackageFeatures(features);
        } else {
            console.error('Error al cargar características:', response.statusText);
        }
    } catch (error) {
        console.error('Error al cargar características:', error);
    }
}

// Función para mostrar características en la interfaz
function displayPackageFeatures(features) {
    const managementDiv = document.getElementById('packageFeaturesManagement');
    if (!managementDiv) return;

    if (features.length === 0) {
        managementDiv.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-check-circle"></i>
                <p>No hay características agregadas. Usa la sección "Características" arriba para agregar algunas.</p>
            </div>
        `;
        return;
    }

    managementDiv.innerHTML = features.map(feature => `
        <div class="package-feature-item" data-feature-id="${feature.id}">
            <div class="feature-content">
                <i class="fas fa-check"></i>
                <span class="feature-text">${feature.text}</span>
            </div>
            <div class="feature-actions">
                <button type="button" class="btn-edit-feature" onclick="editPackageFeature(${feature.id}, '${feature.text.replace(/'/g, "\\'")}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button type="button" class="btn-delete-feature" onclick="deletePackageFeature(${feature.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

// Función para eliminar una característica
async function deletePackageFeature(featureId) {
    if (!confirm('¿Eliminar esta característica?')) return;

    try {
        const token = localStorage.getItem('admin_token');
        const packageId = window.currentPackageId;

        const response = await fetch(`${API_BASE_URL}/admin/packages/${packageId}/features/${featureId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            showNotification('Característica eliminada exitosamente', 'success');
            loadPackageFeatures(packageId);
            syncFeaturesTextarea(packageId);
        } else {
            showNotification('Error al eliminar característica', 'error');
        }
    } catch (error) {
        console.error('Error al eliminar característica:', error);
        showNotification('Error al eliminar característica', 'error');
    }
}

// ========================================
// CRUD INDIVIDUAL DE CARACTERÍSTICAS (sección "¿Qué Incluye?")
// ========================================

// Sanitizar un texto de característica individual (misma lógica que sanitizeFeatures pero para una línea)
function sanitizeSingleFeature(text) {
    const MAX_CHARS = Infinity;
    // Quitar emojis
    text = text.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE00}-\u{FE0F}\u{200D}\u{20E3}\u{E0020}-\u{E007F}]/gu, '');
    // Quitar caracteres especiales de viñetas/listas y símbolos
    text = text.replace(/[-*•●○◆◇▪▸►→↔➤✓✔✗✘✦★☆·∙⁃–—⭐↩️]/g, '');
    // Quitar espacios extra
    text = text.replace(/\s{2,}/g, ' ').trim();
    // Cortar a MAX_CHARS
    return text.slice(0, MAX_CHARS);
}

// Sincronizar el textarea de arriba con las features actuales de la API
async function syncFeaturesTextarea(packageId) {
    try {
        const token = localStorage.getItem('admin_token');
        const response = await fetch(`${API_BASE_URL}/packages/${packageId}/features`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
            const features = await response.json();
            const textarea = document.getElementById('features');
            if (textarea) {
                textarea.value = features.map(f => f.text).join('\n');
            }
        }
    } catch (error) {
        console.error('Error al sincronizar textarea:', error);
    }
}

// Variable para tracking de edición
let editingFeatureId = null;

// Event listeners para botones de la sección "¿Qué Incluye?"
document.addEventListener('DOMContentLoaded', function() {
    // Botón Agregar Característica
    document.addEventListener('click', function(e) {
        if (e.target && (e.target.id === 'addPackageFeatureBtn' || e.target.closest('#addPackageFeatureBtn'))) {
            e.preventDefault();
            // Verificar límite de 15 features
            const existingItems = document.querySelectorAll('#packageFeaturesManagement .package-feature-item');
            if (existingItems.length >= 15) {
                showNotification('Máximo 15 características permitidas', 'warning');
                return;
            }
            editingFeatureId = null;
            document.getElementById('featureText').value = '';
            document.getElementById('saveFeatureBtnText').textContent = 'Guardar';
            document.getElementById('packageFeatureForm').style.display = 'block';
            document.getElementById('featureText').focus();
        }
    });

    // Botón Guardar Característica
    document.addEventListener('click', function(e) {
        if (e.target && (e.target.id === 'savePackageFeatureBtn' || e.target.closest('#savePackageFeatureBtn'))) {
            e.preventDefault();
            savePackageFeature();
        }
    });

    // Botón Cancelar
    document.addEventListener('click', function(e) {
        if (e.target && (e.target.id === 'cancelPackageFeatureBtn' || e.target.closest('#cancelPackageFeatureBtn'))) {
            e.preventDefault();
            editingFeatureId = null;
            document.getElementById('packageFeatureForm').style.display = 'none';
        }
    });

    // Sanitizar input en tiempo real
    document.addEventListener('input', function(e) {
        if (e.target && e.target.id === 'featureText') {
            const cursorPos = e.target.selectionStart;
            const sanitized = sanitizeSingleFeature(e.target.value);
            if (e.target.value !== sanitized) {
                e.target.value = sanitized;
                e.target.selectionStart = e.target.selectionEnd = Math.min(cursorPos, sanitized.length);
            }
        }
    });
});

// Función para editar una característica existente
function editPackageFeature(featureId, featureText) {
    editingFeatureId = featureId;
    document.getElementById('featureText').value = featureText;
    document.getElementById('saveFeatureBtnText').textContent = 'Actualizar';
    document.getElementById('packageFeatureForm').style.display = 'block';
    document.getElementById('featureText').focus();
}

// Función para guardar (crear o actualizar) una característica
async function savePackageFeature() {
    const featureText = sanitizeSingleFeature(document.getElementById('featureText').value);
    if (!featureText) {
        showNotification('Escribe una característica', 'warning');
        return;
    }

    const packageId = window.currentPackageId;
    if (!packageId) {
        showNotification('No hay paquete seleccionado', 'error');
        return;
    }

    const token = localStorage.getItem('admin_token');

    try {
        let response;
        if (editingFeatureId) {
            // Actualizar existente (PUT)
            response = await fetch(`${API_BASE_URL}/admin/packages/${packageId}/features/${editingFeatureId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text: featureText })
            });
        } else {
            // Crear nueva (POST)
            response = await fetch(`${API_BASE_URL}/admin/packages/${packageId}/features`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text: featureText })
            });
        }

        if (response.ok) {
            const action = editingFeatureId ? 'actualizada' : 'agregada';
            showNotification(`Característica ${action} exitosamente`, 'success');
            editingFeatureId = null;
            document.getElementById('packageFeatureForm').style.display = 'none';
            document.getElementById('featureText').value = '';
            loadPackageFeatures(packageId);
            syncFeaturesTextarea(packageId);
        } else {
            showNotification('Error al guardar característica', 'error');
        }
    } catch (error) {
        console.error('Error al guardar característica:', error);
        showNotification('Error al guardar característica', 'error');
    }
}

// ========================================
// POPUP DE CONFIRMACIÓN DE SALIDA DEL EDITOR
// ========================================

function showExitConfirmationPopup(confirmCallback) {
    // Crear el popup
    const exitPopup = document.createElement('div');
    exitPopup.className = 'exit-confirmation-popup';
    exitPopup.innerHTML = `
        <div class="exit-confirmation-content">
            <div class="exit-confirmation-header">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>¿Estás seguro que deseas salir del editor?</h3>
            </div>
            <p>Se perderán todos los cambios no guardados.</p>
            <div class="exit-confirmation-buttons">
                <button id="confirmExit" class="btn-exit-confirm">Sí, salir</button>
                <button id="cancelExit" class="btn-exit-cancel">No, continuar editando</button>
            </div>
        </div>
        <div class="exit-confirmation-overlay"></div>
    `;

    // Agregar estilos
    const exitStyle = document.createElement('style');
    exitStyle.textContent = `
        .exit-confirmation-popup {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 100000;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .exit-confirmation-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            z-index: -1;
        }

        .exit-confirmation-content {
            position: relative;
            background: white;
            padding: 30px;
            border-radius: 15px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
            text-align: center;
            max-width: 450px;
            width: 90%;
            animation: popupSlideIn 0.3s ease-out;
            z-index: 100001;
            pointer-events: auto;
        }

        .exit-confirmation-header {
            margin-bottom: 20px;
        }

        .exit-confirmation-header i {
            font-size: 48px;
            color: #f39c12;
            margin-bottom: 15px;
        }

        .exit-confirmation-header h3 {
            margin: 0;
            color: #333;
            font-size: 22px;
            line-height: 1.3;
        }

        .exit-confirmation-content p {
            color: #666;
            margin-bottom: 25px;
            font-size: 16px;
            line-height: 1.4;
        }

        .exit-confirmation-buttons {
            display: flex;
            gap: 15px;
            justify-content: center;
        }

        .btn-exit-confirm, .btn-exit-cancel {
            padding: 12px 25px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            font-size: 16px;
            transition: all 0.3s ease;
            min-width: 140px;
            pointer-events: auto;
            position: relative;
            z-index: 100002;
        }

        .btn-exit-confirm {
            background: #e74c3c;
            color: white;
        }

        .btn-exit-confirm:hover {
            background: #c0392b;
            transform: translateY(-2px);
        }

        .btn-exit-cancel {
            background: #2ecc71;
            color: white;
        }

        .btn-exit-cancel:hover {
            background: #27ae60;
            transform: translateY(-2px);
        }
    `;
    
    document.head.appendChild(exitStyle);
    document.body.appendChild(exitPopup);

    // Event listeners
    document.getElementById('confirmExit').addEventListener('click', () => {
        closeExitPopup(exitPopup, exitStyle);
        confirmCallback(); // Ejecutar el callback de cerrar modal
    });

    document.getElementById('cancelExit').addEventListener('click', () => {
        closeExitPopup(exitPopup, exitStyle);
    });

    // Cerrar con ESC
    const handleEscape = (e) => {
        if (e.key === 'Escape') {
            closeExitPopup(exitPopup, exitStyle);
            document.removeEventListener('keydown', handleEscape);
        }
    };
    document.addEventListener('keydown', handleEscape);
}

// Cerrar popup de confirmación de salida
function closeExitPopup(popup, style) {
    if (document.body.contains(popup)) {
        document.body.removeChild(popup);
    }
    if (document.head.contains(style)) {
        document.head.removeChild(style);
    }
}

// Inicializar timer de sesión cuando se inicializa el admin
// (Se agregará al final de la función initializeAdmin existente)