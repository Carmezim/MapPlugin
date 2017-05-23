const defineCenter = (lat, lng) =>  new google.maps.LatLng(parseFloat(lat).toFixed(6), parseFloat(lng).toFixed(6));

export default defineCenter;
