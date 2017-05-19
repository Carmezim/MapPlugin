const getData = (data) => {

  data = typeof data !== 'string' ? '../datasets/' + data.toString() : '../datasets/' + data;

  if(isJSON(data)) {
    fetch(data)
      .then((response) => response.json())
      .then(function (dataset) {
        // not to confuse 'map' as in array.proptype.map below with an instance of a google map
        // add locations
        dataset.map((markerPosition) => {
          if (!markerPosition.latitude || !markerPosition.longitude) {
            console.log('meh');
          }
          else {
            let location = new google.maps.LatLng({lat: markerPosition.latitude, lng: markerPosition.longitude});

            const marker = new google.maps.Marker({
              position: location,
              map: map,
              icon: icon
            });
            markers.push(marker);
          }
        });
      // create MarkerClusterer
      const markerCluster = new MarkerClusterer(map, markers, clusterOptions);
    })
    .catch((err) => {
      if (err) throw err
    });
  }
};

const isJSON = (dataset) => {
  try {
    JSON.stringify(dataset);
    return true;
  }
  catch(err) {
    console.error('Data is not JSON format!');
    return false;
  }
};
export default getData;