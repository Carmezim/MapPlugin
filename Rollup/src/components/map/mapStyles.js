// Map colors
const land = "#EEEFF1";
const water = "#54b1db";

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

export var mapDetailStyles = [
  {
    "featureType": "road.arterial",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "road.local",
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
];
