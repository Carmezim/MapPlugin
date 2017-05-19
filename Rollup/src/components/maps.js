import createMap from './createMap';
import defineCenter from './defineCenter';
import searchBox from './searchBox';
import createSearchBox from './createSearchBox';
import fetchData from './fetchData';
import setGoogleMaps from './setGoogleMaps';
import {
  icon,
  mapOptions,
  clusterOptions,
  setIcon,
  addCenterToOptions
} from './options';

// Map center
const london = defineCenter(51.521723, -0.134581);
addCenterToOptions(london);

// Map
let map = createMap();

// Search Box
const sBox = createSearchBox(map);

// Places markers
let placeMarkers = [];

// Places holder
let places;

// Markers holder
let markers = [];

const initialize = (data) => {
  // fetch dataset
  fetchData(map, data, markers);
  
  // Create Search Box
  searchBox(map, places, sBox, placeMarkers, icon, setIcon);
};

google.maps.event.addDomListener(window, "load", initialize);


export default initialize;