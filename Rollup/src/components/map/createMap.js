import { mapOptions } from './options';
import template from '../../template.html';

const createMap = (domElement) => {
	const $ = window.jQuery;
	const $wrapper = $(domElement).html(template);
	const $map = $wrapper.find('.shiftmap-map');
	return new google.maps.Map($map.get(0), mapOptions);	
}

export default createMap;
