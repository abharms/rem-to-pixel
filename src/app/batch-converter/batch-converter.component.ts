// batch-converter/batch-converter.component.ts

import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ConverterService } from '../converter.service';

@Component({
	selector: 'app-batch-converter',
	imports: [],
	templateUrl: './batch-converter.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class BatchConverterComponent {
	conversionType = signal<'remToPx' | 'pxToRem'>('remToPx');
	inputText = signal<string>('');
	convertedText = signal<string>('');
	copied = signal<boolean>(false);

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
		this.convertValues();
	}

	onBaseFontSizeInput(event: Event) {
		const value = +(event.target as HTMLInputElement).value;
		if (!isNaN(value) && value > 0) {
			this.converterService.updateBaseFontSize(value);
			this.convertValues();
		}
	}

	onInputChange(event: Event) {
		const value = (event.target as HTMLTextAreaElement).value;
		this.inputText.set(value);
		this.convertValues();
	}

	convertValues() {
		const input = this.inputText();
		const baseFontSize = this.converterService.baseFontSize();

		if (!input) {
			this.convertedText.set('');
			return;
		}

		let converted = input;

		if (this.conversionType() === 'remToPx') {
			// Convert rem to px
			converted = converted.replace(/(\d*\.?\d+)rem/g, (_match, rems) => {
				const pixels = this.formatNumber(parseFloat(rems) * baseFontSize);
				return `${pixels}px`;
			});
		} else {
			// Convert px to rem
			converted = converted.replace(/(\d*\.?\d+)px/g, (_match, pixels) => {
				const rems = this.formatNumber(parseFloat(pixels) / baseFontSize);
				return `${rems}rem`;
			});
		}

		this.convertedText.set(converted);
	}

	async copyToClipboard() {
		await navigator.clipboard.writeText(this.convertedText());
		this.copied.set(true);
		setTimeout(() => this.copied.set(false), 1500);
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
