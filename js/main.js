/*Stylesheet by Timothy Prestby 2019*/

//Create variable attribute that can be accessed globally 

//set two basemap styles to be used later
var light =  L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    //z is the zoom level
    //x is the horizontal coordinate
    //y is the vertical coordinate
    //id is the project id  
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 6,
        minZoom:5,
        //sets the max zoom level of the map
        id: 'mapbox.light',
        //the id of the map to copy
        accessToken: 'pk.eyJ1IjoicHJlc3RpbW9qIiwiYSI6ImNqczNmYWE2bzJmNTYzeW8zOXNlMnVpOGwifQ.OrEG7gIMeP3N3sMaNY3EGw'
    });
    //DEFINE THE TILE LAYER THAT WILL BE USED//
var dark =  L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    //z is the zoom level
    //x is the horizontal coordinate
    //y is the vertical coordinate
    //id is the project id  
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 6,
        minZoom:5,
        //sets the max zoom level of the map
        id: 'mapbox.streets',
        //the id of the map to copy
        accessToken: 'pk.eyJ1IjoicHJlc3RpbW9qIiwiYSI6ImNqczNmYWE2bzJmNTYzeW8zOXNlMnVpOGwifQ.OrEG7gIMeP3N3sMaNY3EGw'
    });
//streets style

//declare global map variable
var map = L.map('map',{
    center: [50.556071, 11.580791],
    //use fitbounds

    //sets the longitude and latitude of where the map center is
    zoom: 5,
    layers: [light]
});

//Initialize leaflet map 
    
//define Thematic map layers 

var migrants= new L.LayerGroup();

var average = new L.LayerGroup();

//FUNCTION To CREATE POPUP
function Popup(properties,attribute,layer,radius) {
    //build popup content of the country
    this.properties = properties;
    this.attribute = attribute;
    this.layer = layer;
    this.year = attribute;
   

    if (attribute.includes(':')==false){
    this.migrants = this.properties[attribute];
    this.content="<p><b>City:</b> " + this.properties['City'] + "</p><p><b>Number of Migrants Living in " + this.year + ":</b> " + (Math.floor(properties[attribute]*100)/100) + " </p>";
    } else {
     //bind the popup to the circle marker
    //this math function rounds the values
    this.average =this.properties[attribute];

    this.content="<p><b>City:</b> " + this.properties['City'] + "</p><p><b>Total percent of migrants in " + this.year + ":</b> " + (Math.floor(properties[attribute]*100)/100) + " </p>";
    };
    
    this.bindToLayer =function(){
    this.layer.bindPopup(this.content, {
        offset: new L.Point(0,-radius)
    //Binds the popup content to the popup object
    //The Offset ensures that the point is placed outside the radius of the proportional symbol

    });
};
};
//function to convert markers to circle markers
function pointToLayer(feature, latlng, attributes){    
    //Set marker options 

    if(attributes[0].includes(':')==false){
    var attribute = attributes[0];

    var options = {
        radius: 8,
        fillColor: 'none',
        color: "#000",
        weight: 3,
        opacity: 1,
        fillOpacity: 0.5
    };
} else {
    var attribute = attributes[1];

    var options = {
        radius: 8,
        fillColor: "#293542",
        color: "#293542",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.5
    };
}
 
    //For each feature, get the value for the attribute
    var attValue = Number(feature.properties[attribute]);
    //Assign radius based on attribute value
    console.log(attValue)
    options.radius=calcPropRadius(attValue);

    //creates the circle marker layer
    var layer = L.circleMarker(latlng, options);

    var popup = new Popup(feature.properties, attribute, layer, options.radius);

    popup.bindToLayer();

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



//Function to resize the proportional symbols according to attribute values
function updatePropSymbols(layer, attribute, attributes){

    map.eachLayer(function(layer){
        if (layer.feature && layer.feature.properties[attribute]){
            //update the layer style and popup
            
            var props = layer.feature.properties;
    
            //update each feature's radius based on new attribute values
            var radius = calcPropRadius(props[attribute],attributes);
            layer.setRadius(radius);

            //add formatted attribute to popup content string
            var year = attribute;
            
            var popup = new Popup(props, attribute, layer, radius);

            popup.bindToLayer();

            //bind the popup to the circle marker
            //this math function rounds the values
        };
    });
    };


//function to calculate the radius of each proportional symbol
function calcPropRadius(attValue) {

    if(attValue > 100){

    //scale factor to adjust symbol size evenly
    var scaleFactor = .01;
    //area based on attribute value and scale factor
    } else {

    
    var scaleFactor=300;
}


    var area = attValue * scaleFactor;
    //radius calculated based on area
    var radius = Math.sqrt(area/Math.PI);

    return radius;
};



//Function to add circle markers for point
function createPropSymbols(data,layer, attributes){
    
    if(attributes[0].includes(':')==true){
    //will create a GeoJSOn layer via leaflet and add it to the map
    L.geoJson(data, { pointToLayer: function(feature, latlng){
            //reference an anonymous function that will allow for calling paramaters of choice
           
            return pointToLayer(feature, latlng, attributes);
        }
    }).addTo(average)
    
        } else {
            L.geoJson(data, { pointToLayer: function(feature, latlng){
                  
                    //reference an anonymous function that will allow for calling paramaters of choice
                    return pointToLayer(feature, latlng, attributes);
                }
                }).addTo(migrants)
           
        };
    };

//ACCESS THE DATA FUNCTION IS CALLED
getData(migrants);
getData(average);


function createLegend(map, attributes){
    var LegendControl = L.Control.extend({
        options: {
            position: 'bottomleft'
        },

        onAdd: function (map) {
            // create the control container with a particular class name
            var container = L.DomUtil.create('div', 'legend-control-container');

            //PUT YOUR SCRIPT TO CREATE THE TEMPORAL LEGEND HERE

            return container;
        }
    });

    map.addControl(new LegendControl());
};

//////Create slider and responsiveness////////

function createSequenceControls(layer, attributes){
    
    var SequenceControl = L.Control.extend ({
        //Sequence Control is a new class to create sequence controls
        //Extend extends the parent class to the child class to inherit all methods and properties
        options: {
            position: 'bottomleft'
            //sets the position of the sequence controls
        },

         onAdd: function (map) {
        //onAdd creates an HTML element that the leaflet control, its child elements, attributes, and event listeners will be wrapped within
        
        var container = L.DomUtil.create('div', 'sequence-control-container');
        //Create a div element with a class

        //create a range input element (the slider)
        $(container).append("<input class='range-slider' type='range'>");

        $('.range-slider').attr({
            max: 8,
            //Sets the number of slider values (starting and index 0)
            min: 0,
            //Sets the minimum number of slider values
            value: 0,
            //Sets the initial value of the slider bar
            step: 1
            //Sets what the slider will increment or decrement by
        })
    
        $(container).append('<button class="skip" id="reverse" title="Reverse">Reverse</button>');
        $(container).append('<button class="skip" id="forward" title="Forward">Skip</button>');

        //Add buttons that provide additional sequence control
        
        
        $('#reverse').html('<img src="img/backward.png">');
        $('#forward').html('<img src="img/forward.png">');
        //Style the buttons
    
        //event listener for the slider
        $('.range-slider').on('input', function(){
            //Step 6: get the new index value
            var index = $(this).val();
            updatePropSymbols(layer, attributes[index]);
    
        });
    
        //Click listener for buttons
        $('.skip').click(function(){
            //get the old index value
            var index = $('.range-slider').val();
    
            //Step 6: increment or decrement depending on button clicked
            if ($(this).attr('id') == 'forward'){
                index++;
                //Step 7: if past the last attribute, wrap around to first attribute
                index = index > 8 ? 0 : index;
            } else if ($(this).attr('id') == 'reverse'){
                index--;
                //Step 7: if past the first attribute, wrap around to last attribute
                index = index < 0 ? 8 : index;
            };
    
            //Step 8: update slider
            $('.range-slider').val(index);
            updatePropSymbols(layer, attributes[index]);
        });

        L.DomEvent.disableClickPropagation(container);
        //Disable the mouse event listener for the container
        return container;
    }
}); 
map.addControl(new SequenceControl());

};


//Function to process the sequential data//

function processData(data,layer){
var min = Infinity
var max =-Infinity 

//define variables to be used in the legend.
var attributes = [];
//set empty array

var properties = data.features[0].properties ;
if (layer == migrants){
    for (var attribute in properties){
   
        if(attribute.includes(':') == false){
        //will get all attributes with prefix 20
        attributes.push(attribute)}
    }
    return attributes
} else {
    for (var attribute in properties){

        if(attribute.indexOf(':') > -1){
            //will get all attributes with prefix 20
            attributes.push(attribute)}}
    return attributes
            
    };
};




//function to retrieve GeoJSON data and place it on the map
function getData(layer){
    //load the data
    $.ajax("data/Foreigners.geojson",{
        datatype: 'json',
        success: function(response){
                //set callback function
            var attributes = processData(response,layer);

            createPropSymbols(response,layer, attributes);
            ///////*Working up to here*/ ///////

            createLegend()

            createSequenceControls(layer, attributes);
            
        }
    });
};


function createMap() {
//control the layers

var baseMaps = {
    'Grayscale' : light,
    'Streets' : dark
};

var overlayMaps = {
    'Total Migrants' : migrants,
    'Composition of Migrants' : average
 
};
//creates a dictionary of the map layers to be overlayed 



L.control.layers(baseMaps, overlayMaps, true, true).addTo(map)};

//WIll create a control menu that allows users to select which layers to turn on

//When the document os ready, create the map!
$(document).ready(createMap);