// Variables globales
let currentStep = 1;
let selectedLicenses = []; // Cambiado para permitir múltiples
let solicitudData = {};
let multipleSolicitudes = [];

// Inicialización de la aplicación
document.addEventListener('DOMContentLoaded', function() {
    inicializarApp();
});

function inicializarApp() {
    // Configurar fecha actual
    mostrarFechaActual();
    
    // Cargar licencias iniciales
    cargarLicencias();
    
    // Configurar event listeners
    configurarEventListeners();
    
    // Inicializar tooltips y componentes UI
    inicializarUI();
    
    console.log('Aplicación inicializada correctamente');
}

function mostrarFechaActual() {
    const fechaElement = document.getElementById('currentDate');
    const ahora = new Date();
    const opciones = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        weekday: 'long'
    };
    fechaElement.textContent = ahora.toLocaleDateString('es-ES', opciones);
}

function cargarLicencias() {
    const grid = document.getElementById('licenciasGrid');
    grid.innerHTML = '';
    
    // Licencias principales a mostrar inicialmente
    const licenciasPrincipales = [
        "ART_34_INC_C", // ART. 34 INC. C RAZONES PARTICULARES
        "ART_14",       // Art. 14. COMPENSACIÓN
        "ART_22",       // Art. 22. ENFERMEDAD. AFECCIONES COMUNES
        "ART_23"        // Art. 23. ENFERMEDAD. AFECCIONES O LESIONES DE LARGO TRATAMIENTO
    ];
    
    const todasLasLicencias = obtenerTodasLasLicencias();
    
    // Mostrar licencias principales
    todasLasLicencias.forEach(licencia => {
        if (licenciasPrincipales.includes(licencia.codigo)) {
            const card = crearTarjetaLicencia(licencia);
            grid.appendChild(card);
        }
    });
    
    // Crear botón "Ver más"
    crearBotonVerMas(todasLasLicencias, licenciasPrincipales);
}

function crearBotonVerMas(todasLasLicencias, licenciasPrincipales) {
    const grid = document.getElementById('licenciasGrid');
    
    // Contar licencias restantes
    const licenciasRestantes = todasLasLicencias.filter(licencia => 
        !licenciasPrincipales.includes(licencia.codigo)
    );
    
    if (licenciasRestantes.length > 0) {
        const verMasContainer = document.createElement('div');
        verMasContainer.className = 'ver-mas-container';
        verMasContainer.innerHTML = `
            <button type="button" class="btn-ver-mas" id="btnVerMas">
                <i class="fas fa-plus"></i>
                Ver Más (${licenciasRestantes.length} licencias adicionales)
            </button>
        `;
        
        grid.appendChild(verMasContainer);
        
        // Agregar evento al botón
        document.getElementById('btnVerMas').addEventListener('click', function() {
            mostrarTodasLasLicencias(todasLasLicencias, licenciasPrincipales);
        });
    }
}

function mostrarTodasLasLicencias(todasLasLicencias, licenciasPrincipales) {
    const grid = document.getElementById('licenciasGrid');
    
    // Remover el botón "Ver más"
    const verMasContainer = grid.querySelector('.ver-mas-container');
    if (verMasContainer) {
        verMasContainer.remove();
    }
    
    // Agregar las licencias restantes
    todasLasLicencias.forEach(licencia => {
        if (!licenciasPrincipales.includes(licencia.codigo)) {
            const card = crearTarjetaLicencia(licencia);
            grid.appendChild(card);
        }
    });
    
    // Crear botón "Ver menos"
    const verMenosContainer = document.createElement('div');
    verMenosContainer.className = 'ver-mas-container';
    verMenosContainer.innerHTML = `
        <button type="button" class="btn-ver-mas btn-ver-menos" id="btnVerMenos">
            <i class="fas fa-minus"></i>
            Ver Menos
        </button>
    `;
    
    grid.appendChild(verMenosContainer);
    
    // Agregar evento al botón "Ver menos"
    document.getElementById('btnVerMenos').addEventListener('click', function() {
        cargarLicencias(); // Recargar solo las principales
    });
}

function crearTarjetaLicencia(licencia) {
    const card = document.createElement('div');
    card.className = 'licencia-card';
    card.dataset.id = licencia.id;
    
    card.innerHTML = `
        <div class="card-body">
            <h3>${licencia.nombre}</h3>
            <div class="card-details">
                <div class="detail-item">
                    <i class="fas fa-calendar-day"></i>
                    <span>Días: ${licencia.dias_maximos || 'Variable'}</span>
                </div>
                <div class="detail-item">
                    <i class="fas ${licencia.requiere_certificado ? 'fa-file-medical' : 'fa-check-circle'}"></i>
                    <span>${licencia.requiere_certificado ? 'Requiere certificado' : 'Sin certificado'}</span>
                </div>
            </div>
            <button type="button" class="btn-select" onclick="seleccionarLicencia(${licencia.id})">
                <i class="fas fa-check"></i> Seleccionar
            </button>
        </div>
    `;
    
    return card;
}



function seleccionarLicencia(id) {
    const licencia = obtenerLicenciaPorId(id);
    
    if (!licencia) {
        mostrarToast('Error al seleccionar la licencia', 'error');
        return;
    }
    
    const card = document.querySelector(`[data-id="${id}"]`);
    const isSelected = selectedLicenses.find(l => l.id === id);
    
    if (isSelected) {
        // Deseleccionar licencia
        selectedLicenses = selectedLicenses.filter(l => l.id !== id);
        card.classList.remove('selected');
        actualizarBotonSeleccion(card, false);
        mostrarToast(`Licencia removida: ${licencia.nombre}`, 'info');
    } else {
        // Seleccionar licencia
        selectedLicenses.push(licencia);
        card.classList.add('selected');
        actualizarBotonSeleccion(card, true);
        mostrarToast(`Licencia agregada: ${licencia.nombre}`, 'success');
    }
    
    // Actualizar contador de selecciones
    actualizarContadorSelecciones();
    
    // Habilitar/deshabilitar botón siguiente
    document.getElementById('nextBtn').disabled = selectedLicenses.length === 0;
}

function actualizarBotonSeleccion(card, isSelected) {
    const button = card.querySelector('.btn-select');
    if (isSelected) {
        button.innerHTML = '<i class="fas fa-check"></i> Seleccionado';
        button.classList.add('selected');
    } else {
        button.innerHTML = '<i class="fas fa-plus"></i> Seleccionar';
        button.classList.remove('selected');
    }
}

function actualizarContadorSelecciones() {
    let contadorElement = document.getElementById('contadorSelecciones');
    
    if (!contadorElement) {
        // Crear contador si no existe
        contadorElement = document.createElement('div');
        contadorElement.id = 'contadorSelecciones';
        contadorElement.className = 'contador-selecciones';
        
        const sectionHeader = document.querySelector('#step1 .section-header');
        sectionHeader.appendChild(contadorElement);
    }
    
    if (selectedLicenses.length === 0) {
        contadorElement.style.display = 'none';
    } else {
        contadorElement.style.display = 'block';
        contadorElement.innerHTML = `
            <div class="contador-content">
                <i class="fas fa-check-circle"></i>
                <span>${selectedLicenses.length} licencia${selectedLicenses.length > 1 ? 's' : ''} seleccionada${selectedLicenses.length > 1 ? 's' : ''}</span>
                <button type="button" class="btn-limpiar" onclick="limpiarSelecciones()">
                    <i class="fas fa-times"></i> Limpiar
                </button>
            </div>
            <div class="lista-seleccionadas">
                ${selectedLicenses.map(lic => `<span class="licencia-tag">${lic.nombre}</span>`).join('')}
            </div>
        `;
    }
}

function limpiarSelecciones() {
    selectedLicenses = [];
    document.querySelectorAll('.licencia-card').forEach(card => {
        card.classList.remove('selected');
        actualizarBotonSeleccion(card, false);
    });
    actualizarContadorSelecciones();
    document.getElementById('nextBtn').disabled = true;
    mostrarToast('Selecciones limpiadas', 'info');
}

function prepararFormulario() {
    const infoContainer = document.getElementById('selectedLicenseInfo');
    
    if (selectedLicenses.length === 1) {
        // Una sola licencia
        const licencia = selectedLicenses[0];
        infoContainer.innerHTML = `
            <div class="selected-licenses-summary">
                <div class="summary-header">
                    <i class="fas fa-clipboard-check"></i>
                    <span>${licencia.nombre}</span>
                </div>
                <p>Complete las fechas para continuar con la solicitud.</p>
            </div>
        `;
        
        // Verificar si es compensación para generar el formulario correcto
        if (licencia.codigo === 'ART_14') {
            generarFormularioCompensacionUnica();
        } else {
            generarCamposDinamicos();
        }
    } else {
        // Múltiples licencias - mostrar formulario separado para cada una
        infoContainer.innerHTML = `
            <div class="selected-licenses-summary">
                <div class="summary-header">
                    <i class="fas fa-layer-group"></i>
                    <span>${selectedLicenses.length} licencias seleccionadas</span>
                </div>
                <p>Complete las fechas para cada licencia individualmente.</p>
            </div>
        `;
        generarFormularioMultipleLicencias();
    }
}

function generarFormularioCompensacionUnica() {
    const container = document.getElementById('camposDinamicos');
    generarCamposCompensacion(container, 0); // Usar índice 0 para licencia única
}

function generarCamposDinamicos() {
    const container = document.getElementById('camposDinamicos');
    container.innerHTML = '';
    
    // Solo crear los campos esenciales: fecha_inicio, fecha_fin y cantidad_dias
    const camposEsenciales = ['fecha_inicio', 'fecha_fin', 'cantidad_dias'];
    
    camposEsenciales.forEach(campo => {
        const fieldGroup = crearCampoDinamico(campo);
        container.appendChild(fieldGroup);
    });
    
    // Configurar el cálculo automático de días
    configurarCalculoAutomaticoDias();
}

function crearCampoDinamico(campo) {
    const div = document.createElement('div');
    div.className = 'form-group';
    
    const label = document.createElement('label');
    label.setAttribute('for', campo);
    label.textContent = formatearEtiqueta(campo) + ' *';
    
    let input;
    
    switch (campo) {
        case 'fecha_inicio':
        case 'fecha_fin':
        case 'fecha_nacimiento':
        case 'fecha_matrimonio':
        case 'fecha_examen':
        case 'fecha_accidente':
        case 'fecha_fallecimiento':
        case 'fecha_evento':
        case 'fecha_probable_parto':
        case 'fecha_otorgamiento_guarda':
        case 'fecha_compensacion':
            input = document.createElement('input');
            input.type = 'date';
            input.id = campo;
            input.name = campo;
            input.required = true;
            break;
            
        case 'diagnostico':
        case 'motivo':
        case 'motivo_urgente':
        case 'justificacion_detallada':
        case 'descripcion_actividad':
        case 'tratamiento':
            input = document.createElement('textarea');
            input.id = campo;
            input.name = campo;
            input.required = true;
            input.rows = 3;
            break;
            
        case 'parentesco':
            input = document.createElement('select');
            input.id = campo;
            input.name = campo;
            input.required = true;
            input.innerHTML = `
                <option value="">Seleccionar parentesco</option>
                <option value="conyuge">Cónyuge</option>
                <option value="hijo">Hijo/a</option>
                <option value="padre">Padre</option>
                <option value="madre">Madre</option>
                <option value="hermano">Hermano/a</option>
                <option value="abuelo">Abuelo/a</option>
                <option value="nieto">Nieto/a</option>
                <option value="tio">Tío/a</option>
                <option value="sobrino">Sobrino/a</option>
                <option value="otro">Otro familiar</option>
            `;
            break;
            
        case 'nuevo_horario':
            input = document.createElement('input');
            input.type = 'time';
            input.id = campo;
            input.name = campo;
            input.required = true;
            break;
            
        case 'cantidad_horas':
            input = document.createElement('input');
            input.type = 'number';
            input.id = campo;
            input.name = campo;
            input.min = '1';
            input.max = '200';
            input.required = true;
            break;
            
        case 'cantidad_dias':
            input = document.createElement('input');
            input.type = 'number';
            input.id = campo;
            input.name = campo;
            input.readOnly = true;
            input.className = 'readonly-field';
            input.placeholder = 'Se calcula automáticamente';
            break;
            
        default:
            input = document.createElement('input');
            input.type = 'text';
            input.id = campo;
            input.name = campo;
            input.required = true;
            break;
    }
    
    div.appendChild(label);
    div.appendChild(input);
    
    // Agregar ayuda contextual si es necesario
    const ayuda = obtenerAyudaCampo(campo);
    if (ayuda) {
        const helpText = document.createElement('small');
        helpText.className = 'help-text';
        helpText.innerHTML = `<i class="fas fa-info-circle"></i> ${ayuda}`;
        div.appendChild(helpText);
    }
    
    return div;
}

function formatearEtiqueta(campo) {
    const etiquetas = {
        'fecha_inicio': 'Fecha de Inicio',
        'fecha_fin': 'Fecha de Fin',
        'certificado_medico': 'Certificado Médico',
        'diagnostico': 'Diagnóstico',
        'motivo': 'Motivo',
        'motivo_urgente': 'Motivo Urgente',
        'parentesco': 'Parentesco',
        'certificado_familiar': 'Certificado Médico del Familiar',
        'fecha_matrimonio': 'Fecha del Matrimonio',
        'acta_matrimonio': 'Acta de Matrimonio',
        'fecha_examen': 'Fecha del Examen',
        'institucion': 'Institución',
        'constancia_inscripcion': 'Constancia de Inscripción',
        'fecha_nacimiento': 'Fecha de Nacimiento',
        'acta_nacimiento': 'Acta de Nacimiento',
        'fecha_evento': 'Fecha del Evento',
        'acta_correspondiente': 'Acta Correspondiente',
        'fecha_fallecimiento': 'Fecha de Fallecimiento',
        'acta_defuncion': 'Acta de Defunción',
        'fecha_accidente': 'Fecha del Accidente',
        'lugar_accidente': 'Lugar del Accidente',
        'informe_medico': 'Informe Médico',
        'denuncia_art': 'Denuncia ART',
        'fecha_otorgamiento_guarda': 'Fecha de Otorgamiento de Guarda',
        'resolucion_judicial': 'Resolución Judicial',
        'descripcion_actividad': 'Descripción de la Actividad',
        'autorizacion_superior': 'Autorización del Superior',
        'fecha_probable_parto': 'Fecha Probable de Parto',
        'nuevo_horario': 'Nuevo Horario',
        'justificacion_detallada': 'Justificación Detallada',
        'periodo_horas_extras': 'Período de Horas Extras',
        'cantidad_horas': 'Cantidad de Horas',
        'cantidad_dias': 'Cantidad de Días',
        'fecha_compensacion': 'Fecha de Compensación',
        'tratamiento': 'Tratamiento',
        'certificado_especialista': 'Certificado del Especialista',
        'tipo_proceso': 'Tipo de Proceso',
        'resolucion_administrativa': 'Resolución Administrativa',
        'nuevas_tareas': 'Nuevas Tareas',
        'fecha_mesa': 'Fecha de la Mesa',
        'designacion_oficial': 'Designación Oficial'
    };
    
    return etiquetas[campo] || campo.replace(/_/g, ' ').toUpperCase();
}

function configurarCalculoAutomaticoDias() {
    const fechaInicioInput = document.getElementById('fecha_inicio');
    const fechaFinInput = document.getElementById('fecha_fin');
    const cantidadDiasInput = document.getElementById('cantidad_dias');
    
    if (fechaInicioInput && fechaFinInput && cantidadDiasInput) {
        const calcularDias = () => {
            const fechaInicio = fechaInicioInput.value;
            const fechaFin = fechaFinInput.value;
            
            if (fechaInicio && fechaFin) {
                const inicio = new Date(fechaInicio);
                const fin = new Date(fechaFin);
                
                if (fin >= inicio) {
                    // Calcular días incluidos (fin - inicio + 1)
                    const diffTime = Math.abs(fin - inicio);
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
                    cantidadDiasInput.value = diffDays;
                } else {
                    cantidadDiasInput.value = '';
                    mostrarToast('La fecha de fin debe ser posterior a la fecha de inicio', 'warning');
                }
            } else {
                cantidadDiasInput.value = '';
            }
        };
        
        fechaInicioInput.addEventListener('change', calcularDias);
        fechaFinInput.addEventListener('change', calcularDias);
    }
}

function obtenerAyudaCampo(campo) {
    const ayudas = {
        'fecha_inicio': 'Seleccione la fecha de inicio de la licencia',
        'fecha_fin': 'Seleccione la fecha de finalización de la licencia',
        'certificado_medico': 'Adjunte o mencione el certificado médico correspondiente',
        'diagnostico': 'Indique el diagnóstico médico detallado',
        'parentesco': 'Seleccione la relación familiar',
        'cantidad_horas': 'Indique la cantidad total de horas a compensar',
        'nuevo_horario': 'Especifique el nuevo horario de trabajo'
    };
    
    return ayudas[campo] || null;
}

function generarFormularioMultipleLicencias() {
    const container = document.getElementById('camposDinamicos');
    container.innerHTML = '';
    
    selectedLicenses.forEach((licencia, index) => {
        const licenciaContainer = document.createElement('div');
        licenciaContainer.className = 'licencia-individual';
        licenciaContainer.innerHTML = `
            <div class="licencia-header">
                <h4><i class="fas fa-calendar-alt"></i> ${licencia.nombre}</h4>
                <span class="licencia-codigo">${licencia.codigo}</span>
            </div>
            <div class="licencia-campos" id="campos-licencia-${index}">
                <!-- Campos se generarán aquí -->
            </div>
        `;
        container.appendChild(licenciaContainer);
        
        // Generar campos para esta licencia específica
        generarCamposParaLicencia(index);
    });
}

function generarCamposParaLicencia(index) {
    const container = document.getElementById(`campos-licencia-${index}`);
    const licencia = selectedLicenses[index];
    
    // Verificar si es Art. 14 Compensación
    if (licencia.codigo === 'ART_14') {
        generarCamposCompensacion(container, index);
    } else {
        // Campos normales para otras licencias
        const camposEsenciales = ['fecha_inicio', 'fecha_fin', 'cantidad_dias'];
        
        camposEsenciales.forEach(campo => {
            const fieldGroup = crearCampoDinamicoConIndex(campo, index);
            container.appendChild(fieldGroup);
        });
        
        // Configurar el cálculo automático para esta licencia específica
        configurarCalculoAutomaticoDiasConIndex(index);
    }
}

function generarCamposCompensacion(container, licenciaIndex) {
    // Inicializar el contador de compensaciones si no existe
    if (!window.compensacionesCount) {
        window.compensacionesCount = {};
    }
    if (!window.compensacionesCount[licenciaIndex]) {
        window.compensacionesCount[licenciaIndex] = 0;
    }
    
    container.innerHTML = `
        <div class="compensaciones-container" id="compensaciones-${licenciaIndex}">
            <div class="compensaciones-header">
                <h5><i class="fas fa-calendar-check"></i> Compensaciones</h5>
                <button type="button" class="btn-agregar-compensacion" onclick="agregarCompensacion(${licenciaIndex})">
                    <i class="fas fa-plus"></i> Agregar Compensación
                </button>
            </div>
            <div class="compensaciones-list" id="compensaciones-list-${licenciaIndex}">
                <!-- Las compensaciones se agregarán aquí -->
            </div>
        </div>
    `;
    
    // Agregar la primera compensación por defecto
    agregarCompensacion(licenciaIndex);
}

function agregarCompensacion(licenciaIndex) {
    const compensacionIndex = window.compensacionesCount[licenciaIndex];
    const container = document.getElementById(`compensaciones-list-${licenciaIndex}`);
    
    const compensacionDiv = document.createElement('div');
    compensacionDiv.className = 'compensacion-item';
    compensacionDiv.id = `compensacion-${licenciaIndex}-${compensacionIndex}`;
    
    compensacionDiv.innerHTML = `
        <div class="compensacion-header">
            <span class="compensacion-numero">Compensación ${compensacionIndex + 1}</span>
            ${compensacionIndex > 0 ? `
                <button type="button" class="btn-eliminar-compensacion" onclick="eliminarCompensacion(${licenciaIndex}, ${compensacionIndex})">
                    <i class="fas fa-trash"></i>
                </button>
            ` : ''}
        </div>
        <div class="compensacion-campos">
            <div class="form-group">
                <label for="licencia_origen_${licenciaIndex}_${compensacionIndex}">Licencia que corresponde *</label>
                <input type="text" id="licencia_origen_${licenciaIndex}_${compensacionIndex}" name="licencia_origen_${licenciaIndex}_${compensacionIndex}" required placeholder="Ej: Art. 22 Enfermedad - Julio 2024">
                <small class="help-text">
                    <i class="fas fa-info-circle"></i> 
                    Especifique la licencia y período al que corresponde la compensación
                </small>
            </div>
            <div class="form-group">
                <label for="fecha_inicio_${licenciaIndex}_${compensacionIndex}">Fecha de Inicio *</label>
                <input type="date" id="fecha_inicio_${licenciaIndex}_${compensacionIndex}" name="fecha_inicio_${licenciaIndex}_${compensacionIndex}" required>
            </div>
            <div class="form-group">
                <label for="fecha_fin_${licenciaIndex}_${compensacionIndex}">Fecha de Fin *</label>
                <input type="date" id="fecha_fin_${licenciaIndex}_${compensacionIndex}" name="fecha_fin_${licenciaIndex}_${compensacionIndex}" required>
            </div>
            <div class="form-group">
                <label for="cantidad_dias_${licenciaIndex}_${compensacionIndex}">Cantidad de Días</label>
                <input type="number" id="cantidad_dias_${licenciaIndex}_${compensacionIndex}" name="cantidad_dias_${licenciaIndex}_${compensacionIndex}" class="readonly-field" readonly placeholder="Se calcula automáticamente">
            </div>
        </div>
    `;
    
    container.appendChild(compensacionDiv);
    
    // Configurar cálculo automático para esta compensación
    configurarCalculoCompensacion(licenciaIndex, compensacionIndex);
    
    // Incrementar contador
    window.compensacionesCount[licenciaIndex]++;
}

function eliminarCompensacion(licenciaIndex, compensacionIndex) {
    const compensacionElement = document.getElementById(`compensacion-${licenciaIndex}-${compensacionIndex}`);
    if (compensacionElement) {
        compensacionElement.remove();
        
        // Renumerar las compensaciones restantes
        renumerarCompensaciones(licenciaIndex);
    }
}

function renumerarCompensaciones(licenciaIndex) {
    const container = document.getElementById(`compensaciones-list-${licenciaIndex}`);
    const compensaciones = container.querySelectorAll('.compensacion-item');
    
    compensaciones.forEach((compensacion, index) => {
        const numeroSpan = compensacion.querySelector('.compensacion-numero');
        if (numeroSpan) {
            numeroSpan.textContent = `Compensación ${index + 1}`;
        }
    });
}

function configurarCalculoCompensacion(licenciaIndex, compensacionIndex) {
    const fechaInicioInput = document.getElementById(`fecha_inicio_${licenciaIndex}_${compensacionIndex}`);
    const fechaFinInput = document.getElementById(`fecha_fin_${licenciaIndex}_${compensacionIndex}`);
    const cantidadDiasInput = document.getElementById(`cantidad_dias_${licenciaIndex}_${compensacionIndex}`);
    
    if (fechaInicioInput && fechaFinInput && cantidadDiasInput) {
        const calcularDias = () => {
            const fechaInicio = fechaInicioInput.value;
            const fechaFin = fechaFinInput.value;
            
            if (fechaInicio && fechaFin) {
                const inicio = new Date(fechaInicio);
                const fin = new Date(fechaFin);
                
                if (fin >= inicio) {
                    const diffTime = Math.abs(fin - inicio);
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
                    cantidadDiasInput.value = diffDays;
                } else {
                    cantidadDiasInput.value = '';
                    mostrarToast('La fecha de fin debe ser posterior a la fecha de inicio', 'warning');
                }
            } else {
                cantidadDiasInput.value = '';
            }
        };
        
        fechaInicioInput.addEventListener('change', calcularDias);
        fechaFinInput.addEventListener('change', calcularDias);
    }
}

function crearCampoDinamicoConIndex(campo, index) {
    const div = document.createElement('div');
    div.className = 'form-group';
    
    const fieldId = `${campo}_${index}`;
    const label = document.createElement('label');
    label.setAttribute('for', fieldId);
    label.textContent = formatearEtiqueta(campo) + (campo !== 'cantidad_dias' ? ' *' : '');
    
    let input;
    
    switch (campo) {
        case 'fecha_inicio':
        case 'fecha_fin':
            input = document.createElement('input');
            input.type = 'date';
            input.id = fieldId;
            input.name = fieldId;
            input.required = true;
            break;
            
        case 'cantidad_dias':
            input = document.createElement('input');
            input.type = 'number';
            input.id = fieldId;
            input.name = fieldId;
            input.readOnly = true;
            input.className = 'readonly-field';
            input.placeholder = 'Se calcula automáticamente';
            break;
            
        default:
            input = document.createElement('input');
            input.type = 'text';
            input.id = fieldId;
            input.name = fieldId;
            input.required = true;
            break;
    }
    
    div.appendChild(label);
    div.appendChild(input);
    
    return div;
}

function configurarCalculoAutomaticoDiasConIndex(index) {
    const fechaInicioInput = document.getElementById(`fecha_inicio_${index}`);
    const fechaFinInput = document.getElementById(`fecha_fin_${index}`);
    const cantidadDiasInput = document.getElementById(`cantidad_dias_${index}`);
    
    if (fechaInicioInput && fechaFinInput && cantidadDiasInput) {
        const calcularDias = () => {
            const fechaInicio = fechaInicioInput.value;
            const fechaFin = fechaFinInput.value;
            
            if (fechaInicio && fechaFin) {
                const inicio = new Date(fechaInicio);
                const fin = new Date(fechaFin);
                
                if (fin >= inicio) {
                    const diffTime = Math.abs(fin - inicio);
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
                    cantidadDiasInput.value = diffDays;
                    
                    // Validar días máximos para esta licencia
                    const licencia = selectedLicenses[index];
                    if (licencia.dias_maximos && diffDays > licencia.dias_maximos) {
                        mostrarToast(`La licencia "${licencia.nombre}" excede el máximo de ${licencia.dias_maximos} días`, 'warning');
                    }
                } else {
                    cantidadDiasInput.value = '';
                    mostrarToast('La fecha de fin debe ser posterior a la fecha de inicio', 'warning');
                }
            } else {
                cantidadDiasInput.value = '';
            }
        };
        
        fechaInicioInput.addEventListener('change', calcularDias);
        fechaFinInput.addEventListener('change', calcularDias);
    }
}

function aplicarValidacionesEspecificas() {
    // Aplicar validaciones según el tipo de licencia
    const fechaInicio = document.getElementById('fecha_inicio');
    const fechaFin = document.getElementById('fecha_fin');
    
    // La configuración de cálculo automático se maneja en configurarCalculoAutomaticoDias()
}

// Función eliminada - ahora se usa configurarCalculoAutomaticoDias()

function mostrarInfoDias(dias) {
    let infoContainer = document.getElementById('diasInfo');
    if (!infoContainer) {
        infoContainer = document.createElement('div');
        infoContainer.id = 'diasInfo';
        infoContainer.className = 'dias-info';
        document.getElementById('camposDinamicos').appendChild(infoContainer);
    }
    
    const diasHabiles = calcularDiasHabiles(
        document.getElementById('fecha_inicio').value,
        document.getElementById('fecha_fin').value
    );
    
    infoContainer.innerHTML = `
        <div class="info-card">
            <h4><i class="fas fa-calculator"></i> Cálculo de Días</h4>
            <div class="dias-detalle">
                <span class="dias-totales">Días totales: ${dias}</span>
                <span class="dias-habiles">Días hábiles: ${diasHabiles}</span>
                ${selectedLicense.dias_maximos ? 
                    `<span class="dias-restantes">Días disponibles: ${selectedLicense.dias_maximos - dias}</span>` : 
                    ''
                }
            </div>
        </div>
    `;
}

function calcularDiasHabiles(fechaInicio, fechaFin) {
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    let diasHabiles = 0;
    
    for (let fecha = new Date(inicio); fecha <= fin; fecha.setDate(fecha.getDate() + 1)) {
        const diaSemana = fecha.getDay();
        if (diaSemana !== 0 && diaSemana !== 6) { // No es domingo (0) ni sábado (6)
            diasHabiles++;
        }
    }
    
    return diasHabiles;
}

function configurarEventListeners() {
    
    // Formulario
    document.getElementById('solicitudForm').addEventListener('submit', function(e) {
        e.preventDefault();
        if (validarFormulario()) {
            siguientePaso();
        }
    });
    
    // Navegación
    document.getElementById('nextBtn').addEventListener('click', siguientePaso);
    document.getElementById('prevBtn').addEventListener('click', anteriorPaso);
    
    // Los eventos de los botones se configuran dinámicamente en configurarEventosCopia()
    
    // Solicitudes múltiples
    document.getElementById('addRequestBtn').addEventListener('click', agregarNuevaSolicitud);
    
    // Modals
    configurarModals();
}



function siguientePaso() {
    if (currentStep < 3) {
        // Validar paso actual antes de continuar
        if (validarPasoActual()) {
            currentStep++;
            actualizarUI();
            
            // Acciones específicas por paso
            switch(currentStep) {
                case 3:
                    generarSolicitudFinal();
                    break;
            }
        }
    }
}

function anteriorPaso() {
    if (currentStep > 1) {
        currentStep--;
        actualizarUI();
    }
}

function validarPasoActual() {
    switch(currentStep) {
        case 1:
            if (selectedLicenses.length === 0) {
                mostrarToast('Debe seleccionar al menos una licencia antes de continuar', 'error');
                return false;
            }
            // Preparar formulario cuando avanzamos del paso 1
            prepararFormulario();
            return true;
            
        case 2:
            return validarFormulario();
            
        default:
            return true;
    }
}

function validarFormulario() {
    console.log('Validando formulario...', { selectedLicenses });
    const form = document.getElementById('solicitudForm');
    if (!form) return true;
    
    const errors = [];
    const licenciasData = [];
    
    if (selectedLicenses.length === 1) {
        // Validación para una sola licencia
        const licencia = selectedLicenses[0];
        
        if (licencia.codigo === 'ART_14') {
            // Validación especial para compensación única
            const compensaciones = validarCompensaciones(0);
            if (compensaciones.length > 0) {
                licenciasData.push({
                    licencia: licencia,
                    tipo: 'compensacion',
                    compensaciones: compensaciones
                });
            } else {
                errors.push(`Debe agregar al menos una compensación para "${licencia.nombre}"`);
            }
        } else {
            // Validación normal para licencias estándar
            const fechaInicio = document.getElementById('fecha_inicio');
            const fechaFin = document.getElementById('fecha_fin');
            
            // Limpiar errores previos
            [fechaInicio, fechaFin].forEach(field => {
                if (field) field.classList.remove('error');
            });
            
            // Validar campos
            if (!fechaInicio || !fechaInicio.value) {
                errors.push('La fecha de inicio es requerida');
                if (fechaInicio) fechaInicio.classList.add('error');
            }
            
            if (!fechaFin || !fechaFin.value) {
                errors.push('La fecha de fin es requerida');
                if (fechaFin) fechaFin.classList.add('error');
            }
            
            if (fechaInicio && fechaFin && fechaInicio.value && fechaFin.value) {
                if (fechaInicio.value > fechaFin.value) {
                    errors.push('La fecha de inicio no puede ser posterior a la fecha de fin');
                    fechaInicio.classList.add('error');
                    fechaFin.classList.add('error');
                } else {
                    const dias = Math.ceil((new Date(fechaFin.value) - new Date(fechaInicio.value)) / (1000 * 60 * 60 * 24)) + 1;
                    if (licencia.dias_maximos && dias > licencia.dias_maximos) {
                        errors.push(`La cantidad de días (${dias}) excede el máximo permitido (${licencia.dias_maximos})`);
                    }
                    
                    licenciasData.push({
                        licencia: licencia,
                        fecha_inicio: fechaInicio.value,
                        fecha_fin: fechaFin.value,
                        cantidad_dias: dias
                    });
                }
            }
        }
    } else {
        // Validación para múltiples licencias
        selectedLicenses.forEach((licencia, index) => {
            if (licencia.codigo === 'ART_14') {
                // Validación especial para compensaciones
                const compensaciones = validarCompensaciones(index);
                if (compensaciones.length > 0) {
                    licenciasData.push({
                        licencia: licencia,
                        tipo: 'compensacion',
                        compensaciones: compensaciones
                    });
                } else {
                    errors.push(`Debe agregar al menos una compensación para "${licencia.nombre}"`);
                }
            } else {
                // Validación normal para otras licencias
                const fechaInicio = document.getElementById(`fecha_inicio_${index}`);
                const fechaFin = document.getElementById(`fecha_fin_${index}`);
                
                // Limpiar errores previos
                [fechaInicio, fechaFin].forEach(field => {
                    if (field) field.classList.remove('error');
                });
                
                if (!fechaInicio || !fechaInicio.value) {
                    errors.push(`Fecha de inicio requerida para "${licencia.nombre}"`);
                    if (fechaInicio) fechaInicio.classList.add('error');
                }
                
                if (!fechaFin || !fechaFin.value) {
                    errors.push(`Fecha de fin requerida para "${licencia.nombre}"`);
                    if (fechaFin) fechaFin.classList.add('error');
                }
                
                if (fechaInicio && fechaFin && fechaInicio.value && fechaFin.value) {
                    if (fechaInicio.value > fechaFin.value) {
                        errors.push(`Fechas inválidas para "${licencia.nombre}"`);
                        fechaInicio.classList.add('error');
                        fechaFin.classList.add('error');
                    } else {
                        const dias = Math.ceil((new Date(fechaFin.value) - new Date(fechaInicio.value)) / (1000 * 60 * 60 * 24)) + 1;
                        if (licencia.dias_maximos && dias > licencia.dias_maximos) {
                            errors.push(`"${licencia.nombre}" excede el máximo de ${licencia.dias_maximos} días`);
                        }
                        
                        licenciasData.push({
                            licencia: licencia,
                            fecha_inicio: fechaInicio.value,
                            fecha_fin: fechaFin.value,
                            cantidad_dias: dias
                        });
                    }
                }
            }
        });
    }
    
    if (errors.length > 0) {
        mostrarToast(errors.join('<br>'), 'error', 5000);
        return false;
    }
    
    // Guardar datos del formulario
    solicitudData = {
        licencias: selectedLicenses,
        licenciasData: licenciasData,
        observaciones: document.getElementById('observaciones')?.value || ''
    };
    
    console.log('Formulario validado correctamente:', { solicitudData });
    return true;
}

function actualizarUI() {
    // Actualizar indicador de progreso
    document.querySelectorAll('.step').forEach((step, index) => {
        if (index + 1 < currentStep) {
            step.classList.add('completed');
            step.classList.remove('active');
        } else if (index + 1 === currentStep) {
            step.classList.add('active');
            step.classList.remove('completed');
        } else {
            step.classList.remove('active', 'completed');
        }
    });
    
    // Mostrar/ocultar secciones
    document.querySelectorAll('.step-content').forEach((content, index) => {
        if (index + 1 === currentStep) {
            content.classList.add('active');
        } else {
            content.classList.remove('active');
        }
    });
    
    // Actualizar botones de navegación
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    prevBtn.style.display = currentStep > 1 ? 'block' : 'none';
    
    if (currentStep === 3) {
        nextBtn.style.display = 'none';
    } else {
        nextBtn.style.display = 'block';
        nextBtn.textContent = currentStep === 2 ? 'Generar Solicitud' : 'Siguiente';
    }
    
    // Actualizar título de la página según el paso
    actualizarTituloPaso();
}

function actualizarTituloPaso() {
    const titulos = {
        1: 'Paso 1: Seleccionar Licencia',
        2: 'Paso 2: Completar Información',
        3: 'Paso 3: Solicitud Generada'
    };
    
    document.title = `${titulos[currentStep]} - Generador de Licencias`;
}

// Función de vista previa eliminada - ya no se usa

function generarSolicitudFinal() {
    const textoSolicitud = generarTextoPlano(solicitudData);
    
    // Mostrar el texto generado
    const textoElement = document.getElementById('textoGenerado');
    const containerElement = document.getElementById('textoGeneradoContainer');
    
    if (textoElement && containerElement) {
        textoElement.value = textoSolicitud;
        containerElement.style.display = 'block';
        
        // Configurar eventos de los botones
        configurarEventosCopia();
        
        mostrarToast('Solicitud generada exitosamente', 'success');
    } else {
        console.error('Elementos no encontrados:', { textoElement, containerElement });
        mostrarToast('Error al generar la solicitud', 'error');
    }
}

function generarTextoPlano(data) {
    if (!data.licenciasData || data.licenciasData.length === 0) {
        return 'Error: No hay datos de licencias para generar.';
    }
    
    let texto = '';
    
    if (data.licenciasData.length === 1) {
        const licenciaData = data.licenciasData[0];
        texto = generarTextoLicenciaUnica(licenciaData);
    } else {
        texto = generarTextoLicenciasMultiples(data.licenciasData);
    }
    
    return texto;
}

function generarTextoLicenciaUnica(licenciaData) {
    const licencia = licenciaData.licencia;
    
    if (licenciaData.tipo === 'compensacion' && licenciaData.compensaciones) {
        return generarTextoCompensacion(licenciaData.compensaciones);
    } else {
        return generarTextoLicenciaNormal(licencia, licenciaData);
    }
}

function generarTextoLicenciaNormal(licencia, licenciaData) {
    const fechaInicio = new Date(licenciaData.fecha_inicio);
    const fechaFin = new Date(licenciaData.fecha_fin);
    const dias = licenciaData.cantidad_dias;
    
    const nombreDia = fechaInicio.toLocaleDateString('es-ES', { weekday: 'long' });
    const fechaFormateada = fechaInicio.toLocaleDateString('es-ES', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
    });
    
    // Determinar el artículo y motivo según el tipo de licencia
    let articulo, motivo;
    
    switch (licencia.codigo) {
        case 'ART_34_INC_C':
            articulo = 'artículo 35 inc. "c" de la Acordada 34/77';
            motivo = 'motivos particulares';
            break;
        case 'ART_22':
            articulo = 'artículo 22 de la Acordada 34/77';
            motivo = 'enfermedad';
            break;
        case 'ART_23':
            articulo = 'artículo 23 de la Acordada 34/77';
            motivo = 'enfermedad de largo tratamiento';
            break;
        case 'ART_15':
            articulo = 'artículo 15 de la Acordada 34/77';
            motivo = 'matrimonio';
            break;
        case 'ART_16':
            articulo = 'artículo 16 de la Acordada 34/77';
            motivo = 'examen';
            break;
        case 'ART_17':
            articulo = 'artículo 17 de la Acordada 34/77';
            motivo = 'nacimiento de hijo';
            break;
        case 'ART_18':
            articulo = 'artículo 18 de la Acordada 34/77';
            motivo = 'fallecimiento de familiar';
            break;
        default:
            articulo = 'normativa correspondiente';
            motivo = 'el motivo solicitado';
    }
    
    const diasTexto = dias === 1 ? `un (1) día` : `${dias} (${numeroATexto(dias)}) días`;
    const fechasTexto = dias === 1 ? 
        `para el día ${nombreDia} ${fechaFormateada.charAt(0).toUpperCase() + fechaFormateada.slice(1)}` :
        `desde el ${fechaInicio.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })} hasta el ${fechaFin.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}`;
    
    return `Tengo el honor de dirigirme a V.E, a fin de solicitarle, tenga a bien, concederme ${diasTexto} de licencia por ${motivo}, conforme lo permite el ${articulo} de la C.S.J.N, ${fechasTexto}, debido a la realización de trámites personales.

Sin otro particular, saludo a V.E. muy atentamente.-`;
}

function generarTextoCompensacion(compensaciones) {
    let texto = 'Tengo el honor de dirigirme a V.E, a fin de solicitarle, tenga a bien, concederme compensación por los siguientes días de licencia utilizados:\n\n';
    
    compensaciones.forEach((comp, index) => {
        const fechaInicio = new Date(comp.fecha_inicio);
        const fechaFin = new Date(comp.fecha_fin);
        const dias = comp.cantidad_dias;
        
        const diasTexto = dias === 1 ? 'un (1) día' : `${dias} (${numeroATexto(dias)}) días`;
        const fechasTexto = dias === 1 ?
            `el día ${fechaInicio.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}` :
            `desde el ${fechaInicio.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })} hasta el ${fechaFin.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}`;
        
        texto += `${index + 1}. ${diasTexto} correspondiente a ${comp.licencia_origen}, utilizado ${fechasTexto}.\n`;
    });
    
    texto += '\nLa compensación se solicita conforme lo permite el artículo 14 de la Acordada 34/77 de la C.S.J.N.\n\nSin otro particular, saludo a V.E. muy atentamente.-';
    
    return texto;
}

function generarTextoLicenciasMultiples(licenciasData) {
    let texto = 'Tengo el honor de dirigirme a V.E, a fin de solicitarle, tenga a bien, concederme las siguientes licencias:\n\n';
    
    licenciasData.forEach((licenciaData, index) => {
        const licencia = licenciaData.licencia;
        const dias = licenciaData.cantidad_dias;
        const fechaInicio = new Date(licenciaData.fecha_inicio);
        const fechaFin = new Date(licenciaData.fecha_fin);
        
        const diasTexto = dias === 1 ? 'un (1) día' : `${dias} (${numeroATexto(dias)}) días`;
        const fechasTexto = dias === 1 ?
            `para el día ${fechaInicio.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}` :
            `desde el ${fechaInicio.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })} hasta el ${fechaFin.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}`;
        
        texto += `${index + 1}. ${diasTexto} por ${licencia.nombre.toLowerCase()}, ${fechasTexto}.\n`;
    });
    
    texto += '\nTodas las licencias se solicitan conforme a la normativa vigente de la C.S.J.N.\n\nSin otro particular, saludo a V.E. muy atentamente.-';
    
    return texto;
}

function numeroATexto(num) {
    const numeros = {
        1: 'uno', 2: 'dos', 3: 'tres', 4: 'cuatro', 5: 'cinco',
        6: 'seis', 7: 'siete', 8: 'ocho', 9: 'nueve', 10: 'diez',
        11: 'once', 12: 'doce', 13: 'trece', 14: 'catorce', 15: 'quince',
        16: 'dieciséis', 17: 'diecisiete', 18: 'dieciocho', 19: 'diecinueve', 20: 'veinte'
    };
    
    return numeros[num] || num.toString();
}

function configurarEventosCopia() {
    const copiarTextoBtn = document.getElementById('copiarTextoBtn');
    const descargarPdfBtn = document.getElementById('descargarPdfBtn');
    
    if (copiarTextoBtn) {
        copiarTextoBtn.onclick = function() {
            const texto = document.getElementById('textoGenerado').value;
            
            if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(texto).then(() => {
                    mostrarToast('Texto copiado al portapapeles', 'success');
                }).catch(() => {
                    mostrarToast('Error al copiar texto', 'error');
                });
            } else {
                // Fallback para navegadores sin clipboard API
                const textArea = document.getElementById('textoGenerado');
                textArea.select();
                document.execCommand('copy');
                mostrarToast('Texto copiado al portapapeles', 'success');
            }
        };
    }
    
    if (descargarPdfBtn) {
        descargarPdfBtn.onclick = function() {
            mostrarToast('Función de PDF en desarrollo. Próximamente disponible.', 'info');
        };
    }
}

// Funciones de utilidad para notificaciones
function mostrarToast(mensaje, tipo = 'info', duracion = 3000) {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast toast-${tipo}`;
    
    const icon = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    }[tipo];
    
    toast.innerHTML = `
        <div class="toast-icon">
            <i class="${icon}"></i>
        </div>
        <div class="toast-message">${mensaje}</div>
        <button class="toast-close" onclick="cerrarToast(this)">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    container.appendChild(toast);
    
    // Mostrar toast con animación
    setTimeout(() => toast.classList.add('show'), 100);
    
    // Auto-cerrar toast
    setTimeout(() => {
        cerrarToast(toast.querySelector('.toast-close'));
    }, duracion);
}

function cerrarToast(button) {
    const toast = button.closest('.toast');
    toast.classList.remove('show');
    setTimeout(() => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    }, 300);
}

// Funciones para modals
function configurarModals() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        const closeBtn = modal.querySelector('.close');
        closeBtn.addEventListener('click', () => cerrarModal(modal.id));
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                cerrarModal(modal.id);
            }
        });
    });
}

function mostrarModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}

function cerrarModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Funciones de ayuda
function mostrarAyuda() {
    mostrarModal('helpModal');
}

function mostrarContacto() {
    mostrarToast('Para soporte técnico, contacte al administrador del sistema', 'info', 5000);
}

// Función para inicializar componentes UI
function inicializarUI() {
    // Configurar tooltips si es necesario
    // Inicializar componentes adicionales
    console.log('UI inicializada');
}

function validarCompensaciones(licenciaIndex) {
    const compensaciones = [];
    const container = document.getElementById(`compensaciones-list-${licenciaIndex}`);
    
    if (!container) return compensaciones;
    
    const compensacionItems = container.querySelectorAll('.compensacion-item');
    
    compensacionItems.forEach((item, index) => {
        const licenciaOrigen = item.querySelector(`input[name^="licencia_origen_${licenciaIndex}_"]`);
        const fechaInicio = item.querySelector(`input[name^="fecha_inicio_${licenciaIndex}_"]`);
        const fechaFin = item.querySelector(`input[name^="fecha_fin_${licenciaIndex}_"]`);
        const cantidadDias = item.querySelector(`input[name^="cantidad_dias_${licenciaIndex}_"]`);
        
        // Limpiar errores previos
        [licenciaOrigen, fechaInicio, fechaFin].forEach(field => {
            if (field) field.classList.remove('error');
        });
        
        let esValida = true;
        
        if (!licenciaOrigen || !licenciaOrigen.value || licenciaOrigen.value.trim().length < 3) {
            if (licenciaOrigen) licenciaOrigen.classList.add('error');
            esValida = false;
        }
        
        if (!fechaInicio || !fechaInicio.value) {
            if (fechaInicio) fechaInicio.classList.add('error');
            esValida = false;
        }
        
        if (!fechaFin || !fechaFin.value) {
            if (fechaFin) fechaFin.classList.add('error');
            esValida = false;
        }
        
        if (esValida && fechaInicio.value && fechaFin.value) {
            if (fechaInicio.value > fechaFin.value) {
                fechaInicio.classList.add('error');
                fechaFin.classList.add('error');
                esValida = false;
            }
        }
        
        if (esValida) {
            compensaciones.push({
                licencia_origen: licenciaOrigen.value.trim(),
                fecha_inicio: fechaInicio.value,
                fecha_fin: fechaFin.value,
                cantidad_dias: parseInt(cantidadDias.value) || 0
            });
        }
    });
    
    return compensaciones;
}