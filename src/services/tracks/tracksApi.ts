import axios from 'axios';
import { BASE_URL } from '../constants';
import { TrackType } from '@/sharedTypes/sharedTypes';

export const getTracks = (): Promise<TrackType[]> => {
  return axios.get(BASE_URL + '/catalog/track/all/').then((response) => {
    return response.data.data;
  });
};

// Функция для получения подборки по ID
export const getTrackById = (id: number): Promise<TrackType> => {
  return axios.get(BASE_URL + `/catalog/track/${id}/`).then((response) => {
    return response.data.data;
  });
};
