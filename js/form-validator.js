// Validador de formularios para el sistema de licencias

class FormValidator {
    constructor() {
        this.reglas = {};
        this.mensajesError = {};
        this.errores = [];
    }

    // Definir reglas de validación para un campo
    agregarRegla(campo, reglas) {
        this.reglas[campo] = reglas;
        return this;
    }

    // Definir mensaje personalizado para un campo
    definirMensaje(campo, mensaje) {
        this.mensajesError[campo] = mensaje;
        return this;
    }

    // Validar un formulario completo
    validarFormulario(formData) {
        this.errores = [];
        
        for (const [campo, valor] of Object.entries(formData)) {
            if (this.reglas[campo]) {
                this.validarCampo(campo, valor);
            }
        }

        return {
            esValido: this.errores.length === 0,
            errores: this.errores
        };
    }

    // Validar un campo específico
    validarCampo(campo, valor) {
        const reglas = this.reglas[campo];
        if (!reglas) return true;

        for (const regla of reglas) {
            if (!this.ejecutarRegla(regla, valor, campo)) {
                const mensaje = this.mensajesError[campo] || this.obtenerMensajePorDefecto(regla, campo);
                this.errores.push({
                    campo: campo,
                    regla: regla.tipo,
                    mensaje: mensaje
                });
                return false;
            }
        }
        return true;
    }

    // Ejecutar una regla específica
    ejecutarRegla(regla, valor, campo) {
        switch (regla.tipo) {
            case 'requerido':
                return this.validarRequerido(valor);
            
            case 'minLength':
                return this.validarLongitudMinima(valor, regla.valor);
            
            case 'maxLength':
                return this.validarLongitudMaxima(valor, regla.valor);
            
            case 'email':
                return this.validarEmail(valor);
            
            case 'numero':
                return this.validarNumero(valor);
            
            case 'fecha':
                return this.validarFecha(valor);
            
            case 'fechaFutura':
                return this.validarFechaFutura(valor);
            
            case 'fechaPasada':
                return this.validarFechaPasada(valor);
            
            case 'rango':
                return this.validarRango(valor, regla.min, regla.max);
            
            case 'patron':
                return this.validarPatron(valor, regla.patron);
            
            case 'personalizada':
                return regla.funcion(valor, campo);
            
            default:
                return true;
        }
    }

    // Validaciones específicas
    validarRequerido(valor) {
        return valor !== null && valor !== undefined && String(valor).trim() !== '';
    }

    validarLongitudMinima(valor, min) {
        return !valor || String(valor).length >= min;
    }

    validarLongitudMaxima(valor, max) {
        return !valor || String(valor).length <= max;
    }

    validarEmail(valor) {
        if (!valor) return true;
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(valor);
    }

    validarNumero(valor) {
        if (!valor) return true;
        return !isNaN(parseFloat(valor)) && isFinite(valor);
    }

    validarFecha(valor) {
        if (!valor) return true;
        const fecha = new Date(valor);
        return fecha instanceof Date && !isNaN(fecha);
    }

    validarFechaFutura(valor) {
        if (!valor) return true;
        const fecha = new Date(valor);
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        return fecha >= hoy;
    }

    validarFechaPasada(valor) {
        if (!valor) return true;
        const fecha = new Date(valor);
        const hoy = new Date();
        hoy.setHours(23, 59, 59, 999);
        return fecha <= hoy;
    }

    validarRango(valor, min, max) {
        if (!valor) return true;
        const num = parseFloat(valor);
        return num >= min && num <= max;
    }

    validarPatron(valor, patron) {
        if (!valor) return true;
        const regex = new RegExp(patron);
        return regex.test(valor);
    }

    // Obtener mensaje de error por defecto
    obtenerMensajePorDefecto(regla, campo) {
        const nombreCampo = this.formatearNombreCampo(campo);
        
        switch (regla.tipo) {
            case 'requerido':
                return `El campo ${nombreCampo} es obligatorio`;
            case 'minLength':
                return `${nombreCampo} debe tener al menos ${regla.valor} caracteres`;
            case 'maxLength':
                return `${nombreCampo} no puede tener más de ${regla.valor} caracteres`;
            case 'email':
                return `${nombreCampo} debe ser un email válido`;
            case 'numero':
                return `${nombreCampo} debe ser un número válido`;
            case 'fecha':
                return `${nombreCampo} debe ser una fecha válida`;
            case 'fechaFutura':
                return `${nombreCampo} debe ser una fecha futura`;
            case 'fechaPasada':
                return `${nombreCampo} debe ser una fecha pasada`;
            case 'rango':
                return `${nombreCampo} debe estar entre ${regla.min} y ${regla.max}`;
            case 'patron':
                return `${nombreCampo} tiene un formato inválido`;
            default:
                return `${nombreCampo} es inválido`;
        }
    }

    // Formatear nombre de campo para mostrar
    formatearNombreCampo(campo) {
        return campo
            .replace(/_/g, ' ')
            .replace(/([A-Z])/g, ' $1')
            .toLowerCase()
            .replace(/^\w/, c => c.toUpperCase());
    }

    // Limpiar errores
    limpiarErrores() {
        this.errores = [];
    }
}

// Validaciones específicas para licencias
class LicenciasValidator extends FormValidator {
    constructor() {
        super();
        this.configurarReglasLicencias();
    }

    configurarReglasLicencias() {
        // Datos del empleado
        this.agregarRegla('nombreCompleto', [
            { tipo: 'requerido' },
            { tipo: 'minLength', valor: 2 },
            { tipo: 'maxLength', valor: 100 },
            { tipo: 'patron', patron: '^[a-zA-ZáéíóúÁÉÍÓÚñÑ\\s]+$' }
        ]);

        this.agregarRegla('legajo', [
            { tipo: 'requerido' },
            { tipo: 'patron', patron: '^[0-9]+$' }
        ]);

        this.agregarRegla('cargo', [
            { tipo: 'requerido' },
            { tipo: 'minLength', valor: 2 },
            { tipo: 'maxLength', valor: 100 }
        ]);

        this.agregarRegla('dependencia', [
            { tipo: 'requerido' },
            { tipo: 'minLength', valor: 2 },
            { tipo: 'maxLength', valor: 100 }
        ]);

        // Fechas
        this.agregarRegla('fecha_inicio', [
            { tipo: 'requerido' },
            { tipo: 'fecha' }
        ]);

        this.agregarRegla('fecha_fin', [
            { tipo: 'requerido' },
            { tipo: 'fecha' },
            { 
                tipo: 'personalizada', 
                funcion: (valor, campo, formData) => this.validarFechaFin(valor, formData)
            }
        ]);

        // Campos específicos por tipo de licencia
        this.agregarRegla('diagnostico', [
            { tipo: 'requerido' },
            { tipo: 'minLength', valor: 10 },
            { tipo: 'maxLength', valor: 500 }
        ]);

        this.agregarRegla('motivo', [
            { tipo: 'requerido' },
            { tipo: 'minLength', valor: 10 },
            { tipo: 'maxLength', valor: 500 }
        ]);

        this.agregarRegla('parentesco', [
            { tipo: 'requerido' }
        ]);

        this.agregarRegla('cantidad_horas', [
            { tipo: 'requerido' },
            { tipo: 'numero' },
            { tipo: 'rango', min: 1, max: 200 }
        ]);

        // Mensajes personalizados
        this.definirMensaje('nombreCompleto', 'El nombre completo solo puede contener letras y espacios');
        this.definirMensaje('legajo', 'El legajo debe contener solo números');
        this.definirMensaje('fecha_fin', 'La fecha de fin debe ser posterior a la fecha de inicio');
    }

    // Validación personalizada para fecha de fin
    validarFechaFin(fechaFin, formData) {
        if (!fechaFin || !formData.fecha_inicio) return true;
        
        const inicio = new Date(formData.fecha_inicio);
        const fin = new Date(fechaFin);
        
        return fin >= inicio;
    }

    // Validar período de licencia según el tipo
    validarPeriodoLicencia(fechaInicio, fechaFin, licencia) {
        if (!fechaInicio || !fechaFin || !licencia) return true;

        const dias = Utils.calcularDiferenciaDias(fechaInicio, fechaFin);
        
        if (licencia.dias_maximos && dias > licencia.dias_maximos) {
            this.errores.push({
                campo: 'fecha_fin',
                regla: 'periodo_excedido',
                mensaje: `El período solicitado (${dias} días) excede el máximo permitido (${licencia.dias_maximos} días)`
            });
            return false;
        }

        return true;
    }

    // Validar campos específicos según el tipo de licencia
    validarCamposEspecificos(formData, licencia) {
        if (!licencia || !licencia.campos_requeridos) return true;

        let esValido = true;

        licencia.campos_requeridos.forEach(campo => {
            if (!formData[campo] || String(formData[campo]).trim() === '') {
                this.errores.push({
                    campo: campo,
                    regla: 'requerido',
                    mensaje: `El campo ${this.formatearNombreCampo(campo)} es obligatorio para este tipo de licencia`
                });
                esValido = false;
            }
        });

        return esValido;
    }

    // Validación completa del formulario de licencia
    validarSolicitudCompleta(formData, licencia) {
        this.limpiarErrores();

        // Validaciones básicas
        const validacionBasica = this.validarFormulario(formData);
        
        // Validaciones específicas
        this.validarPeriodoLicencia(formData.fecha_inicio, formData.fecha_fin, licencia);
        this.validarCamposEspecificos(formData, licencia);

        return {
            esValido: this.errores.length === 0,
            errores: this.errores
        };
    }
}

// Validador de archivos adjuntos
class ArchivosValidator {
    constructor() {
        this.tiposPermitidos = {
            'imagen': ['image/jpeg', 'image/png', 'image/gif'],
            'documento': ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
            'certificado': ['application/pdf', 'image/jpeg', 'image/png']
        };
        this.tamañoMaximo = 5 * 1024 * 1024; // 5MB
    }

    validarArchivo(archivo, tipo = 'documento') {
        const errores = [];

        if (!archivo) {
            errores.push('No se seleccionó ningún archivo');
            return { esValido: false, errores };
        }

        // Validar tipo de archivo
        const tiposPermitidos = this.tiposPermitidos[tipo] || this.tiposPermitidos.documento;
        if (!tiposPermitidos.includes(archivo.type)) {
            errores.push(`Tipo de archivo no permitido. Formatos aceptados: ${this.formatearTipos(tiposPermitidos)}`);
        }

        // Validar tamaño
        if (archivo.size > this.tamañoMaximo) {
            const tamañoMB = Math.round(this.tamañoMaximo / (1024 * 1024));
            errores.push(`El archivo es demasiado grande. Tamaño máximo permitido: ${tamañoMB}MB`);
        }

        // Validar nombre del archivo
        if (archivo.name.length > 255) {
            errores.push('El nombre del archivo es demasiado largo');
        }

        return {
            esValido: errores.length === 0,
            errores: errores
        };
    }

    formatearTipos(tipos) {
        const extensiones = tipos.map(tipo => {
            switch (tipo) {
                case 'image/jpeg': return 'JPG';
                case 'image/png': return 'PNG';
                case 'image/gif': return 'GIF';
                case 'application/pdf': return 'PDF';
                case 'application/msword': return 'DOC';
                case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': return 'DOCX';
                default: return tipo;
            }
        });
        return extensiones.join(', ');
    }
}

// Funciones auxiliares para validación en tiempo real
function validarCampoEnTiempoReal(campo, validator) {
    campo.addEventListener('blur', function() {
        const valor = this.value;
        const resultado = validator.validarCampo(this.name, valor);
        
        // Limpiar errores anteriores
        this.classList.remove('error');
        const errorElement = this.parentNode.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }

        // Mostrar nuevo error si existe
        if (!resultado && validator.errores.length > 0) {
            const ultimoError = validator.errores[validator.errores.length - 1];
            this.classList.add('error');
            
            const mensajeError = document.createElement('div');
            mensajeError.className = 'error-message';
            mensajeError.textContent = ultimoError.mensaje;
            this.parentNode.appendChild(mensajeError);
        }
        
        validator.limpiarErrores();
    });
}

function configurarValidacionTiempoReal(formulario, validator) {
    const campos = formulario.querySelectorAll('input, select, textarea');
    campos.forEach(campo => {
        validarCampoEnTiempoReal(campo, validator);
    });
}

// Exportar validadores
window.FormValidator = FormValidator;
window.LicenciasValidator = LicenciasValidator;
window.ArchivosValidator = ArchivosValidator;
window.validarCampoEnTiempoReal = validarCampoEnTiempoReal;
window.configurarValidacionTiempoReal = configurarValidacionTiempoReal;