export default defineCenter = (lat, lng) => {

  let mapCenter = new google.maps.LatLng(parseFloat(lat).toFixed(6), parseFloat(lng).toFixed(6));
  // 51.521723, -0.134581
  return mapCenter;
};