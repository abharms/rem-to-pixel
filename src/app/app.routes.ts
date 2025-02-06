// app.routes.ts
import { Routes } from '@angular/router';
import { BatchConverterComponent } from './batch-converter/batch-converter.component';
import { SingleValueComponent } from './single-value/single-value.component';
import { VisualPreviewComponent } from './visual-preview/visual-preview.component';

export const routes: Routes = [
	{
		path: '',
		component: SingleValueComponent,
		title: 'REM to Pixel Converter'
	},
	{
		path: 'single-value',
		component: SingleValueComponent,
		title: 'REM to Pixel Converter - Single Value'
	},
	{
		path: 'batch-convert',
		component: BatchConverterComponent,
		title: 'REM to Pixel Converter - Batch Convert'
	},
	{
		path: 'visual-preview',
		component: VisualPreviewComponent,
		title: 'REM to Pixel Converter - Visual Preview'
	},
	{
		path: 'framework-presets',
		loadChildren: () => import('./framework-presets/framework-presets.routes').then((m) => m.FRAMEWORK_PRESET_ROUTES),
		title: 'REM to Pixel Converter - Framework Presets'
	},
	{
		// Blog post route - before the catch-all
		path: ':slug',
		resolve: {
			page: () => {
				// Allow server to handle these routes
				window.location.href = window.location.href;
				return true;
			}
		}
	},
	{
		path: '**',
		redirectTo: ''
	}
];
