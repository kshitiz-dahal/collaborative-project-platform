import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const AppLayout = ({ children }) => {
    return (
        <div className="app-layout">
            <Sidebar />

            <div className="main-area">
                <Topbar />

                <main className="page-content">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AppLayout;