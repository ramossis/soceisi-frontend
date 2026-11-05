# TODO pendientes

Estos puntos no se pueden completar solo desde el frontend o requieren una
decisión de producto/migración. Están marcados con `TODO(backend)` en el código.

## Hecho en esta iteración

- [x] `POST /api/asistencia` usa `id_evento`, espera el evento y usa
      `miembro.nombres`.
- [x] `POST /api/asistencia` devuelve 409 para asistencias duplicadas.
- [x] `DELETE /api/evento/:id` convierte el id a número y borra las asistencias
      asociadas en una transacción.
- [x] `DELETE /api/estudiante/:id` borra también sus asistencias.
- [x] Login devuelve 401 con mensaje genérico y valida `estado_cuenta`.
- [x] `verifyToken` devuelve 401 para token expirado/inválido.
- [x] Corregido el MIME `application/pdf` y el timestamp de nombres de archivo.

## Pendiente

- [ ] Agregar `@@unique([id_estudiante, id_evento])` en `Asistencia` y una
      migración. Hoy la protección contra duplicados es solo por consulta previa
      y puede fallar con requests simultáneos.
- [ ] Agregar `GET /api/evento/public/:id` sin auth, devolviendo solo
      `{ id, nombre, tipo, fecha }`. Hoy el QR pasa `nombre` y `tipo` por query
      params.
- [ ] Agregar `GET /api/asistencia?eventoId=...` con auth para listar asistentes
      en el panel administrativo y permitir exportar CSV.
- [ ] `GET /api/estudiante/buscarEstudiante:ci` sigue mal declarado (falta `/`).
      Corregir a `/buscarEstudiante/:ci`, usar `res.status` y limitar los campos
      públicos para no exponer documentos/membresías.
- [ ] Restringir CORS y agregar rate limit en login, asistencia y preinscripción.
- [ ] Quitar `relationMode = "prisma"` y usar FKs reales con `onDelete: Cascade`
      (o auditar todos los borrados manuales).
- [ ] Agregar validación Zod para estudiante, pago y login.
- [ ] Agregar pruebas de integración para login, asistencia y CRUD de eventos.
- [ ] Si el frontend se despliega en Vercel (y no en Netlify), agregar un
      `vercel.json` con rewrite a `index.html`; `public/_redirects` solo aplica
      a Netlify y los enlaces directos `/asistencia/:id` darían 404.
