

// Store our API endpoint as queryUrl.
var queryURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"


// Perform a GET request to the query URL/
d3.json(queryURL).then(function (data) {


    // Create the base layers.
    var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })
  
    var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });
  var earthquakes = new L.LayerGroup();
  // Create a baseMaps object.
  var baseMaps = {
      "Street Map": street,
      "Topographic Map": topo
    };
  
    // Create an overlay object to hold our overlay.
    var overlayMaps = {
      Earthquakes: earthquakes
    };
  
    // Create our map, giving it the streetmap and earthquakes layers to display on load.
    var myMap = L.map("map", {
      center: [37.09, -95.71],
      zoom: 7,
      layers: [street, earthquakes]
    });
  
     // Create a layer control.
    // Pass it our baseMaps and overlayMaps.
    // Add the layer control to the map.
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);

    // Once we get a response, send the data.features object to the createFeatures function.
    createFeatures(data.features);
  
  function createFeatures(earthquakeData) {
    function getRadius(Magnitude){

        if (Magnitude== 0)
        {
            return 1 
        }
    return Magnitude * 4;

    }
    
    function getColor(depth){
    
    switch(true){
    
        case depth>90:
            return "maroon";
            case depth > 70:
                return "red";
            case depth > 50:
                return "orange";
            case depth > 30:
                return "yellow";
            case depth > 10:
                return "lightgreen";
        default:
            return "pink"
    
    }
    }
    
    function styleInfo(feature){
    
        return{
            opacity: 1,
            fillOpacity: 1,
            fillColor: getColor(feature.geometry.coordinates[2]),
            color: "black",
            radius: getRadius(feature.properties.mag),
            weight: 0.5
        }
    
    }
    L.geoJSON(earthquakeData,{
    
        pointToLayer: function(feature, latlng){
    
            return L.circleMarker(latlng);
        },
    
        style: styleInfo,

     // Activate pop-up data 
     onEachFeature: function (feature, layer) {
        layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place + "<br>Depth: " + feature.geometry.coordinates[2]);
}
}).addTo(earthquakes);

earthquakes.addTo(myMap);

// Add the legend showing the correlation between colors and depth

let legend = L.control({position: 'bottomleft'});
    legend.onAdd = function() {
      div = L.DomUtil.create('div', 'info legend'),
      depth = [-10, 10, 30, 50, 70, 90];
      labels = [];
      legendHead = "<h3 style='text-align: center'>Earthquake Depth</h3>"

      div.innerHTML = legendHead

    for (let i = 0; i < depth.length; i++) {
      labels.push('<ul style="background-color:' + getColor(depth[i] + 1) + '"> <span>' + depth[i] + 
      (depth[i + 1] ? '&ndash;' + depth[i + 1] + '' : '+') + '</span></ul>');
    }

      div.innerHTML += "<ul>" + labels.join("") + "</ul>";

    return div;

    };
    legend.addTo(myMap);
}
});


