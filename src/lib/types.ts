type Product = {
    id: number;
    name: string;
    price: number;
    tags: string[];
}

type CartItem = {
    product: Product
    quantity: number;
}