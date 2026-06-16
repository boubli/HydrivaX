document.addEventListener('DOMContentLoaded', () => {
  const terminal = document.querySelector('.hero-terminal');
  
  // ── 1. Interactive 3D Tilt Effect ──
  if (terminal) {
    terminal.addEventListener('mousemove', (e) => {
      const rect = terminal.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateY = ((x - centerX) / centerX) * 10;
      const rotateX = -((y - centerY) / centerY) * 10;
      
      terminal.style.transform = `perspective(1100px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.015)`;
      terminal.style.transition = 'transform 0.08s ease-out';
    });

    terminal.addEventListener('mouseleave', () => {
      terminal.style.transform = 'perspective(1100px) rotateY(-4deg) rotateX(1deg) scale(1)';
      terminal.style.transition = 'transform 0.5s ease-in-out';
    });
  }

  // ── 2. Terminal Typing & Reveal Sequence ──
  if (terminal) {
    const ascii = terminal.querySelector('.terminal-ascii');
    const subtitle = terminal.querySelector('.terminal-subtitle');
    const commands = terminal.querySelectorAll('.terminal-command');
    const outputDivs = terminal.querySelectorAll('.terminal-output div');
    const modulesSpan = terminal.querySelectorAll('.terminal-modules span');
    const status = terminal.querySelector('.terminal-status');

    ascii.style.opacity = '0';
    ascii.style.transform = 'translateY(5px)';
    
    subtitle.style.opacity = '0';
    subtitle.style.transform = 'translateY(5px)';
    
    status.style.opacity = '0';
    status.style.transform = 'translateY(5px)';

    commands.forEach(cmd => {
      cmd.style.opacity = '0';
      cmd.style.transform = 'translateY(5px)';
    });

    outputDivs.forEach(div => {
      div.style.opacity = '0';
      div.style.transform = 'translateY(8px)';
      div.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    });

    modulesSpan.forEach(span => {
      span.style.opacity = '0';
      span.style.transform = 'scale(0.8)';
      span.style.transition = 'opacity 0.3s ease, transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
    });

    function typeCommand(element, text, callback) {
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
      
      const promptSpan = element.querySelector('span');
      const promptHTML = promptSpan.outerHTML;
      element.innerHTML = promptHTML + ' ';
      
      const cursor = document.createElement('span');
      cursor.className = 'terminal-cursor';
      element.appendChild(cursor);
      
      let index = 0;
      const interval = setInterval(() => {
        if (index < text.length) {
          cursor.insertAdjacentText('beforebegin', text[index]);
          index++;
        } else {
          clearInterval(interval);
          cursor.remove();
          if (callback) callback();
        }
      }, 55);
    }

    const delay = ms => new Promise(res => setTimeout(res, ms));

    async function startTerminalAnimation() {
      await delay(350);
      ascii.style.opacity = '1';
      ascii.style.transform = 'translateY(0)';
      
      await delay(350);
      subtitle.style.opacity = '1';
      subtitle.style.transform = 'translateY(0)';
      
      await delay(600);
      typeCommand(commands[0], 'hx-info', async () => {
        for (let i = 0; i < outputDivs.length; i++) {
          await delay(120);
          outputDivs[i].style.opacity = '1';
          outputDivs[i].style.transform = 'translateY(0)';
        }
        
        await delay(800);
        typeCommand(commands[1], 'hx-deploy list', async () => {
          for (let i = 0; i < modulesSpan.length; i++) {
            await delay(90);
            modulesSpan[i].style.opacity = '1';
            modulesSpan[i].style.transform = 'scale(1)';
          }
          
          await delay(450);
          status.style.opacity = '1';
          status.style.transform = 'translateY(0)';
          
          const cursor = document.createElement('span');
          cursor.className = 'terminal-cursor';
          status.appendChild(cursor);
        });
      });
    }

    startTerminalAnimation();
  }

  // ── 3. Background Particle Network Animation ──
  const canvas = document.getElementById('hero-particles');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: null, y: null, radius: 160 };
    const heroSection = document.querySelector('.hero');
    
    function resizeCanvas() {
      canvas.width = heroSection.offsetWidth;
      canvas.height = heroSection.offsetHeight;
      initParticles();
    }
    
    window.addEventListener('resize', resizeCanvas);
    
    heroSection.addEventListener('mousemove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });
    
    heroSection.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });
    
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5; // very subtle slow movement
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 2 + 1; // 1px to 3px
        this.color = 'rgba(1, 218, 254, 0.35)';
      }
      
      update() {
        this.x += this.vx;
        this.y += this.vy;
        
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
        
        // Soft mouse repulsion
        if (mouse.x !== null && mouse.y !== null) {
          const dx = this.x - mouse.x;
          const dy = this.y - mouse.y;
          const dist = Math.hypot(dx, dy);
          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            const angle = Math.atan2(dy, dx);
            this.x += Math.cos(angle) * force * 1.2;
            this.y += Math.sin(angle) * force * 1.2;
          }
        }
      }
      
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }
    
    function initParticles() {
      particles = [];
      const density = Math.floor((canvas.width * canvas.height) / 17000);
      const count = Math.min(density, 75); // max 75 particles for performance
      for (let i = 0; i < count; i++) {
        particles.push(new Particle());
      }
    }
    
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.hypot(dx, dy);
          
          if (dist < 115) {
            const alpha = ((115 - dist) / 115) * 0.12;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(1, 218, 254, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
        
        // Connect to mouse cursor
        if (mouse.x !== null && mouse.y !== null) {
          const dx = particles[i].x - mouse.x;
          const dy = particles[i].y - mouse.y;
          const dist = Math.hypot(dx, dy);
          if (dist < mouse.radius) {
            const alpha = ((mouse.radius - dist) / mouse.radius) * 0.22;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(1, 218, 254, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }
      
      requestAnimationFrame(animate);
    }
    
    resizeCanvas();
    animate();
  }
});
