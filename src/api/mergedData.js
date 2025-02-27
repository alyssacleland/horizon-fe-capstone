import { deleteSingleCategory, getSingleCategory } from './categoryData';
import { getSingleTask, getCategoryTasks, deleteTask } from './taskData';

// READ TASK DETAILS (single task properties plus its category)
// 1. Get the task object
// 2. Get the category object
// 3. Merge the two objects
const getTaskDetails = (taskFirebaseKey) =>
  new Promise((resolve, reject) => {
    getSingleTask(taskFirebaseKey)
      .then((taskObject) => {
        getSingleCategory(taskObject.category_id).then((categoryObject) => {
          // bookObject.author_id is the author's firebaseKey
          resolve({ categoryObject, ...taskObject }); // results in an object containing categoryObject and properties of taskObject like this structure: { categoryObject: { ... }, (task)name: '...', ... }.
        });
      })
      .catch((error) => reject(error));
  });

// DELETE CATEGOGORY AND ALL OF ITS TASKS
// 1. Get all tasks for a category
// 2. Delete each task
// 3. Delete the category
const deleteCategoryAndItsTasks = (categoryFirebaseKey) =>
  new Promise((resolve, reject) => {
    getCategoryTasks(categoryFirebaseKey)
      .then((tasksArray) => {
        const deleteTaskPromises = tasksArray.map((task) => deleteTask(task.firebaseKey));

        Promise.all(deleteTaskPromises).then(() => {
          deleteSingleCategory(categoryFirebaseKey).then(resolve);
        });
      })
      .catch((error) => reject(error));
  });

// READ CATEGORY DETAILS (single category properties plus its tasks)
// 1. Get the category object
// 2. Get the tasks array
// 3. Merge the two objects
const viewCategoryDetails = (categoryFirebaseKey) =>
  new Promise((resolve, reject) => {
    Promise.all([getSingleCategory(categoryFirebaseKey), getCategoryTasks(categoryFirebaseKey)])
      .then(([categoryObject, categoryTasksArray]) => {
        resolve({ ...categoryObject, tasks: categoryTasksArray });
      })
      .catch((error) => reject(error));
  });

export { getTaskDetails, viewCategoryDetails, deleteCategoryAndItsTasks };
