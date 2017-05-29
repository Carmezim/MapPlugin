import Clusterize from 'clusterize.js';
import { icon, clusterOptions } from '../map/options';
import buildList from '../buildList/buildList';
import checkData from './checkData';
import getRandom from './getRandom';
import MarkerClusterer from '../map/markerclusterer.js';

import '../../polyfills/promise-polyfill';
import 'whatwg-fetch';

const $ = jQuery;

const fetchData = (map, data, markers, url, domElement) => {
	let localMap = map;
	let listArray = [];
	let avatarURL = url;
	let localData;


	if (typeof data === 'array') {
		localData = JSON.parse(data);
	}
	else if (typeof data !== 'string') {
		localData = '/datasets/' + data.toString();
	}
	else {
		localData = '/datasets/' + data;
	}

	const scrollElement = $(domElement).find(".shiftmap-map-clusterise-wrapper").get(0);
	const contentElement = $(domElement).find(".shiftmap-clusterize-content-wrapper").get(0);

	// create list
	let clusterize = new Clusterize({
		rows: null,
		rows_in_block: 2,
		scrollElem: scrollElement,
		contentElem: contentElement,
	});


	if (checkData(localData)) {
		fetch(localData)
			.then((response) => response.json())
			.then((dataset) => {
				// Add locations
				// Check for geocoordinates in dataset
				dataset.map((markerPosition) => {
					if (!markerPosition.latitude || !markerPosition.longitude) {
						console.log('meh');
					}
					else {
						let location = new google.maps.LatLng({
							lat: markerPosition.latitude + getRandom(0, 0.5), 
							lng: markerPosition.longitude + getRandom(0, 0.5)
						});
						const marker = new google.maps.Marker({
							position: location,
							map: localMap,
							icon: icon,
							optimized: false,
							userID: markerPosition.user_id,
							userName: markerPosition.full_name,
							country: markerPosition.country,
							city: markerPosition.city,
							url: avatarURL[0] + 'luke-siedle' + avatarURL[1]
						});
						markers.push(marker);
					}
				});
			// Create MarkerClusterer
			const markerCluster = new MarkerClusterer(localMap, markers, clusterOptions);
			// Updates list when viewport changes
			google.maps.event.addListener(localMap, 'bounds_changed', function() {
				setTimeout(() => {
					buildList(clusterize, listArray, markers, localMap);
				}, 200 );
			});
			 google.maps.event.addListener(map, "idle", function() {
			 	setTimeout(() => {
				 	google.maps.event.trigger(map, 'resize');
				}, 200 );
			});
		})
		.catch((err) => {
			if (err) throw err;
		});
	}
};

export default fetchData;
