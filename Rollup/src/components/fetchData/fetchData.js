import Clusterize from 'clusterize.js';
import { clusterOptions } from '../map/options';
import buildList from '../buildList/buildList';
import checkData from './checkData';
import getRandom from './getRandom';
import MarkerClusterer from '../map/markerclusterer.js';
import pngsList from '../characters/iconsList';


const $ = jQuery;
let mapDragging = false;

const fetchData = (map, data, markers, url, domElement) => {
	let localMap = map;
	let listArray = [];
	let avatarURL = url;
	let j = 0;

	const pngs = Object.keys(pngsList);
	const maxZoomLevel = 14; 
	const scrollElement = $(domElement).find(".shiftmap-map-clusterise-wrapper").get(0);
	const contentElement = $(domElement).find(".shiftmap-clusterize-content-wrapper").get(0);

	// Create list
	let clusterize = new Clusterize({
		rows: null,
		rows_in_block: 2,
		scrollElem: scrollElement,
		contentElem: contentElement,
		no_data_text: 'No users within range'
	});

	// Add markers
	if (checkData(data)) {
		data.map((markerPosition) => {
			if (!markerPosition.latitude || !markerPosition.longitude) {
				console.warn('Could not find coordinates on data provided from userID: ', markerPosition.user_id);
			}
			else {
				if (j === pngs.length) {j = 0};

				const randKey = Math.floor((Math.random()*1000)/10 * (pngs.length/100));
				const img = pngs[randKey]||pngs[0];
				const imgSize = pngsList[img];

				let icon = {
					url: `${assetsPath}${img}.png`,
					size: new google.maps.Size(imgSize[0], imgSize[1]),
					origin: new google.maps.Point(0, 0),
					anchor: new google.maps.Point(17, 34),
					scaledSize: new google.maps.Size(imgSize[0], imgSize[1]),
				};

				let location = new google.maps.LatLng({
					lat: markerPosition.latitude + getRandom(0, 0.5), 
					lng: markerPosition.longitude + getRandom(0, 0.5)
				});

				const marker = new google.maps.Marker({
					position: location,
					map: localMap,
					icon: icon,
					optimized: false,
					zindex: 0,
					userID: markerPosition.user_id,
					userName: markerPosition.full_name,
					country: markerPosition.country,
					city: markerPosition.city,
					url: './img/person-example.png',
				});
				markers.push(marker);
				j++;
			}
		});

		// Create MarkerClusterer
		const markerCluster = new MarkerClusterer(localMap, markers, clusterOptions);

		// Updates list when viewport changes
		google.maps.event.addListener(localMap, 'bounds_changed', function() {
			setTimeout(() => {
				buildList(clusterize, listArray, markers, localMap, domElement);
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

		// Limit the zoom level
		google.maps.event.addListener(map, 'zoom_changed', function() {
			if (map.getZoom() > maxZoomLevel) map.setZoom(maxZoomLevel);
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

