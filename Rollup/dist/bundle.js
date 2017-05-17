(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('options')) :
	typeof define === 'function' && define.amd ? define(['exports', 'options'], factory) :
	(factory((global.Maps = global.Maps || {}),global.options));
}(this, (function (exports,options) { 'use strict';

clusterOptions = options.clusterOptions;
mapOptions = options.mapOptions;
icon = options.icon;

// Map
var map = void 0;

// Search Box input
var input = void 0;

// Search Box
var sBox = void 0;

// Map center
var london = new google.maps.LatLng(51.521723, -0.134581);

// Places markers
var placeMarkers = [];

// Clusterer markers
var markers = [];

function createMap() {
  map = new google.maps.Map(document.getElementById("map"), mapOptions);
}

function createSearchBox() {
  // Create search box and link it to UI
  input = document.getElementById('pac-input');
  sBox = new google.maps.places.SearchBox(input);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
}

function searchBox() {

  // Places Search Box
  createSearchBox();

  // Bias searchbox results towards current map's viewport
  map.addListener('bounds_changed', function () {
    sBox.setBounds(map.getBounds());
  });

  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  sBox.addListener('places_changed', function () {
    var places = sBox.getPlaces();

    if (places.length == 0) {
      return;
    }

    // Clear out the old markers.
    placeMarkers.forEach(function (marker) {
      marker.setMap(null);
    });
    placeMarkers = [];

    // For each place, get the icon, name and location.
    var bounds = new google.maps.LatLngBounds();
    places.forEach(function (place) {
      if (!place.geometry) {
        console.log("Returned place contains no geometry");
        return;
      }

      var placeIcon = {
        url: place.icon,
        size: icon.size,
        origin: icon.origin,
        anchor: icon.anchor,
        scaledSize: icon.scaledSize
      };

      options.setIcon(placeIcon);

      placeMarkers.push(new google.maps.Marker({
        map: map,
        icon: icon,
        title: place.name,
        position: place.geometry.location
      }));

      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    map.fitBounds(bounds);
  });
}
//
// export function setGoogleMaps(){
// 	addEventListener('DOMContentLoaded', function () {
//   	if (document.querySelectorAll('#map').length > 0) {
//     	const script      = document.createElement('script');
//       	    script.type = 'text/javascript';
//         	  script.src  = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCR527NNTzbSOMy4D6ZFDLtEfsGl7Z3Q2I&libraries=places&callback=initialize';
//
//     document.body.appendChild(script);
//   	}
// 	})
// }


function isJSON(dataset) {
  try {
    JSON.stringify(dataset);
    return true;
  } catch (err) {
    console.error('Data is not JSON format!');
    return false;
  }
}

function getData(data) {

  data = typeof data !== 'string' ? 'datasets/' + data.toString() : 'datasets/' + data;

  if (isJSON(data)) {
    fetch(data).then(function (response) {
      return response.json();
    }).then(function (dataset) {
      // not to confuse 'map' as in array.proptype.map below with an instance of a google map
      // add locations
      dataset.map(function (markerPosition) {
        if (!markerPosition.latitude || !markerPosition.longitude) {
          console.log('meh');
        } else {
          var location = new google.maps.LatLng({ lat: markerPosition.latitude, lng: markerPosition.longitude });

          var marker = new google.maps.Marker({
            position: location,
            map: map,
            icon: icon
          });
          markers.push(marker);
        }
      });
      // create MarkerClusterer
      var markerCluster = new MarkerClusterer(map, markers, clusterOptions);
    }).catch(function (err) {
      if (err) throw err;
    });
  }
}

function initialize(data) {

  var t0 = performance.now();

  //Create Map
  createMap();

  // Fetch data
  getData(data);

  // Create Search Box
  searchBox();

  var t1 = performance.now();
  console.log("Call to initialize took " + (t1 - t0) + " milliseconds.");
}

exports.getData = getData;
exports.initialize = initialize;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=bundle.js.map
