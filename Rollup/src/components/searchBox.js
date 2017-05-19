const searchBox = (map, places, sBox, placeMarkers, icon, setIcon) => {

  let sbMap = map;
  // Bias searchbox results towards current map's viewport
  sbMap.addListener('bounds_changed', function() {
    sBox.setBounds(sbMap.getBounds());
  });

  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  sBox.addListener('places_changed', function() {
    places = searchBox.getPlaces();
    if (places.length == 0) {
      return;
    }

    // Clear out the old markers.
    placeMarkers.forEach(function(marker) {
      marker.setMap(null);
    });
    placeMarkers = [];

    // For each place, get the icon, name and location.
    let bounds = new google.maps.LatLngBounds();
    places.forEach(function(place) {
      if (!place.geometry) {
        console.log("Returned place contains no geometry");
        return;
      }

      let newIcon = {
        url: place.icon,
        size: icon.size,
        origin: icon.origin,
        anchor: icon.anchor,
        scaledSize: icon.scaledSize
      };

      let otherIcon = setIcon(newIcon);

      placeMarkers.push(new google.maps.Marker({
        map: sbMap,
        icon: otherIcon,
        title: place.name,
        position: place.geometry.location,
        setMap: sbMap
      }));

      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    sbMap.fitBounds(bounds);
  });
};
export default searchBox;