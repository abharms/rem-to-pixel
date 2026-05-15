import { ChangeDetectionStrategy, Component, effect, signal } from '@angular/core';
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
	isDark = signal<boolean>(localStorage.getItem('theme') === 'dark');

	constructor(private router: Router, public converterService: ConverterService) {
		this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe((e) => {
			if (e instanceof NavigationEnd) {
				this.activeRoute.set(e.urlAfterRedirects.slice(1).split('?')[0] || '');
			}
		});

		effect(() => {
			const theme = this.isDark() ? 'dark' : 'light';
			document.documentElement.setAttribute('data-theme', theme);
			localStorage.setItem('theme', theme);
		});
	}

	toggleTheme() {
		this.isDark.update((v) => !v);
	}

	isActive(route: string): boolean {
		if (route === 'single-value') {
			return this.activeRoute() === '' || this.activeRoute() === 'single-value';
		}
		return this.activeRoute() === route;
	}
}
