// Plus besoin d'importer Three.js car il est chargé globalement
// import * as THREE from 'three';

let scene, camera, renderer, particles;
let mouseX = 0, mouseY = 0;
const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;

// Fonction pour créer une texture d'étoile
function createStarTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    
    // Fond transparent
    ctx.fillStyle = 'rgba(0,0,0,0)';
    ctx.fillRect(0, 0, 32, 32);
    
    // Dessiner une étoile
    ctx.beginPath();
    ctx.fillStyle = '#ffffff';
    
    // Dessiner une étoile à 5 branches
    const centerX = 16;
    const centerY = 16;
    const outerRadius = 14;
    const innerRadius = 6;
    const spikes = 5;
    
    let rot = Math.PI / 2 * 3;
    let step = Math.PI / spikes;
    
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - outerRadius);
    
    for (let i = 0; i < spikes; i++) {
        let x = centerX + Math.cos(rot) * outerRadius;
        let y = centerY + Math.sin(rot) * outerRadius;
        ctx.lineTo(x, y);
        rot += step;
        
        x = centerX + Math.cos(rot) * innerRadius;
        y = centerY + Math.sin(rot) * innerRadius;
        ctx.lineTo(x, y);
        rot += step;
    }
    
    ctx.lineTo(centerX, centerY - outerRadius);
    ctx.closePath();
    ctx.fill();
    
    // Ajouter un halo lumineux
    const gradient = ctx.createRadialGradient(
        centerX, centerY, 0, 
        centerX, centerY, outerRadius
    );
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.6)');
    gradient.addColorStop(0.6, 'rgba(255, 255, 255, 0.2)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    
    ctx.globalCompositeOperation = 'lighten';
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, outerRadius, 0, Math.PI * 2);
    ctx.fill();
    
    return new THREE.CanvasTexture(canvas);
}

function initThreeJS() {
    const container = document.getElementById('three-bg');
    if (!container) {
        console.error("Impossible de trouver l'élément #three-bg");
        return;
    }

    // Scene
    scene = new THREE.Scene();

    // Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 2000);
    camera.position.z = 500;

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Particules
    const particleCount = 8000;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    const colorPrimary = new THREE.Color(getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim());
    const colorSecondary = new THREE.Color(getComputedStyle(document.documentElement).getPropertyValue('--secondary-color').trim());

    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        // Position aléatoire dans un cube
        positions[i3] = Math.random() * 2000 - 1000; // x
        positions[i3 + 1] = Math.random() * 2000 - 1000; // y
        positions[i3 + 2] = Math.random() * 2000 - 1000; // z

        // Couleur aléatoire entre primaire et secondaire
        const mixedColor = Math.random() > 0.5 ? colorPrimary.clone() : colorSecondary.clone();
        // Variation légère de la couleur
        mixedColor.lerp(new THREE.Color(0xffffff), Math.random() * 0.3);

        colors[i3] = mixedColor.r;
        colors[i3 + 1] = mixedColor.g;
        colors[i3 + 2] = mixedColor.b;
        
        // Tailles variables pour les étoiles
        sizes[i] = Math.random() * 4 + 1;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    // Créer une texture d'étoile
    const starTexture = createStarTexture();

    const material = new THREE.PointsMaterial({
        size: 4,
        sizeAttenuation: true, // Étoiles plus petites au loin
        vertexColors: true,
        map: starTexture, // Appliquer la texture d'étoile
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending, // Pour un effet lumineux
        depthWrite: false // Pour éviter les problèmes de profondeur
    });

    particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Écouteurs d'événements
    document.addEventListener('mousemove', onDocumentMouseMove, false);
    window.addEventListener('resize', onWindowResize, false);

    // Lancer l'animation
    animate();
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onDocumentMouseMove(event) {
    mouseX = (event.clientX - windowHalfX) / 5; // Diviser pour réduire l'amplitude
    mouseY = (event.clientY - windowHalfY) / 5;
}

function animate() {
    requestAnimationFrame(animate);
    render();
}

function render() {
    const time = Date.now() * 0.00005; // Vitesse de rotation/mouvement plus lente

     // Rotation lente des particules
     if(particles) {
         particles.rotation.x += 0.0001;
         particles.rotation.y += 0.0002;
     }

    // Mouvement de la caméra basé sur la souris (effet parallaxe)
     camera.position.x += (mouseX - camera.position.x) * 0.02; // Smoothing
     camera.position.y += (-mouseY - camera.position.y) * 0.02; // Inverser Y
     camera.lookAt(scene.position); // Toujours regarder vers le centre

    renderer.render(scene, camera);
}

// Initialisation après chargement complet du DOM
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initialisation de Three.js...');
    setTimeout(() => {
        try {
            initThreeJS();
        } catch (error) {
            console.error("Erreur lors de l'initialisation de Three.js:", error);
            console.error(error.stack); // Afficher la pile d'erreur pour débogage
            const threeContainer = document.getElementById('three-bg');
            if (threeContainer) threeContainer.style.display = 'none';
        }
    }, 500); // Augmenter le délai pour être sûr que Three.js est bien chargé
});

// Expose au window pour le débogage
window.initThreeBackground = initThreeJS;
