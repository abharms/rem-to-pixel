module.exports = function (eleventyConfig) {
	return {
		dir: {
			input: 'src/blog', // Location of your markdown files
			output: 'dist/blog' // Output folder for the generated HTML
		}
	};
};
