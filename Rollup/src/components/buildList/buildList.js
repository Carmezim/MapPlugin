const buildList = (clusterize, listArray, markers, localMap) => {
	listArray = [];
	clusterize.clear();
	markers.map((user) => {
		if (localMap.getBounds().contains(user.getPosition())) {
			listArray.push(
				'<tr><td id="clusterize-user-cell">' +
				'<img id="clusterize-avatar" src="' + user.url + '" height="150" width="150" >' +
				'<h3 id="clusterize-user-name">' + user.userName + '</h3>' +
				'<button id="clusterize-user-button" name="follow">Follow</button>' + 
				'</td></tr>'
			);	
		}
	})
	clusterize.update(listArray);
	clusterize.refresh();
};
export default buildList;