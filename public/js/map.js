mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/light-v10', // style URL
    center: [long, lat], // starting position [lng, lat]
    zoom: 9, // starting zoom
});
new mapboxgl.Marker()
    .setLngLat([long, lat])
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(
                `<h3>${campgroundTitle}</h3>`
            )
    )
    .addTo(map);
