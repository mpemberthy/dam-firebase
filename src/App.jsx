import { useState, useEffect } from "react";
import { auth } from "./firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";
import Login from "./components/Auth/Login";
import UploadForm from "./components/Upload/UploadForm";
import AssetGallery from "./components/Gallery/AssetGallery";

function App() {
  const [usuario, setUsuario] = useState(null);
  const [mostrarUpload, setMostrarUpload] = useState(false);

  useEffect(() => {
    const escuchar = onAuthStateChanged(auth, (usuarioActual) => {
      setUsuario(usuarioActual);
    });
    return () => escuchar();
  }, []);

  const handleCerrarSesion = async () => {
    await signOut(auth);
  };

  if (usuario) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: "#091413" }}>

        {/* NAVBAR */}
        <nav
          className="flex items-center justify-between px-6 py-3 shadow-md"
          style={{ backgroundColor: "#285a48" }}
        >
          <div className="flex items-center gap-4">
            <span
              className="text-xl font-bold"
              style={{ color: "#b0e4cc" }}
            >
              📁 DAM
            </span>
            <button
              onClick={() => setMostrarUpload(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm shadow transition-all"
              style={{ backgroundColor: "#b0e4cc", color: "#091413" }}
            >
              + Nuevo
            </button>
          </div>

          <div className="flex items-center gap-4">
            <span
              className="text-sm hidden md:block"
              style={{ color: "#b0e4cc" }}
            >
              {usuario.email}
            </span>
            <button
              onClick={handleCerrarSesion}
              className="text-sm px-4 py-2 rounded-xl font-semibold transition-all"
              style={{ backgroundColor: "#408a71", color: "#fff" }}
            >
              Cerrar sesión
            </button>
          </div>
        </nav>

        {/* CONTENIDO PRINCIPAL */}
        <main className="max-w-5xl mx-auto px-6 py-8">
          <AssetGallery />
        </main>

        {/* MODAL DE SUBIDA */}
        {mostrarUpload && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 px-4">
            <div
              className="rounded-2xl shadow-xl w-full max-w-md p-6"
              style={{ backgroundColor: "#285a48" }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2
                  className="text-lg font-bold"
                  style={{ color: "#b0e4cc" }}
                >
                  Subir archivo
                </h2>
                <button
                  onClick={() => setMostrarUpload(false)}
                  className="text-2xl font-bold"
                  style={{ color: "#b0e4cc" }}
                >
                  ×
                </button>
              </div>
              <UploadForm onSubida={() => setMostrarUpload(false)} />
            </div>
          </div>
        )}

      </div>
    );
  }

  return <Login />;
}

export default App;