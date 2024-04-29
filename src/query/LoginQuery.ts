import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import sha256 from 'sha256';

import { CommonResponse } from "./response.dto";

export enum LoginStatus {
  SUCCESS,
  NOT_MATCH,
}

export const useLoginQuery = (options: {
  onSuccess?: (data: CommonResponse<object>) => void;
  onError?: (error: Error) => void;
}) => {
  const queryClient = useQueryClient();

  const login = async (
    id: string,
    password: string
  ): Promise<CommonResponse<object>> => {
    const hashedPassword = sha256(password)
    const response = await axios.post(
      `${process.env.REACT_APP_BACKEND_API}/user/login`,
      { id, password: hashedPassword }
    );
    return { status: response.status, body: response.data };
  };

  return useMutation({
    mutationFn: (data: { id: string; password: string }) =>
      login(data.id, data.password),
    onSuccess: (data: CommonResponse<object>) => {
      queryClient.invalidateQueries({ queryKey: ["login"] });
      if (options.onSuccess) options.onSuccess(data);
    },
    onError: (error) => {
      console.error(error);
      if (options.onError) options.onError(error);
    },
  });
};

export interface UserDetail {
  id: string;
}

export const useGetMyDetail = () => {
  const getMyDetail = async (): Promise<CommonResponse<UserDetail>> => {
    const response = await axios.get(
      `${process.env.REACT_APP_BACKEND_API}/user/my`
    );

    return { status: response.status, body: response.data };
  };

  return useQuery({
    queryKey: [],
    queryFn: () => getMyDetail(),
  });
};
