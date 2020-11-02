
//Create map with Mapbox access token

var world_map = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v9/tiles/256/{z}/{x}/{y}?" +
    "access_token=pk.eyJ1IjoibG9yaXdhcmQiLCJhIjoiY2tnaDUyc3I4MDBhcTJwcG14MjA2Yjk2dSJ9.PGsipSPjhEJc9GqUEFc5pg");


var map = L.map("mapid", {
    center: [37.09, -95.71],
    zoom: 5,
    layers: [world_map]
});



//Choose earthquake Geoson date from USGS website

var earthquakes = new L.LayerGroup();


d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", function (data) {


    function styleInfo(feature) {
        return {
            opacity: 1,
            fillOpacity: 1,
            fillColor: getColor(feature.properties.mag),
            color: "#000000",
            radius: getRadius(feature.properties.mag),
            stroke: true,
            weight: 0.5
        };
    }



    // Define the color of the marker based on the magnitude of the earthquake.

    function getColor(magnitude) {
        switch (true) {
            case magnitude > 5:
                return "#ea2c2c";
            case magnitude > 4:
                return "#ea822c";
            case magnitude > 3:
                return "#ee9c00";
            case magnitude > 2:
                return "#eecc00";
            case magnitude > 1:
                return "#d4ee00";
            default:
                return "#98ee00";
        }
    }



    //Create data markers to reflect the magnitude of the earthquake by their size and and depth of the earthquake by color. 
    //Add GeoJSON earthquake data and include popups that provide additional information about the earthquake when a marker is clicked.

    function getRadius(magnitude) {
        if (magnitude === 0) {
            return 1;
        }

        return magnitude * 3;
    }


    L.geoJson(data, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng);
        },
        style: styleInfo,
        onEachFeature: function (feature, layer) {
            layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
        }

    }).addTo(earthquakes);

    earthquakes.addTo(map);



    //Create a legend that will provide context for the map data.

    var legend = L.control({
        position: "bottomright"
    });


    legend.onAdd = function () {
        var div = L
            .DomUtil
            .create("div", "info legend");

        var grades = [0, 1, 2, 3, 4, 5];
        var colors = [
            "#98ee00",
            "#d4ee00",
            "#eecc00",
            "#ee9c00",
            "#ea822c",
            "#ea2c2c"
        ];


        for (var i = 0; i < grades.length; i++) {
            div.innerHTML += "<i style='background: " + colors[i] + "'></i> " +
                grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
        }
        return div;
    };


    legend.addTo(map);


});