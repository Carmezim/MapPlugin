const promoArea = (insertMarker, numUsers) => {
	const userPanel = document.getElementsByClassName('shiftmap-map-clusterise-wrapper');
	const searchBox = document.getElementsByClassName('shiftmap-input-wrapper');
	const promoAreaContainer = document.createElement('div');
	promoAreaContainer.className = 'shiftmap-promo-area';
	
	const message = document.createElement('h3');
	message.innerHTML = `There are currently ${numUsers} people on the map`;
	message.className = 'shitfmap-promo-area-text';

	const image = new Image(70, 70)
	image.src = '/img/icons/icon-2.svg';
	image.className = 'shitfmap-promo-area-icon';

	const button = document.createElement('button');
	button.className = 'shiftmap-promo-area-button';
	button.type = 'button'; 
	button.value = 'Add your marker!';
	button.innerHTML = 'Add your marker!';
	button.onclick = insertMarker;

	userPanel[0].insertBefore(promoAreaContainer, searchBox[0]);
	promoAreaContainer.appendChild(message);
	promoAreaContainer.appendChild(button);
	promoAreaContainer.appendChild(image);
};

export default promoArea;