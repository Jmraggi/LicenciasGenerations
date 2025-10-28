// Utilidades generales para el sistema de licencias

// Formateo de fechas
function formatearFechaCorta(fechaString) {
    if (!fechaString) return '';
    const fecha = new Date(fechaString + 'T00:00:00');
    return fecha.toLocaleDateString('es-ES');
}

function formatearFechaCompleta(fechaString) {
    if (!fechaString) return '';
    const fecha = new Date(fechaString + 'T00:00:00');
    return fecha.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
    });
}

function obtenerFechaHoy() {
    const hoy = new Date();
    const año = hoy.getFullYear();
    const mes = String(hoy.getMonth() + 1).padStart(2, '0');
    const dia = String(hoy.getDate()).padStart(2, '0');
    return `${año}-${mes}-${dia}`;
}

// Validaciones de fecha
function esFechaValida(fechaString) {
    if (!fechaString) return false;
    const fecha = new Date(fechaString + 'T00:00:00');
    return fecha instanceof Date && !isNaN(fecha);
}

function esFechaFutura(fechaString) {
    if (!esFechaValida(fechaString)) return false;
    const fecha = new Date(fechaString + 'T00:00:00');
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    return fecha > hoy;
}

function esFechaPasada(fechaString) {
    if (!esFechaValida(fechaString)) return false;
    const fecha = new Date(fechaString + 'T00:00:00');
    const hoy = new Date();
    hoy.setHours(23, 59, 59, 999);
    return fecha < hoy;
}

// Cálculos de días
function calcularDiferenciaDias(fechaInicio, fechaFin) {
    if (!esFechaValida(fechaInicio) || !esFechaValida(fechaFin)) return 0;
    
    const inicio = new Date(fechaInicio + 'T00:00:00');
    const fin = new Date(fechaFin + 'T00:00:00');
    
    if (fin < inicio) return 0;
    
    const diferenciaMilisegundos = fin - inicio;
    return Math.ceil(diferenciaMilisegundos / (1000 * 60 * 60 * 24)) + 1;
}

function calcularDiasHabiles(fechaInicio, fechaFin) {
    if (!esFechaValida(fechaInicio) || !esFechaValida(fechaFin)) return 0;
    
    const inicio = new Date(fechaInicio + 'T00:00:00');
    const fin = new Date(fechaFin + 'T00:00:00');
    
    if (fin < inicio) return 0;
    
    let diasHabiles = 0;
    const fechaActual = new Date(inicio);
    
    while (fechaActual <= fin) {
        const diaSemana = fechaActual.getDay();
        // No es domingo (0) ni sábado (6)
        if (diaSemana !== 0 && diaSemana !== 6) {
            diasHabiles++;
        }
        fechaActual.setDate(fechaActual.getDate() + 1);
    }
    
    return diasHabiles;
}

// Validaciones de texto
function validarTexto(texto, minLength = 2, maxLength = 500) {
    if (!texto || typeof texto !== 'string') return false;
    const textoLimpio = texto.trim();
    return textoLimpio.length >= minLength && textoLimpio.length <= maxLength;
}

function validarNumero(numero, min = 0, max = Number.MAX_SAFE_INTEGER) {
    const num = parseFloat(numero);
    return !isNaN(num) && num >= min && num <= max;
}

function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Manipulación del DOM
function mostrarElemento(selector) {
    const elemento = document.querySelector(selector);
    if (elemento) {
        elemento.style.display = 'block';
        elemento.classList.add('visible');
    }
}

function ocultarElemento(selector) {
    const elemento = document.querySelector(selector);
    if (elemento) {
        elemento.style.display = 'none';
        elemento.classList.remove('visible');
    }
}

function alternarElemento(selector) {
    const elemento = document.querySelector(selector);
    if (elemento) {
        if (elemento.style.display === 'none' || !elemento.style.display) {
            mostrarElemento(selector);
        } else {
            ocultarElemento(selector);
        }
    }
}

// Animaciones y transiciones
function animarElemento(elemento, animacion, duracion = 300) {
    if (!elemento) return;
    
    elemento.style.transition = `all ${duracion}ms ease`;
    elemento.classList.add(animacion);
    
    setTimeout(() => {
        elemento.classList.remove(animacion);
    }, duracion);
}

function deslizarHacia(elemento, direccion = 'left') {
    if (!elemento) return;
    
    const clases = {
        'left': 'slide-left',
        'right': 'slide-right',
        'up': 'slide-up',
        'down': 'slide-down'
    };
    
    animarElemento(elemento, clases[direccion] || 'slide-left');
}

// Gestión de almacenamiento local
function guardarEnLocal(clave, valor) {
    try {
        const valorString = typeof valor === 'string' ? valor : JSON.stringify(valor);
        localStorage.setItem(`licencias_${clave}`, valorString);
        return true;
    } catch (error) {
        console.error('Error al guardar en localStorage:', error);
        return false;
    }
}

function cargarDeLocal(clave, valorPorDefecto = null) {
    try {
        const valor = localStorage.getItem(`licencias_${clave}`);
        if (valor === null) return valorPorDefecto;
        
        // Intentar parsear como JSON, si falla devolver como string
        try {
            return JSON.parse(valor);
        } catch {
            return valor;
        }
    } catch (error) {
        console.error('Error al cargar de localStorage:', error);
        return valorPorDefecto;
    }
}

function eliminarDeLocal(clave) {
    try {
        localStorage.removeItem(`licencias_${clave}`);
        return true;
    } catch (error) {
        console.error('Error al eliminar de localStorage:', error);
        return false;
    }
}

// Debounce para búsquedas
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle para eventos de scroll
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Generación de IDs únicos
function generarId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Formateo de números
function formatearNumero(numero, decimales = 0) {
    return new Intl.NumberFormat('es-ES', {
        minimumFractionDigits: decimales,
        maximumFractionDigits: decimales
    }).format(numero);
}

// Capitalización de texto
function capitalizarPrimeraLetra(texto) {
    if (!texto) return '';
    return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
}

function capitalizarPalabras(texto) {
    if (!texto) return '';
    return texto.split(' ')
        .map(palabra => capitalizarPrimeraLetra(palabra))
        .join(' ');
}

// Sanitización de entrada
function sanitizarTexto(texto) {
    if (!texto) return '';
    return texto
        .replace(/[<>]/g, '') // Eliminar caracteres peligrosos
        .trim()
        .replace(/\s+/g, ' '); // Normalizar espacios
}

// Validación de archivos
function validarArchivo(archivo, tiposPermitidos = [], tamañoMaximo = 5 * 1024 * 1024) {
    if (!archivo) return { valido: false, error: 'No se seleccionó archivo' };
    
    // Validar tipo
    if (tiposPermitidos.length > 0 && !tiposPermitidos.includes(archivo.type)) {
        return { 
            valido: false, 
            error: `Tipo de archivo no permitido. Permitidos: ${tiposPermitidos.join(', ')}` 
        };
    }
    
    // Validar tamaño
    if (archivo.size > tamañoMaximo) {
        const tamañoMB = Math.round(tamañoMaximo / (1024 * 1024));
        return { 
            valido: false, 
            error: `El archivo es demasiado grande. Máximo permitido: ${tamañoMB}MB` 
        };
    }
    
    return { valido: true };
}

// Conversión de archivos a base64
function archivoABase64(archivo) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(archivo);
    });
}

// Detección de dispositivo
function esMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

function esTablet() {
    return /iPad|Android/i.test(navigator.userAgent) && window.innerWidth >= 768 && window.innerWidth < 1024;
}

function esEscritorio() {
    return !esMobile() && !esTablet();
}

// Gestión de errores
function manejarError(error, contexto = '') {
    console.error(`Error en ${contexto}:`, error);
    
    // En producción, podrías enviar el error a un servicio de logging
    if (window.location.hostname !== 'localhost') {
        // Enviar error a servicio de logging
        // logError(error, contexto);
    }
    
    return {
        mensaje: 'Ha ocurrido un error inesperado',
        detalles: error.message || 'Error desconocido',
        contexto: contexto
    };
}

// Funciones de loading
function mostrarLoading(mensaje = 'Cargando...') {
    const spinner = document.getElementById('loadingSpinner');
    if (spinner) {
        const textoSpinner = spinner.querySelector('p');
        if (textoSpinner) {
            textoSpinner.textContent = mensaje;
        }
        spinner.style.display = 'flex';
    }
}

function ocultarLoading() {
    const spinner = document.getElementById('loadingSpinner');
    if (spinner) {
        spinner.style.display = 'none';
    }
}

// Exportar funciones para uso global
window.Utils = {
    // Fechas
    formatearFechaCorta,
    formatearFechaCompleta,
    obtenerFechaHoy,
    esFechaValida,
    esFechaFutura,
    esFechaPasada,
    calcularDiferenciaDias,
    calcularDiasHabiles,
    
    // Validaciones
    validarTexto,
    validarNumero,
    validarEmail,
    validarArchivo,
    
    // DOM
    mostrarElemento,
    ocultarElemento,
    alternarElemento,
    animarElemento,
    deslizarHacia,
    
    // Almacenamiento
    guardarEnLocal,
    cargarDeLocal,
    eliminarDeLocal,
    
    // Utilidades
    debounce,
    throttle,
    generarId,
    formatearNumero,
    capitalizarPrimeraLetra,
    capitalizarPalabras,
    sanitizarTexto,
    archivoABase64,
    
    // Dispositivo
    esMobile,
    esTablet,
    esEscritorio,
    
    // Errores
    manejarError,
    mostrarLoading,
    ocultarLoading
};