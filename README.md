# Formulario de Registro con Supabase

Aplicación web de formulario de registro de solicitudes con validación en tiempo real, persistencia en base de datos cloud (Supabase) y listado de registros históricos. Diseñada con un enfoque minimalista y cumpliendo con los estándares de accesibilidad WCAG 2.x.

## 📋 Descripción

Esta aplicación permite a los usuarios crear solicitudes mediante un formulario completo que valida la información en tiempo real y la almacena en una base de datos Supabase. Los usuarios pueden ver el listado de todas las solicitudes registradas, con ordenamiento por fecha descendente.

## ✨ Características Principales

- **Formulario Completo de Solicitudes**:
  - Título (5-60 caracteres)
  - Descripción (20-500 caracteres)
  - Categoría (selección de opciones predefinidas)
  - Prioridad (1-5)
  - Email (validación de formato)

- **Validación en Tiempo Real**: 
  - Validación instantánea de campos según se escribe
  - Mensajes de error claros y específicos
  - Prevención de envío con datos inválidos

- **Estado Visual del Envío**:
  - Botón deshabilitado durante el envío
  - Estado "Enviando..." visible
  - Doble envío prevenido

- **Persistencia de Datos**:
  - Integración con Supabase (base de datos cloud)
  - Confirmación de éxito al insertar
  - Manejo de errores de red/permisos
  - Reinicio manual ante fallos

- **Listado de Solicitudes**:
  - Visualización de todas las solicitudes
  - Ordenadas por fecha (más recientes primero)
  - Diseño tipo tarjeta minimalista
  - Indicador visual de prioridad por colores

- **Accesibilidad WCAG 2.x**:
  - Estructura semántica HTML5
  - Labels asociados a inputs
  - Atributos ARIA para mejorar la experiencia
  - Contraste de colores adecuado
  - Navegación por teclado
  - Mensajes de error accesibles

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React 19.2.5**: Biblioteca principal para la UI
- **Vite 8.0.10**: Herramienta de construcción y desarrollo
- **CSS Modules**: Estilos encapsulados por componente

### Backend & Database
- **Supabase**: 
  - Base de datos PostgreSQL cloud
  - Cliente JavaScript `@supabase/supabase-js`
  - Autenticación y permisos

### Herramientas de Desarrollo
- **ESLint**: Linter para mantener calidad de código
- **React Compiler**: Optimización automática de rendimiento
- **Babel**: Transpilación de código moderno

## 📋 Requisitos Previos

- Node.js (versión 16 o superior)
- npm o yarn
- Cuenta de Supabase (gratuita)

## 🚀 Instalación

1. **Clonar el repositorio** (o descargar el código)

2. **Instalar dependencias**:
```bash
cd formulario_de_registro
npm install
```

3. **Configurar variables de entorno**:

Crear un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
```

Para obtener estas credenciales:
- Ir a [Supabase](https://supabase.com)
- Crear un nuevo proyecto
- Ir a Settings > API
- Copiar la URL del proyecto y la clave anónima (anon/public)

4. **Crear la tabla en Supabase**:

Ejecutar el siguiente SQL en el SQL Editor de Supabase:

```sql
-- Crear la tabla solicitudes
CREATE TABLE solicitudes (
  id SERIAL PRIMARY KEY,
  titulo VARCHAR(60) NOT NULL CHECK (char_length(titulo) >= 5),
  descripcion TEXT NOT NULL CHECK (char_length(descripcion) >= 20 AND char_length(descripcion) <= 500),
  categoria VARCHAR(50) NOT NULL,
  prioridad INTEGER NOT NULL CHECK (prioridad >= 1 AND prioridad <= 5),
  email VARCHAR(255) NOT NULL CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  fecha_creacion TIMESTAMP DEFAULT NOW()
);

-- Habilitar Row Level Security
ALTER TABLE solicitudes ENABLE ROW LEVEL SECURITY;

-- Política para permitir INSERT a todos
CREATE POLICY "Permitir INSERT a todos" ON solicitudes
  FOR INSERT
  WITH CHECK (true);

-- Política para permitir SELECT a todos
CREATE POLICY "Permitir SELECT a todos" ON solicitudes
  FOR SELECT
  USING (true);

-- Crear índice para mejorar las consultas ordenadas por fecha
CREATE INDEX idx_solicitudes_fecha ON solicitudes(fecha_creacion DESC);
```

## 🎯 Uso

### Iniciar el servidor de desarrollo:

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

### Construir para producción:

```bash
npm run build
```

### Previsualizar la build de producción:

```bash
npm run preview
```

## 📝 Funcionalidades del Formulario

### Campos y Validaciones

1. **Título**:
   - Mínimo 5 caracteres
   - Máximo 60 caracteres
   - Requerido

2. **Descripción**:
   - Mínimo 20 caracteres
   - Máximo 500 caracteres
   - Requerido

3. **Categoría**:
   - Opciones: Soporte Técnico, Consulta General, Problema de Acceso, Solicitud de Feature, Otro
   - Requerido

4. **Prioridad**:
   - Rango: 1 (baja) a 5 (crítica)
   - Selector tipo range con indicador visual
   - Requerido

5. **Email**:
   - Formato válido de email
   - Validación con expresión regular
   - Requerido

### Flujo de Uso

1. **Completar el formulario**:
   - Rellenar todos los campos requeridos
   - Las validaciones se muestran en tiempo real
   - Los errores se indican con mensajes claros

2. **Enviar la solicitud**:
   - Click en el botón "Enviar Solicitud"
   - El botón muestra "Enviando..." durante el proceso
   - Se deshabilita para prevenir doble envío

3. **Confirmación**:
   - Mensaje de éxito al registrar correctamente
   - El formulario se limpia automáticamente
   - La lista de solicitudes se actualiza

4. **Ver solicitudes**:
   - Scroll hacia abajo para ver todas las solicitudes
   - Las más recientes aparecen primero
   - Cada solicitud muestra todos sus datos

### Manejo de Errores

- **Error de conexión**: Se muestra mensaje indicando el problema
- **Error de validación**: Mensajes específicos por campo
- **Error de permisos**: Se indica que hay un problema de configuración
- **Reintentar**: Opción de reintentar el envío manualmente

## 🎨 Diseño

### Estilo Minimalista

- **Paleta de colores**:
  - Fondo: `#f8f9fa` (gris claro)
  - Primario: `#2c3e50` (azul oscuro)
  - Acento: `#3498db` (azul)
  - Éxito: `#27ae60` (verde)
  - Error: `#e74c3c` (rojo)

- **Tipografía**:
  - Fuente principal: 'Segoe UI', sistema
  - Tamaños escalados y legibles

- **Espaciado**:
  - Diseño con breathing room
  - Márgenes y paddings consistentes

- **Interactividad**:
  - Transiciones suaves
  - Estados hover claros
  - Feedback visual inmediato

### Indicadores de Prioridad

Las solicitudes muestran un color según su prioridad:
- **1-2**: Verde (baja prioridad)
- **3**: Naranja (media prioridad)
- **4-5**: Rojo (alta/crítica prioridad)

## 📁 Estructura del Proyecto

```
formulario_de_registro/
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── assets/
│   │   └── hero.png
│   ├── components/
│   │   ├── FormularioSolicitud.jsx    # Componente del formulario
│   │   ├── FormularioSolicitud.css     # Estilos del formulario
│   │   ├── ListaSolicitudes.jsx        # Componente de lista
│   │   └── ListaSolicitudes.css        # Estilos de lista
│   ├── App.jsx                         # Componente principal
│   ├── App.css                         # Estilos de App
│   ├── main.jsx                        # Punto de entrada
│   ├── index.css                       # Estilos globales
│   └── supabaseClient.js               # Configuración de Supabase
├── .env                                # Variables de entorno (no incluir en git)
├── .gitignore
├── index.html                          # HTML principal
├── package.json
├── vite.config.js
└── README.md
```

## 🔒 Seguridad y Buenas Prácticas

- Variables de entorno para credenciales sensibles
- Validación en frontend y backend (constraints SQL)
- Row Level Security (RLS) habilitado en Supabase
- Sanitización de inputs
- Prevención de inyección SQL (queries parametrizadas)
- HTTPS en producción (Supabase)

## 🌐 Accesibilidad (WCAG 2.x)

### Nivel AA Cumplido

- ✅ Estructura semántica con HTML5
- ✅ Jerarquía de encabezados correcta
- ✅ Labels asociados a todos los inputs
- ✅ Atributos `aria-invalid` y `aria-describedby`
- ✅ Mensajes de error con `role="alert"`
- ✅ Contraste de colores > 4.5:1
- ✅ Tamaños de fuente escalables
- ✅ Navegación completa por teclado
- ✅ Estados de foco visibles
- ✅ Textos alternativos en elementos visuales
- ✅ Idioma de la página definido (`lang="es"`)

## 🤝 Demo

Una vez configurado y en ejecución:

1. La aplicación se abre mostrando el formulario
2. Completa los campos con datos válidos
3. Click en "Enviar Solicitud"
4. Verifica que aparece en la lista debajo
5. Intenta enviar datos inválidos para ver las validaciones

### Flujo de Prueba Recomendado

**Validación Inválida → Válida → Enviando → Listado → Red/Permisos**

- Probar validaciones con datos incorrectos
- Completar con datos válidos y enviar
- Verificar estado "Enviando..."
- Comprobar que aparece en el listado
- (Opcional) Desconectar internet para ver manejo de errores

## 📄 Licencia

Este proyecto fue creado como ejercicio educativo.

## 👤 Autor

Desarrollado como parte del Ejercicio 2 (E2): Formulario + BBDD Cloud (Supabase)

---

**Nota**: Recuerda mantener tu archivo `.env` fuera del control de versiones y nunca compartir tus credenciales de Supabase públicamente.
