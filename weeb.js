// Smooth scroll navigation
document.addEventListener('DOMContentLoaded', function() {
  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  // Set current year in footer
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
  
  // Smooth scroll for navigation links
  const navLinks = document.querySelectorAll('.nav-link, [data-scroll-to]');
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href') || '#' + this.getAttribute('data-scroll-to');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: prefersReducedMotion ? 'auto' : 'smooth',
          block: 'start'
        });
      }
    });
  });
  
  // Active navigation highlighting on scroll
  const sections = document.querySelectorAll('section[id]');
  const observerOptions = {
    root: null,
    rootMargin: '-50% 0px -50% 0px',
    threshold: 0
  };
  
  const navObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        document.querySelectorAll('.nav-link').forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          }
        });
      }
    });
  }, observerOptions);
  
  sections.forEach(section => {
    navObserver.observe(section);
  });
  
  // Scroll reveal animations
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserverOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };
  
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (prefersReducedMotion) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'none';
        } else {
          entry.target.classList.add('visible');
        }
        revealObserver.unobserve(entry.target);
      }
    });
  }, revealObserverOptions);
  
  revealElements.forEach(element => {
    if (prefersReducedMotion) {
      element.style.opacity = '1';
      element.style.transform = 'none';
    } else {
      revealObserver.observe(element);
    }
  });
  
  // Contact form handling
  const contactForm = document.getElementById('contact-form');
  const formMessage = document.getElementById('form-message');
  
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Clear previous errors
      document.querySelectorAll('.form-error').forEach(error => {
        error.classList.remove('visible');
      });
      document.querySelectorAll('.form-input, .form-textarea').forEach(input => {
        input.classList.remove('error');
      });
      
      // Get form data
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();
      
      // Validate
      let isValid = true;
      
      if (!name) {
        showError('name', 'Name is required');
        isValid = false;
      }
      
      if (!email) {
        showError('email', 'Email is required');
        isValid = false;
      } else if (!validateEmail(email)) {
        showError('email', 'Please enter a valid email');
        isValid = false;
      }
      
      if (!message) {
        showError('message', 'Message is required');
        isValid = false;
      } else if (message.length < 10) {
        showError('message', 'Message must be at least 10 characters');
        isValid = false;
      }
      
      if (!isValid) {
        showFormMessage('Please fix the errors in the form', 'error');
        return;
      }
      
      // Generate mailto link
      const subject = encodeURIComponent(`Message from ${name}`);
      const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
      const mailtoLink = `mailto:hello@alexmorgan.dev?subject=${subject}&body=${body}`;
      
      // Open mail client
      window.location.href = mailtoLink;
      
      // Show success message
      setTimeout(() => {
        showFormMessage('Opening your email client... Please send the message from your email app.', 'success');
        contactForm.reset();
      }, 500);
    });
  }
  
  // Copy email button
  const copyEmailBtn = document.getElementById('copy-email-btn');
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', async function() {
      const email = 'hello@alexmorgan.dev';
      const success = await copyToClipboard(email);
      
      if (success) {
        showFormMessage('Email address copied to clipboard!', 'success');
        setTimeout(() => {
          formMessage.style.display = 'none';
        }, 3000);
      } else {
        showFormMessage('Failed to copy email address. Please copy manually: ' + email, 'error');
      }
    });
  }
  
  // Helper functions
  function showError(fieldName, message) {
    const input = document.getElementById(fieldName);
    const error = document.getElementById(fieldName + '-error');
    
    if (input) input.classList.add('error');
    if (error) {
      error.textContent = message;
      error.classList.add('visible');
    }
  }
  
  function showFormMessage(message, type) {
    if (formMessage) {
      formMessage.textContent = message;
      formMessage.className = 'form-message ' + type;
      formMessage.style.display = 'block';
    }
  }
  
  function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  async function copyToClipboard(text) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        const successful = document.execCommand('copy');
        textArea.remove();
        return successful;
      }
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      return false;
    }
  }
});
