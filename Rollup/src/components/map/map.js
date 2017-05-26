/*eslint-disable */
import '../../../styles/main.scss';

import createSearchBox from '../searchBox/createSearchBox';
import searchBox from '../searchBox/searchBox';
import fetchData from '../fetchData/fetchData';
import createMap from './createMap';
import defineCenter from './defineCenter';
// import setGoogleMaps from './setGoogleMaps';
import {
	icon,
	setIcon,
	addCenterToOptions
} from './options';

// Places markers
let placeMarkers = [];

// Places holder
let places;

// Markers holder
let markers = [];

// Map center
const london = defineCenter(51.521723, -0.134581);
addCenterToOptions(london);

// Map
const map = createMap();

// Search Box
let sBox = createSearchBox(map);

// const setMaps = (apiKey) => {
// 	setGoogleMaps(apiKey);
// };


const initialize = (data) => {
	// fetch dataset
	fetchData(map, data, markers);

	// Create Search Box
	searchBox(map, places, sBox, placeMarkers, icon, setIcon);
};

const setHeight = (height) => {
	let list = document.getElementById('map');
	list.style='height:' + height.toString() + ';';
};

const setWidth = (width) => {
	let list = document.getElementById('map');
	list.style='width:' + width.toString() + ';';
};

export {
	initialize,
	setHeight,
	setWidth
};
