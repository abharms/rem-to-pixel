// single-value/single-value.component.ts
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ConverterService } from '../converter.service';

@Component({
	selector: 'app-single-value',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './single-value.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SingleValueComponent {
	remValue = signal<string>('1.5');
	pixelValue = signal<string>('24');
	conversionType = signal<'remToPx' | 'pxToRem'>('remToPx');

	constructor(public converterService: ConverterService) {}

	// Add this helper function to your component
	private stripTrailingZeros(num: string): string {
		return num.replace(/\.?0+$/, '');
	}

	handleInputChange(event: Event, isFirstInput: boolean) {
		const newValue = (event.target as HTMLInputElement).value;
		const isRemToPx = this.conversionType() === 'remToPx';

		if ((isRemToPx && isFirstInput) || (!isRemToPx && !isFirstInput)) {
			// Handling REM input
			this.remValue.set(newValue);
			if (newValue) {
				const pixels = this.stripTrailingZeros((parseFloat(newValue) * this.converterService.baseFontSize()).toFixed(2));
				this.pixelValue.set(pixels);
			} else {
				this.pixelValue.set('');
			}
		} else {
			// Handling Pixel input
			this.pixelValue.set(newValue);
			if (newValue) {
				const rems = this.stripTrailingZeros((parseFloat(newValue) / this.converterService.baseFontSize()).toFixed(4));
				this.remValue.set(rems);
			} else {
				this.remValue.set('');
			}
		}
	}

	setConversionType(type: 'remToPx' | 'pxToRem') {
		this.conversionType.set(type);
		// Clear values when switching direction
		this.remValue.set('');
		this.pixelValue.set('');
	}

	onBaseFontSizeInput(event: Event) {
		const value = +(event.target as HTMLInputElement).value;
		if (!isNaN(value) && value > 0) {
			this.converterService.updateBaseFontSize(value);
			this.updateCalculations();
		}
	}

	private updateCalculations() {
		const isRemToPx = this.conversionType() === 'remToPx';
		if (isRemToPx && this.remValue()) {
			const pixels = (parseFloat(this.remValue()) * this.converterService.baseFontSize()).toFixed(2);
			this.pixelValue.set(pixels);
		} else if (!isRemToPx && this.pixelValue()) {
			const rems = (parseFloat(this.pixelValue()) / this.converterService.baseFontSize()).toFixed(4);
			this.remValue.set(rems);
		}
	}
}
