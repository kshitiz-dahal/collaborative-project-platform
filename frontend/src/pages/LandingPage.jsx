import { Link } from "react-router-dom";

const LandingPage = () => {
    return (
        <div className="landing-page">
            <header className="landing-header">
                <Link to="/" className="landing-logo">
                    SyncForge
                </Link>

                <nav className="landing-nav">
                    <Link to="/login" className="landing-signin">
                        Sign In
                    </Link>

                    <Link to="/register" className="landing-get-started">
                        Get Started
                    </Link>
                </nav>
            </header>

            <main className="landing-main">
                <section className="landing-hero">
                    <span className="landing-badge">
                        Real-time team collaboration
                    </span>

                    <h1>
                        Your team's work,
                        <span> synchronized in real time.</span>
                    </h1>

                    <p>
                        Manage projects, track tasks, collaborate with your team, and stay updated as work happens.
                    </p>

                    <div className="landing-actions">
                        <Link to="/register" className="landing-primary-button">
                            Get Started
                        </Link>

                        <Link to="/login" className="landing-secondary-button">
                            Sign In
                        </Link>
                    </div>
                </section>

                <section className="landing-features">
                    <div className="landing-feature-card">
                        <div className="landing-feature-icon">⚡</div>
                        <h3>Real-time Collaboration</h3>
                        <p>
                            See tasks, comment, and project updates instantly without refreshing.
                        </p>
                    </div>

                    <div className="landing-feature-card">
                        <div className="landing-feature-icon">✓</div>
                        <h3>Task Management</h3>
                        <p>
                            Create, assign, prioritize, and track tasks across your projects.
                        </p>
                    </div>

                    <div className="landing-feature-card">
                        <div className="landing-feature-icon">👥</div>
                        <h3>Team Projects</h3>
                        <p>
                            Bring your team together in shared project workspaces.
                        </p>
                    </div>

                    <div className="landing-feature-card">
                        <div className="landing-feature-icon">💬</div>
                        <h3>Comments & Activity</h3>
                        <p>
                            Discuss tasks and keep track of everything happening across the project.
                        </p>
                    </div>

                    <div className="landing-feature-card">
                        <div className="landing-feature-icon">🔔</div>
                        <h3>Notifications</h3>
                        <p>
                            Stay informed about assignments, comments, and important project changes.
                        </p>
                    </div>
                </section>
            </main>

            <footer className="landing-footer">
                <span>SyncForge</span>
                <span>Collaborate. Track. Ship.</span>
            </footer>
        </div>
    );
};

export default LandingPage;