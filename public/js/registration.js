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
const email = document.querySelector(".email");
const username = document.querySelector(".username");
const password = document.querySelector(".password");
const errorBlock = document.querySelector(".err__block");

function saveToLocalStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

button.addEventListener("click", (event) => {
    event.preventDefault();
    fetch('/registration', {
        method: "POST",
        body: JSON.stringify({
            email: email.value,
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
            document.location.href = '/confirmation'
        } else {
            errorBlock.innerHTML = 'Email or username is busy';
        }
    })
      .catch((error) => console.error(error));
});