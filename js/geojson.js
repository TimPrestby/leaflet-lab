
//Initialize leaflet map
function createMap(){
    var map= L.map('map',{
        center: [20,0],
        zoom: 2
    });


//add OSM base tilelayer
L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
  }).addTo(map);

  //call getData function
  getData(map);

};

/*ADD POPUP OF PROPERTIES PER FEATURE

//function to attach popups to each mapped feature
function onEachFeature(feature, layer) {
    //only need the one for loop since it does it for each feature
    //no property named popupContent; instead, create html string with all properties
    var popupContent = "";
    if (feature.properties) {
        //loop to add feature property names and values to html string
        for (var property in feature.properties){
            popupContent += "<p>" + property + ": " + feature.properties[property] + "</p>";
        //popup content gets a P html tag with the property name and the value of the property of the feature
        }
        layer.bindPopup(popupContent);
    };
};

//function to retrieve the data and place it on the map
function getData(map){
    //load the data
    $.ajax("data/MegaCities.geojson", {
        dataType: "json",
        success: function(response){

            //create a Leaflet GeoJSON layer and add it to the map
            L.geoJson(response, {
                onEachFeature: onEachFeature
            }).addTo(map);
        }
    });
};

*/



//function to retrieve data and place it on the map
//Creates circles on the map
//POINT TO LAYER
function getData(map){
    //load the data
    $.ajax("data/MegaCities.geojson",{
        datatype: 'json',
        success: function(response){
                //set callback function
                        //create marker options
                    
            L.geoJson(response, {
                pointToLayer: function (feature, latlng){
                    //changes the point features of lat lon into point features
                }
            }).addTo(map);
            //the geoJson function's argument is the response which is all of the geoJSOn data from megacities
        
        }
    });
};


$(document).ready(createMap);

