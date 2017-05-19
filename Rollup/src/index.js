// Import styles (injected into head)

// Import modules
import setGoogleMaps from './components/setGoogleMaps';
import initialize from './components/maps';

window.document.body.onload = addElement;

function addElement () {
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

  // add the newly created element and its content into the DOM
  let currentTag = document.getElementById("title");


}
google.maps.event.addDomListener(window, "load", addElement);
