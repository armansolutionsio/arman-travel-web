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
}

// Inicializar sidebar
function initSidebar() {
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.querySelector('.sidebar');
    const menuLinks = document.querySelectorAll('.menu-link:not(.logout)');

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

    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    cancelBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
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

    tbody.innerHTML = packages.map(package => `
        <tr>
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
            <td><strong>${package.price}</strong></td>
            <td class="actions-cell">
                <button class="btn btn-sm btn-secondary" onclick="editPackage(${package.id})">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button class="btn btn-sm btn-danger" onclick="deletePackage(${package.id})">
                    <i class="fas fa-trash"></i> Eliminar
                </button>
            </td>
        </tr>
    `).join('');
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
            
            // Llenar formulario con datos existentes
            document.getElementById('title').value = package.title;
            document.getElementById('description').value = package.description;
            document.getElementById('price').value = package.price;
            document.getElementById('image').value = package.image;
            document.getElementById('category').value = package.category;
            document.getElementById('features').value = package.features.join('\n');
            
            // Llenar campos adicionales
            document.getElementById('duration').value = package.duration || '';
            document.getElementById('destination').value = package.destination || '';
            document.getElementById('idealFor').value = package.ideal_for || '';
            
            // Mostrar sección de galería y cargarla
            gallerySection.style.display = 'block';
            loadPackageGallery(packageId);
        }
    } else {
        // Crear nuevo paquete
        modalTitle.textContent = 'Agregar Paquete';
        submitBtn.textContent = 'Guardar Paquete';
        form.reset();
        
        // Ocultar sección de galería para paquetes nuevos
        gallerySection.style.display = 'none';
    }

    // Inicializar manejadores de galería
    initializeGalleryHandlers();
    
    // Inicializar manejadores de imagen de portada
    initializeCoverImageHandlers();
    
    modal.style.display = 'block';
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
async function handlePackageSubmit(e) {
    e.preventDefault();
    
    // Validar que haya una imagen (URL o subida)
    const imageValue = document.getElementById('image').value.trim();
    if (!imageValue) {
        showNotification('Debes proporcionar una URL de imagen o subir un archivo', 'error');
        return;
    }
    
    const formData = new FormData(e.target);
    const packageData = {
        title: formData.get('title'),
        description: formData.get('description'),
        price: formData.get('price'),
        image: formData.get('image'),
        category: formData.get('category'),
        features: formData.get('features').split('\n').filter(f => f.trim()),
        duration: formData.get('duration') || null,
        destination: formData.get('destination') || null,
        ideal_for: formData.get('idealFor') || null
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
            const action = currentPackageId ? 'actualizado' : 'creado';
            showNotification(`Paquete ${action} correctamente`, 'success');
            
            document.getElementById('packageModal').style.display = 'none';
            await loadPackages();
            updateDashboardStats();
        } else {
            throw new Error('Error al guardar el paquete');
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
        background: ${type === 'success' ? '#28a745' : '#dc3545'};
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
    }

    // Display non-promoted packages
    if (nonPromoted.length === 0) {
        nonPromotedContainer.innerHTML = '<div class="carousel-empty">Todos los paquetes están promocionados</div>';
    } else {
        nonPromotedContainer.innerHTML = nonPromoted.map(pkg => createCarouselPackageCard(pkg, false)).join('');
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
        <div class="carousel-package-item" data-package-id="${pkg.id}" data-promoted="${isPromoted}">
            ${isPromoted ? `<div class="carousel-order-badge">Orden: ${order}</div>` : ''}
            
            <div class="carousel-package-header">
                <div class="carousel-package-info">
                    <h4>${pkg.title}</h4>
                    <p>${pkg.category} - ${pkg.price}</p>
                </div>
                
                <div class="carousel-package-controls">
                    <span class="promotion-status ${statusClass}">${statusText}</span>
                    <button class="btn-toggle-promotion ${buttonClass}" 
                            onclick="togglePackagePromotion(${pkg.id}, ${!isPromoted})">
                        <i class="${buttonIcon}"></i>
                        ${buttonText}
                    </button>
                </div>
            </div>
        </div>
    `;
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