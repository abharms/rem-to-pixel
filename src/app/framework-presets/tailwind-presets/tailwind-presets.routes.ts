// framework-presets/tailwind-presets/tailwind-presets.routes.ts
import { Routes } from '@angular/router';
import { TailwindPresetsComponent } from './tailwind-presets.component';

export const TAILWIND_ROUTES: Routes = [
	{
		path: '',
		component: TailwindPresetsComponent,
		children: [
			{
				path: '',
				redirectTo: 'font-sizes',
				pathMatch: 'full'
			},
			{
				path: 'font-sizes',
				component: TailwindPresetsComponent
			},
			{
				path: 'spacing',
				component: TailwindPresetsComponent
			},
			{
				path: 'width-and-height',
				component: TailwindPresetsComponent
			},
			{
				path: 'gap',
				component: TailwindPresetsComponent
			}
		]
	}
];
