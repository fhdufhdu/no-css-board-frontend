import markdownit from "markdown-it";
import { useNavigate, useParams } from "react-router";
import { useGetMyDetail } from "../query/LoginQuery";
import {
  DeletePostStatus,
  useDeletePostQuery,
  usePostDetailQuery,
} from "../query/PostQuery";

const md = markdownit({ html: true });

export const PostPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const myDetail = useGetMyDetail();
  const postDetail = usePostDetailQuery(Number(id));
  // const commentDetails = useCommentDetailsQuery(Number(id));
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
  return (
    <>
      <div className="flex flex-col h-full">
        <ul role="menubar" className="grow-0">
          <li
            role="menuitem"
            tabIndex={0}
            onClick={() =>
              myDetail.data?.body.id === postDetail.data?.userId
                ? mutate({ id: Number(id) })
                : alert("작성자만 삭제할 수 있습니다.")
            }
          >
            삭제
          </li>
        </ul>
        <div className="window-body has-space grow overflow-y-auto has-scrollbar">
          {postDetail.isLoading ? (
            <p>Loading...</p>
          ) : postDetail.error ? (
            <p>Error 발생</p>
          ) : postDetail.data && !postDetail.data.exist ? (
            <p>존재하지 않거나, 삭제된 게시글입니다.</p>
          ) : (
            <>
              <h4>{postDetail.data?.title}</h4>
              <p className="text-sm">작성일: {postDetail.data?.createdAt}</p>
              <p className="text-sm">
                {postDetail.data?.updatedAt
                  ? `수정일: ${postDetail.data?.updatedAt}`
                  : ""}
              </p>
              <hr />
              <article
                role="tabpanel"
                className="text-[1rem]"
                dangerouslySetInnerHTML={{
                  __html: md.render(postDetail.data?.content || ""),
                }}
              ></article>
            </>
          )}
          {/* <hr /> */}
          {/* <h4 className="text-base">댓글</h4> */}
          {/* <p>{commentDetails.data?.body.comments[0].content}</p> */}
        </div>
      </div>
    </>
  );
};
