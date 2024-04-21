import { useState } from "react";
import { PostSaveStatus, useSavePostQuery } from "../query/EditorQuery";

export const EditorPage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const savePostQuery = useSavePostQuery({
    onSuccess: (data) => {
      if (data === PostSaveStatus.PUBLISHED) {
        alert("게시글이 작성되었습니다.");
      } else if (data === PostSaveStatus.CHECK_SESSION)
        alert("세션이 만료되었습니다. 다시 로그인해주세요.");
      else alert("게시글 작성에 실패했습니다.");
    },
  });
  return (
    <>
      <h1>게시글 작성</h1>
      <p>마크다운 사용하십쇼</p>
      <hr />
      제목:{" "}
      <input
        type="text"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />
      <br />
      <br />
      내용:{" "}
      <textarea
        value={content}
        onChange={(event) => setContent(event.target.value)}
      />
      <br />
      <br />
      <button onClick={() => savePostQuery.mutate({ title, content })}>
        작성
      </button>
    </>
  );
};
