axios.defaults.withCredentials = true;
const baseUrl = "http://localhost:8080";
const md = markdownit({ html: true });
md.render("# TEST");

let curr_page = 0;

function strDate(isoDateStr) {
  const date = new Date(isoDateStr);
  return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
}

function requestDelete(button) {
  const result = confirm("정말로 삭제하시겠습니까?")
  if (result){
    axios.delete(`${baseUrl}/board/post/${button.value}`).then((response) => {
      if(response.status === 200)
        window.location.reload(true);
    });
  }
}

window.addEventListener("DOMContentLoaded", () => {
  axios
    .get(`${baseUrl}/board/posts`, {
      params: {
        sort_criteria: "created_at",
        sort_direction: "DESC",
        page_number: curr_page,
        page_size: 20,
      },
    })
    .then((response) => {
      if (response.status == 200) {
        const postsDiv = document.querySelector("#posts");

        const posts = response.data.posts;
        const currUserId = window.localStorage.getItem('userId')
        console.log(currUserId)

        posts.forEach((post) => {
          postsDiv.innerHTML += `
            <div>
              <h2><a href="/page/post.html?id=${post.id}">${post.title}</a></h2>
              <small>작성자: ${post.user_id}</small><br>
              <small>작성일자: ${strDate(post.created_at)}</small> ${
            post.updated_at
              ? `- <small>수정일자: ${post.updated_at}</small>`
              : ""
          }
              <br><br>
              ${currUserId === post.user_id ? `<button value="${post.id}" onclick="requestDelete(this)">삭제</button>` : ""}
              <hr>
            </div>
          `;
        });
      }
    });
});
