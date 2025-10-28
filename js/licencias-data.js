// Base de datos de licencias organizadas por prioridad de uso
const LICENCIAS_DATA = {
    // Licencias de Alta Prioridad (más solicitadas)
    alta_prioridad: [
        {
            id: 1,
            codigo: "ART_22",
            nombre: "Art. 22. Enfermedad - Afecciones Comunes",
            descripcion: "Licencia por enfermedad o afecciones comunes que requieren reposo médico",
            dias_maximos: 30,
            requiere_certificado: true,
            categoria: "Salud",
            prioridad: 1,
            uso_frecuente: 5,
            campos_requeridos: ["fecha_inicio", "fecha_fin", "certificado_medico", "diagnostico"]
        },
        {
            id: 2,
            codigo: "ART_33",
            nombre: "Art. 33. Motivos Particulares",
            descripcion: "Licencia por razones personales o familiares particulares",
            dias_maximos: 200,
            requiere_certificado: false,
            categoria: "Personal",
            prioridad: 2,
            uso_frecuente: 5,
            campos_requeridos: ["fecha_inicio", "fecha_fin", "motivo"]
        },
        {
            id: 3,
            codigo: "ART_34_INC_C",
            nombre: "Art. 34 Inc. C. Razones Particulares",
            descripcion: "Justificación de inasistencias por razones particulares urgentes",
            dias_maximos: 6,
            requiere_certificado: false,
            categoria: "Justificación",
            prioridad: 3,
            uso_frecuente: 4,
            campos_requeridos: ["fecha_inicio", "fecha_fin", "motivo_urgente"]
        },
        {
            id: 4,
            codigo: "ART_20",
            nombre: "Art. 20. Maternidad",
            descripcion: "Licencia por maternidad para madres trabajadoras",
            dias_maximos: 90,
            requiere_certificado: true,
            categoria: "Familia",
            prioridad: 4,
            uso_frecuente: 4,
            campos_requeridos: ["fecha_inicio", "fecha_probable_parto", "certificado_medico"]
        },
        {
            id: 5,
            codigo: "ART_29",
            nombre: "Art. 29. Atención de Familiar Enfermo",
            descripcion: "Licencia para atender familiar enfermo que requiere cuidados",
            dias_maximos: 20,
            requiere_certificado: true,
            categoria: "Familia",
            prioridad: 5,
            uso_frecuente: 4,
            campos_requeridos: ["fecha_inicio", "fecha_fin", "parentesco", "certificado_familiar"]
        }
    ],

    // Licencias de Prioridad Media
    media_prioridad: [
        {
            id: 6,
            codigo: "ART_30",
            nombre: "Art. 30. Matrimonio",
            descripcion: "Licencia por matrimonio del empleado",
            dias_maximos: 15,
            requiere_certificado: true,
            categoria: "Personal",
            prioridad: 6,
            uso_frecuente: 3,
            campos_requeridos: ["fecha_matrimonio", "acta_matrimonio"]
        },
        {
            id: 7,
            codigo: "ART_32",
            nombre: "Art. 32. Exámenes",
            descripcion: "Licencia para rendir exámenes académicos o profesionales",
            dias_maximos: 20,
            requiere_certificado: true,
            categoria: "Educación",
            prioridad: 7,
            uso_frecuente: 3,
            campos_requeridos: ["fecha_examen", "institucion", "constancia_inscripcion"]
        },
        {
            id: 8,
            codigo: "ART_20_BIS",
            nombre: "Art. 20 BIS. Paternidad",
            descripcion: "Licencia por paternidad para padres trabajadores",
            dias_maximos: 15,
            requiere_certificado: true,
            categoria: "Familia",
            prioridad: 8,
            uso_frecuente: 3,
            campos_requeridos: ["fecha_nacimiento", "acta_nacimiento"]
        },
        {
            id: 9,
            codigo: "ART_34_INC_A",
            nombre: "Art. 34 Inc. A. Casamiento o Nacimiento de Hijo",
            descripcion: "Justificación por casamiento propio o nacimiento de hijo",
            dias_maximos: 2,
            requiere_certificado: true,
            categoria: "Justificación",
            prioridad: 9,
            uso_frecuente: 3,
            campos_requeridos: ["fecha_evento", "acta_correspondiente"]
        },
        {
            id: 10,
            codigo: "ART_34_INC_B1",
            nombre: "Art. 34 Inc. B1. Fallecimiento Cónyuge, Hijos o Padres",
            descripcion: "Justificación por fallecimiento de familiares directos",
            dias_maximos: 5,
            requiere_certificado: true,
            categoria: "Justificación",
            prioridad: 10,
            uso_frecuente: 3,
            campos_requeridos: ["fecha_fallecimiento", "parentesco", "acta_defuncion"]
        }
    ],

    // Licencias de Prioridad Baja (uso específico)
    baja_prioridad: [
        {
            id: 11,
            codigo: "ART_24",
            nombre: "Art. 24. Accidentes de Trabajo",
            descripcion: "Licencia por accidentes ocurridos en el lugar de trabajo",
            dias_maximos: 1000,
            requiere_certificado: true,
            categoria: "Salud",
            prioridad: 11,
            uso_frecuente: 2,
            campos_requeridos: ["fecha_accidente", "lugar_accidente", "informe_medico", "denuncia_art"]
        },
        {
            id: 12,
            codigo: "ART_20_TER",
            nombre: "Art. 20 TER. Guarda con Fines de Adopción",
            descripcion: "Licencia por guarda de menor con fines de adopción",
            dias_maximos: 90,
            requiere_certificado: true,
            categoria: "Familia",
            prioridad: 12,
            uso_frecuente: 2,
            campos_requeridos: ["fecha_otorgamiento_guarda", "resolucion_judicial"]
        },
        {
            id: 13,
            codigo: "ART_31",
            nombre: "Art. 31. Actividades Científicas, Culturales o Deportivas",
            descripcion: "Licencia para participar en actividades de interés institucional",
            dias_maximos: 365,
            requiere_certificado: true,
            categoria: "Desarrollo",
            prioridad: 13,
            uso_frecuente: 2,
            campos_requeridos: ["fecha_inicio", "fecha_fin", "descripcion_actividad", "autorizacion_superior"]
        },
        {
            id: 14,
            codigo: "ART_21",
            nombre: "Art. 21. Reducción Horaria y Cambio de Tareas por Maternidad",
            descripcion: "Reducción de horario por maternidad hasta el año de vida del hijo",
            dias_maximos: 365,
            requiere_certificado: true,
            categoria: "Familia",
            prioridad: 14,
            uso_frecuente: 2,
            campos_requeridos: ["fecha_nacimiento", "nuevo_horario", "certificado_medico"]
        },
        {
            id: 15,
            codigo: "ART_11",
            nombre: "Art. 11. Excepción",
            descripcion: "Licencia excepcional por situaciones no contempladas en otros artículos",
            dias_maximos: 365,
            requiere_certificado: true,
            categoria: "Excepcional",
            prioridad: 15,
            uso_frecuente: 1,
            campos_requeridos: ["fecha_inicio", "fecha_fin", "justificacion_detallada", "autorizacion_superior"]
        }
    ],

    // Casos Especiales (sin límite fijo de días)
    casos_especiales: [
        {
            id: 16,
            codigo: "ART_14",
            nombre: "Art. 14. Compensación",
            descripcion: "Compensación de horas extras trabajadas",
            dias_maximos: null,
            requiere_certificado: false,
            categoria: "Compensación",
            prioridad: 16,
            uso_frecuente: 2,
            campos_requeridos: ["periodo_horas_extras", "cantidad_horas", "fecha_compensacion"],
            nota: "Variable según horas acumuladas"
        },
        {
            id: 17,
            codigo: "ART_23",
            nombre: "Art. 23. Enfermedad - Afecciones de Largo Tratamiento",
            descripcion: "Licencia por enfermedades que requieren tratamiento prolongado",
            dias_maximos: null,
            requiere_certificado: true,
            categoria: "Salud",
            prioridad: 17,
            uso_frecuente: 1,
            campos_requeridos: ["fecha_inicio", "diagnostico", "tratamiento", "certificado_especialista"],
            nota: "Variable según certificado médico"
        },
        {
            id: 18,
            codigo: "ART_27",
            nombre: "Art. 27. Cesantía - Jubilación",
            descripcion: "Licencia previa a cesantía o proceso de jubilación",
            dias_maximos: null,
            requiere_certificado: true,
            categoria: "Administrativo",
            prioridad: 18,
            uso_frecuente: 1,
            campos_requeridos: ["fecha_inicio", "tipo_proceso", "resolucion_administrativa"],
            nota: "Variable según proceso administrativo"
        },
        {
            id: 19,
            codigo: "ART_28",
            nombre: "Art. 28. Cambio de Tareas o Reducción Horaria",
            descripcion: "Modificación de tareas por razones médicas o personales",
            dias_maximos: null,
            requiere_certificado: true,
            categoria: "Salud",
            prioridad: 19,
            uso_frecuente: 1,
            campos_requeridos: ["fecha_inicio", "nuevas_tareas", "certificado_medico", "autorizacion_superior"],
            nota: "Variable según necesidad médica"
        },
        {
            id: 20,
            codigo: "ART_34_INC_B2",
            nombre: "Art. 34 Inc. B2. Fallecimiento Otros Familiares",
            descripcion: "Justificación por fallecimiento de otros familiares",
            dias_maximos: 2,
            requiere_certificado: true,
            categoria: "Justificación",
            prioridad: 20,
            uso_frecuente: 1,
            campos_requeridos: ["fecha_fallecimiento", "parentesco", "acta_defuncion"]
        },
        {
            id: 21,
            codigo: "ART_34_INC_D",
            nombre: "Art. 34 Inc. D. Mesas Examinadoras",
            descripcion: "Justificación para participar como evaluador en mesas examinadoras",
            dias_maximos: 6,
            requiere_certificado: true,
            categoria: "Educación",
            prioridad: 21,
            uso_frecuente: 1,
            campos_requeridos: ["fecha_mesa", "institucion", "designacion_oficial"]
        },
        {
            id: 22,
            codigo: "ART_34_PARIENTES_2DO",
            nombre: "Art. 34. Fallecimiento Parientes hasta 2do Grado",
            descripcion: "Justificación por fallecimiento de parientes hasta segundo grado",
            dias_maximos: 2,
            requiere_certificado: true,
            categoria: "Justificación",
            prioridad: 22,
            uso_frecuente: 1,
            campos_requeridos: ["fecha_fallecimiento", "parentesco", "acta_defuncion"]
        }
    ]
};

// Función para obtener todas las licencias en orden de prioridad
function obtenerTodasLasLicencias() {
    const todas = [
        ...LICENCIAS_DATA.alta_prioridad,
        ...LICENCIAS_DATA.media_prioridad,
        ...LICENCIAS_DATA.baja_prioridad,
        ...LICENCIAS_DATA.casos_especiales
    ];
    
    return todas.sort((a, b) => a.prioridad - b.prioridad);
}

// Función para buscar licencia por ID
function obtenerLicenciaPorId(id) {
    const todas = obtenerTodasLasLicencias();
    return todas.find(licencia => licencia.id === id);
}

// Función para obtener licencias por categoría
function obtenerLicenciasPorCategoria(categoria) {
    const todas = obtenerTodasLasLicencias();
    return todas.filter(licencia => licencia.categoria === categoria);
}

// Función para obtener las licencias más usadas (top 10)
function obtenerLicenciasMasUsadas() {
    const todas = obtenerTodasLasLicencias();
    return todas.filter(licencia => licencia.uso_frecuente >= 3).slice(0, 10);
}

// Categorías disponibles
const CATEGORIAS = {
    "Salud": "Licencias relacionadas con salud y enfermedad",
    "Familia": "Licencias por eventos familiares",
    "Personal": "Licencias por motivos personales",
    "Justificación": "Justificaciones de inasistencias",
    "Educación": "Licencias para actividades educativas",
    "Desarrollo": "Actividades de desarrollo profesional",
    "Compensación": "Compensaciones y ajustes horarios",
    "Administrativo": "Procesos administrativos",
    "Excepcional": "Casos excepcionales no contemplados"
};

// Exportar para uso en otros archivos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        LICENCIAS_DATA,
        obtenerTodasLasLicencias,
        obtenerLicenciaPorId,
        obtenerLicenciasPorCategoria,
        obtenerLicenciasMasUsadas,
        CATEGORIAS
    };
}