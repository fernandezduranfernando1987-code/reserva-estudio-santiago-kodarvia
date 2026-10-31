import { useState, useEffect } from "react";

const ADMIN_PASSWORD = "admin123";

export default function Admin() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [reservas, setReservas] = useState([]);

  useEffect(() => {
    if(isAuthenticated){
      const data = JSON.parse(localStorage.getItem("reservas") || "[]");
      setReservas(data);
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div style={{ padding: "40px", maxWidth: "400px", margin: "auto" }}>
        <h2>Panel Admin - Estudio Santiago</h2>
        <p>Ingresá la clave para ver las reservas</p>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Clave admin" style={{ width: "100%", padding: "10px", marginBottom: "10px" }} />
        <button onClick={() => password === ADMIN_PASSWORD ? setIsAuthenticated(true) : alert("Clave incorrecta")} style={{ width: "100%", padding: "10px" }}>Entrar</button>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Reservas - Estudio Santiago</h2>
      <p>Total: {reservas.length}</p>
      <table border={1} cellPadding={10} style={{ width: "100%" }}>
        <thead><tr><th>Cliente</th><th>Fecha</th></tr></thead>
        <tbody>
          {reservas.map((r:any, i:number) => <tr key={i}><td>{r.cliente || r.nombre}</td><td>{r.fecha}</td></tr>)}
        </tbody>
      </table>
    </div>
  );
}
