const jQuery = require('jquery');
const L = require('leaflet');
//const img_width = 876;
const img_height = 902;

const width = jQuery('#map').innerWidth() - 100;
const height = img_height;

const map = L.map('map', {
    center: [ 0, 0 ],
    zoom: 1,
    maxZoom: 5
});

const imageBounds = [
    [ -(height / 2), -(width / 2) ],
    [ height / 2, width / 2 ]
];

L.imageOverlay('/img/marriott_map.svg', imageBounds).addTo(map);
map.setMaxBounds(imageBounds);