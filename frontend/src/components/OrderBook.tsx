import React, { useEffect, useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Button,
    Stack,
} from '@mui/material';
import { Order, OrderBook as OrderBookType } from '../types';
import { getOrderBook } from '../services/api';

const OrderBook: React.FC = () => {
    const [orderBook, setOrderBook] = useState<OrderBookType>({ bids: [], asks: [] });
    const [loading, setLoading] = useState(true);

    const fetchOrderBook = async () => {
        try {
            const data = await getOrderBook();
            setOrderBook(data);
        } catch (error) {
            console.error('Error fetching order book:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrderBook();
        const interval = setInterval(fetchOrderBook, 5000);
        return () => clearInterval(interval);
    }, []);

    const renderOrders = (orders: Order[], type: 'bid' | 'ask') => (
        <TableContainer component={Paper} sx={{ mb: 2 }}>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Price</TableCell>
                        <TableCell>Quantity</TableCell>
                        <TableCell>User</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {orders.map((order) => (
                        <TableRow key={order.id}>
                            <TableCell sx={{ color: type === 'bid' ? 'success.main' : 'error.main' }}>
                                {order.price}
                            </TableCell>
                            <TableCell>{order.quantity}</TableCell>
                            <TableCell>{order.username}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );

    if (loading) {
        return <Typography>Loading order book...</Typography>;
    }

    return (
        <Stack spacing={2}>
            <Stack direction="row" justifyContent="flex-start" sx={{ mb: 2 }}>
                <Button variant="contained" onClick={fetchOrderBook}>
                    Refresh
                </Button>
            </Stack>
            <Stack direction="row" spacing={2}>
                <Stack flex={1}>
                    <Typography variant="h6" gutterBottom>
                        Bids
                    </Typography>
                    {renderOrders(orderBook.bids, 'bid')}
                </Stack>
                <Stack flex={1}>
                    <Typography variant="h6" gutterBottom>
                        Asks
                    </Typography>
                    {renderOrders(orderBook.asks, 'ask')}
                </Stack>
            </Stack>
        </Stack>
    );
};

export default OrderBook;
