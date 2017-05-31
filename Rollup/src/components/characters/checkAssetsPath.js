const checkAssetsPath = (assetsPath) => {
	 
	if (RegExp('^(/[^/ ]*)+/$').test(assetsPath)) {
		return true;
	}
	else {
		console.error('Please provide the icons directory as in "/path/to/icons/"')
	}
};
export default checkAssetsPath;