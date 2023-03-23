// Configura tus propios datos de Firebase
//const firebaseConfig = {
  //apiKey: "AIzaSyBQzZi7XOnI4JoaEyIeDTt1gBN4urDEVjQ",
    //authDomain: "gpt-4-381501.firebaseapp.com",
    //projectId: "gpt-4-381501",
    //storageBucket: "gpt-4-381501.appspot.com",
    //messagingSenderId: "306716257983",
    //appId: "1:306716257983:web:66db7a5cb3b6faf00a600a",
    //measurementId: "G-SCX5RWQCG0"
// Configura tus propios datos de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBQzZi7XOnI4JoaEyIeDTt1gBN4urDEVjQ",
    authDomain: "gpt-4-381501.firebaseapp.com",
    projectId: "gpt-4-381501",
    storageBucket: "gpt-4-381501.appspot.com",
    messagingSenderId: "306716257983",
    appId: "1:306716257983:web:66db7a5cb3b6faf00a600a",
  };
  
  // Inicializa Firebase
  const app = firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore(app);
  
  document.getElementById("domiciliary-form").addEventListener("submit", async (e) => {
    e.preventDefault();
  
    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
  
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
  
        try {
          await db.collection("domiciliarios").add({
            name,
            phone,
            location: new firebase.firestore.GeoPoint(lat, lng),
          });
          alert("Domiciliario registrado exitosamente");
        } catch (error) {
          console.error("Error al registrar domiciliario:", error);
        }
      });
    } else {
      alert("La geolocalización no es compatible con este navegador.");
    }
  });
  
  function initMap() {
    const map = new google.maps.Map(document.getElementById("map"), {
      zoom: 10,
      center: { lat: -34.397, lng: 150.644 },
    });
  
    // Crea marcadores para cada domiciliario y añádelos al mapa
    db.collection("domiciliarios").onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const doc = change.doc;
          const data = doc.data();
          const marker = new google.maps.Marker({
            position: {
              lat: data.location.latitude,
              lng: data.location.longitude,
            },
            map,
            title: data.name,
          });
        }
      });
    });
  }
