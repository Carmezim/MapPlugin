// Map colors
const land = "#EEEFF1";
const water = "#71CAF2";

const mapStyles = [
		{
			"elementType": "labels",
			"stylers": [
				{
					"visibility": "off"
				}
			]
		},
		{
			"featureType": "administrative",
			"elementType": "geometry",
			"stylers": [
				{
					"visibility": "off"
				}
			]
		},
		{
			"featureType": "administrative.land_parcel",
			"stylers": [
				{
					"visibility": "off"
				}
			]
		},
		{
			"featureType": "administrative.neighborhood",
			"stylers": [
				{
					"visibility": "off"
				}
			]
		},
		{
			"featureType": "landscape.man_made",
			"stylers": [
				{
					"color": land
				}
			]
		},
		{
			"featureType": "landscape.natural",
			"stylers": [
				{
					"color": land
				}
			]
		},
		{
			"featureType": "landscape.natural.landcover",
			"stylers": [
				{
					"color": land
				}
			]
		},
		{
			"featureType": "landscape.natural.terrain",
			"stylers": [
				{
					"color": land
				}
			]
		},
		{
			"featureType": "poi",
			"stylers": [
				{
					"visibility": "off"
				}
			]
		},
		{
			"featureType": "road",
			"stylers": [
				{
					"visibility": "off"
				}
			]
		},
		{
			"featureType": "road",
			"elementType": "labels.icon",
			"stylers": [
				{
					"visibility": "off"
				}
			]
		},
		{
			"featureType": "transit",
			"stylers": [
				{
					"visibility": "off"
				}
			]
		},
		{
			"featureType": "water",
			"stylers": [
				{
					"color": water
				}
			]
		}
	];

export default mapStyles;
