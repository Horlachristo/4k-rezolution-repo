// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const siteNav = document.querySelector('.site-nav');

navToggle.addEventListener('click', () => {
  const isOpen = siteNav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', isOpen);
});

// Close menu after tapping a link (mobile)
siteNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    siteNav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// Core values modal functionality
const valueCards = document.querySelectorAll('.value-card');
const valueModal = document.getElementById('valueModal');
const modalTitle = document.getElementById('modalTitle');
const modalBody = document.getElementById('modalBody');
const closeModal = document.getElementById('closeModal');

const valueData = {
  clarity: {
    title: 'Clarity',
    description: 'Say it clearly, show it clearly. No noise, no fluff — just work that\'s easy to see and easy to understand.',
    color: '#3FD0C9'
  },
  resolve: {
    title: 'Resolve',
    description: 'Show up, follow through, keep building even when it\'s slow. Consistency over hype.',
    color: '#E8447A'
  },
  community: {
    title: 'Community',
    description: 'Media and leadership only matter if they serve people. Every project should leave a community better informed, more connected, or more empowered.',
    color: '#F2A93B'
  },
  growth: {
    title: 'Growth',
    description: 'Stay a student of the craft — always learning, always refining, always open to feedback.',
    color: '#8B93A1'
  },
  integrity: {
    title: 'Integrity',
    description: 'Represent people and causes honestly. No spin, no shortcuts.',
    color: '#3FD0C9'
  }
};

valueCards.forEach(card => {
  card.addEventListener('click', () => {
    const valueKey = card.dataset.value;
    const value = valueData[valueKey];
    
    if (value) {
      modalTitle.textContent = value.title;
      modalTitle.style.color = value.color;
      modalBody.textContent = value.description;
      valueModal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }
  });
});

closeModal.addEventListener('click', () => {
  valueModal.style.display = 'none';
  document.body.style.overflow = 'auto';
});

valueModal.addEventListener('click', (e) => {
  if (e.target === valueModal.querySelector('.value-modal-backdrop')) {
    valueModal.style.display = 'none';
    document.body.style.overflow = 'auto';
  }
});

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && valueModal.style.display === 'flex') {
    valueModal.style.display = 'none';
    document.body.style.overflow = 'auto';
  }
});
