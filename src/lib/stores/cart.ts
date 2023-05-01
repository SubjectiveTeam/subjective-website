import { writable } from 'svelte/store';

const createCartStore = () => {
	const cartMap = new Map<string, CartItem>();
	const { subscribe, set } = writable<Map<string, CartItem>>(cartMap);

	function stringifyMap(map: Map<string, CartItem>): string {
		const obj: { [key: string]: CartItem } = {};
		map.forEach((value, key) => {
			obj[key] = value;
		});
		return JSON.stringify(obj);
	}

	function parseMap(str: string): Map<string, CartItem> {
		const obj: { [key: string]: CartItem } = JSON.parse(str);
		const map = new Map<string, CartItem>();
		Object.keys(obj).forEach((key) => {
			map.set(key, obj[key]);
		});
		return map;
	}

	const customSet = (cart: Map<string, CartItem>) => {
		window.localStorage.setItem('cart', stringifyMap(cart));
		set(cart);
	};
	const customGet = () => {
		const stringifiedCart = window.localStorage.getItem('cart');
		if (!stringifiedCart) throw new Error('Expected cart in localstorage but found nothing');
		return parseMap(stringifiedCart);
	};
	return {
		subscribe,
		init: () => {
			// Init will either grab the cart from localstorage if it exists or create a new one
			const stringifiedCart = window.localStorage.getItem('cart');
			if (stringifiedCart) customSet(parseMap(stringifiedCart));
			else customSet(new Map<string, CartItem>());
		},
		add: (product: Product) => {
			const cart = customGet();
			const item = cart.get(product.id);
			if (item) {
				item.quantity++;
				cart.set(product.id, item);
			} else {
				const newItem: CartItem = {
					product,
					quantity: 1
				};
				cart.set(product.id, newItem);
			}
			customSet(cart);
		},
		remove: (product: Product) => {
			const cart = customGet();
			const item: CartItem | undefined = cart.get(product.id);
			if (item) {
				item.quantity--;
				if (item.quantity === 0) cart.delete(product.id);
				else cart.set(product.id, item);
			}
			customSet(cart);
		},
		clear: () => {
			const cart = new Map<string, CartItem>();
			customSet(cart);
		},
		checkout: async () => {
			const items = [...customGet().values()];
			const checkoutReponse = await fetch('/api/checkout', {
				method: 'POST',
				headers: {
					'content-type': 'application.json'
				},
				body: JSON.stringify({ items: items })
			});
			if (checkoutReponse.ok) {
				const response: CheckoutResponse = {
					type: 'success',
					url: (await checkoutReponse.json()).url
				};
				return response;
			} else {
				const response: CheckoutResponse = {
					type: 'failure'
				};
				return response;
			}
		}
	};
};

export const cartStore = createCartStore();
