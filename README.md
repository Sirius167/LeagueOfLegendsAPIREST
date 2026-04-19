📚 DOCUMENTACIÓN: LEAGUE OF LEGENDS - EXPLORADOR DE CAMPEONES
🎮 ¿QUÉ ES?
Es una aplicación web interactiva que muestra información detallada de todos los campeones de League of Legends usando la API oficial de Riot Games (Data Dragon)

📁 ARCHIVOS DEL PROYECTO
- index.html - Estructura principal de la página

- styles.css - Estilos, colores y diseño visual

- app.js - Lógica y conexión con la API

🛠️ TECNOLOGÍAS USADAS
- HTML5 - Estructura de la página

- CSS3 - Estilos, animaciones, diseño responsivo

- JavaScript (ES6+) - Funcionalidad y consumo de API

- Riot Games API - Fuente de datos oficial (Data Dragon)

🎨 DISEÑO Y TEMÁTICA
Colores principales
- Dorado #C8A96E - Acentos, bordes, detalles

- Azul profundo #0A0E1A - Fondo principal

- Azul card #111C2E - Tarjetas de campeones

- Aguamarina #0BC4E2 - Detalles secundarios

Fuentes
- Cinzel Decorative - Títulos principales

- Cinzel - Subtítulos y etiquetas

- Raleway - Textos generales

✨ FUNCIONALIDADES
1. Búsqueda
- Buscar campeones por nombre

- Buscar por título del campeón

- Botón para limpiar búsqueda

2. Filtros por clase (tags)
- Todos

- Fighter (Luchador)

- Mage (Mago)

- Assassin (Asesino)

- Tank (Tanque)

- Support (Soporte)

- Marksman (Tirador)

3. Ordenamiento
- Nombre A→Z

- Nombre Z→A

- Mayor HP

- Mayor Ataque

4. Tarjetas de campeones
Cada tarjeta muestra:

- Imagen del campeón

- Nombre

- Título

- Clase (con color distintivo)

- Mini-barras de estadísticas (Ataque, Defensa, Magia)

5. Modal con detalles
- Al hacer clic en un campeón se abre un modal con:

- Información básica: Nombre, título, recurso, clase

- Descripción (blurb)

- Estadísticas base: HP, Ataque, Armadura, Resistencia mágica, Velocidad de movimiento, Velocidad de ataque

- Ratings del juego: Ataque, Defensa, Magia, Dificultad

- Barras animadas que muestran el nivel de cada estadística

6. Animaciones
- Tarjetas con fade-in al cargar

- Hover con elevación y zoom

- Barras de estadísticas animadas

- Modal con efecto de aparición

🔌 API UTILIZADA
- Endpoint base: https://ddragon.leagueoflegends.com/cdn/16.8.1/

- Versión de la API: 16.8.1

- Lista de campeones: /data/es_ES/champion.json

- Imágenes de campeones: /img/champion/{id}.png

- Idioma: Español (es_ES)

📊 ESTRUCTURA DE DATOS
Campeón (datos principales)
- id - Identificador único

- name - Nombre del campeón

- title - Título/rol

- tags - Array de clases

- blurb - Descripción corta

- partype - Tipo de recurso (maná, energía, etc.)

  Estadísticas (stats)
- hp - Vida base

- attackdamage - Daño de ataque

- armor - Armadura

- spellblock - Resistencia mágica

- movespeed - Velocidad de movimiento

- attackspeed - Velocidad de ataque

 Ratings (info)
- attack (0-10) - Capacidad de ataque

- defense (0-10) - Capacidad defensiva

- magic (0-10) - Poder mágico

- difficulty (0-10) - Dificultad de juego

🧩 VARIABLES PRINCIPALES (app.js)
- API_VERSION - Versión actual de Data Dragon

- API_BASE - URL base de la API

- IMG_BASE - URL base de imágenes

- CHAMPIONS_URL - URL del JSON de campeones

- STAT_MAX - Valores máximos para barras de estadísticas

- allChampions - Array con todos los campeones

- filtered - Campeones después de filtros

- activeTag - Clase actual seleccionada

- searchQuery - Texto de búsqueda

- sortKey - Criterio de ordenamiento

🧩 FUNCIONES PRINCIPALES
- fetchChampions() - Obtiene datos de la API de Riot

- applyFiltersAndRender() - Aplica filtros, ordena y renderiza

- renderGrid() - Dibuja las tarjetas en el grid

- buildCard() - Construye HTML de cada tarjeta

- openModal() - Abre el modal con detalles

- closeModal() - Cierra el modal

- setBar() - Anima las barras de estadísticas

- buildSkeletons() - Muestra esqueletos de carga



Hecho por Felipe Jaramillo y Ricardo Lora
