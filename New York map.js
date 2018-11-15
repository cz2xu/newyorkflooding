// Initialize map
mapboxgl.accessToken = 'pk.eyJ1IjoiY3oydSIsImEiOiJjam5ldXUwdHowZTM0M3FwN2lobGIwMnNiIn0.iAbJXUNX-2-ipOcGBbOWUg'; // replace this value with your own access token from Mapbox Studio

var map = new mapboxgl.Map({
	container: 'map', // this is the ID of the div in index.html where the map should go
    center: [-73.959,40.755], // set the centerpoint of the map programatically. Note that this is [longitude, latitude]!
    zoom: 11.07, // set the default zoom programatically
	style: 'mapbox://styles/cz2u/cjo90360y01zl2sk3m1uwvwkp', // replace this value with the style URL from Mapbox Studio
	customAttribution: 'NYC Open Data (https://opendata.cityofnewyork.us/)', // Custom text used to attribute data source(s)
});

// Show modal when About button is clicked
$("#about").on('click', function() { // Click event handler for the About button in jQuery, see https://api.jquery.com/click/
    $("#screen").fadeToggle(); // shows/hides the black screen behind modal, see https://api.jquery.com/fadeToggle/
    $(".modal").fadeToggle(); // shows/hides the modal itself, see https://api.jquery.com/fadeToggle/
});

$(".modal>.close-button").on('click', function() { // Click event handler for the modal's close button
    $("#screen").fadeToggle();
    $(".modal").fadeToggle();
});


// Legend
var layers = [ // an array of the possible values you want to show in your legend
];

var colors = [ // an array of the color values for each legend item
];

// for loop to create individual legend items
for (i=0; i<layers.length; i++) {
    var layer =layers[i]; // name of the current legend item, from the layers array
    var color =colors[i]; // color value of the current legend item, from the colors array 
    
    var itemHTML = "<div><span class='legend-key'></span><span>" + layer + "</span></div>"; // create the HTML for the legend element to be added
    var item = $(itemHTML).appendTo("#legend"); // add the legend item to the legend
    var legendKey = $(item).find(".legend-key"); // find the legend key (colored circle) for the current item
    legendKey.css("background", color); // change the background color of the legend key
}

// 10.25 starts here----------------------------------------------
// 
// INFO WINDOW CODE 

    map.on('mousemove', function(e) {   // Event listener to do some code when the mouse moves, see https://www.mapbox.com/mapbox-gl-js/api/#events. 

        var parks = map.queryRenderedFeatures(e.point, {    
            layers: ['cville-parks']    // replace 'cville-parks' with the name of the layer you want to query (from your Mapbox Studio map, the name in the layers panel). For more info on queryRenderedFeatures, see the example at https://www.mapbox.com/mapbox-gl-js/example/queryrenderedfeatures/. Documentation at https://www.mapbox.com/mapbox-gl-js/api/#map#queryrenderedfeatures.
        });
              
        if (parks.length > 0) {   // if statement to make sure the following code is only added to the info window if the mouse moves over a state

            $('#info-window-body').html('<h3><strong>' + parks[0].properties.PARKNAME + '</strong></h3><p>' + parks[0].properties.PARK_TYPE + ' PARK</p><img class="park-image" src="img/' + parks[0].properties.PARKNAME + '.jpg">');

        } else {    // what shows up in the info window if you are NOT hovering over a park

            $('#info-window-body').html('<p>Not hovering over a <strong>park</strong> right now.</p>');
            
        }

    });

// POPUPS CODE

    // Create a popup on click 
    map.on('click', function(e) {   // Event listener to do some code when user clicks on the map

      var stops = map.queryRenderedFeatures(e.point, {  // Query the map at the clicked point. See https://www.mapbox.com/mapbox-gl-js/example/queryrenderedfeatures/ for an example on how queryRenderedFeatures works and https://www.mapbox.com/mapbox-gl-js/api/#map#queryrenderedfeatures for documentation
        layers: ['cville-bus-stops']    // replace this with the name of the layer from the Mapbox Studio layers panel
    });

      // if the layer is empty, this if statement will exit the function (no popups created) -- this is a failsafe to avoid non-functioning popups
      if (stops.length == 0) {
        return;
    }

    // Initiate the popup
    var popup = new mapboxgl.Popup({ 
        closeButton: true, // If true, a close button will appear in the top right corner of the popup. Default = true
        closeOnClick: true, // If true, the popup will automatically close if the user clicks anywhere on the map. Default = true
        anchor: 'bottom', // The popup's location relative to the feature. Options are 'top', 'bottom', 'left', 'right', 'top-left', 'top-right', 'bottom-left' and 'bottom-right'. If not set, the popup's location will be set dynamically to make sure it is always visible in the map container.
        offset: [0, -15] // A pixel offset from the centerpoint of the feature. Can be a single number, an [x,y] coordinate, or an object of [x,y] coordinates specifying an offset for each of the different anchor options (e.g. 'top' and 'bottom'). Negative numbers indicate left and up.
    });

      // Set the popup location based on each feature
      popup.setLngLat(stops[0].geometry.coordinates);

      // Set the contents of the popup window
      popup.setHTML('<h3>Stop ID: ' + stops[0].properties.stop_id + '</h3><p>' + stops[0].properties.stop_name + '</p>');
            // stops[0].properties.stop_id will become the title of the popup (<h3> element)
            // stops[0].properties.stop_name will become the body of the popup


        // popup.setHTML('<p>' + stops[0].properties.stop_name + '</p>')
        

      // Add the popup to the map 
      popup.addTo(map);  // replace "map" with the name of the variable in line 4, if different
  });


// 11.01 starts here----------------------------------------------

// SHOW/HIDE LAYERS
// See example at https://www.mapbox.com/mapbox-gl-js/example/toggle-layers/
    
    var layers = [  // an array of the layers you want to include in the layers control (layers to turn off and on)

        // [layerMachineName, layerDisplayName]
        // layerMachineName is the layer name as written in your Mapbox Studio map layers panel
        // layerDisplayName is the way you want the layer's name to appear in the layers control on the website
        ['waterfront-access-plans', 'Waterfront'],                      // layers[0]
        ['publicly-accessible', 'Public'],                              // layers[1][1] = 'Parks'
        ['sandy-inundation-zone', 'Sandy inundation zone'],     
        ['sea-level-rise-maps', 'Sea level rise maps'],
        ['background 1', 'Map background']
        // add additional live data layers here as needed
    ]; 

    // functions to perform when map loads
    map.on('load', function () {
        
        
        for (i=0; i<layers.length; i++) {

            // add a button for each layer
            $("#layers-control").append("<a href='#' class='active button-default' id='" + layers[i][0] + "'>" + layers[i][1] + "</a>"); // see http://api.jquery.com/append/
        }

        // show/hide layers when button is clicked
        $("#layers-control>a").on('click', function(e) {

                var clickedLayer = e.target.id;

                e.preventDefault();
                e.stopPropagation();

                var visibility = map.getLayoutProperty(clickedLayer, 'visibility');  // see https://www.mapbox.com/mapbox-gl-js/api/#map#getlayoutproperty
                console.log(visibility);

                if (visibility === 'visible') {
                    map.setLayoutProperty(clickedLayer, 'visibility', 'none');  // see https://www.mapbox.com/mapbox-gl-js/api/#map#setlayoutproperty
                    $(e.target).removeClass('active');
                } else {
                    $(e.target).addClass('active');
                    map.setLayoutProperty(clickedLayer, 'visibility', 'visible'); // see https://www.mapbox.com/mapbox-gl-js/api/#map#setlayoutproperty
                }
        });
    });


// CHANGE LAYER STYLE
// Refer to example at https://www.mapbox.com/mapbox-gl-js/example/color-switcher/
    
    var swatches = $("#swatches");

    var colors = [  // an array of color options for the bus stop ponts
    ]; 

    var layer = 'cville-bus-stops';

    colors.forEach(function(color) {
        var swatch = $("<button class='swatch'></button>").appendTo(swatches);

        $(swatch).css('background-color', color); 

        $(swatch).on('click', function() {
            map.setPaintProperty(layer, 'circle-color', color); // 'circle-color' is a property specific to a circle layer. Read more about what values to use for different style properties and different types of layers at https://www.mapbox.com/mapbox-gl-js/style-spec/#layers
        });

        $(swatches).append(swatch);
    });

// 11.08 starts here----------------------------------------------
// SCROLL TO ZOOM THROUGH SITES
    
    // A JavaScript object containing all of the data for each site "chapter" (the sites to zoom to while scrolling)
   
    var chapters = {
        'darden-towe': {
            name: "Hurricane Sandy",
            description: "In 2012, Hurricane Sandy tore a path of destruction through the North East. In some ways, it was an event that revealed the fragile nature of the city's electrical and mechanical infrastructures. Hurricane Sandy (unofficially referred to as Superstorm Sandy) was the deadliest and most destructive hurricane of the 2012 Atlantic hurricane season. Inflicting nearly $70 billion (2012 USD) in damage, it was the second-costliest hurricane on record in the United States until surpassed by Hurricanes Harvey and Maria in 2017. The eighteenth named storm, tenth hurricane, and second major hurricane of the year, Sandy was a Category 3 storm at its peak intensity when it made landfall in Cuba. While it was a Category 2 hurricane off the coast of the Northeastern United States, the storm became the largest Atlantic hurricane on record (as measured by diameter, with tropical-storm-force winds spanning 900 miles (1,400 km)). At least 233 people were killed along the path of the storm in eight countries.",
            imagepath: "img/Hurricane Sandy.jpg",
            bearing: 0,
            center: [ -73.984,40.716],
            zoom: 12.28,
            pitch: 45
        },
        'mcguffey-park': {
            name: "Sea level rise",
            description: "At least since 1880, the average global sea level has been rising, with about an 18 cm (7.1 in) rise from 1897 to 1997. More precise satellite based data show about a 7.5 cm (3.0 in) accelerating rise in sea level from 1993 to 2017. This is due mostly to anthropogenic global warming that is driving the thermal expansion of seawater while melting land-based ice sheets and glaciers. This trend is expected to accelerate during the 21st century. Projecting future sea level has always been challenging, due to our imperfect understanding of many aspects of the climate system. As climate research leads to improved computer models, projections have consistently increased.",
            imagepath: "img/Rising-sea-level.jpg",
            bearing: 0,
            center: [ -73.960,40.736],
            zoom: 13.30,
            pitch: 45
        },
        'mcintire-park': {
            name: "Public Parks",
            description: "Central Park is an urban park in Manhattan, New York City. It is located between the Upper West Side and Upper East Side, roughly bounded by Fifth Avenue on the east, Central Park West (Eighth Avenue) on the west, Central Park South (59th Street) on the south, and Central Park North (110th Street) on the north. Central Park is the most visited urban park in the United States, with 40 million visitors in 2013, and one of the most filmed locations in the world. In terms of area, Central Park is the fifth-largest park in New York City, covering 843 acres (341 ha).",
            imagepath: "img/central park.jpg",
            bearing: 20,
            center: [ -73.969,40.773],
            zoom: 13.60,
            pitch: 60
        },
    };

//  array notation works like this  
//  var thisarray = [
//      1,
//      ['one','two'],
//      3,
//      4,
//      5
//  ];
//  var secondelement =thisarray[1][1]  // specify the second element in the array
//  console.log(secondelement);

// object notation works like this
//    console.log(chapters['rivanna-river']);
//    console.log(chapters['mcintire-park']['center']);
//console.log(Object.keys(chapters));    
//console.log(Object.keys(chapters)[0]);
    

    
    // Add the chapters to the #chapters div on the webpage
//for (i=0; i<variable.length; i++) {
    // do some code here
//}
// for (var key in objectname) {
    // do some code here
// }

    for (var key in chapters) {
        var newChapter = $("<div class='chapter' id='" + key + "'></div>").appendTo("#chapters");
        var chapterHTML = $("<h2>" + chapters[key]['name'] + "</h2><img src='" + chapters[key]['imagepath'] + "'><p>" + chapters[key]['description'] + "</p>").appendTo(newChapter);
    }


    $("#chapters").on('scroll', function(e) {

        var chapterNames = Object.keys(chapters);
        
        for (var i = 0; i < chapterNames.length; i++) {

            var chapterName = chapterNames[i];
            var chapterElem = $("#" + chapterName);

            if (chapterElem.length) {

                if (checkInView($("#chapters"), chapterElem, true)) {
                    setActiveChapter(chapterName);
                    $("#" + chapterName).addClass('active');

                    break;

                } else {
                    $("#" + chapterName).removeClass('active');
                }
            }
        }
    });

    var activeChapterName = '';
    
    function setActiveChapter(chapterName) {
        if (chapterName === activeChapterName) return;

        map.flyTo(chapters[chapterName]);

        activeChapterName = chapterName;
    }

    function checkInView(container, elem, partial) {
        var contHeight = container.height();
        var contTop = container.scrollTop();
        var contBottom = contTop + contHeight ;

        var elemTop = $(elem).offset().top - container.offset().top;
        var elemBottom = elemTop + $(elem).height();


        var isTotal = (elemTop >= 0 && elemBottom <=contHeight);
        var isPart = ((elemTop < 0 && elemBottom > 0 ) || (elemTop > 0 && elemTop <= container.height())) && partial ;

        return  isTotal  || isPart ;
    }


// ADD GEOJSON DATA (static layers)

    // See example at https://www.mapbox.com/mapbox-gl-js/example/live-geojson/
    var staticUrl = 'https://opendata.arcgis.com/datasets/edaeb963c9464edeb14fea9c7f0135e3_11.geojson';
    map.on('load', function () {
        
        window.setInterval(function() { // window.setInterval allows you to repeat a task on a time interval. See https://www.w3schools.com/jsref/met_win_setinterval.asp
            map.getSource('polling-places').setData(staticUrl); // https://www.mapbox.com/mapbox-gl-js/api/#map#getsource        
        }, 2000); // 2000 is in milliseconds, so every 2 seconds. Change this number as needed but be aware that more frequent requests will be more processor-intensive, expecially for large datasets.
        
        map.addSource('polling-places', { type: 'geojson', data: staticUrl });
        map.addLayer({
            "id": "polling-places",
            "type": "circle",
            "source": "polling-places",
            "paint": {
                "circle-radius": 15, 
                "circle-color": "blue"
            }
        });
    });

