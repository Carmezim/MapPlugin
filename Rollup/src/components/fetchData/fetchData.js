import Clusterize from 'clusterize.js';
import { icon, clusterOptions } from '../map/options';
import buildList from '../buildList/buildList';
import checkData from './checkData';
import getRandom from './getRandom';
import MarkerClusterer from '../map/markerclusterer.js';

import '../../polyfills/promise-polyfill';

const $ = jQuery;

const fetchData = (map, data, markers, url, domElement) => {
	let localMap = map;
	let listArray = [];
	let avatarURL = url;

	const scrollElement = $(domElement).find(".shiftmap-map-clusterise-wrapper").get(0);
	const contentElement = $(domElement).find(".shiftmap-clusterize-content-wrapper").get(0);

	// Create list
	let clusterize = new Clusterize({
		rows: null,
		rows_in_block: 2,
		scrollElem: scrollElement,
		contentElem: contentElement,
	});

	// Add markers
	if (checkData(data)) {
		data.map((markerPosition) => {
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
	}
};

export default fetchData;
