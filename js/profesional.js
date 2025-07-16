// Professional Content Manager - Gestión de información profesional con Firebase
import { FirebaseService } from './firebase-service.js';
import { FirebaseConnectionMonitor } from './firebase-connection-monitor.js';
import { SyncStatusIndicator } from './sync-status-indicator.js';

class ProfessionalManager {
    constructor() {
        this.firebaseService = new FirebaseService();
        this.syncIndicator = new SyncStatusIndicator();
        this.collections = {
            portfolio: 'portfolio',
            experience: 'experience',
            skills: 'skills'
        };
        this.init();
    }

    init() {
        // Inicializar monitor de conexión
        const connectionMonitor = new FirebaseConnectionMonitor();
        connectionMonitor.startMonitoring();

        // Event listeners
        this.setupEventListeners();
        
        // Cargar contenido al iniciar
        this.loadAllContent();
    }

    setupEventListeners() {
        // Portfolio form
        const portfolioForm = document.getElementById('portfolio-form');
        if (portfolioForm) {
            portfolioForm.addEventListener('submit', (e) => this.handlePortfolioSubmit(e));
        }

        // Experience form
        const experienceForm = document.getElementById('experience-form');
        if (experienceForm) {
            experienceForm.addEventListener('submit', (e) => this.handleExperienceSubmit(e));
        }

        // Skills form
        const skillsForm = document.getElementById('skills-form');
        if (skillsForm) {
            skillsForm.addEventListener('submit', (e) => this.handleSkillsSubmit(e));
        }
    }

    async handlePortfolioSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const portfolioData = {
            title: formData.get('title'),
            category: formData.get('category'),
            technologies: formData.get('technologies'),
            description: formData.get('description'),
            url: formData.get('url'),
            github: formData.get('github'),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        try {
            this.syncIndicator.show('Guardando proyecto...');
            await this.firebaseService.addDocument(this.collections.portfolio, portfolioData);
            this.syncIndicator.show('¡Proyecto guardado!', 'success');
            
            e.target.reset();
            this.loadPortfolio();
        } catch (error) {
            console.error('Error guardando proyecto:', error);
            this.syncIndicator.show('Error al guardar proyecto', 'error');
        }
    }

    async handleExperienceSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const experienceData = {
            title: formData.get('title'),
            company: formData.get('company'),
            period: formData.get('period'),
            description: formData.get('description'),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        try {
            this.syncIndicator.show('Guardando experiencia...');
            await this.firebaseService.addDocument(this.collections.experience, experienceData);
            this.syncIndicator.show('¡Experiencia guardada!', 'success');
            
            e.target.reset();
            this.loadExperience();
        } catch (error) {
            console.error('Error guardando experiencia:', error);
            this.syncIndicator.show('Error al guardar experiencia', 'error');
        }
    }

    async handleSkillsSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const skillData = {
            name: formData.get('name'),
            level: parseInt(formData.get('level')),
            category: formData.get('category'),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        try {
            this.syncIndicator.show('Guardando habilidad...');
            await this.firebaseService.addDocument(this.collections.skills, skillData);
            this.syncIndicator.show('¡Habilidad guardada!', 'success');
            
            e.target.reset();
            this.loadSkills();
        } catch (error) {
            console.error('Error guardando habilidad:', error);
            this.syncIndicator.show('Error al guardar habilidad', 'error');
        }
    }

    async loadAllContent() {
        await Promise.all([
            this.loadPortfolio(),
            this.loadExperience(),
            this.loadSkills()
        ]);
    }

    async loadPortfolio() {
        try {
            const portfolioList = document.getElementById('portfolio-list');
            if (!portfolioList) return;

            this.syncIndicator.show('Cargando portfolio...');
            const projects = await this.firebaseService.getDocuments(this.collections.portfolio);
            
            portfolioList.innerHTML = '';
            
            if (projects.length === 0) {
                portfolioList.innerHTML = '<p class="no-content">No hay proyectos guardados aún.</p>';
                this.syncIndicator.hide();
                return;
            }

            projects.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

            projects.forEach(project => {
                const projectElement = this.createProjectElement(project);
                portfolioList.appendChild(projectElement);
            });

            this.syncIndicator.hide();
        } catch (error) {
            console.error('Error cargando portfolio:', error);
            this.syncIndicator.show('Error al cargar portfolio', 'error');
        }
    }

    async loadExperience() {
        try {
            const experienceList = document.getElementById('experience-list');
            if (!experienceList) return;

            const experiences = await this.firebaseService.getDocuments(this.collections.experience);
            
            experienceList.innerHTML = '';
            
            if (experiences.length === 0) {
                experienceList.innerHTML = '<p class="no-content">No hay experiencia guardada aún.</p>';
                return;
            }

            experiences.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

            experiences.forEach(experience => {
                const experienceElement = this.createExperienceElement(experience);
                experienceList.appendChild(experienceElement);
            });
        } catch (error) {
            console.error('Error cargando experiencia:', error);
        }
    }

    async loadSkills() {
        try {
            const skillsList = document.getElementById('skills-list');
            if (!skillsList) return;

            const skills = await this.firebaseService.getDocuments(this.collections.skills);
            
            skillsList.innerHTML = '';
            
            if (skills.length === 0) {
                skillsList.innerHTML = '<p class="no-content">No hay habilidades guardadas aún.</p>';
                return;
            }

            // Agrupar por categoría
            const skillsByCategory = skills.reduce((acc, skill) => {
                if (!acc[skill.category]) {
                    acc[skill.category] = [];
                }
                acc[skill.category].push(skill);
                return acc;
            }, {});

            Object.keys(skillsByCategory).forEach(category => {
                const categoryElement = this.createSkillsCategoryElement(category, skillsByCategory[category]);
                skillsList.appendChild(categoryElement);
            });
        } catch (error) {
            console.error('Error cargando habilidades:', error);
        }
    }

    createProjectElement(project) {
        const element = document.createElement('div');
        element.className = 'project-item';
        
        const categoryIcons = {
            'web': '🌐',
            'mobile': '📱',
            'desktop': '🖥️',
            'api': '🔧',
            'tool': '🛠️',
            'other': '💻'
        };

        const categoryIcon = categoryIcons[project.category] || '💻';

        element.innerHTML = `
            <div class="project-header">
                <h5>${categoryIcon} ${project.title}</h5>
                <span class="project-category">${project.category}</span>
            </div>
            <p class="project-description">${project.description}</p>
            ${project.technologies ? `<p class="project-tech"><strong>Tecnologías:</strong> ${project.technologies}</p>` : ''}
            <div class="project-links">
                ${project.url ? `<a href="${project.url}" target="_blank" class="project-link">Ver Proyecto</a>` : ''}
                ${project.github ? `<a href="${project.github}" target="_blank" class="project-link">GitHub</a>` : ''}
            </div>
            <div class="project-actions">
                <button class="btn-edit" onclick="professionalManager.editProject('${project.id}')">Editar</button>
                <button class="btn-delete" onclick="professionalManager.deleteProject('${project.id}')">Eliminar</button>
            </div>
            <small class="project-date">Creado: ${new Date(project.createdAt).toLocaleDateString()}</small>
        `;

        return element;
    }

    createExperienceElement(experience) {
        const element = document.createElement('div');
        element.className = 'experience-item';
        
        element.innerHTML = `
            <div class="experience-header">
                <h5>💼 ${experience.title}</h5>
                <span class="experience-company">${experience.company}</span>
            </div>
            <p class="experience-period">${experience.period}</p>
            <p class="experience-description">${experience.description}</p>
            <div class="experience-actions">
                <button class="btn-edit" onclick="professionalManager.editExperience('${experience.id}')">Editar</button>
                <button class="btn-delete" onclick="professionalManager.deleteExperience('${experience.id}')">Eliminar</button>
            </div>
        `;

        return element;
    }

    createSkillsCategoryElement(category, skills) {
        const element = document.createElement('div');
        element.className = 'skills-category';
        
        const categoryIcons = {
            'frontend': '🎨',
            'backend': '⚙️',
            'database': '🗃️',
            'devops': '🚀',
            'mobile': '📱',
            'other': '🔧'
        };

        const categoryIcon = categoryIcons[category] || '🔧';

        element.innerHTML = `
            <h5>${categoryIcon} ${category.charAt(0).toUpperCase() + category.slice(1)}</h5>
            <div class="skills-grid">
                ${skills.map(skill => `
                    <div class="skill-item">
                        <span class="skill-name">${skill.name}</span>
                        <div class="skill-level">
                            ${'★'.repeat(skill.level)}${'☆'.repeat(5 - skill.level)}
                        </div>
                        <div class="skill-actions">
                            <button class="btn-edit" onclick="professionalManager.editSkill('${skill.id}')">Editar</button>
                            <button class="btn-delete" onclick="professionalManager.deleteSkill('${skill.id}')">Eliminar</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;

        return element;
    }

    async deleteProject(id) {
        if (!confirm('¿Estás seguro de que quieres eliminar este proyecto?')) {
            return;
        }

        try {
            this.syncIndicator.show('Eliminando proyecto...');
            await this.firebaseService.deleteDocument(this.collections.portfolio, id);
            this.syncIndicator.show('¡Proyecto eliminado!', 'success');
            this.loadPortfolio();
        } catch (error) {
            console.error('Error eliminando proyecto:', error);
            this.syncIndicator.show('Error al eliminar proyecto', 'error');
        }
    }

    async deleteExperience(id) {
        if (!confirm('¿Estás seguro de que quieres eliminar esta experiencia?')) {
            return;
        }

        try {
            this.syncIndicator.show('Eliminando experiencia...');
            await this.firebaseService.deleteDocument(this.collections.experience, id);
            this.syncIndicator.show('¡Experiencia eliminada!', 'success');
            this.loadExperience();
        } catch (error) {
            console.error('Error eliminando experiencia:', error);
            this.syncIndicator.show('Error al eliminar experiencia', 'error');
        }
    }

    async deleteSkill(id) {
        if (!confirm('¿Estás seguro de que quieres eliminar esta habilidad?')) {
            return;
        }

        try {
            this.syncIndicator.show('Eliminando habilidad...');
            await this.firebaseService.deleteDocument(this.collections.skills, id);
            this.syncIndicator.show('¡Habilidad eliminada!', 'success');
            this.loadSkills();
        } catch (error) {
            console.error('Error eliminando habilidad:', error);
            this.syncIndicator.show('Error al eliminar habilidad', 'error');
        }
    }

    // Métodos de edición (por implementar)
    async editProject(id) {
        console.log('Editando proyecto:', id);
        alert('Función de edición en desarrollo');
    }

    async editExperience(id) {
        console.log('Editando experiencia:', id);
        alert('Función de edición en desarrollo');
    }

    async editSkill(id) {
        console.log('Editando habilidad:', id);
        alert('Función de edición en desarrollo');
    }
}

// Inicializar el manager cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    window.professionalManager = new ProfessionalManager();
});

export { ProfessionalManager };
