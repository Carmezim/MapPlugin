import { getMapOptions } from './options';
import template from '../../template.html';

const createMap = (domElement) => {
	const $ = window.jQuery;
	const $wrapper = $(domElement).html(template);
	const $map = $wrapper.find('.shiftmap-map');
	const opt = getMapOptions();
	return new google.maps.Map($map.get(0), opt);	
}

export default createMap;
