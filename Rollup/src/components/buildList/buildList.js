const buildList = (clusterize, listArray, markers, localMap) => {
	listArray = [];
	clusterize.clear();
	markers.map((user) => {
		if (localMap.getBounds().contains(user.getPosition())) {
			listArray.push('<tr><td>' + user.userName + '</br>' + '<img id="clusterize-avatar" src="' + user.url + '" height="200" width="200" >' + '</td></tr>');	
		}
	})
	clusterize.update(listArray);
	clusterize.refresh();
};
export default buildList;