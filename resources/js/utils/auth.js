export const getUserRole = () => {
    return localStorage.getItem('userRole'); // Get the role from local storage
};

// This function checks if a user is authenticated
export const isAuthenticated = () => {
    return !!localStorage.getItem('token'); // Check for existence of a token
};

// This function logs out the user
export const logout = () => {
    localStorage.removeItem('token'); // Clear the token from local storage
    localStorage.removeItem('role'); // Clear the role
};