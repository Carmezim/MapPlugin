import '../../polyfills/promise';
import 'whatwg-fetch';
import Symbol from '../map/svgMarkers';
import pngsList from './iconsList';


const placeCharacters = (map, assetsPath) => {
	const airportsMarkers = [];
	const icons = [];
	const localMap = map;
	const pngs = Object.keys(pngsList);
	let j = 0;
	

	fetch("./datasets/airports.json")
		.then((response) => response.json())
		.then((airports) => {					
			airports.map((airport) => {
				if (j === pngs.length) {j = 0};
				const randKey = Math.floor((Math.random()*1000)/10 * (pngs.length/100));
				const img = pngs[randKey]||pngs[0];
				const imgSize = pngsList[img];

				// Character object 
				let character = {
					position: new google.maps.LatLng(airport.latitude, airport.longitude),
					icon: {
						url: `${assetsPath}${img}.png`,
						size: new google.maps.Size(imgSize[0], imgSize[1]),
						origin: new google.maps.Point(0, 0),
						anchor: new google.maps.Point(17, 34),
						scaledSize: new google.maps.Size(imgSize[0], imgSize[1]),
					},
				}
				// Add a marker for each character
				airportsMarkers.push(	new google.maps.Marker({
						position: character.position,
						map: localMap,
						icon: character.icon,
						visible: false
					})
				);			
				icons.push(character);
				j++;
			});

			// Shuffle the markers
			shuffle( airportsMarkers );

			// Initial visibility
			setVisibleMarkers(localMap.getZoom());

		}).catch((err) => {
			console.log(err);
	});

	//	Change markers on zoom
	google.maps.event.addListener(localMap, 'zoom_changed', function() {
		setVisibleMarkers(localMap.getZoom());
		let zoom = localMap.getZoom();
	});

	function setVisibleMarkers( zoom ){
		const maxZoom = 8;
		const max = airportsMarkers.length * (zoom/maxZoom/20);
		let y = 0;
		airportsMarkers.map((marker, i) => {
			marker.setVisible(i < max);
			i < max && (y++);
		});
		console.log(`${y} markers display at ${zoom} with max at ${max}`);
	}
}

export default placeCharacters;

/**
 * Shuffles array in place. ES6 version
 * @param {Array} a items The array containing the items.
 */
function shuffle(a) {
    for (let i = a.length; i; i--) {
        let j = Math.floor(Math.random() * i);
        [a[i - 1], a[j]] = [a[j], a[i - 1]];
    }
}
