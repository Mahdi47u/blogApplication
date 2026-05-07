// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Layout from "./components/Layout";
// import HomePage from "./pages/HomePage";
// import PostDetailsPage from "./pages/postPages/PostDetailsPage.jsx";
// import CreatePostPage from "./pages/postPages/CreatePostPage.jsx";
// import EditPostPage from "./pages/postPages/EditPostPage.jsx";
// import LoginPage from "./pages/loginPages/LoginPage.jsx";
// import RegisterPage from "./pages/loginPages/RegisterPage.jsx";
// import ForgotPasswordPage from "./pages/loginPages/ForgotPasswordPage.jsx";
//
// function App() {
//     return (
//         <BrowserRouter>
//             <Routes>
//
//                 <Route path="/login" element={<LoginPage />} />
//                 <Route path="/register" element={<RegisterPage />} />
//                 <Route path="/forgot-password" element={<ForgotPasswordPage />} />
//
//                 <Route path="/" element={<Layout />}>
//
//                     <Route index element={<HomePage />} />
//
//                     <Route path="posts/:id" element={<PostDetailsPage />} />
//
//                     <Route path="create" element={<CreatePostPage />} />
//
//                     <Route path="posts/:id/edit" element={<EditPostPage />} />
//
//                 </Route>
//
//             </Routes>
//         </BrowserRouter>
//     );
// }
//
// export default App;
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";

// Auth / Utils
import RequireAuth from "./components/RequireAuth";
import RequireAdmin from "./components/RequireAdmin";

// Pages
import HomePage from "./pages/HomePage";
import PostDetailsPage from "./pages/postPages/PostDetailsPage.jsx";
import CreatePostPage from "./pages/postPages/CreatePostPage.jsx";
import EditPostPage from "./pages/postPages/EditPostPage.jsx";
import LoginPage from "./pages/loginPages/LoginPage.jsx";
import RegisterPage from "./pages/loginPages/RegisterPage.jsx";
import ForgotPasswordPage from "./pages/loginPages/ForgotPasswordPage.jsx";
import ProfilePage from "./pages/profile/ProfilePage.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminUsersPage from "./pages/admin/AdminUsersPage.jsx";
import AdminPostsPage from "./pages/admin/AdminPostsPage.jsx";

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

                    {/* USER PROTECTED ROUTES */}
                    <Route element={<RequireAuth />}>
                        <Route path="profile" element={<ProfilePage />} />
                        <Route path="create" element={<CreatePostPage />} />
                        <Route path="posts/:id/edit" element={<EditPostPage />} />
                    </Route>

                    {/* ADMIN ROUTES */}
                    <Route element={<RequireAdmin />}>
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
