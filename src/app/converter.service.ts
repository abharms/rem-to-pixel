import { Injectable, signal } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class ConverterService {
	private _baseFontSize = signal<number>(+(localStorage.getItem('baseFontSize') ?? '16'));

	get baseFontSize() {
		return this._baseFontSize;
	}

	updateBaseFontSize(size: number) {
		this._baseFontSize.set(size);
		localStorage.setItem('baseFontSize', size.toString());
	}
}
