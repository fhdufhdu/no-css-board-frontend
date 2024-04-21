import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export enum PostSaveStatus {
  PUBLISHED, FAIL, CHECK_SESSION
}

export const useSavePostQuery = (options: { onSuccess?: (data: PostSaveStatus) => void; onError?: (error: Error) => void }) => {
  const queryClient = useQueryClient()

  const signUp = async (title: string, content: string): Promise<PostSaveStatus> => {
    const response = await axios
      .post(
        `${process.env.REACT_APP_BACKEND_API}/board/post`,
        { title, content }
      )
    const status = response.status

    switch (status) {
      case 409:
        return PostSaveStatus.CHECK_SESSION
      case 201:
        return PostSaveStatus.PUBLISHED
      default:
        return PostSaveStatus.FAIL
    }
  }

  return useMutation({
    mutationFn: (data: { title: string, content: string }) => signUp(data.title, data.content),
    onSuccess: (data: PostSaveStatus) => {
      queryClient.invalidateQueries({ queryKey: ['save', 'post'] })
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