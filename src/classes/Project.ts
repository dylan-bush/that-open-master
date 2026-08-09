import { v4 as uuidv4 } from 'uuid'

export type ProjectStatus = "pending" | "active" | "completed";
export type ProjectRole = "architect" | "engineer" | "developer";

export interface IProject {
    projectName: string;
    projectDescription: string;
    projectStatus: ProjectStatus;
    projectRole: ProjectRole;
    projectCompletionDate: Date;
}

export class Project implements IProject {
    // To satisfy IProject interface, we need to define the properties here
    projectName: string
    projectDescription: string
    projectStatus: ProjectStatus
    projectRole: ProjectRole
    projectCompletionDate: Date

    //Class internals -- this property is not part of the IProject interface, but is used internally in the class to manage the UI representation of the project.
    ui: HTMLDivElement;
    cost: number = 500; // Default cost, can be modified later
    progress: number = 0; // Default progress, can be modified later
    id: string;

constructor(formData: IProject) {
    for (const key in formData) {
        if (key === "ui") { continue; }

        this[key] = formData[key];
    }

    this.id = uuidv4();
    this.setUI();
}

    setUI() {
        if(this.ui) {return}
        //Project card ui
        this.ui = document.createElement("div");
        this.ui.className = "project-card";
        this.ui.innerHTML = `
        <div class="project-card">
            <div class="card-header">
                <p style="aspect-ratio: 1/1; border-radius: 8px; padding: 10px; background-color: chocolate; font-size: var(--h2-size);">HC</p>
                <div>
                    <h3>${this.projectName}</h3>
                    <p>${this.projectDescription}</p>
                </div>
            </div>
            <div class="card-content">
                <div class="card-property">
                    <p class="property-name">Status</p>
                    <p>${this.projectStatus}</p>
                </div>
                <div class="card-property">
                    <p class="property-name">Role</p>
                    <p>${this.projectRole}</p>
                </div>
                <div class="card-property">
                    <p class="property-name">Cost</p>
                    <p>$${this.cost}</p>
                </div>
                <div class="card-property">
                    <p class="property-name">Estimated Progress</p>
                    <p>${this.progress * 100}%</p>
                </div>
            </div>
            
        </div>
        `;
    }
}
