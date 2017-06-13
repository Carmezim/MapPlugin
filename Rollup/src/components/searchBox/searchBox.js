import {iconPlace} from '../map/options';
import confirmLocationContent from './confirmLocation.html';

const searchBox = (map, places, sBox, placeMarkers, icon, setIcon) => {

	// Bias searchbox results towards current map's viewport
	map.addListener('bounds_changed', function() {
		sBox.setBounds(map.getBounds());
	});

	// Listen for the event fired when the user selects a prediction and retrieve
	// more details for that place.
	sBox.addListener('places_changed', function() {

		const isPlotSearch = $('.shiftmap-promo-area.in').length;

		places = sBox.getPlaces();
		if (places.length == 0) {
			return;
		}

		// Clear out the old markers.
		placeMarkers.forEach(function(marker) {
			marker.setMap(null);
		});
		placeMarkers = [];

		// For each place, get the icon, name and location.
		let bounds = new google.maps.LatLngBounds();
		places.forEach(function(place) {
			if (!place.geometry) {
				console.log("Returned place contains no geometry");
				return;
			}

			const marker = new google.maps.Marker({
				map: map,
				icon: iconPlace,
				title: place.name,
				position: place.geometry.location,
				optimized: false,
				zindex: 2
			});

			placeMarkers.push(marker);

			if( isPlotSearch ){
				const infoWindow = createInfoWindow(map, marker, place);
			}

			if (place.geometry.viewport) {
				// Only geocodes have viewport.
				bounds.union(place.geometry.viewport);
			} else {
				bounds.extend(place.geometry.location);
			}
		});

		map.fitBounds(bounds);

		var listener = google.maps.event.addListener(map, "idle", function() { 

		// Disable zoom, as infowindow handles this automatically
		if( ! isPlotSearch ){
		  map.setZoom(8); 
		}
		  google.maps.event.removeListener(listener); 
		});

	});
};
export default searchBox;

const createInfoWindow = ( map, marker, place ) => {
	const html = $(confirmLocationContent);
	var infowindow = new google.maps.InfoWindow({
      content: ''
    });

    infowindow.setContent(html.get(0));

	html.find("button").click(() => {
		google.maps.event.trigger(map, 'shiftms_plotted_location', place, marker);
		infowindow.close();
	});

	infowindow.open(map, marker);
    
    return infowindow;
}