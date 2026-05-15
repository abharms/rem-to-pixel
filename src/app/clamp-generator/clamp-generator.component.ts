import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { ConverterService } from '../converter.service';

@Component({
	selector: 'app-clamp-generator',
	imports: [],
	templateUrl: './clamp-generator.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClampGeneratorComponent {
	minPx = signal<number>(16);
	maxPx = signal<number>(32);
	minVw = signal<number>(320);
	maxVw = signal<number>(1280);
	clampCopied = signal<boolean>(false);

	minRem = computed(() => this.toRem(this.minPx()));
	maxRem = computed(() => this.toRem(this.maxPx()));

	clampValue = computed(() => {
		const base = this.converterService.baseFontSize();
		const minPx = this.minPx();
		const maxPx = this.maxPx();
		const minVw = this.minVw();
		const maxVw = this.maxVw();

		if (minPx >= maxPx || minVw >= maxVw) return null;

		const slope = (maxPx - minPx) / (maxVw - minVw);
		const intercept = minPx - slope * minVw;

		const minRem = this.fmt(minPx / base);
		const maxRem = this.fmt(maxPx / base);
		const slopeVw = this.fmt(slope * 100);
		const interceptRem = this.fmt(intercept / base);

		const preferred = interceptRem !== 0 ? `${interceptRem}rem + ${slopeVw}vw` : `${slopeVw}vw`;

		return `clamp(${minRem}rem, ${preferred}, ${maxRem}rem)`;
	});

	previewSizes = computed(() => {
		const minPx = this.minPx();
		const maxPx = this.maxPx();
		const minVw = this.minVw();
		const maxVw = this.maxVw();

		if (minPx >= maxPx || minVw >= maxVw) return [];

		const slope = (maxPx - minPx) / (maxVw - minVw);
		const intercept = minPx - slope * minVw;

		return [320, 375, 768, 1024, 1280, 1440].map((vw) => ({
			viewport: vw,
			px: +(Math.min(maxPx, Math.max(minPx, slope * vw + intercept))).toFixed(1),
			pct: 0
		})).map((item) => ({
			...item,
			pct: Math.round(((item.px - minPx) / (maxPx - minPx)) * 100)
		}));
	});

	constructor(public converterService: ConverterService) {}

	setMinPx(event: Event) { const v = +(event.target as HTMLInputElement).value; if (v > 0) this.minPx.set(v); }
	setMaxPx(event: Event) { const v = +(event.target as HTMLInputElement).value; if (v > 0) this.maxPx.set(v); }
	setMinVw(event: Event) { const v = +(event.target as HTMLInputElement).value; if (v > 0) this.minVw.set(v); }
	setMaxVw(event: Event) { const v = +(event.target as HTMLInputElement).value; if (v > 0) this.maxVw.set(v); }

	async copyClamp() {
		const val = this.clampValue();
		if (!val) return;
		await navigator.clipboard.writeText(`font-size: ${val};`);
		this.clampCopied.set(true);
		setTimeout(() => this.clampCopied.set(false), 1500);
	}

	private toRem(px: number): string {
		return this.fmt(px / this.converterService.baseFontSize()) + 'rem';
	}

	private fmt(n: number): number {
		return Math.round(n * 10000) / 10000;
	}
}
