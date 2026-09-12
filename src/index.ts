//THIS FILE wires DOM elements to behavior, like buttons, forms, and modals
//The Document Object Model (DOM) connects web pages to scripts or programming languages by representing the structure of a document—such as the HTML representing a web page—in memory.

import { Project, IProject, ProjectStatus, ProjectRole, IToDo } from "./classes/Project";
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

  const editProjectNameError = document.getElementById("edit-project-name-error")
  if (editProjectNameError) {
    editProjectNameError.textContent = ""
    editProjectNameError.classList.remove("visible")
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

//NEW PROJECT MODAL
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

//EDIT PROJECT MODAL
//get edit project button by ID
const editProjectBtn = document.getElementById("edit-project-btn");

if (editProjectBtn) {
    editProjectBtn.addEventListener("click", () => {
        const selectedProject = projectsManager.selectedProject;
        if (!selectedProject) {
            console.warn("No project selected for editing");
            return;
        }
        //prefill the edit project form with the selected project's data
        const editProjectForm = document.getElementById("edit-project-form") as HTMLFormElement;
        editProjectForm.querySelector("input[name='projectName']")!.value = selectedProject.projectName;
        editProjectForm.querySelector("textarea[name='projectDescription']")!.value = selectedProject.projectDescription;
        editProjectForm.querySelector("select[name='projectStatus']")!.value = selectedProject.projectStatus;
        editProjectForm.querySelector("select[name='projectRole']")!.value = selectedProject.projectRole;
        editProjectForm.querySelector("input[name='projectCompletionDate']")!.value = selectedProject.projectCompletionDate.toISOString().split("T")[0];
        clearProjectFormErrors()
        toggleModal("edit-project-modal")});
}
else {
    console.warn("Edit Project button not found");
}

//get cancel edit project button by ID
const cancelEditProjectBtn = document.getElementById("cancel-edit-project-btn");

if (cancelEditProjectBtn) {
    cancelEditProjectBtn.addEventListener("click", () => {
        clearProjectFormErrors()
        toggleModal("edit-project-modal")
})
}
else {
    console.warn("Cancel Edit Project button not found");
}

//ADD TODO MODAL
//get add todo button by ID and open the add todo modal
const addTodoBtn = document.getElementById("new-todo-btn");
if (addTodoBtn) {
    addTodoBtn.addEventListener("click", () => {
        const selectedProject = projectsManager.selectedProject;
        if (!selectedProject) {
            console.warn("No project selected for adding todo");
            return;
        }
        toggleModal("new-todo-modal");
    });
}
else {
    console.warn("Add Todo button not found");
}

const cancelAddTodoBtn = document.getElementById("cancel-new-todo-btn");
if (cancelAddTodoBtn) {
    cancelAddTodoBtn.addEventListener("click", () => {
        toggleModal("new-todo-modal");
    });
}

//EDIT TODO MODAL
const cancelEditTodoBtn = document.getElementById("cancel-edit-todo-btn");

if (cancelEditTodoBtn) {
    cancelEditTodoBtn.addEventListener("click", () => {
        toggleModal("edit-todo-modal");
    });
}

const editTodoForm = document.getElementById("edit-todo-form");
if (editTodoForm instanceof HTMLFormElement) {
    editTodoForm.addEventListener("submit", (e) => {
        e.preventDefault();
        // Handle edit todo form submission
        const selectedTodo = projectsManager.selectedTodo;
        if (!selectedTodo) {
            console.warn("No todo selected for editing");
            return;
        }

        const formData = new FormData(editTodoForm);
        const dateInput = formData.get("editTodoCompletionDate") as string;

        selectedTodo.todoName = formData.get("editTodoName") as string;
        selectedTodo.todoDescription = formData.get("editTodoDescription") as string;
        selectedTodo.todoStatus = formData.get("editTodoStatus") as IToDo["todoStatus"];
        selectedTodo.todoCompletionDate = dateInput
            ? new Date(dateInput)
            : selectedTodo.todoCompletionDate;

        projectsManager.updateDetailsPage();
        editTodoForm.reset();
        toggleModal("edit-todo-modal");
    });
}

//GET NEW PROJECT FORM DATA AND CREATE NEW PROJECT
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

            //create a new instance of the Project class we created in project.ts
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

//Get form data for edit project form
const editProjectForm = document.getElementById("edit-project-form");
if (editProjectForm instanceof HTMLFormElement) {
    editProjectForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const selectedProject = projectsManager.selectedProject;
        if (!selectedProject) {
            console.warn("No project selected for editing");
            return;
        }
        //read form data and update the selected project
        const formData = new FormData(editProjectForm);
   

        const projectNameError = document.getElementById("edit-project-name-error");
        const editedProjectName = (formData.get("projectName") as string).trim();
        //update the UI of the selected project, checking for errors
        try {
            //validate the edited project name
            //const projectNames = projectsManager.list.map((project) => project.projectName);
            const projectNameExists = projectsManager.list.some((project) => {
                return project.projectName === editedProjectName && project.id !== selectedProject.id;
                });
            if (projectNameExists) {
                throw new Error("A project with this name already exists.");
            }
            const projectNameLength = editedProjectName.length;
            if (projectNameLength < 5 || projectNameLength > 100) {
                throw new Error("Project name must be between 5 and 100 characters.");
            }

            //update the selected project with the new data from the form
            selectedProject.projectName = editedProjectName;
            selectedProject.projectDescription = formData.get("projectDescription") as string;
            selectedProject.projectStatus = formData.get("projectStatus") as ProjectStatus;
            selectedProject.projectRole = formData.get("projectRole") as ProjectRole;
            const dateInput = formData.get("projectCompletionDate") as string;
            selectedProject.projectCompletionDate = dateInput ? new Date(dateInput) : selectedProject.projectCompletionDate;

            selectedProject.updateUI();
            projectsManager.updateDetailsPage();
            clearProjectFormErrors();
            toggleModal("edit-project-modal");
        } catch (error) {
            if (projectNameError) {
                projectNameError.textContent = String(error);
                projectNameError.classList.add("visible");
            }
        }
    })
}
        


//GET FORM DATA FOR ADD TODO FORM
const newTodoForm = document.getElementById("new-todo-form");
if (newTodoForm instanceof HTMLFormElement) {
    newTodoForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const selectedProject = projectsManager.selectedProject;
        if (!selectedProject) {
            console.warn("No project selected for adding todo");
            return;
        }
        const formData = new FormData(newTodoForm);

        //Set default date to one week from now if no date is provided
        const dateInput = formData.get("newTodoCompletionDate") as string;
        const oneWeekFromNow = new Date();
        oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);

        const todoDescription = formData.get("newTodoDescription") as string;
        const todoDateInput = formData.get("newTodoCompletionDate") as string;

        const newTodo: IToDo = {
            todoName: formData.get("newTodoName") as string,
            todoDescription: todoDescription,
            todoCompletionDate: dateInput ? new Date(todoDateInput) : oneWeekFromNow,
            todoStatus: formData.get("newTodoStatus") as IToDo["todoStatus"]
        };
        selectedProject.todos.push(newTodo);
        projectsManager.updateDetailsPage();
        newTodoForm.reset();
        toggleModal("new-todo-modal");
    })
}

//EXPORT AND IMPORT PROJECTS

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
