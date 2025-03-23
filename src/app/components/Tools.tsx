import axios from "axios";
import { AxiosResponse, CancelTokenSource } from "axios";
import { SaveConfig, OrderType, ConfigType } from "./types";
import { getSession } from "next-auth/react";
import * as turf from "@turf/turf";



interface PreviewRequest {
    catid: string;
    satelliteShortName: string;
    forceHighestQuality: boolean;
  }

interface OrdersResponse {
    items: OrderType[];
};

interface ConfigsResponse {
    items: ConfigType[];
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
    setError: (message: string) => void, configID: string | null) : Promise<string | "" > => {

    const url = configID ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/saveconfig?id=${configID}`: `${process.env.NEXT_PUBLIC_BACKEND_URL}/saveconfig`;

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


export const checkTotalArea = (polygon: [number, number][]) : number => {
    const turfPolygon = turf.polygon([polygon]);
    // Calculate the area in square meters
    const area = turf.area(turfPolygon);
    const kmarea = area/1000000;
    return kmarea;
}



export const getOrdersByUser = async (setUserOrders: (orders: OrderType[]) => void) => {
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/orders-by-email`;
    const session = await getSession();
    
    try {
        const response : AxiosResponse<OrdersResponse> = await axios.get(url, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization' : `Token ${session?.accessToken as string}`
          },
        });

        return setUserOrders(response.data.items)
    
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error(`API Error:`, {
            status: error.response?.status,
            message: error.response?.data?.message || error.message
          });
        } else {
          console.error(`Error fetching orders:`, error);
        }
        throw error;
      }
}



export const getConfigsByUser = async (setUserConfigs: (configs: ConfigType[]) => void) => {
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/configs-by-email`;
    const session = await getSession();
    
    try {
        const response : AxiosResponse<ConfigsResponse> = await axios.get(url, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization' : `Token ${session?.accessToken as string}`
          },
        });

        return setUserConfigs(response.data.items)
    
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error(`API Error:`, {
            status: error.response?.status,
            message: error.response?.data?.message || error.message
          });
        } else {
          console.error(`Error fetching orders:`, error);
        }
        throw error;
      }
}