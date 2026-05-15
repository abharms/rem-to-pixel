import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

type BreakpointSet = 'tailwind' | 'bootstrap' | 'custom';

interface Breakpoint {
	name: string;
	px: number;
}

interface BreakpointRow {
	name: string;
	px: number;
	rem: string;
	minWidth: string;
	maxWidth: string;
}

const TAILWIND_BREAKPOINTS: Breakpoint[] = [
	{ name: 'sm', px: 640 },
	{ name: 'md', px: 768 },
	{ name: 'lg', px: 1024 },
	{ name: 'xl', px: 1280 },
	{ name: '2xl', px: 1536 }
];

const BOOTSTRAP_BREAKPOINTS: Breakpoint[] = [
	{ name: 'sm', px: 576 },
	{ name: 'md', px: 768 },
	{ name: 'lg', px: 992 },
	{ name: 'xl', px: 1200 },
	{ name: 'xxl', px: 1400 }
];

@Component({
	selector: 'app-media-queries',
	imports: [],
	templateUrl: './media-queries.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MediaQueriesComponent {
	// Media queries are always evaluated against 16px regardless of html font-size
	private readonly MQ_BASE = 16;

	activeSet = signal<BreakpointSet>('tailwind');
	customText = signal<string>('');
	allCopied = signal<boolean>(false);
	rowCopyState = signal<Record<number, { min: boolean; max: boolean }>>({});

	private activeBreakpoints = computed<Breakpoint[]>(() => {
		const set = this.activeSet();
		if (set === 'tailwind') return TAILWIND_BREAKPOINTS;
		if (set === 'bootstrap') return BOOTSTRAP_BREAKPOINTS;
		return this.customText()
			.split('\n')
			.map((line) => line.trim())
			.filter((line) => line && !isNaN(+line) && +line > 0)
			.map((line, i) => ({ name: `bp-${i + 1}`, px: +line }));
	});

	rows = computed<BreakpointRow[]>(() => {
		return this.activeBreakpoints().map((bp) => {
			const rem = (bp.px / this.MQ_BASE).toFixed(4).replace(/\.?0+$/, '');
			return {
				name: bp.name,
				px: bp.px,
				rem,
				minWidth: `@media (min-width: ${rem}rem)`,
				maxWidth: `@media (max-width: ${rem}rem)`
			};
		});
	});

	allCssOutput = computed(() => {
		return this.activeBreakpoints()
			.map((bp) => {
				const rem = (bp.px / this.MQ_BASE).toFixed(4).replace(/\.?0+$/, '');
				return `/* ${bp.name}: ${bp.px}px */\n@media (min-width: ${rem}rem) {\n  /* styles */\n}`;
			})
			.join('\n\n');
	});

	rowMinCopied = computed(() => this.rowCopyState());

	setActiveSet(set: BreakpointSet) {
		this.activeSet.set(set);
		this.rowCopyState.set({});
	}

	onCustomTextChange(event: Event) {
		this.customText.set((event.target as HTMLTextAreaElement).value);
		this.rowCopyState.set({});
	}

	async copyRow(index: number, type: 'min' | 'max') {
		const row = this.rows()[index];
		await navigator.clipboard.writeText(type === 'min' ? row.minWidth : row.maxWidth);
		this.rowCopyState.update((s) => ({ ...s, [index]: { ...s[index], [type]: true } }));
		setTimeout(() => {
			this.rowCopyState.update((s) => ({ ...s, [index]: { ...s[index], [type]: false } }));
		}, 1500);
	}

	async copyAll() {
		await navigator.clipboard.writeText(this.allCssOutput());
		this.allCopied.set(true);
		setTimeout(() => this.allCopied.set(false), 1500);
	}
}
