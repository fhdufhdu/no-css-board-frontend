import "7.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { EditorPage } from "./page/EditorPage";
import { LoginPage } from "./page/LoginPage";
import { MainPage } from "./page/MainPage";
import { PostPage } from "./page/PostPage";

const queryClient = new QueryClient();

function App() {
  axios.defaults.withCredentials = true;
  axios.defaults.validateStatus = (status) => status < 500;
  return (
    <QueryClientProvider client={queryClient}>
      <div className="window active h-dvh w-dvw fixed flex flex-col">
        <div className="title-bar grow-0">
          <div className="title-bar-text">Windows 7 게시판</div>
          <div className="title-bar-controls">
            <button aria-label="Minimize"></button>
            <button aria-label="Maximize" disabled></button>
            <button aria-label="Close"></button>
          </div>
        </div>
        <div className="window-body grow overflow-y-hidden">
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<MainPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/post/editor" element={<EditorPage />} />
              <Route path="/post/:id" element={<PostPage />} />
            </Routes>
          </BrowserRouter>
        </div>
      </div>
    </QueryClientProvider>
  );
}

export default App;
