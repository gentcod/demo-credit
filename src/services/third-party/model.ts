export interface ThirdPartyApiResponse{
   isError: boolean;
   data: {
      status: number;
      message: string;
      data?: any;
   };
}