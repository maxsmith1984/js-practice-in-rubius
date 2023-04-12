const USER_URL = 'https://jsonplaceholder.typicode.com/users'
const POSTS_URL = 'https://jsonplaceholder.typicode.com/posts'

const dataContainer = document.querySelector('#data-container');

const createUserElement = (text) => {
    const userElementList = document.createElement('ul');
    const userElement = document.createElement('li');
    userElement.textContent = text;
    userElementList.append(userElement);

    return userElementList;
}

const loader = () => {
    const loaderHTML = document.querySelector('#loader');
    const hidden = loaderHTML.hasAttribute('hidden');
    if (hidden) {
        loaderHTML.removeAttribute('hidden');
    } else {
        loaderHTML.setAttribute('hidden', '');
    }
}

function getUsers() {
    loader();
    return fetch(USER_URL)
        .then(response => response.json())
        .then((users) => {
            users.forEach((user) => {
                const userHTML = createUserElement(user.name);
                dataContainer.append(userHTML);
            });
        })
        .catch((error) => console.log(error))
        .finally(() => loader())
};

async function getUserPosts(userId) {

    if (!userId) {
        throw new Error('Id Пользователя не найден')
    }
    return fetch(`${POSTS_URL}/${userId}`)

        .then(response => response.json())
        .then((posts) => {
            console.log(posts)
        })

};

// getUserPosts();
getUsers();