import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePostSummariesQuery } from "../query/MainQuery";
import ggalggi from "../static/ggalggi.png";

export const MainPage = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [currPage, setCurrPage] = useState(0);
  const navigate = useNavigate();

  const { isPending, error, data } = usePostSummariesQuery(currPage);

  return (
    <>
      <button onClick={() => navigate("/login")}>로그인/회원가입</button>
      <br />
      <br />
      <img src={ggalggi} width="200px" />
      <h1>NO CSS Board</h1>
      <p>깔끼하고 맛꿀마한 NO CSS 게시판</p>
      <p>CSS쓰면 아주 그냥 절단임</p>
      <hr />
      <button onClick={() => navigate("/post/editor")}>게시글 작성</button>
      <hr />
      <div>
        {isPending ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error 발생</p>
        ) : (
          data.posts.map((post) => {
            return (
              <div key={post.id}>
                <h3>
                  <a href={`/post/${post.id}`}>{post.title}</a>
                </h3>
                <small>{post.userId}</small>
                <br />
                <small>{post.createdAt}</small>
                <br />
                <small>{post.updatedAt}</small>
                <hr />
              </div>
            );
          })
        )}
      </div>
      <div />
    </>
  );
};
