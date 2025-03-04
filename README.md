# Flash Sale System

## Overview

This is a high-performance backend system for handling real-time flash sales using **MongoDB, Mongoose, and Express.js**. It ensures accurate stock management, prevents over-purchasing, and maintains a leaderboard of successful buyers.

## Features

- **Flash Sale Management**: Products go on sale at predefined times with limited stock.
- **Real-Time Inventory Updates**: Stock decreases accurately with each successful purchase.
- **Concurrency Control**: Prevents overselling using MongoDB transactions and atomic updates.
- **Leaderboard API**: Lists buyers in chronological order of purchase.
- **Security**: Prevents fraudulent transactions and enforces purchase limits.
- **Scalability**: Optimized for high-traffic events.

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (if implemented)
- **Real-time Updates**: WebSockets (optional enhancement)

## Installation

### Prerequisites

- Node.js (v16+)
- MongoDB (local or cloud)

### Setup

1. Clone the repository:

   ```sh
   git clone https://github.com/yourusername/flash-sale-system.git
   cd flash-sale-system
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Create a `.env` file and set the following environment variables:

   ```env
   PORT=3000
   MONGO_URI=mongodb://localhost:27017/flashsale
   JWT_SECRET=your_jwt_secret
   ```

4. Start the server:

   ```sh
   npm run dev
   ```

## API Endpoints

### Authentication

| Method | Endpoint         | Description                      |
| ------ | ---------------- | -------------------------------- |
| POST   | `/auth/register` | Register a new user              |
| POST   | `/auth/login`    | Authenticate and get a JWT token |

### Products

| Method | Endpoint             | Description                 |
| ------ | -------------------- | --------------------------- |
| GET    | `/products`          | Get a list of all products  |
| POST   | `/products`          | Create a new product        |
| POST   | `/products/purchase` | Buy a product on flase sale |

### Leaderboard

| Method | Endpoint       | Description                                 |
| ------ | -------------- | ------------------------------------------- |
| GET    | `/leaderboard` | Get a list of buyers in chronological order |

## Handling Concurrency

- Uses **MongoDB transactions** to ensure atomic stock updates.
- Implements **optimistic locking** to prevent race conditions.

## Error Handling

- Prevents purchases before the sale starts.
- Returns proper error messages when stock runs out.

## Contributing

Feel free to submit pull requests or report issues.

## License

This project is licensed under the MIT License.
