// services/preset-routing.service.ts
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PresetCategory } from '../data/presets';

@Injectable({
	providedIn: 'root'
})
export class PresetRoutingService {
	constructor(private router: Router) {}

	getSlugFromCategory(categoryName: string): string {
		return categoryName
			.toLowerCase()
			.replace(/&/g, 'and')
			.replace(/[()]/g, '') // Remove parentheses
			.replace(/[^\w\s-]/g, '') // Remove other special characters
			.replace(/\s+/g, '-'); // Replace spaces with hyphens
	}

	getCategoryFromSlug(slug: string, categories: PresetCategory[]): PresetCategory | undefined {
		const slugMap: { [key: string]: string } = {};

		// Build slug map from categories
		categories.forEach((category) => {
			const categorySlug = this.getSlugFromCategory(category.name);
			slugMap[categorySlug] = category.name;
		});

		const categoryName = slugMap[slug];
		return categories.find((c) => c.name === categoryName);
	}

	getCurrentCategoryFromUrl(): string {
		const urlParts = this.router.url.split('/');
		return urlParts[urlParts.length - 1];
	}

	isRouteActive(categoryName: string): boolean {
		const currentSlug = this.getCurrentCategoryFromUrl();
		const categorySlug = this.getSlugFromCategory(categoryName);
		return currentSlug === categorySlug;
	}

	navigateToCategory(categoryName: string, route: ActivatedRoute): void {
		const slug = this.getSlugFromCategory(categoryName);
		this.router.navigate([slug], { relativeTo: route });
	}
}
