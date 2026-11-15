import { createServer } from "node:http";
import app from "../src/index.js";
import { createNodeHandler, readEnv } from "../src/lib/nodeAdapter.js";

// Servidor local: mismas rutas que en Vercel, leyendo .env.local (ver `npm run dev`).
const port = Number(process.env.PORT) || 3000;

createServer(createNodeHandler(app, readEnv)).listen(port, () => {
  console.log(`Backend local en http://localhost:${port}`);
  console.log(`Orígenes permitidos (CORS): ${process.env.ALLOWED_ORIGINS || "(ninguno)"}`);
});
