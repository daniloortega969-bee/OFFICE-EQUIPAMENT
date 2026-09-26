# 🖥️ OFFICE-EQUIPAMENT

### Sistema web de gestión y control de equipos ofimáticos

Aplicación web desarrollada para facilitar la **administración, seguimiento y control de equipos ofimáticos**, permitiendo gestionar información de equipos, responsables, ubicaciones, movimientos y mantenimientos desde una interfaz centralizada.

El proyecto fue desarrollado como una aplicación práctica de **análisis y desarrollo de software**, integrando backend, frontend, base de datos y una API REST.

---

## 🚀 Funcionalidades

### 📦 Gestión de equipos

* Registro y administración de equipos ofimáticos.
* Gestión de información de los equipos.
* Control de números de serie.
* Asociación de equipos con responsables y ubicaciones.

### 🔄 Gestión de movimientos

* Registro de movimientos de equipos.
* Seguimiento de cambios relacionados con los equipos.
* Registro de información asociada a los movimientos.

### 🛠️ Gestión de mantenimientos

* Registro de mantenimientos realizados.
* Seguimiento del mantenimiento de los equipos.
* Registro de horas de uso y mantenimiento.
* Control de cantidad de mantenimientos realizados.

### ⚙️ Administración

* Gestión de categorías.
* Gestión de marcas.
* Gestión de ubicaciones.
* Gestión de responsables.
* Administración de información relacionada con el inventario.

### 🌐 API REST

El sistema cuenta con una API desarrollada con **Django REST Framework** para gestionar la información del inventario.

Incluye serializers para:

* Equipos
* Movimientos
* Mantenimientos

---

## 🛠️ Tecnologías utilizadas

### Backend

* 🐍 Python
* 🌐 Django 6.1.1
* 🔌 Django REST Framework 3.18.1
* 🔐 django-cors-headers 4.9.0

### Frontend

* HTML5
* CSS3
* JavaScript

### Base de datos

* SQLite

### Herramientas

* Git
* GitHub
* Visual Studio Code

---

## 📁 Estructura del proyecto

```text
OFFICE-EQUIPAMENT/
│
├── config/
│   ├── settings.py
│   ├── urls.py
│   └── ...
│
├── inventario/
│   ├── migrations/
│   │
│   ├── static/
│   │   └── inventario/
│   │       ├── css/
│   │       │   └── estilos.css
│   │       │
│   │       └── js/
│   │           ├── administracion.js
│   │           ├── app.js
│   │           ├── equipos.js
│   │           ├── mantenimientos.js
│   │           └── movimientos.js
│   │
│   ├── templates/
│   │   └── inventario/
│   │
│   ├── models.py
│   ├── serializers.py
│   ├── urls.py
│   └── views.py
│
├── .gitignore
├── launcher.py
├── manage.py
├── InventarioOfimatica.spec
├── requirements.txt
└── README.md
```

---

## ⚙️ Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/daniloortega969-bee/OFFICE-EQUIPAMENT.git
```

### 2. Entrar al proyecto

```bash
cd OFFICE-EQUIPAMENT
```

### 3. Crear el entorno virtual

En Windows:

```powershell
python -m venv .venv
```

### 4. Activar el entorno virtual

```powershell
.venv\Scripts\activate
```

### 5. Instalar las dependencias

```powershell
pip install -r requirements.txt
```

### 6. Ejecutar las migraciones

```powershell
python manage.py migrate
```

### 7. Iniciar el servidor

```powershell
python manage.py runserver
```

La aplicación estará disponible en:

```text
http://127.0.0.1:8000/
```

---

## 🧪 Comprobar la configuración

Para comprobar que el proyecto está correctamente configurado:

```powershell
python manage.py check
```

El proyecto debe mostrar:

```text
System check identified no issues (0 silenced).
```

---

## 🗃️ Base de datos

Durante el desarrollo se utiliza **SQLite**.

Las migraciones de Django se encuentran en:

```text
inventario/migrations/
```

Para aplicar las migraciones:

```powershell
python manage.py migrate
```

---

## 🎯 Objetivo del proyecto

El objetivo de **OFFICE-EQUIPAMENT** es proporcionar una solución web para organizar y controlar la información relacionada con equipos ofimáticos, facilitando el seguimiento de:

* Equipos.
* Responsables.
* Ubicaciones.
* Categorías.
* Marcas.
* Movimientos.
* Mantenimientos.

El proyecto integra diferentes áreas del desarrollo de software, incluyendo **desarrollo backend, frontend, bases de datos, APIs REST y control de versiones**.

---

## 📚 Aprendizajes aplicados

Durante el desarrollo se aplicaron conocimientos relacionados con:

* Desarrollo web con Python y Django.
* Diseño y gestión de modelos.
* Creación de APIs REST.
* Serialización de datos.
* Desarrollo con JavaScript.
* Integración frontend/backend.
* Gestión de bases de datos.
* Migraciones de Django.
* Control de versiones con Git.
* Organización de proyectos de software.

---

## 👨‍💻 Autor

**Danilo José Ricardo Ortega**

Analista y Desarrollador de Software
Full Stack Developer

🇨🇴 Colombia

### GitHub

[github.com/daniloortega969-bee](https://github.com/daniloortega969-bee)

---

## 📌 Estado del proyecto

🟢 **En desarrollo y mantenimiento**

El proyecto puede continuar evolucionando mediante la incorporación de nuevas funcionalidades, mejoras de interfaz y optimizaciones del sistema.
