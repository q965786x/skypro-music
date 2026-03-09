import axios from 'axios';
import { BASE_URL } from '../constants';
import { ResCategoryApiType, TrackType } from '@/sharedTypes/sharedTypes';

// Получить все треки
export const getTracks = (): Promise<TrackType[]> => {
  return axios.get(BASE_URL + '/catalog/track/all/').then((res) => {
    return res.data.data;
  });
};

// Получить трек по id
export const getTrackById = (id: number): Promise<TrackType> => {
  return axios.get(BASE_URL + `/catalog/track/${id}/`).then((res) => {
    return res.data.data;
  });
};

// Получить категории
export const getCategories = (
  categoryId: string,
): Promise<ResCategoryApiType> => {
  return axios(BASE_URL + `/catalog/selection/${Number(categoryId) + 1}`).then(
    (res) => {
      return res.data;
    },
  );
};

// Просмотреть избранное (требует авторизацию)
export const getFavoriteTracks = (access: string): Promise<TrackType[]> => {
  return axios
    .get(BASE_URL + '/catalog/track/favorite/all/', {
      headers: {
        Authorization: `Bearer ${access}`,
      },
    })
    .then((res) => res.data.data);
};

// Добавить трек в избранное по id (требует авторизацию)
export const addFavoriteTrack = (access: string, id: number) => {
  return axios.post(
    BASE_URL + `/catalog/track/${id}/favorite/`,
    {},
    {
      headers: {
        Authorization: `Bearer ${access}`,
      },
    },
  );
};

// Удалить трек из избранного по id (требует авторизацию)
export const removeFavoriteTrack = (access: string, id: number) => {
  return axios.delete(BASE_URL + `/catalog/track/${id}/favorite/`, {
    headers: {
      Authorization: `Bearer ${access}`,
    },
  });
};

// Получить подборки
export const getSelections = () => {
  return axios.get(BASE_URL + '/catalog/selection/all').then((res) => res.data);
};

// Получить подборку по id
export const getSelectionById = (id: string) => {
  return axios
    .get(BASE_URL + `/catalog/selection/${id}/`)
    .then((res) => res.data);
};

export const addLike = addFavoriteTrack;
export const removeLike = removeFavoriteTrack;
