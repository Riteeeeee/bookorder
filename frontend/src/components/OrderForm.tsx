import React, { useState } from 'react';
import {
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Paper,
    Typography,
    Box,
    SelectChangeEvent,
} from '@mui/material';
import { placeOrder } from '../services/api';

const OrderForm: React.FC = () => {
    const [order, setOrder] = useState({
        price: '',
        quantity: '',
        order_type: 'BID',
        token: 'RELIANCE',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSelectChange = (e: SelectChangeEvent) => {
        const { name, value } = e.target;
        setOrder((prev) => ({ ...prev, [name]: value }));
        setError(null);
        setSuccess(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setOrder((prev) => ({ ...prev, [name]: value }));
        setError(null);
        setSuccess(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const numericPrice = parseFloat(order.price);
            const numericQuantity = parseFloat(order.quantity);

            if (isNaN(numericPrice) || isNaN(numericQuantity)) {
                throw new Error('Price and quantity must be valid numbers');
            }

            if (numericPrice <= 0 || numericQuantity <= 0) {
                throw new Error('Price and quantity must be greater than 0');
            }

            await placeOrder({
                price: numericPrice,
                quantity: numericQuantity,
                order_type: order.order_type as 'BID' | 'ASK',
                token: order.token,
            });

            setSuccess(true);
            setOrder({ ...order, price: '', quantity: '' });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to place order');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Paper sx={{ p: 3, maxWidth: 400, mx: 'auto' }}>
            <Typography variant="h6" gutterBottom>
                Place Order
            </Typography>
            <form onSubmit={handleSubmit}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <FormControl fullWidth>
                        <InputLabel>Order Type</InputLabel>
                        <Select
                            name="order_type"
                            value={order.order_type}
                            label="Order Type"
                            onChange={handleSelectChange}
                        >
                            <MenuItem value="BID">Bid</MenuItem>
                            <MenuItem value="ASK">Ask</MenuItem>
                        </Select>
                    </FormControl>

                    <TextField
                        name="price"
                        label="Price"
                        type="number"
                        value={order.price}
                        onChange={handleInputChange}
                        required
                        inputProps={{ step: 'any', min: '0' }}
                    />

                    <TextField
                        name="quantity"
                        label="Quantity"
                        type="number"
                        value={order.quantity}
                        onChange={handleInputChange}
                        required
                        inputProps={{ step: 'any', min: '0' }}
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={loading}
                    >
                        {loading ? 'Placing Order...' : 'Place Order'}
                    </Button>

                    {error && (
                        <Typography color="error" variant="body2">
                            {error}
                        </Typography>
                    )}

                    {success && (
                        <Typography color="success.main" variant="body2">
                            Order placed successfully!
                        </Typography>
                    )}
                </Box>
            </form>
        </Paper>
    );
};

export default OrderForm;
