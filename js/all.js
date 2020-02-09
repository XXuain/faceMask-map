var map = L.map("map", {
  center: [25.0641544, 121.6349056],
  zoom: 16
});

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// iconData.forEach(item => {
//     let item.name
// })

var iconBlue = L.icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
var iconRed = L.icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

var greenIcon = new L.Icon({
  iconUrl: "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

let data = [
  { name: "測試藥局1", lat: 25.0641544, lng: 121.6349056 },
  { name: "測試藥局2", lat: 25.0642886, lng: 121.6346776 }
];

var markers = new L.MarkerClusterGroup().addTo(map);

// console.log(data.length);
for (let i = 0; data.length > i; i++) {
  //   L.marker([data[i].lat, data[i].lng], { icon: iconBlue })
  //     .bindPopup(`${data[i].name}`)
  //     .addTo(map);
  // 在 icon 群組中加入各個 icon
  markers.addLayer(L.marker([data[i].lat, data[i].lng], { icon: greenIcon }).bindPopup(`${data[i].name}`));
}

// for (let i = 0; data.length > i; i++) {
//   console.log(data[i].name);
//   markers.addLayer(L.marker([data[i].lat, data[i].lng], { icon: greenIcon }));
// }
// L.marker([25.0641544, 121.6349056], { icon: iconBlue })
//   .bindPopup("<h1>測試藥局1</h1>")
//   .addTo(map);

// L.marker([25.0642886, 121.6346776], { icon: iconRed })
//   .bindPopup("<h1>測試藥局2</h1>")
//   .addTo(map);
map.addLayer(markers);
