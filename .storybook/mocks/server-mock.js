// Empty mock for server-only modules in Storybook
// Exports common names as empty functions to prevent runtime errors in stories

const emptyFn = async () => {};
const emptyObj = {};

export default emptyObj;
export const prisma = emptyObj;
export const auth = async () => null;
export const signIn = emptyFn;
export const signOut = emptyFn;

// Video actions
export const deleteVideo = emptyFn;
export const uploadVideo = emptyFn;

// User/Admin actions
export const deleteUser = emptyFn;
export const restoreUser = emptyFn;
export const promoteUser = emptyFn;
export const demoteUser = emptyFn;

// Todo actions
export const createTodo = emptyFn;
export const addTodo = emptyFn;
export const toggleTodo = emptyFn;
export const deleteTodo = emptyFn;
export const clearCompleted = emptyFn;
export const updateTodoTitle = emptyFn; // Added missing action
export const updateTodoStatus = emptyFn;
