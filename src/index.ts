import { Project, IProject, ProjectStatus, ProjectRole } from "./classes/Project";
import { ProjectsManager } from "./classes/ProjectsManager"

(window as any).ProjectsManager = ProjectsManager;//expose ProjectsManager to the browser console for testing

function toggleModal(id: string) {
    const modal = document.getElementById(id);
    if (modal instanceof HTMLDialogElement) {
        modal.open ? modal.close() : modal.showModal();
    }
    else {
        console.warn(`Modal with ID ${id} not found`);
    }
}

function clearProjectFormErrors() {
  const projectNameError = document.getElementById("project-name-error")
  if (projectNameError) {
    projectNameError.textContent = ""
    projectNameError.classList.remove("visible")
  }
}

const projectsListUI = document.getElementById("project-list") as HTMLElement; 
const projectsManager = new ProjectsManager(projectsListUI);

(window as any).manager = projectsManager; //ensures browser console uses the same project manager instance


// create default project
const defaultProject: IProject = {
    projectName: "Hospital Center",
    projectDescription: "Community hospital located downtown",
    projectStatus: "pending",
    projectRole: "engineer",
    projectCompletionDate: new Date("2023-12-31")
};
projectsManager.newProject(defaultProject);

//get new project button by ID
const newProjectBtn = document.getElementById("new-project-btn");

if (newProjectBtn) {
    newProjectBtn.addEventListener("click", () => {toggleModal("new-project-modal")});
}
else {
    console.warn("New Project button not found");
}

//get cancel project button by ID
const cancelProjectBtn = document.getElementById("cancel-project-btn");

if (cancelProjectBtn) {
    cancelProjectBtn.addEventListener("click", () => {
        clearProjectFormErrors()
        toggleModal("new-project-modal")
})
}
else {
    console.warn("Cancel Project button not found");
}


//get form data
const projectForm = document.getElementById("new-project-form");
if (projectForm instanceof HTMLFormElement) {
    projectForm.addEventListener("submit", (e) => {
        e.preventDefault();
        //create object based on a class using 'new' keyword
        //creating a new instance of a FormData object
        //error on projectForm because it is of type HTMLElement, we need to validate it as HTMLFormElement
        const formData = new FormData(projectForm);

        //Set default date to one year from now if no date is provided
        const dateInput = formData.get("projectCompletionDate") as string;
        const defaultDate = new Date();
        defaultDate.setFullYear(defaultDate.getFullYear() + 1);

        //const projectData = Object.fromEntries(formData.entries());
        /*SYNTAX EXPLANATION: 
        the use of "IProject" specifies the interface that is being used to define the shape and requirements of the object being created.
        the "as" keyword is used for Type Assertion, which tells the script to treat the value of the "formData.get()" method as a specific data type, such as string.
        For the date, I'm not sure why we have to use "as string" and then convert it to a Date object, but it seems to be necessary for the code to work correctly.
        */
        const projectData: IProject = {
            projectName: (formData.get("projectName") as string),
            projectDescription: formData.get("projectDescription") as string,
            projectStatus: formData.get("projectStatus") as ProjectStatus,
            projectRole: formData.get("projectRole") as ProjectRole,
            projectCompletionDate: dateInput ? new Date(dateInput) : defaultDate
        };

        //create a new instance of the Project class we created in project.js
        //we pass the project name from the form data to the constructor of the Project class
        const projectNameError = document.getElementById("project-name-error");

        try {
            const project = projectsManager.newProject(projectData);
            //console.log("Project Data: ", projectData);
            clearProjectFormErrors();
            projectForm.reset();
            console.log(project);
            toggleModal("new-project-modal");
        } catch (error) {
            if (projectNameError) {
                projectNameError.textContent = String(error);
                projectNameError.classList.add("visible");
            }
        }
        
    })
} else {
    console.warn("New Project form not found");
}

const exportBtn = document.getElementById("export-btn");
if (exportBtn) {
    exportBtn.addEventListener("click", () => {
        projectsManager.exportToJSON();
    });
}

const importBtn = document.getElementById("import-btn");
if (importBtn) {
    importBtn.addEventListener("click", () => {
        projectsManager.importFromJSON();
    });
}

const projectsNavBtn = document.getElementById("projects-nav-btn");
if (projectsNavBtn) {
    projectsNavBtn.addEventListener("click", () => {
        const projectsPage = document.getElementById("projects-page");
        const detailsPage = document.getElementById("project-details");
        if (projectsPage) {
            projectsPage.classList.remove("hidden");
        }
        if (detailsPage) {
            detailsPage.classList.add("hidden");
        }
    });
}
