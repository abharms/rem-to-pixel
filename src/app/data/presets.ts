// types/preset.types.ts
export interface UnitValue {
	rem: number | null;
	px: number | null;
	value?: string; // For percentages, auto, or other special values
}
export interface PresetCategory {
	name: string;
	description: string;
	values: Record<string, UnitValue>;
	usage?: string;
	commonUses?: string[];
	relatedClasses?: string[];
	modifiers?: string[];
	specialValues?: string[];
	bestPractices?: string[];
	notes?: string;
	fractionValues?: string[];
}

export interface FrameworkPresets {
	name: string;
	categories: PresetCategory[];
}

export const tailwindPresets: FrameworkPresets = {
	name: 'Tailwind CSS',
	categories: [
		{
			name: 'Font Sizes',
			description: 'Typography size utilities for text elements',
			usage: 'text-{size}',
			commonUses: ['text-base for body text (16px)', 'text-sm for secondary text (14px)', 'text-xs for fine print (12px)', 'text-lg -> text-4xl for headings'],
			relatedClasses: ['tracking-{size} for letter spacing', 'leading-{size} for line height', 'font-{weight} for boldness'],
			values: {
				xs: { rem: 0.75, px: 12 },
				sm: { rem: 0.875, px: 14 },
				base: { rem: 1, px: 16 },
				lg: { rem: 1.125, px: 18 },
				xl: { rem: 1.25, px: 20 },
				'2xl': { rem: 1.5, px: 24 },
				'3xl': { rem: 1.875, px: 30 },
				'4xl': { rem: 2.25, px: 36 },
				'5xl': { rem: 3, px: 48 },
				'6xl': { rem: 3.75, px: 60 },
				'7xl': { rem: 4.5, px: 72 },
				'8xl': { rem: 6, px: 96 },
				'9xl': { rem: 8, px: 128 }
			}
		},
		{
			name: 'Spacing',
			description: 'Margin and padding utilities for element spacing',
			usage: 'm-{size}, p-{size}',
			commonUses: ['p-4 for standard padding (16px)', 'mx-auto for horizontal centering', 'my-2 for vertical rhythm (8px)', 'm-6 for outer spacing (24px)'],
			modifiers: ['mt-{size} (top), mb-{size} (bottom)', 'ml-{size} (left), mr-{size} (right)', 'mx-{size} (horizontal), my-{size} (vertical)'],
			notes: 'Negative margins available with -m{direction}-{size}',
			values: {
				px: { rem: 0.0625, px: 1 },
				'0': { rem: 0, px: 0 },
				'0.5': { rem: 0.125, px: 2 },
				'1': { rem: 0.25, px: 4 },
				'1.5': { rem: 0.375, px: 6 },
				'2': { rem: 0.5, px: 8 },
				'2.5': { rem: 0.625, px: 10 },
				'3': { rem: 0.75, px: 12 },
				'3.5': { rem: 0.875, px: 14 },
				'4': { rem: 1, px: 16 },
				'5': { rem: 1.25, px: 20 },
				'6': { rem: 1.5, px: 24 },
				'8': { rem: 2, px: 32 },
				'10': { rem: 2.5, px: 40 },
				'12': { rem: 3, px: 48 },
				'16': { rem: 4, px: 64 }
			}
		},
		{
			name: 'Width & Height',
			description: 'Sizing utilities for width and height',
			usage: '{w|h}-{size}',
			commonUses: ['w-25 for 25% width', 'h-100 for 100% height', 'w-auto for auto width', 'mw-100 for max-width 100%'],
			specialValues: ['vh-100 for viewport height', 'vw-100 for viewport width', 'min-vh-100 for minimum viewport height'],
			notes: 'Bootstrap primarily uses percentages for width/height, with some utilities in rems',
			values: {
				'25': { rem: null, px: null, value: '25%' },
				'50': { rem: null, px: null, value: '50%' },
				'75': { rem: null, px: null, value: '75%' },
				'100': { rem: null, px: null, value: '100%' },
				auto: { rem: null, px: null, value: 'auto' }
			}
		},
		{
			name: 'Gap',
			description: 'Spacing between grid and flexbox items',
			usage: 'gap-{size}',
			commonUses: ['gap-4 for standard grid gap (16px)', 'gap-6 for larger spacing (24px)', 'gap-x-4 for horizontal gap only', 'gap-y-4 for vertical gap only'],
			bestPractices: ['Use consistent gap sizes within the same container', 'Match gap with padding for alignment', 'Consider smaller gaps on mobile'],
			relatedClasses: [
				'space-x-{size} for non-grid horizontal spacing',
				'space-y-{size} for non-grid vertical spacing',
				'divide-x-{size} for borders between elements'
			],
			values: {
				px: { rem: 0.0625, px: 1 },
				'0': { rem: 0, px: 0 },
				'0.5': { rem: 0.125, px: 2 },
				'1': { rem: 0.25, px: 4 },
				'1.5': { rem: 0.375, px: 6 },
				'2': { rem: 0.5, px: 8 },
				'2.5': { rem: 0.625, px: 10 },
				'3': { rem: 0.75, px: 12 },
				'3.5': { rem: 0.875, px: 14 },
				'4': { rem: 1, px: 16 },
				'5': { rem: 1.25, px: 20 },
				'6': { rem: 1.5, px: 24 },
				'8': { rem: 2, px: 32 },
				'10': { rem: 2.5, px: 40 },
				'12': { rem: 3, px: 48 },
				'16': { rem: 4, px: 64 }
			}
		}
	]
};

export const bootstrapPresets: FrameworkPresets = {
	name: 'Bootstrap',
	categories: [
		{
			name: 'Font Sizes',
			description: 'Typography utilities and heading sizes',
			usage: 'fs-{size}, h{1-6}',
			commonUses: [
				'h1-h6 for semantic headings',
				'fs-1 through fs-6 for non-semantic sizes',
				'display-1 through display-6 for larger hero text',
				'small for smaller text (0.875em)'
			],
			relatedClasses: ['fw-{weight} for font weights', 'lh-{size} for line height', 'text-{size} for responsive font sizes'],
			notes: 'Bootstrap uses rems for font-size utilities and a base font size of 16px',
			values: {
				h1: { rem: 2.5, px: 40 },
				h2: { rem: 2, px: 32 },
				h3: { rem: 1.75, px: 28 },
				h4: { rem: 1.5, px: 24 },
				h5: { rem: 1.25, px: 20 },
				h6: { rem: 1, px: 16 },
				'display-1': { rem: 5, px: 80 },
				'display-2': { rem: 4.5, px: 72 },
				'display-3': { rem: 4, px: 64 },
				'display-4': { rem: 3.5, px: 56 },
				'display-5': { rem: 3, px: 48 },
				'display-6': { rem: 2.5, px: 40 },
				small: { rem: 0.875, px: 14 }
			}
		},
		{
			name: 'Spacing',
			description: "Margin and padding utilities using Bootstrap's spacer scale",
			usage: '{property}{sides}-{size}',
			commonUses: [
				'm-3 for margin (1rem, 16px)',
				'p-4 for padding (1.5rem, 24px)',
				'my-2 for vertical margin (0.5rem, 8px)',
				'px-3 for horizontal padding (1rem, 16px)'
			],
			modifiers: ['m (margin), p (padding)', 't (top), b (bottom), s (start), e (end)', 'x (horizontal), y (vertical)'],
			notes: "Bootstrap's spacing scale goes from 0 to 5, with additional 'auto' value",
			values: {
				'0': { rem: 0, px: 0 },
				'1': { rem: 0.25, px: 4 },
				'2': { rem: 0.5, px: 8 },
				'3': { rem: 1, px: 16 },
				'4': { rem: 1.5, px: 24 },
				'5': { rem: 3, px: 48 }
			}
		},
		{
			name: 'Width & Height',
			description: 'Sizing utilities for width and height',
			usage: '{w|h}-{size}',
			commonUses: ['w-25 for 25% width', 'h-100 for 100% height', 'w-auto for auto width', 'mw-100 for max-width 100%'],
			specialValues: ['vh-100 for viewport height', 'vw-100 for viewport width', 'min-vh-100 for minimum viewport height'],
			notes: 'Bootstrap primarily uses percentages for width/height, with some utilities in rems',
			values: {
				'25': { rem: null, px: null, value: '25%' },
				'50': { rem: null, px: null, value: '50%' },
				'75': { rem: null, px: null, value: '75%' },
				'100': { rem: null, px: null, value: '100%' },
				auto: { rem: null, px: null, value: 'auto' }
			}
		},
		{
			name: 'Gap (Gutters)',
			description: 'Spacing between grid and flexbox items',
			usage: 'g{x|y}-{size}',
			commonUses: ['g-3 for equal gutters (1rem, 16px)', 'gx-4 for horizontal gutters (1.5rem, 24px)', 'gy-2 for vertical gutters (0.5rem, 8px)'],
			bestPractices: [
				'Use consistent gutter sizes within the same container',
				'Consider smaller gutters on mobile using responsive prefixes',
				'Combine with row and col classes for grid layouts'
			],
			relatedClasses: ['row-cols-* for number of columns', 'col-gap for column gaps', 'row-gap for row gaps'],
			values: {
				'0': { rem: 0, px: 0 },
				'1': { rem: 0.25, px: 4 },
				'2': { rem: 0.5, px: 8 },
				'3': { rem: 1, px: 16 },
				'4': { rem: 1.5, px: 24 },
				'5': { rem: 3, px: 48 }
			}
		}
	]
};
