import { writable } from 'svelte/store';

const createCartStore = () => {
	const cartItemList: CartItem[] = [] as CartItem[];
	const { subscribe, set } = writable<CartItem[]>(cartItemList);

	const customSet = (cart: CartItem[]) => {
		window.localStorage.setItem('cart', JSON.stringify(cart));
		set(cart);
	};
	const customGet = (): CartItem[] => {
		const stringifiedCart = window.localStorage.getItem('cart');
		if (!stringifiedCart) throw new Error('Expected cart in localstorage but found nothing');
		return JSON.parse(stringifiedCart) as CartItem[];
	};

	return {
		subscribe,
		init: () => {
			// Init will either grab the cart from localstorage if it exists or create a new one
			const stringifiedCart = window.localStorage.getItem('cart');
			if (stringifiedCart) customSet(JSON.parse(stringifiedCart));
			else customSet([]);
		},
		add: (cartItem: CartItem) => {			
			const cart = customGet();
			for (const item of cart) {
				if (cartItem.product.id === item.product.id) {
					item.quantity++;
					customSet(cart);
					return;
				}
			}
			cart.push(cartItem);
			customSet(cart);
			return;
		},
		remove: (cartItem: CartItem) => {
			const cart = customGet();
			for (const item of cart) {
				if (cartItem.product.id === item.product.id) {
					item.quantity--;
					if (item.quantity <= 0) cart.splice(cart.indexOf(item), 1);
					customSet(cart);
					return;
				}
			}
		},
		clear: () => {
			const cart: CartItem[] = [] as CartItem[];
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
