import {icon, clusterOptions} from '../map/options';
import buildList from '../buildList/buildList';
import Clusterize from 'clusterize.js';
import checkData from './checkData';


const getData = (map, data, markers) => {
  let localMap = map;
  let listArray = [];
  let localData = typeof data !== "string" ? "/datasets/" + data.toString() : "/datasets/" + data;
  // create list
	let clusterize = new Clusterize({
    rows: null,
    scrollId: 'scrollArea',
    contentId: 'contentArea',
  });
  
  if(checkData(localData)) {
    fetch(localData)
      .then((response) => response.json())
      .then(function (dataset) {
        // add locations
        // check for geocoordinates in dataset
        dataset.map((markerPosition) => {
          if (!markerPosition.latitude || !markerPosition.longitude) {
            console.log('meh');
          }
          else {
            let location = new google.maps.LatLng({lat: markerPosition.latitude, lng: markerPosition.longitude});
            const marker = new google.maps.Marker({
              position: location,
              map: localMap,
              icon: icon,
              userID: markerPosition.user_id,
              userName: markerPosition.full_name
            });
            markers.push(marker);
          }
        });
      // create MarkerClusterer
      const markerCluster = new MarkerClusterer(localMap, markers, clusterOptions);
      // Updates list when viewport changes
      google.maps.event.addListener(localMap, 'bounds_changed', function() {
        buildList(clusterize, listArray, markers, localMap);
      });  
    })
    .catch((err) => {
      if (err) throw err
    });
  }
};


export default getData;


