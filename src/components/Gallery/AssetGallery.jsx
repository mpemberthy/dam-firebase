import { useState, useEffect } from "react";
import { db } from "../../firebaseConfig";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import AssetDetails from "../Details/AssetDetails";
import Fuse from "fuse.js";

function AssetGallery() {
  const [activos, setActivos] = useState([]);
  const [activoSeleccionado, setActivoSeleccionado] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [orden, setOrden] = useState("recientes");
  const [vistaLista, setVistaLista] = useState(false);

  useEffect(() => {
    const consulta = query(
      collection(db, "activos"),
      orderBy("fecha", "desc")
    );

    const escuchar = onSnapshot(consulta, (snapshot) => {
      const lista = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setActivos(lista);
    });

    return () => escuchar();
  }, []);

  const activosFiltrados = () => {
    let lista = [...activos];

    if (busqueda.trim()) {
      const fuse = new Fuse(lista, { keys: ["nombre", "etiquetas"], threshold: 0.4 });
      lista = fuse.search(busqueda).map((r) => r.item);
    }

    if (orden === "antiguos") lista.reverse();
    if (orden === "nombre") lista.sort((a, b) => a.nombre.localeCompare(b.nombre));

    return lista;
  };

  const resultados = activosFiltrados();

  return (
    <div className="w-full">

      {/* BARRA DE FILTROS */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Buscar por nombre o etiqueta..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="flex-1 px-4 py-2 rounded-xl text-sm focus:outline-none"
          style={{ backgroundColor: "#285a48", color: "#b0e4cc" }}
        />

        <select
          value={orden}
          onChange={(e) => setOrden(e.target.value)}
          className="px-4 py-2 rounded-xl text-sm focus:outline-none"
          style={{ backgroundColor: "#285a48", color: "#b0e4cc" }}
        >
          <option value="recientes">Más recientes</option>
          <option value="antiguos">Más antiguos</option>
          <option value="nombre">Nombre A-Z</option>
        </select>

        <div
          className="flex rounded-xl overflow-hidden"
          style={{ backgroundColor: "#285a48" }}
        >
          <button
            onClick={() => setVistaLista(false)}
            className="px-4 py-2 text-sm font-semibold transition-all"
            style={{
              backgroundColor: !vistaLista ? "#408a71" : "transparent",
              color: "#b0e4cc"
            }}
          >
            ⊞ Galería
          </button>
          <button
            onClick={() => setVistaLista(true)}
            className="px-4 py-2 text-sm font-semibold transition-all"
            style={{
              backgroundColor: vistaLista ? "#408a71" : "transparent",
              color: "#b0e4cc"
            }}
          >
            ☰ Lista
          </button>
        </div>
      </div>

      {/* CONTADOR */}
      <p className="text-xs mb-4" style={{ color: "#408a71" }}>
        {resultados.length} archivo{resultados.length !== 1 ? "s" : ""}
      </p>

      {/* VISTA VACÍA */}
      {resultados.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <span className="text-5xl">📂</span>
          <p className="text-sm" style={{ color: "#408a71" }}>
            {busqueda ? "No se encontraron archivos con esa búsqueda." : "No hay archivos subidos aún. ¡Haz clic en + Nuevo para empezar!"}
          </p>
        </div>
      )}

      {/* VISTA GALERÍA */}
      {!vistaLista && resultados.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {resultados.map((activo) => (
            <div
              key={activo.id}
              onClick={() => setActivoSeleccionado(activo)}
              className="rounded-xl overflow-hidden cursor-pointer transition-all hover:scale-105"
              style={{ backgroundColor: "#285a48" }}
            >
              <img
                src={activo.url}
                alt={activo.nombre}
                className="w-full h-36 object-cover"
              />
              <div className="p-2">
                <p className="text-xs font-medium truncate" style={{ color: "#b0e4cc" }}>
                  {activo.nombre}
                </p>
                <p className="text-xs truncate" style={{ color: "#408a71" }}>
                  {activo.usuario}
                </p>
                {activo.etiquetas?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {activo.etiquetas.map((tag, i) => (
                      <span
                        key={i}
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: "#408a71", color: "#fff" }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VISTA LISTA */}
      {vistaLista && resultados.length > 0 && (
        <div className="flex flex-col gap-2">
          {resultados.map((activo) => (
            <div
              key={activo.id}
              onClick={() => setActivoSeleccionado(activo)}
              className="flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all hover:opacity-80"
              style={{ backgroundColor: "#285a48" }}
            >
              <img
                src={activo.url}
                alt={activo.nombre}
                className="w-12 h-12 object-cover rounded-lg"
              />
              <div className="flex-1">
                <p className="text-sm font-medium" style={{ color: "#b0e4cc" }}>
                  {activo.nombre}
                </p>
                <p className="text-xs" style={{ color: "#408a71" }}>
                  {activo.usuario}
                </p>
              </div>
              {activo.etiquetas?.length > 0 && (
                <div className="flex gap-1">
                  {activo.etiquetas.map((tag, i) => (
                    <span
                      key={i}
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: "#408a71", color: "#fff" }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {activoSeleccionado && (
        <AssetDetails
          activo={activoSeleccionado}
          onCerrar={() => setActivoSeleccionado(null)}
        />
      )}
    </div>
  );
}

export default AssetGallery;