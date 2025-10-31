const key = "PkiulwDwTxLngBsm0Oli";

const map = L.map("map").setView(listing.geometry, 11); // starting position [lng,lat]

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 15,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

let leafletIcon = L.icon({
  iconUrl: "../assests/home.png",
  iconSize: [40, 40],
  iconAnchor: [20, 50],
  popupAnchor: [-3, -60],
});

L.marker(listing.geometry, { icon: leafletIcon })
  .addTo(map)
  .bindPopup(
    `<h4>${listing.title}</h4><p>Exact Location will be Provided after Booking</p>`
  )
  .openPopup();
