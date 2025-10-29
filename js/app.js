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
        "ART_29"        // Art. 29. Atención de Familiar Enfermo
    ];
    
    const todasLasLicencias = obtenerTodasLasLicencias();
    
    // Mostrar licencias principales en el orden específico
    licenciasPrincipales.forEach(codigoLicencia => {
        const licencia = todasLasLicencias.find(lic => lic.codigo === codigoLicencia);
        if (licencia) {
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


function limpiarSelecciones() {
    selectedLicenses = [];
    document.querySelectorAll('.licencia-card').forEach(card => {
        card.classList.remove('selected');
        actualizarBotonSeleccion(card, false);
    });
    document.getElementById('nextBtn').disabled = true;
    mostrarToast('Selecciones limpiadas', 'info');
}

function prepararFormulario() {
    const infoContainer = document.getElementById('selectedLicenseInfo');
    
    // Actualizar el texto de las licencias seleccionadas
    actualizarTextoLicenciasSeleccionadas();
    
    if (selectedLicenses.length === 1) {
        // Una sola licencia
        const licencia = selectedLicenses[0];
        infoContainer.innerHTML = '';
        
        // Verificar si es compensación para generar el formulario correcto
        if (licencia.codigo === 'ART_14') {
            generarFormularioCompensacionUnica();
        } else {
            generarCamposDinamicos();
        }
    } else {
        // Múltiples licencias - mostrar formulario separado para cada una
        infoContainer.innerHTML = '';
        generarFormularioMultipleLicencias();
    }
}

function actualizarTextoLicenciasSeleccionadas() {
    const textoElement = document.getElementById('licenciasSeleccionadasTexto');
    
    if (!textoElement) return;
    
    if (selectedLicenses.length === 0) {
        textoElement.textContent = '';
        return;
    }
    
    let texto = '';
    
    if (selectedLicenses.length === 1) {
        // Una sola licencia
        texto = `(${selectedLicenses[0].nombre})`;
    } else {
        // Múltiples licencias
        const nombres = selectedLicenses.map(lic => {
            // Acortar nombres muy largos
            let nombre = lic.nombre;
            if (nombre.length > 30) {
                nombre = nombre.substring(0, 27) + '...';
            }
            return nombre;
        });
        
        if (nombres.length <= 2) {
            texto = `(${nombres.join(' y ')})`;
        } else {
            texto = `(${nombres.slice(0, 2).join(', ')} y ${nombres.length - 2} más)`;
        }
    }
    
    textoElement.textContent = texto;
}

function generarFormularioCompensacionUnica() {
    const container = document.getElementById('camposDinamicos');
    generarCamposCompensacion(container, 0); // Usar índice 0 para licencia única
}

function generarCamposDinamicos() {
    const container = document.getElementById('camposDinamicos');
    container.innerHTML = '';
    
    // Crear una fila para los campos esenciales: fecha_inicio, fecha_fin y cantidad_dias
    const formRow = document.createElement('div');
    formRow.className = 'form-row';
    
    const camposEsenciales = ['fecha_inicio', 'fecha_fin', 'cantidad_dias'];
    
    camposEsenciales.forEach(campo => {
        const fieldGroup = crearCampoDinamico(campo);
        formRow.appendChild(fieldGroup);
    });
    
    container.appendChild(formRow);
    
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
            // Crear contenedor para input con botones
            const container = document.createElement('div');
            container.className = 'number-input-container';
            
            const decrementBtn = document.createElement('button');
            decrementBtn.type = 'button';
            decrementBtn.className = 'number-btn decrement';
            decrementBtn.innerHTML = '<i class="fas fa-minus"></i>';
            decrementBtn.onclick = () => adjustDays(campo, -1);
            
            input = document.createElement('input');
            input.type = 'number';
            input.id = campo;
            input.name = campo;
            input.readOnly = true;
            input.min = '1';
            input.max = '365';
            
            const incrementBtn = document.createElement('button');
            incrementBtn.type = 'button';
            incrementBtn.className = 'number-btn increment';
            incrementBtn.innerHTML = '<i class="fas fa-plus"></i>';
            incrementBtn.onclick = () => adjustDays(campo, 1);
            
            container.appendChild(decrementBtn);
            container.appendChild(input);
            container.appendChild(incrementBtn);
            
            // Agregar texto helper similar a los campos de fecha
            const helperText = document.createElement('small');
            helperText.className = 'help-text';
            helperText.innerHTML = '<i class="fas fa-info-circle"></i> El sistema no distingue feriados ni fines de semana en este cálculo';
            
            // Retornar el contenedor en lugar del input
            div.appendChild(label);
            div.appendChild(container);
            div.appendChild(helperText);
            return div;
            
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

function adjustDays(inputId, change) {
    const input = document.getElementById(inputId);
    if (!input) return;
    
    const currentValue = parseInt(input.value) || 0;
    const newValue = Math.max(1, Math.min(365, currentValue + change));
    
    input.value = newValue;
    
    // Disparar evento change para actualizar cálculos si es necesario
    const event = new Event('change', { bubbles: true });
    input.dispatchEvent(event);
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
        'cantidad_dias': 'Indique la cantidad total de días a compensar',
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
        // Campos normales para otras licencias en una fila compacta
        const formRow = document.createElement('div');
        formRow.className = 'form-row';
        
        const camposEsenciales = ['fecha_inicio', 'fecha_fin', 'cantidad_dias'];
        
        camposEsenciales.forEach(campo => {
            const fieldGroup = crearCampoDinamicoConIndex(campo, index);
            formRow.appendChild(fieldGroup);
        });
        
        container.appendChild(formRow);
        
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
            <div class="form-row">
                <div class="form-group">
                    <label>Período *</label>
                    <div class="periodo-buttons-simple">
                        <button type="button" class="periodo-btn-simple" id="btn_enero_${licenciaIndex}_${compensacionIndex}" onclick="seleccionarPeriodo(${licenciaIndex}, ${compensacionIndex}, 'ENERO')">
                            <i class="fas fa-check" style="display: none;"></i>
                            Enero
                        </button>
                        <button type="button" class="periodo-btn-simple" id="btn_julio_${licenciaIndex}_${compensacionIndex}" onclick="seleccionarPeriodo(${licenciaIndex}, ${compensacionIndex}, 'JULIO')">
                            <i class="fas fa-check" style="display: none;"></i>
                            Julio
                        </button>
                    </div>
                    <small class="help-text">
                        <i class="fas fa-info-circle"></i> 
                        Seleccione el MES que corresponde a la licencia
                    </small>
                </div>
                <div class="form-group">
                    <label for="ano_${licenciaIndex}_${compensacionIndex}">Año *</label>
                    <select id="ano_${licenciaIndex}_${compensacionIndex}" name="ano_${licenciaIndex}_${compensacionIndex}" required onchange="actualizarLicenciaOrigenCombinada(${licenciaIndex}, ${compensacionIndex})">
                        <option value="">Año</option>
                    </select>
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
                    <div class="number-input-container">
                        <button type="button" class="number-btn decrement" onclick="adjustDays('cantidad_dias_${licenciaIndex}_${compensacionIndex}', -1)">
                            <i class="fas fa-minus"></i>
                        </button>
                        <input type="number" id="cantidad_dias_${licenciaIndex}_${compensacionIndex}" name="cantidad_dias_${licenciaIndex}_${compensacionIndex}" readonly min="1" max="365">
                        <button type="button" class="number-btn increment" onclick="adjustDays('cantidad_dias_${licenciaIndex}_${compensacionIndex}', 1)">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                    <small class="help-text">
                    <i class="fas fa-info-circle"></i> 
                    El sistema no distingue feriados ni fines de semana en este cálculo
                </small>
                </div>
            </div>
        </div>
    `;
    
    container.appendChild(compensacionDiv);
    
    // Poblar el select de años
    poblarSelectAnos(licenciaIndex, compensacionIndex);
    
    // Configurar validación en tiempo real
    configurarValidacionEnTiempoReal(licenciaIndex, compensacionIndex);
    
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

function poblarSelectAnos(licenciaIndex, compensacionIndex) {
    const selectAno = document.getElementById(`ano_${licenciaIndex}_${compensacionIndex}`);
    const anoActual = new Date().getFullYear();
    
    // Limpiar opciones existentes excepto la primera
    selectAno.innerHTML = '<option value="">Seleccionar</option>';
    
    // Agregar años desde el actual hasta 6 años atrás
    for (let i = 0; i <= 6; i++) {
        const ano = anoActual - i;
        const option = document.createElement('option');
        option.value = ano;
        option.textContent = ano;
        selectAno.appendChild(option);
    }
}

function seleccionarPeriodo(licenciaIndex, compensacionIndex, periodo) {
    const btnEnero = document.getElementById(`btn_enero_${licenciaIndex}_${compensacionIndex}`);
    const btnJulio = document.getElementById(`btn_julio_${licenciaIndex}_${compensacionIndex}`);
    
    // Remover selección de ambos botones
    btnEnero.classList.remove('selected');
    btnJulio.classList.remove('selected');
    btnEnero.querySelector('.fas').style.display = 'none';
    btnJulio.querySelector('.fas').style.display = 'none';
    
    // Seleccionar el botón clickeado
    if (periodo === 'ENERO') {
        btnEnero.classList.add('selected');
        btnEnero.querySelector('.fas').style.display = 'inline';
    } else if (periodo === 'JULIO') {
        btnJulio.classList.add('selected');
        btnJulio.querySelector('.fas').style.display = 'inline';
    }
    
    // Actualizar el valor combinado
    actualizarLicenciaOrigenCombinada(licenciaIndex, compensacionIndex);
    
    // Validar periodo en tiempo real
    validarPeriodoEnTiempoReal(licenciaIndex, compensacionIndex);
}

function validarPeriodoEnTiempoReal(licenciaIndex, compensacionIndex) {
    const btnEnero = document.getElementById(`btn_enero_${licenciaIndex}_${compensacionIndex}`);
    const btnJulio = document.getElementById(`btn_julio_${licenciaIndex}_${compensacionIndex}`);
    const selectAno = document.getElementById(`ano_${licenciaIndex}_${compensacionIndex}`);
    
    const tieneEnero = btnEnero && btnEnero.classList.contains('selected');
    const tieneJulio = btnJulio && btnJulio.classList.contains('selected');
    const tieneAno = selectAno && selectAno.value;
    
    const periodoValido = tieneEnero || tieneJulio;
    
    // Remover clases anteriores
    [btnEnero, btnJulio, selectAno].forEach(elem => {
        if (elem) {
            elem.classList.remove('error', 'valid');
        }
    });
    
    // Aplicar clases válidas
    if (periodoValido) {
        if (btnEnero) btnEnero.classList.add('valid');
        if (btnJulio) btnJulio.classList.add('valid');
    }
    
    if (tieneAno) {
        selectAno.classList.add('valid');
    }
}

function actualizarLicenciaOrigenCombinada(licenciaIndex, compensacionIndex) {
    const btnEnero = document.getElementById(`btn_enero_${licenciaIndex}_${compensacionIndex}`);
    const btnJulio = document.getElementById(`btn_julio_${licenciaIndex}_${compensacionIndex}`);
    const selectAno = document.getElementById(`ano_${licenciaIndex}_${compensacionIndex}`);
    
    let periodo = '';
    if (btnEnero && btnEnero.classList.contains('selected')) {
        periodo = 'ENERO';
    } else if (btnJulio && btnJulio.classList.contains('selected')) {
        periodo = 'JULIO';
    }
    
    const ano = selectAno ? selectAno.value : '';
    
    // Crear un campo oculto para almacenar el valor combinado
    const hiddenInput = document.getElementById(`licencia_origen_hidden_${licenciaIndex}_${compensacionIndex}`) || 
                       (() => {
                           const input = document.createElement('input');
                           input.type = 'hidden';
                           input.id = `licencia_origen_hidden_${licenciaIndex}_${compensacionIndex}`;
                           input.name = `licencia_origen_${licenciaIndex}_${compensacionIndex}`;
                           document.getElementById(`compensacion-${licenciaIndex}-${compensacionIndex}`).appendChild(input);
                           return input;
                       })();
    
    if (periodo && ano) {
        hiddenInput.value = `${periodo} ${ano}`;
    } else {
        hiddenInput.value = '';
    }
    
    // Validar después de actualizar
    validarPeriodoEnTiempoReal(licenciaIndex, compensacionIndex);
}

function configurarValidacionEnTiempoReal(licenciaIndex, compensacionIndex) {
    const btnEnero = document.getElementById(`btn_enero_${licenciaIndex}_${compensacionIndex}`);
    const btnJulio = document.getElementById(`btn_julio_${licenciaIndex}_${compensacionIndex}`);
    const selectAno = document.getElementById(`ano_${licenciaIndex}_${compensacionIndex}`);
    const fechaInicio = document.getElementById(`fecha_inicio_${licenciaIndex}_${compensacionIndex}`);
    const fechaFin = document.getElementById(`fecha_fin_${licenciaIndex}_${compensacionIndex}`);

    function validarCampo(elemento, esValido) {
        if (elemento) {
            elemento.classList.remove('error', 'valid');
            if (esValido) {
                elemento.classList.add('valid');
            }
        }
    }

    function validarPeriodoYAno() {
        const tieneEnero = btnEnero && btnEnero.classList.contains('selected');
        const tieneJulio = btnJulio && btnJulio.classList.contains('selected');
        const tieneAno = selectAno && selectAno.value;
        
        const periodoValido = tieneEnero || tieneJulio;
        
        validarCampo(btnEnero, periodoValido);
        validarCampo(btnJulio, periodoValido);
        validarCampo(selectAno, tieneAno);
    }

    // Configurar listeners para año
    if (selectAno) {
        selectAno.addEventListener('change', function() {
            validarPeriodoYAno();
        });
    }

    // Configurar listeners para fechas
    if (fechaInicio) {
        fechaInicio.addEventListener('change', function() {
            validarCampo(fechaInicio, this.value);
        });
    }

    if (fechaFin) {
        fechaFin.addEventListener('change', function() {
            validarCampo(fechaFin, this.value);
        });
    }
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
            // Crear contenedor para input con botones
            const container = document.createElement('div');
            container.className = 'number-input-container';
            
            const decrementBtn = document.createElement('button');
            decrementBtn.type = 'button';
            decrementBtn.className = 'number-btn decrement';
            decrementBtn.innerHTML = '<i class="fas fa-minus"></i>';
            decrementBtn.onclick = () => adjustDays(fieldId, -1);
            
            input = document.createElement('input');
            input.type = 'number';
            input.id = fieldId;
            input.name = fieldId;
            input.readOnly = true;
            input.min = '1';
            input.max = '365';
            
            const incrementBtn = document.createElement('button');
            incrementBtn.type = 'button';
            incrementBtn.className = 'number-btn increment';
            incrementBtn.innerHTML = '<i class="fas fa-plus"></i>';
            incrementBtn.onclick = () => adjustDays(fieldId, 1);
            
            container.appendChild(decrementBtn);
            container.appendChild(input);
            container.appendChild(incrementBtn);
            
            // Agregar texto helper similar a los campos de fecha
            const helperText = document.createElement('small');
            helperText.className = 'help-text';
            helperText.innerHTML = '<i class="fas fa-info-circle"></i> El sistema no distingue feriados ni fines de semana en este cálculo';
            
            // Retornar el contenedor en lugar del input
            div.appendChild(label);
            div.appendChild(container);
            div.appendChild(helperText);
            return div;
            
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
    
    // Agregar observaciones si existen
    if (data.observaciones && data.observaciones.trim()) {
        texto += '\n\nOBSERVACIONES ADICIONALES:\n' + data.observaciones.trim();
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
    const fechaInicio = crearFechaLocal(licenciaData.fecha_inicio);
    const fechaFin = crearFechaLocal(licenciaData.fecha_fin);
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
            articulo = 'artículo 34 inc. "c" de la Acordada 34/77';
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
        case 'ART_29':
            articulo = 'artículo 29 de la Acordada 34/77';
            motivo = 'atención de familiar enfermo';
            break;
        default:
            // Para licencias no especificadas, usar el artículo basado en el código
            const numeroArticulo = obtenerArticuloLicencia(licencia.codigo);
            articulo = `artículo ${numeroArticulo} de la Acordada 34/77`;
            motivo = licencia.nombre.toLowerCase();
    }
    
    const diasTexto = dias === 1 ? `un (1) día` : `${dias} (${numeroATexto(dias)}) días`;
    const fechasTexto = dias === 1 ? 
        `para el día ${nombreDia} ${fechaFormateada.charAt(0).toUpperCase() + fechaFormateada.slice(1)}` :
        `desde el ${fechaInicio.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })} hasta el ${fechaFin.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}`;
    
    let textoFinal = `Tengo el honor de dirigirme a V.E, a fin de solicitarle, tenga a bien, concederme ${diasTexto} de licencia por ${motivo}, conforme lo permite el ${articulo} de la C.S.J.N., ${fechasTexto}, debido a la realización de trámites personales.`;
    
    textoFinal += `\n\nSin otro particular, saludo a V.E. muy atentamente.-`;
    
    return textoFinal;
}

function generarTextoCompensacion(compensaciones) {
    let texto = 'Tengo el honor de dirigirme a V.E, a fin de solicitarle, tenga a bien, concederme compensación por los siguientes días de licencia utilizados:\n\n';
    
    compensaciones.forEach((comp, index) => {
        const fechaInicio = crearFechaLocal(comp.fecha_inicio);
        const fechaFin = crearFechaLocal(comp.fecha_fin);
        const dias = comp.cantidad_dias;
        
        const diasTexto = dias === 1 ? 'un (1) día' : `${dias} (${numeroATexto(dias)}) días`;
        const fechasTexto = dias === 1 ?
            `el día ${fechaInicio.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}` :
            `desde el ${fechaInicio.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })} hasta el ${fechaFin.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}`;
        
        texto += `${diasTexto} correspondiente a ${comp.licencia_origen}, utilizado ${fechasTexto}.\n`;
    });
    
    texto += '\nLa compensación se solicita conforme lo permite el artículo 14 de la Acordada 34/77 de la C.S.J.N.';
    
    texto += '\n\nSin otro particular, saludo a V.E. muy atentamente.-';
    
    return texto;
}

function generarTextoLicenciasMultiples(licenciasData) {
    let texto = 'Tengo el honor de dirigirme a V.E, a fin de solicitarle, tenga a bien, concederme las siguientes licencias:\n\n';
    
    licenciasData.forEach((licenciaData, index) => {
        const licencia = licenciaData.licencia;
        
        // Validar si es una compensación o licencia normal
        if (licenciaData.tipo === 'compensacion' && licenciaData.compensaciones) {
            // Para compensaciones, agregar cada compensación individual
            licenciaData.compensaciones.forEach((comp, compIndex) => {
                const dias = comp.cantidad_dias || 0;
                const fechaInicio = crearFechaLocal(comp.fecha_inicio);
                const fechaFin = crearFechaLocal(comp.fecha_fin);
                
                const diasTexto = dias === 1 ? 'un (1) día' : `${dias} (${numeroATexto(dias)}) días`;
                const fechasTexto = dias === 1 ?
                    `para el día ${fechaInicio.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}` :
                    `desde el ${fechaInicio.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })} hasta el ${fechaFin.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}`;
                
                texto += `${diasTexto} por compensación (${comp.licencia_origen}), ${fechasTexto}.\n`;
            });
        } else {
            // Para licencias normales
            const dias = licenciaData.cantidad_dias || 0;
            const fechaInicio = licenciaData.fecha_inicio ? crearFechaLocal(licenciaData.fecha_inicio) : null;
            const fechaFin = licenciaData.fecha_fin ? crearFechaLocal(licenciaData.fecha_fin) : null;
            
            if (!fechaInicio || !fechaFin || isNaN(fechaInicio.getTime()) || isNaN(fechaFin.getTime())) {
                texto += `Licencia por ${licencia.nombre.toLowerCase()} - [Fechas pendientes de completar].\n`;
            } else {
                const diasTexto = dias === 1 ? 'un (1) día' : `${dias} (${numeroATexto(dias)}) días`;
                const fechasTexto = dias === 1 ?
                    `para el día ${fechaInicio.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}` :
                    `desde el ${fechaInicio.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })} hasta el ${fechaFin.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}`;
                
                texto += `${diasTexto} por ${licencia.nombre.toLowerCase()}, ${fechasTexto}.\n`;
            }
        }
    });
    
    texto += `\nTodas las licencias se solicitan conforme a ${generarTextoArticulos(licenciasData)}`;
    
    texto += '\n\nSin otro particular, saludo a V.E. muy atentamente.-';
    
    return texto;
}

function numeroATexto(num) {
    // Validar que num sea un número válido
    if (num === undefined || num === null || isNaN(num)) {
        return 'X'; // Fallback para valores inválidos
    }
    
    const numeros = {
        1: 'uno', 2: 'dos', 3: 'tres', 4: 'cuatro', 5: 'cinco',
        6: 'seis', 7: 'siete', 8: 'ocho', 9: 'nueve', 10: 'diez',
        11: 'once', 12: 'doce', 13: 'trece', 14: 'catorce', 15: 'quince',
        16: 'dieciséis', 17: 'diecisiete', 18: 'dieciocho', 19: 'diecinueve', 20: 'veinte'
    };
    
    return numeros[num] || num.toString();
}

function numeroOrdinalATexto(num) {
    // Validar que num sea un número válido
    if (num === undefined || num === null || isNaN(num)) {
        return 'X'; // Fallback para valores inválidos
    }
    
    const ordinales = {
        1: 'Primero', 2: 'Segundo', 3: 'Tercero', 4: 'Cuarto', 5: 'Quinto',
        6: 'Sexto', 7: 'Séptimo', 8: 'Octavo', 9: 'Noveno', 10: 'Décimo',
        11: 'Décimo primero', 12: 'Décimo segundo', 13: 'Décimo tercero', 
        14: 'Décimo cuarto', 15: 'Décimo quinto', 16: 'Décimo sexto',
        17: 'Décimo séptimo', 18: 'Décimo octavo', 19: 'Décimo noveno', 20: 'Vigésimo'
    };
    
    return ordinales[num] || `${num}º`;
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
            generarPDF();
        };
    }
}

// Función para generar y descargar PDF
function generarPDF() {
    try {
        // Verificar que jsPDF esté disponible
        if (typeof window.jspdf === 'undefined') {
            mostrarToast('Error: Librería PDF no disponible', 'error');
            return;
        }
        
        // Obtener el texto de la solicitud
        const textoSolicitud = document.getElementById('textoGenerado').value;
        
        if (!textoSolicitud || textoSolicitud.trim() === '') {
            mostrarToast('No hay contenido para generar el PDF', 'warning');
            return;
        }
        
        // Crear nueva instancia de jsPDF
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Configurar fuente y tamaño
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(12);
        
        // Configurar márgenes
        const margenIzquierdo = 25;
        const margenDerecho = 25;
        const anchoUtil = 210 - margenIzquierdo - margenDerecho; // A4 width minus margins
        const margenSuperior = 30;
        let posicionY = margenSuperior;
        
        // Agregar encabezado - Poder Judicial de la Nación
        doc.setFontSize(16);
        doc.setFont('times', 'italic');
        const textoPoder = 'Poder Judicial de la Nación';
        const anchoPoder = doc.getTextWidth(textoPoder);
        const centroX = (210 - anchoPoder) / 2; // Centrar en página A4
        doc.text(textoPoder, centroX, posicionY);
        posicionY += 35;
        
        // Agregar fecha y lugar - Mar del Plata, fecha
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        const fechaActual = new Date().toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'long', 
            year: 'numeric'
        });
        const textoFechaLugar = `Mar del Plata, ${fechaActual}.`;
        doc.text(textoFechaLugar, margenIzquierdo, posicionY);
        posicionY += 25;
        
        // Procesar el texto línea por línea con formato justificado
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        
        const lineas = textoSolicitud.split('\n');
        
        lineas.forEach(linea => {
            if (linea.trim() === '') {
                posicionY += 8; // Espacio para líneas vacías
            } else {
                // Dividir líneas largas y justificar texto
                const palabras = linea.split(' ');
                let lineaActual = '';
                
                palabras.forEach(palabra => {
                    const lineaTest = lineaActual + (lineaActual ? ' ' : '') + palabra;
                    const anchoLinea = doc.getTextWidth(lineaTest);
                    
                    if (anchoLinea > anchoUtil && lineaActual) {
                        // La línea es muy larga, imprimir la línea actual justificada
                        doc.text(lineaActual, margenIzquierdo, posicionY, { 
                            maxWidth: anchoUtil,
                            align: 'justify'
                        });
                        posicionY += 8;
                        lineaActual = palabra;
                        
                        // Verificar si necesitamos una nueva página
                        if (posicionY > 260) { // Cerca del final de la página
                            doc.addPage();
                            posicionY = margenSuperior + 20; // Reiniciar sin encabezado en páginas siguientes
                        }
                    } else {
                        lineaActual = lineaTest;
                    }
                });
                
                // Imprimir la última línea
                if (lineaActual) {
                    doc.text(lineaActual, margenIzquierdo, posicionY, { 
                        maxWidth: anchoUtil,
                        align: 'justify'
                    });
                    posicionY += 8;
                    
                    // Verificar si necesitamos una nueva página
                    if (posicionY > 260) {
                        doc.addPage();
                        posicionY = margenSuperior + 20;
                    }
                }
            }
        });
        
        // Agregar espacio adicional para firma si hay suficiente espacio
        if (posicionY < 220) {
            posicionY += 25;
            
            // Línea para firma
            const anchoLinea = 80;
            const xFirma = margenIzquierdo;
            doc.line(xFirma, posicionY, xFirma + anchoLinea, posicionY);
            
            // Texto "Firma y aclaración"
            doc.setFontSize(10);
            doc.text('Firma y aclaración', xFirma, posicionY + 10);
        }
        
        // Generar nombre del archivo
        const fechaArchivo = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        const nombreArchivo = `Solicitud_Licencia_${fechaArchivo}.pdf`;
        
        // Descargar el PDF
        doc.save(nombreArchivo);
        
        mostrarToast('PDF generado y descargado exitosamente', 'success');
        
    } catch (error) {
        console.error('Error generando PDF:', error);
        mostrarToast('Error al generar el PDF: ' + error.message, 'error');
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
        
        // Validar campos de período y año
        const btnEnero = item.querySelector(`[id*="btn_enero_${licenciaIndex}_"]`);
        const btnJulio = item.querySelector(`[id*="btn_julio_${licenciaIndex}_"]`);
        const selectAno = item.querySelector(`select[name^="ano_${licenciaIndex}_"]`);
        
        // Verificar que al menos un período esté seleccionado
        const tieneEnero = btnEnero && btnEnero.classList.contains('selected');
        const tieneJulio = btnJulio && btnJulio.classList.contains('selected');
        
        if (!tieneEnero && !tieneJulio) {
            if (btnEnero) btnEnero.classList.add('error');
            if (btnJulio) btnJulio.classList.add('error');
            esValida = false;
        } else {
            if (btnEnero) btnEnero.classList.remove('error');
            if (btnJulio) btnJulio.classList.remove('error');
        }
        
        // Verificar que el año esté seleccionado
        if (!selectAno || !selectAno.value) {
            if (selectAno) selectAno.classList.add('error');
            esValida = false;
        } else {
            if (selectAno) selectAno.classList.remove('error');
        }
        
        // La validación del campo oculto
        if (!licenciaOrigen || !licenciaOrigen.value || licenciaOrigen.value.trim().length < 3) {
            // Si falla, marcar los campos visibles como error
            if (btnEnero) btnEnero.classList.add('error');
            if (btnJulio) btnJulio.classList.add('error');
            if (selectAno) selectAno.classList.add('error');
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

// Función helper para crear fechas locales evitando problemas de zona horaria
function crearFechaLocal(fechaString) {
    if (!fechaString) return null;
    
    // Si ya es un objeto Date, devolverlo
    if (fechaString instanceof Date) return fechaString;
    
    // Separar año, mes y día del string YYYY-MM-DD
    const partes = fechaString.split('-');
    if (partes.length !== 3) return new Date(fechaString);
    
    const año = parseInt(partes[0]);
    const mes = parseInt(partes[1]) - 1; // Los meses en JavaScript van de 0-11
    const dia = parseInt(partes[2]);
    
    // Crear fecha local sin problemas de zona horaria
    return new Date(año, mes, dia);
}

// Función para obtener el artículo correspondiente a cada código de licencia
function obtenerArticuloLicencia(codigoLicencia) {
    const articulos = {
        'ART_34_INC_C': '34 inc. c',
        'ART_14': '14',
        'ART_22': '22',
        'ART_29': '29',
        'ART_23': '23',
        'ART_15': '15',
        'ART_16': '16',
        'ART_17': '17',
        'ART_18': '18',
        'ART_19': '19',
        'ART_20': '20',
        'ART_21': '21',
        'ART_24': '24',
        'ART_25': '25',
        'ART_26': '26',
        'ART_27': '27',
        'ART_28': '28',
        'ART_30': '30',
        'ART_31': '31',
        'ART_32': '32',
        'ART_33': '33',
        'ART_34_INC_A': '34 inc. a',
        'ART_34_INC_B': '34 inc. b',
        'ART_35': '35'
    };
    
    return articulos[codigoLicencia] || codigoLicencia;
}

// Función para generar texto de artículos basado en las licencias seleccionadas
function generarTextoArticulos(licenciasData) {
    // Extraer códigos únicos de licencias
    const codigosUnicos = new Set();
    
    licenciasData.forEach(licenciaData => {
        if (licenciaData.licencia && licenciaData.licencia.codigo) {
            codigosUnicos.add(licenciaData.licencia.codigo);
        }
    });
    
    // Convertir a array y mapear a artículos
    const articulos = Array.from(codigosUnicos).map(codigo => obtenerArticuloLicencia(codigo));
    
    if (articulos.length === 0) {
        return 'la normativa vigente de la C.S.J.N.';
    } else if (articulos.length === 1) {
        return `el artículo ${articulos[0]} de la Acordada 34/77 de la C.S.J.N.`;
    } else if (articulos.length === 2) {
        return `los artículos ${articulos[0]} y ${articulos[1]} de la Acordada 34/77 de la C.S.J.N.`;
    } else {
        const ultimoArticulo = articulos.pop();
        return `los artículos ${articulos.join(', ')} y ${ultimoArticulo} de la Acordada 34/77 de la C.S.J.N.`;
    }
}