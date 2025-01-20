import { NgSwitch, NgSwitchCase } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { BatchConverterComponent } from './batch-converter/batch-converter.component';
import { SingleValueComponent } from './single-value/single-value.component';

@Component({
	selector: 'app-root',
	imports: [BatchConverterComponent, SingleValueComponent, NgSwitch, NgSwitchCase],
	standalone: true,
	templateUrl: './app.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
	baseFontSize = signal<number>(16);
	converterType = signal<'single' | 'batch'>('single');

	ngOnInit() {
		initFlowbite();
	}

	updateBaseFontSize(size: number) {
		this.baseFontSize.set(size);
	}

	setConverterType(type: 'single' | 'batch') {
		this.converterType.set(type);
	}
}
