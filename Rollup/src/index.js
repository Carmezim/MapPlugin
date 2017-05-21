// Import styles (injected into head)

// Import modules
import setGoogleMaps from './components/map/setGoogleMaps';
import initialize from './components/map/map';

const addElement = () => {
  // create map div
  // let mapDiv        = document.createElement('div');
  //     mapDiv.id     = 'map';

  // create search box input
  // let searchBox             = document.createElement('input');
  //     searchBox.id          = 'pac-input';
  //     searchBox.type        = 'text';
  //     searchBox.placeholder = 'Search Box';

  let element           = document.createElement('script');
      element.innerHTML = initialize("coordinates.json");

};

google.maps.event.addDomListener(window, "load", addElement);
