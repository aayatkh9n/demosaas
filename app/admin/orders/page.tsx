'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchAllOrders, updateOrderStatus } from '@/lib/data/adminOrderService';
import { formatCurrency } from '@/lib/utils';
import { Order, OrderStatus } from '@/types';

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    const data = await fetchAllOrders();
    setOrders(data);
    setLoading(false);
  };

  const handleStatusUpdate = async (
    orderId: string,
    status: OrderStatus
  ) => {
    await updateOrderStatus(orderId, status);
    loadOrders();
  };

  const stats = {
    new: orders.filter(o => o.status === 'new').length,
    accepted: orders.filter(o => o.status === 'accepted').length,
    preparing: orders.filter(o => o.status === 'preparing').length,
    completed: orders.filter(o => o.status === 'completed').length,
    totalRevenue: orders
      .filter(o => o.status === 'completed')
      .reduce((sum, o) => sum + o.total, 0),
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <Stat label="New Orders" value={stats.new} />
          <Stat label="Accepted" value={stats.accepted} />
          <Stat label="Preparing" value={stats.preparing} />
          <Stat label="Completed" value={stats.completed} />
          <Stat
            label="Total Revenue"
            value={formatCurrency(stats.totalRevenue)}
          />
        </div>

        {/* QUICK LINKS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <DashboardLink
            href="/admin/menu"
            title="Manage Menu"
            desc="Add, edit, or remove items"
          />
          <DashboardLink
            href="/admin/settings"
            title="Settings"
            desc="Configure QR code & WhatsApp"
          />
          <DashboardLink
            href="/admin/orders"
            title="All Orders"
            desc="View and manage orders"
          />
        </div>

        {/* RECENT ORDERS */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Recent Orders</h2>

          {loading ? (
            <p className="text-gray-500">Loading orders…</p>
          ) : orders.length === 0 ? (
            <p className="text-gray-500">No orders yet</p>
          ) : (
            <div className="space-y-4">
              {orders.slice(0, 5).map(order => (
                <div
                  key={order.id}
                  className="border rounded-lg p-4 flex justify-between items-start"
                >
                  <div>
                    <div className="font-semibold">
                      Order #{order.id.slice(-6)}
                    </div>
                    <div className="text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">
                      {order.items.length} items •{' '}
                      {order.orderType} • {order.paymentMethod}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-bold text-lg">
                      {formatCurrency(order.total)}
                    </div>
                    <select
                      value={order.status}
                      onChange={e =>
                        handleStatusUpdate(
                          order.id,
                          e.target.value as OrderStatus
                        )
                      }
                      className="mt-2 border rounded px-3 py-1"
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
    </div>
  );
}

function Stat({ label, value }: { label: string; value: any }) {
  return (
    <div className="bg-white rounded-lg shadow p-6 text-center">
      <div className="text-3xl font-bold">{value}</div>
      <div className="text-gray-600">{label}</div>
    </div>
  );
}

function DashboardLink({
  href,
  title,
  desc,
}: {
  href: string;
  title: string;
  desc: string;
}) {
  return (
    <Link
      href={href}
      className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition"
    >
      <h3 className="font-bold text-lg">{title}</h3>
      <p className="text-gray-600 text-sm">{desc}</p>
    </Link>
  );
}
