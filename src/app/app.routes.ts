// app.routes.ts
import { Routes } from '@angular/router';
import { BatchConverterComponent } from './batch-converter/batch-converter.component';
import { SingleValueComponent } from './single-value/single-value.component';

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
		path: '**',
		redirectTo: ''
	}
];
