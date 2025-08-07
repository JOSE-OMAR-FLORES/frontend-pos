// src/pages/RegistroRestaurante.jsx
import { useState } from "react";
import PrivacyModal from "../components/PrivacyModal";

export default function RegistroRestaurante() {
  const [aceptado, setAceptado] = useState(false);
  const [form, setForm] = useState({
    nombre: "",
    usuario: "",
    email: "",
    telefono: "",
    password: ""
  });

  const handleAccept = () => setAceptado(true);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://backend-pos.test/api/restaurantes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      if (res.ok) {
        alert("Restaurante registrado con éxito.");
        window.location.href = "/login";
      } else {
        const error = await res.json();
        alert("Error al registrar: " + (error.message || "Verifica los datos"));
      }
    } catch (error) {
      console.error(error);
      alert("Hubo un error en la conexión con el servidor.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      {!aceptado && <PrivacyModal onAccept={handleAccept} />}
      {aceptado && (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
        >
          <h2 className="text-lg font-semibold mb-4">Registro de Restaurante</h2>

          <input
            name="nombre"
            placeholder="Nombre del restaurante"
            value={form.nombre}
            onChange={handleChange}
            required
            className="mb-2 w-full p-2 border"
          />

          <input
            name="usuario"
            placeholder="Nombre de usuario"
            value={form.usuario}
            onChange={handleChange}
            required
            className="mb-2 w-full p-2 border"
          />

          <input
            name="email"
            placeholder="Correo"
            value={form.email}
            onChange={handleChange}
            required
            type="email"
            className="mb-2 w-full p-2 border"
          />

          <input
            name="telefono"
            placeholder="Teléfono"
            value={form.telefono}
            onChange={handleChange}
            required
            className="mb-2 w-full p-2 border"
          />

          <input
            name="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={handleChange}
            required
            type="password"
            className="mb-4 w-full p-2 border"
          />

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 w-full rounded"
          >
            Registrar
          </button>
        </form>
      )}
    </div>
  );
}
