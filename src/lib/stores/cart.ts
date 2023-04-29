import { goto } from "$app/navigation";
import { get, writable } from "svelte/store"

const createCartStore = () => {
    const cartMap = new Map<number, CartItem>();
    const { subscribe, set } = writable<Map<number, CartItem>>(cartMap);

    function stringifyMap(map: Map<number, CartItem>): string {
        const obj: {[key: number]: CartItem} = {};
        map.forEach((value, key) => {
        obj[key] = value;
        });
        return JSON.stringify(obj);
    }
    
    function parseMap(str: string): Map<number, CartItem> {
        const obj: {[key: number]: CartItem} = JSON.parse(str);
        const map = new Map<number, CartItem>();
        Object.keys(obj).forEach(key => {
        map.set(Number(key), obj[Number(key)]);
        });
        return map;
    }

    const customSet = (cart: Map<number, CartItem>) => {
        window.localStorage.setItem('cart', stringifyMap(cart));
        set(cart);
    }
    const customGet = () => {
        const stringifiedCart = window.localStorage.getItem('cart');
        if (!stringifiedCart) throw new Error('Expected cart in localstorage but found nothing');
        return parseMap(stringifiedCart);
    }
    return {
        subscribe,
        init: () => {
            // Init will either grab the cart from localstorage if it exists or create a new one
            const stringifiedCart = window.localStorage.getItem('cart');
            if (stringifiedCart) customSet(parseMap(stringifiedCart));
            else customSet(new Map<number, CartItem>());
        },
        add: (product: Product) => {
            const cart = customGet();
            const item = cart.get(product.id);
            if (item) {
                item.quantity++;
                cart.set(product.id, item);
            }
            else {
                const newItem: CartItem = {
                    product,
                    quantity: 1
                }
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
            const cart = new Map<number, CartItem>();
            customSet(cart);
        },
        checkout: async () => {
            const items = Array.from(customGet().values());
            const checkoutReponse = await fetch('/api/checkout', {
                method: 'POST',
                headers: {
                    'content-type' : 'application.json'
                },
                body: JSON.stringify({ items: items})
            });
            await goto((await checkoutReponse.json()).url);
        },
    }
}

export const cartStore = createCartStore();