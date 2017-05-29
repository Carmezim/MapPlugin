import Symbol from '../map/svgMarkers';
import pngsList from './iconsList';
import '../../polyfills/promise-polyfill';
import 'whatwg-fetch';


const placeCharacters = (map) => {
	const capitalsMarkers = [];
	const icons = [];
	const pngs = Object.keys(pngsList);
	let j = 0;
	let localMap = map;


	fetch("./datasets/capitals.json")
		.then((response) => response.json())
		.then((capitals) => {
			for (let i = 0; i < capitals.length; i++, j++) {
				if (j === pngsList.length) { j = 0;	}

				const img = pngs[j]||pngs[0];
				const imgSize = pngsList[img];
				
				// Character object 
				let character = {
					position: new google.maps.LatLng(capitals[i].longitude, capitals[i].latitude),
					icon: {
						url: `../img/${img}.png`,
						size: new google.maps.Size(imgSize[0], imgSize[1]),
						origin: new google.maps.Point(0, 0),
						anchor: new google.maps.Point(17, 34),
						scaledSize: new google.maps.Size(imgSize[0], imgSize[1]),
					},
				}
				// Add a marker for each character
				capitalsMarkers.push(	new google.maps.Marker({
						position: character.position,
						map: localMap,
						icon: character.icon,
						visible: false
					})
				);
				
				icons.push(character);		
			}
		}).catch((err) => {
			console.log(err);
	});
	//	Change markers on zoom */
	google.maps.event.addListener(localMap, 'zoom_changed', function() {
		let zoom = localMap.getZoom();
		// iterate over markers and call setVisible
		capitalsMarkers.map((marker) => {
			marker.setVisible(zoom > 5);
		});
	});
}

export default placeCharacters;