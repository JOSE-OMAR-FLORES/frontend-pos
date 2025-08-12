// src/components/ProductList.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '../config';

const ProductList = ({ onSelectProduct }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/products`);
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="product-list p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Productos Disponibles</h2>
      {products.length === 0 ? (
        <p>Cargando productos o no hay productos.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="product-card p-4 border rounded-lg cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => onSelectProduct(product)}
            >
              <h3 className="font-bold text-lg">{product.name}</h3>
              <p className="text-green-700 font-semibold">${product.price}</p>
              <p className="text-sm text-gray-600">{product.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;

