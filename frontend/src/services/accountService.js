let saveToken = (token) => {
    localStorage.setItem('token', token);
};

let getToken = () => {
    return localStorage.getItem('token');
};

let saveUserId = (uid) => {
    localStorage.setItem('userId', uid);
};

let getUserId = () => {
    return localStorage.getItem('userId');
};

let logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
};

let isLogged = () => {
    let token = localStorage.getItem('token');

    return !!token;
};

export const accountService = {
    saveToken, getToken, logout, isLogged, saveUserId, getUserId
};