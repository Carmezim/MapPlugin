import {
  icon,
  mapOtions,
  clusterOptions,
  setIcon
} from 'options';


// Map
let map;

// Search Box input
let input;

// Search Box
let sBox;

// Map center
const london = new google.maps.LatLng(51.521723, -0.134581);

// Places markers
let placeMarkers = [];

// Clusterer markers
const markers = [];



function createMap() {
  map = new google.maps.Map(document.getElementById("map"), mapOptions);
}

function createSearchBox() {
  // Create search box and link it to UI
  input = document.getElementById('pac-input');
  sBox = new google.maps.places.SearchBox(input);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
}

const searchBox = () => {

  // Places Search Box
  createSearchBox();

  // Bias searchbox results towards current map's viewport
  map.addListener('bounds_changed', function() {
    sBox.setBounds(map.getBounds());
  });

  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  sBox.addListener('places_changed', function() {
    let places = sBox.getPlaces();

    if (places.length == 0) {
      return;
    }

    // Clear out the old markers.
    placeMarkers.forEach(function(marker) {
      marker.setMap(null);
    });
    placeMarkers = [];

    // For each place, get the icon, name and location.
    const bounds = new google.maps.LatLngBounds();
    places.forEach(function(place) {
      if (!place.geometry) {
        console.log("Returned place contains no geometry");
        return;
      }

      let newIcon = {
        url: place.icon,
        size: icon.size,
        origin: icon.origin,
        anchor: icon.anchor,
        scaledSize: icon.scaledSize
      };

      setIcon(newIcon);

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
};

export const setGoogleMaps = (apiKey) => {
  addEventListener('DOMContentLoaded', () => {
    if (document.querySelectorAll('#map').length > 0) {
      // KEY AIzaSyCR527NNTzbSOMy4D6ZFDLtEfsGl7Z3Q2I
      const script      = document.createElement('script');
            script.type = 'text/javascript';
            script.src  = 'https://maps.googleapis.com/maps/api/js?key=' + apiKey + '&libraries=places';

      document.body.appendChild(script);
    }
  })
};

const isJSON = (dataset) => {
  try {
    JSON.stringify(dataset);
    return true;
  }
  catch(err) {
    console.error('Data is not JSON format!');
    return false;
  }
};

export const getData = (data) => {

  data = typeof data !== 'string' ? 'datasets/' + data.toString() : 'datasets/' + data;

  if(isJSON(data)) {
    fetch(data)
      .then((response) => response.json())
      .then(function (dataset) {
        // not to confuse 'map' as in array.proptype.map below with an instance of a google map
        // add locations
        dataset.map((markerPosition) => {
          if (!markerPosition.latitude || !markerPosition.longitude) {
            console.log('meh');
          }
          else {
            let location = new google.maps.LatLng({lat: markerPosition.latitude, lng: markerPosition.longitude});

            const marker = new google.maps.Marker({
              position: location,
              map: map,
              icon: icon
            });
            markers.push(marker);
          }
        });
        // create MarkerClusterer
        const markerCluster = new MarkerClusterer(map, markers, clusterOptions);
      })
      .catch((err) => {
        if (err) throw err
    });
  }
};

export const initialize = (data) => {

  const t0 = performance.now();

  //Create Map
  createMap();

  // Fetch data
  getData(data);
  
  // Create Search Box
  searchBox();

  const t1 = performance.now();
  console.log("Call to initialize took " + (t1 - t0) + " milliseconds.");

};
