// export const saveToken = (token) => {
//   localStorage.setItem("token", token);
// };

// export const getToken = () => {
//   return localStorage.getItem("token");
// };

// export const removeToken = () => {
//   localStorage.removeItem("token");
// };

// export const isAuthenticated = () => {
//   return !!getToken();
// };

// export const getUserRole = () => {
//   try {
//     const token = getToken();
//     if (!token) return null;

//     const payload = JSON.parse(atob(token.split(".")[1]));
//     return payload.role;
//   } catch {
//     return null;
//   }
// };






export const saveToken = (token) => {
  localStorage.setItem("token", token);
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export const removeToken = () => {
  localStorage.removeItem("token");
};

export const isAuthenticated = () => {
  return !!getToken();
};

// get role
export const getUserRole = () => {
  try {
    const token = getToken();
    if (!token) return null;

    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.role;
  } catch {
    return null;
  }
};