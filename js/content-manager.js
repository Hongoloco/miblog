// Funciones para el manejo del blog y recursos
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar los elementos de la interfaz
    initializeUI();
    
    // Cargar contenido inicial
    loadContent();
});

// Inicialización de la interfaz
function initializeUI() {
    // Event listeners para los filtros
    const filterChips = document.querySelectorAll('.filter-chip');
    filterChips.forEach(chip => {
        chip.addEventListener('click', () => {
            filterChips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            filterContent(chip.dataset.category);
        });
    });
}

// Toggle formularios y paneles
function toggleNewPostForm() {
    const form = document.getElementById('newPostForm');
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
}

function toggleNewResourceForm() {
    const form = document.getElementById('newResourceForm');
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
}

function toggleCategories() {
    const filters = document.getElementById('categoryFilters');
    filters.style.display = filters.style.display === 'none' ? 'flex' : 'none';
}

// Funciones para el blog
function createPost(title, content, tags) {
    const post = {
        id: Date.now(),
        title,
        content,
        tags: tags.split(',').map(tag => tag.trim()),
        date: new Date().toISOString(),
        author: localStorage.getItem('username') || 'Anonymous'
    };

    // Aquí añadirías la lógica para guardar en tu backend
    const posts = JSON.parse(localStorage.getItem('posts') || '[]');
    posts.push(post);
    localStorage.setItem('posts', JSON.stringify(posts));
    
    displayPost(post);
    return post;
}

function displayPost(post) {
    const grid = document.querySelector('.content-grid');
    const postElement = document.createElement('article');
    postElement.className = 'content-card';
    
    postElement.innerHTML = `
        <div class="card-header">
            <h3 class="card-title">${post.title}</h3>
            <div class="card-actions">
                <button class="card-button" onclick="editPost(${post.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="card-button" onclick="deletePost(${post.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
        <div class="card-content">
            ${post.content}
        </div>
        <div class="card-footer">
            <div class="card-tags">
                ${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
            <small>${new Date(post.date).toLocaleDateString()}</small>
        </div>
    `;
    
    grid.appendChild(postElement);
}

// Funciones para recursos
function createResource(title, description, url, category, tags) {
    const resource = {
        id: Date.now(),
        title,
        description,
        url,
        category,
        tags: tags.split(',').map(tag => tag.trim()),
        date: new Date().toISOString(),
        author: localStorage.getItem('username') || 'Anonymous'
    };

    // Aquí añadirías la lógica para guardar en tu backend
    const resources = JSON.parse(localStorage.getItem('resources') || '[]');
    resources.push(resource);
    localStorage.setItem('resources', JSON.stringify(resources));
    
    displayResource(resource);
    return resource;
}

function displayResource(resource) {
    const grid = document.querySelector('.content-grid');
    const resourceElement = document.createElement('article');
    resourceElement.className = 'content-card';
    
    resourceElement.innerHTML = `
        <div class="card-header">
            <h3 class="card-title">${resource.title}</h3>
            <div class="card-actions">
                <button class="card-button" onclick="editResource(${resource.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="card-button" onclick="deleteResource(${resource.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
        <div class="card-content">
            <p>${resource.description}</p>
            <a href="${resource.url}" target="_blank" class="resource-link">
                <i class="fas fa-external-link-alt"></i> Visitar recurso
            </a>
        </div>
        <div class="card-footer">
            <div class="card-tags">
                <span class="tag">${resource.category}</span>
                ${resource.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
            <small>${new Date(resource.date).toLocaleDateString()}</small>
        </div>
    `;
    
    grid.appendChild(resourceElement);
}

// Funciones de filtrado
function filterContent(category) {
    const cards = document.querySelectorAll('.content-card');
    cards.forEach(card => {
        const tags = card.querySelectorAll('.tag');
        const hasCategory = category === 'all' || Array.from(tags).some(tag => tag.textContent === category);
        card.style.display = hasCategory ? 'block' : 'none';
    });
}

// Event Listeners para formularios
document.getElementById('postForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('postTitle').value;
    const content = document.getElementById('postContent').value;
    const tags = document.getElementById('postTags').value;
    
    createPost(title, content, tags);
    e.target.reset();
    toggleNewPostForm();
});

document.getElementById('resourceForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('resourceTitle').value;
    const description = document.getElementById('resourceDesc').value;
    const url = document.getElementById('resourceUrl').value;
    const category = document.getElementById('resourceCategory').value;
    const tags = document.getElementById('resourceTags').value;
    
    createResource(title, description, url, category, tags);
    e.target.reset();
    toggleNewResourceForm();
});

// Función para cargar contenido inicial
function loadContent() {
    // Cargar posts
    const posts = JSON.parse(localStorage.getItem('posts') || '[]');
    posts.forEach(post => displayPost(post));
    
    // Cargar recursos
    const resources = JSON.parse(localStorage.getItem('resources') || '[]');
    resources.forEach(resource => displayResource(resource));
}
