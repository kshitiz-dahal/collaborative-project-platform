import { createContext, useContext, useState } from "react";
import api from "../api/axios"; 

const ProjectContext = createContext();

export const useProjects = () => {
    return useContext(ProjectContext);
};

export const ProjectProvider = ({ children }) => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchProjects = async () => {
        try {
            setLoading(true);

            const response = await api.get("/projects");

            setProjects(response.data.projects);
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const createProject = async (projectData) => {
        try {
            setLoading(true);

            const response = await api.post("/projects", projectData);

            setProjects((currentProjects) => [
                ...currentProjects,
                response.data.project,
            ]);

            return response.data.project;
        } catch (error) {
            console.error("Failed to create project:", error);

            throw error;
        } finally {
            setLoading(false);
        }
    };

    const value = {
        projects,
        setProjects,
        loading,
        fetchProjects,
        createProject,
    };

    return (
        <ProjectContext.Provider value={value}>
            {children}
        </ProjectContext.Provider>
    );
};

export default ProjectContext;