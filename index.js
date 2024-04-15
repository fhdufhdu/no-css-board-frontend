axios.defaults.withCredentials = true;
const baseUrl = "http://localhost:8080";

window.addEventListener("DOMContentLoaded", () => {
  axios
    .get(`${baseUrl}/board/posts`, {
      params: {
        sort_criteria: "created_at",
        sort_direction: "DESC",
        page_number: 0,
        page_size: 20,
      },
    })
    .then((response) => {
      console.log(response.data);
    });
});
