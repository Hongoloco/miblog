// Sistema de autenticación simple
const Auth = {
  // Credenciales (en producción deberían estar en el servidor)
  credentials: {
    username: 'alito',
    password: 'vinilo28'
  },

  // Verificar si el usuario está autenticado
  isAuthenticated: function() {
    return sessionStorage.getItem('blog_authenticated') === 'true';
  },

  // Función de login
  login: function(username, password) {
    if (username === this.credentials.username && password === this.credentials.password) {
      sessionStorage.setItem('blog_authenticated', 'true');
      return true;
    }
    return false;
  },

  // Función de logout
  logout: function() {
    sessionStorage.removeItem('blog_authenticated');
  },

  // Mostrar modal de login
  showLoginModal: function(callback = null) {
    const modal = document.createElement('div');
    modal.className = 'auth-modal';
    modal.innerHTML = `
      <div class="auth-modal-content">
        <h3>Acceso Requerido</h3>
        <p>Para acceder a esta funcionalidad necesitas iniciar sesión</p>
        <form id="login-form">
          <div class="form-group">
            <label for="username">Usuario:</label>
            <input type="text" id="username" name="username" required>
          </div>
          <div class="form-group">
            <label for="password">Contraseña:</label>
            <input type="password" id="password" name="password" required>
          </div>
          <div class="auth-buttons">
            <button type="submit" class="btn-primary">Iniciar Sesión</button>
            <button type="button" class="btn-secondary" onclick="Auth.closeLoginModal()">Cancelar</button>
          </div>
        </form>
        <div id="login-error" class="login-error" style="display: none;"></div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Manejar envío del formulario
    document.getElementById('login-form').addEventListener('submit', function(e) {
      e.preventDefault();
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
      
      if (Auth.login(username, password)) {
        Auth.closeLoginModal();
        showNotification('¡Sesión iniciada correctamente!');
        Auth.updateAuthUI();
        
        // Ejecutar callback si existe
        if (callback && typeof callback === 'function') {
          callback();
        }
      } else {
        document.getElementById('login-error').style.display = 'block';
        document.getElementById('login-error').textContent = 'Usuario o contraseña incorrectos';
      }
    });
    
    // Cerrar modal con ESC
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        Auth.closeLoginModal();
      }
    });
    
    // Enfocar el campo de usuario
    document.getElementById('username').focus();
  },

  // Cerrar modal de login
  closeLoginModal: function() {
    const modal = document.querySelector('.auth-modal');
    if (modal) {
      modal.remove();
    }
  },

  // Actualizar interfaz de autenticación
  updateAuthUI: function() {
    const isAuth = this.isAuthenticated();
    
    // Mostrar/ocultar sección de administrador
    const adminSection = document.getElementById('admin-section');
    if (adminSection) {
      adminSection.style.display = isAuth ? 'block' : 'none';
    }
    
    // Mostrar/ocultar botones de auth
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    
    if (loginBtn) loginBtn.style.display = isAuth ? 'none' : 'inline-block';
    if (logoutBtn) logoutBtn.style.display = isAuth ? 'inline-block' : 'none';
    
    // Mostrar/ocultar formularios
    const protectedForms = document.querySelectorAll('.protected-form');
    protectedForms.forEach(form => {
      form.style.display = isAuth ? 'block' : 'none';
    });
    
    // Mostrar mensaje de acceso requerido
    const authRequiredMessages = document.querySelectorAll('.auth-required-message');
    authRequiredMessages.forEach(msg => {
      msg.style.display = isAuth ? 'none' : 'block';
    });
  },

  // Verificar acceso antes de ejecutar acción
  requireAuth: function(action) {
    if (this.isAuthenticated()) {
      action();
    } else {
      this.showLoginModal(action);
    }
  },

  // Inicializar autenticación en la página
  init: function() {
    this.updateAuthUI();
    
    // Verificar si es página del blog y pedir autenticación
    if (window.location.pathname.includes('blog.html')) {
      if (!this.isAuthenticated()) {
        setTimeout(() => {
          this.showLoginModal();
        }, 500);
      }
    }

    // Agregar controles de autenticación
    this.addAuthControls();
  },

  // Agregar controles de autenticación
  addAuthControls: function() {
    const main = document.querySelector('main');
    if (main && !document.querySelector('.auth-controls')) {
      const authControls = document.createElement('div');
      authControls.className = 'auth-controls';
      authControls.innerHTML = `
        <button id="login-btn" class="btn-secondary" onclick="Auth.showLoginModal()" style="display: ${this.isAuthenticated() ? 'none' : 'inline-block'};">
          Iniciar Sesión
        </button>
        <button id="logout-btn" class="btn-secondary" onclick="Auth.handleLogout()" style="display: ${this.isAuthenticated() ? 'inline-block' : 'none'};">
          Cerrar Sesión
        </button>
      `;
      
      main.insertBefore(authControls, main.firstChild);
    }
  },

  // Manejar logout
  handleLogout: function() {
    this.logout();
    this.updateAuthUI();
    showNotification('Sesión cerrada');
    
    // Redirigir a inicio si está en página del blog
    if (window.location.pathname.includes('blog.html')) {
      window.location.href = 'index.html';
    }
  }
};
