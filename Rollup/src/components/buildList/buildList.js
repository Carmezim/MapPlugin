const buildList = (clusterize, listArray, markers, localMap) => {
  listArray = [];
  clusterize.clear();
  markers.map((i) => {
    if (localMap.getBounds().contains(i.getPosition())) {
      listArray.push('<tr><td>' + i.label + '</td><td>' + '<td/><td>' + i.title + '</td></tr>');	
    }
  })
  clusterize.update(listArray);
  clusterize.refresh();
};
export default buildList;