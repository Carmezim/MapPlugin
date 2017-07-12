import promoHtml from './promoAreaLogged.html';

const promoArea = (insertMarker, assetsPath) => {
	let html = promoHtml;
	html = $(promoHtml.replace('%assetspath%', assetsPath));

	const userPanel = $('.shiftmap-map-clusterise-wrapper');
	userPanel.prepend(html);
	html.find('button').click(insertMarker).click(() => {
		html.addClass('in');
		$('html').addClass('map-plotting-active');
		const input = userPanel.find("input.shiftmap-input").one('blur', () => {
		});	
		setTimeout(() => {
			input.focus();
		}, 100 );
	});

	html.find('a').click(() => {
		html.removeClass('in');
		$('html').removeClass('map-plotting-active');
	});
};

export default promoArea;