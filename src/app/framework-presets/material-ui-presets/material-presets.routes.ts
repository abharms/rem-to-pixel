// framework-presets/material-presets/material-presets.routes.ts
import { Routes } from '@angular/router';
import { MaterialUiPresetsComponent } from './material-ui-presets.component';

export const MATERIAL_ROUTES: Routes = [
	{
		path: '',
		component: MaterialUiPresetsComponent,
		children: [
			{
				path: '',
				redirectTo: 'typography',
				pathMatch: 'full'
			},
			{
				path: 'typography',
				component: MaterialUiPresetsComponent
			},
			{
				path: 'spacing',
				component: MaterialUiPresetsComponent
			},
			{
				path: 'breakpoints',
				component: MaterialUiPresetsComponent
			},
			{
				path: 'component-sizes',
				component: MaterialUiPresetsComponent
			}
		]
	}
];
