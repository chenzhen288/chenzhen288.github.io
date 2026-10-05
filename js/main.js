document.addEventListener('DOMContentLoaded', function () {
  // Mobile menu toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');

  if (menuToggle && nav) {
    menuToggle.addEventListener('click', function () {
      nav.classList.toggle('active');
      menuToggle.textContent = nav.classList.contains('active') ? '✕' : '☰';
    });

    // Close menu when clicking a link
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('active');
        menuToggle.textContent = '☰';
      });
    });
  }

  // Highlight active nav item based on current page
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav a').forEach(function (link) {
    const linkPage = link.getAttribute('href');
    if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // Contact form handling
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');
  const submitBtn = contactForm ? contactForm.querySelector('button[type="submit"]') : null;

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const action = contactForm.getAttribute('action');
      const isConfigured = action && !action.includes('YOUR_FORM_ID');

      if (!isConfigured) {
        if (formStatus) {
          formStatus.style.display = 'block';
          formStatus.style.color = '#c0392b';
          formStatus.textContent = '表单尚未配置：请先在 contact.html 中将 action 替换为您的 Formspree 表单 ID。';
        }
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = '提交中...';
      }

      if (formStatus) {
        formStatus.style.display = 'none';
      }

      const formData = new FormData(contactForm);

      fetch(action, {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json'
        }
      })
        .then(function (response) {
          if (response.ok) {
            if (formStatus) {
              formStatus.style.display = 'block';
              formStatus.style.color = '#27ae60';
              formStatus.textContent = '提交成功！我们会在 24 小时内与您联系。';
            }
            contactForm.reset();
          } else {
            return response.json().then(function (data) {
              throw new Error(data.error || '提交失败，请稍后重试');
            });
          }
        })
        .catch(function (error) {
          if (formStatus) {
            formStatus.style.display = 'block';
            formStatus.style.color = '#c0392b';
            formStatus.textContent = '提交失败：' + error.message;
          }
        })
        .finally(function () {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = '提交咨询';
          }
        });
    });
  }
});
