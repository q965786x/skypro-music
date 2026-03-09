import axios from 'axios';
import { BASE_URL } from '../constants';

type createUserProps = {
  email: string;
  password: string;
};

{
  /* type authUserReturn = {
  email: string;
  username: string;
  _id: number;
}; */
}

export const createUser = ({ email, password }: createUserProps) => {
  const data = {
    email,
    password,
    username: email,
  };
  return axios({
    method: 'post',
    url: BASE_URL + '/user/signup/',
    headers: {
      'content-type': 'application/json',
    },
    data,
  });
};

export const loginUser = (data: createUserProps) => {
  return axios({
    method: 'post',
    url: BASE_URL + '/user/login/',
    headers: {
      'content-type': 'application/json',
    },
    data,
  });
};

type accessTokenType = {
  access: string;
};

type refreshTokenType = {
  refresh: string;
};

type tokensType = accessTokenType & refreshTokenType;

export const getTokens = (data: createUserProps): Promise<tokensType> => {
  return axios.post(BASE_URL + '/user/token/', data).then((res) => res.data);
};

export const refreshToken = (refresh: string): Promise<accessTokenType> => {
  return axios
    .post(BASE_URL + '/user/token/refresh/', {
      refresh,
    })
    .then((res) => res.data);
};
