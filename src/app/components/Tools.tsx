import axios from "axios";
import { AxiosResponse, CancelTokenSource } from "axios";
import { SaveConfig } from "./types";


interface PreviewRequest {
    catid: string;
    satelliteShortName: string;
    forceHighestQuality: boolean;
  }
  
interface PreviewResponse {
    presigned_url: string;
  }

interface SaveConfigResponse {
    message: string;
    config_id: string;
}
  
  let cancelToken: CancelTokenSource | null = null; // Store the cancel token globally

 

  export const getPresignedUrl = async (
    requestData: PreviewRequest,
  setError: (message: string) => void
  ): Promise<string | ''> => {
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
            if (axios.isAxiosError(error)) {
                setError(error.response?.data.error)
            } else {
                setError("Something error in server.");
            }
          return '';
      }
  };


export const saveConfig = async (configData: SaveConfig,
    setError: (message: string) => void) : Promise<string | "" > => {

    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/saveconfig`;

    // Cancel the previous request if it's still pending
    if (cancelToken) {
        cancelToken.cancel('Request canceled due to new request.');
    }

    // Create a new cancel token
    cancelToken = axios.CancelToken.source();

    try {
        const response: AxiosResponse<SaveConfigResponse> = await axios.post(url, configData, {
            headers: { 'Content-Type': 'application/json' },
            cancelToken: cancelToken.token, // Attach the cancel token
        });

        return response.data.config_id;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            setError(error.response?.data.error)
        } else {
            setError("Something error in server.");
        }
        return '';
    }
}


export const getSavedConfig = async (id: string,
    setError: (message: string) => void) : Promise<SaveConfig | null > => {

    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/saveconfig?id=${id}`;

    // Cancel the previous request if it's still pending
    if (cancelToken) {
        cancelToken.cancel('Request canceled due to new request.');
    }

    cancelToken = axios.CancelToken.source();

    try {
        const response: AxiosResponse<SaveConfig> = await axios.get(url, {
            headers: { 'Content-Type': 'application/json' },
            cancelToken: cancelToken.token, // Attach the cancel token
        });

        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            setError(error.response?.data.error)
        } else {
            setError("Something error in server.");
        }
        return null;
    }
}
