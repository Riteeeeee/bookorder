export interface User {
    id: number;
    username: string;
    email: string;
}

export interface Order {
    id: number;
    user: User;
    username: string;
    price: number;
    quantity: number;
    order_type: 'BID' | 'ASK';
    token: string;
    created_at: string;
    is_active: boolean;
}

export interface Trade {
    id: number;
    bid_user: number;
    ask_user: number;
    bid_username: string;
    ask_username: string;
    price: number;
    quantity: number;
    token: string;
    executed_at: string;
}

export interface OrderBook {
    bids: Order[];
    asks: Order[];
}

export interface AuthResponse {
    access: string;
    refresh: string;
}
