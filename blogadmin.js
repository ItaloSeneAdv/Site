function getPosts() {
  return JSON.parse(localStorage.getItem('posts') || '[]');
}

function savePosts(posts) {
  localStorage.setItem('posts', JSON.stringify(posts));
}

function renderAdmin() {
  const list = document.getElementById('admin-list');
  const posts = getPosts();
  list.innerHTML = '';

  posts.forEach(post => {
    const div = document.createElement('div');
    div.innerHTML = `
      <strong>${post.title}</strong> (${post.date}) — ${post.author}
      <button onclick="editPost('${post.id}')">✏️</button>
      <button onclick="deletePost('${post.id}')">🗑️</button>
    `;
    list.appendChild(div);
  });
}

function editPost(id) {
  const post = getPosts().find(p => p.id === id);
  if (post) {
    document.getElementById('post-id').value = post.id;
    document.getElementById('title').value = post.title;
    document.getElementById('author').value = post.author;
    document.getElementById('date').value = post.date;
    document.getElementById('image').value = post.image;
    document.getElementById('type').value = post.type || '';
    document.getElementById('content').value = post.content;
    window.scrollTo(0, 0);
  }
}

function deletePost(id) {
  if (confirm("Deseja excluir este post?")) {
    const posts = getPosts().filter(p => p.id !== id);
    savePosts(posts);
    renderAdmin();
  }
}

window.renderAdmin = renderAdmin;

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('post-form');
  const postId = document.getElementById('post-id');

  if (!form || !postId) return;

  console.log("🧠 blogadmin.js carregado");

  renderAdmin();

  // REMOVENDO listeners antigos
  form.onsubmit = null;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    console.log("🟡 Formulário enviado");

    if (form.dataset.submitting === "true") {
      console.warn("⚠️ Já está processando!");
      return;
    }

    form.dataset.submitting = "true";

    const posts = getPosts();
    const id = postId.value || Date.now().toString();

    const newPost = {
      id,
      title: document.getElementById('title').value.trim(),
      author: document.getElementById('author').value.trim(),
      date: document.getElementById('date').value,
      image: document.getElementById('image').value.trim(),
      type: document.getElementById('type').value.trim(),
      content: document.getElementById('content').value.trim()
    };

    console.log("🔧 Novo post:", newPost);

    const index = posts.findIndex(p => p.id === id);
    if (index >= 0) {
      console.log("✏️ Atualizando post existente");
      posts[index] = newPost;
    } else {
      console.log("➕ Inserindo novo post");
      posts.unshift(newPost);
    }

    savePosts(posts);
    form.reset();
    postId.value = '';
    form.dataset.submitting = "false";
    renderAdmin();
  });
});
