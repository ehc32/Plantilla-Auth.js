"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Users, Activity, Shield, TrendingUp, Calendar, Clock } from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/card";

// Datos simulados para los gráficos
const userActivityData = [
  { date: "Lun", usuarios: 120, activos: 80 },
  { date: "Mar", usuarios: 150, activos: 95 },
  { date: "Mié", usuarios: 180, activos: 110 },
  { date: "Jue", usuarios: 160, activos: 100 },
  { date: "Vie", usuarios: 200, activos: 140 },
  { date: "Sab", usuarios: 190, activos: 130 },
  { date: "Dom", usuarios: 210, activos: 150 },
];

const sessionData = [
  { name: "Activas", value: 240, color: "#06b6d4" },
  { name: "Inactivas", value: 120, color: "#64748b" },
  { name: "Expiradas", value: 40, color: "#ef4444" },
];

const COLORS = ["#06b6d4", "#64748b", "#ef4444"];

export function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 245,
    activeUsers: 180,
    activeSessions: 240,
    securityEvents: 12,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Simular carga de datos
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const StatCard = ({
    title,
    value,
    change,
    icon: Icon,
    link,
    bgGradient,
  }: {
    title: string;
    value: number | string;
    change?: string;
    icon: any;
    link: string;
    bgGradient: string;
  }) => (
    <Link href={link}>
      <Card className={`${bgGradient} border-0 overflow-hidden cursor-pointer group relative transition-all duration-300 hover:shadow-lg hover:scale-105 p-6`}>
        <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-300" />
        <div className="flex items-start justify-between relative z-10">
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground/70 mb-2">{title}</p>
            <h3 className="text-3xl font-bold text-foreground mb-1">{value}</h3>
            {change && (
              <p className="text-xs text-emerald-500 font-semibold">{change}</p>
            )}
          </div>
          <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-white/10 backdrop-blur-sm">
            <Icon className="w-6 h-6 text-foreground/80" />
          </div>
        </div>
      </Card>
    </Link>
  );

  return (
    <div className="min-h-screen p-4 md:p-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-foreground">Panel de Control</h1>
        <p className="text-foreground/60">Bienvenido al panel de administración</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total de Usuarios"
          value={stats.totalUsers}
          change="+12% este mes"
          icon={Users}
          link="/admin/users"
          bgGradient="bg-gradient-to-br from-blue-500/10 to-cyan-500/5"
        />
        <StatCard
          title="Usuarios Activos"
          value={stats.activeUsers}
          change="+8% últimas 24h"
          icon={Activity}
          link="/admin/users"
          bgGradient="bg-gradient-to-br from-emerald-500/10 to-teal-500/5"
        />
        <StatCard
          title="Sesiones Activas"
          value={stats.activeSessions}
          change="+5% hoy"
          icon={Shield}
          link="/admin/sessions"
          bgGradient="bg-gradient-to-br from-purple-500/10 to-pink-500/5"
        />
        <StatCard
          title="Eventos Seguridad"
          value={stats.securityEvents}
          change="-3% últimos 7 días"
          icon={TrendingUp}
          link="/admin/sessions"
          bgGradient="bg-gradient-to-br from-orange-500/10 to-red-500/5"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Chart */}
        <Card className="lg:col-span-2 p-6 border-border/50 bg-card/50 backdrop-blur-sm hover:border-border transition-colors">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-foreground mb-1">
              Actividad de Usuarios
            </h2>
            <p className="text-sm text-foreground/60">Últimos 7 días</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={userActivityData}>
              <defs>
                <linearGradient id="colorUsuarios" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorActivos" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--color-border)"
                opacity={0.2}
              />
              <XAxis
                dataKey="date"
                stroke="var(--color-foreground)"
                opacity={0.5}
                style={{ fontSize: "12px" }}
              />
              <YAxis
                stroke="var(--color-foreground)"
                opacity={0.5}
                style={{ fontSize: "12px" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                }}
                cursor={{ stroke: "var(--color-border)" }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="usuarios"
                stroke="#06b6d4"
                strokeWidth={2}
                dot={false}
                name="Total Usuarios"
                isAnimationActive={!loading}
              />
              <Line
                type="monotone"
                dataKey="activos"
                stroke="#10b981"
                strokeWidth={2}
                dot={false}
                name="Usuarios Activos"
                isAnimationActive={!loading}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Session Distribution */}
        <Card className="p-6 border-border/50 bg-card/50 backdrop-blur-sm hover:border-border transition-colors flex flex-col">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-foreground mb-1">
              Distribución de Sesiones
            </h2>
            <p className="text-sm text-foreground/60">Estado actual</p>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={sessionData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {sessionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "8px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-6 space-y-3">
            {sessionData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-foreground/70">{item.name}</span>
                </div>
                <span className="text-sm font-semibold text-foreground">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card className="p-6 border-border/50 bg-card/50 backdrop-blur-sm hover:border-border transition-colors">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-foreground">
              Actividad Reciente
            </h2>
            <Clock className="w-5 h-5 text-foreground/40" />
          </div>
          <div className="space-y-4">
            {[
              { action: "Usuario registrado", time: "Hace 2 horas", user: "Juan Pérez" },
              {
                action: "Sesión expirada",
                time: "Hace 4 horas",
                user: "María García",
              },
              {
                action: "Contraseña actualizada",
                time: "Hace 6 horas",
                user: "Carlos López",
              },
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-3 pb-3 border-b border-border/20 last:border-b-0">
                <div className="w-2 h-2 rounded-full bg-cyan-500 mt-2 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{item.action}</p>
                  <p className="text-xs text-foreground/60 mt-1">{item.user}</p>
                </div>
                <span className="text-xs text-foreground/40 flex-shrink-0">{item.time}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Stats */}
        <Card className="p-6 border-border/50 bg-card/50 backdrop-blur-sm hover:border-border transition-colors">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-foreground">
              Estadísticas Rápidas
            </h2>
            <Calendar className="w-5 h-5 text-foreground/40" />
          </div>
          <div className="space-y-4">
            {[
              {
                label: "Tasa de Actividad",
                value: "73.5%",
                change: "+2.3%",
                positive: true,
              },
              {
                label: "Nuevos Usuarios",
                value: "28",
                change: "+12%",
                positive: true,
              },
              {
                label: "Errores Detectados",
                value: "3",
                change: "-1",
                positive: true,
              },
            ].map((stat, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-background/50 hover:bg-background/80 transition-colors">
                <div>
                  <p className="text-sm text-foreground/70">{stat.label}</p>
                  <p className="text-lg font-semibold text-foreground mt-1">
                    {stat.value}
                  </p>
                </div>
                <span
                  className={`text-sm font-semibold ${
                    stat.positive ? "text-emerald-500" : "text-orange-500"
                  }`}
                >
                  {stat.change}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
