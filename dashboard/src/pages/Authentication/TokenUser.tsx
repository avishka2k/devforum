import { jwtDecode } from 'jwt-decode';

const TokenUser = () => {
  try {
    const access_token: any = localStorage.getItem('access_token');

    if (!access_token) {
      throw new Error('No access token found');
    }

    const decodedToken = jwtDecode(access_token);

    if (!decodedToken || !decodedToken.sub) {
      throw new Error('Invalid token');
    }

    return { userId: decodedToken.sub, access_token };
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default TokenUser;
