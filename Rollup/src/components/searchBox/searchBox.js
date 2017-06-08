import {iconPlace} from '../map/options';

const searchBox = (map, places, sBox, placeMarkers, icon, setIcon) => {

	// Bias searchbox results towards current map's viewport
	map.addListener('bounds_changed', function() {
		sBox.setBounds(map.getBounds());
	});

	// Listen for the event fired when the user selects a prediction and retrieve
	// more details for that place.
	sBox.addListener('places_changed', function() {
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

			placeMarkers.push(new google.maps.Marker({
				map: map,
				icon: iconPlace,
				title: place.name,
				position: place.geometry.location,
				optimized: false,
				zindex: 2
			}));

			if (place.geometry.viewport) {
				// Only geocodes have viewport.
				bounds.union(place.geometry.viewport);
			} else {
				bounds.extend(place.geometry.location);
			}
		});
		map.fitBounds(bounds);

		var listener = google.maps.event.addListener(map, "idle", function() { 
		  map.setZoom(8); 
		  google.maps.event.removeListener(listener); 
		});

	});
};
export default searchBox;
