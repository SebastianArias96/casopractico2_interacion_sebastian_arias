// Claves para localStorage
const STORAGE_KEYS = {
    eventos: 'eventos',
    contactos: 'contactos',
    ubicaciones: 'ubicaciones'
};

// Función para guardar datos en localStorage
function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

// Función para cargar datos de localStorage
function loadData(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
}

// Función para validar email básico
function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Función para validar teléfono básico (solo números, 10 dígitos)
function isValidPhone(phone) {
    const regex = /^\d{10}$/;
    return regex.test(phone.replace(/\D/g, ''));
}

// Función para mostrar alertas personalizadas
function showAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `custom-alert alert-${type}`;
    alertDiv.textContent = message;
    alertDiv.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        border-radius: 0.5rem;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 9999;
        animation: slideIn 0.3s ease-out;
        font-weight: 600;
        max-width: 400px;
    `;
    
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        alertDiv.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => alertDiv.remove(), 300);
    }, 3000);
}

// Agregar animaciones CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Función para renderizar listas
function renderList(containerId, data, type) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = '';
    
    if (data.length === 0) {
        const li = document.createElement('li');
        li.textContent = 'No hay registros aún. ¡Agrega el primero usando el formulario!';
        li.style.textAlign = 'center';
        li.style.color = '#64748b';
        li.style.fontStyle = 'italic';
        container.appendChild(li);
        return;
    }
    
    data.forEach((item, index) => {
        const li = document.createElement('li');
        let content = '';
        
        if (type === 'eventos') {
            content = `<strong>${item.titulo}</strong> - ${item.fecha_hora} - ${item.lugar}`;
        } else if (type === 'contactos') {
            content = `<strong>${item.nombre}</strong> - ${item.email} - Tel: ${item.telefono}`;
        } else if (type === 'ubicaciones') {
            content = `<strong>${item.titulo}</strong> - ${item.direccion} - Coordenadas: ${item.coordenadas}`;
        }
        
        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.gap = '0.5rem';
        buttonContainer.style.flexWrap = 'wrap';
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'action-btn delete-btn';
        deleteBtn.textContent = 'Eliminar';
        deleteBtn.onclick = () => deleteItem(type, index);
        
        buttonContainer.appendChild(deleteBtn);
        
        const contentDiv = document.createElement('div');
        contentDiv.innerHTML = content;
        contentDiv.style.flex = '1';
        
        li.innerHTML = '';
        li.appendChild(contentDiv);
        li.appendChild(buttonContainer);
        
        container.appendChild(li);
    });
}

// Función para renderizar tablas
function renderTable(tableId, data, type) {
    const tbody = document.querySelector(`#${tableId} tbody`);
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (data.length === 0) {
        const tr = document.createElement('tr');
        const td = document.createElement('td');
        td.colSpan = 10;
        td.textContent = 'No hay registros disponibles';
        td.style.textAlign = 'center';
        td.style.color = '#64748b';
        td.style.padding = '2rem';
        td.style.fontStyle = 'italic';
        tr.appendChild(td);
        tbody.appendChild(tr);
        return;
    }
    
    data.forEach((item, index) => {
        const tr = document.createElement('tr');
        let cells = '';
        
        if (type === 'eventos') {
            cells = `
                <td>${item.titulo || '-'}</td>
                <td>${item.fecha_hora || '-'}</td>
                <td>${item.lugar || '-'}</td>
                <td>${item.clasificacion || '-'}</td>
            `;
        } else if (type === 'contactos') {
            cells = `
                <td>${item.nombre || '-'}</td>
                <td>${item.email || '-'}</td>
                <td>${item.telefono || '-'}</td>
            `;
        } else if (type === 'ubicaciones') {
            cells = `
                <td>${item.titulo || '-'}</td>
                <td>${item.direccion || '-'}</td>
                <td>${item.coordenadas || '-'}</td>
            `;
        }
        
        const actionCell = `
            <td>
                <button class="action-btn delete-btn" onclick="deleteItem('${type}', ${index})">Eliminar</button>
            </td>
        `;
        
        tr.innerHTML = cells + actionCell;
        tbody.appendChild(tr);
    });
}

// Función para eliminar un item
function deleteItem(type, index) {
    const confirmDelete = confirm('¿Estás seguro de eliminar este elemento?');
    if (confirmDelete) {
        const data = loadData(STORAGE_KEYS[type]);
        data.splice(index, 1);
        saveData(STORAGE_KEYS[type], data);
        showAlert('Elemento eliminado exitosamente', 'success');
        
        // Actualizar todas las vistas
        updateAllViews(type);
    }
}

// Función para actualizar todas las vistas
function updateAllViews(type) {
    const data = loadData(STORAGE_KEYS[type]);
    
    // Actualizar lista en la página específica
    if (document.querySelector('main > h2:nth-of-type(2)')) {
        const ul = document.querySelector('main > h2:nth-of-type(2) + ul');
        if (ul) {
            ul.id = `${type}-registrados`;
            renderList(`${type}-registrados`, data, type);
        }
    }
    
    // Actualizar tablas en ver_datos.html
    const tableId = `tabla-${type}`;
    if (document.getElementById(tableId)) {
        renderTable(tableId, data, type);
    }
}

// Inicializar estructura de datos vacía (sin datos de ejemplo)
function initData() {
    // Solo inicializa si no existen las claves, pero las deja vacías
    if (!localStorage.getItem(STORAGE_KEYS.eventos)) {
        saveData(STORAGE_KEYS.eventos, []);
    }
    if (!localStorage.getItem(STORAGE_KEYS.contactos)) {
        saveData(STORAGE_KEYS.contactos, []);
    }
    if (!localStorage.getItem(STORAGE_KEYS.ubicaciones)) {
        saveData(STORAGE_KEYS.ubicaciones, []);
    }
}

// Manejadores de formularios
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar datos de ejemplo
    initData();
    
    // Detectar en qué página estamos basándonos en los elementos presentes
    const mainForm = document.querySelector('main form[action="#"]');
    
    if (mainForm) {
        // PÁGINA DE EVENTOS (eventos.html)
        if (document.querySelector('label[for="titulo"]') && document.querySelector('label[for="clasificacion"]')) {
            mainForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const formData = new FormData(mainForm);
                
                const evento = {
                    titulo: formData.get('titulo'),
                    invitados: formData.get('invitados'),
                    fecha_hora: formData.get('fecha_hora'),
                    zona_horaria: formData.get('zona_horaria'),
                    descripcion: formData.get('descripcion'),
                    repeticion: formData.get('repeticion'),
                    recordatorio: formData.get('recordatorio'),
                    clasificacion: formData.get('clasificacion'),
                    lugar: formData.get('lugar')
                };
                
                const eventos = loadData(STORAGE_KEYS.eventos);
                eventos.push(evento);
                saveData(STORAGE_KEYS.eventos, eventos);
                
                showAlert('¡Evento guardado exitosamente!', 'success');
                mainForm.reset();
                updateAllViews('eventos');
            });
            
            // Cargar eventos registrados
            const ul = document.querySelector('main > h2:nth-of-type(2) + ul');
            if (ul) {
                ul.id = 'eventos-registrados';
                renderList('eventos-registrados', loadData(STORAGE_KEYS.eventos), 'eventos');
            }
        }
        
        // PÁGINA DE CONTACTOS (contactos.html)
        else if (document.querySelector('label[for="nombre"]') && document.querySelector('label[for="profesion"]')) {
            mainForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const formData = new FormData(mainForm);
                
                const email = formData.get('email');
                const telefono = formData.get('telefono');
                
                // Validaciones
                if (!isValidEmail(email)) {
                    showAlert('Por favor ingresa un correo electrónico válido', 'error');
                    return;
                }
                if (!isValidPhone(telefono)) {
                    showAlert('El teléfono debe tener 10 dígitos', 'error');
                    return;
                }
                
                const contacto = {
                    nombre: formData.get('nombre'),
                    id: formData.get('id'),
                    profesion: formData.get('profesion'),
                    email: email,
                    telefono: telefono
                };
                
                const contactos = loadData(STORAGE_KEYS.contactos);
                contactos.push(contacto);
                saveData(STORAGE_KEYS.contactos, contactos);
                
                showAlert('¡Contacto guardado exitosamente!', 'success');
                mainForm.reset();
                updateAllViews('contactos');
            });
            
            // Cargar contactos registrados
            const ul = document.querySelector('main > h2:nth-of-type(2) + ul');
            if (ul) {
                ul.id = 'contactos-registrados';
                renderList('contactos-registrados', loadData(STORAGE_KEYS.contactos), 'contactos');
            }
        }
        
        // PÁGINA DE UBICACIONES (ubicacion.html)
        else if (document.querySelector('label[for="titulo"]') && document.querySelector('label[for="coordenadas"]')) {
            mainForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const formData = new FormData(mainForm);
                
                const ubicacion = {
                    titulo: formData.get('titulo'),
                    direccion: formData.get('direccion'),
                    coordenadas: formData.get('coordenadas')
                };
                
                const ubicaciones = loadData(STORAGE_KEYS.ubicaciones);
                ubicaciones.push(ubicacion);
                saveData(STORAGE_KEYS.ubicaciones, ubicaciones);
                
                showAlert('¡Ubicación guardada exitosamente!', 'success');
                mainForm.reset();
                updateAllViews('ubicaciones');
            });
            
            // Cargar ubicaciones registradas
            const ul = document.querySelector('main > h2:nth-of-type(2) + ul');
            if (ul) {
                ul.id = 'ubicaciones-registrados';
                renderList('ubicaciones-registrados', loadData(STORAGE_KEYS.ubicaciones), 'ubicaciones');
            }
        }
    }
    
    // PÁGINA DE VER DATOS (ver_datos.html)
    if (document.getElementById('tabla-eventos')) {
        renderTable('tabla-eventos', loadData(STORAGE_KEYS.eventos), 'eventos');
    }
    if (document.getElementById('tabla-contactos')) {
        renderTable('tabla-contactos', loadData(STORAGE_KEYS.contactos), 'contactos');
    }
    if (document.getElementById('tabla-ubicaciones')) {
        renderTable('tabla-ubicaciones', loadData(STORAGE_KEYS.ubicaciones), 'ubicaciones');
    }
});

// Función global para limpiar todos los datos (útil para desarrollo)
function clearAllData() {
    if (confirm('¿Estás seguro de eliminar TODOS los datos? Esta acción no se puede deshacer.')) {
        localStorage.clear();
        location.reload();
        showAlert('Todos los datos han sido eliminados', 'info');
    }
}

console.log('✅ Sistema de Gestión de Eventos UTE cargado correctamente');
console.log('💡 Tip: Usa clearAllData() en la consola para limpiar todos los datos');

// Funcion para los botones