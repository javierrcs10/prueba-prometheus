import app from "../src/index.js";
import { createNodeHandler, readEnv } from "../src/lib/nodeAdapter.js";

// Única función serverless. vercel.json manda todo /api/* aquí y src/index.js
// decide la ruta, así que la URL que ve el frontend no cambia.
export default createNodeHandler(app, readEnv);
