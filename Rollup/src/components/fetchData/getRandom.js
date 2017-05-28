// Generate random numbers between a min and a max values
const getRandom = (min, max) => {
	return Math.random() * (max - min) + min;
};

export default getRandom;