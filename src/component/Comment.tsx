import markdownit from "markdown-it";
import { useEffect, useRef } from "react";
import { CommentDetail, useDeleteComment } from "../query/CommentQuery";
import { useGetMyDetail } from "../query/LoginQuery";

const md = markdownit({ html: true });

export const Comment = ({
  comment,
  postId,
}: {
  comment: CommentDetail;
  postId: number;
}) => {
  // const navigate = useNavigate();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const myDetail = useGetMyDetail();
  const deleteComment = useDeleteComment({
    onSuccess: (response) => {
      if (response.status == 400) {
        alert("해당 댓글의 작성자가 아닙니다.");
      } else if (response.status == 404) {
        alert("게시글 혹은 댓글을 찾을 수 없습니다.");
      } else if (response.status == 200) {
        alert("댓글이 삭제되었습니다.");
        window.location.reload();
      } else {
        alert("알 수 없는 오류가 발생했습니다.");
      }
    },
  });
  useEffect(() => {
    if (iframeRef.current && comment.content) {
      const iframeDoc = iframeRef.current.contentWindow?.document;
      iframeDoc?.open();
      iframeDoc?.write(md.render(comment.content || ""));
      iframeDoc?.close();
      if (iframeDoc?.body) {
        const height = iframeDoc?.body?.scrollHeight;
        iframeRef.current.style.height = `${height + 1}px`;
      }
    }
  }, [comment.content]);
  return (
    <>
      <div className="flex flex-col mt-2">
        <div className="flex justify-between">
          <div className="flex items-center">
            <p className="text-base font-bold">{comment.userId}</p>
            <small className="text-sm ml-1 ">{comment.createdAt}</small>
          </div>
          {myDetail.data?.body.id === comment.userId ? (
            <button
              onClick={() =>
                deleteComment.mutate({ id: postId, commentId: comment.id })
              }
            >
              삭제
            </button>
          ) : (
            ""
          )}
        </div>
        <iframe className="mt-1 h-0 bg-white" ref={iframeRef}></iframe>
        <hr className="mt-3 border-stone-400" />
      </div>
    </>
  );
};
