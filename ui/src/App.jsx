import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";

// Auth / Utils
import RequireAuth from "./components/auth/RequireAuth.jsx";
import RequireAdmin from "./components/auth/RequireAdmin.jsx";

// Pages
import HomePage from "./pages/HomePage";
import PostDetailsPage from "./pages/posts/PostDetailsPage.jsx";
import CreatePostPage from "./pages/posts/CreatePostPage.jsx";
import EditPostPage from "./pages/posts/EditPostPage.jsx";
import LoginPage from "./pages/login/LoginPage.jsx";
import RegisterPage from "./pages/login/RegisterPage.jsx";
import ForgotPasswordPage from "./pages/login/ForgotPasswordPage.jsx";
import ProfilePage from "./pages/profile/ProfilePage.jsx";
import PublicProfilePage from "./pages/users/PublicProfilePage.jsx";
import SavedPostsPage from "./pages/bookmarks/SavedPostsPage.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminUsersPage from "./pages/admin/AdminUsersPage.jsx";
import AdminPostsPage from "./pages/admin/AdminPostsPage.jsx";
import CategoriesPage from "./pages/admin/CategoriesPage";
import CategoryPostsPage from "./pages/categories/CategoryPostsPage";


function App() {
    return (
        <BrowserRouter>
            <Routes>

                {/* Public Routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />


                {/* Layout wrapper */}
                <Route path="/" element={<Layout />}>

                    {/* Public */}
                    <Route index element={<HomePage />} />
                    <Route path="posts/:id" element={<PostDetailsPage />} />
                    <Route path="users/:id" element={<PublicProfilePage />} />
                    <Route path="categories/:slug" element={<CategoryPostsPage />} />

                    {/* USER PROTECTED ROUTES */}
                    <Route element={<RequireAuth />}>
                        <Route path="profile" element={<ProfilePage />} />
                        <Route path="bookmarks" element={<SavedPostsPage />} />
                        <Route path="create" element={<CreatePostPage />} />
                        <Route path="posts/:id/edit" element={<EditPostPage />} />
                    </Route>

                    {/* ADMIN ROUTES */}
                    <Route element={<RequireAdmin />}>
                        <Route path="/admin/categories" element={<CategoriesPage />} />
                        <Route path="admin/dashboard" element={<AdminDashboard />} />
                        <Route path="admin/users" element={<AdminUsersPage />} />
                        <Route path="admin/posts" element={<AdminPostsPage />} />
                    </Route>

                </Route>

            </Routes>
        </BrowserRouter>
    );
}

export default App;
