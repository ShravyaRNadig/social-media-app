document.addEventListener('DOMContentLoaded', () => {
    // Get DOM elements
    const createUserBtn = document.getElementById('create-user-btn');
    const createPostBtn = document.getElementById('create-post-btn');
    const usersList = document.getElementById('users');
    const postsList = document.getElementById('posts');

    // Modal elements
    const popupModal = document.getElementById('popup-modal');
    const popupMessage = document.getElementById('popup-message');
    const popupCloseBtn = document.getElementById('popup-close-btn');

    // Function to show the popup modal with a message
    const showPopup = (message) => {
        popupMessage.textContent = message;
        popupModal.style.display = 'flex';

        setTimeout(() => {
            popupModal.style.display = 'none';
        }, 1000);
    };

    // Event listener to close the popup modal
    popupCloseBtn.addEventListener('click', () => {
        popupModal.style.display = 'none';
    });

    // Event listener for creating a user
    createUserBtn.addEventListener('click', async () => {
        const name = document.getElementById('user-name').value;
        const email = document.getElementById('user-email').value;

        if (!name || !email) {
            showPopup('Please provide both name and email.');
            return;
        }

        const newUser = { name, email };
        const response = await fetch('/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newUser)
        });
        const data = await response.json();
        if (response.ok) {
            showPopup('User created successfully!');
            fetchUsers(); // Refresh the users list
        } else {
            showPopup('Error creating user: ' + data.message);
        }
    });

    // Event listener for creating a post
    createPostBtn.addEventListener('click', async () => {
        const userId = document.getElementById('post-user-id').value;
        const content = document.getElementById('post-content').value;

        if (!userId || !content) {
            showPopup('Please provide both user ID and content.');
            return;
        }

        const newPost = { userId, content };
        const response = await fetch('/posts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newPost)
        });
        const data = await response.json();
        if (response.ok) {
            showPopup('Post created successfully!');
            fetchPosts(); // Refresh the posts list
        } else {
            showPopup('Error creating post: ' + data.message);
        }
    });

    // Fetch and display users
    const fetchUsers = async () => {
        const response = await fetch('/users');
        const users = await response.json();
        usersList.innerHTML = '';
        users.forEach(user => {
            const li = document.createElement('li');
            li.textContent = `${user.name} (${user.email})`;
            usersList.appendChild(li);
        });
    };

    // Fetch and display posts
    const fetchPosts = async () => {
        const response = await fetch('/posts');
        const posts = await response.json();
        postsList.innerHTML = '';
        posts.forEach(post => {
            const li = document.createElement('li');
            li.textContent = `User ID: ${post.userId} - ${post.content}`;
            postsList.appendChild(li);
        });
    };

    // Initial fetch of users and posts
    fetchUsers();
    fetchPosts();
});
