import Symbol from './svgMarkers';
import mapStyles from './mapStyles';
import defineCenter from './defineCenter';

let options = {};
let clusterOptions = {};

// Map options
const getMapOptions = () => {
	$.extend(options, {
		zoom: 3,
		center: defineCenter(51.521723, -0.134581),
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		mapTypeControl: false,
		styles: mapStyles,
		minZoom: 2
	});

	return options;
}

// Cluster markers style
const clusterStyles = [
	{
		anchor: [17, 35],
		textColor: 'white',
		textSize: '16',
		url: './img/icons/icon-2.svg',
		height: 75,
		width: 75,
	},
	{
		anchor: [25, 42],
		textColor: 'white',
		textSize: '18',
		url: './img/icons/icon-2.svg',
		height: 100,
		width: 100,
	},
	{
		anchor: [32, 42],
		textColor: 'white',
		textSize: '26',
		url: './img/icons/icon-2.svg',
		height: 125,
		width: 125,
	},
];

// Cluster options
const getClusterOptions = () => {
	$.extend(clusterOptions, {
		maxZoom: 12,
		gridSize: 75,
		styles: clusterStyles,
	});
	return clusterOptions;
}

// Set new icon
const setIcon = (newIcon) => {
	return newIcon;
};

const addCenterToOptions = (center) => {
	options.center = center;
};

// Icon
const getIcon = () => {
	return {
		url: Symbol('marker', 25, 25, '#f16667'),
		size: new google.maps.Size(71, 71),
		origin: new google.maps.Point(0, 0),
		anchor: new google.maps.Point(17, 34),
		scaledSize: new google.maps.Size(25, 25),
	};
}

const getIconPlace = () => {
	return {
		url: Symbol('marker', 50, 50, '#77bf2f'),
		size: new google.maps.Size(50, 50),
		origin: new google.maps.Point(0, 0),
		anchor: new google.maps.Point(25, 50)
	}
}

export {
	getIcon,
	getClusterOptions,
	setIcon,
	addCenterToOptions,
	getMapOptions,
	getIconPlace
};
