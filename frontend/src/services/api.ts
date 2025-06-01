import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const login = async (username: string, password: string) => {
    const response = await api.post('/token/', { username, password });
    localStorage.setItem('token', response.data.access);
    localStorage.setItem('refresh_token', response.data.refresh);
    return response.data;
};

export const register = async (username: string, email: string, password: string) => {
    const response = await api.post('/users/', { username, email, password });
    return response.data;
};

export const getOrderBook = async (token: string = 'RELIANCE') => {
    const response = await api.get(`/orders/order_book/?token=${token}`);
    return response.data;
};

export const placeOrder = async (order: {
    price: number;
    quantity: number;
    order_type: 'BID' | 'ASK';
    token?: string;
}) => {
    const response = await api.post('/orders/', order);
    return response.data;
};

export const getTrades = async (token: string = 'RELIANCE') => {
    const response = await api.get(`/trades/?token=${token}`);
    return response.data;
};

export default api;
