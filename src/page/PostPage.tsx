import markdownit from "markdown-it";
import { Fragment, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useCommentDetailsQuery, usePostComment } from "../query/CommentQuery";
import {
  DeletePostStatus,
  useDeletePostQuery,
  usePostDetailQuery,
} from "../query/PostQuery";

import { Comment } from "../component/Comment";
import { useGetMyDetail } from "../query/LoginQuery";

const md = markdownit({ html: true });

export const PostPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const myDetail = useGetMyDetail();
  const postDetail = usePostDetailQuery(Number(id));
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const commentDetails = useCommentDetailsQuery(Number(id));

  const [newComment, setNewComment] = useState("");
  const deletePost = useDeletePostQuery({
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
  const postComment = usePostComment({
    onSuccess: (response) => {
      if (response.status == 409) {
        alert("세션이 만료되었습니다. 다시 로그인해주세요.");
        navigate("/login");
      } else if (response.status == 404) {
        alert("게시글을 찾을 수 없습니다.");
      } else if (response.status == 201) {
        alert("댓글이 작성되었습니다.");
        window.location.reload();
      } else {
        alert("알 수 없는 오류가 발생했습니다.");
      }
    },
  });

  useEffect(() => {
    if (iframeRef.current && postDetail.data?.content) {
      const iframeDoc = iframeRef.current.contentWindow?.document;
      console.log(md.render(postDetail.data?.content || ""));
      iframeDoc?.open();
      iframeDoc?.write(md.render(postDetail.data?.content || ""));
      iframeDoc?.close();
      if (iframeDoc?.body) {
        const height = iframeDoc?.body?.scrollHeight;
        iframeRef.current.style.height = `${height + 1}px`;
      }
    }
  }, [postDetail.data?.content]);
  return (
    <>
      <div className="flex flex-col h-full">
        <ul role="menubar" className="grow-0">
          <li
            role="menuitem"
            tabIndex={0}
            aria-disabled={
              myDetail.data?.body.id === postDetail.data?.userId
                ? undefined
                : "true"
            }
            onClick={() => deletePost.mutate({ id: Number(id) })}
          >
            삭제
          </li>
        </ul>
        <div className="window-body has-space grow overflow-y-auto has-scrollbar">
          <div className="flex flex-col h-auto">
            {postDetail.isLoading ? (
              <p>Loading...</p>
            ) : postDetail.error ? (
              <p>Error 발생</p>
            ) : postDetail.data && !postDetail.data.exist ? (
              <p>존재하지 않거나, 삭제된 게시글입니다.</p>
            ) : (
              <>
                <h4>{postDetail.data?.title}</h4>
                <p className="text-sm mt-2">
                  작성자: {postDetail.data?.userId}
                </p>
                <p className="text-sm">작성일: {postDetail.data?.createdAt}</p>
                <p className="text-sm">
                  {postDetail.data?.updatedAt
                    ? `수정일: ${postDetail.data?.updatedAt}`
                    : ""}
                </p>
                <iframe className="mt-2 bg-white h-0" ref={iframeRef}></iframe>
              </>
            )}
            <h4 className="text-base mt-3">
              댓글{" "}
              <small>
                {commentDetails.data?.pages[0].body.totalElements}개
              </small>
            </h4>
            {commentDetails.data?.pages.map((page, i) => {
              return (
                <Fragment key={i}>
                  {page.body.comments.map((comment) => {
                    return (
                      <Comment
                        key={comment.id}
                        comment={comment}
                        postId={Number(id)}
                      />
                    );
                  })}
                </Fragment>
              );
            })}
            <section className="field-row justify-end mt-1">
              <button
                onClick={() => {
                  commentDetails.fetchNextPage();
                }}
                disabled={
                  !commentDetails.hasNextPage ||
                  commentDetails.isFetchingNextPage
                }
              >
                {commentDetails.isFetchingNextPage
                  ? "댓글 로딩중 ..."
                  : commentDetails.hasNextPage
                  ? "댓글 더보기"
                  : "불러올 댓글 없음"}
              </button>
            </section>
            <div className="mt-7 field-row-stacked w-full">
              <textarea
                className="h-20"
                value={newComment}
                onChange={(event) => setNewComment(event.target.value)}
              />
            </div>
            <section className="mt-2 field-row justify-end">
              <button
                onClick={() => {
                  postComment.mutate({ id: Number(id), content: newComment });
                }}
              >
                댓글 작성
              </button>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};
