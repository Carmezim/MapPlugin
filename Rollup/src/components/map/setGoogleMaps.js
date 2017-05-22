const setGoogleMaps = (apiKey) => {
	if (typeof apiKey !== 'string' || !(apiKey instanceof String)) {
		apiKey = apiKey.toString();
	}

	addEventListener('DOMContentLoaded', () => {
		if (document.querySelectorAll('#map').length > 0) {
			let mapTag = document.createElement('script');
			mapTag.src = 'https://maps.googleapis.com/maps/api/js?key=' + apiKey + '&libraries=places' + '&callback=initialize';
			mapTag.async = true;

			let s0 = document.getElementsByTagName('script')[0];
			s0.parentNode.insertBefore(mapTag, s0);
		}
	});
};

export default setGoogleMaps;
