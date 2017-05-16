export function setGoogleMaps(){
	addEventListener('DOMContentLoaded', function () {
  	if (document.querySelectorAll('#map').length > 0) {
    	const script      = document.createElement('script');
      	    script.type = 'text/javascript';
        	  script.src  = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCR527NNTzbSOMy4D6ZFDLtEfsGl7Z3Q2I&libraries=places&callback=initialize';

    document.body.appendChild(script);
  	}
	})
}

export function initialize() {
  
  // measure performance/time to load map 
  const t0 = performance.now();

  // clusterer markers 
  const markers = [];

  // markers svg
  const Symbol = (id, width, height, fill) => {
    const marker_svg = {
      marker: {
        p: 'M244.31,0C256.87,2.49,269.59,4.38,282,7.58c35.11,9.1,65.15,27.29,90.44,53.07C401.19,90,419.56,125,427,165.51q12.58,68.25-18.92,130.11Q319.47,469.54,230.64,643.36c-.73,1.42-1.59,2.78-2.79,4.87-1.41-2.43-2.5-4.14-3.42-5.93C165.11,526,104.62,410.27,46.93,293.17,8.94,216.08,18.43,141.32,71.6,74c34-43,80.17-66.6,134.87-72.86A44.62,44.62,0,0,0,211.37,0Z',
        v: '0 0 430.62 648.23'
      }
    }
    return ('data:image/svg+xml;base64,' + window.btoa('<svg xmlns="http://www.w3.org/2000/svg" height="' + height + '" viewBox="0 0 430.62 648.23" width="' + width + '" ><g><path fill="' + fill + '" d="' + marker_svg[id].p + '" /></g></svg>'));
  }

  // cluster markers style
  const clusterStyles = [{
      anchor: [13, 35],
      textColor: 'white',
      textSize: '16',
      url: Symbol('marker', 75, 75, '#f16667'),
      height: 75,
      width: 75
    },
    {
      anchor: [20, 42],
      textColor: 'white',
      textSize: '18',
      url: Symbol('marker', 100, 100, '#f16667'),
      height: 100,
      width: 100
    },
    {
      anchor: [20, 43.5],
      textColor: 'white',
      textSize: '24',
      url: Symbol('marker', 125, 125, '#f16667'),
      height: 125,
      width: 125
    }
  ]

  // cluster options
  const clusterOptions = {
    imagePath: 'images/m',
    // needs come closer for marks to appear
    maxZoom: 15,
    gridSize: 75,
    styles: clusterStyles
  }

  // map center                                
  const london = new google.maps.LatLng(51.521723, -0.134581);

  // map options
  const mapOptions = {
    zoom: 4,
    center: london,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  }

  // map marker
  const icon = {
    url: Symbol('marker', 25, 25, '#f16667'),
  }

  // create map
  map = new google.maps.Map(document.getElementById("map"), mapOptions);
    
  // get json dataset 
  fetch('datasets/coordinates.json')
    .then((response) => response.json())
    .then(function(dataset) {
      // not to confuse 'map' as in array.proptype.map below with an instance of a google map
      // add locations
      dataset.map((markerPosition) => {
        if (!markerPosition.latitude || !markerPosition.longitude) {
          console.log('meh');
        }
        else {
          let location = new google.maps.LatLng({lat: markerPosition.latitude, lng: markerPosition.longitude});

          const marker = new google.maps.Marker({
              position: location,
              map: map,
              icon: icon
            });
          markers.push(marker); 
        }
      })
    // create MarkerClusterer
    const markerCluster = new MarkerClusterer(map, markers, clusterOptions);  
    })
    .catch((err) => {
      if (err) throw err
    });
  
    // Places Search Box
    // Create search box and link it to UI
    const input = document.getElementById('pac-input');
    const searchBox = new google.maps.places.SearchBox(input);

    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    // Bias searchbox results towards current map's viewport
    map.addListener('bounds_changed', function() {
      searchBox.setBounds(map.getBounds());
    });

    let placeMarkers = [];

    searchBox.addListener('places_changed', function() {
      let places = searchBox.getPlaces();

      if (places.length == 0) {
        return;
      }

      // Clear out the old markers.
      placeMarkers.forEach(function(marker) {
        marker.setMap(null);
      });
      placeMarkers = [];

      // For each place, get the icon, name and location.
      const bounds = new google.maps.LatLngBounds();
      places.forEach(function(place) {
        if (!place.geometry) {
          console.log("Returned place contains no geometry");
          return;
        }
        const icon = {
          url: place.icon,
          size: new google.maps.Size(71, 71),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(17, 34),
          scaledSize: new google.maps.Size(25, 25)
        };

        placeMarkers.push(new google.maps.Marker({
          map: map,
          icon: icon,
          title: place.name,
          position: place.geometry.location
        }));

        if (place.geometry.viewport) {
          // Only geocodes have viewport.
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
      });
      map.fitBounds(bounds);
    });

  const t1 = performance.now();
  console.log("Call to initialize took " + (t1 - t0) + " milliseconds.");

}
