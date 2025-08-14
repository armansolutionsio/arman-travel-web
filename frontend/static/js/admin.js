// Variables globales
const API_BASE_URL = 'http://localhost:8000';
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
        }
    } else {
        // Crear nuevo paquete
        modalTitle.textContent = 'Agregar Paquete';
        submitBtn.textContent = 'Guardar Paquete';
        form.reset();
    }

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
    
    const formData = new FormData(e.target);
    const packageData = {
        title: formData.get('title'),
        description: formData.get('description'),
        price: formData.get('price'),
        image: formData.get('image'),
        category: formData.get('category'),
        features: formData.get('features').split('\n').filter(f => f.trim())
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