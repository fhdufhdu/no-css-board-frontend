import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginQuery } from "../query/LoginQuery";

export const Login = () => {
  const navigate = useNavigate();
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");

  const { mutate } = useLoginQuery({
    onSuccess: (response) => {
      if (response.status === 200) {
        alert("로그인 성공!");
        navigate("/");
      } else {
        alert("아이디 또는 비밀번호가 일치하지 않습니다.");
      }
    },
    onError: () => {
      alert("에러가 발생했습니다. 다시 시도해주세요.");
    },
  });

  return (
    <>
      <article role="tabpanel">
        <div className="field-row-stacked w-64">
          <label>ID</label>
          <input
            type="text"
            value={id}
            onChange={(event) => {
              setId(event.target.value);
            }}
          ></input>
        </div>
        <div className="field-row-stacked w-64">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
            }}
          ></input>
        </div>
      </article>
      <section className="field-row justify-start">
        <button
          onClick={() => {
            mutate({ id, password });
          }}
        >
          로그인
        </button>
      </section>
    </>
  );
};
