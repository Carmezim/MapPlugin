const promoAreaLogged = (insertMarker) => {
	const userPanel = document.getElementsByClassName('shiftmap-map-clusterise-wrapper');
	const searchBox = document.getElementsByClassName('shiftmap-input-wrapper');
	const promoAreaContainer = document.createElement('div');
	promoAreaContainer.className = 'shiftmap-promo-area';
	
	const message = document.createElement('h3');
	message.innerHTML = 'Reolcation, relocation, relocation...';
	message.className = 'shitfmap-promo-area-text';

	const image = new Image(70, 70)
	image.src = '/icons/icon-2.svg';
	image.className = 'shitfmap-promo-area-icon';

	const button = document.createElement('button');
	button.className = 'shiftmap-promo-area-button';
	button.type = 'button'; 
	button.value = 'Change your location';
	button.innerHTML = 'Change your location';
	button.onclick = insertMarker;

	userPanel[0].insertBefore(promoAreaContainer, searchBox[0]);
	promoAreaContainer.appendChild(message);
	promoAreaContainer.appendChild(button);
	promoAreaContainer.appendChild(image);
};

export default promoAreaLogged;