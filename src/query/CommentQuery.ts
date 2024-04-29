import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { isoToYearMonthDay } from "./MainQuery";
import { CommonResponse } from "./response.dto";

export interface CommentDetail {
  id: number;
  userId: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CommentDetails {
  comments: CommentDetail[];
  number: number;
  totalPages: number;
  totalElements: number;
}

export const useCommentDetailsQuery = (postId: number) => {
  const getCommentDetails = async (
    postId: number, pageParam: number
  ): Promise<CommonResponse<CommentDetails>> => {
    const response = await axios.get(
      `${process.env.REACT_APP_BACKEND_API}/board/post/${postId}/comments`,
      {
        params: {
          page_number: pageParam,
          page_size: 5,
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
        totalPages: response.data.total_pages,
        totalElements: response.data.total_elements,
      },
    };
    return a;
  };

  return useInfiniteQuery({
    queryKey: ["comment", "details", postId],
    queryFn: ({ pageParam }) => getCommentDetails(postId, pageParam),
    initialPageParam: 0,
    getNextPageParam: (prevPage) => {
      return prevPage.body.number + 1 === prevPage.body.totalPages ? undefined : prevPage.body.number + 1;
    }

  });
};

export const usePostComment = (options: {
  onSuccess?: (data: CommonResponse<object>) => void;
  onError?: (error: Error) => void;
}) => {
  const queryClient = useQueryClient();

  const postComment = async (id: number, content: string): Promise<CommonResponse<object>> => {
    const response = await axios.post(
      `${process.env.REACT_APP_BACKEND_API}/board/post/${id}/comment`, { content }
    );
    return { status: response.status, body: {} }
  };

  return useMutation({
    mutationFn: (data: { id: number, content: string }) => postComment(data.id, data.content),
    onSuccess: (data: CommonResponse<object>) => {
      queryClient.invalidateQueries({ queryKey: ["comment", "post"] });
      if (options.onSuccess) options.onSuccess(data);
    },
    onError: (error) => {
      console.error(error);
      if (options.onError) options.onError(error);
    },
  });
};

export const useDeleteComment = (options: {
  onSuccess?: (data: CommonResponse<object>) => void;
  onError?: (error: Error) => void;
}) => {
  const queryClient = useQueryClient();

  const deleteComment = async (id: number, commentId: number): Promise<CommonResponse<object>> => {
    const response = await axios.delete(
      `${process.env.REACT_APP_BACKEND_API}/board/post/${id}/comment/${commentId}`
    );
    return { status: response.status, body: {} }
  };

  return useMutation({
    mutationFn: (data: { id: number, commentId: number }) => deleteComment(data.id, data.commentId),
    onSuccess: (data: CommonResponse<object>) => {
      queryClient.invalidateQueries({ queryKey: ["delete", "post"] });
      if (options.onSuccess) options.onSuccess(data);
    },
    onError: (error) => {
      console.error(error);
      if (options.onError) options.onError(error);
    },
  });
};
