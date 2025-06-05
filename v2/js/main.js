// Fonction pour afficher la notification pour les projets non disponibles
function showNotification() {
    var notification = document.getElementById('notification');
    notification.style.display = 'block';
    setTimeout(function() {
        notification.style.display = 'none';
    }, 3000); // Affiche la notification pendant 3 secondes
}

// Exposer la fonction au niveau global pour être accessible depuis l'HTML
window.showNotification = showNotification;

// --- Mise à jour de l'année dans le footer ---
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('year').textContent = new Date().getFullYear();

    // --- Dark Mode Toggle ---
    const themeToggle = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme');

    // Appliquer le thème au chargement initial
    if (currentTheme === 'dark' || (!currentTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.body.classList.add('dark-mode');
    }

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        let theme = 'light';
        if (document.body.classList.contains('dark-mode')) {
            theme = 'dark';
        }
        localStorage.setItem('theme', theme);
    });

    // --- Skills Filter ---
    const filterButtons = document.querySelectorAll('.filter-btn');
    const skillCards = document.querySelectorAll('.skill-card');

    // Filtrer les compétences
    function filterSkills(category) {
        skillCards.forEach(card => {
            if (category === 'all' || card.dataset.category === category) {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        });
    }

    // Ajouter les event listeners aux boutons de filtre
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Supprimer la classe active de tous les boutons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Ajouter la classe active au bouton cliqué
            button.classList.add('active');
            
            // Appliquer le filtre
            const filterValue = button.getAttribute('data-filter');
            filterSkills(filterValue);
        });
    });

    // --- Scroll Animations (Intersection Observer) ---
    const revealElements = document.querySelectorAll('.reveal');
    const observerOptions = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.1 // Déclencher quand 10% de l'élément est visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optionnel: arrêter d'observer une fois l'animation faite
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(el => {
        observer.observe(el);
    });

    // --- Navigation Active au Scroll ---
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]'); // Sections avec un ID

    function changeActiveLink() {
        let index = sections.length;

        while(--index && window.scrollY + 100 < sections[index].offsetTop) {} // 100px offset for header height

        navLinks.forEach((link) => link.classList.remove('current'));
        // Check if a section is found and corresponding link exists
        if (index >= 0 && navLinks[index]) {
            // Handle case where first link is 'Accueil' pointing to #home
            const targetId = sections[index].getAttribute('id');
            const activeLink = document.querySelector(`.nav-link a[href="#${targetId}"]`);
            if (activeLink) {
                activeLink.parentElement.classList.add('current');
            } else if (targetId === 'home' && navLinks[0]) { // Special case for #home
                navLinks[0].classList.add('current');
            }
        } else if (window.scrollY < 200 && navLinks[0]) { // If at the very top, activate 'Accueil'
            navLinks[0].classList.add('current');
        }
    }

    // Initial check
    changeActiveLink();
    window.addEventListener('scroll', changeActiveLink);
});
