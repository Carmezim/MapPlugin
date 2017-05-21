import setGoogleMaps from 'components/setGoogleMaps';
import initialize from 'components/maps';

// create map div
const mapDiv    = document.createElement('div');
      mapDiv.id = 'map';

// create search box input
const searchBox             = document.createElement('input');
      searchBox.id          = 'pac-input';
      searchBox.type        = 'text';
      searchBox.placeholder = 'Search Box';


const element = document.createElement('script');
      element.innerHTML = initialize('coordinates.json');



document.body.appendChild(mapDiv);
document.body.appendChild(searchBox);
document.body.appendChild(setGoogleMaps('AIzaSyCR527NNTzbSOMy4D6ZFDLtEfsGl7Z3Q2I'));