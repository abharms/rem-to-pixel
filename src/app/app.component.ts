// app.component.ts
import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ConverterService } from './converter.service';

@Component({
	selector: 'app-root',
	standalone: true,
	imports: [CommonModule, RouterModule],
	templateUrl: './app.component.html'
})
export class AppComponent {
	activeRoute = signal<string>('');

	constructor(
		private router: Router,
		public converterService: ConverterService
	) {
		this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((event) => {
			if (event instanceof NavigationEnd) {
				const currentPath = event.urlAfterRedirects.slice(1);
				this.activeRoute.set(currentPath || '');
			}
		});
	}

	isActive(route: string): boolean {
		if (route === 'single-value') {
			return this.activeRoute() === '' || this.activeRoute() === 'single-value';
		}
		return this.activeRoute() === route;
	}
}
