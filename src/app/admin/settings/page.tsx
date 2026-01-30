"use client";

import { useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
    Settings,
    Shield,
    Database,
    Mail,
    Globe,
    Lock,
    Save
} from "lucide-react";
import { toast } from "sonner";

export default function AdminSettingsPage() {
    const [loading, setLoading] = useState(false);

    const handleSave = () => {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            toast.success("Settings saved successfully");
        }, 1000);
    };

    return (
        <div className="flex-1 overflow-auto bg-gradient-to-b from-background to-background/95">
            <div className="space-y-6 p-4 md:p-8">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold tracking-tight">Configuración</h1>
                    <p className="text-foreground/60">
                        Gestiona parámetros del sistema, credenciales y configuración global
                    </p>
                </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* System Parameters Column */}
                <div className="space-y-6">
                    <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:border-border transition-colors">
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <div className="p-2 rounded-lg bg-blue-500/10">
                                    <Globe className="h-5 w-5 text-blue-500" />
                                </div>
                                <div>
                                    <CardTitle>Parámetros del Sistema</CardTitle>
                                    <CardDescription>
                                        Configuración general de la aplicación
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Nombre de la Aplicación</Label>
                                <Input id="app-name" defaultValue="Zexa Better Auth Starter" />
                            </div>
                            <div className="space-y-2">
                                <Label>Correo de Soporte</Label>
                                <Input id="support-email" type="email" defaultValue="help@zexa.app" />
                            </div>
                            <div className="flex items-center justify-between rounded-lg border border-border/50 bg-background/50 p-4">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Modo de Mantenimiento</Label>
                                    <p className="text-sm text-foreground/60">
                                        Desactiva acceso para usuarios no administradores
                                    </p>
                                </div>
                                <Switch />
                            </div>
                            <div className="flex items-center justify-between rounded-lg border border-border/50 bg-background/50 p-4">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Registro Público</Label>
                                    <p className="text-sm text-foreground/60">
                                        Permite que nuevos usuarios se registren
                                    </p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:border-border transition-colors">
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <div className="p-2 rounded-lg bg-purple-500/10">
                                    <Database className="h-5 w-5 text-purple-500" />
                                </div>
                                <div>
                                    <CardTitle>Base de Datos y Almacenamiento</CardTitle>
                                    <CardDescription>
                                        Configuración de persistencia (Solo lectura)
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Proveedor de Base de Datos</Label>
                                <Input value="PostgreSQL" disabled readOnly className="bg-background/50 border-border/50" />
                            </div>
                            <div className="space-y-2">
                                <Label>Versión ORM</Label>
                                <Input value="Drizzle v0.30.0" disabled readOnly className="bg-background/50 border-border/50" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Credentials & Security Column */}
                <div className="space-y-6">
                    <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:border-border transition-colors">
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <div className="p-2 rounded-lg bg-red-500/10">
                                    <Lock className="h-5 w-5 text-red-500" />
                                </div>
                                <div>
                                    <CardTitle>Credenciales e Integraciones</CardTitle>
                                    <CardDescription>
                                        Gestiona claves API y conexiones de servicios externos
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4">
                                <div className="space-y-2">
                                    <Label>ID de Cliente Google</Label>
                                    <div className="flex gap-2">
                                        <Input type="password" value="************************" readOnly />
                                        <Button variant="outline" size="sm">Actualizar</Button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>ID de Cliente GitHub</Label>
                                    <div className="flex gap-2">
                                        <Input type="password" value="************************" readOnly />
                                        <Button variant="outline" size="sm">Actualizar</Button>
                                    </div>
                                </div>
                            </div>
                            <Separator className="my-2 bg-border/20" />
                            <div className="space-y-2">
                                <Label>Clave Secreta de Stripe</Label>
                                <Input type="password" placeholder="sk_live_..." />
                            </div>
                            <div className="space-y-2">
                                <Label>Clave API de OpenAI</Label>
                                <Input type="password" placeholder="sk-..." />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:border-border transition-colors">
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <div className="p-2 rounded-lg bg-orange-500/10">
                                    <Mail className="h-5 w-5 text-orange-500" />
                                </div>
                                <div>
                                    <CardTitle>Configuración SMTP</CardTitle>
                                    <CardDescription>
                                        Configuración del servidor de correo para notificaciones
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Servidor</Label>
                                    <Input placeholder="smtp.resend.com" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Puerto</Label>
                                    <Input placeholder="587" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Usuario</Label>
                                <Input placeholder="resend" />
                            </div>
                            <div className="space-y-2">
                                <Label>Contraseña</Label>
                                <Input type="password" value="re_123456789" />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

                <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-border/20">
                    <Button variant="outline">Cancelar</Button>
                    <Button onClick={handleSave} disabled={loading} className="min-w-[140px]">
                        {loading ? (
                            <>Guardando...</>
                        ) : (
                            <>
                                <Save className="mr-2 h-4 w-4" />
                                Guardar Cambios
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}
