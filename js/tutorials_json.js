/*GeoJSON*/

var map=L.map('map').setView([39.74739, -105], 4);
//Set view returns the map object

  //add tile layer to map using mapbox
  L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
  //z is the zoom level
  //x is the horizontal coordinate
  //y is the vertical coordinate
  //id is the project id  
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.light',
    accessToken: 'pk.eyJ1IjoicHJlc3RpbW9qIiwiYSI6ImNqczNmYWE2bzJmNTYzeW8zOXNlMnVpOGwifQ.OrEG7gIMeP3N3sMaNY3EGw'
}).addTo(map);






var myLines = [{
    //This creates an array of two lines that are polylines 
    "type": "LineString",
    "coordinates": [[-100, 40], [-105, 45], [-110, 55]]
}, {
    "type": "LineString",
    "coordinates": [[-105, 40], [-110, 45], [-115, 55]]
}];

var myStyle = {
    "color": "#ff7800",
    "weight": 5,
    "opacity": 0.65
    //This defines the styles of the lines that will show on the screen
};

L.geoJSON(myLines, {
    style: myStyle
}).addTo(map);
//This will add the lines to the map with the style of variable mystyles

var states = [{
    //This creates an array of two states that are polygon features with points as vertices
    //These polygons will be styled differently according to their political party
    "type": "Feature",
    "properties": {"party": "Republican"},
    "geometry": {
        "type": "Polygon",
        "coordinates": [[
            [-104.05, 48.99],
            [-97.22,  48.98],
            [-96.58,  45.94],
            [-104.03, 45.94],
            [-104.05, 48.99]
        ]]
    }
}, {
    "type": "Feature",
    "properties": {"party": "Democrat"},
    "geometry": {
        "type": "Polygon",
        "coordinates": [[
            [-109.05, 41.00],
            [-102.06, 40.99],
            [-102.03, 36.99],
            [-109.04, 36.99],
            [-109.05, 41.00]
        ]]
    }
}];

L.geoJSON(states, {
    style: function(feature) {
        switch (feature.properties.party) {
            case 'Republican': return {color: "#ff0000"};
            case 'Democrat':   return {color: "#0000ff"};
            //This passes the argument of states into the geoJSOn function
            //the style will be changed and return a color per party case
        }
    }
}).addTo(map);
//this adds the style to the map

var geojsonMarkerOptions = {
    radius: 8,
    fillColor: "#ff7800",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
};
//This will set a variable that holds the marker option/style





function onEachFeature(feature, layer) {
    // does this feature have a property named popupContent?
    //if so, then add a popup for each feature that has one
    if (feature.properties && feature.properties.popupContent) {
        layer.bindPopup(feature.properties.popupContent);
    }
}

var geojsonFeature = {
    //creates a geoJSOn Feature of the stadium to be added
    "type": "Feature",
    "properties": {
        "name": "Coors Field",
        "amenity": "Baseball Stadium",
        "popupContent": "This is where the Rockies play!"
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-104.99404, 39.75621]
    }
};





L.geoJSON(geojsonFeature, {
    onEachFeature: onEachFeature,
    
    pointToLayer: function (feature, latlng) {
        //this will convert the geoJSOn points to a marker layer
        return L.circleMarker(latlng, geojsonMarkerOptions);
    }
}).addTo(map);
//This will add the popups to the map