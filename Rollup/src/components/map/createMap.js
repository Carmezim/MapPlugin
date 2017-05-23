import { mapOptions } from './options';

const createMap = () => new google.maps.Map(document.getElementById('map'), mapOptions);

export default createMap;
