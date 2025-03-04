import axios from "axios";
import { AxiosResponse, CancelTokenSource } from "axios";

interface PreviewRequest {
    catid: string;
    satelliteShortName: string;
    forceHighestQuality: boolean;
  }
  
  interface PreviewResponse {
    presigned_url: string;
  }
  
  let cancelToken: CancelTokenSource | null = null; // Store the cancel token globally

  export const getPresignedUrl = async (requestData: PreviewRequest): Promise<string | ''> => {
      const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/preview`;
  
      // Cancel the previous request if it's still pending
      if (cancelToken) {
          cancelToken.cancel('Request canceled due to new request.');
      }
  
      // Create a new cancel token
      cancelToken = axios.CancelToken.source();
  
      try {
          const response: AxiosResponse<PreviewResponse> = await axios.post(url, requestData, {
              headers: { 'Content-Type': 'application/json' },
              cancelToken: cancelToken.token, // Attach the cancel token
          });
  
          return response.data.presigned_url;
      } catch (error) {
          if (axios.isCancel(error)) {
              console.log('Previous request canceled:', error.message);
          } else {
              console.error('Error fetching presigned URL:', error);
          }
          return '';
      }
  };