import { Component, computed, signal } from '@angular/core';
import { bootstrapPresets, PresetCategory, UnitValue } from '../../data/presets';

@Component({
	selector: 'fp-bootstrap-presets',
	imports: [],
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

	selectCategory(category: PresetCategory): void {
		this.selectedCategory.set(category);
	}
	displayValue(entry: { name: string; value: UnitValue }): string {
		const key = entry.name;
		const { name } = this.selectedCategory || {};

		switch (name) {
			case 'Font Sizes':
				if (key.startsWith('h')) return `${key}`;
				if (key.startsWith('display')) return `.${key}`;
				return `.fs-${key}`;
			case 'Spacing':
				return `{property}{sides}-${key}`;
			case 'Width & Height':
				return `{w|h}-${key}`;
			case 'Gap (Gutters)':
				return `g{x|y}-${key}`;
			default:
				return key;
		}
	}
}
