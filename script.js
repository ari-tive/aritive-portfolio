// --- Initialize Theme ---
if (localStorage.getItem('theme') === 'dark') {
    document.documentElement.classList.add('dark');
} else {
    document.documentElement.classList.remove('dark');
}

document.addEventListener("DOMContentLoaded", () => {
    // Set initial icon based on theme
    const icon = document.getElementById('theme-icon');
    if (icon) {
        if (document.documentElement.classList.contains('dark')) {
            icon.innerText = 'light_mode';
        } else {
            icon.innerText = 'dark_mode';
        }
    }

    // Typewriter effect (Only runs if element exists, i.e., index.html)
    const textElement = document.getElementById("typewriter-text");
    if (textElement) {
        const phrases = [
            "Designing clean digital experiences.",
            "Front-end webmaster.",
            "Crafting the future.",
            "Developing the next generation of web.",
            "Turning concepts into code."
        ];
        let currentLine = 0;
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+-=[]{}|;:',.<>?/";

        async function typeWriter(text) {
            let result = "";
            for (let i = 0; i < text.length; i++) {
                let iterations = 2;
                for (let j = 0; j < iterations; j++) {
                    let randomChar = characters[Math.floor(Math.random() * characters.length)];
                    textElement.innerHTML = result + `<span class="opacity-50">${randomChar}</span><span class="animate-pulse">_</span>`;
                    await new Promise(r => setTimeout(r, 20));
                }
                result += text[i];
                textElement.innerHTML = result + '<span class="animate-pulse">_</span>';
                await new Promise(r => setTimeout(r, 40));
            }
            await new Promise(r => setTimeout(r, 2000));

            for (let i = text.length; i >= 0; i--) {
                textElement.innerHTML = text.substring(0, i) + '<span class="animate-pulse">_</span>';
                await new Promise(r => setTimeout(r, 15));
            }
            await new Promise(r => setTimeout(r, 300));

            currentLine = (currentLine + 1) % phrases.length;
            typeWriter(phrases[currentLine]);
        }
        
        typeWriter(phrases[currentLine]);
    }

    // Greeting Word Cycle Animation
    const greetingEl = document.getElementById('greeting-text');
    if (greetingEl) {
        const greetings = ['HELLO', 'HOLA', 'こんにちは', 'привет', '你好'];
        let greetingIndex = 0;
        const scrambleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*';

        async function animateGreeting() {
            while (true) {
                const currentWord = greetings[greetingIndex];
                
                // Display current word for a while
                await new Promise(r => setTimeout(r, 2500));
                
                // Delete animation (erase character by character)
                for (let i = currentWord.length; i >= 0; i--) {
                    greetingEl.textContent = currentWord.substring(0, i);
                    await new Promise(r => setTimeout(r, 60));
                }
                
                await new Promise(r => setTimeout(r, 300));
                
                // Move to next greeting
                greetingIndex = (greetingIndex + 1) % greetings.length;
                const nextWord = greetings[greetingIndex];
                
                // Type animation (type character by character with scramble)
                let result = '';
                for (let i = 0; i < nextWord.length; i++) {
                    // Show a random character briefly
                    let randomChar = scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
                    greetingEl.textContent = result + randomChar;
                    await new Promise(r => setTimeout(r, 40));
                    // Then show the actual character
                    result += nextWord[i];
                    greetingEl.textContent = result;
                    await new Promise(r => setTimeout(r, 80));
                }
            }
        }
        
        animateGreeting();
    }

    // Navbar Auto-Hide Logic
    const nav = document.getElementById('main-nav');
    if (nav) {
        let lastScrollY = window.scrollY;
        
        window.addEventListener('scroll', () => {
            if (window.scrollY > lastScrollY && window.scrollY > 100) {
                // Scrolling down & past top -> hide
                nav.style.transform = 'translateY(-100%)';
            } else {
                // Scrolling up -> show
                nav.style.transform = 'translateY(0)';
            }
            lastScrollY = window.scrollY;
        });

        // Show when cursor moves to the top 100px area
        document.addEventListener('mousemove', (e) => {
            if (e.clientY <= 100) {
                nav.style.transform = 'translateY(0)';
            }
        });
    }
});

// --- Functions attached to window/global scope for inline onclick handlers ---

window.toggleTheme = function() {
    const html = document.documentElement;
    const icon = document.getElementById('theme-icon');
    
    if (html.classList.contains('dark')) {
        html.classList.remove('dark');
        if (icon) icon.innerText = 'dark_mode';
        localStorage.setItem('theme', 'light');
    } else {
        html.classList.add('dark');
        if (icon) icon.innerText = 'light_mode';
        localStorage.setItem('theme', 'dark');
    }
};

window.closePfpModal = function() {
    const modalContent = document.getElementById('pfp-modal-content');
    if (!modalContent) return;
    modalContent.classList.remove('scale-100', 'opacity-100');
    modalContent.classList.add('scale-95', 'opacity-0');
    setTimeout(() => {
        const modal = document.getElementById('pfp-modal');
        if (modal) modal.classList.add('hidden');
    }, 300);
};

window.openContactModal = function(title, subtitle, info, actionType, actionTarget) {
    document.getElementById('modal-title').innerText = title;
    document.getElementById('modal-subtitle').innerText = subtitle;
    document.getElementById('modal-info').innerText = info;
    
    const actionBtn = document.getElementById('modal-link');
    const btnText = document.getElementById('modal-btn-text');
    const btnIcon = document.getElementById('modal-btn-icon');
    
    // Clear any old event listeners by cloning
    const newBtn = actionBtn.cloneNode(true);
    actionBtn.parentNode.replaceChild(newBtn, actionBtn);
    
    if (actionType === 'copy') {
        newBtn.href = "#";
        newBtn.removeAttribute("target");
        newBtn.querySelector('#modal-btn-text').innerText = "Copy " + title;
        newBtn.querySelector('#modal-btn-icon').innerText = "content_copy";
        
        newBtn.addEventListener('click', (e) => {
            e.preventDefault();
            navigator.clipboard.writeText(actionTarget).then(() => {
                const originalText = newBtn.querySelector('#modal-btn-text').innerText;
                newBtn.querySelector('#modal-btn-text').innerText = "Copied!";
                newBtn.querySelector('#modal-btn-icon').innerText = "check";
                setTimeout(() => {
                    newBtn.querySelector('#modal-btn-text').innerText = originalText;
                    newBtn.querySelector('#modal-btn-icon').innerText = "content_copy";
                }, 2000);
            });
        });
    } else if (actionType === 'link') {
        newBtn.href = actionTarget;
        newBtn.target = "_blank";
        newBtn.querySelector('#modal-btn-text').innerText = "Open Map";
        newBtn.querySelector('#modal-btn-icon').innerText = "map";
    }
    
    const modal = document.getElementById('contact-modal');
    const content = document.getElementById('contact-modal-content');
    
    modal.classList.remove('hidden');
    setTimeout(() => {
        content.classList.remove('scale-95', 'opacity-0');
    }, 10);
};

window.closeContactModal = function() {
    const content = document.getElementById('contact-modal-content');
    if (!content) return;
    content.classList.add('scale-95', 'opacity-0');
    setTimeout(() => {
        const modal = document.getElementById('contact-modal');
        if (modal) modal.classList.add('hidden');
    }, 300);
};

window.scrollToCards = function() {
    const cardsSection = document.getElementById('contact-cards');
    if (!cardsSection) return;
    cardsSection.scrollIntoView({ behavior: 'smooth' });
    
    // Flash the discord card
    setTimeout(() => {
        const discordCard = document.getElementById('discord-card');
        if (discordCard) {
            discordCard.classList.add('bg-primary/20', 'scale-105', 'shadow-[8px_8px_0px_0px_#00a8a8]', '-translate-y-2');
            setTimeout(() => {
                discordCard.classList.remove('bg-primary/20', 'scale-105', 'shadow-[8px_8px_0px_0px_#00a8a8]', '-translate-y-2');
            }, 800);
        }
    }, 500); // adjust based on scroll duration
};
