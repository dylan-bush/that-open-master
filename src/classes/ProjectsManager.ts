import { IProject, Project } from "./Project";

export class ProjectsManager {
    list: Project[] = [];
    ui: HTMLElement

    constructor(container: HTMLElement) {
        this.ui = container;
    }

    newProject(projectData: IProject) {
        const projectNames = this.list.map((project) => {
            return project.projectName
        })
        const projectNameExists = projectNames.includes(projectData.projectName);
        if (projectNameExists) {
            throw new Error(`Project with name ${projectData.projectName} already exists`);
        }
        const project = new Project(projectData);
        project.ui.addEventListener("click", () => {
            const projectsPage = document.getElementById("projects-page");
            const detailsPage = document.getElementById("project-details");
            if (!projectsPage || !detailsPage) { return }
            projectsPage.classList.add("hidden");
            detailsPage.classList.remove("hidden");
        });
        this.ui.append(project.ui);
        this.list.push(project);
        return project;
    }


    getProject(id: string) {
        const project = this.list.find((project) => {
            return project.id === id
        });
        return project
    }

    deleteProject(id: string) {
        const project = this.getProject(id);
        if (!project) { return }
        project.ui.remove();

        const remaining = this.list.filter((project) => {
            return project.id !== id
        });
        this.list = remaining;
     }

    exportToJSON(filename: string = "projects") {
        const json = JSON.stringify(this.list, null, 2);
        const blob = new Blob([json], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
     }

    importFromJSON(id: string) {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "application/json";
        const reader = new FileReader();
        reader.addEventListener("load", () => {
            const json = reader.result
            if (!json) { return }
            const projects: IProject[] = JSON.parse(json as string)
            for (const projectData of projects) {
                try {
                    this.newProject(projectData);
                } catch (error) {
                    console.error(error);
                }
            }
        });
        input.addEventListener("change", () => {
            const filesList = input.files;
            if (!filesList) { return }
            reader.readAsText(filesList[0]);
        });
        input.click();
    }

     calcTotalProjectsCost() {
        const costs = this.list.map(project => project.cost);
        const totalCost = costs.reduce((sum, cost) => sum + cost, 0);
        return totalCost;

     }

     getProjectByName(projectName: string) {
         const project = this.list.find((project) => {
             return project.projectName === projectName
         });
         return project
     }

}