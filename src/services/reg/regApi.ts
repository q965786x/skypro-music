import axios from 'axios';
import { BASE_URL } from '../constants';

type regUserProps = {
  email: string;
  password: string;
  username: string;
};

type regUserReturn = {
  email: string;
  username: string;
  _id: number;
};

export const regUser = (data: regUserProps) => {
  return axios.post(BASE_URL + '/user/signup/', data, {
    headers: {
      // API требует обязательного указания заголовка content-type, так апи понимает что мы посылаем ему json строчку в теле запроса
      'content-type': 'application/json',
    },
  });
};
