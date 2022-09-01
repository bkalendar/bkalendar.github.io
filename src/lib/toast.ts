import { writable } from 'svelte/store';

interface Toast {
	status: 'ok' | 'error';
	message: string;
	duration: number;
}

function createToast() {
	const toasts = writable<Toast[]>([]);
	function push(toast: Toast) {
		toasts.update(($toasts) => {
			$toasts.push(toast);
			return $toasts;
		});
		setTimeout(
			() =>
				toasts.update(($toasts) => {
					$toasts.shift();
					return $toasts;
				}),
			toast.duration
		);
	}

	return { subscribe: toasts.subscribe, push };
}

export default createToast();
