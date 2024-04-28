import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSavePostQuery } from "../query/EditorQuery";

export const EditorPage = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const savePostQuery = useSavePostQuery({
    onSuccess: (response) => {
      if (response.status === 201) {
        alert("게시글이 작성되었습니다.");
        navigate(`/post/${response.body.id}`);
      } else if (response.status === 409)
        alert("세션이 만료되었습니다. 다시 로그인해주세요.");
      else if (response.status === 403) {
        alert("로그인을 먼저 해주세요.");
        navigate("/login");
      } else alert("게시글 작성에 실패했습니다.");
    },
  });
  return (
    <>
      <div className="flex flex-col h-full">
        <ul role="menubar" className="grow-0">
          <li
            role="menuitem"
            tabIndex={0}
            onClick={() => savePostQuery.mutate({ title, content })}
          >
            작성
          </li>
        </ul>
        <div className="window-body has-space grow overflow-y-auto has-scrollbar">
          <div className="flex flex-col h-full">
            <h4>게시글 작성</h4>
            <p>마크다운 사용가능</p>
            <div className="field-row-stacked w-64 mt-5">
              <label>제목</label>
              <input
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
            </div>
            <div className="field-row-stacked w-128 grow">
              <label>내용</label>
              <textarea
                className="h-full"
                value={content}
                onChange={(event) => setContent(event.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
