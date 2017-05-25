import Clusterize from 'clusterize.js';
import { icon, clusterOptions } from '../map/options';
import buildList from '../buildList/buildList';
import checkData from './checkData';


const getData = (map, data, markers) => {
	let localMap = map;
	let listArray = [];
	let localData = typeof data !== 'string' ? '/datasets/' + data.toString() : '/datasets/' + data;
	// create list
	let clusterize = new Clusterize({
		rows: null,
		rows_in_block: 2,
		scrollId: 'scrollArea',
		contentId: 'contentArea',
	});

	function getRandom(min, max) {
			return Math.random() * (max - min) + min;
	}

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
							url:'https://github.com/identicons/luke-siedle.png'
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

export default getData;
