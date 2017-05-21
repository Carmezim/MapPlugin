import createSearchBox from '../searchBox/createSearchBox';
import searchBox from '../searchBox/searchBox';
import fetchData from '../fetchData/fetchData';
import createMap from './createMap';
import defineCenter from './defineCenter';
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

export default initialize;


const listTag = document.createElement('div');
