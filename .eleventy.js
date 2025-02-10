module.exports = function (eleventyConfig) {
	return {
		dir: {
			input: 'src/blog', // Location of your markdown files
			output: 'dist/rem-to-pixel/browser/blog' // Output to the correct directory for Netlify
		},
		passthroughFileCopy: true
	};
};
