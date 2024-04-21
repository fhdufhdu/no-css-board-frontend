import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { isoToYearMonthDay } from "./MainQuery";



export interface PostDetail {
  id: number,
  userId: string,
  title: string,
  content: string,
  createdAt: string,
  updatedAt?: string,
  isDeleted: boolean
}

export const usePostDetailQuery = (id: number) => {
  const getPostDetail = async (id: number): Promise<PostDetail> => {
    const response = await axios.get(`${process.env.REACT_APP_BACKEND_API}/board/post/${id}`,)
    return {
      id: response.data.id,
      userId: response.data.user_id,
      title: response.data.title,
      content: response.data.content,
      createdAt: isoToYearMonthDay(response.data.created_at),
      updatedAt: response.data.updated_at && isoToYearMonthDay(response.data.updated_at),
      isDeleted: response.status === 404
    }
  }

  return useQuery({
    queryKey: ["post", "detail", id],
    queryFn: () => getPostDetail(id),
  })
}

export enum DeletePostStatus {
  SUCCESS, NOT_FOUND, NOT_WRITER, UNKNOWN_ERROR
}

export const useDeletePostQuery = (options: { onSuccess?: (data: DeletePostStatus) => void; onError?: (error: Error) => void }) => {
  const queryClient = useQueryClient()

  const deletePost = async (id: number): Promise<DeletePostStatus> => {
    const response = await axios
      .delete(`${process.env.REACT_APP_BACKEND_API}/board/post/${id}`,)
    const status = response.status

    switch (status) {
      case 200:
        return DeletePostStatus.SUCCESS
      case 404:
        return DeletePostStatus.NOT_FOUND
      case 400:
        return DeletePostStatus.NOT_WRITER
      default:
        return DeletePostStatus.UNKNOWN_ERROR
    }
  }

  return useMutation({
    mutationFn: (data: { id: number }) => deletePost(data.id),
    onSuccess: (data: DeletePostStatus) => {
      queryClient.invalidateQueries({ queryKey: ['delete', 'post'] })
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