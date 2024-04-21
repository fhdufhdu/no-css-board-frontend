import { useEffect, useState } from "react";
import {
  SignUpStatus,
  useIdExistenceQuery,
  useSignUpQuery,
} from "../query/SignUpQuery";

enum CheckStatus {
  WAIT_CHECK,
  BUTTON_CLICKED,
  CHECKING,
  CHECKED,
}

export const SignUp = () => {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [checkPassword, setCheckPassword] = useState("");
  const [checkStatus, setCheckStatus] = useState(CheckStatus.WAIT_CHECK);

  const signUpQuery = useSignUpQuery({
    onSuccess: (data) => {
      if (data === SignUpStatus.UNKNOWN_ERROR)
        alert("에러가 발생했습니다. 다시 시도해주세요.");
      else if (data === SignUpStatus.ALREADY_EXIST)
        alert("이미 존재하는 아이디입니다.");
      else if (data === SignUpStatus.SUCCESS) {
        alert("회원가입 성공! 로그인을 다시 진행해주세요!");
        location.reload();
      }
    },
    onError: () => alert("에러가 발생했습니다. 다시 시도해주세요."),
  });

  const idExistence = useIdExistenceQuery(id);

  useEffect(() => {
    console.log(checkStatus, idExistence.isLoading);
    if (checkStatus === CheckStatus.WAIT_CHECK) {
      if (idExistence.isLoading) {
        setCheckStatus(CheckStatus.CHECKING);
      } else if (idExistence.data) {
        setCheckStatus(CheckStatus.CHECKED);
      }
    } else if (checkStatus === CheckStatus.CHECKING) {
      if (!idExistence.isLoading && idExistence.data) {
        setCheckStatus(CheckStatus.CHECKED);
      }
    } else if (checkStatus === CheckStatus.CHECKED) {
      setCheckStatus(CheckStatus.WAIT_CHECK);
    }
  }, [idExistence.data]);

  return (
    <>
      <h3>회원가입</h3>
      <div>
        ID:{" "}
        <input
          type="text"
          value={id}
          onChange={(event) => {
            setCheckStatus(CheckStatus.WAIT_CHECK);
            setId(event.currentTarget.value);
          }}
        ></input>{" "}
        <button
          onClick={() => {
            setCheckStatus(CheckStatus.BUTTON_CLICKED);
            idExistence.refetch();
          }}
        >
          중복체크
        </button>
        {checkStatus === CheckStatus.WAIT_CHECK
          ? ""
          : checkStatus === CheckStatus.CHECKING
          ? " 중복체크 중..."
          : idExistence.data
          ? " 이미 존재하는 아이디입니다."
          : " 사용 가능한 아이디입니다."}
      </div>
      <br />
      <div>
        PW:{" "}
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.currentTarget.value)}
        ></input>
      </div>
      <br />
      <div>
        PW Check:{" "}
        <input
          type="password"
          value={checkPassword}
          onChange={(event) => setCheckPassword(event.currentTarget.value)}
        ></input>
      </div>
      <div>
        {password && checkPassword
          ? password === checkPassword
            ? "- 비밀번호가 일치합니다."
            : "- 비밀번호가 일치하지 않습니다."
          : ""}
      </div>
      <br />
      <button
        onClick={() => {
          signUpQuery.mutate({ id, password });
        }}
      >
        회원가입
      </button>
    </>
  );
};
