import promoHtml from './promoAreaLogged.html';

const promoArea = (insertMarker, assetsPath) => {
	let html = promoHtml;
	html = $(promoHtml.replace('%assetspath%', assetsPath));

	const userPanel = $('.shiftmap-map-clusterise-wrapper');
	userPanel.prepend(html);
	html.find('button').click(insertMarker).click(() => {
		html.addClass('in');
		const input = userPanel.find("input.shiftmap-input").one('blur', () => {
			setTimeout(() => html.removeClass('in'), 500 );
		});	
		setTimeout(() => {
			input.focus();
		}, 100 );
	});
};

export default promoArea;