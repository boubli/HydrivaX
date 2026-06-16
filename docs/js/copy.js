document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.code-block, .code-block-mini').forEach(block => {
    // Create wrapper container
    const wrapper = document.createElement('div');
    wrapper.className = 'code-block-wrapper';
    
    // Copy computed styles for margins and display to prevent layout shifts
    const style = window.getComputedStyle(block);
    wrapper.style.marginTop = style.marginTop;
    wrapper.style.marginBottom = style.marginBottom;
    wrapper.style.display = style.display === 'inline' ? 'inline-block' : style.display;
    
    // Reset original block margins so they don't double up inside the wrapper
    block.style.marginTop = '0';
    block.style.marginBottom = '0';
    
    // Insert wrapper before the block, then move the block inside the wrapper
    block.parentNode.insertBefore(wrapper, block);
    wrapper.appendChild(block);
    
    // Create the copy button
    const button = document.createElement('button');
    button.className = 'copy-btn';
    button.setAttribute('aria-label', 'Copy code');
    button.innerHTML = `
      <svg class="copy-icon" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
      </svg>
      <svg class="check-icon" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:none; color:#28c840;">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
      <span>Copy</span>
    `;
    
    wrapper.appendChild(button);
    
    button.addEventListener('click', () => {
      // Clone the block to manipulate it without altering the page layout
      const clone = block.cloneNode(true);
      
      // Remove any elements that represent prompts, terminal details, comments, or headers
      clone.querySelectorAll('.prompt, .comment').forEach(el => el.remove());
      
      // Get the remaining clean code text
      let text = clone.innerText || clone.textContent;
      
      // Clean up lines by trimming whitespace and removing empty lines
      const lines = text.split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);
      text = lines.join('\n');
      
      // Copy clean text to the clipboard
      navigator.clipboard.writeText(text).then(() => {
        button.classList.add('copied');
        button.querySelector('.copy-icon').style.display = 'none';
        button.querySelector('.check-icon').style.display = 'block';
        button.querySelector('span').textContent = 'Copied!';
        
        setTimeout(() => {
          button.classList.remove('copied');
          button.querySelector('.copy-icon').style.display = 'block';
          button.querySelector('.check-icon').style.display = 'none';
          button.querySelector('span').textContent = 'Copy';
        }, 2000);
      }).catch(err => {
        console.error('Failed to copy text: ', err);
      });
    });
  });
});
