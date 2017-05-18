export default createSearchBox = (map) => {
  // Create search box and link it to UI
  const input = document.getElementById('pac-input')
  const searchBox = new google.maps.places.SearchBox(input);

  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  return searchBox;
}
