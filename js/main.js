/*Stylesheet by Timothy Prestby 2019*/
//declare global map variable
var map=L.map('map',{
    center: [20,0],
    //use fitbounds

    //sets the longitude and latitude of where the map center is
    zoom: 2});

//Initialize leaflet map
function createMap(){
   
    
    //DEFINE THE TILE LAYER THAT WILL BE USED//
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        //z is the zoom level
        //x is the horizontal coordinate
        //y is the vertical coordinate
        //id is the project id  
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 10,
            //sets the max zoom level of the map
            id: 'mapbox.light',
            //the id of the map to copy
            accessToken: 'pk.eyJ1IjoicHJlc3RpbW9qIiwiYSI6ImNqczNmYWE2bzJmNTYzeW8zOXNlMnVpOGwifQ.OrEG7gIMeP3N3sMaNY3EGw'
        }).addTo(map)};



//Function to add circle markers for point
function createPropSymbols(data,map){
    //Set marker options 
    var attribute= '2000';
    var geojsonMarkerOptions = {
        radius: 8,
        fillColor: "#293542",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    };

    L.geoJson(data, {
        pointToLayer: function (feature, latlng){
            //changes the point features of lat lon into point features

            //For each feature, get the value for the attribute
            var attValue = Number(feature.properties[attribute]);

            console.log(feature.properties, attValue);

            return L.circleMarker(latlng, geojsonMarkerOptions);
            //return will bring the feature back to the argument and is then added on the following

            
        }
    }).addTo(map);
};

//function to retrieve data and place it on the map
function getData(map){
    //load the data
    $.ajax("data/CarbonFinal.geojson",{
        datatype: 'json',
        success: function(response){
                //set callback function
            createPropSymbols(response,map);
            
        }
    });
};

//ACCESS THE DATA FUNCTION IS CALLED
getData(map);

//When the document os ready, create the map!
$(document).ready(createMap);