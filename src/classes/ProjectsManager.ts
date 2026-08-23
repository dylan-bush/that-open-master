//THIS FILE manages the list of projects and their UI cards, owns the project collection and project-related app state

import { IProject, Project } from "./Project";

export class ProjectsManager {
    list: Project[] = [];
    ui: HTMLElement
    selectedProject: Project | null = null;

    constructor(container: HTMLElement) {
        this.ui = container;
    }

    //Creates a new project and adds it to the list of projects. It also creates the project's UI card and appends it to the container.
    newProject(projectData: IProject) {
        projectData.projectName = projectData.projectName.trim()
        const projectNames = this.list.map((project) => {
            return project.projectName
        })
        const projectNameExists = projectNames.includes(projectData.projectName);
        if (projectNameExists) {
            throw new Error(`Project with name ${projectData.projectName} already exists`);
        }

        const projectNameLength = projectData.projectName.length;
        if (projectNameLength < 5 || projectNameLength > 100) {
            throw new Error(`Project name must be between 5 and 100 characters`);
        }

        const project = new Project(projectData);
        project.ui.addEventListener("click", () => {
            this.selectedProject = project;
            const projectsPage = document.getElementById("projects-page");
            const detailsPage = document.getElementById("project-details");
            if (!projectsPage || !detailsPage) { return }
            projectsPage.classList.add("hidden");
            detailsPage.classList.remove("hidden");
            this.setDetailsPage(project);
        });
        this.ui.append(project.ui);
        this.list.push(project);
        return project;
    }

    //Sets the project details page with the selected project's information, including its name, description, status, cost, role, finish date, and progress. It also updates the progress bar width based on the project's progress.
    private setDetailsPage(project: Project) {
        const detailsPage = document.getElementById("project-details");
        if (!detailsPage) { return }
        const icon = detailsPage.querySelector("[data-project-info='icon']");
        const name = detailsPage.querySelectorAll("[data-project-info='name']");
        const description = detailsPage.querySelectorAll("[data-project-info='description']");
        const status = detailsPage.querySelector("[data-project-info='status']");
        const cost = detailsPage.querySelector("[data-project-info='cost']");
        const role = detailsPage.querySelector("[data-project-info='role']");
        const finishDate = detailsPage.querySelector("[data-project-info='finish-date']");
        const progress = detailsPage.querySelector("[data-project-info='progress']");
        const progressBar = detailsPage.querySelector("[data-project-info='progress-bar']");

        if (icon) { icon.textContent = project.projectName.slice(0, 2) }
        if (name) { name.forEach((el) => { el.textContent = project.projectName }) }
        if (description) { description.forEach((el) => { el.textContent = project.projectDescription }) }
        if (status) { status.textContent = project.projectStatus }
        if (cost) { cost.textContent = `$${project.cost}` }
        if (role) { role.textContent = project.projectRole }
        if (finishDate) { finishDate.textContent = project.projectCompletionDate.toLocaleDateString() }
        if (progress) { progress.textContent = `${project.progress * 100}%` }
        if (progressBar) { progressBar.style.width = `${project.progress * 100}%` }
        this.setTodoUI(project);
    }

    updateDetailsPage() {
    if (!this.selectedProject) { return }
    this.setDetailsPage(this.selectedProject)
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

    private setTodoUI(project: Project) {
        const todoList = document.getElementById("todo-list");
        if (!todoList) { return }

        todoList.innerHTML = "";

        project.todos.forEach((todo) => {
            const todoItem = document.createElement("div");
            todoItem.classList.add("task-item");
            todoItem.innerHTML = `
                <div style="display: flex; align-items: center;">
                    <span class="material-icons-round task-icon">construction</span>
                    <p data-todo-info="name" style="margin:0px 15px;">${todo.todoName}</p>
                </div>
                <p data-todo-info="date">${todo.todoCompletionDate.toLocaleDateString()}</p>
            `;
            todoList.appendChild(todoItem);
        });
    }

    //EXPORTS AND IMPORTS PROJECTS TO/FROM JSON FILES

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