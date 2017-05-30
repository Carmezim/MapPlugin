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

				const img = pngs[j]||pngs[0];
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
		}).catch((err) => {
			console.log(err);
	});

	//	Change markers on zoom
	google.maps.event.addListener(localMap, 'zoom_changed', function() {
		let zoom = localMap.getZoom();
		
		airportsMarkers.map((marker) => {
			marker.setVisible(zoom > 7);
		});
	});
}

export default placeCharacters;
