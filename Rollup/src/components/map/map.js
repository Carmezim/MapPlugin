/*eslint-disable */
import '../../../styles/main.v2.scss';

import createSearchBox from '../searchBox/createSearchBox';
import searchBox from '../searchBox/searchBox';
import fetchData from '../fetchData/fetchData';
import createMap from './createMap';
import defineCenter from './defineCenter';
import placeCharacters from '../characters/placeCharacters';
import checkAssetsPath from '../characters/checkAssetsPath';
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
let map;

// Search Box
let sBox;

const $ = window.jQuery;

const initialize = (domElement, data, avatarURL, assetsPath) => {
	domElement =  domElement || null;
	data       =  data || null;
	avatarURL  =  avatarURL || null;
	assetsPath =  assetsPath || null;
	

	map = createMap(domElement);

	sBox = createSearchBox(map, domElement);
	
	// fetch dataset
	fetchData(map, data, markers, avatarURL, domElement);

	// Create Search Box
	searchBox(map, places, sBox, placeMarkers, icon, setIcon);

	bindEvents( domElement );
	
	// Add characters
	setTimeout(() => {
		if (checkAssetsPath(assetsPath)) {
			placeCharacters(map, assetsPath);
		}
	}, 100 );
};


const changeMapLocation = (lat, lng) => {
	let location = defineCenter(lat, lng);
		
	map.panTo(location);
};


const onMapReady = (callback) => {
	if (typeof callback === 'function') {
		google.maps.event.addListenerOnce(map, 'idle', callback);
	}
	else {
		console.error('provide a callback function');
	}
};


const onMapChangeLocation = (callback) => {
	if (typeof callback === 'function') {
		google.maps.event.addListener(map, 'idle', callback);
	}
	else {
		console.error('provide a callback function');
	}
}


const defineURL = (url, imgFormat) => {
	return [url.toString(), imgFormat.toString()];
}


const bindEvents = ( domElement ) => {
	const $panel = $(domElement).find('.shiftmap-map-clusterise-user-panel');
	$panel.find('.shiftmap-map-toggle-panel').click(() => {
		$panel.toggleClass('closed');
	});
}


const setWidthHeight = (width, height) => {
	$('.shiftmap-wrapper').width(width).height(height);
	$('.shiftmap-map').width(width).height(height);
	const map = $('.shiftmap-map').get(0);
	google.maps.event.trigger(map, 'resize');	
	google.maps.event.addListenerOnce(map, 'idle', function() {
		google.maps.event.trigger(map, 'resize'); 
	});
};



export {
	initialize,
	setWidthHeight,
	onMapReady,
	onMapChangeLocation,
	defineURL,
	changeMapLocation
};