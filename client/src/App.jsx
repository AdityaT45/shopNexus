// client/src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Import Components
import Header from './component/Header';

// Import Pages (will be created in upcoming steps)
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
    import 'bootstrap/dist/css/bootstrap.min.css';
import ProductScreen from './pages/ProductScreen';
import CartScreen from './pages/CartScreen';
import CheckoutScreen from './pages/CheckoutScreen';
import MyOrdersScreen from './pages/MyOrdersScreen';

function App() {
    return (
        <>
            <Header />
            <main className='py-3'>
                <div className='container'>
                    <Routes>
                        <Route path='/' element={<Home />} />
                        <Route path='/register' element={<Register />} />
                        <Route path='/login' element={<Login />} />
                        <Route path='/products/:id' element={<ProductScreen />} />
                        <Route path='/cart' element={<CartScreen />} />
                        <Route path='/checkout' element={<CheckoutScreen />} />
                        <Route path='/myorders' element={<MyOrdersScreen />} />
                    </Routes>
                </div>
            </main>
        </>
    );
}

export default App;