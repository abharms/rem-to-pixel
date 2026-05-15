import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

interface BaseRow {
	base: number;
	px: number;
	pct: string;
	isDefault: boolean;
}

@Component({
	selector: 'app-multi-base',
	imports: [],
	templateUrl: './multi-base.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MultiBaseComponent {
	readonly bases = [10, 12, 14, 16, 18, 20, 24];

	remInput = signal<number>(1);

	rows = computed<BaseRow[]>(() => {
		const rem = this.remInput();
		return this.bases.map((base) => ({
			base,
			px: +(rem * base).toFixed(4),
			pct: ((base / 16) * 100).toFixed(1) + '%',
			isDefault: base === 16
		}));
	});

	onRemInput(event: Event) {
		const v = +(event.target as HTMLInputElement).value;
		if (!isNaN(v)) this.remInput.set(v);
	}
}
