import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export enum SignUpStatus {
  ALREADY_EXIST, SUCCESS, UNKNOWN_ERROR
}


export const requestSignUp = (id: string, password: string) => {
  return (): Promise<SignUpStatus> =>
    axios
      .post(
        `${process.env.REACT_APP_BACKEND_API}/user/signup`,
        { id, password }
      ).then((response) => {
        const status = response.status

        console.log(status)
        switch (status) {
          case 409:
            return SignUpStatus.ALREADY_EXIST
          case 200:
            return SignUpStatus.SUCCESS
          default:
            return SignUpStatus.UNKNOWN_ERROR
        }
      })
}


export const useIdExistenceQuery = (id: string) => {
  const checkExistence = async (id: string): Promise<boolean> => {
    const response = await axios.get(`${process.env.REACT_APP_BACKEND_API}/user/${id}`,)
    return response.status === 200

  }

  return useQuery({
    queryKey: [],
    queryFn: () => checkExistence(id),
    enabled: false
  })
}

export const useSignUpQuery = (options: { onSuccess?: (data: SignUpStatus) => void; onError?: (error: Error) => void }) => {
  const queryClient = useQueryClient()

  const signUp = async (id: string, password: string): Promise<SignUpStatus> => {
    const response = await axios
      .post(
        `${process.env.REACT_APP_BACKEND_API}/user/signup`,
        { id, password }
      )
    const status = response.status

    switch (status) {
      case 409:
        return SignUpStatus.ALREADY_EXIST
      case 200:
        return SignUpStatus.SUCCESS
      default:
        return SignUpStatus.UNKNOWN_ERROR
    }
  }

  return useMutation({
    mutationFn: (data: { id: string, password: string }) => signUp(data.id, data.password),
    onSuccess: (data: SignUpStatus) => {
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