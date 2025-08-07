// src/components/ProductList.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProductList = ({ onSelectProduct }) => {
    const [products, setProducts] = useState([]);
    const BACKEND_URL = 'http://backend-pos.test/api/products'; // O http://localhost:8000/api

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
        <div className="product-list">
            <h2>Productos Disponibles</h2>
            {products.length === 0 ? (
                <p>Cargando productos o no hay productos.</p>
            ) : (
                <div className="grid grid-cols-3 gap-4"> {/* Usa Tailwind CSS o tu propio CSS */}
                    {products.map(product => (
                        <div
                            key={product.id}
                            className="product-card p-4 border rounded-lg cursor-pointer hover:bg-gray-100"
                            onClick={() => onSelectProduct(product)}
                        >
                            <h3 className="font-bold">{product.name}</h3>
                            <p>${product.price}</p>
                            <p className="text-sm text-gray-600">{product.description}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProductList;