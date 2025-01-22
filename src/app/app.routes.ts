// app.routes.ts
import { Routes } from '@angular/router';
import { BatchConverterComponent } from './batch-converter/batch-converter.component';
import { FrameworkPresetsComponent } from './framework-presets/framework-presets.component';
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
		path: 'framework-presets',
		component: FrameworkPresetsComponent,
		title: 'REM to Pixel Converter - Framework Presets'
	},
	{
		path: 'visual-preview',
		component: VisualPreviewComponent,
		title: 'REM to Pixel Converter - Visual Preview'
	},
	{
		path: '**',
		redirectTo: ''
	}
];
