<!-- <p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400" alt="Laravel Logo"></a></p> -->

<!-- <p align="center">
<a href="https://github.com/laravel/framework/actions"><img src="https://github.com/laravel/framework/workflows/tests/badge.svg" alt="Build Status"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/dt/laravel/framework" alt="Total Downloads"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/v/laravel/framework" alt="Latest Stable Version"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/l/laravel/framework" alt="License"></a>
</p> -->

# 🚧 Proyecto: Sistema de Control de Acceso de Unidades (DELFIN)

## 🌟 Visión General del Proyecto

El Sistema de Control de Acceso de Unidades (SCAU) tiene como objetivo la **digitalización completa** del proceso de registro de entradas y salidas en la caseta. Reemplazaremos la bitácora física por una herramienta digital que garantice la **disponibilidad de información en tiempo real**, eliminando errores y acelerando la generación de reportes (especialmente para el cálculo de horas extra).

---

## 🎯 Objetivos Clave

* **Eliminación del Papel:** Olvidarse del papeleo físico y la transferencia manual de datos a hojas de cálculo.
* **Información Oportuna:** Asegurar que los datos de acceso estén disponibles inmediatamente para la administración. (*Requerimiento: Información incompleta y tardía*).
* **Reducción de Tiempos:** Bajar drásticamente el tiempo de generación de reportes (actualmente, 1-2 días por reporte).
* **Precisión de Datos:** Mejorar la calidad y completitud de la información de cada movimiento.

---

## 🛠️ Requerimientos Funcionales Esenciales

### 1. Módulo de Registro (Caseta)

| Requerimiento | Descripción |
| :--- | :--- |
| **Flujo de Salida** | El **Supervisor** pre-carga la relación: **Unidad** (solo No. Económico), **Chofer**, **Ayudante** y el **Motivo** (a ser listado). |
| **Flujo de Acceso** | El **Vigilante** selecciona la relación pre-cargada, ingresa el **combustible**, completa el **Checklist Digital** y documenta las condiciones de la unidad. |
| **Relaciones Flexibles** | El sistema debe manejar la lógica donde un chofer puede manejar varias unidades y una unidad puede tener varios choferes asignados. |

### 2. Checklist Digital

* **Formato:** Todos los puntos del checklist serán de tipo **Sí/No (Check)**.
* **Puntos Críticos:** Si un punto crítico no se cumple, el sistema debe lanzar una **alerta** y requerir la **autorización explícita del Supervisor** para permitir el registro de salida. (*Nota: Pendiente de definir el proceso exacto de autorización*).

### 3. Roles de Usuario

| Rol | Alcance de Permisos |
| :--- | :--- |
| **Vigilante (Operador)** | **Solo registro** de entradas y salidas. |
| **Supervisor** | **Creación y Autorización** de relaciones de salida. |
| **Administrador** | Acceso total al panel administrativo, incluyendo la gestión de catálogos. |

### 4. Catálogos y Administración

* **Responsable de Catálogos:** **Roxana Verdín** será la responsable de dar de alta nuevas unidades y personal. (*Nota: El administrador principal es Carlos, pero la gestión operativa es de Roxana*).
* **Bajas de Choferes:** El personal que deje de laborar será marcado como **'Inactivo'** para mantener la integridad del historial. (*Requerimiento: No se deben eliminar del sistema*).

---

## 📊 Reportes Clave (Medida de Éxito)

El reporte más importante (Número Uno) es el de **Entradas y Salidas**.

* **Columnas Indispensables:** Fecha, Hora, Unidad, Chofer y el **Destino**.
* **Exportación:** Capacidad de exportar cualquier reporte al formato **Excel** (requisito fundamental).

---

## 📌 Pendientes y Próximos Pasos

Para el inicio de la fase de desarrollo, el equipo requiere la siguiente información por parte del cliente antes del próximo viernes:

1.  Lista de **Unidades y Choferes** actuales.
2.  **Lista final** de los puntos exactos del **Checklist de inspección**.
3.  **Lista de Motivos** de entrada/salida más comunes (Carga, Descarga, Mantenimiento, etc.).
