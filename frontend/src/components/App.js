import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '../views/Home';
import CreateAd from '../views/CreateAd';
import Login from '../views/Login';
import Signup from '../views/Register';
import AuthenticatedRoute from './AuthenticatedRoute';
import Account from '../views/Account';
import ProductDetail from '../views/ProductDetail';
import AccountProducts from '../views/AccountProducts';
import ModifyAd from '../views/ModifyAd';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/createad" element={
                    <AuthenticatedRoute>
                        <CreateAd />
                    </AuthenticatedRoute>
                } />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/account" element={
                    <AuthenticatedRoute>
                        <Account />
                    </AuthenticatedRoute>
                } />
                <Route path="/product/:id" element={
                    <AuthenticatedRoute>
                        <ProductDetail />
                    </AuthenticatedRoute>
                } />
                <Route path="/account-annonces" element={
                    <AuthenticatedRoute>
                        <AccountProducts />
                    </AuthenticatedRoute>
                } />
                <Route path="/user/:id/modify-ad/:id" element={
                    <AuthenticatedRoute>
                        <ModifyAd />
                    </AuthenticatedRoute>
                } />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
