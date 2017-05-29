const $ = window.jQuery;

const createSearchBox = (map, mapWrapper) => {
	let localMap = map;
	// Create search box and link it to UI
	const $input = $(mapWrapper).find('input.shiftmap-input');
	const input = $input.get(0);
	const searchBox = new google.maps.places.SearchBox(input);
	return searchBox;
};

export default createSearchBox;
