# Guía de Diseño Monocromático del Sistema (Estilo shadcn/ui)

## Objetivo

Establecer un rediseño **minimalista, elegante y coherente** para todo el sistema usando una paleta en **blanco y negro** (escala de grises), priorizando legibilidad, usabilidad y consistencia visual.

---

## 1) Paleta de color (monocromática)

### Tokens base

- `background`: fondo principal (blanco en light, casi negro en dark)
- `foreground`: texto principal (casi negro en light, casi blanco en dark)
- `card`, `popover`: superficies elevadas, muy cercanas al fondo
- `muted`: bloques sutiles para estados secundarios
- `border`, `input`, `ring`: contornos y foco
- `chart-1..5`: escala de grises para visualizaciones

### Principios de uso

- Evitar colores saturados para estados visuales decorativos.
- Usar contraste y jerarquía tipográfica para comunicar prioridad.
- Reservar `destructive` en una variante gris profunda para no romper el esquema.

---

## 2) Tipografía

### Jerarquía recomendada

- **H1**: 32–36px, semibold/bold
- **H2**: 22–28px, semibold
- **H3 / Sección**: 18–20px, semibold
- **Body**: 14–16px, regular
- **Caption / Meta**: 12–13px, medium

### Reglas de lectura

- Longitud de línea óptima: 60–80 caracteres.
- Contraste mínimo AA para texto normal.
- Mantener `muted-foreground` solo en metadatos y ayudas, no en contenido crítico.

---

## 3) Componentes (criterio visual)

### Cards y paneles

- Fondo sólido neutro (`bg-card`).
- Borde fino (`border-border/70`).
- Sombras discretas o nulas; priorizar separación por espaciado.

### Botones

- Primario: alto contraste (`bg-primary` + `text-primary-foreground`).
- Secundario/outline: neutros (`bg-secondary`, `border-border`).
- Evitar gradientes y glows de color.

### Sidebar

- Fondo plano (`bg-sidebar`).
- Estado activo con `bg-sidebar-accent`.
- Íconos en tonos del `foreground` con opacidad.

### Badges y estados

- Reemplazar semáforos de color por variantes neutras:
  - Default: `bg-muted`
  - Secondary: `bg-secondary`
  - Destructive: `bg-destructive`
- Apoyar el estado con texto e ícono, no solo color.

### Gráficas

- Solo escala de grises (`chart-1..5`).
- Grid y ejes con opacidad baja para reducir ruido visual.
- Tooltips con borde y fondo neutro.

---

## 4) Espaciado y layout

### Sistema de espaciado

- Base 4px (4/8/12/16/24/32).
- Secciones verticales: 24–32px.
- Entre título y descripción: 6–10px.
- Entre controles relacionados: 12–16px.

### Densidad visual

- Reducir ornamentos (gradientes, brillos, blur intenso).
- Maximizar aire visual para mejorar escaneo rápido.
- Consistencia de radios: usar `--radius` y derivados.

---

## 5) Accesibilidad y UX

- Foco visible con `ring` en todos los controles interactivos.
- Estados hover/active por contraste y ligera elevación de movimiento.
- Texto siempre legible en modo claro/oscuro.
- Evitar que la información dependa exclusivamente del color.

---

## 6) Implementación aplicada en el sistema

### Cambios clave realizados

1. **Tema global** actualizado a tokens monocromáticos (light/dark) en `globals.css`.
2. **Dashboard admin** simplificado eliminando gradientes de color y usando escala de grises en gráficas y tarjetas.
3. **Sidebar admin** alineado a apariencia plana y sobria.
4. **Pantallas de usuarios y configuración** con iconografía y bloques neutros.
5. **Badges de tabla de usuarios** convertidos a variantes monocromáticas.

---

## 7) Checklist de coherencia visual

- [ ] ¿Todos los módulos usan tokens globales (`background`, `foreground`, etc.)?
- [ ] ¿Se eliminaron gradientes/cromas no esenciales?
- [ ] ¿La jerarquía tipográfica es consistente?
- [ ] ¿El espaciado sigue una escala uniforme?
- [ ] ¿Los estados interactivos se perciben con claridad?

---

Este documento actúa como base de diseño para mantener una experiencia de usuario limpia, sobria y eficiente en todo el sistema.
