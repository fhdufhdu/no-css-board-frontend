axios.defaults.withCredentials = true;

function getPasswordAndCheck() {
  const password = document.querySelector("#signup-password").value;
  const passwordCheck = document.querySelector("#signup-password-check").value;

  return [password, passwordCheck];
}

function isValidPassword(password, passwordCheck) {
  return password === passwordCheck;
}

function getCheckSentence(condition) {
  return condition
    ? "- 비밀번호가 일치합니다."
    : "- 비밀번호가 일치하지 않습니다.";
}

function getLoginIdAndPassword() {
  const id = document.querySelector("#login-id").value;
  const password = document.querySelector("#login-password").value;

  return [id, password];
}

function getSignupIdAndPassword() {
  const id = document.querySelector("#signup-id").value;
  const password = document.querySelector("#signup-password").value;

  return [id, password];
}

function requestLogin(id, password) {
  axios
    .post("http://localhost:8080/user/login", { id, password })
    .then((response) => {
      if (response.status !== 200) {
        alert("아이디와 비밀번호를 다시 확인해주세요.");
      } else {
        console.log(response);
        alert(`환영합니다. ${id}님`);
        window.localStorage.setItem('userId', id)
        window.location.href = "/index.html";
      }
    });
}

function requestSignUp(id, password) {
  axios.post("http://localhost:8080/user/signup", { id, password }).then((response) => {
    if (response.status === 409) {
      alert("이미 존재하는 아이디입니다.");
    } else if (response.status !== 200) {
      alert("에러 발생, 회원가입을 다시 시도해주세요.");
    } else {
      requestLogin(id, password);
    }
  });
}

function requestCheckExistence(id) {
  axios.get(`http://localhost:8080/user/${id}/existence`)
    .then((response) => {
      if (response.status !== 200) {
        alert("에러 발생, 다시 시도해주세요.");
        return;
      }
      return response.json();
    })
    .then((body) => {
      if (!body) return;
      if (body.exist) {
        alert("이미 존재하는 아이디입니다.");
      } else {
        alert("사용 가능한 아이디입니다.");
      }
    });
}

window.addEventListener("DOMContentLoaded", () => {
  const loginButton = document.querySelector("#login-button");
  const signUpButton = document.querySelector("#signup-button");
  const signupPasswordCheck = document.querySelector("#signup-password-check");
  const samePassword = document.querySelector("#same-password");
  const idExistenceButton = document.querySelector("#id-existence");

  signupPasswordCheck.addEventListener("keyup", (e) => {
    const [password, passwordCheck] = getPasswordAndCheck();
    const isValid = isValidPassword(password, passwordCheck);
    samePassword.innerHTML = getCheckSentence(isValid);
  });

  loginButton.addEventListener("click", (e) => {
    console.log(e)
    const [id, password] = getLoginIdAndPassword();
    requestLogin(id, password);
  });

  signUpButton.addEventListener("click", (e) => {
    const [id, password] = getSignupIdAndPassword();
    const [_, passwordCheck] = getPasswordAndCheck();
    const isValid = isValidPassword(password, passwordCheck);
    if (!isValid) {
      alert("password를 다시 확인해주세요.");
      return;
    }

    requestSignUp(id, password);
  });

  idExistenceButton.addEventListener("click", (e) => {
    const [id, _] = getSignupIdAndPassword();
    requestCheckExistence(id);
  });
});
