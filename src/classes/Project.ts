//THIS FILE represents one project and its card UI
//Defines the shape of a project object / a projects data
//The Project class implements the IProject interface, which defines the structure of a project object. 

import { v4 as uuidv4 } from 'uuid'

export type ProjectStatus = "pending" | "active" | "completed";
export type ProjectRole = "architect" | "engineer" | "developer";

//The IProject interface defines the structure of a project object, including its name, description, status, role, and completion date. 
//The Project class implements this interface and adds additional properties and methods for managing the project's UI representation and internal state.
export interface IProject {
    projectName: string;
    projectDescription: string;
    projectStatus: ProjectStatus;
    projectRole: ProjectRole;
    projectCompletionDate: Date;
    todos?: IToDo[];
}

//The IToDo interface defines the structure of a to-do item, including its description and date.
export interface IToDo {
    todoName: string;
    todoDescription: string;
    todoCompletionDate: Date;
    todoStatus: "open" | "in-progress" | "completed" | "closed" | "blocked";
}

export class Project implements IProject {
    // To satisfy IProject interface, we need to define the properties here
    projectName: string
    projectDescription: string
    projectStatus: ProjectStatus
    projectRole: ProjectRole
    projectCompletionDate: Date
    todos: IToDo[] = []

    //Class internals -- this property is not part of the IProject interface, but is used internally in the class to manage the UI representation of the project.
    ui: HTMLDivElement;
    cost: number = 500; // Default cost, can be modified later
    progress: number = 0; // Default progress, can be modified later
    id: string;
    projectColor: string = "chocolate"; // Default color, can be modified later

    constructor(formData: IProject) {
        for (const key in formData) {
            if (key === "ui") { continue; }

            this[key] = formData[key];
        }

        this.id = uuidv4();
        this.setUI();
    }
    //Creates the project card UI and sets the innerHTML of the card with the project details.
    setUI() {
        if(this.ui) {return}
        // Set project color from random array
        const projectColors = ["chocolate", "slategray", "steelblue", "lightcoral", "seagreen", "mediumorchid"];
        const randomColorIndex = Math.floor(Math.random() * projectColors.length);
        this.projectColor = projectColors[randomColorIndex];
        
        //Project card ui
        this.ui = document.createElement("div");
        this.ui.className = "project-card";
        this.ui.innerHTML = `
        <!-- <div class="project-card"> -->
            <div class="card-header">
                <p class="project-icon" data-project-card-info="icon" style="background-color: ${this.projectColor};">${this.projectName.slice(0, 2)}</p>
                <div>
                    <h3 data-project-card-info="name">${this.projectName}</h3>
                    <p data-project-card-info="description">${this.projectDescription}</p>
                </div>
            </div>
            <div class="card-content">
                <div class="card-property">
                    <p class="property-name">Status</p>
                    <p data-project-card-info="status">${this.projectStatus}</p>
                </div>
                <div class="card-property">
                    <p class="property-name">Role</p>
                    <p data-project-card-info="role">${this.projectRole}</p>
                </div>
                <div class="card-property">
                    <p class="property-name">Cost</p>
                    <p data-project-card-info="cost">$${this.cost}</p>
                </div>
                <div class="card-property">
                    <p class="property-name">Estimated Progress</p>
                    <p data-project-card-info="progress">${this.progress * 100}%</p>
                </div>
            </div>
            
        <!-- </div> -->
        `;
    }

    //This method updates the project card UI with the latest project details. It is called whenever the project details are updated, such as when the user edits the project information.
    updateUI() {
        if (!this.ui) { return }
        const icon = this.ui.querySelector("[data-project-card-info='icon']");
        const name = this.ui.querySelector("[data-project-card-info='name']");
        const description = this.ui.querySelector("[data-project-card-info='description']");
        const status = this.ui.querySelector("[data-project-card-info='status']");
        const role = this.ui.querySelector("[data-project-card-info='role']");
        const cost = this.ui.querySelector("[data-project-card-info='cost']");
        const progress = this.ui.querySelector("[data-project-card-info='progress']");

        if (icon) { icon.textContent = this.projectName.slice(0, 2) }
        if (name) name.textContent = this.projectName;
        if (description) description.textContent = this.projectDescription;
        if (status) status.textContent = this.projectStatus;
        if (role) role.textContent = this.projectRole;
        if (cost) cost.textContent = `$${this.cost}`;
        if (progress) progress.textContent = `${this.progress * 100}%`;

    }
}
