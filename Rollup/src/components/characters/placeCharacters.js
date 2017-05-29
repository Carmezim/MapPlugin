import Symbol from '../map/svgMarkers';
import pngsList from './iconsList';
import '../../polyfills/promise-polyfill';
import 'whatwg-fetch';


const placeCharacters = (map, assetsURL) => {
	const capitalsMarkers = [];
	const icons = [];
	const localMap = map;
	const pngs = Object.keys(pngsList);
	let j = 0;
	

	fetch("./datasets/capitals.json")
		.then((response) => response.json())
		.then((capitals) => {
			capitals.map((capital) => {
				if (j === pngsList.length) { j = 0;	}

				const img = pngs[j]||pngs[0];
				const imgSize = pngsList[img];
				
				// Character object 
				let character = {
					position: new google.maps.LatLng(capital.longitude, capital.latitude),
					icon: {
						url: `${assetsURL}${img}.png`, //`../img/${img}.png`,
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
				j++;
			})
		}).catch((err) => {
			console.log(err);
	});

	//	Change markers on zoom
	google.maps.event.addListener(localMap, 'zoom_changed', function() {
		let zoom = localMap.getZoom();
		
		capitalsMarkers.map((marker) => {
			marker.setVisible(zoom > 5);
		});
	});
}

export default placeCharacters;