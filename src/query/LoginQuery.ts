import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from "axios";

export enum LoginStatus {
  SUCCESS, NOT_MATCH
}

export const useLoginQuery = (options: { onSuccess?: (data: LoginStatus) => void; onError?: (error: Error) => void }) => {
  const queryClient = useQueryClient()

  const login = async (id: string, password: string): Promise<LoginStatus> => {
    const response = await axios
      .post(
        `${process.env.REACT_APP_BACKEND_API}/user/login`,
        { id, password }
      )
    const status = response.status

    switch (status) {
      case 200:
        return LoginStatus.SUCCESS
      default:
        return LoginStatus.NOT_MATCH
    }
  }

  return useMutation({
    mutationFn: (data: { id: string, password: string }) => login(data.id, data.password),
    onSuccess: (data: LoginStatus) => {
      queryClient.invalidateQueries({ queryKey: ['login'] })
      if (options.onSuccess)
        options.onSuccess(data)
    },
    onError: (error) => {
      console.error(error)
      if (options.onError)
        options.onError(error)
    }
  })
}
