import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { ConverterService } from '../converter.service';

type OutputFormat = 'css' | 'tailwind';

interface SpacingRow {
	step: number;
	px: number;
	rem: string;
}

@Component({
	selector: 'app-spacing-scale',
	imports: [],
	templateUrl: './spacing-scale.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpacingScaleComponent {
	baseUnit = signal<number>(4);
	steps = signal<number>(12);
	outputFormat = signal<OutputFormat>('css');
	copied = signal<boolean>(false);

	rows = computed<SpacingRow[]>(() => {
		const base = this.baseUnit();
		const count = Math.min(this.steps(), 20);
		const baseFontSize = this.converterService.baseFontSize();
		return Array.from({ length: count }, (_, i) => {
			const step = i + 1;
			const px = base * step;
			const rem = (px / baseFontSize).toFixed(4).replace(/\.?0+$/, '');
			return { step, px, rem };
		});
	});

	cssOutput = computed(() =>
		this.rows()
			.map((r) => `--space-${r.step}: ${r.rem}rem; /* ${r.px}px */`)
			.join('\n')
	);

	tailwindOutput = computed(() => {
		const entries = this.rows()
			.map((r) => `  '${r.step}': '${r.rem}rem'`)
			.join(',\n');
		return `spacing: {\n${entries}\n}`;
	});

	activeOutput = computed(() => (this.outputFormat() === 'css' ? this.cssOutput() : this.tailwindOutput()));

	constructor(public converterService: ConverterService) {}

	onBaseUnitInput(event: Event) {
		const v = +(event.target as HTMLInputElement).value;
		if (v > 0) this.baseUnit.set(v);
	}

	onStepsInput(event: Event) {
		const v = +(event.target as HTMLInputElement).value;
		if (v >= 1 && v <= 20) this.steps.set(v);
	}

	setFormat(fmt: OutputFormat) {
		this.outputFormat.set(fmt);
	}

	async copyOutput() {
		await navigator.clipboard.writeText(this.activeOutput());
		this.copied.set(true);
		setTimeout(() => this.copied.set(false), 1500);
	}
}
