import { ChangeDetectionStrategy, Component, computed, OnDestroy, signal } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter, Subject, takeUntil } from 'rxjs';
import { PresetCategory, tailwindPresets, UnitValue } from '../../data/presets';

@Component({
	selector: 'fp-tailwind-presets',
	imports: [RouterModule],
	standalone: true,
	templateUrl: './tailwind-presets.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class TailwindPresetsComponent implements OnDestroy {
	categories = tailwindPresets.categories;
	selectedCategory = signal<PresetCategory>(tailwindPresets.categories[0]);
	private destroy$ = new Subject<void>();

	constructor(
		private sanitizer: DomSanitizer,
		private route: ActivatedRoute,
		private router: Router
	) {
		this.router.events
			.pipe(
				filter((event) => event instanceof NavigationEnd),
				takeUntil(this.destroy$)
			)
			.subscribe(() => {
				// Get the current URL and split it to find the category
				const urlParts = this.router.url.split('/');
				const categorySlug = urlParts[urlParts.length - 1] || 'font-sizes';
				const category = this.getCategoryFromSlug(categorySlug);

				if (category) {
					this.selectedCategory.set(category);
				}
			});
	}

	getCategoryFromSlug(slug: string): PresetCategory | undefined {
		const slugMap: { [key: string]: string } = {
			'font-sizes': 'Font Sizes',
			spacing: 'Spacing',
			'width-and-height': 'Width & Height', // Changed from 'width-height'
			gap: 'Gap'
		};

		const categoryName = slugMap[slug];
		return this.categories.find((c) => c.name === categoryName);
	}

	getSlugFromCategory(categoryName: string): string {
		return categoryName
			.toLowerCase()
			.replace(/&/g, 'and') // Replace & with 'and' FIRST
			.replace(/[^\w\s-]/g, '') // Then remove special characters
			.replace(/\s+/g, '-'); // Finally replace spaces with hyphens
	}

	navigateToCategory(categoryName: string): void {
		const slug = this.getSlugFromCategory(categoryName);
		this.router.navigate([slug], { relativeTo: this.route });
	}

	isRouteActive(categoryName: string): boolean {
		const urlParts = this.router.url.split('/');
		const currentSlug = urlParts[urlParts.length - 1];
		const categorySlug = this.getSlugFromCategory(categoryName);

		return currentSlug === categorySlug;
	}

	getPreview(entry: { name: string; value: UnitValue }): SafeHtml {
		const category = this.selectedCategory();
		if (!category) return '';

		let html = '';
		switch (category.name) {
			case 'Font Sizes':
				const fontSize = entry.value.rem ? `${entry.value.rem}rem` : entry.value.value;
				html = `
          <div style="font-size: ${fontSize}; line-height: 1.2; text-align: left; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
            The quick brown fox
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

			case 'Width & Height':
				const size = entry.value.rem ? `${entry.value.rem}rem` : entry.value.value;
				html = `
          <div class="flex flex-col items-start">
            <div class="bg-indigo-100 border-2 border-dashed border-indigo-300 rounded" 
                 style="width: ${size}; height: 1rem;">
            </div>
          
          </div>
        `;
				break;

			case 'Gap':
				const gap = entry.value.rem ? `${entry.value.rem}rem` : entry.value.value;
				html = `
          <div class="flex flex-col items-start">
            <div style="display: flex; gap: ${gap};">
              <div class="w-4 h-4 bg-indigo-300 rounded"></div>
              <div class="w-4 h-4 bg-indigo-300 rounded"></div>
              <div class="w-4 h-4 bg-indigo-300 rounded"></div>
            </div>
          
          </div>
        `;
				break;

			default:
				return '';
		}

		return this.sanitizer.bypassSecurityTrustHtml(html);
	}

	categoryValues = computed(() => {
		const category = this.selectedCategory();
		if (!category?.values) return [];

		return Object.entries(category.values).map(([name, value]) => ({
			name,
			value
		}));
	});

	getRouteForCategory(categoryName: string): string {
		return categoryName
			.toLowerCase()
			.replace(/&/g, 'and')
			.replace(/[^\w\s-]/g, '')
			.replace(/\s+/g, '-');
	}

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

	ngOnDestroy() {
		this.destroy$.next();
		this.destroy$.complete();
	}
}
