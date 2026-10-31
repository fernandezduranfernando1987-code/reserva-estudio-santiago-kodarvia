import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { BloqueosAdmin } from "@/components/BloqueosAdmin";

const ADMIN_PASSWORD = "admin123";

function Admin() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [reservas, setReservas] = useState<any[]>([]);

  useEffect(() => {
    if (isAuthenticated) {
      const data = JSON.parse(localStorage.getItem("kodarvia_reservas") || "[]");
      setReservas(data);
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div style={{ padding: "40px", maxWidth: "400px", margin: "auto" }}>
        <h2>Panel Admin - Estudio Santiago</h2>
        <p>Ingresá la clave para ver las reservas</p>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Clave admin" style={{ width: "100%" }} />
        <button onClick={() => { if(password===ADMIN_PASSWORD) setIsAuthenticated(true); else alert("Clave incorrecta"); }}>Entrar</button>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Panel de Reservas</h1>
      <p>Total: {reservas.length}</p>
      <BloqueosAdmin />
    </div>
  );
}

export const Route = createFileRoute('/admin')({
  component: Admin,
});
