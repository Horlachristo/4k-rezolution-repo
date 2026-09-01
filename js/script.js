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

// Mission & Vision modal functionality
const missionBlock = document.querySelector('[data-section="mission"]');
const visionBlock = document.querySelector('[data-section="vision"]');
const missionModal = document.getElementById('missionModal');
const visionModal = document.getElementById('visionModal');
const closeMissionModal = document.getElementById('closeMissionModal');
const closeVisionModal = document.getElementById('closeVisionModal');
const missionTitle = document.getElementById('missionTitle');
const missionBody = document.getElementById('missionBody');
const visionTitle = document.getElementById('visionTitle');
const visionBody = document.getElementById('visionBody');

const missionData = {
  title: 'Our Mission',
  description: '4K Rezolution exists to give young leaders, creatives, and communicators a platform to build visibility, sharpen their voice, and turn ideas into visible impact — starting on campus and reaching beyond it.'
};

const visionData = {
  title: 'Our Vision',
  description: 'A generation of students who lead with clarity, communicate with purpose, and build platforms — not just profiles — for the causes and communities they care about.'
};

// Mission modal
missionBlock.addEventListener('click', () => {
  missionBody.textContent = missionData.description;
  missionModal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
});

closeMissionModal.addEventListener('click', () => {
  missionModal.style.display = 'none';
  document.body.style.overflow = 'auto';
});

missionModal.addEventListener('click', (e) => {
  if (e.target === missionModal.querySelector('.section-modal-backdrop')) {
    missionModal.style.display = 'none';
    document.body.style.overflow = 'auto';
  }
});

// Vision modal
visionBlock.addEventListener('click', () => {
  visionBody.textContent = visionData.description;
  visionModal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
});

closeVisionModal.addEventListener('click', () => {
  visionModal.style.display = 'none';
  document.body.style.overflow = 'auto';
});

visionModal.addEventListener('click', (e) => {
  if (e.target === visionModal.querySelector('.section-modal-backdrop')) {
    visionModal.style.display = 'none';
    document.body.style.overflow = 'auto';
  }
});

// Close modals on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (missionModal.style.display === 'flex') {
      missionModal.style.display = 'none';
      document.body.style.overflow = 'auto';
    }
    if (visionModal.style.display === 'flex') {
      visionModal.style.display = 'none';
      document.body.style.overflow = 'auto';
    }
  }
});
