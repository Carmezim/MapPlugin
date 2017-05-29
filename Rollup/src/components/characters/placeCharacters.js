import Symbol from '../map/svgMarkers';
import svgList, {pngList} from './svgIconList';
import '../../polyfills/promise-polyfill';
import 'whatwg-fetch';


const placeCharacters = (map) => {
	const icons = [];
	let j = 0;
	let localMap = map;
	fetch("./datasets/capitals.json")
		.then((response) => response.json())
		.then((capitals) => {
			for (let i = 0; i < capitals.length; i++, j++) {
				if (j === svgList.length) {
					j = 0;	
				}

				const pngs = Object.keys(pngList);
				const img = pngs[j]||pngs[0];
				const imgSize = pngList[img];
				
				// Character object 
				let character = {
					position: new google.maps.LatLng(capitals[i].longitude, capitals[i].latitude),
					icon: {
						url: `../img/${img}.png`, //Symbol(svgList[j], 100, 100, '#000000'),
						size: new google.maps.Size(imgSize[0], imgSize[1]),
						origin: new google.maps.Point(0, 0),
						anchor: new google.maps.Point(17, 34),
						scaledSize: new google.maps.Size(imgSize[0], imgSize[1]),
					},
				}
				// Add a marker for each character
				const marker = new google.maps.Marker({
					position: character.position,
					map: localMap,
					icon: character.icon,
				});

				icons.push(character);		
			}

		}).catch((err) => {
			console.log(err);
	});
}

export default placeCharacters;