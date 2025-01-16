module.exports = {
	printWidth: 160,
	singleQuote: true,
	useTabs: true,
	tabWidth: 2,
	semi: true,
	bracketSpacing: true,
	trailingComma: 'none',
	overrides: [
		{
			files: ['*.html'],
			options: {
				parser: 'angular',
				htmlWhitespaceSensitivity: 'ignore',
				semi: false
			}
		}
	]
};
