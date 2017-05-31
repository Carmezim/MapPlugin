import Symbol from './svgMarkers';
import mapStyles from './mapStyles';

// Map options
const mapOptions = {
	zoom: 3,
	center: null,
	mapTypeId: google.maps.MapTypeId.ROADMAP,
	mapTypeControl: false,
	styles: mapStyles,
	minZoom: 3
};

// Cluster markers style
const clusterStyles = [
	{
		anchor: [13, 35],
		textColor: 'white',
		textSize: '16',
		url: Symbol('marker', 75, 75, '#f16667'),
		height: 75,
		width: 75,
	},
	{
		anchor: [20, 42],
		textColor: 'white',
		textSize: '18',
		url: Symbol('marker', 100, 100, '#f16667'),
		height: 100,
		width: 100,
	},
	{
		anchor: [20, 43.5],
		textColor: 'white',
		textSize: '24',
		url: Symbol('marker', 125, 125, '#f16667'),
		height: 125,
		width: 125,
	},
];

// Cluster options
const clusterOptions = {
	maxZoom: 15,
	gridSize: 75,
	styles: clusterStyles,
};

// Set new icon
const setIcon = (newIcon) => {
	icon = newIcon;
	return icon;
};

const addCenterToOptions = (center) => {
	mapOptions.center = center;
};

// Icon
let icon = {
	url: Symbol('marker', 25, 25, '#f16667'),
	size: new google.maps.Size(71, 71),
	origin: new google.maps.Point(0, 0),
	anchor: new google.maps.Point(17, 34),
	scaledSize: new google.maps.Size(25, 25),
};

let iconPlace = {
	url: Symbol('marker', 50, 50, '#77bf2f'),
	size: new google.maps.Size(50, 50),
	origin: new google.maps.Point(0, 0),
	anchor: new google.maps.Point(25, 50)
}

export {
	icon,
	mapOptions,
	clusterOptions,
	setIcon,
	addCenterToOptions,
	iconPlace
};
