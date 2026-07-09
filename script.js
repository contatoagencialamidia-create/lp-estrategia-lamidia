document.addEventListener('DOMContentLoaded', () => {
  initFaqAccordion();
  initParallax();
  initCaseTabs();
  initContatoForm();
});

function initContatoForm() {
  const WEBAPP_URL = 'https://script.google.com/macros/s/AKfycbwwVLFfCN-B_tGcHTOBKqoXu52tEJqPTSYPMzKtCogO4blj8R73cUAflZ1IW60rDiyIng/exec';
  const form = document.getElementById('contato-form');
  if (!form) return;

  const status = form.querySelector('.contato-final__status');
  const submitBtn = form.querySelector('.contato-final__submit');
  const submitLabel = submitBtn.textContent;

  fillUtmFields(form);

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const payload = {
      nome: form.nome.value.trim(),
      email: form.email.value.trim(),
      telefone: form.telefone.value.trim(),
      faturamento: form.faturamento.value,
      mensagem: form.mensagem.value.trim(),
      utm_source: form.utm_source.value,
      utm_medium: form.utm_medium.value,
      utm_campaign: form.utm_campaign.value,
      utm_term: form.utm_term.value,
      utm_content: form.utm_content.value,
    };

    hideStatus();
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';

    try {
      await fetch(WEBAPP_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload),
      });

      window.location.href = 'obrigado.html';
    } catch (err) {
      submitBtn.disabled = false;
      submitBtn.textContent = submitLabel;
      showStatus('Não foi possível enviar agora. Verifique sua conexão e tente novamente.');
    }
  });

  function showStatus(message) {
    status.textContent = message;
    status.hidden = false;
  }

  function hideStatus() {
    status.hidden = true;
    status.textContent = '';
  }
}

function fillUtmFields(form) {
  const params = new URLSearchParams(window.location.search);
  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach((key) => {
    form[key].value = params.get(key) || '';
  });
}

function initCaseTabs() {
  const tabs = document.querySelectorAll('.case__tab');
  const panels = document.querySelectorAll('.case__panel');
  if (!tabs.length || !panels.length) return;

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-case-tab');

      tabs.forEach((t) => {
        const isActive = t === tab;
        t.classList.toggle('is-active', isActive);
        t.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });

      panels.forEach((panel) => {
        panel.hidden = panel.getAttribute('data-case-panel') !== target;
      });
    });
  });
}

function initParallax() {
  const layers = document.querySelectorAll('[data-parallax-bg]');
  if (!layers.length) return;

  const SPEED = 0.55; // 55% da velocidade do scroll
  const MAX_OFFSET = 260; // px — deve ficar abaixo da folga definida no CSS (320px)
  const mobileQuery = window.matchMedia('(max-width: 768px)');
  let ticking = false;

  function update() {
    ticking = false;

    if (mobileQuery.matches) {
      reset();
      return;
    }

    layers.forEach((layer) => {
      const section = layer.closest('[data-parallax]');
      const rect = section.getBoundingClientRect();

      if (rect.bottom < 0 || rect.top > window.innerHeight) return;

      const offset = Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, rect.top * SPEED));
      layer.style.transform = `translateY(${offset}px)`;
    });
  }

  function reset() {
    layers.forEach((layer) => {
      layer.style.transform = '';
    });
  }

  function requestUpdate() {
    if (!ticking) {
      window.requestAnimationFrame(update);
      ticking = true;
    }
  }

  // TODO: remover este log depois de confirmar que o listener está disparando
  window.addEventListener('scroll', () => console.log('[parallax] scroll disparado, mobile:', mobileQuery.matches), { passive: true });

  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate);
  mobileQuery.addEventListener('change', requestUpdate);

  update();
}

function initFaqAccordion() {
  const items = document.querySelectorAll('.faq__item');

  items.forEach((item) => {
    const question = item.querySelector('.faq__question');

    question.addEventListener('click', () => {
      const isOpen = item.getAttribute('data-open') === 'true';

      items.forEach((other) => closeItem(other));

      if (!isOpen) {
        openItem(item);
      }
    });
  });

  function openItem(el) {
    const q = el.querySelector('.faq__question');
    const a = el.querySelector('.faq__answer');
    el.setAttribute('data-open', 'true');
    q.setAttribute('aria-expanded', 'true');
    a.style.maxHeight = a.scrollHeight + 'px';
  }

  function closeItem(el) {
    const q = el.querySelector('.faq__question');
    const a = el.querySelector('.faq__answer');
    el.setAttribute('data-open', 'false');
    q.setAttribute('aria-expanded', 'false');
    a.style.maxHeight = null;
  }
}
