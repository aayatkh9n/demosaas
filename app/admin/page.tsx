'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getOrders } from '@/lib/data/adminData';
import { formatCurrency } from '@/lib/utils';
import { Order } from '@/types';
import { FiPackage, FiSettings, FiList } from 'react-icons/fi';

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

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

  const loadOrders = async () => {
    setLoading(true);

    const allOrders = await getOrders();
    setOrders(allOrders);

    setStats({
      new: allOrders.filter(o => o.status === 'new').length,
      accepted: allOrders.filter(o => o.status === 'accepted').length,
      preparing: allOrders.filter(o => o.status === 'preparing').length,
      completed: allOrders.filter(o => o.status === 'completed').length,
      totalRevenue: allOrders
        .filter(o => o.status === 'completed')
        .reduce((sum, o) => sum + o.total, 0),
    });

    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading dashboard…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <Stat label="New Orders" value={stats.new} color="text-blue-600" />
          <Stat label="Accepted" value={stats.accepted} color="text-yellow-600" />
          <Stat label="Preparing" value={stats.preparing} color="text-orange-600" />
          <Stat label="Completed" value={stats.completed} color="text-green-600" />
          <Stat
            label="Total Revenue"
            value={formatCurrency(stats.totalRevenue)}
            color="text-gray-800"
          />
        </div>

        {/* QUICK ACTIONS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <DashboardLink
            href="/admin/menu"
            icon={<FiList />}
            title="Manage Menu"
            subtitle="Add, edit or disable items"
          />
          <DashboardLink
            href="/admin/settings"
            icon={<FiSettings />}
            title="Settings"
            subtitle="QR code & WhatsApp"
          />
          <DashboardLink
            href="/admin/orders"
            icon={<FiPackage />}
            title="All Orders"
            subtitle="View and manage orders"
          />
        </div>

        {/* RECENT ORDERS */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">Recent Orders</h2>

          {orders.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No orders yet</p>
          ) : (
            <div className="space-y-4">
              {orders.slice(0, 5).map(order => (
                <div
                  key={order.id}
                  className="border border-gray-200 rounded-lg p-4 flex justify-between"
                >
                  <div>
                    <div className="font-semibold">
                      Order #{order.id.slice(-6)}
                    </div>
                    <div className="text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">
                      {order.items.length} items • {order.orderType} • {order.paymentMethod}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">
                      {formatCurrency(order.total)}
                    </div>
                    <div className="text-sm capitalize text-gray-600">
                      {order.status}
                    </div>
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

/* ------------------ SMALL COMPONENTS ------------------ */

function Stat({
  label,
  value,
  color,
}: {
  label: string;
  value: number | string;
  color: string;
}) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className={`text-3xl font-bold ${color}`}>{value}</div>
      <div className="text-gray-600">{label}</div>
    </div>
  );
}

function DashboardLink({
  href,
  icon,
  title,
  subtitle,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <Link
      href={href}
      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition flex items-center gap-4"
    >
      <div className="text-3xl text-gray-800">{icon}</div>
      <div>
        <h3 className="font-bold text-lg">{title}</h3>
        <p className="text-gray-600 text-sm">{subtitle}</p>
      </div>
    </Link>
  );
}
