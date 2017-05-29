const buildList = (clusterize, listArray, markers, localMap) => {
	listArray = [];
	clusterize.clear();

	markers.map((user) => {
		if (localMap.getBounds().contains(user.getPosition())) {
			listArray.push(
			`<div class="shiftmap-clusterize-user-row shiftmap-clusterize-user-row-${user.userID}">
				<div class="shiftmap-clusterize-user-cell">
					<div class="shiftmap-clusterize-avatar">
						<img src="${user.url}" />
					</div>
					<div class="shiftmap-clusterize-content">
						<h3 class="shiftmap-clusterize-user-name">${user.userName}</h3>
						<button class="shiftmap-clusterize-user-button" name="follow">Follow</button>
					</div>
				</div>
			</div>`
			);
		}

		// Dsiplay user info on sidebar 
		const showUserInfo = () => {
			clusterize.clear();
			clusterize.update([
				`
					<div class="shiftmap-clusterize-user-row shiftmap-clusterize-user-row-single">
						<div class="shiftmap-clusterize-user-cell">
							<div class="shiftmap-clusterize-avatar">
								<img src="${user.url}" />
							</div>
							<div class="shiftmap-clusterize-content">
								 User: ${user.userName}
								 City: ${user.city}
								 Country: ${user.country}
							</div>
						</div>
					</div>
				`
			]);
			clusterize.refresh();
		};
		
		// On marker clikc user info is displayed
		google.maps.event.addDomListener(user, 'click', showUserInfo);
		});

	console.log(listArray.length);
	clusterize.update(listArray);
	clusterize.refresh();
};
export default buildList;