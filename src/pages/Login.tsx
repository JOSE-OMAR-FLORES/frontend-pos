import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

const Login = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    const success = login(username, password);
    if (!success) {
      setError("Usuario o contraseña incorrectos");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md text-center space-y-4 w-full max-w-sm">
        <h2 className="text-xl font-semibold mb-2">Iniciar Sesión</h2>
        <input
          type="text"
          placeholder="Usuario"
          className="border px-3 py-2 w-full rounded"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            setError("");
          }}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
        />
        <input
          type="password"
          placeholder="Contraseña"
          className="border px-3 py-2 w-full rounded"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError("");
          }}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
        />
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <button
          onClick={handleLogin}
          className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700 transition"
        >
          Iniciar Sesión
        </button>
      </div>
    </div>
  );
};

export default Login;
