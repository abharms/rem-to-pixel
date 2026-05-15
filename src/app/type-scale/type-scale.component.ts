import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { ConverterService } from '../converter.service';

interface ScaleRatio {
	name: string;
	value: number;
}

interface TypeScaleRow {
	step: number;
	label: string;
	px: string;
	rem: string;
}

const SCALE_RATIOS: ScaleRatio[] = [
	{ name: 'Minor Second (1.067)', value: 1.067 },
	{ name: 'Major Second (1.125)', value: 1.125 },
	{ name: 'Minor Third (1.2)', value: 1.2 },
	{ name: 'Major Third (1.25)', value: 1.25 },
	{ name: 'Perfect Fourth (1.333)', value: 1.333 },
	{ name: 'Augmented Fourth (1.414)', value: 1.414 },
	{ name: 'Perfect Fifth (1.5)', value: 1.5 },
	{ name: 'Golden Ratio (1.618)', value: 1.618 },
	{ name: 'Custom', value: -1 }
];

const STEP_NAMES = ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl'];

@Component({
	selector: 'app-type-scale',
	imports: [],
	templateUrl: './type-scale.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class TypeScaleComponent {
	readonly ratios = SCALE_RATIOS;

	basePx = signal<number>(16);
	selectedRatioIndex = signal<number>(4);
	customRatioValue = signal<string>('1.333');
	stepsAbove = signal<number>(5);
	stepsBelow = signal<number>(2);
	copied = signal<boolean>(false);

	isCustomRatio = computed(() => this.selectedRatioIndex() === SCALE_RATIOS.length - 1);

	activeRatio = computed(() => {
		if (this.isCustomRatio()) {
			const v = parseFloat(this.customRatioValue());
			return isNaN(v) || v <= 1 ? 1.333 : v;
		}
		return SCALE_RATIOS[this.selectedRatioIndex()].value;
	});

	customRatioInvalid = computed(() => {
		if (!this.isCustomRatio()) return false;
		const v = parseFloat(this.customRatioValue());
		return isNaN(v) || v <= 1;
	});

	rows = computed<TypeScaleRow[]>(() => {
		const base = this.basePx();
		const ratio = this.activeRatio();
		const above = this.stepsAbove();
		const below = this.stepsBelow();
		const baseFontSize = this.converterService.baseFontSize();
		const total = below + 1 + above;
		const useNamedSteps = total <= STEP_NAMES.length && below <= 2;

		return Array.from({ length: total }, (_, i) => {
			const step = i - below;
			const px = base * Math.pow(ratio, step);
			const rem = px / baseFontSize;
			let label: string;
			if (useNamedSteps) {
				label = STEP_NAMES[i] ?? (step > 0 ? `+${step}` : `${step}`);
			} else {
				label = step === 0 ? 'base' : step > 0 ? `+${step}` : `${step}`;
			}
			return {
				step,
				label,
				px: px.toFixed(2).replace(/\.?0+$/, ''),
				rem: rem.toFixed(4).replace(/\.?0+$/, '')
			};
		});
	});

	cssOutput = computed(() =>
		this.rows()
			.map((r) => `--text-${r.label}: ${r.rem}rem;`)
			.join('\n')
	);

	constructor(public converterService: ConverterService) {}

	onBasePxInput(event: Event) {
		const v = +(event.target as HTMLInputElement).value;
		if (v > 0) this.basePx.set(v);
	}

	onRatioSelect(event: Event) {
		this.selectedRatioIndex.set(+(event.target as HTMLSelectElement).value);
	}

	onCustomRatioInput(event: Event) {
		this.customRatioValue.set((event.target as HTMLInputElement).value);
	}

	onStepsAboveInput(event: Event) {
		const v = +(event.target as HTMLInputElement).value;
		if (v >= 0 && v <= 10) this.stepsAbove.set(v);
	}

	onStepsBelowInput(event: Event) {
		const v = +(event.target as HTMLInputElement).value;
		if (v >= 0 && v <= 5) this.stepsBelow.set(v);
	}

	async copyCss() {
		await navigator.clipboard.writeText(this.cssOutput());
		this.copied.set(true);
		setTimeout(() => this.copied.set(false), 1500);
	}
}
