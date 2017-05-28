import Clusterize from 'clusterize.js';
import { icon, clusterOptions } from '../map/options';
import buildList from '../buildList/buildList';
import checkData from './checkData';
import getRandom from './getRandom';
import '../../polyfills/promise-polyfill';
import 'whatwg-fetch';


const fetchData = (map, data, markers, url) => {
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

	// create list
	let clusterize = new Clusterize({
		rows: null,
		rows_in_block: 2,
		scrollId: 'scrollArea',
		contentId: 'contentArea',
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
				buildList(clusterize, listArray, markers, localMap);
			});
			 google.maps.event.addListener(map, "idle", function() {
				 google.maps.event.trigger(map, 'resize');
			});
		})
		.catch((err) => {
			if (err) throw err;
		});
	}
};

export default fetchData;
