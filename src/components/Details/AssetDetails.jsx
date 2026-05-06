import { useState } from "react";
import { db } from "../../firebaseConfig";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import ImageEditor from "../Editor/ImageEditor";

function AssetDetails({ activo, onCerrar, rol }) {
  const [etiqueta, setEtiqueta] = useState("");
  const [etiquetas, setEtiquetas] = useState(activo.etiquetas || []);
  const [mostrarEditor, setMostrarEditor] = useState(false);
  const [copiado, setCopiado] = useState(false);

  const handleCopiarEnlace = () => {
    navigator.clipboard.writeText(activo.url);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  const handleAprobar = async () => {
    await updateDoc(doc(db, "activos", activo.id), { estado: "Aprobado" });
    onCerrar();
  };

  const handleRechazar = async () => {
    await updateDoc(doc(db, "activos", activo.id), { estado: "Rechazado" });
    onCerrar();
  };

  const handleAgregarEtiqueta = async () => {
    if (!etiqueta.trim()) return;
    const nuevasEtiquetas = [...etiquetas, etiqueta.trim()];
    setEtiquetas(nuevasEtiquetas);
    setEtiqueta("");
    await updateDoc(doc(db, "activos", activo.id), { etiquetas: nuevasEtiquetas });
  };

  const handleEliminar = async () => {
    await deleteDoc(doc(db, "activos", activo.id));
    onCerrar();
  };

  if (mostrarEditor) {
    return <ImageEditor activo={activo} onCerrar={() => setMostrarEditor(false)} />;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
      
      <div 
        className="rounded-3xl shadow-2xl w-full max-w-lg p-6 overflow-y-auto max-h-[90vh] custom-scroll" 
        style={{ backgroundColor: "#285a48" }}
      >
        
        <div className="flex justify-between items-center mb-4 sticky top-0 bg-[#285a48] py-2 z-20">
          <h2 className="text-lg font-bold" style={{ color: "#b0e4cc" }}>
            Detalles del archivo <span className="text-xs font-normal opacity-60 ml-1">({activo.estado || "Pendiente"})</span>
          </h2>
          <button onClick={onCerrar} className="text-2xl font-bold" style={{ color: "#b0e4cc" }}>×</button>
        </div>

        <img src={activo.url} alt={activo.nombre} className="w-full h-48 object-cover rounded-2xl mb-4 shadow-md" />

        <div className="grid grid-cols-2 gap-4 mb-4 p-4 rounded-xl shadow-inner" style={{ backgroundColor: "#091413" }}>
          <p className="text-[11px]" style={{ color: "#b0e4cc" }}>
            <span className="font-bold opacity-50 uppercase">Copyright:</span> {activo.copyright || "N/D"}
          </p>
          <p className="text-[11px]" style={{ color: "#b0e4cc" }}>
            <span className="font-bold opacity-50 uppercase">Procedencia:</span> {activo.procedencia || "N/D"}
          </p>
          <p className="text-[11px]" style={{ color: "#b0e4cc" }}>
            <span className="font-bold opacity-50 uppercase">Uso recomendado:</span> {activo.usoRecomendado || "N/D"}
          </p>
          <p className="text-[11px] truncate" style={{ color: "#b0e4cc" }}>
            <span className="font-bold opacity-50 uppercase">Subido por:</span> {activo.usuario}
          </p>
        </div>

        <button
          onClick={handleCopiarEnlace}
          className="w-full py-3 rounded-xl font-semibold mb-3 transition-all flex items-center justify-center gap-2"
          style={{ backgroundColor: "#408a71", color: "#fff" }}
        >
          🔗 {copiado ? "Enlace copiado ✓" : "Copiar enlace"}
        </button>

        {rol === "admin" && (
          <div className="flex gap-2 mb-3">
            <button
              onClick={handleAprobar}
              className="flex-1 py-3 rounded-xl font-bold transition-all shadow-md"
              style={{ backgroundColor: "#b0e4cc", color: "#091413" }}
            >
              ✓ Aceptar
            </button>
            <button
              onClick={handleRechazar}
              className="flex-1 py-3 rounded-xl font-bold transition-all border-2"
              style={{ borderColor: "#b0e4cc", color: "#b0e4cc" }}
            >
              ✕ Rechazar
            </button>
          </div>
        )}

        {(rol === "admin" || rol === "regular") && (
          <>
            <button
              onClick={() => setMostrarEditor(true)}
              className="w-full py-3 rounded-xl font-semibold mb-3 transition-all"
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
                className="flex-1 px-4 py-2 rounded-xl text-sm focus:outline-none"
                style={{ backgroundColor: "#091413", color: "#b0e4cc" }}
              />
              <button
                onClick={handleAgregarEtiqueta}
                className="px-4 rounded-xl font-bold"
                style={{ backgroundColor: "#b0e4cc", color: "#091413" }}
              >
                +
              </button>
            </div>
          </>
        )}

        <div className="flex flex-wrap gap-2 mb-6">
          {etiquetas.map((tag, index) => (
            <span key={index} className="text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider" style={{ backgroundColor: "#408a71", color: "#fff" }}>
              {tag}
            </span>
          ))}
        </div>

        {rol === "admin" && (
          <button
            onClick={handleEliminar}
            className="w-full py-2.5 rounded-xl font-bold transition-all mt-4 border border-transparent hover:border-red-400"
            style={{ backgroundColor: "#091413", color: "#b0e4cc" }}
          >
            🗑️ Eliminar archivo
          </button>
        )}
      </div>
    </div>
  );
}

export default AssetDetails;