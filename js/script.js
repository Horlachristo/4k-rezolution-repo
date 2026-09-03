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

// Voice memo functionality
const voiceMemoToggle = document.getElementById('voiceMemoToggle');
const voiceMemoStop = document.getElementById('voiceMemoStop');
const voiceMemoStatus = document.getElementById('voiceMemoStatus');
const voiceMemoScript = 'This demo introduces 4K Rezolution, a media and leadership platform built for young creatives and communicators. The scene frames the brand as clear, bold, and purpose-driven, with visuals that highlight storytelling, public relations, community impact, and the energy of campus-led influence. The message is simple: young people can shape narratives, build visibility, and turn ideas into meaningful action.';
let voiceMemoUtterance = null;

function setVoiceMemoStatus(message) {
  if (voiceMemoStatus) {
    voiceMemoStatus.textContent = message;
  }
}

function stopVoiceMemo() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
  setVoiceMemoStatus('Voice memo stopped.');
  if (voiceMemoToggle) {
    voiceMemoToggle.textContent = 'Play voice memo';
  }
}

function playVoiceMemo() {
  if (!('speechSynthesis' in window)) {
    setVoiceMemoStatus('Voice playback is not supported in this browser.');
    return;
  }

  if (window.speechSynthesis.speaking) {
    window.speechSynthesis.cancel();
  }

  voiceMemoUtterance = new SpeechSynthesisUtterance(voiceMemoScript);
  voiceMemoUtterance.lang = 'en-US';
  voiceMemoUtterance.rate = 1;
  voiceMemoUtterance.pitch = 1;

  voiceMemoUtterance.onstart = () => {
    setVoiceMemoStatus('Narrating the scene...');
    if (voiceMemoToggle) {
      voiceMemoToggle.textContent = 'Replay voice memo';
    }
  };

  voiceMemoUtterance.onend = () => {
    setVoiceMemoStatus('Scene summary complete.');
    if (voiceMemoToggle) {
      voiceMemoToggle.textContent = 'Play voice memo';
    }
  };

  voiceMemoUtterance.onerror = () => {
    setVoiceMemoStatus('The voice memo could not play on this device.');
    if (voiceMemoToggle) {
      voiceMemoToggle.textContent = 'Play voice memo';
    }
  };

  window.speechSynthesis.speak(voiceMemoUtterance);
}

if (voiceMemoToggle) {
  voiceMemoToggle.addEventListener('click', () => {
    playVoiceMemo();
  });
}

if (voiceMemoStop) {
  voiceMemoStop.addEventListener('click', () => {
    stopVoiceMemo();
  });
}

// Media lightbox functionality
const mediaThumbWrappers = document.querySelectorAll('.media-thumb-wrapper');
const mediaModal = document.getElementById('mediaModal');
const closeMediaModal = document.getElementById('closeMediaModal');
const mediaImage = document.getElementById('mediaImage');
const mediaVideo = document.getElementById('mediaVideo');
const mediaModalBackdrop = mediaModal.querySelector('.media-modal-backdrop');

mediaThumbWrappers.forEach(wrapper => {
  wrapper.addEventListener('click', () => {
    const mediaType = wrapper.dataset.mediaType;
    const mediaUrl = wrapper.dataset.mediaUrl;

    // Hide both and reset
    mediaImage.style.display = 'none';
    mediaVideo.style.display = 'none';
    mediaVideo.src = '';

    if (mediaType === 'image') {
      mediaImage.src = mediaUrl;
      mediaImage.style.display = 'block';
    } else if (mediaType === 'video') {
      mediaVideo.src = mediaUrl;
      mediaVideo.style.display = 'block';
    }

    mediaModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  });
});

closeMediaModal.addEventListener('click', () => {
  mediaModal.style.display = 'none';
  mediaVideo.pause();
  document.body.style.overflow = 'auto';
});

mediaModalBackdrop.addEventListener('click', () => {
  mediaModal.style.display = 'none';
  mediaVideo.pause();
  document.body.style.overflow = 'auto';
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && mediaModal.style.display === 'flex') {
    mediaModal.style.display = 'none';
    mediaVideo.pause();
    document.body.style.overflow = 'auto';
  }
});
