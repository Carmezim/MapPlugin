const setGoogleMaps = (apiKey) => {

  if(typeof apiKey !== 'string' || !apiKey instanceof String) {
    apiKey = apiKey.toString();
  }

  addEventListener('DOMContentLoaded', () => {
    if (document.querySelectorAll('#map').length > 0) {

      const mapTag      = document.createElement('script');
            mapTag.type = 'text/javascript';
            mapTag.src  = 'https://maps.googleapis.com/maps/api/js?key=' + apiKey + '&libraries=places';

      return mapTag;
    }
  })
};
export default setGoogleMaps;