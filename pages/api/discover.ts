import { NextApiResponse, NextApiRequest } from 'next';
import { parse } from '../../utils/apiResolvers';
import { MediaType, Media } from '../../types';
import getInstance from '../../utils/axios';
import { AxiosError } from 'axios'; // Import AxiosError

interface Response {
  type: 'Success' | 'Error';
  data: Media[] | Error;
}

const apiKey = process.env.TMDB_KEY;

export default async function handler(request: NextApiRequest, response: NextApiResponse<Response>) {
  const axios = getInstance();
  const { type, genre } = request.query;

  try {
    const result = await axios.get(`/discover/${type}`, {
      params: {
        api_key: apiKey,
        with_genres: genre,
        watch_region: 'US',
        with_networks: '213',
      }
    });
    const data = parse(result.data.results, type as MediaType);

    response.status(200).json({ type: 'Success', data });
  } catch (error) {
    // Typecast the error to AxiosError
    const axiosError = error as AxiosError;

    console.log(axiosError.response?.data); // Access response data safely
    response.status(500).json({ type: 'Error', data: axiosError.response?.data || 'An unknown error occurred' });
  }
}
