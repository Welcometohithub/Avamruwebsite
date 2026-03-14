// Smooth fade animations
window.addEventListener('DOMContentLoaded', () => {
    const glassCard = document.querySelector('.glass-card');
    glassCard.style.opacity = 0;
    glassCard.style.transform = 'translateY(20px)';

    setTimeout(() => {
        glassCard.style.transition = 'opacity 1s ease, transform 1s ease';
        glassCard.style.opacity = 1;
        glassCard.style.transform = 'translateY(0)';
    }, 100);
});