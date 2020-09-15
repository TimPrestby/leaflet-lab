/*Stylesheet by Timothy Prestby 2019*/

//Function to Initialize creation of map//
function createMap(){

var map = L.map('map',{
//Sets the longitude and latitude of where the map center is
    center: [51, 12],
    zoom: 5,
});

//Add OSM baselayer
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', { 
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 6,
        minZoom:5,
        //sets the max zoom level of the map
        id: 'mapbox.light',
        //the id of the map to copy
        accessToken: 'pk.eyJ1IjoicHJlc3RpbW9qIiwiYSI6ImNqczNmYWE2bzJmNTYzeW8zOXNlMnVpOGwifQ.OrEG7gIMeP3N3sMaNY3EGw'
     //DEFINE THE TILE LAYER THAT WILL BE USED//
    }).addTo(map)   
    //Call getData Function to add data to the map
    getData(map);
};

//Create global variable to hold point layers based on each city
var circleLayers = [];

//Function To CREATE POPUP//
function Popup(properties,attribute,layer,radius) {
        this.properties = properties;
        this.attribute = attribute;
        this.layer = layer;
        this.year = attribute;
        //This refers to the 'owner' of the method 
        this.content="<p><b>City:</b> " + this.properties['City'] + "</p><p><b>Total percent of migrants in " + this.year + ":</b> " + (Math.floor(properties[attribute]*100)/100) + " </p>";

        
        this.bindToLayer =function(){
        //Binds the popup to the affiliated layer passed in the parameter
        this.layer.bindPopup(this.content, {
            offset: new L.Point(0,-radius)
        //Binds the popup content to the popup object
        //The Offset ensures that the point is placed outside the radius of the proportional symbol

        });
    };
};

//Function to convert markers to circle markers//
function pointToLayer(feature, latlng, attributes){    
    //The attributes with numerical values start at index 1
    //Since 2009 is the first year in the sequence, this is called
    var attribute = attributes[1];
    //Defines a set of options for the circle markers
    var options = {
        radius: 8,
        fillColor: '#36454f',
        color: "#000",
        weight: 2,
        opacity: 1,
        fillOpacity: 0.25,
    };
    //For each feature, get the value for the attribute in form of number so it can be used in a calculation
    var attValue = Number(feature.properties[attribute]);
    //Assign radius based on attribute value
    options.radius=calcPropRadius(attValue);
    //creates the circle marker layer
    var layer = L.circleMarker(latlng, options);
    //Build popup object preformatted
    var popup = new Popup(feature.properties, attribute, layer, options.radius);
    //Binds popup object to the layer
    popup.bindToLayer();
    //Event listeners to open popup on hover
    layer.on({
        mouseover: function(){
            this.openPopup();
        },     
        mouseout: function(){
            this.closePopup();
        }    
    });
    //Save circle layers using the Cityname as the reference for filter
    circleLayers[feature.properties['City:']]=layer
    //return the circle marker to the L.geoJson pointToLayer option
    return layer;
}

//Function to resize the proportional symbols according to attribute values//
function updatePropSymbols(map, attribute){
    map.eachLayer(function(layer){
        if (layer.feature && layer.feature.properties[attribute]){
            // Retrieve the properties of the feature
            var props = layer.feature.properties;
            //update each feature's radius based on new attribute values
            var radius = calcPropRadius(props[attribute]);
            layer.setRadius(radius);
            //Create new popup for updated temporal data
            var popup = new Popup(props, attribute, layer, radius);
            popup.bindToLayer();
        };
    });
    //Update sequence legend once the layers are updated
	updateLegend(map, attribute);
};

//Function to calculate the radius of each proportional symbol//
function calcPropRadius(attValue) {
    //Scale factor that applies to all points   
    var scaleFactor=300;
    //Calculate area based on the attribute value and the scale factor
    var area = attValue * scaleFactor;
    //Determine the radius using math and the area
    var radius = Math.sqrt(area/Math.PI);

    return radius;
};

//Function to add circle markers for points//
function createPropSymbols(data,map, attributes){
    //Create a GeoJSOn layer via leaflet and add it to the map
    L.geoJson(data, { pointToLayer: function(feature, latlng){           
            return pointToLayer(feature, latlng, attributes);
        }
    }).addTo(map)
};

//Function to update filter
function updateFilter(map,attribute,lowerLimit,upperLimit){
    for (layer in circleLayers){
        //Ensure that the layer has feature and properties so null is not returned
        if (circleLayers[layer].feature && circleLayers[layer].feature.properties[attribute]){
            //Determine if the circleLayer is above the lower limit AND under the upper limit
            if(circleLayers[layer].feature.properties[attribute] >= lowerLimit && circleLayers[layer].feature.properties[attribute] <= upperLimit){
                //Add the circle layer to the map
                map.addLayer(circleLayers[layer]);    
                updatePropSymbols(map, attribute)
            } else {
                //Remove layers that do not meet the limits
                map.removeLayer(circleLayers[layer]);
            };
        };
    };
};


//Function to create a title//
function createTitle(map){
//Create WaterMark for Title
L.Control.Watermark = L.Control.extend({
    onAdd: function(map) {
        //Create new image variable to hold image
        var img = L.DomUtil.create('img');
        //Set image path
        img.src = '../img/Title.png';
        //Set Image width
        img.style.width = '35vw';
        return img;
    },
});
//Set new image
L.control.watermark = function(opts) {
    return new L.Control.Watermark(opts);
}
//Position new image
L.control.watermark({ position: 'topleft' }).addTo(map);
};


//Function to get supplementary info//
function createText(map){
    var metadata = L.Control.extend({
        options: {
            position: 'topright'
        },
    onAdd: function (map) {
        //Create the control container with a particular class name
		var container = L.DomUtil.create('div', 'meta-container');
        //Add Citation Information
        var context ="<p id='text'> Data from European Union's Eurostat Data Portal. <br> Watermark and Map Created by Timothy Prestby <br> March 8, 2019 | Geography 575 | Lab 1 </p>";
        $(container).append(context)

        return container;

        }
    
    });
    map.addControl(new metadata());

};

//Function to create an updating legend//
function createLegend(map, attributes){
	var LegendControl = L.Control.extend({
		options: {
			position: 'bottomright'
		},

		onAdd: function (map) {
			//Create the control container with a particular class name
			var container = L.DomUtil.create('div', 'legend-control-container');
			//Add temporal legend div to container
			$(container).append('<div id="temporal-legend">')
			//Start attribute legend svg string to further be manipulated below 
			var svg = '<svg id="attribute-legend" width="250px" height="160px" y="200">';
			//Array to base loop on of legend
			var circles = {
				max: 15,
				mean: 50,
				min: 105
			};
			//Loop to add each circle and text to svg string
			for (var circle in circles){
				//Creates circle string object
				svg += '<circle class="legend-circle" cx="90" cy="50" id="' + circle + '" fill="#36454f" fill-opacity="0.25" stroke="#000000" cx="40"/>';

				//Creates text string object
				svg += '<text id="' + circle + '-text" x="155" y="' + circles[circle] + '"></text>';
			};
			//Close the svg string
			svg += "</svg>";
			//Add attribute legend svg to container
			$(container).append(svg);
			return container;
		}
	});
    map.addControl(new LegendControl());
};

//Update the legend with new attribute
function updateLegend(map, attribute){
    //Create Content for legend using the year and text
	var year = attribute;
	var content = "Proportion of Migrants Per City Population in" + year;
	//Replace legend content with updated content
	$('#temporal-legend').html(content);
    //Assign variable to get the values of the circles by calling getCircleValues function
	var circleValues = getCircleValues(map, attribute);
    //Run through each key in the array/dictionary to get the values
	for (var key in circleValues){
		//Get the radius by calling calcPropRadius
		var radius = calcPropRadius(circleValues[key]);
        //Select the id corresponding to each key and give it new attributes for position and radius
		$('#'+key).attr({
			cy: 140 - radius,
			r: radius
		});
        //Create an updating display of what the proportional symbols represent
		$('#'+key+'-text').text(Math.round(circleValues[key]*100)/100 + " %");
    };
    
    
};

//Function to determine the legend circle values 
function getCircleValues(map, attribute){
	//Start with min at highest possible and max at lowest possible number
	var min = Infinity,
		max = -Infinity;
    //For each layer on the map, figure out the attribute value
	map.eachLayer(function(layer){
		//Get the attribute value
		if (layer.feature){
			var attributeValue = Number(layer.feature.properties[attribute]);
		};
		//Test for min
		if (attributeValue < min){
			min = attributeValue;
		};
		//Test for max
		if (attributeValue > max){
			max = attributeValue;
		};
	});
	//Get mean
    var mean = (max + min) / 2;
    //Return a dictionary that can be references by its key
	return {
		max: max,
		mean: mean,
		min: min
	};
};

//Function to Create slider//
function createControls(map, attributes){
    var SequenceControl = L.Control.extend ({
        //Sequence Control is a new class to create sequence controls
        //Extend extends the parent class to the child class to inherit all methods and properties
        options: {
            position: 'bottomleft'
        },
        //onAdd creates an HTML element that the leaflet control, its child elements, attributes, and event listeners will be wrapped within
        onAdd: function (map) {
        //Create a div element with an assigned class
        var container = L.DomUtil.create('div', 'sequence-control-container');
        $(container).append("<span id='currentYear'>")
        //Add buttons that provide additional sequence control
        $(container).append('<button class="skip" id="reverse">Reverse</button>');
        //Create a range input element (Temporal slider)
        $(container).append("<input class='range-slider' type='range'>");
        $(container).append('<button class="skip" id="forward">Skip</button>');
        //Create Responsive filter display for lower limit
        $(container).append("<span id='lowerLimit'>")
        //Create filter sliders lower limits
        $(container).append("<input class='lowerLimit-slider' type='range'>")
        $(container).append("<input class='upperLimit-slider' type='range'>")
        $(container).append("<span id='upperLimit'>")
        //Kill any mouse event doubleclick listeners on the map
        $(container).on('mousedown dblclick', function(e){
            L.DomEvent.stopPropagation(e);
        });
        //Kill drag mouse listeners
        L.DomEvent.disableClickPropagation(container);
        return container;
        }
    }); 
    //Add Sequence control object to map
    map.addControl(new SequenceControl());
        //Define the attributes of the year slider and its buttons//
        $('.range-slider').attr({
            //Sets the number of slider values (starting and index 0)
            max: 9,
            //Sets the minimum number of slider values
            min: 1,
            //Sets the initial value of the slider bar
            value: 1,
            //Sets what the slider will increment or decrement by
            step: 1
        });
        //Set the current year of the slider start
        $('#currentYear').html(2009)
        //Style the buttons
        $('#reverse').html('<img src="img/backward.png">');
        $('#forward').html('<img src="img/forward.png">');
        //Add event listener for the slider
        $('.range-slider').on('input', function(){
            //Add display of year
            var index = $(this).val();
            //Converts the index into a number
            index++;
            index--;
            $('#currentYear').html(2009+index-1)
            // Call the filter function to get the updated layers
            updateFilter(map, attributes[$('.range-slider').val()], $('.lowerLimit-slider').val(), $('.upperLimit-slider').val());
            //Call proportional symbols to update temporally
            updatePropSymbols(map, attributes[index]);
        });
        //Click listener for buttons
        $('.skip').click(function(){
            //Get the old index value
            var index = $('.range-slider').val();
            //Increment or decrement depending on button clicked
            if ($(this).attr('id') == 'forward'){
                index++;
                //If past the last attribute, wrap around to first attribute
                index = index > 9 ? 1 : index;  
                //Update the year
                $('#currentYear').html(2009+index-1)

            } else if ($(this).attr('id') == 'reverse'){
                index--;
                //If past the first attribute, wrap around to last attribute
                index = index < 1 ? 9 : index;
                //Update the year
                $('#currentYear').html(2009+index-1)
            };
            //Update slider
            $('.range-slider').val(index);
             // Call the filter function to get the updated layers
            updateFilter(map, attributes[$('.range-slider').val()], $('.lowerLimit-slider').val(), $('.upperLimit-slider').val());
            //Call proportional symbols to update temporally
            updatePropSymbols(map, attributes[index]);
        });

        //Define attributes of filter sliders of lower limit
        $('.lowerLimit-slider').attr({
            max: 41,
            min: 2,
            value: 2,
            step: 1
        });
        // Add text to display current value of lowerlimit
        $('#lowerLimit').html($('.lowerLimit-slider').val() + "%");
        
        // Add an event listener for the slider
        $('.lowerLimit-slider').on('input', function(){
            // Update circle layers
            updateFilter(map, attributes[$('.range-slider').val()], $('.lowerLimit-slider').val(), $('.upperLimit-slider').val());

            $('#lowerLimit').html($('.lowerLimit-slider').val() + "%");
        });     
        //Define slider attributes
        $('.upperLimit-slider').attr({
            max: 41,
            min: 2,
            value: 41,
            step: 1
        });
        // Add text to display current value of the upper limit
        $('#upperLimit').html($('.upperLimit-slider').val() + "%");
        // Add an event listener for the slider
        $('.upperLimit-slider').on('input', function(){
            // Update visible cities
            updateFilter(map, attributes[$('.range-slider').val()], $('.lowerLimit-slider').val(), $('.upperLimit-slider').val());

            $('#upperLimit').html($('.upperLimit-slider').val() + "%");
        }); 
};

//Function to process the sequential data//
function processData(data){
//Set empty array to be filled with attributes
var attributes = [];
//Set properties to be the properties per feature which then contain all the attributes
var properties = data.features[0].properties;
//Run for loop to get all of the attributes which will be used as indexing tool later
    for (var attribute in properties){
        //Returns all attributes containing : since some data that is not normalized does not have a :
        if(attribute.includes(':') == true){
        //Retrieves each attribute and 'pushes' it to the array
        attributes.push(attribute)}
    }
    return attributes
};

//Function to retrieve GeoJSON data and place it on the map
function getData(map){
    //Load the data using ajax
    $.ajax("data/Foreigners.geojson",{
        datatype: 'json',
        //Define anonymous callback function
        success: function(response){
            //Set new variable attributes as the array created in processData to be passed as a parameter
            var attributes = processData(response);
            //Call Create Proportional Symbol function
            createPropSymbols(response,map, attributes);
            //Call create sequence controls function
            createControls(map, attributes);     
            //Call create Legend function
            createLegend(map, attributes);
            //Ensures that the legend loads with the first map initialization
            updateLegend(map, attributes[1]);
            //Creates Title
            createTitle(map)
            //Creates text
            createText(map)

        }
    });
};

//When the document os ready, create the map!
$(document).ready(createMap);