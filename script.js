// Terminal Animation Sequencer

const frames = [
    { id: 'frame-index', duration: 3000, type: 'typing' },
    { id: 'frame-index-done', duration: 3000, type: 'running' },
    { id: 'frame-index-complete', duration: 2500, type: 'results' },
    { id: 'frame-find', duration: 2800, type: 'typing' },
    { id: 'frame-find-done', duration: 4500, type: 'results' },
    { id: 'frame-query-search', duration: 2500, type: 'typing' },
    { id: 'frame-query-search-done', duration: 4500, type: 'results' },
    { id: 'frame-query-context', duration: 3000, type: 'typing' },
    { id: 'frame-query-context-done', duration: 4500, type: 'results' },
    { id: 'frame-query-deps', duration: 3200, type: 'typing' },
    { id: 'frame-query-deps-done', duration: 4500, type: 'results' },
    { id: 'frame-impact', duration: 2800, type: 'typing' },
    { id: 'frame-impact-done', duration: 5000, type: 'results' },
    { id: 'frame-stats', duration: 1800, type: 'typing' },
    { id: 'frame-stats-done', duration: 5500, type: 'results' }
];

let currentFrame = 0;
let typingInterval = null;

function showFrame(index) {
    // Clear any existing typing animation
    if (typingInterval) {
        clearInterval(typingInterval);
        typingInterval = null;
    }
    
    const frame = frames[index];
    const frameElement = document.getElementById(frame.id);
    const terminal = document.querySelector('.terminal');
    
    // Add glitch effect to terminal on frame transition
    if (terminal) {
        terminal.classList.add('glitch');
        setTimeout(() => terminal.classList.remove('glitch'), 200);
    }
    
    // Hide all frames
    document.querySelectorAll('.terminal-frame').forEach(f => {
        f.classList.remove('active');
        f.classList.add('fade-out');
    });
    
    // Show current frame
    if (frameElement) {
        frameElement.classList.remove('fade-out');
        frameElement.classList.add('active');
        
        // Handle typing animation
        if (frame.type === 'typing') {
            const typingTarget = frameElement.querySelector('.typing-target');
            if (typingTarget) {
                const fullCmd = typingTarget.getAttribute('data-cmd');
                // Clear and start typing
                typingTarget.textContent = '';
                runTypingAnimation(typingTarget, fullCmd);
            }
        }
    }
    
    // Animate progress bar if this is the index running frame
    if (frame.id === 'frame-index-done') {
        setTimeout(animateProgressBar, 300);
    }
}

function runTypingAnimation(element, text) {
    let index = 0;
    const speed = 40;
    
    function typeChar() {
        if (index < text.length) {
            element.textContent = text.substring(0, index + 1);
            index++;
            typingInterval = setTimeout(typeChar, speed + Math.random() * 30);
        }
    }
    
    typeChar();
}

function animateProgressBar() {
    const progressFill = document.getElementById('index-progress');
    const progressText = document.getElementById('index-progress-text');
    
    if (progressFill && progressText) {
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 15 + 5;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
            }
            progressFill.style.width = progress + '%';
            progressText.textContent = Math.floor(progress) + '%';
        }, 100);
    }
}

function nextFrame() {
    currentFrame = (currentFrame + 1) % frames.length;
    showFrame(currentFrame);
    
    // Schedule next frame
    setTimeout(nextFrame, frames[currentFrame].duration);
}

// Start animation when page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('Terminal animation starting...');
    
    // Initial delay before starting
    setTimeout(() => {
        showFrame(currentFrame);
        setTimeout(nextFrame, frames[currentFrame].duration);
    }, 800);
    
    // Start mini terminal animations (split screen)
    startMiniTerminals();
});

// Mini Terminal Animations for Split Screen
const grepFrames = [
    { id: 'frame-grep-1', duration: 2000, type: 'typing' },
    { id: 'frame-grep-2', duration: 2500, type: 'results' },
    { id: 'frame-grep-3', duration: 2000, type: 'typing' },
    { id: 'frame-grep-4', duration: 2500, type: 'results' }
];

const srcnavFrames = [
    { id: 'frame-srcnav-1', duration: 2000, type: 'typing' },
    { id: 'frame-srcnav-2', duration: 2500, type: 'results' },
    { id: 'frame-srcnav-3', duration: 2000, type: 'typing' },
    { id: 'frame-srcnav-4', duration: 2500, type: 'results' }
];

let grepFrame = 0;
let srcnavFrame = 0;
let miniTypingInterval = null;

function showMiniFrame(frames, current, frameClass) {
    // Clear any existing typing
    if (miniTypingInterval) {
        clearTimeout(miniTypingInterval);
        miniTypingInterval = null;
    }
    
    const frame = frames[current];
    const frameElement = document.getElementById(frame.id);
    
    // Hide all frames in this group
    document.querySelectorAll('.' + frameClass).forEach(f => {
        f.classList.remove('active');
    });
    
    // Show current frame
    if (frameElement) {
        frameElement.classList.add('active');
        
        // Handle typing
        if (frame.type === 'typing') {
            const typingTarget = frameElement.querySelector('.typing-' + (frameClass === 'frame-mini-grep' ? 'grep' : 'srcnav'));
            if (typingTarget) {
                const fullCmd = typingTarget.getAttribute('data-cmd');
                typingTarget.textContent = '';
                runMiniTyping(typingTarget, fullCmd, frameClass);
            }
        }
    }
}

function runMiniTyping(element, text, frameClass) {
    let index = 0;
    const speed = 30;
    
    function typeChar() {
        if (index < text.length) {
            element.textContent = text.substring(0, index + 1);
            index++;
            miniTypingInterval = setTimeout(typeChar, speed + Math.random() * 20);
        }
    }
    
    typeChar();
}

function startMiniTerminals() {
    // Start grep terminal
    showMiniFrame(grepFrames, grepFrame, 'frame-mini-grep');
    setTimeout(() => {
        function nextGrepFrame() {
            grepFrame = (grepFrame + 1) % grepFrames.length;
            showMiniFrame(grepFrames, grepFrame, 'frame-mini-grep');
            setTimeout(nextGrepFrame, grepFrames[grepFrame].duration);
        }
        setTimeout(nextGrepFrame, grepFrames[grepFrame].duration);
    }, 500);
    
    // Start srcnav terminal (slightly delayed)
    setTimeout(() => {
        showMiniFrame(srcnavFrames, srcnavFrame, 'frame-mini-srcnav');
        function nextSrcnavFrame() {
            srcnavFrame = (srcnavFrame + 1) % srcnavFrames.length;
            showMiniFrame(srcnavFrames, srcnavFrame, 'frame-mini-srcnav');
            setTimeout(nextSrcnavFrame, srcnavFrames[srcnavFrame].duration);
        }
        setTimeout(nextSrcnavFrame, srcnavFrames[srcnavFrame].duration);
    }, 800);
}
