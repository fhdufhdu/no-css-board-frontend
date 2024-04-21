import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const isoToYearMonthDay = (isoDateValue: string) => {
  const date = new Date(isoDateValue);
  return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
};

export interface PostSummaries {
  posts: {
    id: number;
    title: string;
    userId: string;
    createdAt: string;
    updatedAt?: string;
  }[]
}

export const usePostSummariesQuery = (currPage: number) => {
  const getPostSummaries = async (currPage: number): Promise<PostSummaries> => {
    const response = await axios.get(`${process.env.REACT_APP_BACKEND_API}/board/posts`, {
      params: {
        sort_criteria: "created_at",
        sort_direction: "DESC",
        page_number: currPage,
        page_size: 20,
      },
    })
    return {
      posts: response.data.posts.map((post: { id: string; user_id: string; title: string; content: string; created_at: string; updated_at: string; }) => {
        return {
          id: post.id,
          userId: post.user_id,
          title: post.title,
          content: post.content,
          createdAt: isoToYearMonthDay(post.created_at),
          updatedAt: post.updated_at && isoToYearMonthDay(post.updated_at),
        }
      })
    }
  }

  return useQuery({
    queryKey: ["post", "summaries"],
    queryFn: () => getPostSummaries(currPage),
  })
}