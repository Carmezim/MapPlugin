const promoArea = (insertMarker) => {
	const userPanel = document.getElementsByClassName('shiftmap-map-clusterise-wrapper');
	const searchBox = document.getElementsByClassName('shiftmap-input-wrapper');
	const button = document.createElement('button');
	button.class = 'shiftmap-promo-area';
	button.type ='button'; 
	button.value='Add your marker!';
	button.onclick = insertMarker;

	userPanel[0].insertBefore(button, searchBox[0]);
};

export default promoArea;