// ===== GESTIÓN DE INFORMACIÓN DEL PAQUETE =====

let currentEditingInfo = null;

// Cargar información del paquete
async function loadPackageInfo(packageId) {
    try {
        const response = await fetch(`/packages/${packageId}/info`);
        if (response.ok) {
            const infoItems = await response.json();
            displayPackageInfo(infoItems);
        }
    } catch (error) {
        console.error('Error cargando información del paquete:', error);
    }
}

// Mostrar información del paquete
function displayPackageInfo(infoItems) {
    const container = document.getElementById('packageInfoManagement');
    
    if (!infoItems || infoItems.length === 0) {
        container.innerHTML = `
            <div class="package-info-empty">
                <i class="fas fa-info-circle"></i>
                <p>No hay información agregada aún</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = infoItems.map(item => `
        <div class="package-info-item" data-info-id="${item.id}">
            <div class="package-info-content">
                <i class="${item.icon} package-info-icon"></i>
                <div class="package-info-text">
                    <div class="package-info-label">${item.label}</div>
                </div>
            </div>
            <div class="package-info-actions">
                <button type="button" class="btn btn-sm btn-secondary" onclick="editPackageInfo(${item.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button type="button" class="btn btn-sm btn-danger" onclick="deletePackageInfo(${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

// Editar información
function editPackageInfo(infoId) {
    currentEditingInfo = infoId;
    const item = document.querySelector(`[data-info-id="${infoId}"]`);
    const icon = item.querySelector('.package-info-icon').className.replace('package-info-icon ', '');
    const label = item.querySelector('.package-info-label').textContent;
    
    document.getElementById('infoIcon').value = icon;
    document.getElementById('infoLabel').value = label;
    document.getElementById('saveInfoBtnText').textContent = 'Actualizar';
    
    showPackageInfoForm();
}

// Eliminar información
async function deletePackageInfo(infoId) {
    if (!confirm('¿Estás seguro de que quieres eliminar esta información?')) return;
    
    try {
        const packageId = getCurrentPackageId();
        const response = await fetch(`/admin/packages/${packageId}/info/${infoId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('admin_token')}` }
        });
        
        if (response.ok) {
            loadPackageInfo(packageId);
            showNotification('Información eliminada correctamente', 'success');
        }
    } catch (error) {
        console.error('Error eliminando información:', error);
        showNotification('Error al eliminar información', 'error');
    }
}

// Mostrar form de información
function showPackageInfoForm() {
    document.getElementById('packageInfoForm').style.display = 'block';
}

// Ocultar form de información
function hidePackageInfoForm() {
    document.getElementById('packageInfoForm').style.display = 'none';
    document.getElementById('infoIcon').value = '';
    document.getElementById('infoLabel').value = '';
    document.getElementById('saveInfoBtnText').textContent = 'Guardar';
    currentEditingInfo = null;
}

// Guardar información
async function savePackageInfo() {
    const icon = document.getElementById('infoIcon').value;
    const label = document.getElementById('infoLabel').value.trim();
    
    if (!icon || !label) {
        showNotification('Por favor completa todos los campos', 'error');
        return;
    }
    
    const packageId = getCurrentPackageId();
    const data = { icon, label, value: label }; // Usar label como valor también
    
    try {
        let response;
        if (currentEditingInfo) {
            response = await fetch(`/admin/packages/${packageId}/info/${currentEditingInfo}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
                },
                body: JSON.stringify(data)
            });
        } else {
            response = await fetch(`/admin/packages/${packageId}/info`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
                },
                body: JSON.stringify(data)
            });
        }
        
        if (response.ok) {
            hidePackageInfoForm();
            loadPackageInfo(packageId);
            showNotification('Información guardada correctamente', 'success');
        }
    } catch (error) {
        console.error('Error guardando información:', error);
        showNotification('Error al guardar información', 'error');
    }
}

// ===== GESTIÓN DE CARACTERÍSTICAS DEL PAQUETE =====

let currentEditingFeature = null;

// Cargar características del paquete
async function loadPackageFeatures(packageId) {
    try {
        const response = await fetch(`/packages/${packageId}/features`);
        if (response.ok) {
            const features = await response.json();
            displayPackageFeatures(features);
        }
    } catch (error) {
        console.error('Error cargando características del paquete:', error);
    }
}

// Mostrar características del paquete
function displayPackageFeatures(features) {
    const container = document.getElementById('packageFeaturesManagement');
    
    if (!features || features.length === 0) {
        container.innerHTML = `
            <div class="package-features-empty">
                <i class="fas fa-list-ul"></i>
                <p>No hay características agregadas aún</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = features.map(feature => `
        <div class="package-feature-item" data-feature-id="${feature.id}">
            <div class="package-feature-content">
                <span class="package-feature-text">${feature.text}</span>
            </div>
            <div class="package-feature-actions">
                <button type="button" class="btn btn-sm btn-secondary" onclick="editPackageFeature(${feature.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button type="button" class="btn btn-sm btn-danger" onclick="deletePackageFeature(${feature.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

// Editar característica
function editPackageFeature(featureId) {
    currentEditingFeature = featureId;
    const item = document.querySelector(`[data-feature-id="${featureId}"]`);
    const text = item.querySelector('.package-feature-text').textContent;
    
    document.getElementById('featureText').value = text;
    document.getElementById('saveFeatureBtnText').textContent = 'Actualizar';
    
    showPackageFeatureForm();
}

// Eliminar característica
async function deletePackageFeature(featureId) {
    if (!confirm('¿Estás seguro de que quieres eliminar esta característica?')) return;
    
    try {
        const packageId = getCurrentPackageId();
        const response = await fetch(`/admin/packages/${packageId}/features/${featureId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('admin_token')}` }
        });
        
        if (response.ok) {
            loadPackageFeatures(packageId);
            showNotification('Característica eliminada correctamente', 'success');
        }
    } catch (error) {
        console.error('Error eliminando característica:', error);
        showNotification('Error al eliminar característica', 'error');
    }
}

// Mostrar form de características
function showPackageFeatureForm() {
    document.getElementById('packageFeatureForm').style.display = 'block';
}

// Ocultar form de características
function hidePackageFeatureForm() {
    document.getElementById('packageFeatureForm').style.display = 'none';
    document.getElementById('featureText').value = '';
    document.getElementById('saveFeatureBtnText').textContent = 'Guardar';
    currentEditingFeature = null;
}

// Guardar característica
async function savePackageFeature() {
    const text = document.getElementById('featureText').value.trim();
    
    if (!text) {
        showNotification('Por favor ingresa el texto de la característica', 'error');
        return;
    }
    
    const packageId = getCurrentPackageId();
    console.log('Guardando característica para paquete:', packageId, 'Texto:', text);
    const data = { text };
    
    try {
        let response;
        if (currentEditingFeature) {
            response = await fetch(`/admin/packages/${packageId}/features/${currentEditingFeature}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
                },
                body: JSON.stringify(data)
            });
        } else {
            response = await fetch(`/admin/packages/${packageId}/features`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
                },
                body: JSON.stringify(data)
            });
        }
        
        if (response.ok) {
            hidePackageFeatureForm();
            loadPackageFeatures(packageId);
            showNotification('Característica guardada correctamente', 'success');
        }
    } catch (error) {
        console.error('Error guardando característica:', error);
        showNotification('Error al guardar característica', 'error');
    }
}

// Función auxiliar para obtener el ID del paquete actual
function getCurrentPackageId() {
    // Intentar obtener desde el dataset del formulario
    const form = document.getElementById('packageForm');
    if (form && form.dataset.packageId) {
        return form.dataset.packageId;
    }
    
    // Alternativa: obtener desde la URL actual
    const pathSegments = window.location.pathname.split('/');
    const packageId = pathSegments[pathSegments.length - 1];
    
    // Si estamos en el admin, buscar el currentPackageId global
    if (window.currentPackageId) {
        return window.currentPackageId;
    }
    
    console.log('Package ID encontrado:', packageId);
    return packageId;
}

// ===== EVENT LISTENERS PARA NUEVA FUNCIONALIDAD =====

// Event listeners para información del paquete
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('addPackageInfoBtn').addEventListener('click', showPackageInfoForm);
    document.getElementById('savePackageInfoBtn').addEventListener('click', savePackageInfo);
    document.getElementById('cancelPackageInfoBtn').addEventListener('click', hidePackageInfoForm);

    // Event listeners para características
    document.getElementById('addPackageFeatureBtn').addEventListener('click', showPackageFeatureForm);
    document.getElementById('savePackageFeatureBtn').addEventListener('click', savePackageFeature);
    document.getElementById('cancelPackageFeatureBtn').addEventListener('click', hidePackageFeatureForm);
});