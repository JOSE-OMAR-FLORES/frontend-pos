// src/components/OrderForm.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '../config';

const OrderForm = ({ selectedProducts, onOrderCreated }) => {
  const [orderItems, setOrderItems] = useState({});

  // Añadir producto al carrito
  const handleAddProduct = (product) => {
    setOrderItems((prevItems) => ({
      ...prevItems,
      [product.id]: (prevItems[product.id] || 0) + 1,
    }));
  };

  // Quitar producto del carrito
  const handleRemoveProduct = (product) => {
    setOrderItems((prevItems) => {
      const newItems = { ...prevItems };
      if (newItems[product.id] > 1) {
        newItems[product.id]--;
      } else {
        delete newItems[product.id];
      }
      return newItems;
    });
  };

  // Calcular total
  const calculateTotal = () => {
    let total = 0;
    Object.entries(orderItems).forEach(([productId, quantity]) => {
      const product = selectedProducts.find(p => p.id === parseInt(productId));
      if (product) {
        total += product.price * quantity;
      }
    });
    return total.toFixed(2);
  };

  // Enviar pedido al backend
  const handleSubmitOrder = async (paymentMethod) => {
    if (Object.keys(orderItems).length === 0) {
      alert('Por favor, añade productos al pedido.');
      return;
    }

    const itemsPayload = Object.entries(orderItems).map(([productId, quantity]) => ({
      product_id: parseInt(productId),
      quantity,
    }));

    try {
      const response = await axios.post(`${BACKEND_URL}/orders`, {
        items: itemsPayload,
        total_amount: parseFloat(calculateTotal()),
        payment_method: paymentMethod,
      });

      alert('¡Pedido creado exitosamente!');
      setOrderItems({});
      onOrderCreated(response.data); // Notificar al componente padre
    } catch (error) {
      if (error.response) {
        alert('Error al crear el pedido: ' + JSON.stringify(error.response.data));
        console.error('Error response:', error.response.data);
      } else {
        alert('Error al crear el pedido. Consulta la consola para más detalles.');
        console.error('Error:', error.message);
      }
    }
  };

  return (
    <div className="order-form p-6 border rounded-lg shadow-md bg-white">
      <h2 className="text-xl font-bold mb-4">Crear Pedido</h2>

      <div>
        <h3 className="font-semibold mb-2">Productos en el Carrito:</h3>
        {Object.keys(orderItems).length === 0 ? (
          <p>No hay productos en el carrito.</p>
        ) : (
          <ul>
            {Object.entries(orderItems).map(([productId, quantity]) => {
              const product = selectedProducts.find(p => p.id === parseInt(productId));
              return (
                product && (
                  <li key={productId} className="flex justify-between items-center mb-2">
                    <span>
                      {product.name} x {quantity} (${(product.price * quantity).toFixed(2)})
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleRemoveProduct(product)}
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition"
                      >
                        -
                      </button>
                      <button
                        onClick={() => handleAddProduct(product)}
                        className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 transition"
                      >
                        +
                      </button>
                    </div>
                  </li>
                )
              );
            })}
          </ul>
        )}
      </div>

      <div className="mt-4 text-right">
        <p className="text-lg font-bold">Total: ${calculateTotal()}</p>

        <div className="flex justify-end gap-4 mt-4">
          <button
            onClick={() => handleSubmitOrder('cash')}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
          >
            Pagar en efectivo
          </button>
          <button
            onClick={() => handleSubmitOrder('card')}
            className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition"
          >
            Pagar con tarjeta
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderForm;
