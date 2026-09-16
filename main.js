/* =========================================
   1. GLOBAL FLASHLIGHT & NEURAL CANVAS
   ========================================= */
document.addEventListener('mousemove', (e) => {
    document.documentElement.style.setProperty('--cursor-x', e.clientX + 'px');
    document.documentElement.style.setProperty('--cursor-y', e.clientY + 'px');
});

const canvas = document.createElement('canvas');
canvas.id = 'neural-canvas';
document.body.prepend(canvas);
const ctx = canvas.getContext('2d');

let particles = [];
const numParticles = 65;
let mouse = { x: null, y: null, radius: 130 };

function resizeCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
window.addEventListener('resize', resizeCanvas); resizeCanvas();
window.addEventListener('mousemove', (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });
window.addEventListener('mouseout', () => { mouse.x = null; mouse.y = null; });
window.addEventListener('click', (e) => {
    for(let i=0; i<6; i++) {
        const p = new Particle(); p.x = e.clientX; p.y = e.clientY;
        p.vx = (Math.random() - 0.5) * 6; p.vy = (Math.random() - 0.5) * 6; particles.push(p);
    }
});

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width; this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.15; this.vy = (Math.random() - 0.5) * 0.15;
        this.size = Math.random() * 2 + 1;
    }
    update() {
        this.x += this.vx; this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }
    draw() {
        ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--accent-primary').trim() || '#e5a93c';
        ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fill();
    }
}
function initParticles() { particles = []; for (let i = 0; i < numParticles; i++) particles.push(new Particle()); }
initParticles();
function animateNeuralNetwork() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const accentColor = getComputedStyle(document.body).getPropertyValue('--accent-primary').trim() || '#e5a93c';
    for (let i = 0; i < particles.length; i++) {
        particles[i].update(); particles[i].draw();
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x; const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 110) {
                ctx.strokeStyle = accentColor; ctx.lineWidth = (1 - (dist / 110)) * 0.4;
                ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y); ctx.lineTo(particles[j].x, particles[j].y); ctx.stroke();
            }
        }
        if (mouse.x !== null && mouse.y !== null) {
            const mdx = particles[i].x - mouse.x; const mdy = particles[i].y - mouse.y;
            const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
            if (mdist < mouse.radius) {
                ctx.strokeStyle = accentColor; ctx.lineWidth = (1 - (mdist / mouse.radius)) * 0.8;
                ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
            }
        }
    }
    requestAnimationFrame(animateNeuralNetwork);
}
animateNeuralNetwork();

/* =========================================
   2. SYSTEM CLOCK, WEATHER API, & PROGRESS
   ========================================= */
const navBrand = document.querySelector('.nav-brand');
if (navBrand) {
    const clock = document.createElement('span'); clock.id = 'nav-clock';
    setInterval(() => { clock.innerText = `[SYS.TIME: ${new Date().toTimeString().split(' ')[0]}]`; }, 1000);
    navBrand.appendChild(clock);
}

const sysTemp = document.getElementById('sys-temp');
if (sysTemp) {
    fetch('https://api.open-meteo.com/v1/forecast?latitude=-33.8688&longitude=151.2093&current_weather=true')
    .then(r => r.json()).then(data => { sysTemp.innerHTML = `SYS.TEMP: <span style="color:var(--accent-primary);">${data.current_weather.temperature}°C</span> // WIND: ${data.current_weather.windspeed}KM/H`; })
    .catch(() => { sysTemp.innerHTML = `SYS.TEMP: <span style="color:var(--accent-secondary);">UPLINK FAILED</span>`; });
}

const progressBar = document.getElementById('scroll-progress');
if(progressBar) window.addEventListener('scroll', () => { progressBar.style.width = ((window.scrollY / (document.documentElement.scrollHeight - document.documentElement.clientHeight)) * 100) + '%'; });
const stealthBtn = document.getElementById('stealth-btn');
if (stealthBtn) stealthBtn.addEventListener('click', () => document.body.classList.toggle('stealth-mode'));

/* =========================================
   3. MAGNETIC CURSOR & TELEMETRY
   ========================================= */
const repulsor = document.getElementById('repulsor-glow');
document.addEventListener('mousemove', (e) => { repulsor.style.left = e.clientX + 'px'; repulsor.style.top = e.clientY + 'px'; });
const tooltip = document.createElement('div'); tooltip.id = 'jarvis-tooltip'; document.body.appendChild(tooltip);

document.querySelectorAll('a, button, .clickable, .badge, .v-item').forEach(el => {
    el.addEventListener('mouseenter', () => repulsor.classList.add('magnetic'));
    el.addEventListener('mouseleave', () => repulsor.classList.remove('magnetic'));
});
document.querySelectorAll('.badge').forEach(el => {
    el.addEventListener('mouseenter', () => { tooltip.innerText = `[TELEMETRY: ${el.innerText.trim().substring(0, 25).toUpperCase()}]`; tooltip.classList.add('active'); });
    el.addEventListener('mousemove', (e) => { tooltip.style.left = (e.clientX + 15) + 'px'; tooltip.style.top = (e.clientY + 15) + 'px'; });
    el.addEventListener('mouseleave', () => tooltip.classList.remove('active'));
});

/* =========================================
   MASTER SCROLL OBSERVER
   ========================================= */
const structureElements = document.querySelectorAll('.split-container, .mac-terminal, .diagnostics-hud, .photo-grid, .influences-extended, .ai-sub-section, .arsenal-header, .timeline-block, .full-width-container');
structureElements.forEach(sec => sec.classList.add('holo-section'));

const allHoloSections = document.querySelectorAll('.holo-section');
const holoObserver = new IntersectionObserver((entries) => { 
    entries.forEach(e => { 
        if (e.isIntersecting) {
            e.target.classList.add('active'); 
        }
    }); 
}, { threshold: 0.05 }); 

allHoloSections.forEach(sec => holoObserver.observe(sec));


/* =========================================
   4. LAUNCHPAD: BOOT & DRAG PHYSICS 
   ========================================= */
const terminalOutput = document.getElementById('jarvis-output');
if (terminalOutput) {
    const mainTitle = document.getElementById('main-title'); const subTitle = document.getElementById('sub-title');
    const profileWrap = document.getElementById('profile-wrap'); const hexConsole = document.getElementById('hex-console');
    const envNode = document.getElementById('env-node'); const sydClock = document.getElementById('syd-clock');
    const waveform = document.getElementById('jarvis-waveform');

    if (sydClock) setInterval(() => { sydClock.innerText = new Date().toTimeString().split(' ')[0]; }, 1000);
    
    // SAFARI BULLETPROOFING
    let indexBootPlayed = false;
    try { indexBootPlayed = sessionStorage.getItem('indexBootPlayed') === 'true'; } catch(e) {}

    if (indexBootPlayed) {
        terminalOutput.innerHTML = ""; 
        if(waveform) waveform.classList.remove('active');
        profileWrap.classList.add('visible'); 
        mainTitle.classList.remove('hidden');
        mainTitle.style.opacity = 1; 
        mainTitle.style.transform = "translateY(0)"; 
        mainTitle.classList.add('glow-active'); 
        if (subTitle) subTitle.classList.add('visible'); 
        if (hexConsole) hexConsole.classList.add('visible'); 
        if (envNode) envNode.classList.add('visible');
    } else {
        const bootCommands = [ "> INITIALIZING SECURE CONNECTION...", "> BYPASSING MAINFRAME...", "> AUTHENTICATING GUEST...", "> ACCESS GRANTED. WELCOME." ];
        let commandIndex = 0;

        function typeCommand() {
            if (commandIndex < bootCommands.length) {
                terminalOutput.innerHTML = bootCommands[commandIndex]; if(waveform) waveform.classList.add('active');
                commandIndex++; setTimeout(typeCommand, 1200); 
            } else {
                terminalOutput.innerHTML = ""; if(waveform) waveform.classList.remove('active');
                profileWrap.classList.add('visible'); mainTitle.classList.remove('hidden');
                mainTitle.style.opacity = 1; mainTitle.style.transform = "translateY(0)"; mainTitle.classList.add('glitch-active');
                if (subTitle) subTitle.classList.add('visible'); if (hexConsole) hexConsole.classList.add('visible'); if (envNode) envNode.classList.add('visible');
                setTimeout(() => { mainTitle.classList.remove('glitch-active'); mainTitle.classList.add('glow-active'); }, 1500);
                
                try { sessionStorage.setItem('indexBootPlayed', 'true'); } catch(e) {}
            }
        }
        setTimeout(typeCommand, 800);
    }

    const heroSection = document.getElementById('hero-section'); const parallaxTarget = document.getElementById('hero-parallax-target');
    if(heroSection && parallaxTarget) {
        heroSection.addEventListener('mousemove', (e) => {
            const x = (window.innerWidth / 2 - e.pageX) / 40; const y = (window.innerHeight / 2 - e.pageY) / 40;
            parallaxTarget.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;
        });
        heroSection.addEventListener('mouseleave', () => parallaxTarget.style.transform = `rotateY(0deg) rotateX(0deg)`);
    }

    if(hexConsole) {
        let isDragging = false; let startX, startY; let currentX = 0, currentY = 0; let dragged = false;
        hexConsole.querySelectorAll('a, svg').forEach(el => el.addEventListener('dragstart', e => e.preventDefault()));
        hexConsole.addEventListener('mousedown', (e) => { isDragging = true; dragged = false; hexConsole.style.transition = 'none'; startX = e.clientX - currentX; startY = e.clientY - currentY; });
        window.addEventListener('mousemove', (e) => { if(!isDragging) return; dragged = true; currentX = e.clientX - startX; currentY = e.clientY - startY; hexConsole.style.transform = `translate(${currentX}px, ${currentY}px)`; });
        window.addEventListener('mouseup', () => { if(!isDragging) return; isDragging = false; hexConsole.style.transition = 'transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)'; currentX = 0; currentY = 0; hexConsole.style.transform = `translate(0px, 0px)`; });

        const hackLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
        hexConsole.querySelectorAll('.hex-cell').forEach(cell => {
            const textEl = cell.querySelector('.hex-text');
            cell.addEventListener('click', (e) => { if (dragged) e.preventDefault(); });
            if(textEl) {
                const origText = textEl.getAttribute('data-original'); const hoverText = textEl.getAttribute('data-hover'); let hackInterval = null;
                cell.addEventListener('mouseenter', () => {
                    let it = 0; clearInterval(hackInterval);
                    hackInterval = setInterval(() => {
                        textEl.innerText = hoverText.split("").map((l, i) => i < it ? hoverText[i] : hackLetters[Math.floor(Math.random() * hackLetters.length)]).join("");
                        if(it >= hoverText.length) { clearInterval(hackInterval); textEl.innerText = hoverText; } it += 1/2; 
                    }, 30);
                });
                cell.addEventListener('mouseleave', () => {
                    let it = 0; clearInterval(hackInterval);
                    hackInterval = setInterval(() => {
                        textEl.innerText = origText.split("").map((l, i) => i < it ? origText[i] : hackLetters[Math.floor(Math.random() * hackLetters.length)]).join("");
                        if(it >= origText.length) { clearInterval(hackInterval); textEl.innerText = origText; } it += 1/2; 
                    }, 30);
                });
            }
        });
    }
}

/* =========================================
   5. ARCHITECT: POLYGLOT NODE & DISCORD
   ========================================= */
const polyCore = document.getElementById('polyglot-core'); const polyOut = document.getElementById('polyglot-output');
if (polyCore && polyOut) {
    const translations = { 'EN': 'HELLO WORLD [ENGLISH]', 'TE': 'నమస్కారం (NAMASKARAM) [TELUGU]', 'HI': 'नमस्ते (NAMASTE) [HINDI]', 'TA': 'வணக்கம் (VANAKKAM) [TAMIL]', 'KN': 'ನಮಸ್ಕಾರ (NAMASKARA) [KANNADA]' };
    document.querySelectorAll('.electron').forEach(el => {
        el.addEventListener('mouseenter', () => { const lang = el.getAttribute('data-lang'); polyCore.innerText = lang; polyOut.innerText = translations[lang] || '...'; polyOut.style.color = 'var(--text-main)'; });
        el.addEventListener('mouseleave', () => { polyCore.innerText = '5'; polyOut.innerText = 'HOVER TO TRANSLATE'; polyOut.style.color = 'var(--accent-primary)'; });
    });
}
const dBadge = document.getElementById('discord-status-badge'); const dActivity = document.getElementById('discord-activity');
if (dBadge && dActivity) setTimeout(() => { dBadge.innerHTML = `<span class="status-dot online"></span> <span class="status-text" style="color:#43b581;">ONLINE</span>`; dActivity.classList.add('active'); }, 2500); 

const termInput = document.getElementById('terminal-input'); const hiddenOutput = document.getElementById('terminal-hidden-output');
if (termInput && hiddenOutput) {
    termInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            if (termInput.value.toLowerCase() === 'skills') {
                hiddenOutput.innerHTML = `\n[RKV // SYSTEM PROTOCOL OVERRIDE]\n _______________________________\n|  [ACCESS LEVEL: ADMIN]        |\n|===============================|\n| ID: RISHI KANTH REDDY         |\n| CLASS: MASTER ARCHITECT       |\n| STATUS: FULLY OPERATIONAL     |\n|_______________________________|\n-> CORE STACK UNLOCKED:\n   - PYTHON & JAVA LOGIC\n   - HTML / CSS / JS UI/UX\n   - PHP & SQL DATABASES\n   - VLSM NETWORKING\n-> DEPLOYING ALL ASSETS...`;
                hiddenOutput.classList.remove('hidden');
            } else { hiddenOutput.innerHTML = `> COMMAND NOT RECOGNIZED.`; hiddenOutput.classList.remove('hidden'); }
            termInput.value = "";
        }
    });
}

/* =========================================
   6. INFLUENCES & GLOBAL MECHANICS
   ========================================= */
const ambientContainers = document.querySelectorAll('.split-container');
const ambientObserver = new IntersectionObserver((entries) => { entries.forEach(e => { if(e.isIntersecting && e.target.getAttribute('data-ambient')) document.documentElement.style.setProperty('--ambient-color', e.target.getAttribute('data-ambient')); }); }, { threshold: 0.5 });
ambientContainers.forEach(c => ambientObserver.observe(c));

const marvelBoot = document.getElementById('marvel-boot'); 
const infContent = document.getElementById('influences-content'); 
const marvelOutput = document.getElementById('marvel-output');

if (marvelBoot && marvelOutput && infContent) {
    
    // SAFARI BULLETPROOFING
    let infBootPlayed = false;
    try { infBootPlayed = sessionStorage.getItem('infBootPlayed') === 'true'; } catch(e) {}

    function revealInfluences() {
        marvelBoot.style.display = "none";
        infContent.classList.add('visible');
        setTimeout(() => {
            document.querySelectorAll('#influences-content .holo-section').forEach(el => el.classList.add('active'));
        }, 150);
    }

    if (infBootPlayed) {
        revealInfluences();
    } else {
        const mCmds = [
            "> SCANNING CULTURAL DATABANKS...", 
            "> IDENTIFYING PRIMARY INFLUENCE...", 
            "> MATCH FOUND: EARTH-199999 (MCU)...", 
            "> INITIATING PROTOCOLS...", 
            "> MARVEL OVERRIDE: SUCCESSFUL."
        ]; 
        let mIdx = 0;
        
        marvelOutput.style.color = "var(--accent-primary, #e5a93c)";
        
        function typeMCmd() {
            if (mIdx < mCmds.length) { 
                marvelOutput.innerHTML = mCmds[mIdx]; 
                mIdx++; 
                setTimeout(typeMCmd, 1000); 
            } else { 
                marvelOutput.innerHTML = ""; 
                marvelBoot.style.opacity = 0; 
                setTimeout(() => { 
                    revealInfluences();
                    try { sessionStorage.setItem('infBootPlayed', 'true'); } catch(e) {}
                }, 1000); 
            }
        }
        setTimeout(typeMCmd, 800);
    }
}

document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        card.style.transform = `perspective(1000px) rotateX(${(((e.clientY - rect.top) - (rect.height / 2)) / (rect.height / 2)) * -5}deg) rotateY(${(((e.clientX - rect.left) - (rect.width / 2)) / (rect.width / 2)) * 5}deg) scale3d(1.02, 1.02, 1.02)`;
    });
    card.addEventListener('mouseleave', () => card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`);
});

const decryptObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if(entry.isIntersecting) {
            const target = entry.target; const original = target.getAttribute('data-target');
            const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*"; let it = 0;
            const interval = setInterval(() => {
                target.innerText = original.split("").map((l, i) => i < it ? original[i] : letters[Math.floor(Math.random() * letters.length)]).join("");
                if(it >= original.length) clearInterval(interval); it += 1/3; 
            }, 30);
            decryptObserver.unobserve(target);
        }
    });
}, { threshold: 0.5 }); 
document.querySelectorAll('.decrypt-text').forEach(t => decryptObserver.observe(t));

const arcReactor = document.querySelector('.arc-reactor');
if (arcReactor) {
    arcReactor.addEventListener('click', (e) => {
        const wave = document.createElement('div'); wave.classList.add('shockwave-effect');
        wave.style.left = e.clientX + 'px'; wave.style.top = e.clientY + 'px';
        document.body.appendChild(wave); document.body.classList.add('screen-shake');
        setTimeout(() => { wave.remove(); document.body.classList.remove('screen-shake'); }, 800);
    });
}

/* =========================================
   7. ARSENAL: PURE JS PONG GAME ENGINE
   ========================================= */
const pongCanvas = document.getElementById('pong-canvas');
if (pongCanvas) {
    const pCtx = pongCanvas.getContext('2d');
    const overlay = document.getElementById('pong-overlay');
    let gameRunning = false;

    let ballX = 250, ballY = 150, ballSpeedX = 4, ballSpeedY = 4;
    let p1Y = 100, p2Y = 100;
    const paddleHeight = 60, paddleWidth = 10;
    let score1 = 0, score2 = 0;
    const keys = { w: false, s: false, ArrowUp: false, ArrowDown: false };

    window.addEventListener('keydown', (e) => {
        if (keys.hasOwnProperty(e.key)) keys[e.key] = true;
        if (gameRunning && ['ArrowUp', 'ArrowDown', ' ', 'w', 's'].includes(e.key)) e.preventDefault();
    });
    window.addEventListener('keyup', (e) => { if (keys.hasOwnProperty(e.key)) keys[e.key] = false; });

    overlay.addEventListener('click', () => {
        gameRunning = true; overlay.style.opacity = 0;
        setTimeout(() => overlay.style.display = 'none', 300);
        gameLoop();
    });

    function resetBall() {
        ballX = 250; ballY = 150;
        ballSpeedX = -ballSpeedX;
        ballSpeedY = 4 * (Math.random() > 0.5 ? 1 : -1);
    }

    function moveEverything() {
        if (keys.w && p1Y > 0) p1Y -= 6;
        if (keys.s && p1Y < 300 - paddleHeight) p1Y += 6;
        if (keys.ArrowUp && p2Y > 0) p2Y -= 6;
        if (keys.ArrowDown && p2Y < 300 - paddleHeight) p2Y += 6;

        ballX += ballSpeedX; ballY += ballSpeedY;
        if (ballY < 0 || ballY > 300) ballSpeedY = -ballSpeedY;

        if (ballX < paddleWidth) {
            if (ballY > p1Y && ballY < p1Y + paddleHeight) {
                ballSpeedX = -ballSpeedX; let deltaY = ballY - (p1Y + paddleHeight/2); ballSpeedY = deltaY * 0.2;
            } else { score2++; resetBall(); }
        }
        if (ballX > 500 - paddleWidth) {
            if (ballY > p2Y && ballY < p2Y + paddleHeight) {
                ballSpeedX = -ballSpeedX; let deltaY = ballY - (p2Y + paddleHeight/2); ballSpeedY = deltaY * 0.2;
            } else { score1++; resetBall(); }
        }
    }

    function drawEverything() {
        const accent = getComputedStyle(document.body).getPropertyValue('--accent-primary').trim() || '#e5a93c';
        pCtx.fillStyle = '#0a0a0a'; pCtx.fillRect(0, 0, 500, 300);
        pCtx.fillStyle = 'rgba(255,255,255,0.1)'; for(let i=0; i<300; i+=20) { pCtx.fillRect(249, i, 2, 10); }
        pCtx.fillStyle = accent; pCtx.shadowBlur = 10; pCtx.shadowColor = accent;
        pCtx.fillRect(0, p1Y, paddleWidth, paddleHeight); pCtx.fillRect(500 - paddleWidth, p2Y, paddleWidth, paddleHeight);
        pCtx.beginPath(); pCtx.arc(ballX, ballY, 6, 0, Math.PI*2); pCtx.fill(); pCtx.shadowBlur = 0; 
        pCtx.fillStyle = 'rgba(255,255,255,0.3)'; pCtx.font = '40px Courier New';
        pCtx.fillText(score1, 150, 50); pCtx.fillText(score2, 330, 50);
    }

    function gameLoop() {
        if (!gameRunning) return; moveEverything(); drawEverything(); requestAnimationFrame(gameLoop);
    }
    drawEverything();
}

/* =========================================
   8. HUD OVERLAY MECHANICS (ANTI-FOOTER)
   ========================================= */
const ejectBtn = document.getElementById('hud-eject-btn');
if (ejectBtn) {
    ejectBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

const footerDecryptLinks = document.querySelectorAll('.footer-decrypt');
const footerHackLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";

footerDecryptLinks.forEach(link => {
    const parentBtn = link.closest('.hud-action');
    if(parentBtn) {
        const origText = link.getAttribute('data-original'); 
        const hoverText = link.getAttribute('data-hover'); 
        let hackInterval = null;

        parentBtn.addEventListener('mouseenter', () => {
            let it = 0; clearInterval(hackInterval);
            hackInterval = setInterval(() => {
                link.innerText = hoverText.split("").map((l, i) => i < it ? hoverText[i] : footerHackLetters[Math.floor(Math.random() * footerHackLetters.length)]).join("");
                if(it >= hoverText.length) { clearInterval(hackInterval); link.innerText = hoverText; } it += 1/2; 
            }, 30);
        });

        parentBtn.addEventListener('mouseleave', () => {
            let it = 0; clearInterval(hackInterval);
            hackInterval = setInterval(() => {
                link.innerText = origText.split("").map((l, i) => i < it ? origText[i] : footerHackLetters[Math.floor(Math.random() * footerHackLetters.length)]).join("");
                if(it >= origText.length) { clearInterval(hackInterval); link.innerText = origText; } it += 1/2; 
            }, 30);
        });
    }
});

/* =========================================
   9. J.A.R.V.I.S. VOICE ASSISTANT & SUBTITLES
   ========================================= */
const voiceOrb = document.getElementById('voice-orb');
const subtitleBox = document.getElementById('jarvis-subtitles');
const subtitleText = document.getElementById('subtitle-text');
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

function jarvisSpeak(text, holdTime = 2000, callback = null) {
    if(!subtitleBox) return;
    subtitleText.innerHTML = text;
    subtitleBox.classList.add('active');
    
    if (holdTime > 0) {
        setTimeout(() => {
            subtitleBox.classList.remove('active');
            if(callback) setTimeout(callback, 400); 
        }, holdTime);
    }
}

if (voiceOrb) {
    if (!SpeechRecognition) {
        voiceOrb.addEventListener('click', () => { 
            jarvisSpeak("> <span class='highlight'>SYSTEM ERROR:</span> Browser lacks Web Speech API.", 3000); 
            voiceOrb.classList.add('error');
        });
    } else {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;

        voiceOrb.addEventListener('click', () => {
            voiceOrb.classList.add('listening');
            voiceOrb.classList.remove('error');
            jarvisSpeak("> <span class='highlight'>LISTENING...</span> Awaiting audio input.", 0);
            try { recognition.start(); } catch(e) {}
        });

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript.toLowerCase().trim();
            voiceOrb.classList.remove('listening');
            
            jarvisSpeak(`> <span class='highlight'>USER:</span> "${transcript.toUpperCase()}"`, 0);

            setTimeout(() => {
                if (transcript.includes('launchpad') || transcript.includes('home')) {
                    jarvisSpeak("> <span class='highlight'>SYSTEM:</span> Directing to Launchpad...", 1500, () => window.location.href = 'index.html');
                }
                else if (transcript.includes('architect') || transcript.includes('about')) {
                    jarvisSpeak("> <span class='highlight'>SYSTEM:</span> Accessing Architect profile...", 1500, () => window.location.href = 'about.html');
                }
                else if (transcript.includes('influences') || transcript.includes('inspirations')) {
                    jarvisSpeak("> <span class='highlight'>SYSTEM:</span> Loading Inspirations...", 1500, () => window.location.href = 'influences.html');
                }
                else if (transcript.includes('arsenal') || transcript.includes('projects') || transcript.includes('portfolio')) {
                    jarvisSpeak("> <span class='highlight'>SYSTEM:</span> Unlocking the Arsenal...", 1500, () => window.location.href = 'projects.html');
                }
                else if (transcript.includes('comms') || transcript.includes('contact')) {
                    jarvisSpeak("> <span class='highlight'>SYSTEM:</span> Opening Secure Channel...", 1500, () => window.location.href = 'contact.html');
                }
                else if (transcript.includes('scroll down')) {
                    jarvisSpeak("> <span class='highlight'>SYSTEM:</span> Scrolling down.", 1500, () => window.scrollBy({ top: window.innerHeight * 0.6, behavior: 'smooth' }));
                }
                else if (transcript.includes('scroll up')) {
                    jarvisSpeak("> <span class='highlight'>SYSTEM:</span> Scrolling up.", 1500, () => window.scrollBy({ top: -window.innerHeight * 0.6, behavior: 'smooth' }));
                }
                else if (transcript.includes('top') || transcript.includes('ascend')) {
                    jarvisSpeak("> <span class='highlight'>SYSTEM:</span> Ascending to top.", 1500, () => window.scrollTo({ top: 0, behavior: 'smooth' }));
                }
                else if (transcript.includes('bottom')) {
                    jarvisSpeak("> <span class='highlight'>SYSTEM:</span> Descending to bottom.", 1500, () => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }));
                }
                else if (transcript.includes('refresh') || transcript.includes('reload')) {
                    jarvisSpeak("> <span class='highlight'>SYSTEM:</span> Reloading interface.", 1000, () => window.location.reload());
                }
                else if (transcript.includes('go back')) {
                    jarvisSpeak("> <span class='highlight'>SYSTEM:</span> Reverting to previous node.", 1500, () => window.history.back());
                }
                else if (transcript.includes('stealth mode')) {
                    jarvisSpeak("> <span class='highlight'>SYSTEM:</span> Toggling Stealth Protocols.", 1500, () => document.body.classList.toggle('stealth-mode'));
                }
                else if (transcript.includes('clean slate')) {
                    jarvisSpeak("> <span class='highlight'>WARNING:</span> PURGING MAINFRAME IN 3...", 3000, () => {
                        document.body.classList.add('clean-slate');
                        setTimeout(() => document.body.classList.add('clean-slate-fade'), 1500);
                        setTimeout(() => window.location.reload(), 3500);
                    });
                }
                else if (transcript.includes('barak sir') || transcript.includes('instructor')) {
                    jarvisSpeak("> <span class='highlight'>SYSTEM:</span> Acknowledged. Initiating Instructor Override...", 2000, () => {
                        const override = document.getElementById('instructor-override');
                        if(override) { override.classList.add('active'); setTimeout(() => override.classList.remove('active'), 5000); }
                    });
                }
                else if (transcript.includes('drop a beat') || transcript.includes('friday') || transcript.includes('music')) {
                    jarvisSpeak("> <span class='highlight'>FRIDAY:</span> Loading audio protocols...", 2000, () => {
                        const audio = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3');
                        audio.volume = 0.5; audio.play(); voiceOrb.classList.add('listening');
                    });
                }
                else if (transcript.includes('2018') || transcript.includes('retro') || transcript.includes('tennis')) {
                    jarvisSpeak("> <span class='highlight'>SYSTEM:</span> Reversing timeline to 2018...", 1500, () => {
                        if(!window.location.pathname.includes('projects.html')) window.location.href = 'projects.html';
                        else { document.body.classList.add('retro-mode'); document.getElementById('pong-canvas').scrollIntoView({behavior: "smooth"}); }
                    });
                }
                else if (transcript.includes('i am iron man')) {
                    jarvisSpeak("> <span class='highlight'>STARK:</span> Acknowledged.", 2000, () => {
                        document.querySelectorAll('.holo-section, .nav-item, .hex-cell, .timeline-block, p, h1, h2').forEach(el => {
                            setTimeout(() => el.classList.add('dust-away'), Math.random() * 2000);
                        });
                    });
                }
                else if (transcript.includes('time stone') || transcript.includes('reverse')) {
                    jarvisSpeak("> <span class='highlight'>SYSTEM:</span> Reversing localized destruction...", 1500, () => {
                        document.querySelectorAll('.dust-away').forEach(el => el.classList.remove('dust-away'));
                    });
                }
                else {
                    jarvisSpeak(`> <span class='highlight'>SYSTEM ERROR:</span> Command "${transcript.toUpperCase()}" not recognized.`, 3000);
                    voiceOrb.classList.add('error');
                    setTimeout(() => voiceOrb.classList.remove('error'), 1500);
                }

            }, 1500); 
        };

        recognition.onerror = (e) => {
            voiceOrb.classList.remove('listening');
            voiceOrb.classList.add('error');
            if(e.error === 'not-allowed') {
                jarvisSpeak("> <span class='highlight'>MIC BLOCKED:</span> Please use a Local Server to enable voice.", 4000);
            } else {
                jarvisSpeak(`> <span class='highlight'>AUDIO ERROR:</span> ${e.error.toUpperCase()}`, 3000);
            }
            setTimeout(() => voiceOrb.classList.remove('error'), 1500);
        };
    }
}

/* =========================================
   10. CHRONO-SPATIAL VAULT MECHANICS
   ========================================= */
const memoryCards = document.querySelectorAll('.memory-card');
const liveCoords = document.getElementById('live-coords');

if (memoryCards.length > 0 && liveCoords) {
    memoryCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            const targetId = card.getAttribute('data-target');
            const targetCoords = card.getAttribute('data-coords');
            const activeNode = document.getElementById(targetId);
            if (activeNode) activeNode.classList.add('active-radar');
            liveCoords.innerHTML = targetCoords;
            liveCoords.style.color = "white";
        });

        card.addEventListener('mouseleave', () => {
            const targetId = card.getAttribute('data-target');
            const activeNode = document.getElementById(targetId);
            if (activeNode) activeNode.classList.remove('active-radar');
            liveCoords.innerHTML = "AWAITING HOVER DATA...";
            liveCoords.style.color = ""; 
        });
    });
}   

function slideAus(direction) {
    const carousel = document.getElementById('aus-carousel');
    if(carousel) {
        carousel.scrollBy({ left: direction * carousel.clientWidth, behavior: 'smooth' });
    }
}

/* =========================================
   GLOBAL IMAGE LIGHTBOX (MODAL)
   ========================================= */
const lightboxHTML = `
    <div id="lightbox-modal">
        <span class="lightbox-close">&times;</span>
        <img id="lightbox-img" src="" alt="Enlarged view">
    </div>
`;
document.body.insertAdjacentHTML('beforeend', lightboxHTML);

const lightbox = document.getElementById('lightbox-modal');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxClose = document.querySelector('.lightbox-close');

const clickableImages = document.querySelectorAll('.v-item img, .gallery-pic img, .pad-img, .inline-image-holder img');

clickableImages.forEach(img => {
    img.addEventListener('click', (e) => {
        lightboxImg.src = e.target.src; 
        lightbox.classList.add('active');
    });
});

function closeLightbox() {
    lightbox.classList.remove('active');
    setTimeout(() => { lightboxImg.src = ''; }, 300); 
}

if(lightboxClose) lightboxClose.addEventListener('click', closeLightbox);

if(lightbox) lightbox.addEventListener('click', (e) => {
    if (e.target !== lightboxImg) {
        closeLightbox();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox && lightbox.classList.contains('active')) {
        closeLightbox();
    }
});