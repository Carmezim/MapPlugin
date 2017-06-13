import promoHtml from './promoArea.html';

const promoArea = (insertMarker, numUsers, assetsPath) => {
	let html = promoHtml;
	html = $(promoHtml.replace('%total%', numUsers)	
		.replace('%assetspath%', assetsPath));

	const userPanel = $('.shiftmap-map-clusterise-wrapper');
	userPanel.prepend(html);
	html.find('button').click(insertMarker).click(() => {
		html.addClass('in');
		const input = userPanel.find("input.shiftmap-input").one('blur', () => {
			setTimeout(() => html.removeClass('in'), 100 );
		});	
		setTimeout(() => {
			input.focus();
		}, 100 );
	});
};

export default promoArea;