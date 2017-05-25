const buildList = (clusterize, listArray, markers, localMap) => {
	listArray = [];
	clusterize.clear();
	markers.map((user) => {
		if (localMap.getBounds().contains(user.getPosition())) {
			listArray.push(
				'<tr id="clusterize-user-row-' + user.userID + '"><a href=""><td id="clusterize-user-cell" href=>' +
				'<img id="clusterize-avatar" src="' + user.url + '" height="150" width="150" >' +
				'<h3 id="clusterize-user-name">' + user.userName + '</h3>' +
				'<button id="clusterize-user-button" name="follow">Follow</button>' + 
				'</td></tr>'
			);
		}

		// Dsiplay user info on sidebar 
		const showUserInfo = () => {
			clusterize.clear();
			clusterize.update([
				'<tr><td>' + '<img id="clusterize-avatar" src="' + user.url + '" height="150" width="150">'
				 + '</br> user ID: ' + user.userID + '</br>' 	
				 + 'User: ' + user.userName + '</td></tr>'
			]);
			clusterize.refresh();
		};
		
		// On marker clikc user info is displayed
		google.maps.event.addDomListener(user, 'click', showUserInfo);
		});

	clusterize.update(listArray);
	clusterize.refresh();
};
export default buildList;