import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { PresetCategory, tailwindPresets, UnitValue } from '../../data/presets';

@Component({
	selector: 'fp-tailwind-presets',
	imports: [],
	standalone: true,
	templateUrl: './tailwind-presets.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class TailwindPresetsComponent {
	categories = tailwindPresets.categories;
	selectedCategory = signal<PresetCategory>(tailwindPresets.categories[0]);

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

	copyValue(name: string, value: UnitValue): void {
		const textToCopy = `${value.px}px / ${value.rem}rem`;
		navigator.clipboard
			.writeText(textToCopy)
			.then(() => {
				// Could add a toast notification here
				console.log('Copied to clipboard:', textToCopy);
			})
			.catch((err) => {
				console.error('Failed to copy:', err);
			});
	}
}
