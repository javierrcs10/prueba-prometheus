// Puente entre un handler estilo Node (req, res) y la app, que trabaja con
// Request/Response estándar. Lo usan api/index.js (Vercel) y dev/server.js (local).

// Vercel ya trae el body parseado en req.body; en el servidor local hay que leer el stream.
async function readBody(req) {
  if (req.body !== undefined && req.body !== null) {
    if (typeof req.body === "string" || Buffer.isBuffer(req.body)) return req.body;
    return JSON.stringify(req.body);
  }
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return chunks.length ? Buffer.concat(chunks) : undefined;
}

export function createNodeHandler(app, getEnv) {
  return async function handler(req, res) {
    try {
      const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
      url.searchParams.delete("...path"); // parámetro interno que a veces añade Vercel

      const headers = new Headers();
      for (const [name, value] of Object.entries(req.headers)) {
        if (["host", "content-length", "connection"].includes(name)) continue;
        headers.set(name, Array.isArray(value) ? value.join(", ") : value);
      }

      const hasBody = !["GET", "HEAD"].includes(req.method);
      const request = new Request(url, {
        method: req.method,
        headers,
        body: hasBody ? await readBody(req) : undefined,
      });

      const response = await app.fetch(request, getEnv(), {});

      res.statusCode = response.status;
      response.headers.forEach((value, name) => res.setHeader(name, value));
      res.end(Buffer.from(await response.arrayBuffer()));
    } catch (error) {
      // app.fetch ya captura sus propios errores; esto solo cubre fallos del adaptador.
      console.error("Adapter error:", error);
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: "Internal server error" }));
    }
  };
}

// Variables de entorno que lee el backend.
export const readEnv = () => ({
  AIRTABLE_API_URL: process.env.AIRTABLE_API_URL,
  AIRTABLE_BASE_ID: process.env.AIRTABLE_BASE_ID,
  AIRTABLE_API_KEY: process.env.AIRTABLE_API_KEY,
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS,
});
