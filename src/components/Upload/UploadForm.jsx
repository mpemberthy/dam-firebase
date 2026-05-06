import { useState } from "react";
import axios from "axios";
import { db, auth } from "../../firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

function UploadForm({ onSubida }) {
  const [archivo, setArchivo] = useState(null);
  const [cargando, setCargando] = useState(false);

  const [copyright, setCopyright] = useState("");
  const [procedencia, setProcedencia] = useState("Producción interna");
  const [usoRecomendado, setUsoRecomendado] = useState("Web");
  const [notasAdicionales, setNotasAdicionales] = useState(""); 

  const handleSubir = async () => {
    if (!archivo || !copyright) {
      alert("Por favor, selecciona un archivo e ingresa el Copyright.");
      return;
    }
    setCargando(true);

    const formData = new FormData();
    formData.append("file", archivo);
    formData.append("upload_preset", "dam_preset");

    formData.append("context", `copyright=${copyright}|source=${procedencia}|usage=${usoRecomendado}|notes=${notasAdicionales}`);

    try {
      const respuesta = await axios.post(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData
      );

      const url = respuesta.data.secure_url;

      await addDoc(collection(db, "activos"), {
        url,
        nombre: archivo.name,
        fecha: serverTimestamp(),
        usuario: auth.currentUser.email,
        estado: "Pendiente", 
        copyright,         
        procedencia,
        usoRecomendado,
        notasAdicionales
      });

      onSubida();
    } catch (error) {
      console.error("Error al subir:", error);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <input
        type="file"
        onChange={(e) => setArchivo(e.target.files[0])}
        className="text-sm rounded-lg p-2"
        style={{ backgroundColor: "#408a71", color: "#fff" }}
      />

      <div className="flex flex-col gap-2">
        <input
          type="text"
          placeholder="Copyright (Obligatorio) *"
          value={copyright}
          onChange={(e) => setCopyright(e.target.value)}
          className="p-2 rounded-lg text-sm outline-none"
          style={{ backgroundColor: "#091413", color: "#b0e4cc", border: "1px solid #408a71" }}
        />

        <div className="grid grid-cols-2 gap-2">
          <select
            value={procedencia}
            onChange={(e) => setProcedencia(e.target.value)}
            className="p-2 rounded-lg text-xs outline-none"
            style={{ backgroundColor: "#091413", color: "#b0e4cc", border: "1px solid #408a71" }}
          >
            <option value="Producción interna">Producción interna</option>
            <option value="Freelance">Freelance</option>
            <option value="Stock">Stock</option>
          </select>

          <select
            value={usoRecomendado}
            onChange={(e) => setUsoRecomendado(e.target.value)}
            className="p-2 rounded-lg text-xs outline-none"
            style={{ backgroundColor: "#091413", color: "#b0e4cc", border: "1px solid #408a71" }}
          >
            <option value="Web">Uso: Web</option>
            <option value="Impresión">Uso: Impresión</option>
            <option value="Redes Sociales">Uso: Redes Sociales</option>
          </select>
        </div>

        <textarea
          placeholder="Metadatos adicionales o descripción..."
          value={notasAdicionales}
          onChange={(e) => setNotasAdicionales(e.target.value)}
          className="p-2 rounded-lg text-sm outline-none h-16 resize-none"
          style={{ backgroundColor: "#091413", color: "#b0e4cc", border: "1px solid #408a71" }}
        />
      </div>

      <button
        onClick={handleSubir}
        disabled={cargando}
        className="py-2 rounded-xl font-semibold transition-all"
        style={{ backgroundColor: "#b0e4cc", color: "#091413" }}
      >
        {cargando ? "Incrustando metadatos..." : "Subir Recurso"}
      </button>
    </div>
  );
}

export default UploadForm;