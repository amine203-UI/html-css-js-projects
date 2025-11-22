// Enhance profile modal image upload: custom button and preview
document.addEventListener("DOMContentLoaded", function () {
  const profileFileInput = document.getElementById("new-profile-pic");
  const profileCustomBtn = document.getElementById("custom-profile-upload-btn");
  const profilePreview = document.getElementById("profile-image-preview");
  if (profileCustomBtn && profileFileInput && profilePreview) {
    profileCustomBtn.addEventListener("click", function () {
      profileFileInput.click();
    });
    profileFileInput.addEventListener("change", function (e) {
      const file = e.target.files[0];
      if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = function (ev) {
          profilePreview.src = ev.target.result;
          profilePreview.style.display = "inline-block";
        };
        reader.readAsDataURL(file);
      } else {
        profilePreview.src = "#";
        profilePreview.style.display = "none";
      }
    });
  }
});
// Enhance image upload: custom button and preview
document.addEventListener("DOMContentLoaded", function () {
  const fileInput = document.getElementById("blog-image");
  const customBtn = document.getElementById("custom-upload-btn");
  const preview = document.getElementById("image-preview");
  if (customBtn && fileInput && preview) {
    customBtn.addEventListener("click", function () {
      fileInput.click();
    });
    fileInput.addEventListener("change", function (e) {
      const file = e.target.files[0];
      if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = function (ev) {
          preview.src = ev.target.result;
          preview.style.display = "inline-block";
        };
        reader.readAsDataURL(file);
      } else {
        preview.src = "#";
        preview.style.display = "none";
      }
    });
  }
});
// Select elements
const blogText = document.getElementById("blog-text");
const blogImage = document.getElementById("blog-image");
const addBlogBtn = document.getElementById("add-blog");
const blogList = document.getElementById("blog-list");

const editProfileBtn = document.getElementById("edit-profile-btn");
const profileModal = document.getElementById("profile-modal");
const closeBtn = document.querySelector(".close-btn");
const saveProfileBtn = document.getElementById("save-profile");

const profilePic = document.getElementById("profile-pic");
const profileName = document.getElementById("profile-name");
const profileJob = document.getElementById("profile-job");

const newProfilePic = document.getElementById("new-profile-pic");
const newName = document.getElementById("new-name");
const newJob = document.getElementById("new-job");

// Load data from localStorage
let blogs = JSON.parse(localStorage.getItem("blogs")) || [];
let profile = JSON.parse(localStorage.getItem("profile")) || {
  name: "Your Name",
  job: "Your Job Title",
  pic: "images/default.png",
};

// Render profile
function renderProfile() {
  profileName.textContent = profile.name;
  profileJob.textContent = profile.job;
  profilePic.src = profile.pic;
}
renderProfile();

// Render blogs
function renderBlogs() {
  blogList.innerHTML = "";
  const emptyMsg = document.getElementById("empty-blog-message");
  if (blogs.length === 0) {
    if (emptyMsg) emptyMsg.style.display = "block";
    return;
  } else {
    if (emptyMsg) emptyMsg.style.display = "none";
  }
  blogs.forEach((blog, index) => {
    const blogDiv = document.createElement("div");
    blogDiv.classList.add("blog-item");
    blogDiv.innerHTML = `
      <p>${blog.text}</p>
      ${blog.image ? `<img src="${blog.image}" alt="Blog Image">` : ""}
      <div class="blog-meta-row">
        <span class="blog-date">${blog.date}</span>
        <button class="delete-btn" data-index="${index}">Delete</button>
      </div>
    `;
    blogList.appendChild(blogDiv);
  });
  // Add event listeners for delete buttons
  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const idx = this.getAttribute("data-index");
      showDeleteModal(idx);
    });
  });
}
renderBlogs();

// Add Blog
addBlogBtn.addEventListener("click", () => {
  if (blogText.value.trim() === "") return alert("Please write something!");
  addBlogBtn.disabled = true;
  let imageURL = "";
  if (blogImage.files[0]) {
    const reader = new FileReader();
    reader.onload = function (e) {
      imageURL = e.target.result;
      console.log("Image loaded, saving blog...");
      saveBlog(imageURL);
      blogText.value = "";
      blogImage.value = "";
      // Clear the image preview as well
      const preview = document.getElementById("image-preview");
      if (preview) {
        preview.src = "#";
        preview.style.display = "none";
      }
      addBlogBtn.disabled = false;
    };
    reader.onerror = function () {
      alert("Failed to load image.");
      addBlogBtn.disabled = false;
    };
    reader.readAsDataURL(blogImage.files[0]);
  } else {
    saveBlog(imageURL);
    blogText.value = "";
    blogImage.value = "";
    // Clear the image preview as well
    const preview = document.getElementById("image-preview");
    if (preview) {
      preview.src = "#";
      preview.style.display = "none";
    }
    addBlogBtn.disabled = false;
  }
});

function saveBlogAndReset(imageURL) {
  saveBlog(imageURL);
  blogText.value = "";
  blogImage.value = "";
  // Clear the image preview as well
  const preview = document.getElementById("image-preview");
  if (preview) {
    preview.src = "#";
    preview.style.display = "none";
  }
  addBlogBtn.disabled = false;
}

function saveBlog(imageURL) {
  const blog = {
    text: blogText.value,
    image: imageURL,
    date: new Date().toLocaleString(),
  };
  blogs.unshift(blog); // newest first
  localStorage.setItem("blogs", JSON.stringify(blogs));
  renderBlogs();
  // Form reset now handled in the event listener
}

// Delete Blog with confirmation modal
let blogToDeleteIndex = null;
function showDeleteModal(index) {
  blogToDeleteIndex = index;
  document.getElementById("delete-modal").style.display = "flex";
}
function hideDeleteModal() {
  blogToDeleteIndex = null;
  document.getElementById("delete-modal").style.display = "none";
}
function confirmDeleteBlog() {
  if (blogToDeleteIndex !== null) {
    blogs.splice(blogToDeleteIndex, 1);
    localStorage.setItem("blogs", JSON.stringify(blogs));
    renderBlogs();
    hideDeleteModal();
  }
}
document.addEventListener("DOMContentLoaded", function () {
  const closeDeleteModal = document.getElementById("close-delete-modal");
  const cancelDeleteBtn = document.getElementById("cancel-delete-btn");
  const confirmDeleteBtn = document.getElementById("confirm-delete-btn");
  if (closeDeleteModal) closeDeleteModal.onclick = hideDeleteModal;
  if (cancelDeleteBtn) cancelDeleteBtn.onclick = hideDeleteModal;
  if (confirmDeleteBtn) confirmDeleteBtn.onclick = confirmDeleteBlog;
});

// Edit Profile Modal
editProfileBtn.addEventListener("click", () => {
  profileModal.style.display = "flex";
});

closeBtn.addEventListener("click", () => {
  profileModal.style.display = "none";
});

saveProfileBtn.addEventListener("click", () => {
  if (newName.value.trim()) profile.name = newName.value;
  if (newJob.value.trim()) profile.job = newJob.value;

  if (newProfilePic.files[0]) {
    const reader = new FileReader();
    reader.onload = function (e) {
      profile.pic = e.target.result;
      saveProfile();
    };
    reader.readAsDataURL(newProfilePic.files[0]);
  } else {
    saveProfile();
  }
});

function saveProfile() {
  localStorage.setItem("profile", JSON.stringify(profile));
  renderProfile();
  profileModal.style.display = "none";
}
