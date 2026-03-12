"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
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
import {
  Users,
  Activity,
  Shield,
  TrendingUp,
  Calendar,
  Clock,
  LucideIcon,
} from "lucide-react";
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
  { name: "Activas", value: 240, color: "var(--color-chart-1)" },
  { name: "Inactivas", value: 120, color: "var(--color-chart-3)" },
  { name: "Expiradas", value: 40, color: "var(--color-chart-5)" },
];

const COLORS = [
  "var(--color-chart-1)",
  "var(--color-chart-3)",
  "var(--color-chart-5)",
];

type StatCardProps = {
  title: string;
  value: number | string;
  change?: string;
  icon: LucideIcon;
  link: string;
  cardTone?: string;
};

export function AdminDashboard() {
  const [stats] = useState({
    totalUsers: 245,
    activeUsers: 180,
    activeSessions: 240,
    securityEvents: 12,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0, y: 12 },
    show: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.08, delayChildren: 0.05 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  const StatCard = ({
    title,
    value,
    change,
    icon: Icon,
    link,
    cardTone,
  }: StatCardProps) => (
    <motion.div variants={itemVariants}>
      <Link href={link}>
        <Card
          className={`overflow-hidden cursor-pointer group relative transition-all duration-200 hover:-translate-y-0.5 border border-border/70 bg-card ${cardTone ?? ""} p-6`}
        >
          <div className="flex items-start justify-between relative z-10">
            <div className="flex-1">
              <p className="mb-2 text-sm font-medium text-foreground/70">
                {title}
              </p>
              <h3 className="mb-1 text-3xl font-bold text-foreground">
                {value}
              </h3>
              {change && (
                <p className="text-xs font-medium text-muted-foreground">
                  {change}
                </p>
              )}
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-md border border-border bg-muted">
              <Icon className="h-6 w-6 text-foreground/80" />
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );

  return (
    <motion.div
      className="min-h-screen space-y-8 p-4 md:p-8"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* Header */}
      <motion.div className="space-y-2" variants={itemVariants}>
        <h1 className="text-4xl font-bold text-foreground">
          Panel de Control
        </h1>
        <p className="text-foreground/60">
          Bienvenido al panel de administración
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4"
        variants={itemVariants}
      >
        <StatCard
          title="Total de Usuarios"
          value={stats.totalUsers}
          change="+12% este mes"
          icon={Users}
          link="/admin/users"
        />
        <StatCard
          title="Usuarios Activos"
          value={stats.activeUsers}
          change="+8% últimas 24h"
          icon={Activity}
          link="/admin/users"
        />
        <StatCard
          title="Sesiones Activas"
          value={stats.activeSessions}
          change="+5% hoy"
          icon={Shield}
          link="/admin/sessions"
        />
        <StatCard
          title="Eventos Seguridad"
          value={stats.securityEvents}
          change="-3% últimos 7 días"
          icon={TrendingUp}
          link="/admin/sessions"
        />
      </motion.div>

      {/* Charts Grid */}
      <motion.div
        className="grid grid-cols-1 gap-6 lg:grid-cols-3"
        variants={itemVariants}
      >
        {/* Activity Chart */}
        <Card className="bg-card/50 p-6 backdrop-blur-sm transition-colors hover:border-border border-border/50 lg:col-span-2">
          <div className="mb-6">
            <h2 className="mb-1 text-lg font-semibold text-foreground">
              Actividad de Usuarios
            </h2>
            <p className="text-sm text-foreground/60">Últimos 7 días</p>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={userActivityData}>
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
                stroke="var(--color-chart-1)"
                strokeWidth={2}
                dot={false}
                name="Total Usuarios"
                isAnimationActive={!loading}
              />
              <Line
                type="monotone"
                dataKey="activos"
                stroke="var(--color-chart-3)"
                strokeWidth={2}
                dot={false}
                name="Usuarios Activos"
                isAnimationActive={!loading}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Session Distribution */}
        <Card className="flex flex-col border-border/50 bg-card/50 p-6 backdrop-blur-sm transition-colors hover:border-border">
          <div className="mb-6">
            <h2 className="mb-1 text-lg font-semibold text-foreground">
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
              <div
                key={item.name}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-foreground/70">
                    {item.name}
                  </span>
                </div>
                <span className="text-sm font-semibold text-foreground">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Quick Sections */}
      <motion.div
        className="grid grid-cols-1 gap-6 md:grid-cols-2"
        variants={itemVariants}
      >
        {/* Recent Activity */}
        <Card className="border-border/50 bg-card/50 p-6 backdrop-blur-sm transition-colors hover:border-border">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">
              Actividad Reciente
            </h2>
            <Clock className="h-5 w-5 text-foreground/40" />
          </div>

          <div className="space-y-4">
            {[
              {
                action: "Usuario registrado",
                time: "Hace 2 horas",
                user: "Juan Pérez",
              },
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
              <div
                key={idx}
                className="flex items-start gap-3 border-b border-border/20 pb-3 last:border-b-0"
              >
                <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-foreground/50" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground">
                    {item.action}
                  </p>
                  <p className="mt-1 text-xs text-foreground/60">{item.user}</p>
                </div>
                <span className="flex-shrink-0 text-xs text-foreground/40">
                  {item.time}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Stats */}
        <Card className="border-border/50 bg-card/50 p-6 backdrop-blur-sm transition-colors hover:border-border">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">
              Estadísticas Rápidas
            </h2>
            <Calendar className="h-5 w-5 text-foreground/40" />
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
              <div
                key={idx}
                className="flex items-center justify-between rounded-lg bg-background/50 p-3 transition-colors hover:bg-background/80"
              >
                <div>
                  <p className="text-sm text-foreground/70">{stat.label}</p>
                  <p className="mt-1 text-lg font-semibold text-foreground">
                    {stat.value}
                  </p>
                </div>
                <span
                  className={`text-sm font-semibold ${
                    stat.positive
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  {stat.change}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}