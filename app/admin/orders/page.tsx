'use client';

import { useState, useEffect } from 'react';
import { getOrders, updateOrderStatus } from '@/lib/data/adminData';
import { formatCurrency } from '@/lib/utils';
import { Order, OrderStatus } from '@/types';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<OrderStatus | 'all'>('all');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = () => {
    setOrders(getOrders().reverse()); // Most recent first
  };

  const handleStatusUpdate = (orderId: string, newStatus: OrderStatus) => {
    updateOrderStatus(orderId, newStatus);
    loadOrders();
  };

  const filteredOrders = filter === 'all'
    ? orders
    : orders.filter(o => o.status === filter);

  const statusColors = {
    new: 'bg-blue-100 text-blue-800 border-blue-200',
    accepted: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    preparing: 'bg-orange-100 text-orange-800 border-orange-200',
    completed: 'bg-green-100 text-green-800 border-green-200',
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">All Orders</h1>

          {/* Filter */}
          <div className="flex gap-2 mb-6 flex-wrap">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                filter === 'all'
                  ? 'bg-gray-800 text-white'
                  : 'bg-white text-gray-800 hover:bg-gray-100'
              }`}
            >
              All
            </button>
            {(['new', 'accepted', 'preparing', 'completed'] as OrderStatus[]).map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors capitalize ${
                  filter === status
                    ? 'bg-gray-800 text-white'
                    : 'bg-white text-gray-800 hover:bg-gray-100'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Orders List */}
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <p className="text-gray-500 text-lg">No orders found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map(order => (
                <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
                    <div className="mb-4 md:mb-0">
                      <div className="flex items-center gap-4 mb-2">
                        <h3 className="text-xl font-bold">Order #{order.id.slice(-8)}</h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${statusColors[order.status]}`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <div>Created: {new Date(order.createdAt).toLocaleString()}</div>
                        <div>Updated: {new Date(order.updatedAt).toLocaleString()}</div>
                        {order.customerName && <div>Customer: {order.customerName}</div>}
                        {order.customerPhone && <div>Phone: {order.customerPhone}</div>}
                        {order.customerAddress && <div>Address: {order.customerAddress}</div>}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold mb-2">{formatCurrency(order.total)}</div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <div className="capitalize">{order.orderType}</div>
                        <div>{order.paymentMethod}</div>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="border-t border-gray-200 pt-4 mb-4">
                    <h4 className="font-semibold mb-2">Items:</h4>
                    <div className="space-y-2">
                      {order.items.map(item => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span>
                            {item.name} × {item.quantity}
                          </span>
                          <span className="font-semibold">
                            {formatCurrency(item.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Status Update */}
                  <div className="border-t border-gray-200 pt-4">
                    <label className="block text-sm font-medium mb-2">Update Status:</label>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusUpdate(order.id, e.target.value as OrderStatus)}
                      className="px-4 py-2 border border-gray-300 rounded-lg font-semibold"
                    >
                      <option value="new">New</option>
                      <option value="accepted">Accepted</option>
                      <option value="preparing">Preparing</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    
  );
}

