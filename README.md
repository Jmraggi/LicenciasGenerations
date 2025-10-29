# 🏛️ Sistema de Generación de Solicitudes de Licencias
### Poder Judicial de la Nación - Generador Automatizado de Licencias Laborales

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/usuario/LicenciasGenerations)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)](https://developer.mozilla.org/es/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)](https://developer.mozilla.org/es/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/es/docs/Web/JavaScript)

## 🚀 Descripción

Sistema web profesional para generar solicitudes de licencias laborales de forma automatizada siguiendo el formato oficial del Poder Judicial de la Nación. Desarrollado con **HTML5**, **CSS3** y **JavaScript ES6+** sin dependencias externas pesadas.

## ✨ Características Principales

### 🎯 **Funcionalidades Core**
- **25+ tipos de licencias** organizadas por prioridad de uso
- **Interfaz intuitiva** con 3 pasos guiados
- **Generación automática** de texto y PDF con formato oficial
- **Diseño responsive** compatible con móviles, tablets y escritorio
- **Múltiples solicitudes** en una sesión
- **Edición en tiempo real** del texto generado
- **Validación inteligente** de fechas y formularios

### 📄 **Generación de Documentos**
- **Texto plano** para copiar en emails
- **PDF profesional** con formato del Poder Judicial
- **Artículos específicos** según cada licencia seleccionada
- **Fechas automáticas** sin errores de zona horaria
- **Formato oficial** con encabezado institucional

### 🎨 **Interfaz de Usuario**
- **Progress indicator** glassmorphism en header
- **Campos compactos** con diseño grid responsive
- **Botones +/- interactivos** para cantidad de días
- **Badges informativos** mostrando licencias seleccionadas
- **Animaciones suaves** y transiciones CSS

## 📋 Licencias Disponibles

### **Licencias Principales** (mostradas inicialmente)
1. **Art. 34 Inc. C** - Razones Particulares (6 días)
2. **Art. 14** - Compensación (Variable)
3. **Art. 22** - Enfermedad - Afecciones Comunes (30 días)
4. **Art. 29** - Atención de Familiar Enfermo (Variable)

### **Licencias Adicionales** (botón "Ver Más")
- Art. 15 - Matrimonio
- Art. 16 - Examen
- Art. 17 - Nacimiento de hijo
- Art. 18 - Fallecimiento de familiar
- Art. 23 - Enfermedad de largo tratamiento
- Y 15+ licencias más...

> **💡 Tip**: El sistema muestra primero las licencias más utilizadas para optimizar la experiencia del usuario.

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
- 🔄 **Escalabilidad**: Preparado para crecimiento
- 🔧 **Mantenibilidad**: Código simple y bien documentado
- 🔮 **Futuro**: Base para integraciones adicionales

### **Paso a Paso Completo**

#### **🎯 Paso 1: Seleccionar Licencias**
1. Al abrir el sistema, verás **4 licencias principales** organizadas por prioridad
2. **Click en "Seleccionar"** para elegir una o más licencias
3. El sistema muestra un **badge** con las licencias seleccionadas
4. Usa **"Ver Más"** para acceder a las 20+ licencias adicionales
5. **"Limpiar"** para reiniciar selecciones si es necesario
6. Click **"Siguiente"** cuando hayas seleccionado todas las licencias

#### **🎯 Paso 2: Completar Datos**
1. **Formularios dinámicos** se generan según las licencias seleccionadas
2. **Campos obligatorios** están marcados con asterisco (*)
3. **Fechas**: El sistema calcula automáticamente los días
4. **Botones +/-**: Para ajustar cantidad de días manualmente
5. **Compensaciones**: Formulario especial con múltiples períodos
6. **Validación en tiempo real**: Errores se muestran inmediatamente
7. **Observaciones**: Campo opcional para información adicional

#### **🎯 Paso 3: Generar y Descargar**
1. **Revisión automática** del texto generado
2. **Edición libre**: Modificar el texto antes de finalizar
3. **Copiar texto**: Para pegar en Zimbra y enviar por email
4. **Descargar PDF**: Documento oficial con formato del Poder Judicial
5. **Nueva solicitud**: Opción para generar otra solicitud

## �🛡️ Seguridad y Privacidad

### **Medidas Implementadas**
- ✅ **Sin almacenamiento local**: No guarda datos sensibles
- ✅ **Validación cliente**: JavaScript previene inputs maliciosos  
- ✅ **Sin cookies**: Respeta la privacidad del usuario
- ✅ **HTTPS compatible**: Funciona con conexiones seguras
- ✅ **CSP ready**: Compatible con Content Security Policy

## 🔮 Roadmap Futuro

### **Versión 1.1** (Próximamente)
- [ ] **Backend integration**: API REST opcional
- [ ] **User authentication**: Login con roles
- [ ] **Workflow management**: Aprobación de solicitudes
- [ ] **Email templates**: Envío automático
- [ ] **Mobile app**: PWA con offline support

### **Versión 1.2** (Mediano Plazo)
- [ ] **Analytics dashboard**: Métricas de uso
- [ ] **Multi-tenancy**: Soporte multi-organización
- [ ] **Advanced PDF**: Templates personalizables
- [ ] **Integration APIs**: RRHH systems
- [ ] **Audit trails**: Historial completo

## 📄 Licencia

```
MIT License

Copyright (c) 2025 Sistema de Licencias

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
```

**Desarrollado con ❤️ para optimizar procesos administrativos**

*Última actualización: 28 de Octubre, 2025*