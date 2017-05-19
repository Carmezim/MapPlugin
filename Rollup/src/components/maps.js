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


// Map
let map = createMap();

// Map center
const london = defineCenter(51.521723, -0.134581);
addCenterToOptions(london);

// Search Box
const sBox = createSearchBox(map);

// Places markers
let placeMarkers = [];

// Places holder
let places = sBox.getPlaces();


const initialize = (data) => {
  // fetch dataset
  fetchData(data);
  
  // Create Search Box
  searchBox(map, places, sBox, placeMarkers, icon, setIcon);
};

export default initialize;