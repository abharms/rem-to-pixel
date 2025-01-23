import { Component, computed, signal } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router, RouterModule } from '@angular/router';
import { bootstrapPresets, PresetCategory, UnitValue } from '../../data/presets';

@Component({
	selector: 'fp-bootstrap-presets',
	imports: [RouterModule],
	templateUrl: './bootstrap-presets.component.html',
	styleUrl: './bootstrap-presets.component.css'
})
export class BootstrapPresetsComponent {
	categories = bootstrapPresets.categories;
	selectedCategory = signal<PresetCategory>(bootstrapPresets.categories[0]);

	categoryValues = computed(() => {
		const category = this.selectedCategory();
		if (!category?.values) return [];

		return Object.entries(category.values).map(([name, value]) => ({
			name,
			value
		}));
	});

	constructor(
		private sanitizer: DomSanitizer,
		private router: Router
	) {}

	getRouteForCategory(categoryName: string): string {
		return categoryName.toLowerCase().replace(/\s+/g, '-');
	}

	isRouteActive(categoryName: string): boolean {
		return this.router.url.includes(this.getRouteForCategory(categoryName));
	}
	// Add clipboard copy like you did in the batch converter
	copyValue(entry: { name: string; value: UnitValue }): void {
		let textToCopy = '';
		if (entry.value.value) {
			textToCopy = entry.value.value;
		} else {
			if (entry.value.px) textToCopy += `${entry.value.px}px `;
			if (entry.value.rem) textToCopy += `${entry.value.rem}rem`;
		}
		navigator.clipboard.writeText(textToCopy.trim());
	}

	displayValue(entry: { name: string; value: UnitValue }): string {
		const category = this.selectedCategory();
		if (!category) return entry.name;

		// Make sure these strings match exactly with your category names
		const patterns: Record<string, (key: string) => string> = {
			'Font Sizes': (key) => {
				if (key.startsWith('h')) return `${key}`;
				if (key.startsWith('display')) return `.${key}`;
				return `.fs-${key}`;
			},
			Spacing: (key) => `{property}{sides}-${key}`,
			'Width & Height': (key) => `{w|h}-${key}`,
			'Gap (Gutters)': (key) => `g{x|y}-${key}`
		};

		return patterns[category.name]?.(entry.name) ?? entry.name;
	}

	getPreview(entry: { name: string; value: UnitValue }): SafeHtml {
		const category = this.selectedCategory();
		if (!category) return '';

		let html = '';
		switch (category.name) {
			case 'Font Sizes':
				const size = entry.value.value || `${entry.value.rem}rem`;
				html = `<div style="font-size: ${size}">The quick brown fox</div>`;
				break;
			case 'Spacing':
				const space = entry.value.value || `${entry.value.rem}rem`;
				html = `<div class="bg-indigo-100" style="padding: ${space}">Spaced box</div>`;
				break;
			case 'Width & Height':
				const dimension = entry.value.value || `${entry.value.rem}rem`;
				html = `<div class="bg-indigo-100" style="width: ${dimension}; height: 20px;"></div>`;
				break;
			case 'Gap (Gutters)':
				const gap = entry.value.value || `${entry.value.rem}rem`;
				html = `
			  <div style="display: flex; gap: ${gap}">
				<div class="bg-indigo-100 w-8 h-8"></div>
				<div class="bg-indigo-100 w-8 h-8"></div>
			  </div>
			`;
				break;
		}
		return this.sanitizer.bypassSecurityTrustHtml(html);
	}
}
