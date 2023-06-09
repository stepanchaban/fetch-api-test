const postsList = document.querySelector('.posts__list');
const getPostsBtn = document.querySelector('.posts__get-posts');

const postTitle = document.querySelector('.new-post__title');
const postBody = document.querySelector('.new-post__body');
const addNewPost = document.querySelector('.new-post__add');

const state = {
  posts: [],
  newPost: {
    title: '',
    body: ''
  },
  editPost: {}
};

const cleanData = () => {
  state.newPost.title = '';
  state.newPost.body = '';

  postTitle.value = '';
  postBody.value = '';
};

const editPost = index => {
  const editablePost = state.posts[index];
  state.editPost = editablePost;

  postTitle.value = state.editPost.title;
  postBody.value = state.editPost.body;
};

const deletePost = index => {
  const editablePost = state.posts[index];

  removePostRequest(editablePost.id);

  state.posts.splice(index, 1);

  fillPostList(state.posts);
};

const createPost = (post, index) => `
  <li class="post">
    <div class="post__wrapper">
      <h3 class="wrapper__title">${post.title}</h3>
      <div class="wrapper__body">${post.body}</div>
    </div>

    <div class="post__buttons">
      <button class="buttons__edit" onclick="editPost(${index})">Edit</button>
      <button class="buttons__delete" onclick="deletePost(${index})">Delete</button>
    </div>
  </li>
`;

const fillPostList = posts => {
  postsList.innerHTML = '';

  if (posts.length) {
    posts.forEach((post, index) => (postsList.innerHTML += createPost(post, index)));
  }
};

postTitle.addEventListener('change', e => {
  if (state.editPost.title) {
    state.editPost.title = e.target.value;
    return;
  }

  state.newPost.title = e.target.value;
});

postBody.addEventListener('change', e => {
  if (state.editPost.body) {
    state.editPost.body = e.target.value;
    return;
  }

  state.newPost.body = e.target.value;
});

addNewPost.addEventListener('click', async () => {
  try {
    if (state.editPost.title || state.editPost.body) {
      await updatePostRequest();
    } else {
      await createPostRequest();
    }
    cleanData();
    fillPostList(state.posts);
  } catch (e) {
    console.error(e);
  }
});

getPostsBtn.addEventListener('click', async () => {
  try {
    await getPostsRequest();
    fillPostList(state.posts);
  } catch (e) {
    console.error(e);
  }
});

function getPostsRequest() {
  return fetch('https://jsonplaceholder.typicode.com/posts?_limit=10', {
    method: 'GET',
    headers: {
      'Content-type': 'application/json; charset=UTF-8'
    }
  })
    .then(res => res.json())
    .then(posts => (state.posts = state.posts.concat(posts)));
}

function createPostRequest() {
  return fetch('https://jsonplaceholder.typicode.com/posts', {
    method: 'POST',
    body: JSON.stringify(state.newPost),
    headers: {
      'Content-type': 'application/json; charset=UTF-8'
    }
  })
    .then(res => res.json())
    .then(post => state.posts.push(post));
}

function updatePostRequest() {
  return fetch(`https://jsonplaceholder.typicode.com/posts/${state.editPost.id}`, {
    method: 'PUT',
    body: JSON.stringify(state.editPost),
    headers: {
      'Content-type': 'application/json; charset=UTF-8'
    }
  })
    .then(res => res.json())
    .then(data => data);
}

function removePostRequest(id) {
  return fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
    method: 'DELETE'
  });
}
