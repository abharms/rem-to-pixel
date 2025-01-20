import { Component, computed, input, output, signal } from '@angular/core';

const formatNumber = (num: number): string => {
	// First convert to fixed number of decimal places
	const withDecimals = num.toFixed(4); // Use 4 for rems, will trim if not needed
	// Remove trailing zeros and decimal point if not needed
	return withDecimals.replace(/\.?0+$/, '');
};

@Component({
	selector: 'app-batch-converter',
	imports: [],
	templateUrl: './batch-converter.component.html'
})
export class BatchConverterComponent {
	baseFontSize = input<number>();
	baseFontSizeChange = output<number>();

	private _baseFontSize = signal<number>(16);
	conversionType = signal<'remToPx' | 'pxToRem'>('remToPx');
	inputText = signal<string>('');
	convertedText = signal<string>('');

	// Computed placeholder based on conversion type
	inputPlaceholder = computed(() => {
		const type = this.conversionType();
		if (type === 'remToPx') {
			return `Paste your CSS here... 
Example:
margin: 1rem;
padding: 1.5rem 2rem;
font-size: 0.875rem;`;
		}
		return `Paste your CSS here... 
Example:
margin: 16px;
padding: 24px 32px;
font-size: 14px;`;
	});

	setConversionType(type: 'remToPx' | 'pxToRem') {
		this.conversionType.set(type);
		this.convertedText.set(''); // Clear output when switching type
	}

	onBaseFontSizeInput(event: Event) {
		const value = +(event.target as HTMLInputElement).value;
		if (!isNaN(value) && value > 0) {
			this._baseFontSize.set(value);
			this.baseFontSizeChange.emit(value);
		}
	}

	onInputChange(event: Event) {
		const value = (event.target as HTMLTextAreaElement).value;
		this.inputText.set(value);
		this.convertedText.set(''); // Clear output when input changes
	}

	convertValues() {
		const input = this.inputText();
		const baseFontSize = this._baseFontSize();

		if (!input) return;

		let converted = input;

		if (this.conversionType() === 'remToPx') {
			// Convert rem to px
			converted = converted.replace(/(\d*\.?\d+)rem/g, (match, rems) => {
				const pixels = formatNumber(parseFloat(rems) * baseFontSize);
				return `${pixels}px`;
			});
		} else {
			// Convert px to rem
			converted = converted.replace(/(\d+)px/g, (match, pixels) => {
				const rems = formatNumber(parseInt(pixels) / baseFontSize);
				return `${rems}rem`;
			});
		}

		this.convertedText.set(converted);
	}

	copyToClipboard() {
		navigator.clipboard
			.writeText(this.convertedText())
			.then(() => {
				// Could add a toast notification here
				console.log('Copied to clipboard');
			})
			.catch((err) => {
				console.error('Failed to copy text: ', err);
			});
	}
}
