import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import PostDetailsPage from "./pages/PostDetailsPage";
import CreatePostPage from "./pages/CreatePostPage";
import EditPostPage from "./pages/EditPostPage";
import LoginPage from "./pages/loginPages/LoginPage.jsx";
import RegisterPage from "./pages/loginPages/RegisterPage.jsx";
import ForgotPasswordPage from "./pages/loginPages/ForgotPasswordPage.jsx";

function App() {
    return (
        <BrowserRouter>
            <Routes>

                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />

                <Route path="/" element={<Layout />}>

                    <Route index element={<HomePage />} />

                    <Route path="posts/:id" element={<PostDetailsPage />} />

                    <Route path="create" element={<CreatePostPage />} />

                    <Route path="posts/:id/edit" element={<EditPostPage />} />

                </Route>

            </Routes>
        </BrowserRouter>
    );
}

export default App;
