import { useState } from "react";
import { auth } from "../../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError("Correo o contraseña incorrectos");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: "#091413" }}
    >
      <div
        className="p-8 rounded-2xl shadow-xl w-full max-w-md"
        style={{ backgroundColor: "#285a48" }}
      >
        <h1
          className="text-3xl font-bold text-center mb-2"
          style={{ color: "#b0e4cc" }}
        >
          📁 DAM
        </h1>
       
        {error && (
          <p className="text-red-400 text-sm text-center mb-4">{error}</p>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-4 py-3 rounded-xl text-sm focus:outline-none"
            style={{ backgroundColor: "#091413", color: "#b0e4cc" }}
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="px-4 py-3 rounded-xl text-sm focus:outline-none"
            style={{ backgroundColor: "#091413", color: "#b0e4cc" }}
          />
          <button
            type="submit"
            className="py-3 rounded-xl font-bold transition-all"
            style={{ backgroundColor: "#408a71", color: "#fff" }}
          >
            Iniciar sesión
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;