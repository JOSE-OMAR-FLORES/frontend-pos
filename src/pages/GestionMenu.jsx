// src/pages/GestionMenu.jsx
import { useEffect, useState } from "react";
import { BACKEND_URL } from '../config';

export default function GestionMenu() {
  const [productos, setProductos] = useState([]);
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    imagen: null,
  });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
      .then((res) => res.json())
      .then(setProductos)
      .catch(console.error);
  }, []);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("nombre", formData.nombre);
    data.append("descripcion", formData.descripcion);
    data.append("precio", formData.precio);
    if (formData.imagen) data.append("imagen", formData.imagen);

    const response = await fetch(url, {
      method: method,
      body: data,
    });

    if (response.ok) {
      alert(`Producto ${editId ? "modificado" : "creado"} correctamente`);
      window.location.reload();
    } else {
      alert("Error al guardar el producto");
    }
  };

  const handleEdit = (producto) => {
    setFormData({
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio,
      imagen: null, // no se puede cargar directamente
    });
    setEditId(producto.id);
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar este producto?")) return;
    {
      method: "DELETE",
    });

    if (res.ok) {
      alert("Producto eliminado");
      setProductos(productos.filter((p) => p.id !== id));
    } else {
      alert("Error al eliminar");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">
        {editId ? "Editar Producto" : "Nuevo Producto"}
      </h2>

      <form onSubmit={handleSubmit} className="grid gap-4 mb-6">
        <input
          name="nombre"
          value={formData.nombre}
          onChange={handleInputChange}
          placeholder="Nombre"
          required
          className="border p-2"
        />
        <textarea
          name="descripcion"
          value={formData.descripcion}
          onChange={handleInputChange}
          placeholder="Descripción"
          required
          className="border p-2"
        />
        <input
          name="precio"
          value={formData.precio}
          onChange={handleInputChange}
          placeholder="Precio"
          type="number"
          required
          className="border p-2"
        />
        <input
          name="imagen"
          onChange={handleInputChange}
          type="file"
          accept="image/*"
          className="border p-2"
        />
        <button type="submit" className="bg-blue-600 text-white py-2 rounded">
          {editId ? "Actualizar" : "Agregar"}
        </button>
      </form>

      <h3 className="text-lg font-semibold mb-2">Productos actuales</h3>
      <div className="grid gap-4">
        {productos.map((p) => (
          <div key={p.id} className="border p-4 rounded shadow-sm">
            <h4 className="font-bold">{p.nombre}</h4>
            <p>{p.descripcion}</p>
            <p className="text-green-600 font-semibold">${p.precio}</p>
            {p.imagen && (
              
                alt={p.nombre}
                className="w-32 mt-2"
              />
            )}
            <div className="mt-2 space-x-2">
              <button
                onClick={() => handleEdit(p)}
                className="px-3 py-1 bg-yellow-500 text-white rounded"
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(p.id)}
                className="px-3 py-1 bg-red-600 text-white rounded"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
