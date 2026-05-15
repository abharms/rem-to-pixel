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
	featureRequestSubmitted = signal(false);

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

	openFeatureRequestModal(modal: HTMLDialogElement) {
		this.featureRequestSubmitted.set(false);
		modal.showModal();
	}

	submitFeatureRequest(event: Event) {
		event.preventDefault();
		const form = event.target as HTMLFormElement;
		const params = new URLSearchParams();
		new FormData(form).forEach((value, key) => params.append(key, value as string));
		fetch('/', {
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: params.toString(),
		}).then(() => {
			this.featureRequestSubmitted.set(true);
			form.reset();
		});
	}

	isActive(route: string): boolean {
		if (route === 'single-value') {
			return this.activeRoute() === '' || this.activeRoute() === 'single-value';
		}
		if (route === 'framework-presets') {
			return this.activeRoute().startsWith('framework-presets');
		}
		return this.activeRoute() === route;
	}
}
