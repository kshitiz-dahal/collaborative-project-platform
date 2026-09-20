import { Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

import ProjectsPage from "./pages/ProjectsPage";
import ProjectDetailsPage from "./pages/ProjectDetailsPage";

import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./components/layout/AppLayout";

function App() {
    return (
        <Routes>
            {/* Landing Page Routes */}
            <Route path="/" element={<LandingPage />} />

            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected application */}
            <Route
                path="/projects"
                element={
                    <ProtectedRoute>
                        <AppLayout>
                            <ProjectsPage />
                        </AppLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/projects/:projectId"
                element={
                    <ProtectedRoute>
                        <AppLayout>
                            <ProjectDetailsPage />
                        </AppLayout>
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
}

export default App;