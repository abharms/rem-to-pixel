// visual-preview/visual-preview.component.ts
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ConverterService } from '../converter.service';

interface PreviewElement {
	name: string;
	remValue: number;
	cssProperty: string;
	description: string;
}

@Component({
	selector: 'app-visual-preview',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './visual-preview.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class VisualPreviewComponent {
	selectedFontSize = signal<number>(16);

	// Common font sizes to preview
	fontSizeOptions = [14, 16, 18, 20];

	// Preview elements with their REM values
	previewElements: PreviewElement[] = [
		{ name: 'Small Text', remValue: 0.875, cssProperty: 'font-size', description: '0.875rem - Common size for secondary text' },
		{ name: 'Body Text', remValue: 1, cssProperty: 'font-size', description: '1rem - Standard body text size' },
		{ name: 'Large Text', remValue: 1.25, cssProperty: 'font-size', description: '1.25rem - Emphasized text' },
		{ name: 'Heading', remValue: 1.5, cssProperty: 'font-size', description: '1.5rem - Common heading size' },
		{ name: 'Small Spacing', remValue: 0.5, cssProperty: 'padding', description: '0.5rem - Compact spacing' },
		{ name: 'Medium Spacing', remValue: 1, cssProperty: 'padding', description: '1rem - Standard spacing' },
		{ name: 'Large Spacing', remValue: 2, cssProperty: 'padding', description: '2rem - Large spacing' }
	];

	constructor(public converterService: ConverterService) {
		// Initialize with the current base font size from the service
		this.selectedFontSize.set(this.converterService.baseFontSize());
	}

	setFontSize(size: number) {
		this.selectedFontSize.set(size);
	}

	getPixelValue(remValue: number): number {
		return remValue * this.selectedFontSize();
	}

	getStyle(element: PreviewElement): { [key: string]: string } {
		const pixelValue = this.getPixelValue(element.remValue);

		if (element.cssProperty === 'padding') {
			return {
				padding: `${pixelValue}px`,
				'background-color': 'rgb(243 244 246)',
				'border-radius': '0.5rem'
			};
		}

		return {
			[element.cssProperty]: `${pixelValue}px`
		};
	}
}
