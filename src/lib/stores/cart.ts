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
		if (!stringifiedCart) {
			throw new Error('Expected cart in localstorage but found nothing');
		}
		return JSON.parse(stringifiedCart) as CartItem[];
	};

	return {
		subscribe,
		init: () => {
			const stringifiedCart = window.localStorage.getItem('cart');
			if (stringifiedCart) {
				const cart = JSON.parse(stringifiedCart) as CartItem[];
				customSet(cart);
			} else {
				customSet([]);
			}
		},
		add: (cartItem: CartItem) => {
			const cart = customGet();
			const index = cart.findIndex((i) => i.product.id === cartItem.product.id);
			if (index !== -1) {
				cart[index].quantity++;
			} else {
				cart.push(cartItem);
			}
			customSet(cart);
		},
		remove: (cartItem: CartItem) => {
			const cart = customGet();
			const index = cart.findIndex((i) => i.product.id === cartItem.product.id);
			if (index !== -1) {
				cart[index].quantity--;
				if (cart[index].quantity <= 0) {
					cart.splice(index, 1);
				}
				customSet(cart);
			}
		},
		clear: () => {
			const cart: CartItem[] = [] as CartItem[];
			customSet(cart);
		},
		checkout: async () => {
			const items = customGet();
			const checkoutReponse = await fetch('/api/checkout', {
				method: 'POST',
				headers: {
					'content-type': 'application/json'
				},
				body: JSON.stringify({ items })
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
