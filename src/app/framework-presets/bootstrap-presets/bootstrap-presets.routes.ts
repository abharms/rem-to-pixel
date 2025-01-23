// framework-presets/bootstrap-presets/bootstrap-presets.routes.ts
import { Routes } from '@angular/router';
import { BootstrapPresetsComponent } from './bootstrap-presets.component';

export const BOOTSTRAP_ROUTES: Routes = [
	{
		path: '',
		component: BootstrapPresetsComponent,
		children: [
			{
				path: '',
				redirectTo: 'font-sizes',
				pathMatch: 'full'
			},
			{
				path: 'font-sizes',
				component: BootstrapPresetsComponent
			},
			{
				path: 'spacing',
				component: BootstrapPresetsComponent
			},
			{
				path: 'width-and-height',
				component: BootstrapPresetsComponent
			},
			{
				path: 'gap-gutters',
				component: BootstrapPresetsComponent
			}
		]
	}
];
