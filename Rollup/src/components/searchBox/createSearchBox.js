const createSearchBox = (map) => {
	let localMap = map;
	// Create search box and link it to UI
	const input = document.getElementById('pac-input');
	localMap.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
	const searchBox = new google.maps.places.SearchBox(input);

	return searchBox;
};

export default createSearchBox;
