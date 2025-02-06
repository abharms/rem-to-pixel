module.exports = function (eleventyConfig) {
	return {
		dir: {
			input: 'content', // where your markdown files are
			output: 'public/blog', // where HTML files will be generated
			layouts: '_layouts' // templates for your blog posts
		}
	};
};
