import { useState, useRef } from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

function ImageEditor({ activo, onCerrar }) {
  const imgRef = useRef(null);
  const [crop, setCrop] = useState({ unit: "%", width: 50, height: 50, x: 25, y: 25 });
  const [ancho, setAncho] = useState(800);
  const [alto, setAlto] = useState(600);
  const [urlResultado, setUrlResultado] = useState("");
  const [modo, setModo] = useState("recorte");

  const handleRecortar = () => {
    const imagen = imgRef.current;
    const canvas = document.createElement("canvas");
    const scaleX = imagen.naturalWidth / imagen.width;
    const scaleY = imagen.naturalHeight / imagen.height;

    canvas.width = crop.width * scaleX;
    canvas.height = crop.height * scaleY;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(
      imagen,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      canvas.width,
      canvas.height
    );

    setUrlResultado(canvas.toDataURL("image/jpeg"));
  };

  const handleRedimensionar = () => {
    const canvas = document.createElement("canvas");
    canvas.width = ancho;
    canvas.height = alto;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(imgRef.current, 0, 0, ancho, alto);
    setUrlResultado(canvas.toDataURL("image/jpeg"));
  };

  const handleDescargar = () => {
    const link = document.createElement("a");
    link.download = `editado_${activo.nombre}`;
    link.href = urlResultado;
    link.click();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-50 overflow-y-auto">
      <div className="min-h-screen px-4 py-8 flex items-start justify-center">
        <div
          className="rounded-2xl shadow-2xl w-full max-w-xl p-6"
          style={{ backgroundColor: "#285a48" }}
        >
          {/* ENCABEZADO */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold" style={{ color: "#b0e4cc" }}>
              ✂️ Editor de imagen
            </h2>
            <button
              onClick={onCerrar}
              className="text-2xl font-bold"
              style={{ color: "#b0e4cc" }}
            >
              ×
            </button>
          </div>

          {/* SELECTOR DE MODO */}
          <div
            className="flex rounded-xl overflow-hidden mb-6"
            style={{ backgroundColor: "#091413" }}
          >
            <button
              onClick={() => { setModo("recorte"); setUrlResultado(""); }}
              className="flex-1 py-2 text-sm font-semibold transition-all"
              style={{
                backgroundColor: modo === "recorte" ? "#408a71" : "transparent",
                color: "#b0e4cc"
              }}
            >
              ✂️ Recortar
            </button>
            <button
              onClick={() => { setModo("redimensionar"); setUrlResultado(""); }}
              className="flex-1 py-2 text-sm font-semibold transition-all"
              style={{
                backgroundColor: modo === "redimensionar" ? "#408a71" : "transparent",
                color: "#b0e4cc"
              }}
            >
              ⤢ Redimensionar
            </button>
          </div>

          {/* MODO RECORTE */}
          {modo === "recorte" && (
            <div className="flex flex-col gap-4">
              <p className="text-xs" style={{ color: "#b0e4cc" }}>
                Arrastra el área para seleccionar la zona de recorte:
              </p>
              <div className="rounded-xl overflow-hidden flex justify-center">
                <ReactCrop crop={crop} onChange={(c) => setCrop(c)}>
                  <img
                    ref={imgRef}
                    src={activo.url}
                    alt={activo.nombre}
                    style={{ maxHeight: "300px", width: "100%", objectFit: "contain" }}
                    crossOrigin="anonymous"
                  />
                </ReactCrop>
              </div>
              <button
                onClick={handleRecortar}
                className="py-2 rounded-xl font-semibold transition-all"
                style={{ backgroundColor: "#408a71", color: "#fff" }}
              >
                Aplicar recorte
              </button>
            </div>
          )}

          {/* MODO REDIMENSIONAR */}
          {modo === "redimensionar" && (
            <div className="flex flex-col gap-4">
              <img
                ref={imgRef}
                src={activo.url}
                alt={activo.nombre}
                style={{ maxHeight: "250px", width: "100%", objectFit: "contain" }}
                className="rounded-xl"
                crossOrigin="anonymous"
              />
              <div className="flex gap-4">
                <div className="flex flex-col gap-1 flex-1">
                  <label className="text-xs" style={{ color: "#b0e4cc" }}>
                    Ancho (px)
                  </label>
                  <input
                    type="number"
                    value={ancho}
                    onChange={(e) => setAncho(Number(e.target.value))}
                    className="px-3 py-2 rounded-lg text-sm focus:outline-none"
                    style={{ backgroundColor: "#091413", color: "#b0e4cc" }}
                  />
                </div>
                <div className="flex flex-col gap-1 flex-1">
                  <label className="text-xs" style={{ color: "#b0e4cc" }}>
                    Alto (px)
                  </label>
                  <input
                    type="number"
                    value={alto}
                    onChange={(e) => setAlto(Number(e.target.value))}
                    className="px-3 py-2 rounded-lg text-sm focus:outline-none"
                    style={{ backgroundColor: "#091413", color: "#b0e4cc" }}
                  />
                </div>
              </div>
              <button
                onClick={handleRedimensionar}
                className="py-2 rounded-xl font-semibold transition-all"
                style={{ backgroundColor: "#408a71", color: "#fff" }}
              >
                Aplicar redimensionamiento
              </button>
            </div>
          )}

          {/* RESULTADO */}
          {urlResultado && (
            <div className="mt-6 flex flex-col gap-3">
              <p className="text-xs font-semibold" style={{ color: "#b0e4cc" }}>
                Vista previa del resultado:
              </p>
              <img
                src={urlResultado}
                alt="Resultado"
                style={{ maxHeight: "250px", width: "100%", objectFit: "contain" }}
                className="rounded-xl"
              />
              <button
                onClick={handleDescargar}
                className="py-2 rounded-xl font-bold transition-all"
                style={{ backgroundColor: "#b0e4cc", color: "#091413" }}
              >
                ⬇️ Descargar imagen editada
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default ImageEditor;