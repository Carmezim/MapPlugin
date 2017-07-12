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
	getIcon,
	setIcon,
	addCenterToOptions
} from './options';

const $ = window.jQuery;

if(!$){
	throw 'jQuery is required for this map plugin';
}

class Map {
	constructor( settings ){
		$.extend(this, settings);
		this.markers = this.markers || [];
		this.placeMarkers = this.placeMarkers || [];
		this.init();
	}

	init(){
		this.listeners = [];
		this.wrapper = this.domElement;
		this.map = createMap(this.wrapper);
		this.sBox = createSearchBox(this.map, this.domElement);
		this.avatarURL = this.avatarURL || defineURL('https://github.com/identicons/', '.png');

		panelClosedOnLoad(this.domElement);
		bindEvents( this.domElement, this.map );
		bindClickEvent( this.domElement, this.data, this.listeners );

		// Other initiliasation
		this.initFetchData();
		this.initSearchBox();
		this.initPromoAreas();
		this.placeCharacters();
		this.initMapFullDisplay();
		this.initMapGenericBehaviour();
	}

	initFetchData(){
		fetchData(
			this.map, 
			this.data, 
			this.markers, 
			this.avatarURL, 
			this.domElement,
			this.assetsPath
		);
	}

	initSearchBox(){
		searchBox(
			this.map, 
			this.places, 
			this.sBox, 
			this.placeMarkers, 
			this.getIcon, 
			this.setIcon
		);
	}

	initPromoAreas(){
		// Render promo area
		if(this.isLoggedIn){
			promoAreaLogged(() => {
				console.log('change your location clicked')
			}, this.assetsPath)
		} else {
			promoArea(() => {
				console.log('Add your marker clicked!')
			}, this.markers.length, this.assetsPath)
		}

		// Display air balloon
		airBalloon(this.domElement, this.isLoggedIn, this.assetsPath);
	}

	placeCharacters(){
		// Add characters
		setTimeout(() => {
			if (checkAssetsPath(this.assetsPath)) {
				placeCharacters(this.map, this.assetsPath);
			}
		}, 100 );
	}

	initMapFullDisplay(){
		// Show whole map on click
		showMap(this.domElement, this.map);
	}

	initMapGenericBehaviour(){
		// Open panel on zoom
		google.maps.event.addListenerOnce(this.map, 'zoom_changed', function () {
			const $panel = $(this.domElement).find('.shiftmap-map-clusterise-user-panel');
			$panel.removeClass('default')
		});
	}

	// Returns an object of public events
	// Used for manipulating the map after load
	// Or listening to events
	public(){
		const self = this;

		return {
			enablePlotLocationMode: () => {
				enablePlotLocationMode(this.domElement);
			},
			setWidthHeight: ( width, height ) => {
				setWidthHeight( width, height, this.map );
			},
			setMapLocation: ( lat, lng ) => {
				changeMapLocation( lat, lng, this.map );
			},
			onMapReady : ( callback ) => {
				onMapReady( callback, this.map );
			},
			onAirBalloonClick: ( callback ) => {
				onAirBalloonClick(this.domElement, callback);
			},
			onMapChangeLocation: ( callback ) => {
				onMapChangeLocation( callback, this.map );
			},
			onPlotLocation: ( callback ) => {
				onPlotLocation(this.map, callback );
			},
			onClickUser : ( callback ) => {
				onClickUser( callback, null, this.listeners);
			},
			insertMarker: ( lat, lng, imgURL, clickEvent) => {
				insertMarker(lat, lng, imgURL, clickEvent, this.map);
			}
		};
	}

}

const initialize = (settings) => {
	const map = new Map(settings);
	return map.public();
};


// Plot location listener
const onPlotLocation = (map, callback) => {
	google.maps.event.addListener(map, 'shiftms_plotted_location', callback);
};


// Air Balloon
const airBalloon = (domElement, logged, assetsPath) => {
	let balloon = $(domElement).find('.shiftmap-airballoon-image');
	let dismiss = $(domElement).find('.balloon-dismiss');
	$(dismiss).click(( e ) => {
		$(balloon).remove();
	});
	if (logged) {
		balloon.remove();
		//balloon.attr('src', `${assetsPath}promo/map-hot-air-balloon.png`);
	}
	else { balloon.attr('src', `${assetsPath}promo/map-hot-air-balloon.png?v=1`); }
};


// Balloon click listener
const onAirBalloonClick = (domElement, callback) => {
	const balloon = $(domElement).find('.shiftmap-airballoon-image');
	balloon.click( callback );
}

// Insert markers after map is loaded
const insertMarker = (lat, lng, imgURL, clickEvent, map) => {
	lat = lat || null;
	lng = lng || null;
	imgURL = imgURL.toString() || null;
	clickEvent = clickEvent || function(){};

	if (typeof clickEvent !== 'function') {
		throw 'Click event must be a function!';
	}

	if (typeof lat !== 'number' || typeof lng !== 'number') {
		throw 'Coordinates must be numbers!';
	}

	var img = new Image();
	img.onload = () => {
		const imgWidth = Math.abs(img.width/2) || null;
		const imgHeight = Math.abs(img.height/2) || null;

		const location = new google.maps.LatLng(parseFloat(lat).toFixed(6), parseFloat(lng).toFixed(6));
		const icon = {
			url: `${imgURL}`,
			size: new google.maps.Size(imgWidth, imgHeight),
			origin: new google.maps.Point(0, 0),
			anchor: new google.maps.Point(imgWidth/2, imgHeight),
			scaledSize: new google.maps.Size(imgWidth, imgHeight),
		};
		const marker = new google.maps.Marker({
			position: location,
			icon: icon,
			map: map,
			// optimized: false,
			// zindex: 0,
			url: '',
		}).addListener('click', function(){
			clickEvent( marker, imgURL );
		});

	}

	img.src = imgURL;
};


// Panel closed on page load
const panelClosedOnLoad = (domElement) => {
	const $panel = $(domElement).find('.shiftmap-map-clusterise-user-panel');
		$panel.toggleClass('default');
};


// Move map to specified coordinates , dk why i built this though
const changeMapLocation = (lat, lng, map) => {
	let location = defineCenter(lat, lng);
	map.panTo(location);
};


// Detects when map is loaded
const onMapReady = (callback, map) => {
	if (typeof callback === 'function') {
		google.maps.event.addListenerOnce(map, 'idle', callback);
	}
	else {
		console.error('provide a callback function');
	}
};


// Fires event when map changes locations
const onMapChangeLocation = (callback, map) => {
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
const setWidthHeight = (width, height, map) => {
	$('.shiftmap-wrapper').width(width).height(height);
	$('.shiftmap-map').width(width).height(height);
	google.maps.event.trigger(map, 'resize');	
	google.maps.event.addListenerOnce(map, 'idle', function() {
		google.maps.event.trigger(map, 'resize'); 
	});
};


const onClickUser = (fn, args, listeners ) => {
	if( fn ){
		listeners.push(fn);
	} else {
		listeners.map((e) => e(args))
	}
}


const bindClickEvent = ( domElement, data, listeners ) => {
	$(domElement).on('click', '[data-clickuser]', function(){
		const id = $(this).data('clickuser');
		let find;
		data.map((e) => {
			if( e.user_id === id ){
				find = e;
			}
		});
		listeners.map((fn) => fn(find));
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

const enablePlotLocationMode = (wrapper) => {
	$(wrapper).find('.shiftmap-promo-area').addClass('in');
	$(wrapper).find('.shiftmap-map-clusterise-user-panel').removeClass('default closed');
}


export {
	initialize
};

/*
	insertMarker,
	setWidthHeight,
	onMapReady,
	onMapChangeLocation,
	defineURL,
	changeMapLocation,
	onClickUser,
	onPlotLocation,
	onAirBalloonClick,
	enablePlotLocationMode
*/