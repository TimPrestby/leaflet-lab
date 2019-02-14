/*Stylesheet by Timothy Prestby 2019*/
/*Quick guide*/
 /////////OBJECTS////////
 var mymap=L.map('mapid').setView([51.505,-0.09], 13);
 //Set view returns the map object to the current view
 //L.map will load the map to the particular div element

   //add tile layer to map using mapbox
   L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
   //z is the zoom level
   //x is the horizontal coordinate
   //y is the vertical coordinate
   //id is the project id  
   attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
     maxZoom: 18,
     //sets the max zoom level of the map
     id: 'mapbox.streets',
     //the id of the map to copy
     accessToken: 'pk.eyJ1IjoicHJlc3RpbW9qIiwiYSI6ImNqczNmYWE2bzJmNTYzeW8zOXNlMnVpOGwifQ.OrEG7gIMeP3N3sMaNY3EGw'
 }).addTo(mymap);
 //addTo is a method that takes an argument of what we are adding the object to

 var marker = L.marker([51.5, -0.09]).addTo(mymap);
     //Creates a variable marker(a clickable icon) at the given coordinates and adds it to the map

     var circle = L.circle([51.508, -0.11], {
         //creates a circle object at the passed coordinates
     color: 'red',
     fillColor: '#f03',
     fillOpacity: 0.5,
     radius: 500
 }).addTo(mymap);
 //creates a circle with the given style inputs and adds it to the map div  

     var polygon = L.polygon([
     [51.509, -0.08],
     [51.503, -0.06],
     [51.51, -0.047]
 ]).addTo(mymap);
 //creates a polygon that has the given vertices and adds it to the map

 marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();
 //openpopup method immediately opens the popup
 //bind popup 'binds' the popup to the marker object(variable) defined above
 circle.bindPopup("I am a circle.");
 //binds a popup to the circle object we created
 polygon.bindPopup("I am a polygon.");
 //creates popups bound to the polygon

 var popup = L.popup()
 //loads a popup object to the screen
 .setLatLng([51.5, -0.09])
 //sets the point where the popup opens
 .setContent("I am a standalone popup.")
 //sets what will be contained in the popup
 .openOn(mymap);
 //creates a popup as a layer that is not attached to an object and will open when the map layer is loaded



///////FUNCTIONS/////
 var popup = L.popup();
//initiates a popup
 function onMapClick(e) {
     //creates a new function
     popup
     //defines properties of the variable
         .setLatLng(e.latlng)
         //first argument passed that sets the latitude and longitude where click occured
         .setContent("You clicked the map at " + e.latlng.toString())
         //converts the numbers to string and adds content to the popup depdning on where you click
         .openOn(mymap);
         //adds the popup on 'mymap' 
}

 mymap.on('click', onMapClick);
 //e is the parameter that is passed to the function. An alert using the property of e pops up to show where you clicked
 //mymap.on(___) calls the onMapClick Function when the map is clicked



