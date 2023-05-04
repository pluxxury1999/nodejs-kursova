const username = localStorage.getItem('username').split('\"').join('')
const greetingBlock = document.querySelector('.username')
const settingsButton = document.querySelector('.settings')
const submitButton = document.querySelector('.submit_btn')
const form = document.querySelector('.form_block')
const oldPassword = document.querySelector('.old_password')
const newPassword = document.querySelector('.new_password')
const repeatedNewPassword = document.querySelector('.new_password_repeat')
const errorBlock = document.querySelector('.error_block')

greetingBlock.innerHTML = username;

settingsButton.addEventListener('click', () => {
    form.classList.toggle('isActive')
})

submitButton.addEventListener('click', (event) => {
    event.preventDefault()
    try {
        if (oldPassword.value.length == 0 || newPassword.value.length == 0 || repeatedNewPassword.value.length == 0) {
            return errorBlock.innerHTML = 'fields must be filled'
        } else if (oldPassword.value.length < 4 || newPassword.value.length < 4 || repeatedNewPassword.value.length < 4) {
            return errorBlock.innerHTML = 'password should be longer'
        } else if (newPassword.value !== repeatedNewPassword.value) {
            return errorBlock.innerHTML = 'passwords should be matched'
        } else if (oldPassword.value === newPassword.value) {
            return errorBlock.innerHTML = 'new password shouldn\'t be same'
        } 
        fetch('/main', {
            method: "POST",
            body: JSON.stringify({
                username: username,
                oldPassword: oldPassword.value,
                newPassword: newPassword.value,
            }),
            headers: {
                "Content-Type": "application/json",
            },
        })
          .then((response) => {
            if (response.status === 200) {
                errorBlock.innerHTML = 'successfuly changed'
                console.log('success')
            } else {
                console.log('error')
            }
        })
          .catch((error) => console.error(error));

    } catch (error) {
        console.log(error)
    }
})