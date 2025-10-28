// Generador de HTML para las solicitudes de licencias

function generarHTMLSolicitud(data) {
    const fechaActual = new Date().toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    const licencias = data.licencias || [data.licencia];
    
    return `
        <div class="solicitud-preview">
            <div class="solicitud-header">
                <div class="logo-institucional">
                    <h2>SOLICITUD DE LICENCIA${licencias.length > 1 ? 'S' : ''}</h2>
                </div>
                <div class="fecha-solicitud">
                    <strong>Fecha:</strong> ${fechaActual}
                </div>
            </div>
            
            <div class="solicitudes-licencias">
                <h3>LICENCIA${licencias.length > 1 ? 'S' : ''} SOLICITADA${licencias.length > 1 ? 'S' : ''}</h3>
                ${generarHTMLLicencias(data)}
            </div>
            
            ${data.observaciones ? `
                <div class="observaciones">
                    <h3>OBSERVACIONES</h3>
                    <p>${data.observaciones}</p>
                </div>
            ` : ''}
            
            <div class="firmas">
                <div class="firma-empleado">
                    <div class="linea-firma"></div>
                    <p>Firma del Empleado<br>_________________________</p>
                </div>
                <div class="firma-superior">
                    <div class="linea-firma"></div>
                    <p>Autorización Superior<br>Fecha: ___________</p>
                </div>
            </div>
        </div>
    `;
}

function generarHTMLLicencias(data) {
    // Si hay licenciasData, usar esos datos (múltiples licencias con fechas individuales)
    if (data.licenciasData && data.licenciasData.length > 0) {
        let html = '';
        
        data.licenciasData.forEach((licenciaData, index) => {
            const licencia = licenciaData.licencia;
            
            html += `
                <div class="licencia-item">
                    <div class="licencia-header">
                        <h4>${licencia.nombre} (${licencia.codigo})</h4>
                    </div>
            `;
            
            if (licenciaData.tipo === 'compensacion' && licenciaData.compensaciones) {
                // Mostrar compensaciones
                html += `
                    <div class="licencia-info">
                        <h5>Compensaciones:</h5>
                `;
                
                licenciaData.compensaciones.forEach((comp, compIndex) => {
                    html += `
                        <div class="compensacion-preview">
                            <div class="compensacion-titulo">Compensación ${compIndex + 1}</div>
                            <div class="info-item">
                                <label>Licencia que corresponde:</label>
                                <span>${comp.licencia_origen}</span>
                            </div>
                            <div class="info-item fecha-item">
                                <label>Fecha de Inicio:</label>
                                <span class="fecha">${formatearFecha(comp.fecha_inicio)}</span>
                            </div>
                            <div class="info-item fecha-item">
                                <label>Fecha de Fin:</label>
                                <span class="fecha">${formatearFecha(comp.fecha_fin)}</span>
                            </div>
                            <div class="info-item">
                                <label>Cantidad de Días:</label>
                                <span class="cantidad-dias">${comp.cantidad_dias}</span>
                            </div>
                        </div>
                    `;
                });
                
                html += `</div>`;
            } else {
                // Mostrar fechas normales
                html += `
                    <div class="licencia-info">
                        <div class="info-item fecha-item">
                            <label>Fecha de Inicio:</label>
                            <span class="fecha">${formatearFecha(licenciaData.fecha_inicio)}</span>
                        </div>
                        <div class="info-item fecha-item">
                            <label>Fecha de Fin:</label>
                            <span class="fecha">${formatearFecha(licenciaData.fecha_fin)}</span>
                        </div>
                        <div class="info-item">
                            <label>Cantidad de Días:</label>
                            <span class="cantidad-dias">${licenciaData.cantidad_dias}</span>
                        </div>
                    </div>
                `;
            }
            
            html += `</div>`;
        });
        
        return html;
    } else {
        // Licencia única con datos simples (compatibilidad hacia atrás)
        const licencias = data.licencias || [data.licencia];
        let html = '';
        
        licencias.forEach((licencia, index) => {
            html += `
                <div class="licencia-item">
                    <div class="licencia-header">
                        <h4>${licencia.nombre} (${licencia.codigo})</h4>
                    </div>
                    <div class="licencia-info">
                        ${generarCamposEspecificos(data)}
                    </div>
                </div>
            `;
        });
        
        return html;
    }
}

function generarCamposEspecificos(data) {
    let html = '<div class="campos-especificos">';
    
    // Campos de fechas
    if (data.fecha_inicio) {
        html += `
            <div class="info-item fecha-item">
                <label>Fecha de Inicio:</label>
                <span class="fecha">${formatearFecha(data.fecha_inicio)}</span>
            </div>
        `;
    }
    
    if (data.fecha_fin) {
        html += `
            <div class="info-item fecha-item">
                <label>Fecha de Finalización:</label>
                <span class="fecha">${formatearFecha(data.fecha_fin)}</span>
            </div>
        `;
        
        // Calcular días si tenemos ambas fechas
        if (data.fecha_inicio) {
            const dias = calcularDiasEntreFechas(data.fecha_inicio, data.fecha_fin);
            const diasHabiles = calcularDiasHabiles(data.fecha_inicio, data.fecha_fin);
            
            html += `
                <div class="calculo-dias">
                    <div class="dias-info">
                        <span class="dias-totales">Días totales: <strong>${dias}</strong></span>
                        <span class="dias-habiles">Días hábiles: <strong>${diasHabiles}</strong></span>
                    </div>
                </div>
            `;
        }
    }
    
    // Otros campos específicos
    const camposEspeciales = {
        'diagnostico': 'Diagnóstico',
        'motivo': 'Motivo',
        'motivo_urgente': 'Motivo Urgente',
        'parentesco': 'Parentesco',
        'institucion': 'Institución',
        'lugar_accidente': 'Lugar del Accidente',
        'descripcion_actividad': 'Descripción de la Actividad',
        'nuevo_horario': 'Nuevo Horario',
        'cantidad_horas': 'Cantidad de Horas',
        'tratamiento': 'Tratamiento',
        'tipo_proceso': 'Tipo de Proceso',
        'nuevas_tareas': 'Nuevas Tareas'
    };
    
    Object.entries(camposEspeciales).forEach(([campo, etiqueta]) => {
        if (data[campo]) {
            html += `
                <div class="info-item">
                    <label>${etiqueta}:</label>
                    <span>${data[campo]}</span>
                </div>
            `;
        }
    });
    
    // Campos de certificados y documentos
    const certificados = {
        'certificado_medico': 'Certificado Médico',
        'acta_matrimonio': 'Acta de Matrimonio',
        'acta_nacimiento': 'Acta de Nacimiento',
        'acta_defuncion': 'Acta de Defunción',
        'constancia_inscripcion': 'Constancia de Inscripción',
        'resolucion_judicial': 'Resolución Judicial',
        'informe_medico': 'Informe Médico',
        'denuncia_art': 'Denuncia ART',
        'certificado_especialista': 'Certificado del Especialista',
        'resolucion_administrativa': 'Resolución Administrativa',
        'designacion_oficial': 'Designación Oficial'
    };
    
    const certificadosRequeridos = Object.entries(certificados).filter(([campo]) => 
        data.licencia.campos_requeridos.includes(campo)
    );
    
    if (certificadosRequeridos.length > 0) {
        html += `
            <div class="documentos-requeridos">
                <h4>Documentos que se deben adjuntar:</h4>
                <ul class="lista-documentos">
        `;
        
        certificadosRequeridos.forEach(([campo, nombre]) => {
            const adjuntado = data[campo] ? '✓ Adjuntado' : '⚠ Pendiente';
            const claseEstado = data[campo] ? 'adjuntado' : 'pendiente';
            
            html += `
                <li class="documento-item ${claseEstado}">
                    <span class="doc-nombre">${nombre}</span>
                    <span class="doc-estado">${adjuntado}</span>
                </li>
            `;
        });
        
        html += `
                </ul>
            </div>
        `;
    }
    
    html += '</div>';
    return html;
}

function generarHTMLCompleto(data) {
    const fechaActual = new Date().toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Solicitud de Licencia</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 40px 20px;
            line-height: 1.6;
            color: #333;
            background: #fff;
        }
        
        .solicitud-header {
            text-align: center;
            border-bottom: 3px solid #2c3e50;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        
        .solicitud-header h1 {
            color: #2c3e50;
            font-size: 24px;
            margin: 0;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        .fecha-solicitud {
            text-align: right;
            margin-top: 15px;
            font-size: 14px;
            color: #666;
        }
        
        .seccion {
            margin-bottom: 25px;
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #3498db;
        }
        
        .seccion h2 {
            color: #2c3e50;
            font-size: 18px;
            margin-top: 0;
            margin-bottom: 15px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .info-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 15px;
        }
        
        .info-item {
            display: flex;
            flex-direction: column;
        }
        
        .info-item label {
            font-weight: bold;
            color: #555;
            margin-bottom: 5px;
            font-size: 14px;
        }
        
        .info-item span {
            padding: 8px 12px;
            background: white;
            border: 1px solid #ddd;
            border-radius: 4px;
            min-height: 20px;
        }
        
        .licencia-destacada {
            background: #e8f5e8;
            border: 2px solid #27ae60;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 15px;
        }
        
        .licencia-destacada .nombre-licencia {
            font-size: 16px;
            font-weight: bold;
            color: #27ae60;
            margin-bottom: 5px;
        }
        
        .calculo-dias {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            padding: 15px;
            border-radius: 6px;
            margin-top: 15px;
        }
        
        .dias-info {
            display: flex;
            gap: 20px;
            justify-content: center;
            flex-wrap: wrap;
        }
        
        .dias-info span {
            background: white;
            padding: 8px 15px;
            border-radius: 20px;
            border: 1px solid #f39c12;
            font-size: 14px;
        }
        
        .documentos-requeridos {
            background: #e3f2fd;
            border: 1px solid #2196f3;
            padding: 15px;
            border-radius: 6px;
            margin-top: 15px;
        }
        
        .documentos-requeridos h3 {
            color: #1976d2;
            margin-top: 0;
            font-size: 16px;
        }
        
        .lista-documentos {
            list-style: none;
            padding: 0;
        }
        
        .documento-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 12px;
            margin: 5px 0;
            background: white;
            border-radius: 4px;
            border-left: 4px solid #2196f3;
        }
        
        .documento-item.adjuntado {
            border-left-color: #4caf50;
        }
        
        .documento-item.pendiente {
            border-left-color: #ff9800;
        }
        
        .doc-estado {
            font-size: 12px;
            padding: 4px 8px;
            border-radius: 12px;
            color: white;
            font-weight: bold;
        }
        
        .adjuntado .doc-estado {
            background: #4caf50;
        }
        
        .pendiente .doc-estado {
            background: #ff9800;
        }
        
        .observaciones {
            background: #f0f0f0;
            border-left: 4px solid #95a5a6;
            padding: 20px;
            border-radius: 0 8px 8px 0;
        }
        
        .observaciones h2 {
            color: #7f8c8d;
        }
        
        .firmas {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 40px;
            margin-top: 40px;
            padding-top: 30px;
            border-top: 2px solid #ecf0f1;
        }
        
        .firma {
            text-align: center;
        }
        
        .linea-firma {
            border-bottom: 2px solid #333;
            margin-bottom: 10px;
            height: 60px;
        }
        
        .firma p {
            margin: 0;
            font-size: 14px;
            color: #666;
        }
        
        .pie-pagina {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            font-size: 12px;
            color: #888;
        }
        
        @media print {
            body { 
                font-size: 12px; 
                padding: 20px; 
            }
            .seccion { 
                break-inside: avoid; 
            }
        }
    </style>
</head>
<body>
    <div class="solicitud-header">
        <h1>Solicitud de Licencia</h1>
        <div class="fecha-solicitud">
            <strong>Fecha de Solicitud:</strong> ${fechaActual}
        </div>
    </div>

    <div class="seccion">
        <h2>Información de la Licencia</h2>
        <div class="licencia-destacada">
            <div class="nombre-licencia">${data.licencia.nombre}</div>
            <div><strong>Código:</strong> ${data.licencia.codigo}</div>
            <div><strong>Categoría:</strong> ${data.licencia.categoria}</div>
            ${data.licencia.dias_maximos ? `<div><strong>Días Máximos:</strong> ${data.licencia.dias_maximos}</div>` : ''}
        </div>
        
        ${generarCamposEspecificosHTML(data)}
    </div>

    ${data.observaciones ? `
        <div class="observaciones">
            <h2>Observaciones Adicionales</h2>
            <p>${data.observaciones}</p>
        </div>
    ` : ''}

    <div class="firmas">
        <div class="firma">
            <div class="linea-firma"></div>
            <p><strong>Firma del Empleado</strong><br>
            _________________________</p>
        </div>
        <div class="firma">
            <div class="linea-firma"></div>
            <p><strong>Autorización del Superior</strong><br>
            Nombre y Firma<br>
            Fecha: _______________</p>
        </div>
    </div>

    <div class="pie-pagina">
        <p>Solicitud generada automáticamente el ${fechaActual}</p>
        <p>Sistema de Generación de Licencias v1.0</p>
    </div>
</body>
</html>`;
}

function generarCamposEspecificosHTML(data) {
    let html = '<div class="info-grid">';
    
    // Fechas principales
    if (data.fecha_inicio) {
        html += `
            <div class="info-item">
                <label>Fecha de Inicio:</label>
                <span>${formatearFecha(data.fecha_inicio)}</span>
            </div>
        `;
    }
    
    if (data.fecha_fin) {
        html += `
            <div class="info-item">
                <label>Fecha de Finalización:</label>
                <span>${formatearFecha(data.fecha_fin)}</span>
            </div>
        `;
    }
    
    // Otros campos según el tipo de licencia
    const todosLosCampos = {
        'diagnostico': 'Diagnóstico',
        'motivo': 'Motivo de la Solicitud',
        'motivo_urgente': 'Motivo Urgente',
        'parentesco': 'Parentesco',
        'institucion': 'Institución',
        'lugar_accidente': 'Lugar del Accidente',
        'descripcion_actividad': 'Descripción de la Actividad',
        'nuevo_horario': 'Nuevo Horario',
        'cantidad_horas': 'Cantidad de Horas',
        'tratamiento': 'Tratamiento Médico',
        'tipo_proceso': 'Tipo de Proceso',
        'nuevas_tareas': 'Nuevas Tareas Asignadas',
        'fecha_matrimonio': 'Fecha del Matrimonio',
        'fecha_nacimiento': 'Fecha de Nacimiento',
        'fecha_examen': 'Fecha del Examen',
        'fecha_fallecimiento': 'Fecha de Fallecimiento',
        'fecha_accidente': 'Fecha del Accidente'
    };
    
    Object.entries(todosLosCampos).forEach(([campo, etiqueta]) => {
        if (data[campo]) {
            let valor = data[campo];
            
            // Formatear fechas
            if (campo.includes('fecha_') && campo !== 'fecha_inicio' && campo !== 'fecha_fin') {
                valor = formatearFecha(valor);
            }
            
            html += `
                <div class="info-item">
                    <label>${etiqueta}:</label>
                    <span>${valor}</span>
                </div>
            `;
        }
    });
    
    html += '</div>';
    
    // Agregar cálculo de días si corresponde
    if (data.fecha_inicio && data.fecha_fin) {
        const dias = calcularDiasEntreFechas(data.fecha_inicio, data.fecha_fin);
        const diasHabiles = calcularDiasHabiles(data.fecha_inicio, data.fecha_fin);
        
        html += `
            <div class="calculo-dias">
                <h3>Cálculo de Días Solicitados</h3>
                <div class="dias-info">
                    <span><strong>Días Calendario:</strong> ${dias}</span>
                    <span><strong>Días Hábiles:</strong> ${diasHabiles}</span>
                    ${data.licencia.dias_maximos ? `<span><strong>Días Disponibles:</strong> ${data.licencia.dias_maximos - dias}</span>` : ''}
                </div>
            </div>
        `;
    }
    
    // Agregar documentos requeridos
    const certificados = [
        'certificado_medico', 'acta_matrimonio', 'acta_nacimiento', 'acta_defuncion',
        'constancia_inscripcion', 'resolucion_judicial', 'informe_medico', 
        'denuncia_art', 'certificado_especialista', 'resolucion_administrativa',
        'designacion_oficial', 'certificado_familiar', 'autorizacion_superior',
        'acta_correspondiente'
    ];
    
    const certificadosRequeridos = certificados.filter(cert => 
        data.licencia.campos_requeridos.includes(cert)
    );
    
    if (certificadosRequeridos.length > 0) {
        html += `
            <div class="documentos-requeridos">
                <h3>Documentos Requeridos</h3>
                <div class="lista-documentos">
        `;
        
        const nombresDocumentos = {
            'certificado_medico': 'Certificado Médico',
            'acta_matrimonio': 'Acta de Matrimonio',
            'acta_nacimiento': 'Acta de Nacimiento',
            'acta_defuncion': 'Acta de Defunción',
            'constancia_inscripcion': 'Constancia de Inscripción',
            'resolucion_judicial': 'Resolución Judicial',
            'informe_medico': 'Informe Médico Detallado',
            'denuncia_art': 'Denuncia ART',
            'certificado_especialista': 'Certificado del Médico Especialista',
            'resolucion_administrativa': 'Resolución Administrativa',
            'designacion_oficial': 'Designación Oficial',
            'certificado_familiar': 'Certificado Médico del Familiar',
            'autorizacion_superior': 'Autorización del Superior',
            'acta_correspondiente': 'Acta Correspondiente al Evento'
        };
        
        certificadosRequeridos.forEach(cert => {
            const estado = data[cert] ? 'adjuntado' : 'pendiente';
            const estadoTexto = data[cert] ? '✓ Adjuntado' : '⚠ Pendiente de Adjuntar';
            
            html += `
                <div class="documento-item ${estado}">
                    <span class="doc-nombre">${nombresDocumentos[cert] || cert}</span>
                    <span class="doc-estado">${estadoTexto}</span>
                </div>
            `;
        });
        
        html += `
                </div>
            </div>
        `;
    }
    
    return html;
}

// Funciones auxiliares
function formatearFecha(fechaString) {
    const fecha = new Date(fechaString + 'T00:00:00');
    return fecha.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
    });
}

function calcularDiasEntreFechas(fechaInicio, fechaFin) {
    const inicio = new Date(fechaInicio + 'T00:00:00');
    const fin = new Date(fechaFin + 'T00:00:00');
    const diferencia = Math.ceil((fin - inicio) / (1000 * 60 * 60 * 24)) + 1;
    return diferencia;
}

// Funciones para copiar y enviar
function copiarAlPortapapeles() {
    const htmlCompleto = generarHTMLCompleto(solicitudData);
    
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(htmlCompleto).then(() => {
            mostrarToast('HTML copiado al portapapeles correctamente', 'success');
        }).catch(err => {
            console.error('Error al copiar:', err);
            copiarConFallback(htmlCompleto);
        });
    } else {
        copiarConFallback(htmlCompleto);
    }
}

function copiarConFallback(texto) {
    const textArea = document.createElement('textarea');
    textArea.value = texto;
    document.body.appendChild(textArea);
    textArea.select();
    
    try {
        document.execCommand('copy');
        mostrarToast('HTML copiado al portapapeles', 'success');
    } catch (err) {
        console.error('Error en fallback de copia:', err);
        mostrarToast('No se pudo copiar automáticamente. Use Ctrl+C para copiar manualmente.', 'error');
    }
    
    document.body.removeChild(textArea);
}

function copiarCodigoHtml() {
    const codigo = document.getElementById('htmlOutput').textContent;
    
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(codigo).then(() => {
            mostrarToast('Código HTML copiado', 'success');
        }).catch(() => {
            copiarConFallback(codigo);
        });
    } else {
        copiarConFallback(codigo);
    }
}

function abrirEmail() {
    const asunto = encodeURIComponent('Solicitud de Licencia');
    const cuerpo = encodeURIComponent(generarHTMLCompleto(solicitudData));
    
    // Crear enlace mailto
    const mailtoLink = `mailto:?subject=${asunto}&body=${cuerpo}`;
    
    // Intentar abrir cliente de email
    window.location.href = mailtoLink;
    
    mostrarToast('Abriendo cliente de email...', 'info');
}

function generarPDF() {
    // Esta función se implementaría con una librería como jsPDF
    // Por ahora, mostrar mensaje informativo
    mostrarToast('La función de PDF estará disponible en la próxima actualización', 'info');
}

// Funciones para solicitudes múltiples
function agregarNuevaSolicitud() {
    // Guardar la solicitud actual
    multipleSolicitudes.push({
        ...solicitudData,
        id: Date.now(),
        fechaCreacion: new Date()
    });
    
    // Resetear formulario para nueva solicitud
    resetearFormulario();
    
    // Actualizar lista de solicitudes
    actualizarListaSolicitudes();
    
    mostrarToast('Solicitud guardada. Puede agregar otra licencia.', 'success');
    
    // Volver al paso 1
    currentStep = 1;
    actualizarUI();
}

function resetearFormulario() {
    selectedLicenses = [];
    solicitudData = {};
    
    // Limpiar formulario
    document.getElementById('solicitudForm').reset();
    
    // Limpiar selección de licencias
    document.querySelectorAll('.licencia-card').forEach(card => {
        card.classList.remove('selected');
        actualizarBotonSeleccion(card, false);
    });
    
    // Limpiar campos dinámicos
    document.getElementById('camposDinamicos').innerHTML = '';
    document.getElementById('selectedLicenseInfo').innerHTML = '';
    
    // Actualizar contador
    actualizarContadorSelecciones();
    
    // Deshabilitar botón siguiente
    document.getElementById('nextBtn').disabled = true;
}

function actualizarListaSolicitudes() {
    const lista = document.getElementById('requestsList');
    
    lista.innerHTML = multipleSolicitudes.map((solicitud, index) => `
        <div class="request-item">
            <div class="request-header">
                <h4>${solicitud.licencia.nombre}</h4>
                <button onclick="eliminarSolicitud(${index})" class="btn-remove">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            <div class="request-details">
                <span>Licencia: ${solicitud.licencia.codigo}</span>
                <span>Período: ${formatearFecha(solicitud.fecha_inicio)} - ${formatearFecha(solicitud.fecha_fin)}</span>
            </div>
        </div>
    `).join('');
}

function eliminarSolicitud(index) {
    multipleSolicitudes.splice(index, 1);
    actualizarListaSolicitudes();
    mostrarToast('Solicitud eliminada', 'info');
}

function editarSolicitud() {
    currentStep = 2;
    actualizarUI();
}