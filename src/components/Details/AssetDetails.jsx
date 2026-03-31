import { useState } from "react";
import { db } from "../../firebaseConfig";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import ImageEditor from "../Editor/ImageEditor";

function AssetDetails({ activo, onCerrar }) {
  const [etiqueta, setEtiqueta] = useState("");
  const [etiquetas, setEtiquetas] = useState(activo.etiquetas || []);
  const [mostrarEditor, setMostrarEditor] = useState(false);
  const [copiado, setCopiado] = useState(false);

  const handleCopiarEnlace = () => {
    navigator.clipboard.writeText(activo.url);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  const handleAgregarEtiqueta = async () => {
    if (!etiqueta.trim()) return;
    const nuevasEtiquetas = [...etiquetas, etiqueta.trim()];
    setEtiquetas(nuevasEtiquetas);
    setEtiqueta("");
    await updateDoc(doc(db, "activos", activo.id), {
      etiquetas: nuevasEtiquetas
    });
  };

  const handleEliminar = async () => {
    await deleteDoc(doc(db, "activos", activo.id));
    onCerrar();
  };

  // Si el editor está abierto, muestra solo el editor
  if (mostrarEditor) {
    return (
      <ImageEditor
        activo={activo}
        onCerrar={() => setMostrarEditor(false)}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 px-4">
      <div
        className="rounded-2xl shadow-2xl w-full max-w-lg p-6"
        style={{ backgroundColor: "#285a48" }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold" style={{ color: "#b0e4cc" }}>
            Detalles del archivo
          </h2>
          <button
            onClick={onCerrar}
            className="text-2xl font-bold"
            style={{ color: "#b0e4cc" }}
          >
            ×
          </button>
        </div>

        <img
          src={activo.url}
          alt={activo.nombre}
          className="w-full h-48 object-cover rounded-xl mb-4"
        />

        <p className="text-sm mb-1" style={{ color: "#b0e4cc" }}>
          <span className="font-semibold">Nombre:</span> {activo.nombre}
        </p>
        <p className="text-sm mb-4" style={{ color: "#b0e4cc" }}>
          <span className="font-semibold">Subido por:</span> {activo.usuario}
        </p>

        <button
          onClick={handleCopiarEnlace}
          className="w-full py-2 rounded-xl font-semibold mb-4 transition-all"
          style={{ backgroundColor: "#408a71", color: "#fff" }}
        >
          {copiado ? "¡Enlace copiado! ✓" : "🔗 Copiar enlace"}
        </button>

        <button
          onClick={() => setMostrarEditor(true)}
          className="w-full py-2 rounded-xl font-semibold mb-4 transition-all"
          style={{ backgroundColor: "#b0e4cc", color: "#091413" }}
        >
          ✂️ Editar imagen
        </button>

        <div className="flex gap-2 mb-3">
          <input
            type="text"
            placeholder="Agregar etiqueta..."
            value={etiqueta}
            onChange={(e) => setEtiqueta(e.target.value)}
            className="flex-1 px-3 py-2 rounded-lg text-sm focus:outline-none"
            style={{ backgroundColor: "#091413", color: "#b0e4cc" }}
          />
          <button
            onClick={handleAgregarEtiqueta}
            className="px-4 rounded-lg text-sm font-semibold transition-all"
            style={{ backgroundColor: "#b0e4cc", color: "#091413" }}
          >
            + Agregar
          </button>
        </div>

        {etiquetas.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {etiquetas.map((tag, index) => (
              <span
                key={index}
                className="text-xs px-3 py-1 rounded-full font-medium"
                style={{ backgroundColor: "#408a71", color: "#fff" }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <button
          onClick={handleEliminar}
          className="w-full py-2 rounded-xl font-semibold transition-all"
          style={{ backgroundColor: "#091413", color: "#b0e4cc" }}
        >
          🗑️ Eliminar archivo
        </button>
      </div>
    </div>
  );
}

export default AssetDetails;