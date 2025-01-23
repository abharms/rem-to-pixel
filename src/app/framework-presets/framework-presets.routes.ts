// framework-presets/framework-presets.routes.ts
import { Routes } from '@angular/router';
import { BOOTSTRAP_ROUTES } from './bootstrap-presets/bootstrap-presets.routes';
import { FrameworkPresetsComponent } from './framework-presets.component';
import { MATERIAL_ROUTES } from './material-ui-presets/material-presets.routes';
import { TAILWIND_ROUTES } from './tailwind-presets/tailwind-presets.routes';

export const FRAMEWORK_PRESET_ROUTES: Routes = [
	{
		path: '',
		component: FrameworkPresetsComponent,
		children: [
			{
				path: 'tailwind',
				children: TAILWIND_ROUTES
			},
			{
				path: 'bootstrap',
				children: BOOTSTRAP_ROUTES
			},
			{
				path: 'material',
				children: MATERIAL_ROUTES
			}
		]
	}
];
