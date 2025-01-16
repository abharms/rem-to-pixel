import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-root',
  imports: [CommonModule, ReactiveFormsModule],
  standalone: true,
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  converterForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.converterForm = this.fb.group({
      pixelValue: [''],
      remValue: [''],
      baseFontSize: [16]
    });

    // Subscribe to form changes
    this.converterForm.get('pixelValue')?.valueChanges.subscribe(value => {
      if (value !== null && value !== '') {
        const remValue = this.convertPixelsToRem(value);
        this.converterForm.patchValue({ remValue }, { emitEvent: false });
      }
    });

    this.converterForm.get('remValue')?.valueChanges.subscribe(value => {
      if (value !== null && value !== '') {
        const pixelValue = this.convertRemToPixels(value);
        this.converterForm.patchValue({ pixelValue }, { emitEvent: false });
      }
    });

    this.converterForm.get('baseFontSize')?.valueChanges.subscribe(() => {
      const pixelValue = this.converterForm.get('pixelValue')?.value;
      if (pixelValue) {
        const remValue = this.convertPixelsToRem(pixelValue);
        this.converterForm.patchValue({ remValue }, { emitEvent: false });
      }
    });
  }

  ngOnInit() {
    initFlowbite();
  }

  convertPixelsToRem(pixels: string): string {
    if (!pixels) return '';
    const baseFontSize = this.converterForm.get('baseFontSize')?.value || 16;
    return (parseFloat(pixels) / baseFontSize).toFixed(4);
  }

  convertRemToPixels(rems: string): string {
    if (!rems) return '';
    const baseFontSize = this.converterForm.get('baseFontSize')?.value || 16;
    return (parseFloat(rems) * baseFontSize).toFixed(2);
  }
}
