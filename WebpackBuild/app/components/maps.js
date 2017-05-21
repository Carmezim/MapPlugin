import fetchData from 'fetchData';
import setGoogleMaps from 'setGoogleMaps'
import
import {
  icon,
  mapOtions,
  clusterOptions,
  setIcon
} from 'app/components/options';


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

const createMap = () => {
  map = new google.maps.Map(document.getElementById("map"), mapOptions);
};

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



export default initialize = (data) => {
  const t0 = performance.now();

  //Create Map
  createMap();

  // fetch dataset
  fetchData(data);
  
  // Create Search Box
  searchBox();

  const t1 = performance.now();
  console.log("Call to initialize took " + (t1 - t0) + " milliseconds.");
  }
};
