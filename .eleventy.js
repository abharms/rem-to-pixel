module.exports = function (eleventyConfig) {
	return {
		dir: {
			input: 'content',
			output: 'dist/rem-to-pixel/browser', // Output directly to browser folder
			layouts: '_layouts'
		},
		permalinks: {
			structure: ':title'
		}
	};
};
