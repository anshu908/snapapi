// DOM Elements
const body = document.body;
const themeToggle = document.getElementById('themeToggle');
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section');
const tabBtns = document.querySelectorAll('.tab-btn');
const downloadBtn = document.getElementById('downloadBtn');
const snapUrl = document.getElementById('snap-url');
const loadingOverlay = document.getElementById('loadingOverlay');
const resultCard = document.getElementById('resultCard');
const closeResult = document.getElementById('closeResult');
const downloadVideoBtn = document.getElementById('downloadVideoBtn');
const copyLinkBtn = document.getElementById('copyLinkBtn');
const testApiBtn = document.getElementById('testApiBtn');
const testApiUrl = document.getElementById('testApiUrl');
const apiResponse = document.getElementById('apiResponse');
const clearResponse = document.getElementById('clearResponse');
const copyEndpoint = document.getElementById('copyEndpoint');
const copyCodeBtns = document.querySelectorAll('.copy-code-btn');
const toastContainer = document.getElementById('toastContainer');

// Custom Cursor
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');

if (cursor && cursorFollower) {
    document.addEventListener('mousemove', (e) => {
        cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
        cursorFollower.style.transform = `translate(${e.clientX - 10}px, ${e.clientY - 10}px)`;
    });

    document.addEventListener('mousedown', () => {
        cursor.style.transform += ' scale(0.8)';
        cursorFollower.style.transform += ' scale(1.5)';
    });

    document.addEventListener('mouseup', () => {
        cursor.style.transform = cursor.style.transform.replace(' scale(0.8)', '');
        cursorFollower.style.transform = cursorFollower.style.transform.replace(' scale(1.5)', '');
    });
}

// Theme Toggle
themeToggle.addEventListener('click', () => {
    if (body.classList.contains('dark-theme')) {
        body.classList.remove('dark-theme');
        body.classList.add('light-theme');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        body.classList.remove('light-theme');
        body.classList.add('dark-theme');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }
});

// Mobile Menu Toggle
menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    menuToggle.innerHTML = navMenu.classList.contains('active') 
        ? '<i class="fas fa-times"></i>' 
        : '<i class="fas fa-bars"></i>';
});

// Close mobile menu when clicking a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    });
});

// Navigation Active State
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        
        const targetId = link.getAttribute('href').substring(1);
        
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        
        sections.forEach(section => {
            section.classList.remove('active');
        });
        
        document.getElementById(targetId).classList.add('active');
        
        // Smooth scroll
        document.getElementById(targetId).scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    });
});

// Tabs
tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        
        document.getElementById(`${tab}-tab`).classList.add('active');
    });
});

// Statistics Counter
const statNumbers = document.querySelectorAll('.stat-number');

const animateStats = () => {
    statNumbers.forEach(stat => {
        const target = parseFloat(stat.dataset.target);
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            current += step;
            if (current < target) {
                stat.textContent = target > 100 ? Math.floor(current).toLocaleString() : current.toFixed(1);
                requestAnimationFrame(updateCounter);
            } else {
                stat.textContent = target > 100 ? target.toLocaleString() : target.toFixed(1);
            }
        };
        
        updateCounter();
    });
};

// Trigger stats animation when home section is visible
const homeSection = document.getElementById('home');
let statsAnimated = false;

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !statsAnimated) {
            animateStats();
            statsAnimated = true;
        }
    });
}, { threshold: 0.5 });

observer.observe(homeSection);

// Download Function
downloadBtn.addEventListener('click', async () => {
    const url = snapUrl.value.trim();
    
    if (!url) {
        showToast('Please enter a Snapchat URL', 'error');
        return;
    }
    
    if (!url.includes('snapchat.com')) {
        showToast('Please enter a valid Snapchat URL', 'error');
        return;
    }
    
    // Show loading
    loadingOverlay.style.display = 'flex';
    
    try {
        const response = await fetch(`/.netlify/functions/snap-down?url=${encodeURIComponent(url)}`);
        const data = await response.json();
        
        setTimeout(() => {
            loadingOverlay.style.display = 'none';
            
            if (data.success) {
                // Update result card
                document.getElementById('videoThumbnail').src = data.thumbnail;
                document.getElementById('videoTitle').textContent = data.title;
                document.getElementById('videoDuration').textContent = data.duration;
                downloadVideoBtn.href = data.videoUrl;
                
                resultCard.classList.add('show');
                resultCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                
                showToast('Video processed successfully!', 'success');
            } else {
                showToast(data.error || 'Failed to process video', 'error');
            }
        }, 2000);
        
    } catch (error) {
        loadingOverlay.style.display = 'none';
        showToast('Network error. Please try again.', 'error');
    }
});

// Close Result
closeResult.addEventListener('click', () => {
    resultCard.classList.remove('show');
});

// Copy Video Link
copyLinkBtn.addEventListener('click', () => {
    const videoUrl = downloadVideoBtn.href;
    navigator.clipboard.writeText(videoUrl);
    showToast('Video link copied to clipboard!', 'success');
});

// API Testing
testApiBtn.addEventListener('click', async () => {
    const url = testApiUrl.value.trim();
    
    if (!url) {
        showToast('Please enter a URL', 'error');
        return;
    }
    
    apiResponse.classList.add('show');
    const responseBody = apiResponse.querySelector('.response-body');
    responseBody.textContent = 'Testing API...';
    
    try {
        const response = await fetch(`/.netlify/functions/snap-down?url=${encodeURIComponent(url)}`);
        const data = await response.json();
        
        responseBody.textContent = JSON.stringify(data, null, 2);
    } catch (error) {
        responseBody.textContent = JSON.stringify({
            success: false,
            error: error.message
        }, null, 2);
    }
});

// Clear API Response
clearResponse.addEventListener('click', () => {
    apiResponse.classList.remove('show');
    testApiUrl.value = '';
});

// Copy Endpoint
copyEndpoint.addEventListener('click', () => {
    const endpoint = '/.netlify/functions/snap-down?url=';
    navigator.clipboard.writeText(endpoint);
    showToast('Endpoint copied to clipboard!', 'success');
});

// Copy Code Blocks
copyCodeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const code = btn.previousElementSibling.textContent;
        navigator.clipboard.writeText(code);
        
        btn.innerHTML = '<i class="fas fa-check"></i>';
        setTimeout(() => {
            btn.innerHTML = '<i class="fas fa-copy"></i>';
        }, 2000);
        
        showToast('Code copied to clipboard!', 'success');
    });
});

// Toast Notification System
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let icon = 'fa-info-circle';
    if (type === 'success') icon = 'fa-check-circle';
    if (type === 'error') icon = 'fa-exclamation-circle';
    
    toast.innerHTML = `
        <i class="fas ${icon}"></i>
        <span>${message}</span>
    `;
    
    toastContainer.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Navbar Scroll Effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Enter Key Support
snapUrl.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        downloadBtn.click();
    }
});

testApiUrl.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        testApiBtn.click();
    }
});

// Input Animations
const inputs = document.querySelectorAll('.glass-input');
inputs.forEach(input => {
    input.addEventListener('focus', () => {
        input.parentElement.style.transform = 'scale(1.02)';
    });
    
    input.addEventListener('blur', () => {
        input.parentElement.style.transform = 'scale(1)';
    });
});

// Particles Background
function createParticles() {
    const particlesContainer = document.querySelector('.particles');
    if (!particlesContainer) return;
    
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 3}px;
            height: ${Math.random() * 3}px;
            background: rgba(255, 255, 255, ${Math.random() * 0.3});
            border-radius: 50%;
            top: ${Math.random() * 100}%;
            left: ${Math.random() * 100}%;
            animation: floatParticle ${5 + Math.random() * 10}s linear infinite;
        `;
        particlesContainer.appendChild(particle);
    }
}

// Particle Animation Keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes floatParticle {
        from {
            transform: translate(0, 0);
        }
        to {
            transform: translate(${Math.random() * 200 - 100}px, ${Math.random() * 200 - 100}px);
        }
    }
`;
document.head.appendChild(style);

createParticles();

// Lazy Loading Images
const images = document.querySelectorAll('img[data-src]');
const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.add('loaded');
            imageObserver.unobserve(img);
        }
    });
});

images.forEach(img => imageObserver.observe(img));

// Parallax Effect
document.addEventListener('mousemove', (e) => {
    const orbs = document.querySelectorAll('.gradient-orb');
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    
    orbs.forEach((orb, index) => {
        const speed = (index + 1) * 20;
        orb.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
    });
});

// Scroll to Top Button (Optional)
const scrollTopBtn = document.createElement('button');
scrollTopBtn.className = 'scroll-top';
scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
scrollTopBtn.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    background: linear-gradient(135deg, var(--primary), var(--secondary));
    border: none;
    border-radius: 50%;
    color: var(--dark);
    font-size: 1.2rem;
    cursor: pointer;
    display: none;
    align-items: center;
    justify-content: center;
    z-index: 100;
    transition: var(--transition);
    box-shadow: 0 5px 20px rgba(255, 215, 0, 0.3);
`;

document.body.appendChild(scrollTopBtn);

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
        scrollTopBtn.style.display = 'flex';
    } else {
        scrollTopBtn.style.display = 'none';
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        body.className = savedTheme;
        themeToggle.innerHTML = savedTheme === 'dark-theme' 
            ? '<i class="fas fa-moon"></i>' 
            : '<i class="fas fa-sun"></i>';
    }
    
    // Save theme preference
    themeToggle.addEventListener('click', () => {
        localStorage.setItem('theme', body.className);
    });
});
