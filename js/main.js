// Theme Toggle
const themeToggle = document.querySelector('.theme-toggle');
const body = document.body;

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

// Navigation
const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('.nav-menu a');

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Remove active class from all links
        navLinks.forEach(l => l.classList.remove('active'));
        
        // Add active class to clicked link
        link.classList.add('active');
        
        // Get target section
        const targetId = link.getAttribute('href').substring(1);
        
        // Hide all sections
        sections.forEach(section => {
            section.classList.remove('active');
        });
        
        // Show target section
        document.getElementById(targetId).classList.add('active');
    });
});

// Statistics Counter Animation
const statNumbers = document.querySelectorAll('.stat-number');

const animateStats = () => {
    statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        const increment = target / 50; // Divide animation into 50 steps
        let current = 0;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                stat.textContent = Math.ceil(current);
                requestAnimationFrame(updateCounter);
            } else {
                stat.textContent = target;
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

// Download Functionality
const downloadBtn = document.getElementById('download-btn');
const snapUrl = document.getElementById('snap-url');
const loading = document.getElementById('loading');
const result = document.getElementById('result');
const downloadLink = document.getElementById('download-link');

downloadBtn.addEventListener('click', async () => {
    const url = snapUrl.value.trim();
    
    if (!url) {
        showNotification('Please enter a Snapchat URL', 'error');
        return;
    }
    
    if (!url.includes('snapchat.com')) {
        showNotification('Please enter a valid Snapchat URL', 'error');
        return;
    }
    
    // Show loading
    loading.style.display = 'flex';
    result.classList.remove('show');
    
    try {
        const response = await fetch(`/api/snap-down?url=${encodeURIComponent(url)}`);
        const data = await response.json();
        
        if (data.success) {
            // Hide loading
            loading.style.display = 'none';
            
            // Show result
            downloadLink.href = data.videoUrl;
            result.classList.add('show');
            
            showNotification('Video processed successfully!', 'success');
        } else {
            throw new Error(data.error || 'Failed to process video');
        }
    } catch (error) {
        loading.style.display = 'none';
        showNotification(error.message, 'error');
    }
});

// API Tester
const testApiBtn = document.getElementById('test-api');
const apiUrl = document.getElementById('api-url');
const apiResponse = document.getElementById('api-response');

testApiBtn.addEventListener('click', async () => {
    const url = apiUrl.value.trim();
    
    if (!url) {
        apiResponse.innerHTML = '<span style="color: #ff5e62;">Please enter a URL</span>';
        apiResponse.classList.add('show');
        return;
    }
    
    apiResponse.innerHTML = 'Testing API...';
    apiResponse.classList.add('show');
    
    try {
        const response = await fetch(`/api/snap-down?url=${encodeURIComponent(url)}`);
        const data = await response.json();
        
        apiResponse.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
    } catch (error) {
        apiResponse.innerHTML = `<span style="color: #ff5e62;">Error: ${error.message}</span>`;
    }
});

// Copy Code Button
const copyBtn = document.querySelector('.copy-btn');
copyBtn.addEventListener('click', () => {
    const code = document.querySelector('.code-block pre').textContent;
    navigator.clipboard.writeText(code);
    
    // Show feedback
    copyBtn.innerHTML = '<i class="fas fa-check"></i>';
    setTimeout(() => {
        copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
    }, 2000);
});

// Notification System
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Add notification styles
const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 2rem;
        background: var(--card-bg-dark);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 10px;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        z-index: 3000;
        backdrop-filter: blur(10px);
    }
    
    .notification.show {
        transform: translateX(0);
    }
    
    .notification.success i {
        color: #4CAF50;
    }
    
    .notification.error i {
        color: #ff5e62;
    }
    
    .light-theme .notification {
        background: var(--light-bg);
        border: 1px solid rgba(0, 0, 0, 0.1);
    }
`;

document.head.appendChild(style);

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Input animation
snapUrl.addEventListener('focus', () => {
    snapUrl.parentElement.style.transform = 'scale(1.02)';
});

snapUrl.addEventListener('blur', () => {
    snapUrl.parentElement.style.transform = 'scale(1)';
});

// Enter key support
snapUrl.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        downloadBtn.click();
    }
});

// Auto-hide loading if takes too long
setTimeout(() => {
    if (loading.style.display === 'flex') {
        loading.style.display = 'none';
        showNotification('Request timed out. Please try again.', 'error');
    }
}, 30000);

// Parallax effect for background
document.addEventListener('mousemove', (e) => {
    const spheres = document.querySelectorAll('.gradient-sphere, .gradient-sphere-2');
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    
    spheres.forEach((sphere, index) => {
        const speed = index === 0 ? 20 : 40;
        sphere.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
    });
});

// Lazy load sections
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.section').forEach(section => {
    sectionObserver.observe(section);
});