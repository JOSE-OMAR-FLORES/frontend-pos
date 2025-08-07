// src/components/KitchenDisplay.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const KitchenDisplay = () => {
    const [orders, setOrders] = useState([]);
    const BACKEND_URL = 'http://backend-pos.test/api/products'; // O http://localhost:8000/api

    const fetchOrders = async () => {
        try {
            const response = await axios.get(`${BACKEND_URL}/orders`);
            // Filtrar solo los pedidos pendientes o en preparación para la cocina
            setOrders(response.data.filter(order => order.status === 'pending' || order.status === 'preparing'));
        } catch (error) {
            console.error('Error fetching orders for kitchen:', error);
        }
    };

    useEffect(() => {
        fetchOrders();
        // Refrescar pedidos cada X segundos para simular tiempo real
        const interval = setInterval(fetchOrders, 5000); // Refresca cada 5 segundos
        return () => clearInterval(interval); // Limpia el intervalo al desmontar
    }, []);

    const handleUpdateOrderStatus = async (orderId, newStatus) => {
        try {
            await axios.put(`${BACKEND_URL}/orders/${orderId}/status`, { status: newStatus });
            fetchOrders(); // Refrescar la lista de pedidos después de actualizar
        } catch (error) {
            console.error('Error updating order status:', error);
        }
    };

    return (
        <div className="kitchen-display p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Pantalla de Cocina (KDS)</h2>
            {orders.length === 0 ? (
                <p>No hay pedidos pendientes o en preparación.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {orders.map(order => (
                        <div key={order.id} className="order-card p-4 border rounded-lg shadow-sm bg-blue-50">
                            <h3 className="text-xl font-bold mb-2">Pedido #{order.id}</h3>
                            <p className={`mb-2 font-semibold ${order.status === 'pending' ? 'text-orange-600' : 'text-blue-600'}`}>
                                Estado: {order.status === 'pending' ? 'Pendiente' : 'En Preparación'}
                            </p>
                            <ul className="list-disc pl-5 mb-4">
                                {order.items.map(item => (
                                    <li key={item.id}>
                                        {item.quantity}x {item.product.name}
                                    </li>
                                ))}
                            </ul>
                            <div className="flex gap-2">
                                {order.status === 'pending' && (
                                    <button
                                        onClick={() => handleUpdateOrderStatus(order.id, 'preparing')}
                                        className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600"
                                    >
                                        Marcar En Preparación
                                    </button>
                                )}
                                {order.status === 'preparing' && (
                                    <button
                                        onClick={() => handleUpdateOrderStatus(order.id, 'completed')}
                                        className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                                    >
                                        Marcar Completado
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default KitchenDisplay;