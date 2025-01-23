// framework-presets/framework-presets.component.ts
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ConverterService } from '../converter.service';

export enum FrameworkType {
	TAILWIND = 'tailwind',
	BOOTSTRAP = 'bootstrap',
	MATERIAL = 'material'
}

export interface Framework {
	id: FrameworkType;
	name: string;
	version: string;
	description: string;
	logoPath: string;
}

@Component({
	selector: 'app-framework-presets',
	standalone: true,
	imports: [CommonModule, RouterModule],
	templateUrl: './framework-presets.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class FrameworkPresetsComponent {
	selectedFramework = signal<FrameworkType | null>(null);

	frameworks: Framework[] = [
		{
			id: FrameworkType.TAILWIND,
			name: 'Tailwind CSS',
			version: 'v3.4',
			description: 'A utility-first CSS framework',
			logoPath: `M12.001,4.8c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 C13.666,10.618,15.027,12,18.001,12c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C16.337,6.182,14.976,4.8,12.001,4.8z M6.001,12c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 c1.177,1.194,2.538,2.576,5.512,2.576c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C10.337,13.382,8.976,12,6.001,12z`
		},
		{
			id: FrameworkType.BOOTSTRAP,
			name: 'Bootstrap',
			version: 'v5.3',
			description: `The world's most popular CSS framework`,
			logoPath: `M11.77 11.24H9.956V8.202h2.152c1.17 0 1.834.522 1.834 1.466 0 1.008-.773 1.572-2.174 1.572zm.324 1.206H9.957v3.348h2.231c1.459 0 2.232-.585 2.232-1.685s-.795-1.663-2.326-1.663zM24 11.39v1.218c-1.128.108-1.817.944-2.226 2.268-.407 1.319-.463 2.937-.42 4.186.045 1.3-.968 2.5-2.337 2.5H4.985c-1.37 0-2.383-1.2-2.337-2.5.043-1.249-.013-2.867-.42-4.186-.41-1.324-1.1-2.16-2.228-2.268V11.39c1.128-.108 1.819-.944 2.227-2.268.408-1.319.464-2.937.42-4.186-.045-1.3.968-2.5 2.338-2.5h14.032c1.37 0 2.382 1.2 2.337 2.5-.043 1.249.013 2.867.42 4.186.409 1.324 1.098 2.16 2.226 2.268zm-7.927 2.817c0-1.354-.953-2.333-2.368-2.488v-.057c1.04-.169 1.856-1.135 1.856-2.213 0-1.537-1.213-2.538-3.062-2.538h-4.16v10.172h4.181c2.218 0 3.553-1.086 3.553-2.876z`
		},
		{
			id: FrameworkType.MATERIAL,
			name: 'Material UI',
			version: 'v5.0',
			description: `Google's Material Design implementation`,
			logoPath: `M.515 1.295l7.643 4.383a.688.688 0 0 0 .684 0l7.643-4.383a.344.344 0 0 1 .515.298v12.03c0 .235-.12.453-.319.58l-4.65 2.953 3.11 1.832c.22.13.495.127.713-.009l4.61-2.878a.344.344 0 0 0 .161-.292v-4.085c0-.254.14-.486.362-.606l2.507-1.346a.344.344 0 0 1 .506.303v7.531c0 .244-.13.47-.34.593l-7.834 4.592a.688.688 0 0 1-.71-.009l-5.953-3.681A.344.344 0 0 1 9 18.808v-3.624c0-.115.057-.222.153-.286l4.04-2.694a.688.688 0 0 0 .307-.572v-4.39a.137.137 0 0 0-.208-.117l-4.44 2.664a.688.688 0 0 1-.705.002L3.645 7.123a.138.138 0 0 0-.208.118v7.933a.344.344 0 0 1-.52.295L.5 14.019C.19 13.833 0 13.497 0 13.135V1.593c0-.264.286-.43.515-.298Z`
		}
	];

	selectedFrameworkName = computed(() => {
		const selected = this.selectedFramework();
		if (!selected) return '';
		return this.frameworks.find((f) => f.id === selected)?.name || '';
	});

	constructor(
		public converterService: ConverterService,
		private router: Router
	) {}

	// selectFramework(framework: FrameworkType) {
	// 	this.selectedFramework.set(framework);
	// }

	isRouteActive(frameworkId: string): boolean {
		return this.router.url.includes(`/framework-presets/${frameworkId}`);
	}
}
