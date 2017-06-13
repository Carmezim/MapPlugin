/*eslint-disable */
import '../../../styles/main.v2.scss';

import createSearchBox from '../searchBox/createSearchBox';
import searchBox from '../searchBox/searchBox';
import promoAreaLogged from '../promoArea/promoAreaLogged';
import promoArea from '../promoArea/promoArea';
import fetchData from '../fetchData/fetchData';
import createMap from './createMap';
import defineCenter from './defineCenter';
import placeCharacters from '../characters/placeCharacters';
import checkAssetsPath from '../characters/checkAssetsPath';
import mapStyles, {mapDetailStyles} from './mapStyles';

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

// Global listeners
let listeners = [];

// Map center
const london = defineCenter(51.521723, -0.134581);
addCenterToOptions(london);

// Map
let map;

// Map bounds 
let bounds;

// Search Box
let sBox;

const $ = window.jQuery;

if(!$){
	throw 'jQuery is required for this map plugin';
}

const initialize = (domElement, data, avatarURL, assetsPath, logged) => {
	domElement =  domElement || null;
	data       =  data || null;
	avatarURL  =  avatarURL || null;
	assetsPath =  assetsPath || null;
	logged = logged || null;

	map = createMap(domElement);

	sBox = createSearchBox(map, domElement);

	// Fetch dataset
	fetchData(map, data, markers, avatarURL, domElement);

	// Create Search Box
	searchBox(map, places, sBox, placeMarkers, icon, setIcon);

	// Render promo area
	logged ? 
	promoAreaLogged(function(){console.log('change your location clicked')}, assetsPath) :
	promoArea(function(){console.log('Add your marker clicked!')}, markers.length, assetsPath);
	
	// Panel closed by default
	panelClosedOnLoad(domElement);

	bindEvents( domElement, map );
	
	bindClickEvent( domElement, data );

	// Add characters
	setTimeout(() => {
		if (checkAssetsPath(assetsPath)) {
			placeCharacters(map, assetsPath);
		}
	}, 100 );

	// Open panel on zoom
	google.maps.event.addListenerOnce(map, 'zoom_changed', function () {
		const $panel = $(domElement).find('.shiftmap-map-clusterise-user-panel');
			$panel.removeClass('default')
	});

	// Display air balloon
	airBalloon(domElement, logged, assetsPath);

	// Plot location	
	onPlotLocation(function ( place, marker ) {
		alert('Plotted! ' + place.formatted_address);
		console.log(place, marker);
	});

	// Show whole map on click
	showMap(domElement, map);
};


// Plot location listener
const onPlotLocation = (callback) => {
	google.maps.event.addListener(map, 'shiftms_plotted_location', callback);
};


// Air Balloon
const airBalloon = (domElement, logged, assetsPath) => {
	let balloon = $(domElement).find('.shiftmap-airballoon-image');
	if (logged) {
		balloon.attr('src', `${assetsPath}promo/map-hot-air-balloon.png`);
	}
	else { balloon.attr('src', `${assetsPath}promo/plot-yourself.png`); }
};


// Balloon click listener
const clickAirBalloon = (domElement, callback) => {
	const balloon = $(domElement).find('.shiftmap-airballoon-image');
		balloon.click(callback);
}

// Insert markers after map is loaded
const insertMarker = (lat, lng, imgURL, imgWidth, imgHeight, clickEvent) => {
	lat = lat || null;
	lng = lng || null;
	imgURL = imgURL.toString() || null;
	imgWidth = Math.abs(imgWidth) || null;
	imgHeight = Math.abs(imgHeight) || null;
	clickEvent = clickEvent || null;

	if (typeof clickEvent !== 'function') {
		throw 'Click event must be a function!';
	}

	if (!Number.isInteger(imgHeight) || !Number.isInteger(imgWidth)) {
		throw 'Icon dimensions must be integers!';
	}

	if (typeof lat !== 'number' || typeof lng !== 'number') {
		throw 'Coordinates must be numbers!';
	}

	google.maps.event.addListener(map, 'idle', function() {
		const location = new google.maps.LatLng(parseFloat(lat).toFixed(6), parseFloat(lng).toFixed(6));
		const icon = {
			url: `${imgURL}`,
			size: new google.maps.Size(imgWidth, imgHeight),
			origin: new google.maps.Point(0, 0),
			anchor: new google.maps.Point(17, 34),
			scaledSize: new google.maps.Size(imgWidth, imgHeight),
		};
		const marker = new google.maps.Marker({
			position: location,
			icon: icon,
			map: map,
			optimized: false,
			zindex: 0,
			url: '',
		}).addListener('click', clickEvent);
	});
};


// Panel closed on page load
const panelClosedOnLoad = (domElement) => {
	const $panel = $(domElement).find('.shiftmap-map-clusterise-user-panel');
		$panel.toggleClass('default');
};


// Move map to specified coordinates , dk why i built this though
const changeMapLocation = (lat, lng) => {
	let location = defineCenter(lat, lng);
	map.panTo(location);
};


// Detects when map is loaded
const onMapReady = (callback) => {
	if (typeof callback === 'function') {
		google.maps.event.addListenerOnce(map, 'idle', callback);
	}
	else {
		console.error('provide a callback function');
	}
};


// Fires event when map changes locations
const onMapChangeLocation = (callback) => {
	if (typeof callback === 'function') {
		google.maps.event.addListener(map, 'idle', callback);
	}
	else {
		console.error('provide a callback function');
	}
};


// Builds assets URL in acceptable format
const defineURL = (url, imgFormat) => {
	return [url.toString(), imgFormat.toString()];
};


// Display zoomed out map 
const showMap = (domElement, map) => {
	const showMapButton = $(domElement).find('.shiftmap-showmap');
	const topLeft = new google.maps.LatLng(68.870136, -160.789405);
	const bottomRight = new google.maps.LatLng(-44.879507, 178.880419)
	const bounds = new google.maps.LatLngBounds(topLeft, bottomRight);
	
	const onClick = () => {
		showMapButton.click(function() {
			map.fitBounds(bounds)
		});
	}
	google.maps.event.addListener(map, 'idle', onClick);
};


const bindEvents = ( domElement, map ) => {
	const $panel = $(domElement).find('.shiftmap-map-clusterise-user-panel');

	$panel.find('.shiftmap-map-toggle-panel').click(function(){
		$(this).removeClass('alert-user');
		if ($panel.hasClass('default')) {
			$panel.removeClass('default')
		}
		else {
			$panel.toggleClass('closed');
		}
	});

	//	Change markers on zoom
	google.maps.event.addListener(map, 'zoom_changed', function() {
		let zoom = map.getZoom();
		if( zoom > 7 ){
			map.setOptions({styles: mapDetailStyles});
		} else {			
			map.setOptions({styles: mapStyles});
		}
	});

	$(domElement).on('openpanel', () => {
		$panel.removeClass('closed');
	});

	google.maps.event.addListenerOnce(map, 'idle', function(){
	   geolocationAPI(map);
	});

};


// Define map dimensions
const setWidthHeight = (width, height) => {
	$('.shiftmap-wrapper').width(width).height(height);
	$('.shiftmap-map').width(width).height(height);
	const map = $('.shiftmap-map').get(0);
	google.maps.event.trigger(map, 'resize');	
	google.maps.event.addListenerOnce(map, 'idle', function() {
		google.maps.event.trigger(map, 'resize'); 
	});
};


const onClickUser = (fn, args) => {
	if( fn ){
		listeners.push(fn);
	} else {
		listeners.map((e) => e(args))
	}
}


const bindClickEvent = ( domElement, data ) => {
	$(domElement).on('click', '[data-clickuser]', function(){
		const id = $(this).data('clickuser');
		let find;
		data.map((e) => {
			if( e.user_id === id ){
				find = e;
			}
		});
		onClickUser(false, find);
	});
}


const geolocationAPI = ( map ) => {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function (position) {
			const initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
			map.setCenter(initialLocation);
			map.setZoom(5);
		});
	}
};


export {
	initialize,
	insertMarker,
	setWidthHeight,
	onMapReady,
	onMapChangeLocation,
	defineURL,
	changeMapLocation,
	onClickUser,
	onPlotLocation,
	clickAirBalloon
};