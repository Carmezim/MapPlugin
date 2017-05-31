import Clusterize from 'clusterize.js';
import { icon, clusterOptions } from '../map/options';
import buildList from '../buildList/buildList';
import checkData from './checkData';
import getRandom from './getRandom';
import MarkerClusterer from '../map/markerclusterer.js';


const $ = jQuery;
let mapDragging = false;

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
				console.warn('Could not find coordinates on data provided from userID: ', markerPosition.user_id);
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
					url: './img/person-example.png'
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

		google.maps.event.addListener(map, "drag", () => {
			mapDragging = true;
		});

		google.maps.event.addListener(map, "dragend", () => {
			setTimeout(() => mapDragging = false, 50 );
		});

		bindListeners( map, markerCluster );
	}
};

export default fetchData;

const bindListeners = ( map, markerCluster ) => {
	google.maps.event.addListener(markerCluster, "clusterclick", (cluster) => {
		// Stops event propagation
		// Ugly but can't find event.preventDefault
		if(mapDragging){	
			throw "Cannot click while dragging"
		}
	});
}