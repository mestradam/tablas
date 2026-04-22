# MathKids - Aprende las Tablas de Multiplicar

## Project Overview
- **Project name**: MathKids
- **Type**: Mobile Web App (PWA)
- **Core functionality**: Aplicación gamificada con historia interactiva para que niños de 8-12 años aprendan las tablas de multiplicar de forma divertida y rápido
- **Target users**: Niños de 8 a 12 años

## Historia y Personaje

### Synopsis
**Luna** es una joven explora espacial que viaja por el universo en su nave espacial "Estrella Fugaz". Su misión es recolectar Cristales de Conocimiento repartidos por diferentes planetas para restaurar la Biblioteca Galáctica, que fue destruida por el malvado Olvidón. Cada tabla de multiplicar representa un planeta que Luna debe visitar y dominar para obtener los cristales.

### Personaje Principal: Luna
- **Nombre**: Luna
- **Edad**: 10 años (aparente)
- **Descripción**: Niña espacial con traje brillante violeta, casco con antenas de Comunicaciones, ojos curiosos y sonrisa amable. Siempre llevar su tablet espacial.
- **Personalidad**: Curiosa, valiente, persistente, le gusta ayudar a otros
- **Compañero**: "Chip" - un pequeño robot asistente que la acompaña en la nave

### Estructura de Niveles (Planetas)
Cada nivel es un planeta que Luna debe visitar:

| Nivel | Planeta | Tabla | Historia Descriptiva |
|-------|---------|-------|---------------------|
| 1 | Planeta Arena | Tabla del 1 | Luna llega al primer planeta, un mundo desértico. Chip le explica que aquí tutto es "uno solo" - un cactus, una estrella, una gota de agua. El Cristal del 1 brilla con luz dorada. |
| 2 | Planeta Gemelo | Tabla del 2 | Dos lunas orbitan este planeta. Luna aprende que todo viene en pares. El Cristal del 2 brilla en azul. |
| 3 | Planeta Trébol | Tabla del 3 | Tres hojas tienen los árboles de este planeta verde esmeralda. Luna descubre que todo tiene triple significado. |
| 4 | Planeta Estelar | Tabla del 4 | Las 4 esquina del planeta relucen con estrellas. Luna cuenta esquinas y estrellas. |
| 5 | Planeta Pentagono | Tabla del 5 | Este planeta tiene 5 lados y formas pentagonales. Luna celebra que el 5 siempre termina en 0 o 5. |
| 6 | Planeta Hex | Tabla del 6 | Un planeta con 6 lados y cristales brillante. Luna descubre el patrón del 6. |
| 7 | Planeta Siete | Tabla del 7 | El planeta más misterioso con un arcoíris de 7 colores. Luna busca el patrón del 7. |
| 8 | Planeta Octavo | Tabla del 8 | Ocho tentáculos de una criatura marina gigante rodean este planeta. Luna cuenta de 8 en 8. |
| 9 | Planeta Nova | Tabla del 9 | Este planeta tiene 9 colas de cometa brillante. Luna descubre el truco del 9. |
| 10 | Planeta Doble Sol | Tabla del 10 | Dos soles illuminate este planeta. Luna aprende que es tan fácil como agregar un cero. |
| 11 | Planeta Once | Tabla del 11 | Un planeta especial con números repetidos (11, 22, 33...). Luna masterea el patrón del 11. |
| 12 | Planeta Máximo | Tabla del 12 | El último planeta, el más difícil, con 12 horas en el día. Luna obtiene el Cristal Final y restaura la Biblioteca Galáctica! |

### Sistema de Progresión
- **Desbloqueo**: Cada nivel se desbloquea al completar el anterior (mínimo 70% de precisión)
- **Repetición**: Niveles completados pueden repetirse libremente para practicar
- **Estrellas**: Por cada nivel se pueden ganar 1-3 estrellas según puntuación (70%/85%/100%)
- **Nivel desbloqueado actualmente**: Solo puede avanzar en orden, pero repetir niveles anteriores cuando quiera

## UI/UX Specification

### Layout Structure
- **Navigation**: Bottom tab bar con 4 secciones (Historia, Practicar, Desafíos, Progreso)
- **Header**: Logo + título de la sección actual
- **Content**: Scroll vertical, cards centradas
- **Responsive**: Mobile-first, 320px - 428px width

### Visual Design

#### Color Palette
- **Primary**: `#6C63FF` (violeta brillante)
- **Secondary**: `#FF6B9D` (rosa vibrante)
- **Accent**: `#00D9A5` (verde menta)
- **Warning**: `#FFB347` (naranja)
- **Background**: `#1A1A2E` (azul oscuro)
- **Surface**: `#25253D` (tarjetas)
- **Text Primary**: `#FFFFFF`
- **Text Secondary**: `#A0A0B9`

#### Typography
- **Font Family**: 'Nunito' (Google Fonts) - divertido y legible para niños
- **Headings**: 700 weight, 24-32px
- **Body**: 400/600 weight, 16-18px
- **Numbers**: 700 weight, 48px (en tarjetas de tablas)

#### Spacing
- **Base unit**: 8px
- **Card padding**: 16px
- **Section gap**: 24px

#### Visual Effects
- **Cards**: border-radius 16px, box-shadow sutil
- **Buttons**: border-radius 12px, scale(1.05) on hover
- **Animations**: pulse, bounce, slide-up (0.3s ease)
- **Correct answer**: confeti + sonido
- **Wrong answer**: shake animation

### Components

#### 1. HistoriaScreen (Historia/Niveles)
- Mapa estelar visual con planetas en círculo
- Personaje Luna en el centro
- Planetas desbloqueados brillan, bloqueados están oscurecidos
- Tap en planeta para entrar al nivel
- Cada planeta muestra: nombre, tabla, estado (bloqueado/desbloqueado/completado con estrellas)
- Animación de "viaje espacial" al seleccionar planeta

#### 2. TablaCard (Aprender)
- Card cuadrada con número grande
- Muestra ejemplo: "7 × 3 = 21"
- Color de fondo según número (gradiente)
- Tap para escuchar la multiplicación

#### 3. QuizCard (Practicar)
- Muestra operación: "8 × 6 = ?"
- 4 opciones de respuesta como botones
- Feedback visual (verde/rojo) inmediato
- Progress bar

#### 4. DesafioCard (Desafíos)
- Cronómetro counting down
- Nivel de dificultad (fácil/medio/difícil)
- Puntos acumulados
- Racha de aciertos

#### 5. ProgresoPanel (Progreso)
- Gráfico de barras (últimos 7 días)
- Tablas dominadas (checkmark)
- Tiempo total de práctica
- Nivel actual
- **Mapa de Calores Personalizado**: Grid 12x12 con todas las tablas, colores según tiempo promedio de respuesta del jugador

## Functionality Specification

### Core Features

1. **Historia (Mapa de Niveles)**
   - Mapa estelar con 12 planetas
   - Cada planeta representa una tabla
   - Sistema de desbloqueo progresivo
   - Repetición libre de niveles anteriores
   - Animación deintro al planeta seleccionado
   - Resumen de la historia al completar nivel

2. **Aprender Tablas (1-12)**
   - Grid de tablas del 1 al 12
   - Cada tabla muestra todas las multiplicaciones
   - Audio al tocar (opcional)
   - Marcar como "dominada"

3. **Modo Práctica**
   - Elegir tabla específica o mezcladas
   - 10 preguntas por ronda
   - Feedback inmediato (correcto/incorrecto)
   - Resumen final con puntuación

4. **Modo Desafío (Cronometrado)**
   - 60 segundos
   - Dificultad progresiva
   - Tablas mezcladas
   - Leaderboard local

5. **Seguimiento de Progreso**
   - Guardar en localStorage
   - Estadísticas diarias
   - Logros (badges)

### Mapa de Colores Personalizado (Progreso)
- **Grid**: 12x12 mostrando todas las celdas de las tablas (1×1 hasta 12×12)
- **Tiempo promedio**: Para cada multiplicación, tracking del tiempo promedio de respuesta
- **Cálculo de colores**:
  - Se calcula el tiempo promedio global del jugador
  - Para cada multiplicación, se compara su tiempo vs el promedio
  - Verde (>2seg más rápido que promedio)
  - Amarillo (±2seg del promedio)
  - Naranja (1-3seg más lento que promedio)
  - Rojo (>3seg más lento que promedio)
- **Escala visual**: Mostrada debajo del mapa con indicador:
  - "Muy rápido": <2seg bajo promedio
  - "Rápido": 0-2seg bajo promedio
  - "Normal": ±2seg del promedio
  - "Lento": 1-3seg sobre promedio
  - "Muy lento": >3seg sobre promedio
- **Adaptativo**: Los colores se recalculan automáticamente según el progreso del jugador

### User Interactions
- Swipe entre secciones
- Tap en tablas para expandir
- Shake en respuesta incorrecta
- Confeti en racha de 5+

### Data Handling
- localStorage para persistencia
- JSON para estructura de preguntas

## Estructura de Datos

### localStorage Schema
```json
{
  "jugador": {
    "nombre": "Luna",
    "nivelActual": 1,
    "nivelesCompletados": [1, 2, 3],
    "estrellas": { "1": 3, "2": 2, "3": 3 },
    "tiempos_respuesta": {
      "1x1": [1.2, 1.5, 2.0],
      "1x2": [2.1, 1.8],
      ...
    },
    "record_diario": "2024-01-15",
    "tiempo_total_practica": 3600,
    "stats_diarias": [
      { "fecha": "2024-01-15", "tablas_practicadas": 50, "tiempo": 1800, "precision": 85 }
    ]
  }
}
```

## Acceptance Criteria
- [ ] App carga sin errores
- [ ] Navegación entre 4 tabs funciona
- [ ] Historia se muestra con mapa de 12 planetas
- [ ] Niveles se desbloquean progresivamente
- [ ] Niveles completados pueden repetirse
- [ ] Las 12 tablas se muestran correctamente
- [ ] Quiz genera preguntas aleatorias
- [ ] Feedback visual funciona
- [ ] Progreso se guarda en localStorage
- [ ] Mapa de colores personalizado muestra tiempos promediados
- [ ] Escala visual indica los rangos de tiempo
- [ ] Diseño es responsive en móvil
- [ ] Animaciones suaves