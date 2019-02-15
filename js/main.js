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
function pointToLayer(feature, latlng, attributes){     
    //Set marker options 
    var attribute = attributes[0];
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
        }
        //Close the popup when no longer mousing over

     


    });

    //return the circle marker to the L.geoJson pointToLayer option
    return layer;
};

//Function to resize the proportional symbols acording to attribute values
function updatePropSymbols(map, attribute){
    map.eachLayer(function(layer){
        if (layer.feature && layer.feature.properties[attribute]){
            //update the layer style and popup
            
            var props = layer.feature.properties;

            //update each feature's radius based on new attribute values
            var radius = calcPropRadius(props[attribute]);
            layer.setRadius(radius);

            //build popup content of the country
            var popupContent = "<p><b>Country:</b> " + props['Country Name'] + "</p>";

            //add formatted attribute to popup content string
            var year = attribute;
            popupContent += "<p><b>CO2 emissions in " + year + ":</b> " + (Math.floor(props[attribute]*100)/100) + " (metric tons per capita) </p>";
            //bind the popup to the circle marker
            //this math function rounds the values

            //replace the layer popup
            layer.bindPopup(popupContent, {
                offset: new L.Point(0,-radius)
            });
        };
        });
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

//ASK TO EXPLAIN

//Function to add circle markers for point
function createPropSymbols(data,map, attributes){
    //will create a GeoJSOn layer via leaflet and add it to the map
    L.geoJson(data, {
        pointToLayer: function(feature, latlng){
            //reference an anonymous function that will allow for calling paramaters of choice
            return pointToLayer(feature, latlng, attributes);
        }
            //changes the point features of lat lon into point features

            
        }).addTo(map);
    };



//ACCESS THE DATA FUNCTION IS CALLED
getData(map);

//////LESSON 3////////
function createSequenceControls(map){
    //create a range input element (the slider)
    $('#panel').append("<input class='range-slider' type='range'>");

    //set slider attributes
    $('.range-slider').attr({
        max: 13,
        //Sets the number of slider values (starting and index 0)
        min: 0,
        //Sets the minimum number of slider values
        value: 0,
        //Sets the initial value of the slider bar
        step: 1
        //Sets what the slider will increment or decrement by
    })

    $('#panel').append('<button class="skip" id="reverse">Reverse</button>');
    $('#panel').append('<button class="skip" id="forward">Skip</button>');
    //Add buttons that provide additional sequence control
    
    $('#reverse').html('<img src="img/backward.png">');
    $('#forward').html('<img src="img/forward.png">');
    //Style the buttons

    //event listener for the slider
    $('.range-slider').on('input', function(){
        //Step 6: get the new index value
        var index = $(this).val();
        updatePropSymbols(map, attributes[index]);

    });

    //Step 5: click listener for buttons
    $('.skip').click(function(){
        //get the old index value
        var index = $('.range-slider').val();

        //Step 6: increment or decrement depending on button clicked
        if ($(this).attr('id') == 'forward'){
            index++;
            //Step 7: if past the last attribute, wrap around to first attribute
            index = index > 13 ? 0 : index;
        } else if ($(this).attr('id') == 'reverse'){
            index--;
            //Step 7: if past the first attribute, wrap around to last attribute
            index = index < 0 ? 13 : index;
        };

        //Step 8: update slider
        $('.range-slider').val(index);
        updatePropSymbols(map, attributes[index]);
    });
};


//Function to process the sequential data//

function processData(data){
var attributes = [];
//set empty array

var properties = data.features[0].properties ;

for (var attribute in properties){
    if (attribute.indexOf(20) > -1){
        //will gett all attributes with prefix 20
        attributes.push(attribute);
    };
};

return attributes
};

//function to retrieve GeoJSON data and place it on the map
function getData(map){
    //load the data
    $.ajax("data/CarbonFinal.geojson",{
        datatype: 'json',
        success: function(response){
                //set callback function
            
            var attributes = processData(response);
            
            createPropSymbols(response,map, attributes);
            createSequenceControls(map, attributes);
            
        }
    });
};





//When the document os ready, create the map!
$(document).ready(createMap);