// single-value/single-value.component.ts

import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConverterService } from '../converter.service';

@Component({
	selector: 'app-single-value',
	imports: [],
	templateUrl: './single-value.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SingleValueComponent implements OnInit {
	remValue = signal<string>('');
	pixelValue = signal<string>('');
	conversionType = signal<'remToPx' | 'pxToRem'>('remToPx');
	resultCopied = signal<boolean>(false);
	cssVarCopied = signal<boolean>(false);
	urlCopied = signal<boolean>(false);

	constructor(public converterService: ConverterService, private route: ActivatedRoute, private router: Router) {}

	ngOnInit() {
		const params = this.route.snapshot.queryParams;
		if (params['rem']) {
			const rem = params['rem'];
			this.remValue.set(rem);
			this.conversionType.set('remToPx');
			this.pixelValue.set(this.stripTrailingZeros((parseFloat(rem) * this.converterService.baseFontSize()).toFixed(2)));
		} else if (params['px']) {
			const px = params['px'];
			this.pixelValue.set(px);
			this.conversionType.set('pxToRem');
			this.remValue.set(this.stripTrailingZeros((parseFloat(px) / this.converterService.baseFontSize()).toFixed(4)));
		}
	}

	private stripTrailingZeros(num: string): string {
		return num.replace(/\.?0+$/, '');
	}

	private syncUrl() {
		const queryParams =
			this.conversionType() === 'remToPx'
				? { rem: this.remValue() || null, px: null }
				: { px: this.pixelValue() || null, rem: null };
		this.router.navigate([], { queryParams, replaceUrl: true });
	}

	handleInputChange(event: Event, isFirstInput: boolean) {
		const newValue = (event.target as HTMLInputElement).value;
		const isRemToPx = this.conversionType() === 'remToPx';

		if ((isRemToPx && isFirstInput) || (!isRemToPx && !isFirstInput)) {
			this.remValue.set(newValue);
			if (newValue) {
				this.pixelValue.set(this.stripTrailingZeros((parseFloat(newValue) * this.converterService.baseFontSize()).toFixed(2)));
			} else {
				this.pixelValue.set('');
			}
		} else {
			this.pixelValue.set(newValue);
			if (newValue) {
				this.remValue.set(this.stripTrailingZeros((parseFloat(newValue) / this.converterService.baseFontSize()).toFixed(4)));
			} else {
				this.remValue.set('');
			}
		}

		this.syncUrl();
	}

	setConversionType(type: 'remToPx' | 'pxToRem') {
		this.conversionType.set(type);
		this.remValue.set('');
		this.pixelValue.set('');
		this.syncUrl();
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
			this.pixelValue.set(this.stripTrailingZeros((parseFloat(this.remValue()) * this.converterService.baseFontSize()).toFixed(2)));
		} else if (!isRemToPx && this.pixelValue()) {
			this.remValue.set(this.stripTrailingZeros((parseFloat(this.pixelValue()) / this.converterService.baseFontSize()).toFixed(4)));
		}
	}

	private getResultString(): string | null {
		if (this.conversionType() === 'remToPx' && this.pixelValue()) return `${this.pixelValue()}px`;
		if (this.conversionType() === 'pxToRem' && this.remValue()) return `${this.remValue()}rem`;
		return null;
	}

	async copyResult() {
		const val = this.getResultString();
		if (!val) return;
		await navigator.clipboard.writeText(val);
		this.resultCopied.set(true);
		setTimeout(() => this.resultCopied.set(false), 1500);
	}

	async copyCssVar() {
		const val = this.getResultString();
		if (!val) return;
		await navigator.clipboard.writeText(`--size: ${val};`);
		this.cssVarCopied.set(true);
		setTimeout(() => this.cssVarCopied.set(false), 1500);
	}

	async shareUrl() {
		await navigator.clipboard.writeText(window.location.href);
		this.urlCopied.set(true);
		setTimeout(() => this.urlCopied.set(false), 1500);
	}
}
