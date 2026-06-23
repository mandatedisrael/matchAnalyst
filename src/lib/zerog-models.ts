/** Default 0G Router model — must match an id from GET /v1/models */
export const DEFAULT_ZEROG_ROUTER_MODEL = "glm-5.1";

const MODEL_ALIASES: Record<string, string> = {
  "GLM-5-FP8": DEFAULT_ZEROG_ROUTER_MODEL,
  "glm-5-fp8": DEFAULT_ZEROG_ROUTER_MODEL,
  "zai-org/GLM-5-FP8": DEFAULT_ZEROG_ROUTER_MODEL,
  "zai-org/glm-5-fp8": DEFAULT_ZEROG_ROUTER_MODEL,
};

export function resolveZerogRouterModel(requested?: string): string {
  const trimmed = (requested ?? DEFAULT_ZEROG_ROUTER_MODEL).trim();
  if (!trimmed) {
    return DEFAULT_ZEROG_ROUTER_MODEL;
  }

  return MODEL_ALIASES[trimmed] ?? trimmed;
}