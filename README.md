# Interactive Order Book Web Application

A full-stack web application that simulates an order book for a single token (RELIANCE), built with React and Django.

## Features

- User authentication with JWT
- Real-time order book display
- Place buy (bid) and sell (ask) orders
- Automatic order matching and trade execution
- Trade history tracking
- Modern, responsive UI with Material-UI

## Prerequisites

- Python 3.8+
- Node.js 14+
- npm or yarn

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create and activate a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run migrations:
```bash
python manage.py makemigrations
python manage.py migrate
```

5. Start the development server:
```bash
python manage.py runserver
```

The backend will be running at http://localhost:8000

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will be running at http://localhost:3000

## Usage

1. Register a new account or login with existing credentials
2. View the order book showing current bids and asks
3. Place new orders using the order form
4. Monitor trade history for executed trades
5. Orders are automatically matched when possible

## Architecture

### Backend (Django)

- Django REST framework for API development
- JWT authentication for secure access
- PostgreSQL database (configured for SQLite in development)
- Automatic order matching engine

### Frontend (React)

- TypeScript for type safety
- Material-UI for modern, responsive design
- Real-time updates with polling
- JWT token management
- Modular component architecture

## API Endpoints

- `/api/token/` - Get JWT tokens
- `/api/users/` - User registration
- `/api/orders/` - Place and view orders
- `/api/orders/order_book/` - Get current order book state
- `/api/trades/` - View trade history

## Assumptions and Limitations

1. Single token trading (RELIANCE)
2. Simple price-time priority matching
3. No order modification or cancellation
4. Basic error handling
5. Polling for updates (no WebSocket)

## Future Improvements

1. Add WebSocket support for real-time updates
2. Implement order modification and cancellation
3. Add support for multiple tokens
4. Enhanced error handling and validation
5. Add charts and analytics
6. Implement unit tests
7. Add order book depth visualization
