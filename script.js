// Reemplaza esto con tu API Key gratuita obtenida en https://geo.ipify.org/
const API_KEY = 'at_LoSvLVk3jyqcQnnzJAoGxwlLrxH7n'


// 1. Inicializar el mapa centrado por defecto (ej. Nueva York)
let map = L.map('map', { zoomControl: false }).setView([40.7128, -74.0060], 13);


// Usar mapas de Esri (gratuitos y sin marcas de agua)
L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
  maxZoom: 19,
  attribution: 'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, etc.'
}).addTo(map);

// Crear un icono personalizado para el marcador (opcional, acorde al diseño)
const markerIcon = L.icon({
  iconUrl: './images/icon-location.svg',
  iconSize: [30, 40],
  iconAnchor: [15, 40]
});

let marker = L.marker([40.7128, -74.0060], { icon: markerIcon }).addTo(map);

// Referencias a los elementos del DOM
const form = document.getElementById('search-form');
const input = document.getElementById('ip-input');

const ipResult = document.getElementById('ip-result');
const locationResult = document.getElementById('location-result');
const timezoneResult = document.getElementById('timezone-result');
const ispResult = document.getElementById('isp-result');

// Función principal para buscar la IP o Dominio
async function getGeoData(query = '') {
  try {
    // Si pasas un valor, decide si es IP o dominio consultando los parámetros correctos de la API
    const isIp = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(query);
    const param = query ? (isIp ? `&ipAddress=${query}` : `&domain=${query}`) : '';
    
    const response = await fetch(`https://geo.ipify.org/api/v2/country,city?apiKey=${API_KEY}${param}`);
    const data = await response.json();

    if (!response.ok) throw new Error('No se pudo obtener la información');

    // 2. Actualizar los textos en la tarjeta flotante
    ipResult.textContent = data.ip;
    locationResult.textContent = `${data.location.city}, ${data.location.region} ${data.location.postalCode}`;
    timezoneResult.textContent = `UTC ${data.location.timezone}`;
    ispResult.textContent = data.isp;

    // 3. Obtener coordenadas y mover el mapa
    const lat = data.location.lat;
    const lng = data.location.lng;

    map.setView([lat, lng], 14);
    marker.setLatLng([lat, lng]);

  } catch (error) {
    alert('Hubo un error al buscar la dirección IP o dominio. Revisa tu API Key o conexión.');
    console.error(error);
  }
}

// Escuchar el evento de envío del formulario (buscador)
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const searchValue = input.value.trim();
  if (searchValue) {
    getGeoData(searchValue);
  }
});

// Cargar la IP actual del usuario al abrir la página por primera vez
getGeoData();