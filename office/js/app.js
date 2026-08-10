/* ==========================================================
   4K REZOLUTION — Office Dashboard (shared, Firebase-backed)
   Same config-driven section system as before, but data now
   lives in Firestore and updates live for everyone signed in.
   ========================================================== */

import { firebaseConfig } from './firebase-config.js';
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import {
  getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import {
  getFirestore, collection, addDoc, deleteDoc, doc,
  onSnapshot, query, orderBy, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

let currentUser = null;
let unsubscribeEntries = null;

const SECTIONS = [
  {
    id: 'calendar', icon: '📅', label: 'Content Calendar',
    desc: 'What\'s going out, and when.',
    fields: [
      { key: 'date', label: 'Date', type: 'date', required: true },
      { key: 'title', label: 'Title', type: 'text', required: true },
      { key: 'platform', label: 'Platform', type: 'select', options: ['Instagram', 'X / Twitter', 'TikTok', 'Blog', 'Campus Event', 'Other'] },
      { key: 'notes', label: 'Notes', type: 'textarea' },
    ],
    sortKey: 'date',
    titleField: 'title',
    metaFields: ['date', 'platform'],
    subField: 'notes',
  },
  {
    id: 'announcements', icon: '📝', label: 'Announcements',
    desc: 'Public updates for the committee — newest first.',
    fields: [
      { key: 'title', label: 'Title', type: 'text', required: true },
      { key: 'body', label: 'Message', type: 'textarea', required: true },
    ],
    sortKey: 'createdAt', sortDesc: true,
    titleField: 'title',
    metaFields: ['authorEmail'],
    subField: 'body',
  },
  {
    id: 'graphics', icon: '🎨', label: 'Design / Graphics Archive',
    desc: 'Links to flyers, posters, logos, and templates.',
    fields: [
      { key: 'title', label: 'Title', type: 'text', required: true },
      { key: 'tag', label: 'Type', type: 'select', options: ['Flyer', 'Poster', 'Logo', 'Banner', 'Template', 'Other'] },
      { key: 'link', label: 'Link (Drive, Canva, etc.)', type: 'text' },
    ],
    sortKey: 'createdAt', sortDesc: true,
    titleField: 'title',
    metaFields: ['tag'],
    subField: 'link', subIsLink: true,
  },
  {
    id: 'events', icon: '📸', label: 'Event Coverage',
    desc: 'What was covered, and where to find it.',
    fields: [
      { key: 'event', label: 'Event name', type: 'text', required: true },
      { key: 'date', label: 'Date', type: 'date' },
      { key: 'summary', label: 'Summary', type: 'textarea' },
      { key: 'link', label: 'Photo/video link', type: 'text' },
    ],
    sortKey: 'date', sortDesc: true,
    titleField: 'event',
    metaFields: ['date'],
    subField: 'summary',
  },
  {
    id: 'social', icon: '📱', label: 'Social Media Management',
    desc: 'Planned and posted content across platforms.',
    fields: [
      { key: 'platform', label: 'Platform', type: 'select', options: ['Instagram', 'X / Twitter', 'TikTok', 'Facebook', 'LinkedIn'] },
      { key: 'caption', label: 'Caption / idea', type: 'textarea', required: true },
      { key: 'postDate', label: 'Post date', type: 'date' },
      { key: 'status', label: 'Status', type: 'select', options: ['Draft', 'Scheduled', 'Posted'] },
    ],
    sortKey: 'postDate',
    titleField: 'caption',
    metaFields: ['platform', 'status', 'postDate'],
  },
  {
    id: 'team', icon: '👥', label: 'Team Members',
    desc: 'Who\'s on the committee and how to reach them.',
    fields: [
      { key: 'name', label: 'Name', type: 'text', required: true },
      { key: 'role', label: 'Role', type: 'text' },
      { key: 'contact', label: 'Contact (email/phone)', type: 'text' },
    ],
    sortKey: 'name',
    titleField: 'name',
    metaFields: ['role'],
    subField: 'contact',
  },
  {
    id: 'performance', icon: '📊', label: 'Engagement / Performance',
    desc: 'Manual snapshots of reach and engagement over time.',
    fields: [
      { key: 'platform', label: 'Platform', type: 'select', options: ['Instagram', 'X / Twitter', 'TikTok', 'Facebook', 'Overall'] },
      { key: 'date', label: 'Snapshot date', type: 'date' },
      { key: 'followers', label: 'Followers', type: 'text' },
      { key: 'engagement', label: 'Engagement rate', type: 'text' },
      { key: 'notes', label: 'Notes', type: 'textarea' },
    ],
    sortKey: 'date', sortDesc: true,
    titleField: 'platform',
    metaFields: ['date', 'followers', 'engagement'],
    subField: 'notes',
  },
  {
    id: 'documents', icon: '📁', label: 'Documents',
    desc: 'Meeting notes, budgets, forms — linked, not stored here.',
    fields: [
      { key: 'title', label: 'Title', type: 'text', required: true },
      { key: 'category', label: 'Category', type: 'select', options: ['Meeting Notes', 'Budget', 'Form', 'Policy', 'Other'] },
      { key: 'link', label: 'Link', type: 'text' },
    ],
    sortKey: 'createdAt', sortDesc: true,
    titleField: 'title',
    metaFields: ['category'],
    subField: 'link', subIsLink: true,
  },
  {
    id: 'ideas', icon: '💡', label: 'Ideas Bank',
    desc: 'Anything worth revisiting later.',
    fields: [
      { key: 'idea', label: 'Idea', type: 'textarea', required: true },
      { key: 'tag', label: 'Category', type: 'select', options: ['Content', 'Event', 'Partnership', 'Campaign', 'Other'] },
      { key: 'addedBy', label: 'Added by', type: 'text' },
    ],
    sortKey: 'createdAt', sortDesc: true,
    titleField: 'idea',
    metaFields: ['tag', 'addedBy'],
  },
];

let activeSection = SECTIONS[0].id;

// ---------- auth ----------
function renderAuthBox() {
  const box = document.getElementById('authBox');
  if (currentUser) {
    box.innerHTML = `
      <p class="signed-in">Signed in as<br><strong>${escapeHtml(currentUser.email)}</strong></p>
      <button class="btn btn-outline" id="signOutBtn">Sign out</button>`;
    document.getElementById('signOutBtn').addEventListener('click', () => signOut(auth));
  } else {
    box.innerHTML = `
      <p class="edit-note">Sign in with your committee Google account to view and edit.</p>
      <button class="btn" id="signInBtn">Sign in with Google</button>`;
    document.getElementById('signInBtn').addEventListener('click', () => {
      signInWithPopup(auth, provider).catch(err => {
        console.error(err);
        alert('Sign-in failed: ' + err.message);
      });
    });
  }
}

onAuthStateChanged(auth, user => {
  currentUser = user;
  renderAuthBox();
  renderMain();
});

// ---------- sidebar ----------
function renderSidebar() {
  const nav = document.getElementById('sideNav');
  nav.innerHTML = '';
  SECTIONS.forEach(section => {
    const btn = document.createElement('button');
    btn.className = 'nav-item' + (section.id === activeSection ? ' active' : '');
    btn.innerHTML = `<span class="icon">${section.icon}</span><span>${section.label}</span>`;
    btn.addEventListener('click', () => {
      activeSection = section.id;
      renderSidebar();
      renderMain();
      document.querySelector('.sidebar').classList.remove('open');
    });
    nav.appendChild(btn);
  });
}

// ---------- main panel ----------
function renderMain() {
  const main = document.getElementById('main');

  if (!currentUser) {
    main.innerHTML = `
      <div class="signin-gate">
        <p class="panel-eyebrow">MEDIA &amp; PUBLICITY OFFICE</p>
        <h1 class="panel-title">Sign in to continue</h1>
        <p class="panel-desc">This workspace is shared with your committee. Sign in with Google to view and add updates.</p>
        <button class="btn" id="gateSignIn">Sign in with Google</button>
      </div>`;
    document.getElementById('gateSignIn').addEventListener('click', () => {
      signInWithPopup(auth, provider).catch(err => alert('Sign-in failed: ' + err.message));
    });
    return;
  }

  const section = SECTIONS.find(s => s.id === activeSection);

  main.innerHTML = `
    <div class="panel-head">
      <p class="panel-eyebrow">MEDIA &amp; PUBLICITY OFFICE</p>
      <h1 class="panel-title"><span>${section.icon}</span>${section.label}</h1>
      <p class="panel-desc">${section.desc}</p>
    </div>
    <form class="add-form" id="addForm">
      <div class="add-form-row">${section.fields.map(f => renderField(f)).join('')}</div>
      <button type="submit" class="btn">Add entry</button>
    </form>
    <div class="entry-list" id="entryList">
      <div class="empty-state">Loading…</div>
    </div>
  `;

  document.getElementById('addForm').addEventListener('submit', e => {
    e.preventDefault();
    handleAdd(section);
  });

  subscribeToSection(section);
}

function renderField(field) {
  const id = `f_${field.key}`;
  if (field.type === 'select') {
    return `
      <div class="field">
        <label for="${id}">${field.label}</label>
        <select id="${id}" name="${field.key}">
          ${field.options.map(o => `<option value="${o}">${o}</option>`).join('')}
        </select>
      </div>`;
  }
  if (field.type === 'textarea') {
    return `
      <div class="field" style="grid-column: 1 / -1;">
        <label for="${id}">${field.label}</label>
        <textarea id="${id}" name="${field.key}" ${field.required ? 'required' : ''}></textarea>
      </div>`;
  }
  return `
    <div class="field">
      <label for="${id}">${field.label}</label>
      <input id="${id}" name="${field.key}" type="${field.type}" ${field.required ? 'required' : ''}>
    </div>`;
}

// ---------- firestore ----------
function subscribeToSection(section) {
  if (unsubscribeEntries) {
    unsubscribeEntries();
    unsubscribeEntries = null;
  }

  const list = document.getElementById('entryList');
  const q = query(collection(db, section.id), orderBy(section.sortKey, section.sortDesc ? 'desc' : 'asc'));

  unsubscribeEntries = onSnapshot(q,
    snapshot => {
      const entries = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      renderEntryList(section, entries);
    },
    err => {
      console.error(err);
      list.innerHTML = `<div class="empty-state">Couldn't load this section. Check your Firestore rules and connection.</div>`;
    }
  );
}

async function handleAdd(section) {
  const form = document.getElementById('addForm');
  const entry = {};

  for (const field of section.fields) {
    entry[field.key] = form.elements[field.key].value.trim();
  }

  entry.createdAt = serverTimestamp();
  entry.authorEmail = currentUser.email;

  try {
    await addDoc(collection(db, section.id), entry);
    form.reset();
  } catch (err) {
    console.error(err);
    alert('Could not save: ' + err.message);
  }
}

async function handleDelete(sectionId, entryId) {
  try {
    await deleteDoc(doc(db, sectionId, entryId));
  } catch (err) {
    console.error(err);
    alert('Could not delete: ' + err.message);
  }
}

// ---------- rendering ----------
function renderEntryList(section, entries) {
  const list = document.getElementById('entryList');

  if (entries.length === 0) {
    list.innerHTML = `<div class="empty-state">Nothing here yet. Add your first entry above.</div>`;
    return;
  }

  list.innerHTML = entries.map(entry => {
    const meta = (section.metaFields || [])
      .map(k => entry[k])
      .filter(Boolean)
      .map(v => `<span>${escapeHtml(v)}</span>`)
      .join('');

    let sub = '';
    if (section.subField && entry[section.subField]) {
      const val = entry[section.subField];
      sub = section.subIsLink
        ? `<p class="entry-sub"><a href="${escapeAttr(val)}" target="_blank" rel="noopener">${escapeHtml(val)}</a></p>`
        : `<p class="entry-sub">${escapeHtml(val)}</p>`;
    }

    return `
      <div class="entry" data-id="${entry.id}">
        <div class="entry-body">
          <p class="entry-meta">${meta}</p>
          <p class="entry-title">${escapeHtml(entry[section.titleField] || 'Untitled')}</p>
          ${sub}
        </div>
        <button class="entry-delete" aria-label="Delete entry" data-id="${entry.id}">✕</button>
      </div>`;
  }).join('');

  list.querySelectorAll('.entry-delete').forEach(btn => {
    btn.addEventListener('click', () => {
      handleDelete(section.id, btn.getAttribute('data-id'));
    });
  });
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = String(str);
  return div.innerHTML;
}
function escapeAttr(str) {
  return escapeHtml(str).replace(/"/g, '&quot;');
}

// ---------- sidebar toggle (mobile) ----------
document.getElementById('sidebarToggle').addEventListener('click', () => {
  const sidebar = document.querySelector('.sidebar');
  const isOpen = sidebar.classList.toggle('open');
  document.getElementById('sidebarToggle').setAttribute('aria-expanded', isOpen);
});

// ---------- init ----------
renderSidebar();
renderAuthBox();
renderMain();
