import { useState } from "react";
import { Login } from "../component/Login";
import { SignUp } from "../component/SignUp";

enum SelectedTab {
  LOGIN,
  SIGNUP,
}

export const LoginPage = () => {
  const [selectedTab, setSelectedTab] = useState(SelectedTab.LOGIN);
  return (
    <>
      <div className="p-2">
        <menu role="tablist" aria-label="Window with Tabs">
          <button
            role="tab"
            aria-controls="login"
            aria-selected={selectedTab === SelectedTab.LOGIN ? "true" : "false"}
            onClick={() => setSelectedTab(SelectedTab.LOGIN)}
          >
            로그인
          </button>
          <button
            role="tab"
            aria-controls="signup"
            aria-selected={
              selectedTab === SelectedTab.SIGNUP ? "true" : "false"
            }
            onClick={() => setSelectedTab(SelectedTab.SIGNUP)}
          >
            회원가입
          </button>
        </menu>
        {selectedTab === SelectedTab.LOGIN ? <Login /> : <SignUp />}
      </div>
    </>
  );
};
