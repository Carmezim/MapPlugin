let zoomingOnSingle = false;
const buildList = (clusterize, listArray, markers, localMap, domElement) => {

	if( zoomingOnSingle ){
		return;
	}

	listArray = [];
	clusterize.clear();

	markers.map((user) => {
		if (localMap.getBounds().contains(user.getPosition())) {
			listArray.push(
			`<div class="shiftmap-clusterize-user-row shiftmap-clusterize-user-row-${user.userID}">
				<div class="shiftmap-clusterize-user-cell">
					<div class="shiftmap-clusterize-avatar">
						<div style="background-image:url('${user.url}')"></div>
					</div>
					<div class="shiftmap-clusterize-content">
						<h3 class="shiftmap-clusterize-user-name">${user.userName}</h3>
						<div class="active">Last active 2 weeks ago</div>
						<button class="shiftmap-clusterize-user-button" data-clickuser="${user.userID}">Follow</button>
					</div>
				</div>
			</div>`
			);
		}

		// Dsiplay user info on sidebar 
		const showUserInfo = () => {
			$(domElement).trigger('openpanel');
			clusterize.clear();
			clusterize.update([
				`
				<div class="shiftmap-clusterize-user-row shiftmap-clusterize-user-row-single">
					<div class="shiftmap-clusterize-user-cell">
						<div class="shiftmap-clusterize-avatar">
							<div style="background-image:url('${user.url}')"></div>
						</div>
						<div class="shiftmap-clusterize-content">
							 <div class="visible"><span data-clickuser="${user.userID}">User:</span> ${user.userName}</div>
							 <div class="${user.city && 'visible'}"><span>City:</span> ${user.city}</div>
							 <div class="${user.country && 'visible'}"><span>Country:</span> ${user.country}</div>
							 <div class="${(user.active||true) && 'visible active'}">Last active 2 weeks ago</div>
							 <div class="visible">
							 	<button class="shiftmap-clusterize-user-button" data-clickuser="${user.userID}">Follow</button>
							 </div>
						</div>
					</div>
				</div>
				`
			]);
			clusterize.refresh();
		};
		
		// On marker clikc user info is displayed
		if( !user.clickEventBound ){
			google.maps.event.addDomListener(user, 'click', () => {
				zoomingOnSingle = true;
				showUserInfo();

				if(localMap.getZoom() < 8 ){
					localMap.setZoom(8);
				}

				localMap.setCenter(user.getPosition());

				setTimeout(() => {
					zoomingOnSingle = false;
				}, 1000 );

			});
			user.clickEventBound = true;
		}

	});

	clusterize.update(listArray);
	clusterize.refresh();
};
export default buildList;