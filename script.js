const USER_URL = 'https://jsonplaceholder.typicode.com/users'
const POSTS_URL = 'https://jsonplaceholder.typicode.com/posts?userId='

const dataContainer = document.querySelector('#data-container');

const createUserElement = (text, id) => {
    const userElementList = document.createElement('ul');
    const userElement = document.createElement('li');
    const userBtn = document.createElement('button');

    userElement.textContent = text;
    userBtn.textContent = 'Показать посты';
    userBtn.dataset.id = id;
    userBtn.classList.add('user-post-button');
    userElementList.append(userElement, userBtn);

    return userElementList;
}

const createUserPosts = (title, body) => {
    const postList = document.createElement('li');
    const postTitle = document.createElement('h4');
    const postBody = document.createElement('p');

    postTitle.textContent = title;
    postBody.textContent = body;

    postList.append(postTitle, postBody)
    return postList;
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

async function openPosts(event) {
    const button = event.target;
    const userId = button.dataset.id;
    const userElement = button.parentElement;
    const postList = userElement.querySelector('.user-post-list');

    if (postList) {
        postList.remove();
        button.textContent = 'Показать посты';
    } else {
        try {
            const posts = await getUserPosts(userId);
            const userPostList = document.createElement('ul');
            userPostList.classList.add('user-post-list');

            posts.forEach((post) => {
                const userPost = createUserPosts(post.title, post.body);
                userPostList.append(userPost);
            });

            userElement.append(userPostList);
            button.textContent = 'Скрыть посты';
        } catch (error) {
            console.error(error);
        }
    }
};

function getUsers() {
    loader();
    fetch(USER_URL)
        .then(response => response.json())
        .then((users) => {
            users.forEach((user) => {
                const userId = user.id
                const userHTML = createUserElement(user.name, userId);
                dataContainer.append(userHTML);

                userHTML.querySelector('.user-post-button').addEventListener('click', openPosts);
            });
        })
        .catch((error) => console.log(error))
        .finally(() => loader())
};

async function getUserPosts(userId) {

    if (!userId) {
        throw new Error('Id Пользователя не найден')
    }
    return fetch(`${POSTS_URL}${userId}`)

        .then(response => response.json())
        .then((posts) => {
            return posts;
        })
};

const userSearchInput = document.getElementById('search-input');

function filterUsers() {
    const searchName = userSearchInput.value.toLowerCase();
    const userElements = document.querySelectorAll('#data-container > ul');

    userElements.forEach((userElement) => {
        const userName = userElement.querySelector('li').textContent.toLowerCase();
        if (userName.includes(searchName)) {
            userElement.removeAttribute('hidden');
        } else {
            userElement.setAttribute('hidden', '');
        }
    });
}

userSearchInput.addEventListener('input', filterUsers);

getUsers();