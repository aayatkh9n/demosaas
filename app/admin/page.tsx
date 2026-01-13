'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getAdminSettings, getOrders, updateOrderStatus } from '@/lib/data/adminData';
import { formatCurrency } from '@/lib/utils';
import { Order, OrderStatus } from '@/types';
import { FiPackage, FiSettings, FiList, FiEdit } from 'react-icons/fi';

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState({
    new: 0,
    accepted: 0,
    preparing: 0,
    completed: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = () => {
    const allOrders = getOrders();
    setOrders(allOrders);
    
    const newStats = {
      new: allOrders.filter(o => o.status === 'new').length,
      accepted: allOrders.filter(o => o.status === 'accepted').length,
      preparing: allOrders.filter(o => o.status === 'preparing').length,
      completed: allOrders.filter(o => o.status === 'completed').length,
      totalRevenue: allOrders
        .filter(o => o.status === 'completed')
        .reduce((sum, o) => sum + o.total, 0),
    };
    setStats(newStats);
  };

  const handleStatusUpdate = (orderId: string, newStatus: OrderStatus) => {
    updateOrderStatus(orderId, newStatus);
    loadOrders();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-3xl font-bold text-blue-600">{stats.new}</div>
              <div className="text-gray-600">New Orders</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-3xl font-bold text-yellow-600">{stats.accepted}</div>
              <div className="text-gray-600">Accepted</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-3xl font-bold text-orange-600">{stats.preparing}</div>
              <div className="text-gray-600">Preparing</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-3xl font-bold text-green-600">{stats.completed}</div>
              <div className="text-gray-600">Completed</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-2xl font-bold text-gray-800">{formatCurrency(stats.totalRevenue)}</div>
              <div className="text-gray-600">Total Revenue</div>
            </div>
          </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Link
              href="/admin/menu"
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow flex items-center gap-4"
            >
              <FiList className="text-3xl text-gray-800" />
              <div>
                <h3 className="font-bold text-lg">Manage Menu</h3>
                <p className="text-gray-600 text-sm">Add, edit, or remove items</p>
              </div>
            </Link>
            <Link
              href="/admin/settings"
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow flex items-center gap-4"
            >
              <FiSettings className="text-3xl text-gray-800" />
              <div>
                <h3 className="font-bold text-lg">Settings</h3>
                <p className="text-gray-600 text-sm">Configure QR code, WhatsApp</p>
              </div>
            </Link>
            <Link
              href="/admin/orders"
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow flex items-center gap-4"
            >
              <FiPackage className="text-3xl text-gray-800" />
              <div>
                <h3 className="font-bold text-lg">All Orders</h3>
                <p className="text-gray-600 text-sm">View and manage orders</p>
              </div>
            </Link>
          </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">Recent Orders</h2>
            {orders.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No orders yet</p>
            ) : (
              <div className="space-y-4">
                {orders.slice(0, 5).map(order => (
                  <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-semibold">Order #{order.id.slice(-6)}</div>
                        <div className="text-sm text-gray-600">
                          {new Date(order.createdAt).toLocaleString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg">{formatCurrency(order.total)}</div>
                        <div className={`text-xs px-2 py-1 rounded-full inline-block mt-1 ${
                          order.status === 'new' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'accepted' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'preparing' ? 'bg-orange-100 text-orange-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {order.status}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 mb-3">
                      {order.items.length} items • {order.orderType} • {order.paymentMethod}
                    </div>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusUpdate(order.id, e.target.value as OrderStatus)}
                      className="text-sm border border-gray-300 rounded px-3 py-1"
                    >
                      <option value="new">New</option>
                      <option value="accepted">Accepted</option>
                      <option value="preparing">Preparing</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                ))}
              </div>
          )}
        </div>
      </div>
    </div>
  );
}

