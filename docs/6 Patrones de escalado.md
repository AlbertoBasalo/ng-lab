# 6 Patrones de escalado

Reparto de responsabilidades y reutilización de código.

## 6.1 Patrón Container/Presenter

Separación de la lógica de presentación y la lógica de negocio.

> Carpeta routes/home

### 6.1.1 Extraer presentación a un componente simple

`routes/home/activity.component`

### 6.1.2 Refactorizar componente contenedor inteligente

`routes/home/home.page`

## 6.2 Servicios e inyección de dependencias

> Carpeta routes/home

### 6.2.1 Extraer lógica y datos a un servicio fachada

`routes/home/home.service`

### 6.2.2 Inyectar dependencias en el componente contenedor

## 6.3 Principio DRY con código compartido

Reutilización de código en componentes.

> Carpeta shared

### 6.3.1 Componentes reutilizables

`shared/ui/activity-state.component`

### 6.3.2 Servicios y utilidades de datos comunes

`shared/api/activities.service`
`shared/api/signal.functions`

### 6.3.3 Lógica y tipos de dominio

`shared/domain/activity.type`
`shared/domain/booking.type`
`shared/domain/activity.functions`
