const extract = require('extract-svg-path');
const fs = require('fs');
const SVGs = [];

	for (let i = 2; i <= 52; i++) {  
		let p = extract(__dirname + '/icons/icon-'+ i + '.svg');
		SVGs.push({p});
	}

const json = JSON.stringify(SVGs);
fs.writeFile('svgPaths.json', json, 'utf8', console.log('written'));
