# 2️⃣ Práctica: Lectura de archivos y consumo de API externa

## 🎯 Objetivo

Reforzar el uso de módulos core (`fs`, `http`) y el consumo de APIs externas usando `fetch` o `axios`, todo integrado dentro de un servidor HTTP sin frameworks.

---

## ✅ Rutas requeridas

### `GET /file`

- Si existe `data.json`, devuelve su contenido (debe ser un JSON válido)
- Si no existe, responde con status `404` y `{ error: 'File not found' }`

### `POST /file`

- Espera un body en JSON
- Guarda el contenido en `data.json`
- Responde con status `201` y `{ success: true }`

### `GET /external`

- Hace una llamada HTTP a `https://jsonplaceholder.typicode.com/todos/1`
- Devuelve el resultado tal cual (status `200`, JSON)

---

## 🔧 Reglas técnicas

- Usa `fs.promises.readFile()` y `writeFile()` para leer/escribir
- Usa `fetch` (nativo en Node 18+) o `axios`
- Usa `Content-Type: application/json` en todas las respuestas
- Mantén separación por handlers (`handleFileRead`, `handleFileWrite`, etc.)
- Reutiliza `createServer()` del reto anterior, o clónalo con ajustes

---

## 🧪 Pruebas esperadas (E2E)

- `GET /file` devuelve JSON o 404
- `POST /file` guarda correctamente el archivo
- `GET /external` devuelve una respuesta válida del API

---

## 🚀 Extra challenge (opcional)

- Valida que el body del `POST` sea un objeto plano
- Responde `400` si el JSON enviado es inválido o vacío
- Agrega un middleware mínimo para parsear `req.body`

---
