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
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/post/editor" element={<EditorPage />} />
          <Route path="/post/:id" element={<PostPage />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
