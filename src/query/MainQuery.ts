import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";

export const isoToYearMonthDay = (isoDateValue: string) => {
  const date = new Date(isoDateValue);
  return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
};

export interface PostSummary {
  id: number;
  title: string;
  userId: string;
  createdAt: string;
  updatedAt?: string;
}

export interface PostSummaries {
  posts: PostSummary[]
  number: number;
  totalPages: number;
  totalElements: number;
}

export const usePostSummariesQuery = () => {
  const getPostSummaries = async ({ pageParam = 0 }): Promise<PostSummaries> => {
    const response = await axios.get(`${process.env.REACT_APP_BACKEND_API}/board/posts`, {
      params: {
        sort_criteria: "created_at",
        sort_direction: "DESC",
        page_number: pageParam,
        page_size: 40,
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
      }),

      number: response.data.number,
      totalPages: response.data.total_pages,
      totalElements: response.data.total_elements,
    }
  }

  return useInfiniteQuery({
    queryKey: ["post", "summaries"],
    queryFn: getPostSummaries,
    initialPageParam: 0,
    getNextPageParam: (prevPage) => {
      return prevPage.number + 1 >= prevPage.totalPages ? undefined : prevPage.number + 1;
    }
  })
}