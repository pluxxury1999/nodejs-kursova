// const xhr = new XMLHttpRequest();
// xhr.open('GET', '/login');
// xhr.send();
// xhr.onreadystatechange = function() {
//   if (this.readyState == 4 && this.status == 200) {
//     const contentType = xhr.getResponseHeader('Authorization');
//     console.log(contentType);
//   }
// };

const button = document.querySelector(".submit_btn");
const username = document.querySelector(".username");
const password = document.querySelector(".password");
const errorBlock = document.querySelector('.error_block')

function saveToLocalStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

button.addEventListener("click", (event) => {
    event.preventDefault();
    fetch('/login', {
        method: "POST",
        body: JSON.stringify({
            username: username.value,
            password: password.value,
        }),
        headers: {
            "Content-Type": "application/json",
        },
  })
    .then((response) => {
        if (response.status === 200) {
            localStorage.setItem('username', JSON.stringify(username.value))
            window.location.href = '/main'
        } else if (response.status === 403) {
            window.location.href = '/confirmation'
        }
    })
      .catch((error) => console.error(error));
});

