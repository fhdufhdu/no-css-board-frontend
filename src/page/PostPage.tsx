import markdownit from "markdown-it";
import { useNavigate, useParams } from "react-router-dom";
import {
  DeletePostStatus,
  useDeletePostQuery,
  usePostDetailQuery,
} from "../query/PostQuery";

const md = markdownit({ html: true });

export const PostPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { isLoading, error, data } = usePostDetailQuery(Number(id));
  const { mutate } = useDeletePostQuery({
    onSuccess: (data: DeletePostStatus) => {
      if (data === DeletePostStatus.SUCCESS) {
        alert("삭제되었습니다.");
        navigate("/");
      } else if (data === DeletePostStatus.NOT_FOUND)
        alert("삭제할 게시글을 찾을 수 없습니다.");
      else if (data === DeletePostStatus.NOT_WRITER)
        alert("작성자만 삭제할 수 있습니다.");
      else alert("알 수 없는 오류가 발생했습니다.");
    },
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error 발생</p>;
  if (data && data.isDeleted) return <p>삭제된 게시글입니다.</p>;
  return (
    <>
      <button onClick={() => mutate({ id: Number(id) })}>삭제</button>
      <h1>{data?.title}</h1>
      <p>작성일: {data?.createdAt}</p>
      <p>{data?.updatedAt ? `수정일: ${data?.updatedAt}` : ""}</p>
      <hr />
      <div
        dangerouslySetInnerHTML={{ __html: md.render(data?.content || "") }}
      ></div>
    </>
  );
};
