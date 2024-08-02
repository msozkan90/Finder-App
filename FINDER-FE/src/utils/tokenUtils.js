import { jwtDecode } from 'jwt-decode';

export const decodeToken = (token) => {
  try {
    // return jwtDecode(token);
    return token
  } catch (error) {
    console.error('Invalid token:', error);
    return null;
  }
};

export const userIdFromToken = (token) => {
//   const decoded = decodeToken(token);
//   return decoded ? decoded.id : null;
return token
};
