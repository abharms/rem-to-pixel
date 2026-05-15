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
		path: 'clamp-generator',
		loadComponent: () => import('./clamp-generator/clamp-generator.component').then((m) => m.ClampGeneratorComponent),
		title: 'REM to Pixel Converter - Clamp Generator'
	},
	{
		path: 'type-scale',
		loadComponent: () => import('./type-scale/type-scale.component').then((m) => m.TypeScaleComponent),
		title: 'REM to Pixel Converter - Type Scale Generator'
	},
	{
		path: 'spacing-scale',
		loadComponent: () => import('./spacing-scale/spacing-scale.component').then((m) => m.SpacingScaleComponent),
		title: 'REM to Pixel Converter - Spacing Scale Generator'
	},
	{
		path: 'media-queries',
		loadComponent: () => import('./media-queries/media-queries.component').then((m) => m.MediaQueriesComponent),
		title: 'REM to Pixel Converter - Media Query Converter'
	},
	{
		path: 'multi-base',
		loadComponent: () => import('./multi-base/multi-base.component').then((m) => m.MultiBaseComponent),
		title: 'REM to Pixel Converter - Multi-Base Comparison'
	},
	{
		path: 'sitemap.xml',
		pathMatch: 'prefix',
		redirectTo: ''
	},
	{
		path: 'robots.txt',
		pathMatch: 'prefix',
		redirectTo: ''
	},
	{
		path: 'blog/index.html',
		pathMatch: 'prefix',
		redirectTo: ''
	},
	{
		path: '**',
		redirectTo: '/',
		pathMatch: 'full'
	}
];
