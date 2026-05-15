// app.component.ts

import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ConverterService } from './converter.service';

@Component({
	selector: 'app-root',
	imports: [RouterModule],
	templateUrl: './app.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
	activeRoute = signal<string>('');
	currentYear = new Date().getFullYear();

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
