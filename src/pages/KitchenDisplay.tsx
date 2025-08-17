import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Clock, CheckCircle, AlertCircle, PlayCircle } from "lucide-react";
import axios from 'axios';
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from '../config';
import { ORDERS_API_URL } from '../config';

interface ApiOrderItem {
    id: number;
    order_id: number;
    product_id: number;
    product_name: string;
    quantity: number;
    price_at_order: number;
}

interface KitchenOrder {
    id: number;
    total_amount: number;
    status: 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
    payment_method: string;
    created_at: string;
    updated_at: string;
    items: ApiOrderItem[];
    order_number?: number;
    estimated_time?: number;
    priority?: 'normal' | 'urgent';
    customer_name?: string;
    notes?: string;
}

const KitchenDisplay: React.FC = () => {
    const [orders, setOrders] = useState<KitchenOrder[]>([]);
    const [loadingOrders, setLoadingOrders] = useState(true);
    const [errorOrders, setErrorOrders] = useState<string | null>(null);
    const [currentTime, setCurrentTime] = useState(new Date());

    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user || user.role !== 'kitchen') {
            navigate("/login");
        }
    }, [user, navigate]);

    const fetchOrders = async () => {
        try {
            setLoadingOrders(true);
            setErrorOrders(null);

            const response = await axios.get(ORDERS_API_URL, {
                params: { status: 'pending,preparing,ready' }
            });

            const fetchedOrders: KitchenOrder[] = response.data.data.map((order: any) => ({
                ...order,
                created_at: order.created_at ? new Date(order.created_at) : new Date(),
                estimated_time: order.estimated_time || 15,
                priority: order.priority || 'normal',
                order_number: order.id
            }));

            const sortedOrders = fetchedOrders.sort((a, b) => {
                if (a.priority === 'urgent' && b.priority !== 'urgent') return -1;
                if (b.priority === 'urgent' && a.priority !== 'urgent') return 1;
                return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
            });

            setOrders(sortedOrders);
        } catch (err) {
            console.error('Error fetching orders:', err);
            setErrorOrders('No se pudieron cargar los pedidos. Intenta recargar.');
        } finally {
            setLoadingOrders(false);
        }
    };

    useEffect(() => {
        fetchOrders();
        const intervalId = setInterval(fetchOrders, 5000);
        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000);
        return () => clearInterval(timer);
    }, []);

    const updateOrderStatus = async (orderId: number, newStatus: KitchenOrder['status']) => {
        try {
            await axios.patch(`${ORDERS_API_URL}/${orderId}`, { status: newStatus });
            fetchOrders();
        } catch (error) {
            console.error(`Error updating order ${orderId} to ${newStatus}:`, error);
            if (axios.isAxiosError(error) && error.response) {
                alert(`Error al actualizar el pedido: ${error.response.data.message || 'Error desconocido'}`);
            } else {
                alert('Hubo un problema al actualizar el pedido. Verifica tu conexión.');
            }
        }
    };

    const getElapsedTime = (orderTime: string | Date) => {
        const time = typeof orderTime === 'string' ? new Date(orderTime) : orderTime;
        const diffMs = currentTime.getTime() - time.getTime();
        return Math.floor(diffMs / 60000);
    };

    const getStatusColor = (status: KitchenOrder['status']) => {
        switch (status) {
            case 'pending': return 'bg-yellow-500';
            case 'preparing': return 'bg-blue-500';
            case 'ready': return 'bg-green-500';
            case 'delivered': return 'bg-gray-500';
            case 'cancelled': return 'bg-red-500';
            default: return 'bg-gray-500';
        }
    };

    const getStatusIcon = (status: KitchenOrder['status']) => {
        switch (status) {
            case 'pending': return AlertCircle;
            case 'preparing': return PlayCircle;
            case 'ready': return CheckCircle;
            case 'delivered': return CheckCircle;
            case 'cancelled': return AlertCircle;
            default: return AlertCircle;
        }
    };

    const getPriorityColor = (priority: KitchenOrder['priority'], elapsedTime: number, estimatedTime: number) => {
        const actualEstimatedTime = estimatedTime || 15;
        const actualPriority = priority || 'normal';

        if (actualPriority === 'urgent' || elapsedTime > actualEstimatedTime) {
            return 'border-red-500 bg-red-50';
        }
        if (elapsedTime > actualEstimatedTime * 0.8) {
            return 'border-orange-500 bg-orange-50';
        }
        return 'border-gray-200 bg-white';
    };

    const filteredOrders = orders.filter(order =>
        order.status === 'pending' || order.status === 'preparing' || order.status === 'ready'
    );

    return (
        <div className="min-h-screen bg-gray-900 text-white p-4">
            <div className="max-w-7xl mx-auto">
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-3xl font-bold">Sistema de Cocina - KDS</h1>
                        <div className="flex items-center gap-4">
                            <Badge variant="outline" className="text-lg px-4 py-2 text-white border-white">
                                <Clock className="w-5 h-5 mr-2" />
                                {currentTime.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                            </Badge>
                            <Badge variant="secondary" className="text-lg px-4 py-2">
                                Cocinero: {user ? user.username: 'Cargando...'}
                            </Badge>
                            <Badge variant="secondary" className="text-lg px-4 py-2">
                                {filteredOrders.length} Pedidos Activos
                            </Badge>
                        </div>
                    </div>

                    <div className="flex gap-4 flex-wrap">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                            <span className="text-sm text-gray-300">Pendiente</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            <span className="text-sm text-gray-300">En Preparación</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span className="text-sm text-gray-300">Listo</span>
                        </div>
                    </div>
                </div>

                {loadingOrders && <p className="text-center py-8 text-gray-400">Cargando pedidos...</p>}
                {errorOrders && <p className="text-center py-8 text-red-400">{errorOrders}</p>}

                {!loadingOrders && !errorOrders && filteredOrders.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-gray-400 text-xl mb-2">
                            No hay pedidos pendientes
                        </div>
                        <div className="text-gray-500">
                            Los nuevos pedidos aparecerán aquí automáticamente
                        </div>
                    </div>
                )}

                {!loadingOrders && !errorOrders && filteredOrders.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filteredOrders.map((order) => {
                            const elapsedTime = getElapsedTime(order.created_at);
                            const StatusIcon = getStatusIcon(order.status);

                            return (
                                <Card key={order.id} className={`${getPriorityColor(order.priority, elapsedTime, order.estimated_time || 15)} border-2 transition-all`}>
                                    <CardHeader className="pb-3">
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="text-xl font-bold text-gray-900">
                                                #{order.order_number || order.id}
                                            </CardTitle>
                                            <div className="flex items-center gap-2">
                                                {order.priority === 'urgent' && (
                                                    <Badge variant="destructive" className="text-xs">
                                                        URGENTE
                                                    </Badge>
                                                )}
                                                <Badge className={`${getStatusColor(order.status)} text-white text-xs`}>
                                                    <StatusIcon className="w-3 h-3 mr-1" />
                                                    {order.status === 'pending' && 'Pendiente'}
                                                    {order.status === 'preparing' && 'Preparando'}
                                                    {order.status === 'ready' && 'Listo'}
                                                    {order.status === 'delivered' && 'Entregado'}
                                                    {order.status === 'cancelled' && 'Cancelado'}
                                                </Badge>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between text-sm text-gray-600">
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-4 h-4" />
                                                {elapsedTime}min / {order.estimated_time || 15}min
                                            </span>
                                            <span>
                                                {new Date(order.created_at).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="space-y-3">
                                        <div className="space-y-2">
                                            {order.items.map((item) => (
                                                <div key={item.id} className="bg-gray-50 p-2 rounded">
                                                    <div className="flex justify-between items-start">
                                                        <span className="font-medium text-gray-900">
                                                            {item.quantity}x {item.product_name}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {order.notes && (
                                            <>
                                                <Separator />
                                                <div className="text-sm text-gray-600">
                                                    <strong>Notas:</strong> {order.notes}
                                                </div>
                                            </>
                                        )}

                                        <Separator />

                                        <div className="space-y-2">
                                            {order.status === 'pending' && (
                                                <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => updateOrderStatus(order.id, 'preparing')}>
                                                    <PlayCircle className="w-4 h-4 mr-2" />
                                                    Iniciar Preparación
                                                </Button>
                                            )}

                                            {order.status === 'preparing' && (
                                                <Button className="w-full bg-green-600 hover:bg-green-700" onClick={() => updateOrderStatus(order.id, 'ready')}>
                                                    <CheckCircle className="w-4 h-4 mr-2" />
                                                    Marcar como Listo
                                                </Button>
                                            )}

                                            {order.status === 'ready' && (
                                                <div className="space-y-2">
                                                    <Button className="w-full bg-green-600 hover:bg-green-700 animate-pulse" onClick={() => updateOrderStatus(order.id, 'delivered')}>
                                                        <CheckCircle className="w-4 h-4 mr-2" />
                                                        Confirmar Entrega
                                                    </Button>
                                                    <div className="text-center text-sm text-green-600 font-medium">
                                                        🔔 VOCEANDO PEDIDO #{order.order_number || order.id}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default KitchenDisplay;
