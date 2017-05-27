import Symbol from '../map/svgMarker';
import svgList from './svgIconList';

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
				console.log(Symbol(svgList[j], 300, 300, '#000000'))
				// Character object 
				let character = {
					position: new google.maps.LatLng(capitals[i].longitude, capitals[i].latitude),
					icon: {
						url: Symbol(svgList[j], 300, 300, '#000000'),
						size: new google.maps.Size(500, 500),
						origin: new google.maps.Point(0, 0),
						anchor: new google.maps.Point(17, 34),
						scaledSize: new google.maps.Size(25, 25),
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