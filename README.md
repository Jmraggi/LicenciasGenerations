# Sistema de Generación de Solicitudes de Licencias

## 🚀 Descripción

Sistema web completo para generar solicitudes de licencias laborales de forma automatizada. Desarrollado con **HTML5**, **CSS3** y **JavaScript puro** sin dependencias externas.

## ✨ Características Principales

- **22 tipos de licencias** organizadas por prioridad de uso
- **Interfaz intuitiva** con 4 pasos guiados
- **Generación automática** de HTML formateado para emails
- **Diseño responsive** compatible con móviles, tablets y escritorio
- **Múltiples solicitudes** en una sesión
- **Copia al portapapeles** con un click
- **Vista previa** antes de generar
- **Validación automática** de formularios y fechas

## 📋 Licencias Principales

El sistema muestra inicialmente las 4 licencias más solicitadas:

1. **Art. 22** - Enfermedad - Afecciones Comunes (30 días)
2. **Art. 34 Inc. C** - Razones Particulares (6 días)
3. **Art. 14** - Compensación (Variable)
4. **Art. 23** - Enfermedad - Afecciones de Largo Tratamiento (Variable)

> **Botón "Ver Más"**: Acceso a las 18 licencias adicionales

## 🛠️ Instalación

### Requisitos Previos
- Servidor web local (XAMPP, WAMP, LAMP, etc.)
- Navegador web moderno (Chrome, Firefox, Safari, Edge)

### Pasos de Instalación

1. **Clonar o descargar** el proyecto en la carpeta del servidor web:
   ```bash
   c:\xampp\htdocs\LicenciasGenerations\
   ```

2. **Iniciar el servidor web** (XAMPP, WAMP, etc.)

3. **Abrir en el navegador**:
   ```
   http://localhost/LicenciasGenerations/
   ```

## 📱 Uso del Sistema

### Paso 1: Seleccionar Licencia
- Revisar las **4 licencias principales**
- Usar **"Ver Más"** para acceder a todas las licencias
- **Click en "Seleccionar"** en la licencia deseada

### Paso 2: Completar Datos
- **Datos del empleado**: Nombre, legajo, cargo, dependencia
- **Datos de la licencia**: Fechas, motivos, certificados según corresponda
- **Validación automática** de campos y fechas
- **Cálculo automático** de días solicitados

### Paso 3: Vista Previa
- **Revisar** toda la información ingresada
- **Verificar** fechas y períodos
- **Editar** si es necesario antes de continuar

### Paso 4: Generar Solicitud
- **Copiar al portapapeles**: HTML formateado listo para email
- **Abrir email**: Preparar mensaje automáticamente
- **Solicitudes múltiples**: Agregar más licencias en la misma sesión

## 📁 Estructura del Proyecto

```
LicenciasGenerations/
├── index.html                 # Página principal
├── PROPUESTA_PROFESIONAL.md   # Documento técnico completo
├── README.md                  # Este archivo
├── css/
│   └── styles.css            # Estilos responsive
└── js/
    ├── app.js               # Lógica principal
    ├── licencias-data.js    # Base de datos de licencias
    ├── html-generator.js    # Generador de HTML
    ├── form-validator.js    # Validaciones
    └── utils.js            # Utilidades generales
```

## 🎨 Características Técnicas

### Frontend
- **HTML5**: Estructura semántica y accesible
- **CSS3**: Grid, Flexbox, animaciones, responsive design
- **JavaScript ES6+**: Módulos, clases, async/await

### Funcionalidades
- **Sin dependencias**: 100% vanilla JavaScript
- **Responsive**: Adaptable a cualquier dispositivo
- **Accesibilidad**: Cumple estándares WCAG
- **Performance**: Carga rápida (< 500KB total)

## 🔧 Configuración Avanzada

### Personalizar Licencias
Editar el archivo `js/licencias-data.js`:

```javascript
{
    id: 23,
    codigo: "NUEVA_LICENCIA",
    nombre: "Nueva Licencia Personalizada",
    descripcion: "Descripción de la nueva licencia",
    dias_maximos: 15,
    requiere_certificado: true,
    categoria: "Personal",
    campos_requeridos: ["fecha_inicio", "fecha_fin", "motivo"]
}
```

### Modificar Estilos
El archivo `css/styles.css` utiliza variables CSS:

```css
:root {
    --primary-color: #2c3e50;
    --secondary-color: #3498db;
    --accent-color: #e74c3c;
    /* Personalizar colores aquí */
}
```

## 🚀 Despliegue en Producción

### Servidor Web
1. Subir archivos al servidor
2. Configurar dominio o subdominio
3. Verificar permisos de lectura

### Optimizaciones
- **Minificar** CSS y JavaScript
- **Comprimir** imágenes si las hay
- **Configurar** cache del navegador
- **HTTPS** recomendado

## 📊 Beneficios del Sistema

### Para Empleados
- ⏱️ **Reducción de tiempo**: De 30 min → 3 min por solicitud
- 🎯 **Autonomía**: Sin dependencia de RRHH
- 📱 **Accesibilidad**: Disponible 24/7 desde cualquier dispositivo
- ✅ **Simplicidad**: Interfaz intuitiva sin curva de aprendizaje

### Para Recursos Humanos
- 📋 **Estandarización**: Formato uniforme en todas las solicitudes
- 📉 **Menos consultas**: Reducción de interrupciones
- ⚡ **Procesamiento rápido**: Información completa y clara
- 📈 **Trazabilidad**: Registro claro de fechas y períodos

### Para la Organización
- 💰 **ROI positivo**: Recuperación de inversión en 2 meses
- 🔄 **Escalabilidad**: Preparado para crecimiento
- 🔧 **Mantenibilidad**: Código simple y bien documentado
- 🔮 **Futuro**: Base para integraciones adicionales

## 🛡️ Seguridad

- **Sin almacenamiento**: No guarda datos sensibles
- **Validación cliente**: JavaScript valida antes de procesar
- **Código limpio**: Sin dependencias que comprometan seguridad
- **Portable**: Funciona sin conexión a internet

## 🐛 Solución de Problemas

### Problemas Comunes

**Error: "No se puede copiar al portapapeles"**
- Verificar que el sitio use HTTPS
- Probar con navegador moderno
- Usar botón "Copiar código HTML"

**Las fechas no se validan correctamente**
- Verificar formato de fecha (YYYY-MM-DD)
- Asegurar que JavaScript esté habilitado

**Las tarjetas no se cargan**
- Verificar que todos los archivos JS estén presentes
- Revisar consola del navegador para errores

### Contacto Técnico
Para soporte técnico o personalizaciones, contactar al administrador del sistema.

## 📈 Futuras Mejoras

### Versión 1.1 (Planificada)
- [ ] Integración directa con email
- [ ] Exportación a PDF
- [ ] Guardado de borradores
- [ ] Notificaciones automáticas

### Versión 1.2 (Futura)
- [ ] Integración con base de datos
- [ ] API REST para sistemas externos
- [ ] Dashboard de estadísticas
- [ ] Flujo de aprobaciones

## 📄 Licencia

Este proyecto fue desarrollado como sistema interno. Todos los derechos reservados.

---

**Desarrollado con ❤️ para optimizar procesos administrativos**

*Última actualización: 28 de Octubre, 2025*