mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v12', // style URL
    center: [long, lat], // starting position [lng, lat]
    zoom: 9, // starting zoom
});
new mapboxgl.Marker()
    .setLngLat([long, lat])
    .addTo(map);
