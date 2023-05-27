import { toastStore } from '@skeletonlabs/skeleton';
import { redirect } from '@sveltejs/kit';

export const redirectWithMessage = (
	status: 300 | 301 | 302 | 303 | 304 | 305 | 306 | 307 | 308,
	location: string,
	message: string,
	messageType: MessageType
) => {
	const url = new URL('http://localhost' + location);
	url.searchParams.append('message', encodeURIComponent(message));
	url.searchParams.append('message_type', encodeURIComponent(messageType));
	throw redirect(status, url.pathname + url.search);
};

// Message Type Backgrounds
const messageTypeBackgroundsMap = new Map<string, string>();
messageTypeBackgroundsMap.set('success', 'variant-filled-success');
messageTypeBackgroundsMap.set('warning', 'variant-filled-warning');
messageTypeBackgroundsMap.set('error', 'variant-filled-error');
messageTypeBackgroundsMap.set('info', 'variant-filled-secondary');

export const triggerToastFromRedirect = (url: URL) => {
	const encodedMessage = url.searchParams.get('message');
	const encodedMessageType = url.searchParams.get('message_type');
	if (encodedMessage && encodedMessageType) {
		const message = decodeURIComponent(encodedMessage);
		const messageType = decodeURIComponent(encodedMessageType);
		const background = messageTypeBackgroundsMap.get(messageType);
		if (!background) return;
		toastStore.trigger({ message, background });
		const newURL = new URL(url);
		const searchParams = new URLSearchParams(newURL.search);
		searchParams.delete('message');
		searchParams.delete('message_type');
		newURL.search = searchParams.toString();
		window.history.replaceState(null, '', newURL.href);
	}
};
