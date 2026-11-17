import { ZodError } from "zod";
import { HttpError } from "./auth";

// Wrap a route handler so thrown HttpError / ZodError become JSON responses.
export function handler<A extends unknown[]>(fn: (...args: A) => Promise<Response>) {
  return async (...args: A): Promise<Response> => {
    try {
      return await fn(...args);
    } catch (e) {
      if (e instanceof HttpError)
        return Response.json({ error: e.message }, { status: e.status });
      if (e instanceof ZodError)
        return Response.json({ error: "Yanlış məlumat", issues: e.issues }, { status: 400 });
      console.error(e);
      return Response.json({ error: "Server xətası" }, { status: 500 });
    }
  };
}
