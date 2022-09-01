export interface Color {
	background: string;
}

// last updated: 28-08-2022
export const COLORS: Map<string, Color> = new Map(
	Object.entries({
		'1': { background: '#7986cb' }, // lavender
		'2': { background: '#33b679' }, // sage
		'3': { background: '#8e24aa' }, // grape
		'4': { background: '#e67c73' }, // flamingo
		'5': { background: '#f6bf26' }, // banana
		'6': { background: '#f4511e' }, // tangerine
		'7': { background: '#039be5' }, // peacock
		'8': { background: '#616161' }, // graphite
		'9': { background: '#3f51b5' }, // blueberry
		'10': { background: '#0b8043' }, // basil
		'11': { background: '#d50000' } // tomato
	})
);

export function* randomColorIds(size: number) {
	if (size <= 0) return;

	const colorIds = [...COLORS.keys()];

	const swap = (i: number, j: number) => {
		let temp = colorIds[i];
		colorIds[i] = colorIds[j];
		colorIds[j] = temp;
	};

	let prevColorId = '';
	let count = 0;
	while (true) {
		// shuffle the array
		for (let i = colorIds.length - 1; i >= 1; i--) {
			// 0 <= y <= i
			const j = Math.trunc(Math.random() * (i + 1));
			swap(i, j);
		}

		// same color as the latest from previous loop
		if (colorIds[0] == prevColorId) {
			// 1 <= y < length
			const j = 1 + Math.trunc(Math.random() * (colorIds.length - 1));
			swap(0, j);
		}

		for (const colorId of colorIds) {
			yield colorId;
			if (++count == size) return;
		}

		prevColorId = colorIds[colorIds.length - 1];
	}
}
