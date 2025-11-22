// Image preview for create contact
const photoInput = document.getElementById("photo");
const photoPreview = document.getElementById("photoPreview");
if (photoInput && photoPreview) {
  photoInput.addEventListener("change", function (e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (evt) {
        photoPreview.src = evt.target.result;
        photoPreview.style.display = "block";
      };
      reader.readAsDataURL(file);
    } else {
      photoPreview.src = "";
      photoPreview.style.display = "none";
    }
  });
}

// Image preview for edit profile
const pPhotoInput = document.getElementById("p_photo");
const pPhotoPreview = document.getElementById("pPhotoPreview");
if (pPhotoInput && pPhotoPreview) {
  pPhotoInput.addEventListener("change", function (e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (evt) {
        pPhotoPreview.src = evt.target.result;
        pPhotoPreview.style.display = "block";
      };
      reader.readAsDataURL(file);
    } else {
      pPhotoPreview.src = "";
      pPhotoPreview.style.display = "none";
    }
  });
}

// Image preview for edit contact
const cPhotoInput = document.getElementById("c_photo");
const cPhotoPreview = document.getElementById("cPhotoPreview");
if (cPhotoInput && cPhotoPreview) {
  cPhotoInput.addEventListener("change", function (e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (evt) {
        cPhotoPreview.src = evt.target.result;
        cPhotoPreview.style.display = "block";
      };
      reader.readAsDataURL(file);
    } else {
      cPhotoPreview.src = "";
      cPhotoPreview.style.display = "none";
    }
  });
}
/* =========================
   Contactly — App Logic
   ========================= */

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

/* State + Persistence */
const store = {
  key: "contactly_v1",
  read() {
    try {
      return JSON.parse(localStorage.getItem(this.key)) || {};
    } catch {
      return {};
    }
  },
  write(data) {
    localStorage.setItem(this.key, JSON.stringify(data));
  },
};
const state = {
  profile: {
    name: "Your Name",
    email: "email@example.com",
    phone: "+0000000000",
    photo: "",
  },
  contacts: [],
  theme: "dark",
};

// Load from localStorage
Object.assign(state, { ...state, ...store.read() });

// Elements
const profileAvatar = $("#profileAvatar");
const profileName = $("#profileName");
const profileEmail = $("#profileEmail");
const profilePhone = $("#profilePhone");
const editProfileBtn = $("#editProfileBtn");

const createForm = $("#createForm");
const listEl = $("#list");
const emptyState = $("#emptyState");
const searchEl = $("#search");
const countEl = $("#count");

const profileModal = $("#profileModal");
const profileForm = $("#profileForm");
const contactModal = $("#contactModal");
const contactForm = $("#contactForm");
const confirmModal = $("#confirmModal");
const confirmDeleteBtn = $("#confirmDeleteBtn");
const backdrop = $("#modalBackdrop");

const themeToggle = $("#themeToggle");
const toasts = $("#toasts");

// Theme
if (state.theme)
  document.documentElement.setAttribute("data-theme", state.theme);
themeToggle.addEventListener("click", () => {
  const next =
    document.documentElement.getAttribute("data-theme") === "dark"
      ? "light"
      : "dark";
  document.documentElement.setAttribute("data-theme", next);
  state.theme = next;
  persist();
});

// Helpers
function persist() {
  store.write({
    profile: state.profile,
    contacts: state.contacts,
    theme: state.theme,
  });
}
function dataURLFromFile(file) {
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null);
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
function toast(msg, type = "info") {
  const div = document.createElement("div");
  div.className = `toast ${type}`;
  div.textContent = msg;
  toasts.appendChild(div);
  setTimeout(() => div.remove(), 3500);
}
function openModal(dialog) {
  backdrop.classList.add("show");
  dialog.showModal();
}
function closeModal(dialog) {
  dialog.close();
  backdrop.classList.remove("show");
}

// Render Profile
function renderProfile() {
  profileName.textContent = state.profile.name || "Your Name";
  profileEmail.textContent = state.profile.email || "email@example.com";
  profilePhone.textContent = state.profile.phone || "+0000000000";
  profileAvatar.src =
    state.profile.photo ||
    `data:image/svg+xml;utf8,${encodeURIComponent(
      avatarSVG(state.profile.name)
    )}`;
}
function avatarSVG(seed = "U") {
  const letter = (seed || "U").trim()[0]?.toUpperCase() || "U";
  return `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 96 96'>
    <rect width='100%' height='100%' rx='18' fill='rgba(0,0,0,.08)'/>
    <circle cx='48' cy='38' r='18' fill='rgba(0,0,0,.25)'/>
    <rect x='18' y='58' width='60' height='22' rx='11' fill='rgba(0,0,0,.25)'/>
    <text x='48' y='50' font-size='28' text-anchor='middle' fill='white' font-family='Segoe UI, Roboto, Arial'>${letter}</text>
  </svg>`;
}

// Render Contacts
function renderList() {
  const q = searchEl.value.trim().toLowerCase();
  listEl.innerHTML = "";
  let filtered = state.contacts
    .filter((c) =>
      [c.name, c.phone, c.email, c.job].join(" ").toLowerCase().includes(q)
    )
    .sort((a, b) => b.created - a.created); // newest first

  filtered.forEach((c) => listEl.appendChild(contactItem(c)));
  countEl.textContent = state.contacts.length;
  emptyState.style.display = state.contacts.length ? "none" : "block";
}

function contactItem(c) {
  const li = document.createElement("li");
  li.className = "contact";
  li.dataset.id = c.id;

  const pic = document.createElement("div");
  pic.className = "pic";
  const img = document.createElement("img");
  img.alt = "Contact photo";
  img.src =
    c.photo ||
    `data:image/svg+xml;utf8,${encodeURIComponent(avatarSVG(c.name))}`;
  pic.appendChild(img);

  const meta = document.createElement("div");
  meta.className = "meta";
  const title = document.createElement("h4");
  title.textContent = c.name;
  const small1 = document.createElement("small");
  small1.textContent = c.phone;
  const small2 = document.createElement("small");
  small2.textContent = c.email || "";
  const small3 = document.createElement("small");
  small3.textContent = c.job || "";
  meta.append(title, small1, small2, small3);

  const right = document.createElement("div");
  right.className = "row-right";

  const stamp = document.createElement("span");
  stamp.className = "stamp";
  stamp.textContent = new Date(c.created).toLocaleString();
  right.appendChild(stamp);

  const editBtn = document.createElement("button");
  editBtn.className = "icon-btn";
  editBtn.title = "Edit contact";
  editBtn.innerHTML = `<svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z"/><path d="M20.71 7.04a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>`;
  editBtn.addEventListener("click", () => openEditContact(c.id));

  const delBtn = document.createElement("button");
  delBtn.className = "icon-btn";
  delBtn.title = "Delete contact";
  delBtn.innerHTML = `<svg viewBox="0 0 24 24"><path d="M6 7h12M9 7V5a3 3 0 013-3h0a3 3 0 013 3v2M6 7l1 14a3 3 0 003 3h4a3 3 0 003-3L18 7"/></svg>`;
  delBtn.addEventListener("click", () => askDelete(c.id));

  right.append(editBtn, delBtn);

  li.append(pic, meta, right);
  return li;
}

/* Profile editing */
editProfileBtn.addEventListener("click", () => {
  $("#p_name").value = state.profile.name || "";
  $("#p_email").value = state.profile.email || "";
  $("#p_phone").value = state.profile.phone || "";
  $("#p_photo").value = "";
  openModal(profileModal);
});
backdrop.addEventListener("click", () => {
  [profileModal, contactModal, confirmModal].forEach(
    (d) => d.open && closeModal(d)
  );
});
$$("[data-close]").forEach((btn) =>
  btn.addEventListener("click", (e) => {
    const dlg = e.target.closest("dialog");
    if (dlg) closeModal(dlg);
  })
);

profileForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const file = $("#p_photo").files?.[0];
  const photo = file ? await dataURLFromFile(file) : state.profile.photo;
  state.profile = {
    name: $("#p_name").value.trim(),
    email: $("#p_email").value.trim(),
    phone: $("#p_phone").value.trim(),
    photo,
  };
  persist();
  renderProfile();
  closeModal(profileModal);
  toast("Profile updated successfully", "info"); // blue
});

/* Create contact */
createForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = $("#name").value.trim();
  const phone = $("#phone").value.trim();
  if (!name || !phone) return;

  const email = $("#email").value.trim();
  const job = $("#job").value.trim();
  const photoFile = $("#photo").files?.[0];
  const photo = photoFile ? await dataURLFromFile(photoFile) : "";

  const contact = {
    id: crypto.randomUUID(),
    name,
    phone,
    email,
    job,
    photo,
    created: Date.now(),
  };
  state.contacts.push(contact);
  persist();
  createForm.reset();
  renderList();
  // Hide and clear the image preview after adding a contact
  if (photoPreview) {
    photoPreview.src = "";
    photoPreview.style.display = "none";
  }
  toast("Friend added successfully", "success"); // green
});

/* Search */
searchEl.addEventListener("input", renderList);

/* Edit contact */
function openEditContact(id) {
  const c = state.contacts.find((x) => x.id === id);
  if (!c) return;
  $("#c_id").value = c.id;
  $("#c_name").value = c.name;
  $("#c_phone").value = c.phone;
  $("#c_photo").value = "";
  openModal(contactModal);
}
contactForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const id = $("#c_id").value;
  const c = state.contacts.find((x) => x.id === id);
  if (!c) return;
  c.name = $("#c_name").value.trim();
  c.phone = $("#c_phone").value.trim();
  const file = $("#c_photo").files?.[0];
  if (file) {
    c.photo = await dataURLFromFile(file);
  }
  persist();
  renderList();
  closeModal(contactModal);
  toast("Contact updated", "info");
});

/* Delete contact */
let pendingDeleteId = null;
function askDelete(id) {
  pendingDeleteId = id;
  openModal(confirmModal);
}
confirmDeleteBtn.addEventListener("click", () => {
  if (!pendingDeleteId) return;
  state.contacts = state.contacts.filter((c) => c.id !== pendingDeleteId);
  pendingDeleteId = null;
  persist();
  renderList();
  closeModal(confirmModal);
  toast("Contact deleted", "error"); // red
});

/* Initial render */
renderProfile();
renderList();

/* Utility: load initial avatar fallback if no photo */
if (!state.profile.photo) {
  profileAvatar.src = `data:image/svg+xml;utf8,${encodeURIComponent(
    avatarSVG(state.profile.name)
  )}`;
}
