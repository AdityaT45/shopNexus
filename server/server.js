
// 1. Load environment variables
const dotenv = require('dotenv');
dotenv.config();

// 2. Import connectDB and Express
const express = require('express');
const connectDB = require('./config/db');

// 3. Call the DB connection function
connectDB(); 


// 4. Initialize the app
const app = express();
app.use(express.json());

const authRouter=require('./routes/authRoutes')
const userRouter=require('./routes/userRoutes')
const productRouter=require('./routes/productRoutes')
const cartRouter=require('./routes/cartRoutes')
const orderRouter=require('./routes/orderRoutes')

app.use('/api/auth',authRouter)
app.use('/api/users',userRouter)
app.use('/api/products',productRouter)
app.use('/api/carts',cartRouter)
app.use('/api/orders',orderRouter)

// 5. Define a port and start the server
const PORT = process.env.PORT || 5000;

app.listen(
    PORT, 
    () => console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`)
);
