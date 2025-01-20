import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
	selector: 'app-single-value',
	imports: [CommonModule, ReactiveFormsModule],
	standalone: true,
	templateUrl: './single-value.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SingleValueComponent {
	baseFontSize = input<number>();
	baseFontSizeChange = output<number>();

	private _baseFontSize = signal<number>(16);
	remValue = signal<string>('');
	pixelValue = signal<string>('');
	conversionType = signal<'remToPx' | 'pxToRem'>('remToPx');

	handleInputChange(event: Event, isFirstInput: boolean) {
		const newValue = (event.target as HTMLInputElement).value;
		const isRemToPx = this.conversionType() === 'remToPx';

		if ((isRemToPx && isFirstInput) || (!isRemToPx && !isFirstInput)) {
			// Handling REM input
			this.remValue.set(newValue);
			if (newValue) {
				const pixels = (parseFloat(newValue) * this._baseFontSize()).toFixed(2);
				this.pixelValue.set(pixels);
			} else {
				this.pixelValue.set('');
			}
		} else {
			// Handling Pixel input
			this.pixelValue.set(newValue);
			if (newValue) {
				const rems = (parseFloat(newValue) / this._baseFontSize()).toFixed(4);
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
			this._baseFontSize.set(value);
			this.baseFontSizeChange.emit(value);
			this.updateCalculations();
		}
	}

	private updateCalculations() {
		const isRemToPx = this.conversionType() === 'remToPx';
		if (isRemToPx && this.remValue()) {
			const pixels = (parseFloat(this.remValue()) * this._baseFontSize()).toFixed(2);
			this.pixelValue.set(pixels);
		} else if (!isRemToPx && this.pixelValue()) {
			const rems = (parseFloat(this.pixelValue()) / this._baseFontSize()).toFixed(4);
			this.remValue.set(rems);
		}
	}
}
