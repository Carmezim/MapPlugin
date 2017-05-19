document.write('<script src="http://' + (location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1"></' + 'script>');
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(factory());
}(this, (function () { 'use strict';

// Cluster markers SVG
var _Symbol = function _Symbol(id, width, height, fill) {
  var marker_svg = {
    marker: {
      p: 'M244.31,0C256.87,2.49,269.59,4.38,282,7.58c35.11,9.1,65.15,27.29,90.44,53.07C401.19,90,419.56,125,427,165.51q12.58,68.25-18.92,130.11Q319.47,469.54,230.64,643.36c-.73,1.42-1.59,2.78-2.79,4.87-1.41-2.43-2.5-4.14-3.42-5.93C165.11,526,104.62,410.27,46.93,293.17,8.94,216.08,18.43,141.32,71.6,74c34-43,80.17-66.6,134.87-72.86A44.62,44.62,0,0,0,211.37,0Z',
      v: '0 0 430.62 648.23'
    }
  };
  return 'data:image/svg+xml;base64,' + window.btoa('<svg xmlns="http://www.w3.org/2000/svg" height="' + height + '" viewBox="0 0 430.62 648.23" width="' + width + '" ><g><path fill="' + fill + '" d="' + marker_svg[id].p + '" /></g></svg>');
};

// Icon
var icon = {
  url: _Symbol('marker', 25, 25, '#f16667'),
  size: new google.maps.Size(71, 71),
  origin: new google.maps.Point(0, 0),
  anchor: new google.maps.Point(17, 34),
  scaledSize: new google.maps.Size(25, 25)
};

// Map options
var mapOptions = {
  zoom: 4,
  center: null,
  mapTypeId: google.maps.MapTypeId.ROADMAP
};

// Cluster markers style
var clusterStyles = [{
  anchor: [13, 35],
  textColor: 'white',
  textSize: '16',
  url: _Symbol('marker', 75, 75, '#f16667'),
  height: 75,
  width: 75
}, {
  anchor: [20, 42],
  textColor: 'white',
  textSize: '18',
  url: _Symbol('marker', 100, 100, '#f16667'),
  height: 100,
  width: 100
}, {
  anchor: [20, 43.5],
  textColor: 'white',
  textSize: '24',
  url: _Symbol('marker', 125, 125, '#f16667'),
  height: 125,
  width: 125
}];

// Cluster options
var clusterOptions = {
  maxZoom: 15,
  gridSize: 75,
  styles: clusterStyles
};

// Set new icon
var setIcon = function setIcon(newIcon) {
  icon = newIcon;
  return icon;
};

var addCenterToOptions = function addCenterToOptions(center) {
  mapOptions.center = center;
};

var createMap = function createMap() {
  return new google.maps.Map(document.getElementById("map"), mapOptions);
};

var defineCenter = function defineCenter(lat, lng) {
  return new google.maps.LatLng(parseFloat(lat).toFixed(6), parseFloat(lng).toFixed(6));
};

var searchBox = function searchBox(map, places, sBox, placeMarkers, icon, setIcon) {

  var sbMap = map;
  // Bias searchbox results towards current map's viewport
  sbMap.addListener('bounds_changed', function () {
    sBox.setBounds(sbMap.getBounds());
  });

  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  sBox.addListener('places_changed', function () {
    places = searchBox.getPlaces();
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

      var newIcon = {
        url: place.icon,
        size: icon.size,
        origin: icon.origin,
        anchor: icon.anchor,
        scaledSize: icon.scaledSize
      };

      var otherIcon = setIcon(newIcon);

      placeMarkers.push(new google.maps.Marker({
        map: sbMap,
        icon: otherIcon,
        title: place.name,
        position: place.geometry.location,
        setMap: sbMap
      }));

      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    sbMap.fitBounds(bounds);
  });
};

var createSearchBox = function createSearchBox(map) {
  var localMap = map;
  // Create search box and link it to UI
  var input = document.getElementById('pac-input');
  localMap.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
  var searchBox = new google.maps.places.SearchBox(input);

  return searchBox;
};

var getData = function getData(map, data, markers) {
  var localMap = map;
  var localData = typeof data !== "string" ? "/datasets/" + data.toString() : "/datasets/" + data;

  if (isJSON(localData)) {
    fetch(localData).then(function (response) {
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
            map: localMap,
            icon: icon
          });
          markers.push(marker);
        }
      });
      // create MarkerClusterer
      var markerCluster = new MarkerClusterer(localMap, markers, clusterOptions);
    }).catch(function (err) {
      if (err) throw err;
    });
  }
};

var isJSON = function isJSON(dataset) {
  try {
    JSON.stringify(dataset);
    return true;
  } catch (err) {
    console.error('Data is not JSON format!');
    return false;
  }
};

// Map center
var london = defineCenter(51.521723, -0.134581);
addCenterToOptions(london);

// Map
var map = createMap();

// Search Box
var sBox = createSearchBox(map);

// Places markers
var placeMarkers = [];

// Places holder
var places = void 0;

// Markers holder
var markers = [];

var initialize = function initialize(data) {
  // fetch dataset
  getData(map, data, markers);

  // Create Search Box
  searchBox(map, places, sBox, placeMarkers, icon, setIcon);
};

// Import styles (injected into head)

// Import modules
window.document.body.onload = addElement;

function addElement() {
  // create map div
  // let mapDiv        = document.createElement('div');
  //     mapDiv.id     = 'map';

  // create search box input
  // let searchBox             = document.createElement('input');
  //     searchBox.id          = 'pac-input';
  //     searchBox.type        = 'text';
  //     searchBox.placeholder = 'Search Box';

  var element = document.createElement('script');
  element.innerHTML = initialize("coordinates.json");

  // add the newly created element and its content into the DOM
  var currentTag = document.getElementById("title");
}
google.maps.event.addDomListener(window, "load", addElement);

})));
//# sourceMappingURL=maps.bundle.js.map
