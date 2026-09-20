import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Sidebar = () => {
    const { user, logout } = useAuth();

    return (
        <aside className="sidebar">
            <div className="sidebar-brand">
                <div className="brand-icon">
                    ✦
                </div>

                <span>CollabSpace</span>
            </div>

            <nav className="sidebar-nav">
                <NavLink
                    to="/projects"
                    className={({ isActive }) =>
                        `sidebar-link ${isActive ? "active" : ""}`
                    }
                >
                    <span>▣</span>
                    Projects
                </NavLink>  
            </nav>

            <div className="sidebar-bottom">
                <div className="sidebar-user">
                    <div className="user-avatar">
                        {user?.name?.charAt(0).toUpperCase() || "U"}
                    </div>

                    <div className="user-info">
                        <strong>{user?.name || "User"}</strong>
                        <span>{user?.email || ""}</span>
                    </div>
                </div>

                <button
                    className="logout-button"
                    onClick={logout}
                >
                    ↪ Logout
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;