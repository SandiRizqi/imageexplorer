import axios from "axios";
import { AxiosResponse } from "axios";

interface PreviewRequest {
    catid: string;
    forceHighestQuality: boolean;
  }
  
  interface PreviewResponse {
    presigned_url: string;
  }
  
 export const getPresignedUrl = async (requestData: PreviewRequest): Promise<string | ''> => {
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/preview`;
  
    try {
      const response: AxiosResponse<PreviewResponse> = await axios.post(url, requestData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      return response.data.presigned_url;
    } catch (error) {
      console.error('Error fetching presigned URL:', error);
      return '';
    }
  }