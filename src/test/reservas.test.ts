import { describe, it, expect } from "vitest";
import { haySolape, EJEMPLO, semana } from "@/lib/reservas";

describe("haySolape", () => {
  const r = [EJEMPLO[0]!]; // grabación 10-nov 14-17
  it("mezcla 16-18 choca con grabación 14-17", () => {
    expect(haySolape(r, "2026-11-10", "mezcla", 16)).toBe(true);
  });
  it("master 17-18 no choca", () => {
    expect(haySolape(r, "2026-11-10", "master", 17)).toBe(false);
  });
  it("otro día no choca", () => {
    expect(haySolape(r, "2026-11-11", "grabacion", 14)).toBe(false);
  });
  it("excluir la propia reserva al mover", () => {
    expect(haySolape(r, "2026-11-10", "grabacion", 14, "ej1")).toBe(false);
  });
  it("semana empieza lunes y tiene 6 días", () => {
    const s = semana(new Date(2026, 10, 12));
    expect(s.length).toBe(6);
    expect(s[0]!.getDate()).toBe(9);
  });
});
