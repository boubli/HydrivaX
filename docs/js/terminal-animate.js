document.addEventListener('DOMContentLoaded', () => {
  const terminal = document.querySelector('.hero-terminal');
  if (!terminal) return;

  // ── 1. Interactive 3D Tilt Effect ──
  terminal.addEventListener('mousemove', (e) => {
    const rect = terminal.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calculate rotation angles based on cursor position relative to the center
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Limit rotation to a maximum of 10 degrees
    const rotateY = ((x - centerX) / centerX) * 10;
    const rotateX = -((y - centerY) / centerY) * 10;
    
    terminal.style.transform = `perspective(1100px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.015)`;
    terminal.style.transition = 'transform 0.08s ease-out';
  });

  terminal.addEventListener('mouseleave', () => {
    // Reset back to standard tilted landing position
    terminal.style.transform = 'perspective(1100px) rotateY(-4deg) rotateX(1deg) scale(1)';
    terminal.style.transition = 'transform 0.5s ease-in-out';
  });

  // ── 2. Terminal Typing & Reveal Sequence ──
  const ascii = terminal.querySelector('.terminal-ascii');
  const subtitle = terminal.querySelector('.terminal-subtitle');
  const commands = terminal.querySelectorAll('.terminal-command');
  const outputDivs = terminal.querySelectorAll('.terminal-output div');
  const modulesSpan = terminal.querySelectorAll('.terminal-modules span');
  const status = terminal.querySelector('.terminal-status');

  // Progressive enhancement: hide elements programmatically so they render statically if JS is disabled
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

  // Helper function to simulate a typed command
  function typeCommand(element, text, callback) {
    element.style.opacity = '1';
    element.style.transform = 'translateY(0)';
    
    const promptSpan = element.querySelector('span');
    const promptHTML = promptSpan.outerHTML;
    element.innerHTML = promptHTML + ' '; // clear content except prompt
    
    // Add blinking cursor
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
    }, 55); // typing speed (55ms per char)
  }

  // Delay helper
  const delay = ms => new Promise(res => setTimeout(res, ms));

  // Run animation sequence
  async function startTerminalAnimation() {
    // 1. Fade in ASCII header
    await delay(350);
    ascii.style.opacity = '1';
    ascii.style.transform = 'translateY(0)';
    
    // 2. Fade in subtitle description
    await delay(350);
    subtitle.style.opacity = '1';
    subtitle.style.transform = 'translateY(0)';
    
    // 3. Type "hx-info"
    await delay(600);
    typeCommand(commands[0], 'hx-info', async () => {
      // 4. Fade in specs list one-by-one
      for (let i = 0; i < outputDivs.length; i++) {
        await delay(120);
        outputDivs[i].style.opacity = '1';
        outputDivs[i].style.transform = 'translateY(0)';
      }
      
      // 5. Type "hx-deploy list"
      await delay(800);
      typeCommand(commands[1], 'hx-deploy list', async () => {
        // 6. Pop-in module tags with scale bounce
        for (let i = 0; i < modulesSpan.length; i++) {
          await delay(90);
          modulesSpan[i].style.opacity = '1';
          modulesSpan[i].style.transform = 'scale(1)';
        }
        
        // 7. Fade in status text and append permanent cursor
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
});
