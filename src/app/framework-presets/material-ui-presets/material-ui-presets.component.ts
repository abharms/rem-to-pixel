import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter, Subject, takeUntil } from 'rxjs';
import { materialPresets, PresetCategory, UnitValue } from '../../data/presets';
import { PresetRoutingService } from '../preset-routing.service';

interface CopyFormat {
	label: string;
	getValue: (entry: { name: string; value: UnitValue }) => string;
}

@Component({
	selector: 'fp-material-ui-presets',
	imports: [RouterModule],
	templateUrl: './material-ui-presets.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MaterialUiPresetsComponent {
	categories = materialPresets.categories;
	selectedCategory = signal<PresetCategory>(materialPresets.categories[0]);
	categoryValues = computed(() => {
		const category = this.selectedCategory();
		if (!category?.values) return [];

		return Object.entries(category.values).map(([name, value]) => ({
			name,
			value
		}));
	});
	private destroy$ = new Subject<void>();

	constructor(
		private sanitizer: DomSanitizer,
		public presetRoutingService: PresetRoutingService,
		private router: Router
	) {
		this.router.events
			.pipe(
				filter((event) => event instanceof NavigationEnd),
				takeUntil(this.destroy$)
			)
			.subscribe(() => {
				const categorySlug = this.presetRoutingService.getCurrentCategoryFromUrl();
				const category = this.presetRoutingService.getCategoryFromSlug(categorySlug, this.categories);

				if (category) {
					this.selectedCategory.set(category);
				}
			});
	}

	displayValue(entry: { name: string; value: UnitValue }): string {
		const key = entry.name;
		const { name } = this.selectedCategory();

		switch (name) {
			case 'Typography':
				return `typography="${key}"`;
			case 'Spacing':
				return `spacing(${key})`;
			case 'Breakpoints':
				return `theme.breakpoints.up('${key}')`;
			case 'Component Sizes':
				return `size="${key}"`;
			default:
				return key;
		}
	}

	getPreview(entry: { name: string; value: UnitValue }): SafeHtml {
		const category = this.selectedCategory();
		if (!category) return '';

		let html = '';
		switch (category.name) {
			case 'Typography':
				const fontSize = entry.value.rem ? `${entry.value.rem}rem` : entry.value.value;
				html = `
          <div style="font-size: ${fontSize}; line-height: 1.2; text-align: left; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
            Material Design
          </div>
        `;
				break;

			case 'Spacing':
				const space = entry.value.rem ? `${entry.value.rem}rem` : entry.value.value;
				html = `
          <div class="flex flex-col items-start">
            <div class="bg-indigo-100 border-2 border-dashed border-indigo-300 rounded" 
                 style="padding: ${space}">
              <div class="w-4 h-4 bg-indigo-300 rounded"></div>
            </div>
          </div>
        `;
				break;

			case 'Breakpoints':
				const breakpoint = entry.value.value;
				html = `
          <div class="flex items-center gap-2">
            <div class="h-1 bg-indigo-300 rounded" style="width: ${parseInt(breakpoint || '') / 20}px"></div>
            <div class="text-xs text-gray-500">${breakpoint}</div>
          </div>
        `;
				break;

			case 'Component Sizes':
				const size = entry.value.rem ? `${entry.value.rem}rem` : entry.value.value;
				html = `
          <div class="flex items-center justify-center bg-indigo-100 rounded" 
               style="width: ${size}; height: ${size};">
            <div class="w-1/2 h-1/2 bg-indigo-300 rounded"></div>
          </div>
        `;
				break;
		}

		return this.sanitizer.bypassSecurityTrustHtml(html);
	}

	getCopyFormats(entry: { name: string; value: UnitValue }): CopyFormat[] {
		const { name } = this.selectedCategory();

		switch (name) {
			case 'Typography':
				return [
					{
						label: 'Component prop',
						getValue: (e) => `variant="${e.name}"`
					},
					{
						label: 'Theme path',
						getValue: (e) => `theme.typography.${e.name}`
					},
					{
						label: 'sx prop',
						getValue: (e) => `sx={{ typography: '${e.name}' }}`
					}
				];
			case 'Spacing':
				return [
					{
						label: 'spacing()',
						getValue: (e) => `spacing(${e.name})`
					},
					{
						label: 'theme path',
						getValue: (e) => `theme.spacing(${e.name})`
					},
					{
						label: 'sx prop',
						getValue: (e) => `sx={{ p: ${e.name} }}`
					},
					{
						label: 'pixel value',
						getValue: (e) => `${e.value.px}px`
					}
				];
			case 'Breakpoints':
				return [
					{
						label: 'useMediaQuery',
						getValue: (e) => `useMediaQuery(theme.breakpoints.up('${e.name}'))`
					},
					{
						label: 'theme path',
						getValue: (e) => `theme.breakpoints.values.${e.name}`
					},
					{
						label: 'raw value',
						getValue: (e) => e.value.value || ''
					}
				];
			case 'Component Sizes':
				return [
					{
						label: 'size prop',
						getValue: (e) => `size="${e.name}"`
					},
					{
						label: 'pixel value',
						getValue: (e) => `${e.value.px}px`
					}
				];
			default:
				return [];
		}
	}

	copyToClipboard(text: string): void {
		navigator.clipboard.writeText(text).then(
			() => {
				// Could show a toast notification here
				console.log('Copied to clipboard:', text);
			},
			(err) => {
				console.error('Failed to copy:', err);
			}
		);
	}
}
