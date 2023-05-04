const username = localStorage.getItem('username').split('\"').join('')
const greetingBlock = document.querySelector('.username')
const submitButton = document.querySelector('.submit_btn')
const codeField = document.querySelector('.code')

greetingBlock.innerHTML = username;

function saveToLocalStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

submitButton.addEventListener('click', (event) => {
    event.preventDefault();
    fetch('/confirmation', {
        method: "POST",
        body: JSON.stringify({
            username: username,
            code: codeField.value
        }),
        headers: {
            "Content-Type": "application/json",
        },
    })
      .then((response) => response.json())
      .then((data) => {
        saveToLocalStorage("Authorization", data)
        window.location.replace('/main')
      })
        .catch((error) => console.error(error));
})