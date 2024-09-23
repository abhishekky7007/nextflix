import { NextApiRequest, NextApiResponse } from 'next';
import axios from '../../utils/axios';
import { Media, MediaType } from '../../types';
import { parse } from '../../utils/apiResolvers';
import { AxiosError } from 'axios'; // Import AxiosError

interface Response {
  type: 'Success' | 'Error';
  data: Media[] | Error;
}

const apiKey = process.env.TMDB_KEY;

export default async function handler(request: NextApiRequest, response: NextApiResponse<Response>) {
  const { type } = request.query;

  try {
    const result = await axios().get(`/${type}/popular`, {
      params: {
        api_key: apiKey,
        watch_region: 'US', 
        language: 'en-US',
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
