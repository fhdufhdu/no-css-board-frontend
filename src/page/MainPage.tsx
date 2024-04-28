import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetMyDetail } from "../query/LoginQuery";
import { usePostSummariesQuery } from "../query/MainQuery";
import window7 from "../static/window7.png";

export const MainPage = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [currPage, setCurrPage] = useState(0);
  const navigate = useNavigate();

  const postSummaries = usePostSummariesQuery(currPage);
  const myDetail = useGetMyDetail();

  return (
    <>
      <div className="flex flex-col h-full">
        <ul role="menubar" className="grow-0">
          <li role="menuitem" tabIndex={0} onClick={() => navigate("/login")}>
            로그인/회원가입
          </li>

          {myDetail.data?.status === 200 ? (
            <li
              role="menuitem"
              tabIndex={1}
              onClick={() => navigate("/post/editor")}
            >
              게시글 작성
            </li>
          ) : (
            <li role="menuitem" tabIndex={1}>
              로그인시 게시글 작성이 가능합니다.
            </li>
          )}
        </ul>
        <div className="window-body has-space grow overflow-y-auto has-scrollbar">
          <img src={window7} className="w-64" />
          <div role="tooltip" className="w-80">
            그때... 그 시절...
          </div>
          <table className="border-separate border-spacing-y-2 table-auto w-full text-center mt-3">
            <thead className="text-base">
              <tr>
                <th className="shadow-sm hover:shadow-inner border-r border-stone-400">
                  번호
                </th>
                <th className="shadow-sm hover:shadow-inner border-r border-stone-400">
                  작성자
                </th>
                <th className="shadow-sm hover:shadow-inner border-r border-stone-400">
                  제목
                </th>
                <th className="shadow-sm hover:shadow-inner border-r border-stone-400">
                  작성일자
                </th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {postSummaries.isPending ? (
                <p>Loading...</p>
              ) : postSummaries.error ? (
                <p>Error 발생</p>
              ) : (
                postSummaries.data.posts.map((post) => {
                  return (
                    <tr key={post.id}>
                      <td>{post.id}</td>
                      <td>{post.userId}</td>
                      <td>
                        <a href={`/post/${post.id}`}>{post.title}</a>
                      </td>
                      <td>{post.createdAt}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};
