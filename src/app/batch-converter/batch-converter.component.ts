// batch-converter/batch-converter.component.ts

import { Component, signal } from '@angular/core';
import { ConverterService } from '../converter.service';

@Component({
	selector: 'app-batch-converter',
	standalone: true,
	imports: [],
	templateUrl: './batch-converter.component.html'
})
export class BatchConverterComponent {
	conversionType = signal<'remToPx' | 'pxToRem'>('remToPx');
	inputText = signal<string>('');
	convertedText = signal<string>('');

	constructor(public converterService: ConverterService) {}

	// Helper function to format numbers without trailing zeros
	private formatNumber(num: number): string {
		const withDecimals =
			this.conversionType() === 'remToPx'
				? num.toFixed(2) // Pixels get 2 decimal places max
				: num.toFixed(4); // REMs get 4 decimal places max
		return withDecimals.replace(/\.?0+$/, '');
	}

	setConversionType(type: 'remToPx' | 'pxToRem') {
		this.conversionType.set(type);
		this.convertedText.set(''); // Clear output when switching type
	}

	onBaseFontSizeInput(event: Event) {
		const value = +(event.target as HTMLInputElement).value;
		if (!isNaN(value) && value > 0) {
			this.converterService.updateBaseFontSize(value);
			// Reconvert if there's existing input
			if (this.convertedText()) {
				this.convertValues();
			}
		}
	}

	onInputChange(event: Event) {
		const value = (event.target as HTMLTextAreaElement).value;
		this.inputText.set(value);
		this.convertedText.set(''); // Clear output when input changes
	}

	convertValues() {
		const input = this.inputText();
		const baseFontSize = this.converterService.baseFontSize();

		if (!input) return;

		let converted = input;

		if (this.conversionType() === 'remToPx') {
			// Convert rem to px
			converted = converted.replace(/(\d*\.?\d+)rem/g, (match, rems) => {
				const pixels = this.formatNumber(parseFloat(rems) * baseFontSize);
				return `${pixels}px`;
			});
		} else {
			// Convert px to rem
			converted = converted.replace(/(\d+)px/g, (match, pixels) => {
				const rems = this.formatNumber(parseInt(pixels) / baseFontSize);
				return `${rems}rem`;
			});
		}

		this.convertedText.set(converted);
	}

	copyToClipboard() {
		navigator.clipboard
			.writeText(this.convertedText())
			.then(() => {
				console.log('Copied to clipboard');
				// Could add a toast notification here
			})
			.catch((err) => {
				console.error('Failed to copy text: ', err);
			});
	}

	// Computed value for placeholder text based on conversion type
	get inputPlaceholder(): string {
		return this.conversionType() === 'remToPx'
			? `Paste your CSS here... 
Example:
margin: 1rem;
padding: 1.5rem 2rem;
font-size: 0.875rem;`
			: `Paste your CSS here... 
Example:
margin: 16px;
padding: 24px 32px;
font-size: 14px;`;
	}
}
