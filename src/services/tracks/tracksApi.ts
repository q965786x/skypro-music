import axios from 'axios';
import { BASE_URL } from '../constants';
import { ResCategoryApiType, TrackType } from '@/sharedTypes/sharedTypes';

export const getTracks = (): Promise<TrackType[]> => {
  return axios.get(BASE_URL + '/catalog/track/all/').then((res) => {
    return res.data.data;
  });
};

export const getTrackById = (id: number): Promise<TrackType> => {
  return axios.get(BASE_URL + `/catalog/track/${id}/`).then((res) => {
    return res.data.data;
  });
};

export const getCategories = (
  categoryId: string,
): Promise<ResCategoryApiType> => {
  return axios(BASE_URL + `/catalog/selection/${Number(categoryId) + 1}`).then(
    (res) => {
      return res.data;
    },
  );
};

export const getFavoriteTracks = (access: string): Promise<TrackType[]> => {
  return axios
    .get(BASE_URL + '/catalog/track/favorite/all/', {
      headers: {
        Authorization: `Bearer ${access}`,
      },
    })
    .then((res) => res.data.data);
};

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

export const removeFavoriteTrack = (access: string, id: number) => {
  return axios.delete(BASE_URL + `/catalog/track/${id}/favorite/`, {
    headers: {
      Authorization: `Bearer ${access}`,
    },
  });
};

export const getSelections = () => {
  return axios.get(BASE_URL + '/catalog/selection/all').then((res) => res.data);
};

export const getSelectionById = (id: string) => {
  return axios
    .get(BASE_URL + `/catalog/selection/${id}/`)
    .then((res) => res.data);
};

export const addLike = addFavoriteTrack;
export const removeLike = removeFavoriteTrack;
