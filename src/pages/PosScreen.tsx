import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Plus, Minus, Search, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const BACKEND_URL = 'http://backend-pos.test/api';

interface MenuItem {
    id: number;
    name: string;
    description: string | null;
    price: number;
    available: boolean;
    category: string;
    created_at: string;
    updated_at: string;
}

interface CartItem extends MenuItem {
    quantity: number;
}

const PosScreen = () => {
    const [selectedCategory, setSelectedCategory] = useState('hamburguesas');
    const [cart, setCart] = useState<CartItem[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    const [products, setProducts] = useState<MenuItem[]>([]);
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [errorProducts, setErrorProducts] = useState<string | null>(null);

    const categories = [
        { id: 'hamburguesas', name: 'Hamburguesas', color: 'bg-red-500' },
        { id: 'pizzas', name: 'Pizzas', color: 'bg-orange-500' },
        { id: 'bebidas', name: 'Bebidas', color: 'bg-blue-500' },
        { id: 'postres', name: 'Postres', color: 'bg-pink-500' },
        { id: 'combos', name: 'Combos', color: 'bg-green-500' },
    ];

   useEffect(() => {
    const fetchProducts = async () => {
        try {
            setLoadingProducts(true);
            setErrorProducts(null);
            const response = await axios.get(`${BACKEND_URL}/products`);
            console.log('Respuesta de API:', response.data);
            setProducts(response.data);
        } catch (err) {
            console.error(err);
            setErrorProducts('No se pudieron cargar los productos. Intenta recargar.');
        } finally {
            setLoadingProducts(false);
        }
    };
    fetchProducts();
}, []);


    const filteredItems = products.filter(item =>
        item.category === selectedCategory &&
        item.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const addToCart = (item: MenuItem) => {
        setCart(prev => {
            const existing = prev.find(ci => ci.id === item.id);
            if (existing) {
                return prev.map(ci =>
                    ci.id === item.id ? { ...ci, quantity: ci.quantity + 1 } : ci
                );
            }
            return [...prev, { ...item, quantity: 1 }];
        });
    };

    const removeFromCart = (itemId: number) => {
        setCart(prev => {
            const existing = prev.find(ci => ci.id === itemId);
            if (existing && existing.quantity > 1) {
                return prev.map(ci =>
                    ci.id === itemId ? { ...ci, quantity: ci.quantity - 1 } : ci
                );
            }
            return prev.filter(ci => ci.id !== itemId);
        });
    };

    const getTotalPrice = () => cart.reduce((total, item) => total + item.price * item.quantity, 0);
    const getTotalItems = () => cart.reduce((total, item) => total + item.quantity, 0);

    const handleCheckout = async (paymentMethod: string) => {
        if (cart.length === 0) {
            alert('El carrito está vacío. Añade productos para realizar un pedido.');
            return;
        }
        try {
            const orderData = {
                total_amount: getTotalPrice(),
                payment_method: paymentMethod,
                items: cart.map(item => ({
                    product_id: item.id,
                    quantity: item.quantity,
                    price_at_order: item.price,
                })),
            };
            const response = await axios.post(`${BACKEND_URL}/orders`, orderData);
            alert('Pedido realizado con éxito!');
            setCart([]);
        } catch (error) {
            console.error(error);
            alert('Hubo un problema al procesar el pedido.');
        }
    };

    const clearCart = () => setCart([]);

    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user || user.role !== 'pos') {
            navigate("/login");
        }
    }, [user, navigate]);

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="max-w-7xl mx-auto">
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-3xl font-bold text-gray-900">Sistema POS - FastFood Mall</h1>
                        <div className="flex items-center gap-4">
                            <Badge variant="outline" className="text-sm">
                                <Clock className="w-4 h-4 mr-1" />
                                {new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                            </Badge>
                            <Badge variant="secondary">Cajero</Badge>
                        </div>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                            placeholder="Buscar productos..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="pl-10 max-w-md"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-12 gap-6">
                    <div className="col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Categorías</CardTitle>
                            </CardHeader>
                            <CardContent className="p-2">
                                <div className="space-y-2">
                                    {categories.map(category => (
                                        <Button
                                            key={category.id}
                                            variant={selectedCategory === category.id ? "default" : "outline"}
                                            className="w-full justify-start h-12"
                                            onClick={() => setSelectedCategory(category.id)}
                                        >
                                            <div className={`w-3 h-3 rounded-full ${category.color} mr-2`}></div>
                                            {category.name}
                                        </Button>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="col-span-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg capitalize">
                                    {categories.find(c => c.id === selectedCategory)?.name}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {loadingProducts && <p className="text-center py-8 text-gray-600">Cargando productos...</p>}
                                {errorProducts && <p className="text-center py-8 text-red-500">{errorProducts}</p>}

                                {!loadingProducts && !errorProducts && products.length > 0 && (
                                    <div className="grid grid-cols-2 gap-4">
                                        {filteredItems.length > 0 ? filteredItems.map(item => (
                                            <Card
                                                key={item.id}
                                                className={`cursor-pointer transition-all hover:shadow-md ${!item.available ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            >
                                                <CardContent className="p-4">
                                                    <div className="aspect-square bg-gray-200 rounded-lg mb-3 flex items-center justify-center">
                                                        <span className="text-gray-500 text-sm">Imagen</span>
                                                    </div>
                                                    <h3 className="font-semibold text-lg mb-2">{item.name}</h3>
                                                    <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xl font-bold text-green-600">${Number(item.price).toFixed(2)}</span>
                                                        <Button
                                                            size="sm"
                                                            onClick={() => addToCart(item)}
                                                            disabled={!item.available}
                                                            className="bg-blue-600 hover:bg-blue-700"
                                                        >
                                                            <Plus className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                    {!item.available && (
                                                        <Badge variant="destructive" className="mt-2">No disponible</Badge>
                                                    )}
                                                </CardContent>
                                            </Card>
                                        )) : (
                                            <p className="text-center py-8 text-gray-500">No se encontraron productos en esta categoría o búsqueda.</p>
                                        )}
                                    </div>
                                )}

                                {!loadingProducts && !errorProducts && products.length === 0 && (
                                    <p className="text-center py-8 text-gray-500">No hay productos disponibles.</p>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    <div className="col-span-4">
                        <Card className="sticky top-4">
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    <span>Pedido Actual</span>
                                    <Badge variant="secondary">{getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'}</Badge>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
                                    {cart.length === 0 ? (
                                        <p className="text-gray-500 text-center py-8">No hay productos en el pedido</p>
                                    ) : (
                                        cart.map(item => (
                                            <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                <div className="flex-1">
                                                    <h4 className="font-medium">{item.name}</h4>
                                                    <p className="text-sm text-gray-600">${Number(item.price).toFixed(2)} c/u</p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Button size="sm" variant="outline" onClick={() => removeFromCart(item.id)}>
                                                        <Minus className="w-3 h-3" />
                                                    </Button>
                                                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                                                    <Button size="sm" variant="outline" onClick={() => addToCart(item)}>
                                                        <Plus className="w-3 h-3" />
                                                    </Button>
                                                </div>
                                                <div className="ml-4 font-semibold">${(item.price * item.quantity).toFixed(2)}</div>
                                            </div>
                                        ))
                                    )}
                                </div>

                                <Separator className="mb-4" />

                                <div className="flex justify-between items-center mb-4 font-semibold text-lg">
                                    <span>Total:</span>
                                    <span>${getTotalPrice().toFixed(2)}</span>
                                </div>

                                <div className="space-y-2">
                                    <Button onClick={() => handleCheckout('efectivo')} className="w-full bg-green-600 hover:bg-green-700">Pagar en Efectivo</Button>
                                    <Button onClick={() => handleCheckout('tarjeta')} className="w-full bg-blue-600 hover:bg-blue-700">Pagar con Tarjeta</Button>
                                    <Button variant="outline" onClick={clearCart} className="w-full">Vaciar Pedido</Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PosScreen;
