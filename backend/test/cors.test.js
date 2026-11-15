import { describe, expect, it } from "vitest";
import { getCorsHeaders } from "../src/lib/cors.js";

const headersFor = (origin, allowed, extra = {}) =>
  getCorsHeaders(new Request("http://test/api/x", { headers: { Origin: origin, ...extra } }), {
    ALLOWED_ORIGINS: allowed,
  });

describe("getCorsHeaders", () => {
  it("allows an origin that is in the list", () => {
    const h = headersFor("http://localhost:5173", "https://app.com,http://localhost:5173");
    expect(h["Access-Control-Allow-Origin"]).toBe("http://localhost:5173");
  });

  it("does not allow an origin that is not in the list", () => {
    expect(headersFor("http://evil.com", "http://localhost:5173")["Access-Control-Allow-Origin"]).toBeUndefined();
  });

  it("is not fooled by another port or by 127.0.0.1", () => {
    expect(headersFor("http://localhost:5174", "http://localhost:5173")["Access-Control-Allow-Origin"]).toBeUndefined();
    expect(headersFor("http://127.0.0.1:5173", "http://localhost:5173")["Access-Control-Allow-Origin"]).toBeUndefined();
  });

  it("tolerates quotes, spaces and a trailing slash in ALLOWED_ORIGINS", () => {
    const h = headersFor("http://localhost:5173", ' "http://localhost:5173/" , https://app.com ');
    expect(h["Access-Control-Allow-Origin"]).toBe("http://localhost:5173");
  });

  it("allows nothing when ALLOWED_ORIGINS is missing", () => {
    expect(headersFor("http://localhost:5173", undefined)["Access-Control-Allow-Origin"]).toBeUndefined();
  });

  it("echoes the headers the browser asks for in the preflight", () => {
    const h = headersFor("http://localhost:5173", "http://localhost:5173", {
      "Access-Control-Request-Headers": "content-type,x-custom",
    });
    expect(h["Access-Control-Allow-Headers"]).toBe("content-type,x-custom");
  });
});
