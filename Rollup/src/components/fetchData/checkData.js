const checkData = (dataset) => {
	try {
		JSON.stringify(dataset);
		return true;
	}
	catch(err) {
		console.error('Data is not JSON format!');
		return false;
	}
};
export default checkData;