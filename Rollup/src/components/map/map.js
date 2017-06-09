/*eslint-disable */
import '../../../styles/main.v2.scss';

import createSearchBox from '../searchBox/createSearchBox';
import searchBox from '../searchBox/searchBox';
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

// Search Box
let sBox;

const $ = window.jQuery;

if(!$){
	throw 'jQuery is required for this map plugin';
}

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

	panelClosedOnLoad(domElement);

	bindEvents( domElement, map );
	
	bindClickEvent( domElement, data );

	// Add characters
	setTimeout(() => {
		if (checkAssetsPath(assetsPath)) {
			placeCharacters(map, assetsPath);
		}
	}, 100 );
};


const insertMarker = (lat, lng, imgURL, imgWidth, imgHeight) => {
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
			optimized: false,
			zindex: 0,
			url: '',
		}).setMap(map);
	});
	// google.maps.event.addDomListener(marker, 'click', clickEvent);
};


// Panel closed on page load
const panelClosedOnLoad = (domElement) => {
	const $panel = $(domElement).find('.shiftmap-map-clusterise-user-panel');
		$panel.toggleClass('default');
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
};


const defineURL = (url, imgFormat) => {
	return [url.toString(), imgFormat.toString()];
};


const bindEvents = ( domElement, map ) => {
	const $panel = $(domElement).find('.shiftmap-map-clusterise-user-panel');

	$panel.find('.shiftmap-map-toggle-panel').click(() => {
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
	onClickUser
};