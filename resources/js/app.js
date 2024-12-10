require('./bootstrap');

import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import axios from 'axios';

import Login from './login';
import Register from './register';
import LandingPage from './landingpage';
import ProtectedRoute from './ProtectedRoute';
import About from './about';
import CreateThesis from './components/CreateThesis';
import EditThesis from './components/EditThesis';
import ListThesis from './components/ListThesis';
import ThesisDetails from './components/thesisdetails.js';
import SuperAdminLayout from './superadminlayout';
import AdminLayout from './adminlayout';
import UserLayout from './userlayout';
import UserProfile from './components/userprofile.js'; 
import MyList from './components/mylist.js'; 
import Settings from './components/settings.js'; 
import SearchBar from './components/Searchbar.js';
import DashboardSuperAdmin from './dashboardsuperadmin.js';
import UserManagement from './components/usermanagement.js';
import ThesisReview from './components/thesisreview.js';
import DashboardAdmin from './dashboardadmin.js';
import ThesisDashboard from './components/ThesisDashboard';


import './main.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Search from 'antd/es/transfer/search.js';

function App() {
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        const fetchUserRole = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await axios.get('/api/auth/user', {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    setUserRole(response.data.role);
                } catch (error) {
                    console.error('Error fetching user role:', error);
                }
            }
        };
        fetchUserRole();
    }, []);

    useEffect(() => {
        AOS.init();
    }, []);

    return (
        <Router>
            <Routes>
                Public
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/about" element={<About />} />
                

                SuperAdmin
                <Route
                    element={
                        <ProtectedRoute allowedRoles={['superadmin']}>
                            <SuperAdminLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route path="/superadmin-dashboard" element={<DashboardSuperAdmin />} />
                    <Route path="/superadmin-dashboard/manage-users" element={<UserManagement />} />
                    <Route path="/superadmin-dashboard/add-theses" element={<CreateThesis />} />
                    <Route path="/superadmin-dashboard/thesis-review" element={<ThesisReview />} />
                    <Route path="/superadmin-dashboard/edit-thesis" element={<EditThesis />} />
                    <Route path="/superadmin-dashboard/list-theses" element={<ListThesis userRole={userRole} />} />
                    <Route path="/superadmin-thesisdashboard" element={<ThesisDashboard />} />
                </Route>

                Admin
                <Route
                    element={
                        <ProtectedRoute allowedRoles={['admin']}>
                            <AdminLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route path="/admin-dashboard" element={<DashboardAdmin />} />
                    <Route path="/admin-dashboard/add-theses" element={<CreateThesis />} />
                    <Route path="/admin-dashboard/list-theses" element={<ListThesis userRole={userRole} />} />
                    <Route path="/admin-dashboard/edit-thesis/:id" element={<EditThesis />} />
                    <Route path="/admin-dashboard/search" element={<SearchBar />} />
                </Route>

                User
                <Route
                    element={
                        <ProtectedRoute allowedRoles={['user']}>
                            <UserLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route path="/user-dashboard" element={<ListThesis/>} />
                    <Route path="/user-dashboard/my-list" element={<MyList />} />
                    <Route path="/user-dashboard/profile" element={<UserProfile />} />
                    <Route path="/user-dashboard/settings" element={<Settings />} />
                    <Route path="/user-dashboard/thesis/details/:id" element={<ThesisDetails />} />
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
}

const container = document.getElementById('app');
const root = createRoot(container);
root.render(<App />);
