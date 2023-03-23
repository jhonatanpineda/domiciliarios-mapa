document.addEventListener("DOMContentLoaded", function () {
  const domiciliaries = [];

  document.getElementById("domiciliary-form").addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        const domiciliary = {
          name,
          phone,
          lat,
          lng,
          marker: null,
        };

        addDomiciliaryMarker(domiciliary);
        domiciliaries.push(domiciliary);
        alert("Domiciliario registrado exitosamente");
      });
    } else {
      alert("La geolocalización no es compatible con este navegador.");
    }
  });

  const map = L.map("map").setView([0, 0], 2);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

function addDomiciliaryMarker(domiciliary) {
  const motoIcon = L.icon({
    iconUrl: 'moto.png',
    iconSize: [38, 38], // Tamaño del ícono en píxeles (ajusta los valores según sea necesario)
    iconAnchor: [19, 38], // Punto de anclaje en el que se ubicará el ícono en el marcador
    popupAnchor: [0, -38] // Punto de anclaje para la ventana emergente
  });

  const marker = L.marker([domiciliary.lat, domiciliary.lng], { icon: motoIcon }).addTo(map);
  marker.bindPopup(`<b>${domiciliary.name}</b><br>Teléfono: ${domiciliary.phone}`);
  domiciliary.marker = marker;
}

  function updateDomiciliaryLocation(domiciliary, lat, lng) {
    domiciliary.lat = lat;
    domiciliary.lng = lng;
    domiciliary.marker.setLatLng([lat, lng]);
  }

  function watchDomiciliaryLocation(domiciliary) {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          updateDomiciliaryLocation(domiciliary, lat, lng);
        },
        (error) => {
          console.error("Error al obtener la ubicación:", error);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maxAge: 0,
        }
      );
    } else {
      alert("La geolocalización no es compatible con este navegador.");
    }
  }

  // Iniciar seguimiento de la ubicación de todos los domiciliarios registrados
  domiciliaries.forEach((domiciliary) => {
    watchDomiciliaryLocation(domiciliary);
  });
});
