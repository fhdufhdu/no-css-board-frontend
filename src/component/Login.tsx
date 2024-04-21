import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoginStatus, useLoginQuery } from "../query/LoginQuery";

export const Login = () => {
  const navigate = useNavigate();
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");

  const { mutate } = useLoginQuery({
    onSuccess: (data) => {
      if (data === LoginStatus.NOT_MATCH) {
        alert("아이디 또는 비밀번호가 일치하지 않습니다.");
      } else if (data === LoginStatus.SUCCESS) {
        alert("로그인 성공!");
        navigate("/");
      }
    },
    onError: () => {
      alert("에러가 발생했습니다. 다시 시도해주세요.");
    },
  });

  return (
    <>
      <h3>로그인</h3>
      <div>
        ID:{" "}
        <input
          type="text"
          value={id}
          onChange={(event) => {
            setId(event.target.value);
          }}
        ></input>
      </div>
      <br />
      <div>
        PW:{" "}
        <input
          type="password"
          value={password}
          onChange={(event) => {
            setPassword(event.target.value);
          }}
        ></input>
      </div>
      <br />
      <button
        onClick={() => {
          mutate({ id, password });
        }}
      >
        로그인
      </button>
    </>
  );
};
