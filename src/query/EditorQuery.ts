import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { CommonResponse } from "./response.dto";

export interface SavedPost {
  id: number;
}

export const useSavePostQuery = (options: {
  onSuccess?: (data: CommonResponse<SavedPost>) => void;
  onError?: (error: Error) => void;
}) => {
  const queryClient = useQueryClient();

  const signUp = async (
    title: string,
    content: string
  ): Promise<CommonResponse<SavedPost>> => {
    const response = await axios.post(
      `${process.env.REACT_APP_BACKEND_API}/board/post`,
      { title, content }
    );
    return { status: response.status, body: response.data };
  };

  return useMutation({
    mutationFn: (data: { title: string; content: string }) =>
      signUp(data.title, data.content),
    onSuccess: (data: CommonResponse<SavedPost>) => {
      queryClient.invalidateQueries({ queryKey: ["save", "post"] });
      if (options.onSuccess) options.onSuccess(data);
    },
    onError: (error) => {
      console.error(error);
      if (options.onError) options.onError(error);
    },
  });
};
