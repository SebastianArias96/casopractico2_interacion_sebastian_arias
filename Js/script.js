// 1. DICCIONARIO MAESTRO (Incluye todo lo que aparece en tus capturas)
const I18N = {
    esp: {
        // Navegación
        nav_home: "Inicio", nav_events: "Eventos", nav_contacts: "Contactos", nav_locations: "Ubicaciones",
        // Títulos de Páginas
        title_eventos: "Gestión de Eventos",
        title_contactos: "Gestión de Contactos",
        title_ubicaciones: "Gestión de Ubicaciones",
        // Formularios (Eventos)
        add_event: "Agregar Nuevo Evento",
        lbl_name_event: "NOMBRE DEL EVENTO:",
        lbl_date: "FECHA Y HORA:",
        lbl_place: "LUGAR:",
        list_cloud_event: "Eventos en la Nube",
        // Formularios (Contactos)
        add_contact: "Agregar Nuevo Contacto",
        lbl_full_name: "NOMBRES Y APELLIDOS:",
        lbl_id: "CÉDULA DE IDENTIDAD:",
        lbl_job: "PROFESIÓN:",
        lbl_email: "CORREO ELECTRÓNICO:",
        lbl_phone: "TELÉFONO:",
        list_cloud_contact: "Contactos en la Nube",
        // Formularios (Ubicaciones)
        add_location: "Agregar Nueva Ubicación",
        lbl_title: "TÍTULO:",
        lbl_address: "DIRECCIÓN:",
        lbl_coords: "COORDENADAS GEOGRÁFICAS (LAT, LON):",
        list_cloud_location: "Ubicaciones Registradas (Nube)",
        // Botones y Otros
        btn_save: "Guardar en Firebase",
        btn_save_loc: "Guardar Ubicación en Firebase",
        report_ask: "¿Deseas ver el informe de hoy?",
        view_report: "Ver Informe",
        report_desc: "Resumen total de registros",
        footer: "2025 Universidad Tecnológica Equinoccial"
    },
    eng: {
        // Navigation
        nav_home: "Home", nav_events: "Events", nav_contacts: "Contacts", nav_locations: "Locations",
        // Page Titles
        title_eventos: "Event Management",
        title_contactos: "Contact Management",
        title_ubicaciones: "Location Management",
        // Forms (Events)
        add_event: "Add New Event",
        lbl_name_event: "EVENT NAME:",
        lbl_date: "DATE AND TIME:",
        lbl_place: "PLACE:",
        list_cloud_event: "Events in the Cloud",
        // Forms (Contacts)
        add_contact: "Add New Contact",
        lbl_full_name: "FULL NAME:",
        lbl_id: "ID NUMBER:",
        lbl_job: "PROFESSION:",
        lbl_email: "EMAIL ADDRESS:",
        lbl_phone: "PHONE:",
        list_cloud_contact: "Contacts in the Cloud",
        // Forms (Locations)
        add_location: "Add New Location",
        lbl_title: "TITLE:",
        lbl_address: "ADDRESS:",
        lbl_coords: "GEOGRAPHIC COORDINATES (LAT, LON):",
        list_cloud_location: "Registered Locations (Cloud)",
        // Buttons & Others
        btn_save: "Save to Firebase",
        btn_save_loc: "Save Location to Firebase",
        report_ask: "Do you want to see today's report?",
        view_report: "View Report",
        report_desc: "Total records summary",
        footer: "2025 Equinoctial Technological University"
    }
};

// 2. LÓGICA DE TRADUCCIÓN
function setLanguage(lang) {
    // Guardamos la elección para que al cambiar de página se mantenga
    localStorage.setItem('lang', lang);
    document.documentElement.lang = (lang === 'esp') ? 'es' : 'en';
    
    const texts = I18N[lang];

    // Traducir todos los elementos con data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (texts[key]) {
            el.textContent = texts[key];
        }
    });

    // Traducir placeholders de los inputs si los usas
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (texts[key]) {
            el.placeholder = texts[key];
        }
    });
}

// 3. CARGA AUTOMÁTICA AL ABRIR CUALQUIER VENTANA
document.addEventListener('DOMContentLoaded', () => {
    // Detectar el idioma guardado o usar español por defecto
    const savedLang = localStorage.getItem('lang') || 'esp';
    setLanguage(savedLang);
});