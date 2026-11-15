# Inventory backend (Vercel)

API en `/api/*` sobre Airtable. Una sola función (`api/index.js`) + `vercel.json` que enruta `/api/*` hacia ella; las rutas viven en `src/index.js`.

```
api/index.js        entrada de Vercel
dev/server.js       servidor local (mismas rutas, sin Vercel)
src/index.js        router + CORS + manejo de errores
src/routes/         un archivo por endpoint
src/lib/            airtable, cors, fórmulas, validación, adaptador
test/               vitest
```

## Local
1. `npm install`
2. Copia `.env.example` a `.env.local` y rellénalo.
3. `npm run dev` -> http://localhost:3000
4. `npm test`

## CORS
`ALLOWED_ORIGINS` debe contener el origen exacto del frontend (el que ves en la barra del navegador: http/https + host + puerto). `localhost` y `127.0.0.1` cuentan como orígenes distintos. Cambiar la variable en Vercel requiere un redeploy.
