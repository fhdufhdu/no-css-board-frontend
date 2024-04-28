import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { isoToYearMonthDay } from "./MainQuery";
import { CommonResponse } from "./response.dto";

export interface CommentDetails {
  comments: {
    id: number;
    userId: string;
    content: string;
    createdAt: string;
    updatedAt?: string;
  }[];
  number: number;
  totalPages: number;
}

export const useCommentDetailsQuery = (postId: number) => {
  const getCommentDetails = async (
    postId: number
  ): Promise<CommonResponse<CommentDetails>> => {
    const response = await axios.get(
      `${process.env.REACT_APP_BACKEND_API}/board/post/${postId}/comments`,
      {
        params: {
          page_number: 0,
          page_size: 10,
        },
      }
    );
    const a = {
      status: response.status,
      body: {
        comments: response.data.comments.map(
          (d: {
            id: number;
            user_id: string;
            content: string;
            created_at: string;
            updated_at: string;
          }) => {
            return {
              id: d.id,
              userId: d.user_id,
              content: d.content,
              createdAt: isoToYearMonthDay(d.created_at),
              updatedAt: d.updated_at && isoToYearMonthDay(d.updated_at),
            };
          }
        ),
        number: response.data.number,
        totalPages: response.data.totalPages,
      },
    };
    return a;
  };

  return useQuery({
    queryKey: ["comment", "details", postId],
    queryFn: () => getCommentDetails(postId),
  });
};

export enum DeletePostStatus {
  SUCCESS,
  NOT_FOUND,
  NOT_WRITER,
  UNKNOWN_ERROR,
}

export const useDeletePostQuery = (options: {
  onSuccess?: (data: DeletePostStatus) => void;
  onError?: (error: Error) => void;
}) => {
  const queryClient = useQueryClient();

  const deletePost = async (id: number): Promise<DeletePostStatus> => {
    const response = await axios.delete(
      `${process.env.REACT_APP_BACKEND_API}/board/post/${id}`
    );
    const status = response.status;

    switch (status) {
      case 200:
        return DeletePostStatus.SUCCESS;
      case 404:
        return DeletePostStatus.NOT_FOUND;
      case 400:
        return DeletePostStatus.NOT_WRITER;
      default:
        return DeletePostStatus.UNKNOWN_ERROR;
    }
  };

  return useMutation({
    mutationFn: (data: { id: number }) => deletePost(data.id),
    onSuccess: (data: DeletePostStatus) => {
      queryClient.invalidateQueries({ queryKey: ["delete", "post"] });
      if (options.onSuccess) options.onSuccess(data);
    },
    onError: (error) => {
      console.error(error);
      if (options.onError) options.onError(error);
    },
  });
};
