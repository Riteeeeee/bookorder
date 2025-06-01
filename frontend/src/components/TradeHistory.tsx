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
} from '@mui/material';
import { Trade } from '../types';
import { getTrades } from '../services/api';

const TradeHistory: React.FC = () => {
    const [trades, setTrades] = useState<Trade[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchTrades = async () => {
        try {
            const data = await getTrades();
            setTrades(data);
        } catch (error) {
            console.error('Error fetching trades:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTrades();
        const interval = setInterval(fetchTrades, 5000);
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return <Typography>Loading trade history...</Typography>;
    }

    return (
        <div>
            <Typography variant="h6" gutterBottom>
                Trade History
            </Typography>
            <TableContainer component={Paper}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Price</TableCell>
                            <TableCell>Quantity</TableCell>
                            <TableCell>Buyer</TableCell>
                            <TableCell>Seller</TableCell>
                            <TableCell>Time</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {trades.map((trade) => (
                            <TableRow key={trade.id}>
                                <TableCell>{trade.price}</TableCell>
                                <TableCell>{trade.quantity}</TableCell>
                                <TableCell>{trade.bid_username}</TableCell>
                                <TableCell>{trade.ask_username}</TableCell>
                                <TableCell>
                                    {new Date(trade.executed_at).toLocaleString()}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default TradeHistory;
