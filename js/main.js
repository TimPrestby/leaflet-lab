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

//function to convert markers to circle markers
function pointToLayer(feature, latlng){     
    //Set marker options 
    var attribute= '2000';
    var options = {
        radius: 8,
        fillColor: "#293542",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.5
    };

    //For each feature, get the value for the attribute
    var attValue = Number(feature.properties[attribute]);

    //Assign radius based on attribute value
    options.radius=calcPropRadius(attValue);

    //creates the circle marker layer
    var layer = L.circleMarker(latlng, options);

    //build popup content of the country
    var popupContent = "<p><b>Country:</b> " + feature.properties['Country Name'] + "</p>";

     //add formatted attribute to popup content string
     var year = attribute;
     popupContent += "<p><b>CO2 emissions in " + year + ":</b> " + (Math.floor(feature.properties[attribute]*100)/100) + " (metric tons per capita) </p>";
    //bind the popup to the circle marker
    //this math function rounds the values

    layer.bindPopup(popupContent, {
        offset: new L.Point(0,-options.radius)
    });
    //Binds the popup content to the popup object
    //The Offset ensures that the point is placed outside the radius of the proportional symbol

    //event listeners to open popup on hover
      layer.on({
        mouseover: function(){
            this.openPopup();
        },
        //Open the popup when mousing over in desktop view
        mouseout: function(){
            this.closePopup();
        },
        //Close the popup when no longer mousing over

        click: function(){
            $("#panel").html(popupContent);
        }
    });

    //return the circle marker to the L.geoJson pointToLayer option
    return layer;
};

//function to calculate the radius of each proportional symbol
function calcPropRadius(attValue) {
    //scale factor to adjust symbol size evenly
    var scaleFactor = 50;
    //area based on attribute value and scale factor
    var area = attValue * scaleFactor;
    //radius calculated based on area
    var radius = Math.sqrt(area/Math.PI);

    return radius;
};

//Function to add circle markers for point
function createPropSymbols(data,map){

    L.geoJson(data, {
        pointToLayer: pointToLayer
            //changes the point features of lat lon into point features

            
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