// Lee ALLOWED_ORIGINS (separados por coma). Tolera comillas, espacios y "/" final,
// que son errores típicos y hacían que el origen "no coincidiera".
function parseAllowedOrigins(value) {
  return (value || "")
    .split(",")
    .map((origin) => origin.trim().replace(/^["']|["']$/g, "").replace(/\/+$/, ""))
    .filter(Boolean);
}

// Devuelve los headers CORS según el origen que hace la petición.
// Solo se permite el origen si está en la lista ALLOWED_ORIGINS.
export function getCorsHeaders(request, env) {
  const allowed = parseAllowedOrigins(env.ALLOWED_ORIGINS);
  const origin = request.headers.get("Origin");

  const headers = {
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    // Se devuelven los headers que pide el navegador en el preflight.
    "Access-Control-Allow-Headers":
      request.headers.get("Access-Control-Request-Headers") || "Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };

  if (origin && allowed.includes(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
  }

  return headers;
}

// Copia una respuesta agregándole los headers CORS.
export function withCors(response, corsHeaders) {
  const headers = new Headers(response.headers);
  for (const [key, value] of Object.entries(corsHeaders)) {
    headers.set(key, value);
  }
  return new Response(response.body, { status: response.status, headers });
}
