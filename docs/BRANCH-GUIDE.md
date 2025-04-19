
# 📚 Guía de Ramas – Rediseño del Sistema SIGA

Esta guía está diseñada para mantener una estructura clara, ordenada y colaborativa del flujo de trabajo con Git en el proyecto grupal del rediseño del sistema SIGA.

---

## 🗂️ Estructura de ramas

| Rama        | Propósito                                           |
|-------------|-----------------------------------------------------|
| `main`      | Rama principal, contiene la versión final y estable |
| `develop`   | Rama base de desarrollo, integra todas las ramas    |
| `feature/*` | Nuevas funcionalidades                              |
| `fix/*`     | Corrección de errores o bugs                        |
| `style/*`   | Cambios de estilos (CSS)                            |
| `docs/*`    | Documentación, wireframes, actas, etc.              |

---

## 🧭 Flujo de trabajo recomendado

### 1. Clonar el repositorio
```bash
git clone https://github.com/Deiguuu/Redesing-del-sistema-SIGA.git
cd Redesing-del-sistema-SIGA
```

### 2. Crear tu rama desde develop
```bash
git checkout develop
git pull origin develop
git checkout -b feature/nombre-funcion-tu-nombre
```

### 3. Hacer tus cambios y guardarlos
```bash
git add .
git commit -m "Agrega formulario de asistencia"
```

### 4. Subir tu rama
```bash
git push origin feature/asistencia-jose
```

### 5. Crear un Pull Request (PR)
1. Ir a GitHub  
2. Seleccionar tu rama y hacer PR hacia `develop`  
3. Agregar título y descripción  
4. Solicitar revisión de un compañero  

---

## 👥 Buenas prácticas en equipo

- 🧠 Cada funcionalidad o tarea debe desarrollarse en una rama propia  
- 🛡️ Nunca trabajar directamente en `main` ni en `develop`  
- 📌 Hacer pull de `develop` antes de comenzar a trabajar  
- 🧼 Commits claros, descriptivos y frecuentes  
- ✅ Revisión mutua de PRs antes de hacer merge  

---

## 🛠️ Para inicializar manualmente el repositorio (si no lo clonaste)

```bash
cd /ruta/al/proyecto
git init
git remote add origin https://github.com/Deiguuu/Redesing-del-sistema-SIGA.git
git pull origin main
git checkout -b develop
git push -u origin develop
```

---

## 🧪 Extra: ver todas las ramas

```bash
git branch         # ramas locales
git branch -r      # ramas remotas
git branch -a      # todas las ramas
```
