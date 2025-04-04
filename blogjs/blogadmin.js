// blogjs/blogadmin.js

async function getPosts() {
  return await loadPosts();
}

async function savePosts(posts) {
  downloadJSON(posts);
}

function downloadJSON(posts) {
  const blob = new Blob([JSON.stringify(posts, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'blogposts.json';
  a.click();
  URL.revokeObjectURL(url);
  alert('Arquivo JSON gerado! Faça o upload dele para a raiz do seu site.');
}

async function renderAdmin() {
  const list = document.getElementById('admin-list');
  const posts = await getPosts();
  
  list.innerHTML = '';
  
  if (posts.length === 0) {
    list.innerHTML = '<p>Nenhum post encontrado. Crie seu primeiro post!</p>';
    return;
  }
  
  posts.forEach(post => {
    const div = document.createElement('div');
    div.className = 'admin-post-item';
    div.innerHTML = `
      <div class="post-header">
        <strong>${post.title}</strong>
        <span class="post-date">${post.date}</span>
      </div>
      <div class="post-actions">
        <button onclick="editPost('${post.id}')" class="btn-edit">✏️ Editar</button>
        <button onclick="deletePost('${post.id}')" class="btn-delete">🗑️ Excluir</button>
      </div>
    `;
    list.appendChild(div);
  });
}

function editPost(id) {
  const posts = getPosts();
  const post = posts.find(p => p.id === id);
  if (post) {
    document.getElementById('post-id').value = post.id;
    document.getElementById('title').value = post.title;
    document.getElementById('author').value = post.author;
    document.getElementById('date').value = post.date;
    document.getElementById('image').value = post.image || '';
    document.getElementById('type').value = post.type || '';
    document.getElementById('content').value = post.content;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

function deletePost(id) {
  if (confirm('Excluir este post permanentemente?')) {
    const updatedPosts = getPosts().filter(p => p.id !== id);
    savePosts(updatedPosts);
    renderAdmin();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('post-form');
  document.getElementById('date').valueAsDate = new Date();

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const postData = {
      id: document.getElementById('post-id').value || Date.now().toString(),
      title: document.getElementById('title').value.trim(),
      author: document.getElementById('author').value.trim(),
      date: document.getElementById('date').value,
      image: document.getElementById('image').value.trim(),
      type: document.getElementById('type').value.trim(),
      content: document.getElementById('content').value.trim()
    };

    const posts = await getPosts();
    const existingIndex = posts.findIndex(p => p.id === postData.id);
    
    if (existingIndex >= 0) {
      posts[existingIndex] = postData;
    } else {
      posts.unshift(postData);
    }

    await savePosts(posts);
    document.getElementById('post-id').value = '';
    form.reset();
    renderAdmin();
  });

  renderAdmin();
});
