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
	
	/*
	 we would have a parameter passed for the icons list instead of importing locally e.g.
	 placeCharacters = (map, assetsURL, iconsList) => {}
	 const templateRoot = '<?php echo get_template_directory_uri() ?>'
	 const pngs = Object.keys(iconsList);
	 then below on the character object we could handle as commented
	*/

	
	fetch("./datasets/capitals.json")
		.then((response) => response.json())
		.then((capitals) => {
			capitals.map((capital) => {
				if (j === pngsList.length) { j = 0;	}
				const randKey = Math.floor((Math.random()*1000)/10 * (pngs.length/100));
				const img = pngs[randKey]||pngs[0];
				const imgSize = pngsList[img];
				
				// Character object 
				let character = {
					position: new google.maps.LatLng(capital.longitude, capital.latitude),
					icon: {
						// url: `${templateRoot}${img}.png`,
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
			});

			// Shuffle the capitals
			shuffle( capitalsMarkers );

			// Initial visibility
			setVisibleMarkers(localMap.getZoom());

		}).catch((err) => {
			console.log(err);
	});

	//	Change markers on zoom
	google.maps.event.addListener(localMap, 'zoom_changed', function() {
		setVisibleMarkers(localMap.getZoom());
	});

	function setVisibleMarkers( zoom ){
		const maxZoom = 8;
		const max = capitalsMarkers.length * (zoom/maxZoom);
		let y = 0;
		capitalsMarkers.map((marker, i) => {
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