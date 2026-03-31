import { useState } from "react";
import axios from "axios";
import { db, auth } from "../../firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

function UploadForm({ onSubida }) {
  const [archivo, setArchivo] = useState(null);
  const [cargando, setCargando] = useState(false);

  const handleSubir = async () => {
    if (!archivo) return;
    setCargando(true);

    const formData = new FormData();
    formData.append("file", archivo);
    formData.append("upload_preset", "dam_preset");

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
        usuario: auth.currentUser.email
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
      <button
        onClick={handleSubir}
        disabled={cargando}
        className="py-2 rounded-xl font-semibold transition-all"
        style={{ backgroundColor: "#b0e4cc", color: "#091413" }}
      >
        {cargando ? "Subiendo..." : "Subir"}
      </button>
    </div>
  );
}

export default UploadForm;