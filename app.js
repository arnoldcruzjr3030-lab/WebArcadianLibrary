// Import Firebase Modular SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
  getFirestore, 
  collection, 
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc, 
  query,
  where,
  onSnapshot, 
  updateDoc, 
  deleteDoc 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  GoogleAuthProvider,
  signInWithPopup,
  signOut, 
  sendPasswordResetEmail,
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// Initialize EmailJS
if (window.emailjs) {
  try {
    window.emailjs.init("YOUR_EMAILJS_PUBLIC_KEY");
  } catch (e) {
    console.log("EmailJS initialization skipped.");
  }
}

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyCIdHCbiiuAsKZRqMaKkGFKHS6MqThmW4U",
  authDomain: "arcadian-2a5b8.firebaseapp.com",
  projectId: "arcadian-2a5b8",
  storageBucket: "arcadian-2a5b8.firebasestorage.app",
  messagingSenderId: "137199539011",
  appId: "1:137199539011:web:09d86c43efa00016bc55f6",
  measurementId: "G-GPD47H9ZYY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const booksCollection = collection(db, "books");
const usersCollection = collection(db, "users");
const borrowedCollection = collection(db, "borrowed_books");
const bookmarksCollection = collection(db, "bookmarks");

// Page Identifier
const path = window.location.pathname;
const isLoginPage = path.endsWith("login.html");
const isAdminPage = path.endsWith("admin-dashboard.html");
const isStudentPage = path.endsWith("student-dashboard.html");
const isProfilePage = path.endsWith("profile.html");
const isBooksPage = path.endsWith("books.html");

// DOM Elements
const authForm = document.getElementById("auth-form");
const authEmail = document.getElementById("auth-email");
const authPassword = document.getElementById("auth-password");
const authFirstName = document.getElementById("auth-first-name");
const authLastName = document.getElementById("auth-last-name");
const authStudentId = document.getElementById("auth-student-id");
const signupFieldsContainer = document.getElementById("signup-fields-container");
const studentIdContainer = document.getElementById("student-id-container");
const forgotPasswordLink = document.getElementById("forgot-password-link");
const authError = document.getElementById("auth-error");
const authTitle = document.getElementById("auth-title");
const authSubtitle = document.getElementById("auth-subtitle");
const authSubmitBtn = document.getElementById("auth-submit-btn");
const toggleAuthModeBtn = document.getElementById("toggle-auth-mode");
const googleSigninBtn = document.getElementById("google-signin-btn");

const togglePasswordVisibilityBtn = document.getElementById("toggle-password-visibility");
const passwordEyeIcon = document.getElementById("password-eye-icon");

const loginNavBtn = document.getElementById("login-nav-btn");
const userProfile = document.getElementById("user-profile");
const userEmailDisplay = document.getElementById("user-email-display");
const logoutBtn = document.getElementById("logout-btn");
const dashboardPortalBtn = document.getElementById("dashboard-portal-btn");

const bookForm = document.getElementById("book-form");
const bookIdInput = document.getElementById("book-id");
const titleInput = document.getElementById("title");
const authorInput = document.getElementById("author");
const isbnInput = document.getElementById("isbn");
const summaryInput = document.getElementById("summary");
const coverUrlInput = document.getElementById("cover-url");
const categoryInput = document.getElementById("category");
const subCategoryInput = document.getElementById("sub-category");
const quickAddCatBtn = document.getElementById("quick-add-cat-btn");
const quickAddSubCatBtn = document.getElementById("quick-add-subcat-btn");
const categoryManagerList = document.getElementById("category-manager-list");
const copiesInput = document.getElementById("copies");
const availableInput = document.getElementById("available");

const submitBtn = document.getElementById("submit-btn");
const cancelBtn = document.getElementById("cancel-btn");
const formTitle = document.getElementById("form-title");

const topBooksContainer = document.getElementById("top-books-container");
const tbody = document.getElementById("book-list-tbody");
const studentTbody = document.getElementById("student-list-tbody");
const studentCountBadge = document.getElementById("student-count-badge");
const pendingRequestsTbody = document.getElementById("pending-requests-tbody");
const cancelledRequestsTbody = document.getElementById("cancelled-requests-tbody");
const pendingRequestBadge = document.getElementById("pending-request-count-badge");
const allRecordsTbody = document.getElementById("all-records-tbody");
const finesRecordsTbody = document.getElementById("fines-records-tbody");
const recordsCountBadge = document.getElementById("records-count-badge");
const myBorrowedTbody = document.getElementById("my-borrowed-books-tbody");
const activeBorrowBadge = document.getElementById("active-borrow-count-badge");
const searchInput = document.getElementById("search-input");
const catalogCountBadge = document.getElementById("catalog-count-badge");
const categoryPillsContainer = document.querySelector(".cat-pill")?.parentElement;

const totalCountEl = document.getElementById("total-count");
const availableCountEl = document.getElementById("available-count");
const borrowedCountEl = document.getElementById("borrowed-count");

const catalogPrevBtn = document.getElementById("catalog-prev-btn");
const catalogNextBtn = document.getElementById("catalog-next-btn");
const catalogPageInfo = document.getElementById("catalog-page-info");

const recordsPrevBtn = document.getElementById("records-prev-btn");
const recordsNextBtn = document.getElementById("records-next-btn");
const recordsPageInfo = document.getElementById("records-page-info");

// DOM Elements for Dedicated Books Directory Page (books.html)
const booksGrid = document.getElementById("books-grid");
const genreCategorySelect = document.getElementById("genre-category-select");
const subgenreSearchInput = document.getElementById("subgenre-search-input");
const bookSearchInput = document.getElementById("book-search-input");
const resetGenreFilterBtn = document.getElementById("reset-genre-filter-btn");
const genreQuickList = document.getElementById("genre-quick-list");
const filteredCountBadge = document.getElementById("filtered-count-badge");
const totalBooksCounter = document.getElementById("total-books-counter");

// Profile DOM Elements
const profileNameDisplay = document.getElementById("profile-name-display");
const profileEmailDisplay = document.getElementById("profile-email-display");
const profileRegDate = document.getElementById("profile-reg-date");
const resetPasswordBtn = document.getElementById("reset-password-btn");
const resetAlert = document.getElementById("reset-alert");
const adminResetPwdBtn = document.getElementById("admin-reset-pwd-btn");
const adminResetAlert = document.getElementById("admin-reset-alert");
const profileHistoryTbody = document.getElementById("profile-history-tbody");
const historyCountBadge = document.getElementById("history-count-badge");
const statApprovedCount = document.getElementById("stat-approved-count");
const statPendingCount = document.getElementById("stat-pending-count");
const statTotalCount = document.getElementById("stat-total-count");

const editFirstNameInput = document.getElementById("edit-first-name-input");
const editLastNameInput = document.getElementById("edit-last-name-input");
const editStudentIdInput = document.getElementById("edit-student-id-input");
const saveProfileBtn = document.getElementById("save-profile-btn");
const profileUpdateAlert = document.getElementById("profile-update-alert");

// Bookmark / Favorite DOM elements
const myBookmarksTbody = document.getElementById("my-bookmarks-tbody");
const bookmarkCountBadge = document.getElementById("bookmark-count-badge");
const profileBookmarksTbody = document.getElementById("profile-bookmarks-tbody");
const profileBookmarkCountBadge = document.getElementById("profile-bookmark-count-badge");

// Pagination Controls for Student Dashboard
const myBorrowPrevBtn = document.getElementById("my-borrow-prev-btn");
const myBorrowNextBtn = document.getElementById("my-borrow-next-btn");
const myBorrowPageInfo = document.getElementById("my-borrow-page-info");

const myBookmarksPrevBtn = document.getElementById("my-bookmarks-prev-btn");
const myBookmarksNextBtn = document.getElementById("my-bookmarks-next-btn");
const myBookmarksPageInfo = document.getElementById("my-bookmarks-page-info");

const profileHistoryPrevBtn = document.getElementById("profile-history-prev-btn");
const profileHistoryNextBtn = document.getElementById("profile-history-next-btn");
const profileHistoryPageInfo = document.getElementById("profile-history-page-info");

let allBooks = [];
let activeStudentRecords = [];
let cancelledStudentRecords = [];
let userActiveRecords = [];
let userBookmarkList = [];
let userHistoryList = [];

let studentActiveBorrowedMap = new Map();
let studentBorrowRecordMap = new Map();
let studentBookmarkedMap = new Map();
let isSignUpMode = false;
let unsubscribeSnapshot = null;
let unsubscribeBorrowedSnapshot = null;
let unsubscribePendingSnapshot = null;
let unsubscribeAllRecordsSnapshot = null;
let unsubscribeBookmarksSnapshot = null;
let currentUserRole = "student";
let currentUserApproved = false;
let currentUserName = "";
let activeCategoryFilter = "ALL";
let selectedMainGenre = "ALL";

// Semester & Calendar State
let activeSemesterCode = "";
let semesterDateMap = new Map();
let calendarCurrentDate = new Date();

// Pagination State
let catalogCurrentPage = 1;
const catalogItemsPerPage = 5;

let recordsCurrentPage = 1;
const recordsItemsPerPage = 5;

let myBorrowCurrentPage = 1;
const myBorrowItemsPerPage = 5;

let myBookmarksCurrentPage = 1;
const myBookmarksItemsPerPage = 5;

let profileHistoryCurrentPage = 1;
const profileHistoryItemsPerPage = 5;

const DAILY_FINE_RATE = 10;

function calculateOverdueFine(dueDateObj) {
  if (!dueDateObj) return { isOverdue: false, daysLate: 0, fineAmount: 0 };
  const today = new Date();
  today.setHours(0,0,0,0);

  const due = dueDateObj.seconds ? new Date(dueDateObj.seconds * 1000) : new Date(dueDateObj);
  due.setHours(0,0,0,0);

  if (today <= due) return { isOverdue: false, daysLate: 0, fineAmount: 0 };

  const diffTime = Math.abs(today - due);
  const daysLate = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const fineAmount = daysLate * DAILY_FINE_RATE;

  return { isOverdue: true, daysLate, fineAmount };
}

function escapeQuotes(str) {
  return str ? String(str).replace(/'/g, "\\'").replace(/"/g, '&quot;') : '';
}

function escapeHtml(str) {
  return str ? String(str).replace(/[&<>"']/g, function(m) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m];
  }) : '';
}

function renderBookCoverHTML(imageUrl, title, category, extraClass = "w-12 h-16") {
  if (imageUrl && imageUrl.trim() !== "") {
    return `
      <img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(title)}" class="${extraClass} object-cover rounded-md shadow-sm border border-slate-200 flex-shrink-0" onerror="this.onerror=null; this.parentElement.innerHTML='${escapeHtml(renderFallbackCoverHTML(title, category, extraClass))}';" />
    `;
  }
  return renderFallbackCoverHTML(title, category, extraClass);
}

function renderFallbackCoverHTML(title, category, extraClass = "w-12 h-16") {
  const firstLetter = title ? title.charAt(0).toUpperCase() : "B";
  return `
    <div class="${extraClass} bg-gradient-to-br from-indigo-700 to-slate-900 text-white rounded-md flex flex-col items-center justify-center p-1 text-center shadow-sm border border-indigo-800/40 flex-shrink-0 select-none">
      <i class="fa-solid fa-book text-[10px] opacity-70 mb-0.5"></i>
      <span class="font-extrabold text-xs leading-none">${firstLetter}</span>
      <span class="text-[8px] font-semibold text-indigo-200 line-clamp-1 mt-0.5">${escapeHtml(category || 'General')}</span>
    </div>
  `;
}

// Dedicated Books Catalog Page Functions (books.html)
function renderBooksCatalogGrid(books) {
  if (!booksGrid) return;

  const searchTerm = bookSearchInput ? bookSearchInput.value.toLowerCase().trim() : "";
  const subGenreTerm = subgenreSearchInput ? subgenreSearchInput.value.toLowerCase().trim() : "";

  const filtered = books.filter(b => {
    const matchesKeyword = 
      !searchTerm ||
      b.title.toLowerCase().includes(searchTerm) ||
      b.author.toLowerCase().includes(searchTerm) ||
      (b.isbn && b.isbn.includes(searchTerm)) ||
      (b.summary && b.summary.toLowerCase().includes(searchTerm));

    const matchesMainGenre = 
      selectedMainGenre === "ALL" || 
      (b.category && b.category.toLowerCase().trim() === selectedMainGenre.toLowerCase().trim());

    const matchesSubGenre = 
      !subGenreTerm || 
      (b.subCategory && b.subCategory.toLowerCase().includes(subGenreTerm));

    return matchesKeyword && matchesMainGenre && matchesSubGenre;
  });

  if (totalBooksCounter) totalBooksCounter.textContent = books.length;
  if (filteredCountBadge) filteredCountBadge.textContent = `Showing ${filtered.length} Books`;

  if (filtered.length === 0) {
    booksGrid.innerHTML = `
      <div class="col-span-full py-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200 shadow-sm">
        <i class="fa-solid fa-book-open-reader text-3xl mb-2 opacity-50"></i>
        <p class="font-medium">No books found matching the selected genre and search criteria.</p>
      </div>
    `;
    return;
  }

  const isAdmin = currentUserRole === "admin";

  booksGrid.innerHTML = filtered.map(book => {
    const isAvailable = book.available > 0;
    const isBookmarked = studentBookmarkedMap.has(book.id);

    return `
      <div class="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between hover:shadow-md transition space-y-3">
        <div>
          <div class="flex items-center justify-between gap-1.5 mb-2.5 flex-wrap">
            <div class="flex items-center gap-1 flex-wrap">
              <span class="px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                ${escapeHtml(book.category || 'General')}
              </span>
              ${book.subCategory ? `
                <span class="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                  ${escapeHtml(book.subCategory)}
                </span>
              ` : ''}
            </div>

            <button onclick="handleToggleBookmark('${book.id}')" class="text-xs p-1.5 rounded-lg transition ${isBookmarked ? 'text-red-600 bg-red-50' : 'text-slate-400 hover:text-red-500 bg-slate-50'}" title="${isBookmarked ? 'Remove Bookmark' : 'Bookmark Book'}">
              <i class="${isBookmarked ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
            </button>
          </div>

          <div class="flex gap-3">
            ${renderBookCoverHTML(book.coverUrl, book.title, book.category, "w-16 h-24")}
            <div class="flex-1 min-w-0">
              <h4 class="font-bold text-slate-900 text-sm line-clamp-2 leading-snug">${escapeHtml(book.title)}</h4>
              <p class="text-xs text-slate-500 font-medium mt-1">by ${escapeHtml(book.author)}</p>
              ${book.isbn ? `<p class="text-[10px] text-slate-400 font-mono mt-0.5">ISBN: ${escapeHtml(book.isbn)}</p>` : ''}
            </div>
          </div>
        </div>

        <div class="pt-3 border-t border-slate-100 flex items-center justify-between text-xs gap-2">
          <span class="font-bold ${isAvailable ? 'text-emerald-600' : 'text-red-500'}">
            ${isAvailable ? `${book.available} Available` : 'Out of Stock'}
          </span>

          <div class="flex items-center gap-1.5">
            <button onclick="openSummaryModal('${escapeQuotes(book.title)}', '${escapeQuotes(book.author)}', '${escapeQuotes(book.summary)}', '${escapeQuotes(book.category)}', '${escapeQuotes(book.coverUrl)}', '${escapeQuotes(book.subCategory || '')}')" class="px-2.5 py-1.5 rounded-lg font-semibold text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 transition">
              Preview
            </button>
            ${!isAdmin ? `
              <button onclick="handleBorrowAction('${book.id}', ${book.available})" class="px-3 py-1.5 rounded-lg font-semibold text-xs transition ${isAvailable ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}" ${!isAvailable ? 'disabled' : ''}>
                Request
              </button>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  }).join("");
}

function populateGenreFilters(books) {
  if (!genreCategorySelect) return;

  const categories = new Set();
  books.forEach(b => {
    if (b.category && b.category.trim() !== "") {
      categories.add(b.category.trim());
    }
  });

  const sortedCategories = Array.from(categories).sort();

  genreCategorySelect.innerHTML = `<option value="ALL">All Genres</option>` + 
    sortedCategories.map(cat => `<option value="${escapeHtml(cat)}">${escapeHtml(cat)}</option>`).join("");

  if (genreQuickList) {
    genreQuickList.innerHTML = sortedCategories.map((cat, idx) => {
      const booksInCat = books.filter(b => b.category && b.category.trim().toLowerCase() === cat.toLowerCase());
      const containerId = `genre-books-list-${idx}`;

      return `
        <div class="group relative rounded-xl border border-slate-200/80 bg-slate-50 hover:bg-indigo-50/50 transition">
          <button 
            type="button" 
            onclick="toggleGenreBooksList('${containerId}', '${escapeQuotes(cat)}')" 
            class="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-indigo-700 transition flex items-center justify-between"
          >
            <span class="flex items-center gap-1.5 truncate">
              <i class="fa-solid fa-folder text-indigo-500 text-[11px]"></i>
              <span>${escapeHtml(cat)}</span>
            </span>
            <div class="flex items-center gap-1.5 flex-shrink-0">
              <span class="px-1.5 py-0.2 text-[10px] font-extrabold bg-slate-200 text-slate-600 rounded-full group-hover:bg-indigo-200 group-hover:text-indigo-800">${booksInCat.length}</span>
              <i class="fa-solid fa-chevron-down text-[10px] text-slate-400 group-hover:text-indigo-600 transition"></i>
            </div>
          </button>

          <!-- Collapsible book titles list on hover or click -->
          <div id="${containerId}" class="hidden group-hover:block px-2 pb-2 pt-1 border-t border-slate-200/60 space-y-1 bg-white rounded-b-xl">
            ${booksInCat.length === 0 ? `
              <p class="text-[11px] text-slate-400 italic px-2 py-1">No books in this genre.</p>
            ` : booksInCat.map(b => `
              <button 
                type="button" 
                onclick="openSummaryModal('${escapeQuotes(b.title)}', '${escapeQuotes(b.author)}', '${escapeQuotes(b.summary)}', '${escapeQuotes(b.category)}', '${escapeQuotes(b.coverUrl)}', '${escapeQuotes(b.subCategory || '')}')" 
                class="w-full text-left px-2 py-1 rounded-lg text-[11px] font-medium text-slate-600 hover:bg-indigo-50 hover:text-indigo-700 transition truncate flex items-center gap-1.5"
                title="${escapeHtml(b.title)}"
              >
                <i class="fa-solid fa-book-bookmark text-[9px] text-indigo-400 flex-shrink-0"></i>
                <span class="truncate">${escapeHtml(b.title)}</span>
              </button>
            `).join("")}
          </div>
        </div>
      `;
    }).join("");
  }
}

window.toggleGenreBooksList = (containerId, genreName) => {
  const target = document.getElementById(containerId);
  if (target) {
    target.classList.toggle("hidden");
  }
  window.selectGenreQuickFilter(genreName);
};

window.selectGenreQuickFilter = (genreName) => {
  selectedMainGenre = genreName;
  if (genreCategorySelect) genreCategorySelect.value = genreName;
  renderBooksCatalogGrid(allBooks);
};

if (genreCategorySelect) {
  genreCategorySelect.addEventListener("change", (e) => {
    selectedMainGenre = e.target.value;
    renderBooksCatalogGrid(allBooks);
  });
}

if (subgenreSearchInput) {
  subgenreSearchInput.addEventListener("input", () => {
    renderBooksCatalogGrid(allBooks);
  });
}

if (bookSearchInput) {
  bookSearchInput.addEventListener("input", () => {
    renderBooksCatalogGrid(allBooks);
  });
}

if (resetGenreFilterBtn) {
  resetGenreFilterBtn.addEventListener("click", () => {
    selectedMainGenre = "ALL";
    if (genreCategorySelect) genreCategorySelect.value = "ALL";
    if (subgenreSearchInput) subgenreSearchInput.value = "";
    if (bookSearchInput) bookSearchInput.value = "";
    renderBooksCatalogGrid(allBooks);
  });
}

// Interactive Admin Calendar Logic
function renderAdminCalendar() {
  const monthYearEl = document.getElementById("calendar-month-year");
  const daysGridEl = document.getElementById("calendar-days-grid");
  if (!monthYearEl || !daysGridEl) return;

  const year = calendarCurrentDate.getFullYear();
  const month = calendarCurrentDate.getMonth();

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  monthYearEl.textContent = `${monthNames[month]} ${year}`;

  const firstDayIndex = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();

  const currentSemConfig = activeSemesterCode ? semesterDateMap.get(activeSemesterCode) : null;
  const semStart = currentSemConfig && currentSemConfig.start ? new Date(currentSemConfig.start) : null;
  const semEnd = currentSemConfig && currentSemConfig.end ? new Date(currentSemConfig.end) : null;

  let daysHtml = "";

  for (let i = 0; i < firstDayIndex; i++) {
    daysHtml += `<div class="py-2"></div>`;
  }

  for (let day = 1; day <= totalDays; day++) {
    const thisDate = new Date(year, month, day);
    let isSemPeriod = false;

    if (semStart && semEnd) {
      isSemPeriod = thisDate >= semStart && thisDate <= semEnd;
    }

    const isToday = new Date().toDateString() === thisDate.toDateString();

    let bgClass = "hover:bg-slate-100 text-slate-700";
    if (isSemPeriod) {
      bgClass = "bg-indigo-100 text-indigo-900 font-bold border border-indigo-200";
    }
    if (isToday) {
      bgClass = "bg-indigo-600 text-white font-bold rounded-lg shadow-sm";
    }

    daysHtml += `<div class="py-1.5 rounded-md text-xs transition ${bgClass}">${day}</div>`;
  }

  daysGridEl.innerHTML = daysHtml;
}

window.changeCalendarMonth = (offset) => {
  calendarCurrentDate.setMonth(calendarCurrentDate.getMonth() + offset);
  renderAdminCalendar();
};

window.handleSaveSemesterDates = () => {
  const semSelect = document.getElementById("config-sem-select");
  const startDateInput = document.getElementById("sem-start-date");
  const endDateInput = document.getElementById("sem-end-date");

  if (!semSelect || !startDateInput || !endDateInput) return;

  const semCode = semSelect.value;
  if (!semCode) {
    alert("Please select or add a semester first.");
    return;
  }

  const startVal = startDateInput.value;
  const endVal = endDateInput.value;

  if (!startVal || !endVal) {
    alert("Please select both Start Date and End Date for the semester.");
    return;
  }

  activeSemesterCode = semCode;
  semesterDateMap.set(semCode, { start: startVal, end: endVal });

  const activeBadge = document.getElementById("active-sem-badge");
  if (activeBadge) {
    const selectedOption = semSelect.options[semSelect.selectedIndex];
    activeBadge.textContent = `Active: ${selectedOption ? selectedOption.textContent : semCode}`;
  }

  alert(`Semester dates updated! Active semester set to ${semCode} (${startVal} to ${endVal}).`);
  renderAdminCalendar();
};

function syncSemesterDropdowns(newSemCode, newSemName) {
  const filterSelect = document.getElementById("fine-semester-filter");
  const configSelect = document.getElementById("config-sem-select");

  [filterSelect, configSelect].forEach(select => {
    if (!select) return;

    const dummyOpt = select.querySelector('option[value=""]');
    if (dummyOpt) dummyOpt.remove();

    let exists = false;
    for (let option of select.options) {
      if (option.value === newSemCode) {
        exists = true;
        break;
      }
    }
    if (!exists) {
      const opt = document.createElement("option");
      opt.value = newSemCode;
      opt.textContent = newSemName;
      select.appendChild(opt);
    }
  });
}

window.handleAddNewSemesterPrompt = () => {
  const semName = prompt("Enter new semester display label (e.g. 1st Sem AY 2026-2027):");
  if (!semName || !semName.trim()) return;

  const semCode = prompt("Enter unique key code for this semester (e.g. 2026-1):");
  if (!semCode || !semCode.trim()) return;

  const trimmedName = semName.trim();
  const trimmedCode = semCode.trim();

  syncSemesterDropdowns(trimmedCode, trimmedName);
  activeSemesterCode = trimmedCode;

  const activeBadge = document.getElementById("active-sem-badge");
  if (activeBadge) activeBadge.textContent = `Active: ${trimmedName}`;

  alert(`Semester "${trimmedName}" added successfully!`);
};

window.handleEditCurrentSemesterPrompt = () => {
  const filterSelect = document.getElementById("fine-semester-filter");
  if (!filterSelect) return;

  const selectedOption = filterSelect.options[filterSelect.selectedIndex];
  if (!selectedOption || selectedOption.value === "ALL" || selectedOption.value === "") {
    alert("Please select a specific semester to edit.");
    return;
  }

  const updatedName = prompt("Edit semester display label:", selectedOption.textContent);
  if (updatedName && updatedName.trim()) {
    selectedOption.textContent = updatedName.trim();

    const configSelect = document.getElementById("config-sem-select");
    if (configSelect) {
      for (let opt of configSelect.options) {
        if (opt.value === selectedOption.value) {
          opt.textContent = updatedName.trim();
          break;
        }
      }
    }

    alert("Semester label updated successfully!");
    renderFinesTable();
  }
};

window.handleRemoveCurrentSemesterPrompt = () => {
  const filterSelect = document.getElementById("fine-semester-filter");
  if (!filterSelect) return;

  const selectedOption = filterSelect.options[filterSelect.selectedIndex];
  if (!selectedOption || selectedOption.value === "ALL" || selectedOption.value === "") {
    alert("Please select a specific semester to remove.");
    return;
  }

  if (confirm(`Are you sure you want to remove "${selectedOption.textContent}"?`)) {
    const valToRemove = selectedOption.value;
    filterSelect.remove(filterSelect.selectedIndex);

    const configSelect = document.getElementById("config-sem-select");
    if (configSelect) {
      for (let i = 0; i < configSelect.options.length; i++) {
        if (configSelect.options[i].value === valToRemove) {
          configSelect.remove(i);
          break;
        }
      }
    }

    if (activeSemesterCode === valToRemove) {
      activeSemesterCode = "";
      const activeBadge = document.getElementById("active-sem-badge");
      if (activeBadge) activeBadge.textContent = "No Active Semester Selected";
    }

    filterSelect.value = "ALL";
    alert("Semester removed.");
    renderFinesTable();
  }
};

window.openSummaryModal = (title, author, summaryText, category = "General", imageUrl = "", subCategory = "") => {
  const modal = document.getElementById("summary-modal");
  const modalTitle = document.getElementById("modal-book-title");
  const modalAuthor = document.getElementById("modal-book-author");
  const modalCategory = document.getElementById("modal-book-category");
  const modalSummary = document.getElementById("modal-book-summary");
  const coverContainer = document.getElementById("modal-cover-container");

  if (!modal) return;

  if (modalTitle) modalTitle.textContent = title;
  if (modalAuthor) modalAuthor.textContent = `by ${author}`;
  if (modalCategory) {
    modalCategory.textContent = subCategory && subCategory.trim() !== "" 
      ? `${category} • ${subCategory}` 
      : category;
  }
  if (modalSummary) modalSummary.textContent = summaryText && summaryText.trim() !== "" ? summaryText : "No summary available.";

  if (coverContainer) {
    coverContainer.innerHTML = renderBookCoverHTML(imageUrl, title, category, "w-full h-full");
  }

  modal.classList.remove("hidden");
};

window.closeSummaryModal = () => {
  const modal = document.getElementById("summary-modal");
  if (modal) modal.classList.add("hidden");
};

function renderTopBooks(books) {
  if (!topBooksContainer) return;

  const categoryFilteredBooks = books.filter(b => {
    return activeCategoryFilter === "ALL" || 
      (b.category && b.category.toLowerCase().trim() === activeCategoryFilter.toLowerCase().trim());
  });

  if (categoryFilteredBooks.length === 0) {
    topBooksContainer.innerHTML = `<p class="col-span-full text-center text-slate-400 text-sm py-4">No popular books found in this category.</p>`;
    return;
  }

  const topBooks = [...categoryFilteredBooks]
    .sort((a, b) => ((b.copies || 1) - (b.available || 0)) - ((a.copies || 1) - (a.available || 0)))
    .slice(0, 3);

  const isAdmin = currentUserRole === "admin";

  topBooksContainer.innerHTML = topBooks.map((book) => {
    const isAvailable = book.available > 0;
    const borrowedCount = (book.copies || 1) - (book.available || 0);
    const isBookmarked = studentBookmarkedMap.has(book.id);
    const subCatPill = book.subCategory ? `<span class="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-slate-100 text-slate-600 border border-slate-200">${escapeHtml(book.subCategory)}</span>` : '';

    return `
      <div class="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-slate-200/80 flex flex-col justify-between hover:shadow-md transition">
        <div>
          <div class="flex items-start justify-between gap-2 mb-3">
            <div class="flex items-center gap-1 flex-wrap">
              <span class="px-2.5 py-0.5 text-[10px] uppercase font-bold rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                ${escapeHtml(book.category || 'General')}
              </span>
              ${subCatPill}
            </div>
            <div class="flex items-center gap-2">
              <button onclick="handleToggleBookmark('${book.id}')" class="text-xs p-1.5 rounded-lg transition ${isBookmarked ? 'text-red-600 bg-red-50' : 'text-slate-400 hover:text-red-500 bg-slate-50'}" title="${isBookmarked ? 'Remove Bookmark' : 'Bookmark Book'}">
                <i class="${isBookmarked ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
              </button>
              <span class="text-[11px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100">
                <i class="fa-solid fa-fire"></i> ${borrowedCount} borrowed
              </span>
            </div>
          </div>

          <div class="flex gap-3 mb-3">
            ${renderBookCoverHTML(book.coverUrl, book.title, book.category, "w-16 h-24")}
            <div>
              <h4 class="font-bold text-slate-900 text-base line-clamp-2 leading-snug">${escapeHtml(book.title)}</h4>
              <p class="text-xs text-slate-500 font-medium mt-1">by ${escapeHtml(book.author)}</p>
              ${book.isbn ? `<p class="text-[10px] text-slate-400 font-mono mt-0.5">ISBN: ${escapeHtml(book.isbn)}</p>` : ''}
            </div>
          </div>
        </div>

        <div class="pt-3 border-t border-slate-100 flex items-center justify-between text-xs gap-2">
          <span class="font-bold ${isAvailable ? 'text-emerald-600' : 'text-red-500'}">
            ${isAvailable ? `${book.available} Available` : 'Out of Stock'}
          </span>
          ${!isAdmin ? `
            <div class="flex items-center gap-1.5">
              <button onclick="openSummaryModal('${escapeQuotes(book.title)}', '${escapeQuotes(book.author)}', '${escapeQuotes(book.summary)}', '${escapeQuotes(book.category)}', '${escapeQuotes(book.coverUrl)}', '${escapeQuotes(book.subCategory || '')}')" class="px-2.5 py-1.5 rounded-lg font-semibold text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 transition">Preview</button>
              <button onclick="handleBorrowAction('${book.id}', ${book.available})" class="px-3 py-1.5 rounded-lg font-semibold text-xs transition ${isAvailable ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}" ${!isAvailable ? 'disabled' : ''}>Request</button>
            </div>
          ` : `
            <button onclick="populateEditForm('${book.id}')" class="px-2.5 py-1 text-xs font-semibold rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition"><i class="fa-solid fa-pen-to-square"></i> Edit</button>
          `}
        </div>
      </div>
    `;
  }).join("");
}

async function syncUserProfile(user, inputStudentId = "", firstName = "", lastName = "") {
  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  let formattedDisplayName = user.displayName || "";
  if (firstName || lastName) {
    formattedDisplayName = `${firstName} ${lastName}`.trim();
  }

  if (!userSnap.exists()) {
    const newUserData = {
      email: user.email,
      firstName: firstName || "",
      lastName: lastName || "",
      displayName: formattedDisplayName || user.email.split("@")[0],
      studentId: inputStudentId || "N/A",
      role: "student",
      approved: false,
      createdAt: new Date()
    };
    await setDoc(userRef, newUserData);
    currentUserRole = "student";
    currentUserApproved = false;
    currentUserName = newUserData.displayName;
  } else {
    const data = userSnap.data();
    currentUserRole = data.role || "student";
    currentUserApproved = data.approved !== undefined ? data.approved : true;
    currentUserName = data.displayName || `${data.firstName || ''} ${data.lastName || ''}`.trim() || user.email.split("@")[0];
  }

  updateHeaderProfileDisplay(user, currentUserName, currentUserRole);
  return { role: currentUserRole, approved: currentUserApproved, displayName: currentUserName };
}

function updateHeaderProfileDisplay(user, name, role) {
  if (userEmailDisplay) {
    userEmailDisplay.innerHTML = `
      <div class="flex items-center gap-2 flex-wrap">
        <span class="font-bold text-slate-100 text-xs sm:text-sm"><i class="fa-solid fa-user-circle text-indigo-400 mr-1"></i>${escapeHtml(name)}</span>
        <span class="px-2 py-0.5 text-[10px] font-extrabold uppercase rounded-md ${role === 'admin' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'}">
          ${role}
        </span>
      </div>
    `;
  }
}

// Auth State Observer
onAuthStateChanged(auth, async (user) => {
  if (user) {
    const userProfileStatus = await syncUserProfile(user);
    const role = userProfileStatus.role;
    const isApproved = userProfileStatus.approved;

    if (role === "student" && !isApproved) {
      if (isLoginPage && authError) {
        authError.textContent = "Your account is pending verification by the Library Admin.";
        authError.classList.remove("hidden");
      } else {
        alert("Your account is currently pending Admin verification.");
        await signOut(auth);
        window.location.href = "login.html";
        return;
      }
    }

    if (isLoginPage && isApproved) {
      window.location.href = role === "admin" ? "admin-dashboard.html" : "index.html";
      return;
    }

    if (isAdminPage && role !== "admin") {
      alert("Access Denied: Only Admins can access the Admin Control Panel.");
      window.location.href = "index.html";
      return;
    }

    if (loginNavBtn) loginNavBtn.classList.add("hidden");
    if (userProfile) {
      userProfile.classList.remove("hidden");
      userProfile.classList.add("flex");
    }

    if (dashboardPortalBtn) {
      dashboardPortalBtn.href = role === "admin" ? "admin-dashboard.html" : "student-dashboard.html";
    }

    if (isAdminPage) {
      loadRegisteredStudents();
      listenToPendingBorrowRequests();
      listenToAllStudentRecords();
    }

    listenToStudentBorrowedBooks(user.uid);
    listenToUserBookmarks(user.uid);

    if (isProfilePage) {
      loadStudentProfileDetails(user);
    }
  } else {
    currentUserRole = "student";
    currentUserApproved = false;
    currentUserName = "";
    studentActiveBorrowedMap.clear();
    studentBorrowRecordMap.clear();
    studentBookmarkedMap.clear();

    if (isAdminPage || isStudentPage || isProfilePage) {
      window.location.href = "login.html";
      return;
    }

    if (loginNavBtn) loginNavBtn.classList.remove("hidden");
    if (userProfile) {
      userProfile.classList.add("hidden");
      userProfile.classList.remove("flex");
    }
  }

  listenToBookCollection();
});

async function loadStudentProfileDetails(user) {
  if (profileEmailDisplay) profileEmailDisplay.textContent = user.email;

  const leaveAdminSection = document.getElementById("leave-admin-section");

  try {
    const userSnap = await getDoc(doc(db, "users", user.uid));
    if (userSnap.exists()) {
      const userData = userSnap.data();
      const currentId = userData.studentId || "N/A";
      const nameToShow = userData.displayName || `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || user.email.split("@")[0];

      if (profileNameDisplay) {
        profileNameDisplay.textContent = `${nameToShow} (ID: ${currentId})`;
      }
      
      if (editFirstNameInput) editFirstNameInput.value = userData.firstName || "";
      if (editLastNameInput) editLastNameInput.value = userData.lastName || "";
      if (editStudentIdInput) editStudentIdInput.value = currentId !== "N/A" ? currentId : "";

      if (userData.createdAt && profileRegDate) {
        profileRegDate.textContent = new Date(userData.createdAt.seconds * 1000).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' });
      }

      if (userData.role === "admin" && leaveAdminSection) leaveAdminSection.classList.remove("hidden");
    }
  } catch (err) {
    console.error("Error loading profile details:", err);
  }

  if (saveProfileBtn) {
    saveProfileBtn.onclick = async () => {
      const newFirstName = editFirstNameInput ? editFirstNameInput.value.trim() : "";
      const newLastName = editLastNameInput ? editLastNameInput.value.trim() : "";
      const newStudentId = editStudentIdInput ? editStudentIdInput.value.trim() : "";

      if (!newFirstName || !newLastName) {
        alert("Please enter both First Name and Last Name.");
        return;
      }

      const updatedDisplayName = `${newFirstName} ${newLastName}`.trim();

      try {
        await updateDoc(doc(db, "users", user.uid), {
          firstName: newFirstName,
          lastName: newLastName,
          displayName: updatedDisplayName,
          studentId: newStudentId || "N/A"
        });

        if (profileNameDisplay) profileNameDisplay.textContent = `${updatedDisplayName} (ID: ${newStudentId || 'N/A'})`;
        updateHeaderProfileDisplay(user, updatedDisplayName, currentUserRole);

        if (profileUpdateAlert) {
          profileUpdateAlert.textContent = "Profile updated successfully!";
          profileUpdateAlert.className = "p-3 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200";
          profileUpdateAlert.classList.remove("hidden");
        }
      } catch (err) {
        if (profileUpdateAlert) {
          profileUpdateAlert.textContent = "Failed to update profile: " + err.message;
          profileUpdateAlert.className = "p-3 rounded-xl text-xs font-semibold bg-red-50 text-red-800 border border-red-200";
          profileUpdateAlert.classList.remove("hidden");
        }
      }
    };
  }

  const q = query(borrowedCollection, where("userId", "==", user.uid));
  onSnapshot(q, (snapshot) => {
    userHistoryList = [];
    let approved = 0;
    let pending = 0;

    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      userHistoryList.push({ id: docSnap.id, ...data });
      if (data.status === 'approved') approved++;
      if (data.status === 'pending') pending++;
    });

    if (statApprovedCount) statApprovedCount.textContent = approved;
    if (statPendingCount) statPendingCount.textContent = pending;
    if (statTotalCount) statTotalCount.textContent = userHistoryList.length;
    if (historyCountBadge) historyCountBadge.textContent = `${userHistoryList.length} Items`;

    renderProfileHistoryTable();
  });
}

function listenToStudentBorrowedBooks(userId) {
  if (unsubscribeBorrowedSnapshot) unsubscribeBorrowedSnapshot();

  const q = query(borrowedCollection, where("userId", "==", userId));

  unsubscribeBorrowedSnapshot = onSnapshot(q, (snapshot) => {
    userActiveRecords = [];
    studentActiveBorrowedMap.clear();
    studentBorrowRecordMap.clear();

    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      userActiveRecords.push({ id: docSnap.id, ...data });

      if (data.status === "pending" || data.status === "approved") {
        studentActiveBorrowedMap.set(data.bookId, data.status);
        studentBorrowRecordMap.set(data.bookId, docSnap.id);
      }
    });

    if (activeBorrowBadge) activeBorrowBadge.textContent = `${userActiveRecords.length} Records`;

    renderMyBorrowedTable();
    renderBookTable(allBooks);
    renderBooksCatalogGrid(allBooks);
  });
}

function renderMyBorrowedTable() {
  if (!myBorrowedTbody) return;

  if (userActiveRecords.length === 0) {
    myBorrowedTbody.innerHTML = `<tr><td colspan="4" class="py-6 text-center text-slate-400 font-medium">You currently have no active requests or borrowed books.</td></tr>`;
    if (myBorrowPageInfo) myBorrowPageInfo.textContent = "Page 0 of 0";
    return;
  }

  const totalPages = Math.ceil(userActiveRecords.length / myBorrowItemsPerPage);
  if (myBorrowCurrentPage > totalPages) myBorrowCurrentPage = totalPages;
  if (myBorrowCurrentPage < 1) myBorrowCurrentPage = 1;

  const startIndex = (myBorrowCurrentPage - 1) * myBorrowItemsPerPage;
  const pageItems = userActiveRecords.slice(startIndex, startIndex + myBorrowItemsPerPage);

  if (myBorrowPageInfo) myBorrowPageInfo.textContent = `Page ${myBorrowCurrentPage} of ${totalPages}`;
  if (myBorrowPrevBtn) myBorrowPrevBtn.disabled = myBorrowCurrentPage === 1;
  if (myBorrowNextBtn) myBorrowNextBtn.disabled = myBorrowCurrentPage === totalPages;

  myBorrowedTbody.innerHTML = pageItems.map((item) => {
    const dueDateObj = item.dueDate ? new Date(item.dueDate.seconds * 1000) : null;
    const fineDetails = calculateOverdueFine(dueDateObj);

    let statusBadge = '';
    if (item.status === 'pending') {
      statusBadge = `<span class="px-2.5 py-0.5 text-[10px] uppercase font-bold rounded-full bg-amber-100 text-amber-800 border border-amber-200"><i class="fa-solid fa-hourglass-half mr-1"></i> Pending Approval</span>`;
    } else if (item.status === 'approved') {
      if (fineDetails.isOverdue) {
        statusBadge = `<span class="px-2.5 py-0.5 text-[10px] uppercase font-bold rounded-full bg-red-100 text-red-800 border border-red-200 animate-pulse"><i class="fa-solid fa-triangle-exclamation mr-1"></i> Overdue (Fine: ₱${fineDetails.fineAmount}.00)</span>`;
      } else {
        statusBadge = `<span class="px-2.5 py-0.5 text-[10px] uppercase font-bold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200"><i class="fa-solid fa-circle-check mr-1"></i> Approved</span>`;
      }
    } else if (item.status === 'declined') {
      statusBadge = `<span class="px-2.5 py-0.5 text-[10px] uppercase font-bold rounded-full bg-red-100 text-red-800 border border-red-200"><i class="fa-solid fa-circle-xmark mr-1"></i> Declined</span>`;
    } else if (item.status === 'cancelled') {
      statusBadge = `<span class="px-2.5 py-0.5 text-[10px] uppercase font-bold rounded-full bg-slate-100 text-slate-700 border border-slate-200"><i class="fa-solid fa-ban mr-1"></i> Cancelled</span>`;
    } else if (item.status === 'returned') {
      statusBadge = `<span class="px-2.5 py-0.5 text-[10px] uppercase font-bold rounded-full bg-slate-100 text-slate-700 border border-slate-200"><i class="fa-solid fa-rotate-left mr-1"></i> Returned</span>`;
    }

    return `
      <tr class="hover:bg-slate-50 transition border-b border-slate-100 sm:border-0">
        <td class="py-3 px-4">
          <div class="font-bold text-slate-900 text-sm">${escapeHtml(item.bookTitle)}</div>
          <div class="text-xs text-slate-500 font-medium">by ${escapeHtml(item.bookAuthor)}</div>
        </td>
        <td class="py-3 px-4 text-center">${statusBadge}</td>
        <td class="py-3 px-4 text-center">
          ${dueDateObj ? `<span class="font-bold ${fineDetails.isOverdue ? 'text-red-600' : 'text-slate-800'}">${dueDateObj.toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })}</span><div class="text-[10px] text-slate-400 font-medium">Duration: ${item.durationDays || 7} Days</div>` : `<span class="text-slate-400 italic">Awaiting Approval (${item.durationDays || 7} days requested)</span>`}
        </td>
        <td class="py-3 px-4 text-center">
          ${item.status === 'approved' ? `
            <button onclick="handleReturnAction('${item.bookId}', '${item.id}')" class="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition flex items-center gap-1 mx-auto"><i class="fa-solid fa-rotate-left"></i> Return Book</button>
          ` : item.status === 'pending' ? `
            <button onclick="handleCancelMyRequest('${item.id}', '${item.bookId}')" class="px-2.5 py-1 text-xs font-semibold rounded-lg bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 transition flex items-center gap-1 mx-auto"><i class="fa-solid fa-xmark"></i> Cancel Request</button>
          ` : `
            <button onclick="handleDismissRecord('${item.id}')" class="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200 transition">Dismiss</button>
          `}
        </td>
      </tr>
    `;
  }).join("");
}

if (myBorrowPrevBtn) {
  myBorrowPrevBtn.addEventListener("click", () => {
    if (myBorrowCurrentPage > 1) {
      myBorrowCurrentPage--;
      renderMyBorrowedTable();
    }
  });
}

if (myBorrowNextBtn) {
  myBorrowNextBtn.addEventListener("click", () => {
    const totalPages = Math.ceil(userActiveRecords.length / myBorrowItemsPerPage);
    if (myBorrowCurrentPage < totalPages) {
      myBorrowCurrentPage++;
      renderMyBorrowedTable();
    }
  });
}

function listenToUserBookmarks(userId) {
  if (unsubscribeBookmarksSnapshot) unsubscribeBookmarksSnapshot();

  const q = query(bookmarksCollection, where("userId", "==", userId));

  unsubscribeBookmarksSnapshot = onSnapshot(q, (snapshot) => {
    userBookmarkList = [];
    studentBookmarkedMap.clear();

    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      userBookmarkList.push({ id: docSnap.id, ...data });
      studentBookmarkedMap.set(data.bookId, docSnap.id);
    });

    if (bookmarkCountBadge) bookmarkCountBadge.textContent = `${userBookmarkList.length} Saved`;
    if (profileBookmarkCountBadge) profileBookmarkCountBadge.textContent = `${userBookmarkList.length} Saved`;

    renderBookmarksTable(userBookmarkList, myBookmarksTbody, myBookmarksPageInfo, myBookmarksPrevBtn, myBookmarksNextBtn);
    renderBookmarksTable(userBookmarkList, profileBookmarksTbody, null, null, null);
    renderBookTable(allBooks);
    renderTopBooks(allBooks);
    renderBooksCatalogGrid(allBooks);
  });
}

function renderBookmarksTable(bookmarks, targetTbody, pageInfoEl, prevBtn, nextBtn) {
  if (!targetTbody) return;

  if (bookmarks.length === 0) {
    targetTbody.innerHTML = `<tr><td colspan="4" class="py-6 text-center text-slate-400 font-medium">No bookmarked or favorite books yet. Click the heart icon on any book to save it!</td></tr>`;
    if (pageInfoEl) pageInfoEl.textContent = "Page 0 of 0";
    return;
  }

  let displayedItems = bookmarks;
  if (pageInfoEl) {
    const totalPages = Math.ceil(bookmarks.length / myBookmarksItemsPerPage);
    if (myBookmarksCurrentPage > totalPages) myBookmarksCurrentPage = totalPages;
    if (myBookmarksCurrentPage < 1) myBookmarksCurrentPage = 1;

    const startIndex = (myBookmarksCurrentPage - 1) * myBookmarksItemsPerPage;
    displayedItems = bookmarks.slice(startIndex, startIndex + myBookmarksItemsPerPage);

    pageInfoEl.textContent = `Page ${myBookmarksCurrentPage} of ${totalPages}`;
    if (prevBtn) prevBtn.disabled = myBookmarksCurrentPage === 1;
    if (nextBtn) nextBtn.disabled = myBookmarksCurrentPage === totalPages;
  }

  targetTbody.innerHTML = displayedItems.map((item) => {
    const subCatPill = item.subCategory ? `<span class="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-slate-100 text-slate-600 border border-slate-200 ml-1">${escapeHtml(item.subCategory)}</span>` : '';

    return `
      <tr class="hover:bg-slate-50 transition border-b border-slate-100 sm:border-0">
        <td class="py-3 px-4">
          <div class="flex items-center gap-3">
            ${renderBookCoverHTML(item.coverUrl, item.bookTitle, item.category, "w-10 h-14")}
            <div>
              <div class="font-bold text-slate-900">${escapeHtml(item.bookTitle)}</div>
              <div class="text-[11px] text-slate-500 font-medium">by ${escapeHtml(item.bookAuthor)}</div>
            </div>
          </div>
        </td>
        <td class="py-3 px-3 text-center">
          <span class="px-2 py-0.5 text-[10px] font-bold uppercase rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">${escapeHtml(item.category || 'General')}</span>
          ${subCatPill}
        </td>
        <td class="py-3 px-3 text-center text-slate-500 font-medium">
          ${item.createdAt ? new Date(item.createdAt.seconds * 1000).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
        </td>
        <td class="py-3 px-4 text-center">
          <button onclick="handleToggleBookmark('${item.bookId}')" class="px-2.5 py-1 text-xs font-semibold rounded-lg bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 transition">
            <i class="fa-solid fa-heart-crack mr-1"></i> Remove
          </button>
        </td>
      </tr>
    `;
  }).join("");
}

if (myBookmarksPrevBtn) {
  myBookmarksPrevBtn.addEventListener("click", () => {
    if (myBookmarksCurrentPage > 1) {
      myBookmarksCurrentPage--;
      renderBookmarksTable(userBookmarkList, myBookmarksTbody, myBookmarksPageInfo, myBookmarksPrevBtn, myBookmarksNextBtn);
    }
  });
}

if (myBookmarksNextBtn) {
  myBookmarksNextBtn.addEventListener("click", () => {
    const totalPages = Math.ceil(userBookmarkList.length / myBookmarksItemsPerPage);
    if (myBookmarksCurrentPage < totalPages) {
      myBookmarksCurrentPage++;
      renderBookmarksTable(userBookmarkList, myBookmarksTbody, myBookmarksPageInfo, myBookmarksPrevBtn, myBookmarksNextBtn);
    }
  });
}

function renderProfileHistoryTable() {
  if (!profileHistoryTbody) return;

  if (userHistoryList.length === 0) {
    profileHistoryTbody.innerHTML = `<tr><td colspan="4" class="py-6 text-center text-slate-400 font-medium">No borrowing history found.</td></tr>`;
    if (profileHistoryPageInfo) profileHistoryPageInfo.textContent = "Page 0 of 0";
    return;
  }

  const totalPages = Math.ceil(userHistoryList.length / profileHistoryItemsPerPage);
  if (profileHistoryCurrentPage > totalPages) profileHistoryCurrentPage = totalPages;
  if (profileHistoryCurrentPage < 1) profileHistoryCurrentPage = 1;

  const startIndex = (profileHistoryCurrentPage - 1) * profileHistoryItemsPerPage;
  const pageItems = userHistoryList.slice(startIndex, startIndex + profileHistoryItemsPerPage);

  if (profileHistoryPageInfo) profileHistoryPageInfo.textContent = `Page ${profileHistoryCurrentPage} of ${totalPages}`;
  if (profileHistoryPrevBtn) profileHistoryPrevBtn.disabled = profileHistoryCurrentPage === 1;
  if (profileHistoryNextBtn) profileHistoryNextBtn.disabled = profileHistoryCurrentPage === totalPages;

  profileHistoryTbody.innerHTML = pageItems.map((log) => {
    const reqDate = log.borrowedAt ? new Date(log.borrowedAt.seconds * 1000).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A';
    const dueDateObj = log.dueDate ? new Date(log.dueDate.seconds * 1000) : null;
    const fineDetails = calculateOverdueFine(dueDateObj);

    let statusBadge = '';
    if (log.status === 'pending') {
      statusBadge = `<span class="px-2 py-0.5 text-[10px] uppercase font-bold rounded-full bg-amber-100 text-amber-800">Pending</span>`;
    } else if (log.status === 'approved') {
      if (fineDetails.isOverdue) {
        statusBadge = `<span class="px-2 py-0.5 text-[10px] uppercase font-bold rounded-full bg-red-100 text-red-800 border border-red-200">Overdue (Fine: ₱${fineDetails.fineAmount})</span>`;
      } else {
        statusBadge = `<span class="px-2 py-0.5 text-[10px] uppercase font-bold rounded-full bg-emerald-100 text-emerald-800">Approved</span>`;
      }
    } else if (log.status === 'declined') {
      statusBadge = `<span class="px-2 py-0.5 text-[10px] uppercase font-bold rounded-full bg-red-100 text-red-800">Declined</span>`;
    } else if (log.status === 'cancelled') {
      statusBadge = `<span class="px-2 py-0.5 text-[10px] uppercase font-bold rounded-full bg-slate-100 text-slate-700">Cancelled</span>`;
    } else if (log.status === 'returned') {
      statusBadge = `<span class="px-2 py-0.5 text-[10px] uppercase font-bold rounded-full bg-slate-100 text-slate-700">Returned</span>`;
    }

    return `
      <tr class="hover:bg-slate-50 transition border-b border-slate-100 sm:border-0">
        <td class="py-3 px-4 font-bold text-slate-800">${escapeHtml(log.bookTitle)}</td>
        <td class="py-3 px-3 text-center">${statusBadge}</td>
        <td class="py-3 px-3 text-center text-slate-500 font-medium">${reqDate}</td>
        <td class="py-3 px-4 text-center font-bold ${fineDetails.isOverdue ? 'text-red-600' : 'text-slate-700'}">
          ${dueDateObj ? dueDateObj.toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' }) : '-'}
        </td>
      </tr>
    `;
  }).join("");
}

if (profileHistoryPrevBtn) {
  profileHistoryPrevBtn.addEventListener("click", () => {
    if (profileHistoryCurrentPage > 1) {
      profileHistoryCurrentPage--;
      renderProfileHistoryTable();
    }
  });
}

if (profileHistoryNextBtn) {
  profileHistoryNextBtn.addEventListener("click", () => {
    const totalPages = Math.ceil(userHistoryList.length / profileHistoryItemsPerPage);
    if (profileHistoryCurrentPage < totalPages) {
      profileHistoryCurrentPage++;
      renderProfileHistoryTable();
    }
  });
}

async function loadRegisteredStudents() {
  if (!studentTbody) return;

  try {
    const querySnapshot = await getDocs(usersCollection);
    const usersList = [];

    querySnapshot.forEach((docSnap) => {
      usersList.push({ id: docSnap.id, ...docSnap.data() });
    });

    if (studentCountBadge) studentCountBadge.textContent = `${usersList.length} Accounts`;

    if (usersList.length === 0) {
      studentTbody.innerHTML = `<tr><td colspan="4" class="py-6 text-center text-slate-400">No user accounts found.</td></tr>`;
      return;
    }

    studentTbody.innerHTML = usersList.map((usr) => {
      const isApproved = usr.approved === true;
      const isAdminRole = usr.role === "admin";
      const fullName = usr.displayName || `${usr.firstName || ''} ${usr.lastName || ''}`.trim() || usr.email.split("@")[0];

      return `
        <tr class="hover:bg-slate-50 transition border-b border-slate-100 sm:border-0">
          <td class="py-3 px-3 sm:px-4 font-bold text-slate-900">${escapeHtml(usr.studentId || 'N/A')}</td>
          <td class="py-3 px-3 sm:px-4 font-semibold text-slate-800">
            <div class="font-bold text-slate-900 text-xs sm:text-sm">${escapeHtml(fullName)}</div>
            <div class="text-[11px] text-slate-400 font-normal">${escapeHtml(usr.email)}</div>
          </td>
          <td class="py-3 px-2 sm:px-3 text-center">
            ${isAdminRole ? `<span class="px-2 py-0.5 text-[10px] font-bold uppercase rounded-full bg-amber-100 text-amber-800 border border-amber-200"><i class="fa-solid fa-user-shield mr-1"></i> Admin</span>` : isApproved ? `<span class="px-2 py-0.5 text-[10px] font-bold uppercase rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200"><i class="fa-solid fa-check mr-1"></i> Student</span>` : `<span class="px-2 py-0.5 text-[10px] uppercase font-bold rounded-full bg-amber-100 text-amber-800 border border-amber-200"><i class="fa-solid fa-clock mr-1"></i> Pending</span>`}
          </td>
          <td class="py-3 px-3 sm:px-4 text-center">
            <div class="flex flex-col sm:flex-row justify-center items-center gap-1.5">
              ${!isApproved && !isAdminRole ? `<button onclick="handleApproveStudent('${usr.id}')" class="px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition">Approve</button>` : ''}
              <button onclick="handleSendUserPasswordReset('${escapeHtml(usr.email)}')" class="px-2 py-1 text-xs font-semibold rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition flex items-center justify-center gap-1"><i class="fa-solid fa-key"></i> Reset</button>
              ${!isAdminRole ? `<button onclick="handleTransferAdminRole('${usr.id}', '${escapeHtml(usr.email)}')" class="px-2 py-1 text-xs font-semibold rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 transition">Promote</button>` : `<span class="text-xs text-slate-400 italic">Active Admin</span>`}
            </div>
          </td>
        </tr>
      `;
    }).join("");
  } catch (err) {
    console.error("Error loading student directory:", err);
  }
}

function renderStudentRecordsTable() {
  if (!allRecordsTbody) return;

  if (activeStudentRecords.length === 0) {
    allRecordsTbody.innerHTML = `<tr><td colspan="5" class="py-6 text-center text-slate-400 font-medium">No active student borrowing records found.</td></tr>`;
    if (recordsPageInfo) recordsPageInfo.textContent = "Page 0 of 0";
    return;
  }

  const totalPages = Math.ceil(activeStudentRecords.length / recordsItemsPerPage);
  if (recordsCurrentPage > totalPages) recordsCurrentPage = totalPages;
  if (recordsCurrentPage < 1) recordsCurrentPage = 1;

  const startIndex = (recordsCurrentPage - 1) * recordsItemsPerPage;
  const pageItems = activeStudentRecords.slice(startIndex, startIndex + recordsItemsPerPage);

  if (recordsPageInfo) recordsPageInfo.textContent = `Page ${recordsCurrentPage} of ${totalPages}`;
  if (recordsPrevBtn) recordsPrevBtn.disabled = recordsCurrentPage === 1;
  if (recordsNextBtn) recordsNextBtn.disabled = recordsCurrentPage === totalPages;

  allRecordsTbody.innerHTML = pageItems.map((rec) => {
    const dueDateObj = rec.dueDate ? new Date(rec.dueDate.seconds * 1000) : null;
    const fineDetails = calculateOverdueFine(dueDateObj);
    const dueDateStr = dueDateObj ? dueDateObj.toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' }) : '-';

    let statusBadge = '';
    if (rec.status === 'pending') {
      statusBadge = `<span class="px-2 py-0.5 text-[10px] uppercase font-bold rounded-full bg-amber-100 text-amber-800">Pending</span>`;
    } else if (rec.status === 'approved') {
      if (fineDetails.isOverdue && !rec.finePaid) {
        statusBadge = `<span class="px-2 py-0.5 text-[10px] uppercase font-bold rounded-full bg-red-100 text-red-800 border border-red-200"><i class="fa-solid fa-triangle-exclamation mr-1"></i> Overdue (${fineDetails.daysLate}d)</span>`;
      } else {
        statusBadge = `<span class="px-2 py-0.5 text-[10px] uppercase font-bold rounded-full bg-emerald-100 text-emerald-800">Approved</span>`;
      }
    } else if (rec.status === 'declined') {
      statusBadge = `<span class="px-2 py-0.5 text-[10px] uppercase font-bold rounded-full bg-red-100 text-red-800">Declined</span>`;
    } else if (rec.status === 'returned') {
      statusBadge = `<span class="px-2 py-0.5 text-[10px] uppercase font-bold rounded-full bg-slate-100 text-slate-700">Returned</span>`;
    }

    return `
      <tr class="hover:bg-slate-50 transition border-b border-slate-100 sm:border-0">
        <td class="py-3 px-3 sm:px-4">
          <div class="font-bold text-indigo-900">ID: ${escapeHtml(rec.studentId || 'N/A')}</div>
          <div class="text-xs font-semibold text-slate-800">${escapeHtml(rec.userEmail)}</div>
        </td>
        <td class="py-3 px-3 sm:px-4 font-bold text-slate-900">${escapeHtml(rec.bookTitle)}</td>
        <td class="py-3 px-2 sm:px-3 text-center">${statusBadge}</td>
        <td class="py-3 px-2 sm:px-3 text-center font-bold text-slate-700">${dueDateStr}</td>
        <td class="py-3 px-3 sm:px-4 text-center">
          <div class="flex flex-col sm:flex-row justify-center items-center gap-1.5">
            ${rec.status === 'approved' ? `
              <button onclick="handleSendEmailNotification('${escapeHtml(rec.userEmail)}', '${escapeHtml(rec.bookTitle)}', '${dueDateStr}', ${fineDetails.fineAmount})" class="px-2 py-1 text-xs font-semibold rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition">
                <i class="fa-solid fa-paper-plane"></i> Email
              </button>
            ` : ''}
            <button onclick="handleRemoveBorrowRecord('${rec.id}')" class="px-2 py-1 text-xs font-semibold rounded-lg bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 transition">
              <i class="fa-solid fa-trash-can"></i> Remove
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join("");
}

window.handleToggleBookmark = async (bookId) => {
  if (!auth.currentUser) {
    alert("Please sign in or register to bookmark favorite books.");
    window.location.href = "login.html";
    return;
  }

  const user = auth.currentUser;
  const existingBookmarkId = studentBookmarkedMap.get(bookId);

  try {
    if (existingBookmarkId) {
      await deleteDoc(doc(db, "bookmarks", existingBookmarkId));
      studentBookmarkedMap.delete(bookId);
    } else {
      const book = allBooks.find(b => b.id === bookId);
      if (!book) return;

      const docRef = await addDoc(bookmarksCollection, {
        userId: user.uid,
        bookId: bookId,
        bookTitle: book.title,
        bookAuthor: book.author,
        category: book.category || "General",
        subCategory: book.subCategory || "",
        coverUrl: book.coverUrl || "",
        createdAt: new Date()
      });
      studentBookmarkedMap.set(bookId, docRef.id);
    }

    renderTopBooks(allBooks);
    renderBookTable(allBooks);
    renderBooksCatalogGrid(allBooks);
  } catch (err) {
    alert("Failed to update bookmark: " + err.message);
  }
};

window.exportBorrowingRecordsToCSV = () => {
  if (activeStudentRecords.length === 0) {
    alert("No borrowing records available to export.");
    return;
  }

  const headers = ["Student ID", "Student Email", "Book Title", "Author", "Status", "Borrowed Date", "Due Date", "Days Overdue", "Fine Amount (PHP)"];
  const csvRows = [headers.join(",")];

  activeStudentRecords.forEach((rec) => {
    const dueDateObj = rec.dueDate ? new Date(rec.dueDate.seconds * 1000) : null;
    const borrowedDateObj = rec.borrowedAt ? new Date(rec.borrowedAt.seconds * 1000) : null;
    const fineDetails = calculateOverdueFine(dueDateObj);

    const studentId = `"${(rec.studentId || 'N/A').replace(/"/g, '""')}"`;
    const userEmail = `"${(rec.userEmail || '').replace(/"/g, '""')}"`;
    const bookTitle = `"${(rec.bookTitle || '').replace(/"/g, '""')}"`;
    const bookAuthor = `"${(rec.bookAuthor || '').replace(/"/g, '""')}"`;
    const status = `"${(rec.status || 'pending').toUpperCase()}"`;
    const borrowedDateStr = borrowedDateObj ? `"${borrowedDateObj.toLocaleDateString("en-US")}"` : '""';
    const dueDateStr = dueDateObj ? `"${dueDateObj.toLocaleDateString("en-US")}"` : '""';
    const daysLate = fineDetails.isOverdue ? fineDetails.daysLate : 0;
    const fineAmount = fineDetails.fineAmount;

    csvRows.push([studentId, userEmail, bookTitle, bookAuthor, status, borrowedDateStr, dueDateStr, daysLate, fineAmount].join(","));
  });

  const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `arcadian_borrowing_records_${new Date().toISOString().slice(0,10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

window.handleSendEmailNotification = async (userEmail, bookTitle, dueDateStr, fineAmount = 0) => {
  const isOverdue = fineAmount > 0;
  const subject = isOverdue ? `[Arcadian Library] OVERDUE NOTICE: "${bookTitle}"` : `[Arcadian Library] Due Date Reminder: "${bookTitle}"`;
  const bodyText = isOverdue
    ? `Dear Student,\n\nYour borrowed book "${bookTitle}" was due on ${dueDateStr} and is OVERDUE.\n\nAccumulated Fine: ₱${fineAmount}.00 (₱10.00/day).\n\nPlease return it immediately.\n\nArcadian Library`
    : `Dear Student,\n\nFriendly reminder that "${bookTitle}" is due on ${dueDateStr}.\n\nArcadian Library`;

  try {
    if (window.emailjs) {
      await window.emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", {
        to_email: userEmail,
        book_title: bookTitle,
        due_date: dueDateStr,
        fine_amount: fineAmount,
        message: bodyText
      });
      alert(`Email sent successfully to ${userEmail}!`);
    } else {
      window.location.href = `mailto:${userEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;
    }
  } catch (err) {
    window.location.href = `mailto:${userEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;
  }
};

if (togglePasswordVisibilityBtn && authPassword && passwordEyeIcon) {
  togglePasswordVisibilityBtn.addEventListener("click", () => {
    const isPassword = authPassword.getAttribute("type") === "password";
    authPassword.setAttribute("type", isPassword ? "text" : "password");
    if (isPassword) {
      passwordEyeIcon.classList.remove("fa-eye");
      passwordEyeIcon.classList.add("fa-eye-slash");
    } else {
      passwordEyeIcon.classList.remove("fa-eye-slash");
      passwordEyeIcon.classList.add("fa-eye");
    }
  });
}

function switchAdminTab(targetTab) {
  const tabs = ["catalog", "pending", "borrowing", "fines", "students"];

  tabs.forEach(tab => {
    const page = document.getElementById(`page-${tab}`);
    const btn = document.getElementById(`tab-btn-${tab}`);

    if (page) page.classList.add("hidden");
    if (btn) btn.className = "admin-tab-btn bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 sm:px-4 py-2 rounded-xl transition flex items-center gap-2 whitespace-nowrap text-[11px] sm:text-xs";
  });

  const activePage = document.getElementById(`page-${targetTab}`);
  const activeBtn = document.getElementById(`tab-btn-${targetTab}`);

  if (activePage) activePage.classList.remove("hidden");
  if (activeBtn) activeBtn.className = "admin-tab-btn active bg-indigo-600 text-white px-3 sm:px-4 py-2 rounded-xl transition flex items-center gap-2 whitespace-nowrap text-[11px] sm:text-xs";
}

["catalog", "pending", "borrowing", "fines", "students"].forEach(tab => {
  document.getElementById(`tab-btn-${tab}`)?.addEventListener("click", () => switchAdminTab(tab));
});

function renderCategoryPills(books) {
  const genresSet = new Set();
  books.forEach(b => {
    if (b.category && b.category.trim() !== "") {
      genresSet.add(b.category.trim());
    }
  });

  const uniqueGenres = Array.from(genresSet).sort();

  if (categoryPillsContainer) {
    let html = `
      <span class="text-xs font-bold uppercase tracking-wider text-slate-400 mr-2 flex-shrink-0">Filter:</span>
      <button class="cat-pill ${activeCategoryFilter === 'ALL' ? 'bg-indigo-600 text-white font-bold' : 'bg-white text-slate-700 font-medium hover:bg-slate-100'} px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs shadow-sm transition whitespace-nowrap" data-cat="ALL">
        All Categories
      </button>
    `;

    uniqueGenres.forEach(genre => {
      const isActive = activeCategoryFilter.toLowerCase() === genre.toLowerCase();
      html += `
        <button class="cat-pill ${isActive ? 'bg-indigo-600 text-white font-bold' : 'bg-white text-slate-700 font-medium hover:bg-slate-100'} px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs shadow-sm transition whitespace-nowrap" data-cat="${escapeHtml(genre)}">
          ${escapeHtml(genre)}
        </button>
      `;
    });

    categoryPillsContainer.innerHTML = html;

    categoryPillsContainer.querySelectorAll(".cat-pill").forEach((pill) => {
      pill.addEventListener("click", (e) => {
        activeCategoryFilter = e.currentTarget.getAttribute("data-cat");
        catalogCurrentPage = 1;
        renderCategoryPills(allBooks);
        renderTopBooks(allBooks);
        renderBookTable(allBooks);
      });
    });
  }

  if (categoryManagerList) {
    if (uniqueGenres.length === 0) {
      categoryManagerList.innerHTML = `<p class="text-xs text-slate-400 italic">No custom categories found.</p>`;
      return;
    }

    categoryManagerList.innerHTML = uniqueGenres.map(genre => {
      return `
        <div class="flex items-center justify-between bg-slate-50 border border-slate-200/80 px-3 py-1.5 rounded-xl text-xs">
          <span class="font-bold text-slate-700">${escapeHtml(genre)}</span>
          <button onclick="handleDeleteCategory('${escapeHtml(genre)}')" class="text-red-600 hover:text-red-700 hover:bg-red-50 p-1 rounded-lg transition font-semibold" title="Delete Category">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
      `;
    }).join("");
  }
}

window.handleDeleteCategory = async (categoryToDelete) => {
  if (currentUserRole !== "admin") {
    alert("Only Admins can delete categories.");
    return;
  }

  if (confirm(`Are you sure you want to delete the "${categoryToDelete}" category? All books under this category will revert to "General".`)) {
    try {
      const booksToUpdate = allBooks.filter(b => b.category && b.category.toLowerCase().trim() === categoryToDelete.toLowerCase().trim());
      const updatePromises = booksToUpdate.map(b => updateDoc(doc(db, "books", b.id), { category: "General" }));
      await Promise.all(updatePromises);

      if (activeCategoryFilter.toLowerCase().trim() === categoryToDelete.toLowerCase().trim()) {
        activeCategoryFilter = "ALL";
      }

      alert(`Category "${categoryToDelete}" deleted. Updated ${booksToUpdate.length} book(s) to "General".`);
    } catch (err) {
      alert("Error deleting category: " + err.message);
    }
  }
};

function promptAddNewCategory() {
  if (!categoryInput) return;
  const newCat = prompt("Enter new category name:");
  if (newCat && newCat.trim() !== "") {
    const trimmed = newCat.trim();
    let exists = false;
    for (let option of categoryInput.options) {
      if (option.value.toLowerCase() === trimmed.toLowerCase()) {
        exists = true;
        categoryInput.value = option.value;
        break;
      }
    }

    if (!exists) {
      const newOption = document.createElement("option");
      newOption.value = trimmed;
      newOption.textContent = trimmed;
      categoryInput.insertBefore(newOption, categoryInput.lastElementChild);
      categoryInput.value = trimmed;
    }
  } else {
    categoryInput.value = "General";
  }
}

function promptAddNewSubCategory() {
  if (!subCategoryInput) return;
  const newSubCat = prompt("Enter new sub-genre name:");
  if (newSubCat && newSubCat.trim() !== "") {
    const trimmed = newSubCat.trim();
    
    if (subCategoryInput.tagName === "SELECT") {
      let exists = false;
      for (let option of subCategoryInput.options) {
        if (option.value.toLowerCase() === trimmed.toLowerCase()) {
          exists = true;
          subCategoryInput.value = option.value;
          break;
        }
      }

      if (!exists) {
        const newOption = document.createElement("option");
        newOption.value = trimmed;
        newOption.textContent = trimmed;
        subCategoryInput.insertBefore(newOption, subCategoryInput.lastElementChild);
        subCategoryInput.value = trimmed;
      }
    } else {
      subCategoryInput.value = trimmed;
    }
  }
}

if (categoryInput) {
  categoryInput.addEventListener("change", (e) => {
    if (e.target.value === "__ADD_NEW__") {
      promptAddNewCategory();
    }
  });
}

if (quickAddCatBtn) {
  quickAddCatBtn.addEventListener("click", promptAddNewCategory);
}

if (subCategoryInput) {
  subCategoryInput.addEventListener("change", (e) => {
    if (e.target.value === "__ADD_NEW__") {
      promptAddNewSubCategory();
    }
  });
}

if (quickAddSubCatBtn) {
  quickAddSubCatBtn.addEventListener("click", promptAddNewSubCategory);
}

function populateCategoriesFromBooks(books) {
  if (!categoryInput) return;
  const existingValues = Array.from(categoryInput.options).map(opt => opt.value.toLowerCase());

  books.forEach(b => {
    if (b.category && !existingValues.includes(b.category.toLowerCase())) {
      const newOption = document.createElement("option");
      newOption.value = b.category;
      newOption.textContent = b.category;
      categoryInput.insertBefore(newOption, categoryInput.lastElementChild);
      existingValues.push(b.category.toLowerCase());
    }
  });
}

if (isLoginPage) {
  if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener("click", async () => {
      const email = authEmail.value.trim();
      if (!email) {
        if (authError) {
          authError.textContent = "Please enter your email address above, then click Forgot Password.";
          authError.classList.remove("hidden");
        }
        return;
      }

      try {
        await sendPasswordResetEmail(auth, email);
        alert(`Password reset link sent to ${email}. Check your email inbox!`);
      } catch (err) {
        if (authError) {
          authError.textContent = err.message;
          authError.classList.remove("hidden");
        }
      }
    });
  }

  if (googleSigninBtn) {
    googleSigninBtn.addEventListener("click", async () => {
      if (authError) authError.classList.add("hidden");
      try {
        await signInWithPopup(auth, googleProvider);
      } catch (err) {
        if (authError) {
          authError.textContent = err.message;
          authError.classList.remove("hidden");
        }
      }
    });
  }

  if (toggleAuthModeBtn) {
    toggleAuthModeBtn.addEventListener("click", () => {
      isSignUpMode = !isSignUpMode;
      if (authError) authError.classList.add("hidden");
      
      if (isSignUpMode) {
        authTitle.textContent = "Create an Account";
        authSubtitle.textContent = "Register as a student to access Arcadian Library";
        authSubmitBtn.textContent = "Sign Up";
        toggleAuthModeBtn.textContent = "Already have an account? Sign In";
        if (signupFieldsContainer) signupFieldsContainer.classList.remove("hidden");
        if (studentIdContainer) studentIdContainer.classList.remove("hidden");
      } else {
        authTitle.textContent = "Welcome Back";
        authSubtitle.textContent = "Sign in to access Arcadian Library Portal";
        authSubmitBtn.textContent = "Sign In";
        toggleAuthModeBtn.textContent = "Don't have an account? Sign Up";
        if (signupFieldsContainer) signupFieldsContainer.classList.add("hidden");
        if (studentIdContainer) studentIdContainer.classList.add("hidden");
      }
    });
  }

  if (authForm) {
    authForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (authError) authError.classList.add("hidden");
      
      const email = authEmail.value.trim();
      const password = authPassword.value;
      const firstName = authFirstName ? authFirstName.value.trim() : "";
      const lastName = authLastName ? authLastName.value.trim() : "";
      const studentId = authStudentId ? authStudentId.value.trim() : "";

      if (isSignUpMode) {
        if (!firstName || !lastName) {
          if (authError) {
            authError.textContent = "Please enter your First Name and Last Name.";
            authError.classList.remove("hidden");
          }
          return;
        }

        if (!studentId) {
          if (authError) {
            authError.textContent = "Please enter your valid Student ID Number.";
            authError.classList.remove("hidden");
          }
          return;
        }
      }

      try {
        if (isSignUpMode) {
          const userCred = await createUserWithEmailAndPassword(auth, email, password);
          await syncUserProfile(userCred.user, studentId, firstName, lastName);
          alert("Account created! Your registration is now pending Admin approval.");
        } else {
          await signInWithEmailAndPassword(auth, email, password);
        }
      } catch (err) {
        if (authError) {
          authError.textContent = formatAuthError(err.code);
          authError.classList.remove("hidden");
        }
      }
    });
  }
}

function formatAuthError(code) {
  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Invalid email or password.";
    case "auth/email-already-in-use":
      return "An account with this email already exists.";
    case "auth/weak-password":
      return "Password should be at least 6 characters long.";
    default:
      return "Authentication failed. Please try again.";
  }
}

if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    try {
      await signOut(auth);
      window.location.href = "index.html";
    } catch (err) {
      console.error("Logout Error:", err);
    }
  });
}

function listenToAllStudentRecords() {
  if (unsubscribeAllRecordsSnapshot) unsubscribeAllRecordsSnapshot();

  unsubscribeAllRecordsSnapshot = onSnapshot(borrowedCollection, (snapshot) => {
    activeStudentRecords = [];
    cancelledStudentRecords = [];

    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const record = { id: docSnap.id, ...data };

      if (data.status === "cancelled") {
        cancelledStudentRecords.push(record);
      } else {
        activeStudentRecords.push(record);
      }
    });

    if (recordsCountBadge) recordsCountBadge.textContent = `${activeStudentRecords.length} Records`;

    renderStudentRecordsTable();
    renderCancelledRequestsTable();
    renderFinesTable();
  });
}

function renderCancelledRequestsTable() {
  if (!cancelledRequestsTbody) return;

  if (cancelledStudentRecords.length === 0) {
    cancelledRequestsTbody.innerHTML = `<tr><td colspan="5" class="py-6 text-center text-slate-400 font-medium">No cancelled borrow requests history.</td></tr>`;
    return;
  }

  cancelledRequestsTbody.innerHTML = cancelledStudentRecords.map((rec) => {
    const cancelledDate = rec.cancelledAt ? new Date(rec.cancelledAt.seconds * 1000).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A';

    return `
      <tr class="hover:bg-slate-50 transition border-b border-slate-100">
        <td class="py-3 px-3 sm:px-4">
          <div class="font-bold text-slate-800">ID: ${escapeHtml(rec.studentId || 'N/A')}</div>
          <div class="text-[11px] text-slate-500">${escapeHtml(rec.userEmail)}</div>
        </td>
        <td class="py-3 px-3 sm:px-4 font-bold text-slate-900">${escapeHtml(rec.bookTitle)}</td>
        <td class="py-3 px-2 sm:px-3 text-center">
          <span class="px-2 py-0.5 text-[10px] font-bold uppercase rounded-full bg-red-100 text-red-800 border border-red-200">Cancelled</span>
        </td>
        <td class="py-3 px-2 sm:px-3 text-center text-slate-600 font-medium">${cancelledDate}</td>
        <td class="py-3 px-3 sm:px-4 text-center">
          <button onclick="handleRemoveBorrowRecord('${rec.id}')" class="px-2 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-red-50 hover:text-red-700 text-slate-600 border border-slate-200 transition">
            Delete
          </button>
        </td>
      </tr>
    `;
  }).join("");
}

window.handleClearCancelledHistory = async () => {
  if (cancelledStudentRecords.length === 0) {
    alert("Cancelled history is already empty.");
    return;
  }

  if (confirm("Are you sure you want to permanently clear all cancelled request records?")) {
    try {
      const deletePromises = cancelledStudentRecords.map(rec => deleteDoc(doc(db, "borrowed_books", rec.id)));
      await Promise.all(deletePromises);
      alert("Cancelled requests history cleared successfully!");
    } catch (err) {
      alert("Failed to clear history: " + err.message);
    }
  }
};

function renderFinesTable() {
  if (!finesRecordsTbody) return;

  const totalUnpaidDisplay = document.getElementById("total-unpaid-fines-display");
  const totalCollectedDisplay = document.getElementById("total-collected-fines-display");
  const semesterFilter = document.getElementById("fine-semester-filter")?.value || "ALL";

  let totalUnpaid = 0;
  let totalCollected = 0;
  let fineRowsHtml = '';

  activeStudentRecords.forEach((rec) => {
    const dueDateObj = rec.dueDate ? new Date(rec.dueDate.seconds * 1000) : null;
    const fineDetails = calculateOverdueFine(dueDateObj);

    if (semesterFilter !== "ALL" && rec.semester !== semesterFilter) {
      return;
    }

    if (fineDetails.isOverdue || rec.finePaid) {
      const currentFine = rec.finePaid ? (rec.fineAmountPaid || 0) : fineDetails.fineAmount;

      if (rec.finePaid) {
        totalCollected += currentFine;
      } else {
        totalUnpaid += currentFine;
      }

      fineRowsHtml += `
        <tr class="hover:bg-slate-50 transition border-b border-slate-100">
          <td class="py-3 px-4">
            <div class="font-bold text-slate-900">ID: ${escapeHtml(rec.studentId || 'N/A')}</div>
            <div class="text-[11px] text-slate-500">${escapeHtml(rec.userEmail)}</div>
          </td>
          <td class="py-3 px-4 font-bold text-slate-900">${escapeHtml(rec.bookTitle)}</td>
          <td class="py-3 px-3 text-center font-bold text-slate-700">${fineDetails.daysLate} Day(s)</td>
          <td class="py-3 px-3 text-center font-bold text-red-600">₱${currentFine.toFixed(2)}</td>
          <td class="py-3 px-3 text-center">
            <span class="px-2 py-0.5 text-[10px] uppercase font-bold rounded-full ${rec.finePaid ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-red-100 text-red-800 border border-red-200'}">
              ${rec.finePaid ? 'Paid (Over-the-Counter)' : 'Unpaid'}
            </span>
          </td>
          <td class="py-3 px-4 text-center">
            <div class="flex justify-center items-center gap-1.5 flex-wrap">
              ${!rec.finePaid ? `
                <button onclick="handleMarkFinePaid('${rec.id}', ${currentFine})" class="px-2.5 py-1 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-sm" title="Accept Cash at School Library">
                  <i class="fa-solid fa-money-bill-wave mr-1"></i> Pay OTC
                </button>
              ` : `
                <button onclick="handlePrintFineReceipt('${escapeQuotes(rec.studentId)}', '${escapeQuotes(rec.userEmail)}', '${escapeQuotes(rec.bookTitle)}', ${currentFine})" class="px-2 py-1 text-xs font-semibold rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition" title="Print Over-the-Counter Cash Receipt">
                  <i class="fa-solid fa-print"></i> Receipt
                </button>
              `}
              <button onclick="handleClearFineRecord('${rec.id}')" class="px-2 py-1 text-xs font-semibold rounded-lg bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 transition" title="Clear Record">
                <i class="fa-solid fa-trash-can"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    }
  });

  if (totalUnpaidDisplay) totalUnpaidDisplay.textContent = `₱${totalUnpaid.toFixed(2)}`;
  if (totalCollectedDisplay) totalCollectedDisplay.textContent = `₱${totalCollected.toFixed(2)}`;

  if (fineRowsHtml === '') {
    finesRecordsTbody.innerHTML = `<tr><td colspan="6" class="py-6 text-center text-slate-400 font-medium">No overdue fines or payment records found for the selected filter.</td></tr>`;
  } else {
    finesRecordsTbody.innerHTML = fineRowsHtml;
  }
}

window.handleMarkFinePaid = async (recordId, fineAmount) => {
  if (confirm(`Confirm cash payment of ₱${fineAmount}.00 over the counter at the school library?`)) {
    try {
      await updateDoc(doc(db, "borrowed_books", recordId), {
        finePaid: true,
        fineAmountPaid: fineAmount,
        paymentMethod: "Over-the-Counter Cash",
        paidAt: new Date()
      });
      alert("Over-the-counter cash payment recorded successfully!");
    } catch (err) {
      alert("Payment recording failed: " + err.message);
    }
  }
};

window.handleClearFineRecord = async (recordId) => {
  if (currentUserRole !== "admin") {
    alert("Only Admins can clear fine records.");
    return;
  }

  if (confirm("Are you sure you want to clear/delete this fine record?")) {
    try {
      await deleteDoc(doc(db, "borrowed_books", recordId));
      alert("Fine record cleared successfully.");
    } catch (err) {
      alert("Failed to clear fine record: " + err.message);
    }
  }
};

window.handleResetCollections = () => {
  if (confirm("Reset total settled collections display counter for this session?")) {
    const totalCollectedDisplay = document.getElementById("total-collected-fines-display");
    if (totalCollectedDisplay) totalCollectedDisplay.textContent = "₱0.00";
    alert("Settled collections total counter reset.");
  }
};

window.handlePrintFineReceipt = (studentId, userEmail, bookTitle, fineAmount) => {
  const receiptWindow = window.open("", "_blank", "width=600,height=600");
  const printContent = `
    <html>
      <head>
        <title>Arcadian Library - Official Cash Receipt</title>
        <style>
          body { font-family: sans-serif; padding: 20px; color: #333; }
          .header { text-align: center; border-bottom: 2px dashed #ccc; padding-bottom: 10px; margin-bottom: 15px; }
          .title { font-size: 18px; font-weight: bold; }
          .sub { font-size: 12px; color: #666; }
          .row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 13px; }
          .total { border-top: 2px solid #000; padding-top: 10px; font-size: 16px; font-weight: bold; margin-top: 15px; }
          .footer { margin-top: 30px; text-align: center; font-size: 11px; color: #777; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">Arcadian School Library</div>
          <div class="sub">Official Over-the-Counter Payment Receipt</div>
        </div>
        <div class="row"><strong>Date:</strong> <span>${new Date().toLocaleDateString()}</span></div>
        <div class="row"><strong>Student ID:</strong> <span>${studentId}</span></div>
        <div class="row"><strong>Student Email:</strong> <span>${userEmail}</span></div>
        <div class="row"><strong>Book Returned:</strong> <span>${bookTitle}</span></div>
        <div class="row"><strong>Payment Method:</strong> <span>Over-the-Counter Cash</span></div>
        <div class="total">Total Paid: ₱${fineAmount.toFixed(2)}</div>
        <div class="footer">
          <p>Thank you for settling your library dues!</p>
          <p>Arcadian Library System &copy; 2026</p>
        </div>
        <script>window.print();</script>
      </body>
    </html>
  `;
  receiptWindow.document.write(printContent);
  receiptWindow.document.close();
};

window.exportFinesToCSV = () => {
  if (activeStudentRecords.length === 0) {
    alert("No fine records available to export.");
    return;
  }

  const headers = ["Student ID", "Student Email", "Book Title", "Days Overdue", "Fine Amount (PHP)", "Payment Status", "Payment Channel"];
  const csvRows = [headers.join(",")];

  activeStudentRecords.forEach((rec) => {
    const dueDateObj = rec.dueDate ? new Date(rec.dueDate.seconds * 1000) : null;
    const fineDetails = calculateOverdueFine(dueDateObj);

    if (fineDetails.isOverdue || rec.finePaid) {
      const studentId = `"${(rec.studentId || 'N/A').replace(/"/g, '""')}"`;
      const userEmail = `"${(rec.userEmail || '').replace(/"/g, '""')}"`;
      const bookTitle = `"${(rec.bookTitle || '').replace(/"/g, '""')}"`;
      const daysLate = fineDetails.daysLate;
      const fineAmount = rec.finePaid ? (rec.fineAmountPaid || 0) : fineDetails.fineAmount;
      const status = rec.finePaid ? '"Paid"' : '"Unpaid"';
      const channel = '"Over-the-Counter Cash"';

      csvRows.push([studentId, userEmail, bookTitle, daysLate, fineAmount, status, channel].join(","));
    }
  });

  const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `arcadian_fines_report_${new Date().toISOString().slice(0,10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

window.handleRemoveBorrowRecord = async (recordId) => {
  if (currentUserRole !== "admin") {
    alert("Only Admins can delete borrowing records.");
    return;
  }

  if (confirm("Are you sure you want to remove this record?")) {
    try {
      await deleteDoc(doc(db, "borrowed_books", recordId));
    } catch (err) {
      alert("Error deleting record: " + err.message);
    }
  }
};

window.handleLeaveAdminRole = async () => {
  const user = auth.currentUser;
  if (!user) return;

  if (confirm("Are you sure you want to step down from the Admin role? Your privileges will revert to a standard Student account.")) {
    try {
      await updateDoc(doc(db, "users", user.uid), { role: "student" });
      alert("Role updated! You are now set back to a Student account.");
      window.location.href = "student-dashboard.html";
    } catch (err) {
      alert("Failed to update role: " + err.message);
    }
  }
};

window.handleTransferAdminRole = async (targetUserId, userEmail) => {
  if (currentUserRole !== "admin") {
    alert("Only active Admins can grant or transfer Admin privileges.");
    return;
  }

  if (confirm(`Are you sure you want to promote ${userEmail} to an Admin?`)) {
    try {
      await updateDoc(doc(db, "users", targetUserId), { role: "admin", approved: true });
      alert(`Successfully promoted ${userEmail} to Admin!`);
      loadRegisteredStudents();
    } catch (err) {
      alert("Error promoting user: " + err.message);
    }
  }
};

window.handleApproveStudent = async (studentDocId) => {
  try {
    await updateDoc(doc(db, "users", studentDocId), { approved: true });
    alert("Student account successfully approved!");
    loadRegisteredStudents();
  } catch (err) {
    alert("Failed to approve student account.");
  }
};

window.handleSendUserPasswordReset = async (userEmail) => {
  if (currentUserRole !== "admin") {
    alert("Only Admins can trigger user password resets.");
    return;
  }

  if (confirm(`Send a password reset email to ${userEmail}?`)) {
    try {
      await sendPasswordResetEmail(auth, userEmail);
      alert(`Password reset link sent to ${userEmail}!`);
    } catch (err) {
      alert("Error sending reset link: " + err.message);
    }
  }
};

if (adminResetPwdBtn) {
  adminResetPwdBtn.addEventListener("click", async () => {
    const user = auth.currentUser;
    if (!user || !user.email) return;

    try {
      await sendPasswordResetEmail(auth, user.email);
      if (adminResetAlert) {
        adminResetAlert.textContent = `Password reset link sent to ${user.email}. Check inbox.`;
        adminResetAlert.className = "p-3 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200";
        adminResetAlert.classList.remove("hidden");
      }
    } catch (err) {
      if (adminResetAlert) {
        adminResetAlert.textContent = "Error sending reset email: " + err.message;
        adminResetAlert.className = "p-3 rounded-xl text-xs font-semibold bg-red-50 text-red-800 border border-red-200";
        adminResetAlert.classList.remove("hidden");
      }
    }
  });
}

function listenToPendingBorrowRequests() {
  if (unsubscribePendingSnapshot) unsubscribePendingSnapshot();

  const q = query(borrowedCollection, where("status", "==", "pending"));

  unsubscribePendingSnapshot = onSnapshot(q, (snapshot) => {
    const pendingList = [];
    snapshot.forEach((docSnap) => {
      pendingList.push({ id: docSnap.id, ...docSnap.data() });
    });

    if (pendingRequestBadge) pendingRequestBadge.textContent = `${pendingList.length} Pending`;

    if (!pendingRequestsTbody) return;

    if (pendingList.length === 0) {
      pendingRequestsTbody.innerHTML = `<tr><td colspan="4" class="py-6 text-center text-slate-400 font-medium">No pending borrow requests.</td></tr>`;
      return;
    }

    pendingRequestsTbody.innerHTML = pendingList.map((req) => {
      const reqDate = req.borrowedAt ? new Date(req.borrowedAt.seconds * 1000).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A';
      const duration = req.durationDays || 7;

      return `
        <tr class="hover:bg-slate-50 transition">
          <td class="py-3 px-3 sm:px-4">
            <div class="font-bold text-indigo-900">ID: ${escapeHtml(req.studentId || 'N/A')}</div>
            <div class="text-[11px] text-slate-500">${escapeHtml(req.userEmail)}</div>
          </td>
          <td class="py-3 px-3 sm:px-4">
            <div class="font-bold text-slate-900">${escapeHtml(req.bookTitle)}</div>
            <div class="text-[11px] text-slate-400">by ${escapeHtml(req.bookAuthor)}</div>
          </td>
          <td class="py-3 px-2 sm:px-3 text-center text-slate-600 font-medium">
            <div>${reqDate}</div>
            <span class="inline-block mt-0.5 px-2 py-0.5 text-[10px] bg-indigo-50 text-indigo-700 font-bold rounded-md">Requested: ${duration} Days</span>
          </td>
          <td class="py-3 px-3 sm:px-4 text-center">
            <div class="flex flex-col sm:flex-row justify-center items-center gap-1.5">
              <button onclick="handleApproveRequest('${req.id}', '${req.bookId}', ${duration})" class="px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition"><i class="fa-solid fa-check mr-1"></i> Approve</button>
              <button onclick="handleDeclineRequest('${req.id}')" class="px-2.5 py-1 text-xs font-semibold rounded-lg bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 transition"><i class="fa-solid fa-xmark mr-1"></i> Decline</button>
            </div>
          </td>
        </tr>
      `;
    }).join("");
  });
}

window.handleCancelMyRequest = async (requestId, bookId) => {
  if (confirm("Are you sure you want to cancel this pending borrow request?")) {
    try {
      if (bookId) {
        studentActiveBorrowedMap.delete(bookId);
        studentBorrowRecordMap.delete(bookId);
      }

      await updateDoc(doc(db, "borrowed_books", requestId), {
        status: "cancelled",
        cancelledAt: new Date()
      });

      renderBookTable(allBooks);
      renderBooksCatalogGrid(allBooks);
      alert("Borrow request cancelled!");
    } catch (err) {
      alert("Failed to cancel request: " + err.message);
    }
  }
};

window.handleDismissRecord = async (requestId) => {
  try {
    await deleteDoc(doc(db, "borrowed_books", requestId));
  } catch (err) {
    console.error("Dismiss failed:", err);
  }
};

function listenToBookCollection() {
  if (unsubscribeSnapshot) unsubscribeSnapshot();

  unsubscribeSnapshot = onSnapshot(booksCollection, (snapshot) => {
    allBooks = [];
    snapshot.forEach((docSnap) => {
      allBooks.push({ id: docSnap.id, ...docSnap.data() });
    });

    if (totalCountEl) updateDashboardStats(allBooks);
    populateCategoriesFromBooks(allBooks);
    renderCategoryPills(allBooks);
    renderTopBooks(allBooks);
    renderBookTable(allBooks);
    
    // Sync Dedicated Books Directory Page (books.html)
    populateGenreFilters(allBooks);
    renderBooksCatalogGrid(allBooks);
  }, (error) => {
    console.error("Firestore Listen Error:", error);
  });
}

function renderBookTable(books) {
  if (!tbody) return;

  const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : "";
  
  const filteredBooks = books.filter(b => {
    const matchesSearch = 
      b.title.toLowerCase().includes(searchTerm) ||
      b.author.toLowerCase().includes(searchTerm) ||
      (b.category && b.category.toLowerCase().includes(searchTerm)) ||
      (b.subCategory && b.subCategory.toLowerCase().includes(searchTerm)) ||
      (b.isbn && b.isbn.includes(searchTerm)) ||
      (b.summary && b.summary.toLowerCase().includes(searchTerm));

    const matchesCategory = 
      activeCategoryFilter === "ALL" || 
      (b.category && b.category.toLowerCase().trim() === activeCategoryFilter.toLowerCase().trim());

    return matchesSearch && matchesCategory;
  });

  if (catalogCountBadge) catalogCountBadge.textContent = `${filteredBooks.length} Books`;

  if (filteredBooks.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" class="py-12 text-center text-slate-400 font-medium">No books found matching the search criteria.</td></tr>`;
    if (catalogPageInfo) catalogPageInfo.textContent = "Page 0 of 0";
    return;
  }

  const totalPages = Math.ceil(filteredBooks.length / catalogItemsPerPage);
  if (catalogCurrentPage > totalPages) catalogCurrentPage = totalPages;
  if (catalogCurrentPage < 1) catalogCurrentPage = 1;

  const startIndex = (catalogCurrentPage - 1) * catalogItemsPerPage;
  const pageBooks = filteredBooks.slice(startIndex, startIndex + catalogItemsPerPage);

  if (catalogPageInfo) catalogPageInfo.textContent = `Page ${catalogCurrentPage} of ${totalPages}`;
  if (catalogPrevBtn) catalogPrevBtn.disabled = catalogCurrentPage === 1;
  if (catalogNextBtn) catalogNextBtn.disabled = catalogCurrentPage === totalPages;

  const isAdmin = currentUserRole === "admin";

  tbody.innerHTML = pageBooks.map((book) => {
    const isAvailable = book.available > 0;
    const requestStatus = studentActiveBorrowedMap.get(book.id);
    const activeBorrowRecordId = studentBorrowRecordMap.get(book.id) || "";
    const isBookmarked = studentBookmarkedMap.has(book.id);
    const subCatPill = book.subCategory ? `<span class="inline-block px-2 py-0.5 text-[10px] font-semibold rounded-full bg-slate-100 text-slate-600 border border-slate-200 ml-1">${escapeHtml(book.subCategory)}</span>` : '';

    return `
      <tr class="hover:bg-slate-50 transition">
        <td class="py-3 px-3 sm:px-4">
          <div class="flex items-center gap-3">
            ${renderBookCoverHTML(book.coverUrl, book.title, book.category, "w-10 h-14")}
            <div>
              <div class="flex items-center gap-2">
                <div class="font-bold text-slate-900 text-xs sm:text-sm">${escapeHtml(book.title)}</div>
                ${!isAdmin ? `
                  <button onclick="handleToggleBookmark('${book.id}')" class="text-xs p-1 rounded transition ${isBookmarked ? 'text-red-600 bg-red-50' : 'text-slate-300 hover:text-red-500'}" title="${isBookmarked ? 'Remove Bookmark' : 'Bookmark Book'}">
                    <i class="${isBookmarked ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
                  </button>
                ` : ''}
              </div>
              <div class="text-[11px] text-slate-500 font-medium">by ${escapeHtml(book.author)} ${book.isbn ? `• ISBN: ${escapeHtml(book.isbn)}` : ''}</div>
              <button onclick="openSummaryModal('${escapeQuotes(book.title)}', '${escapeQuotes(book.author)}', '${escapeQuotes(book.summary)}', '${escapeQuotes(book.category)}', '${escapeQuotes(book.coverUrl)}', '${escapeQuotes(book.subCategory || '')}')" class="mt-1 text-[10px] text-indigo-600 hover:underline font-bold inline-flex items-center gap-1">
                <i class="fa-solid fa-align-left"></i> Read Description & Summary
              </button>
            </div>
          </div>
        </td>
        <td class="py-3 px-2 sm:px-3">
          <span class="inline-block px-2 py-0.5 text-[10px] font-semibold rounded-full bg-slate-100 text-slate-700 border border-slate-200">${escapeHtml(book.category || 'General')}</span>
          ${subCatPill}
        </td>
        <td class="py-3 px-2 sm:px-3 text-center font-medium">
          <span class="${isAvailable ? 'text-emerald-600' : 'text-red-500'} font-bold">${book.available}</span> 
          <span class="text-slate-400">/ ${book.copies}</span>
        </td>
        <td class="py-3 px-3 sm:px-4 text-center">
          <div class="flex justify-center items-center gap-1.5 flex-wrap">
            ${!isAdmin ? `
              ${requestStatus === 'approved' ? `
                <button onclick="handleReturnAction('${book.id}', '${activeBorrowRecordId}')" class="px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition">Return</button>
              ` : requestStatus === 'pending' ? `
                <div class="flex items-center justify-center gap-1.5">
                  <span class="px-2 py-0.5 text-[10px] font-semibold rounded-lg bg-amber-50 text-amber-700 border border-amber-200"><i class="fa-solid fa-clock mr-1"></i> Requested</span>
                  <button onclick="handleCancelMyRequest('${activeBorrowRecordId}', '${book.id}')" class="px-2 py-1 text-xs font-semibold rounded-lg bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 transition" title="Cancel Request">
                    <i class="fa-solid fa-xmark"></i> Cancel Request
                  </button>
                </div>
              ` : `
                <div class="flex items-center justify-center gap-1">
                  <select id="duration-select-${book.id}" class="px-1.5 py-1 border border-slate-200 rounded-lg text-[11px] bg-slate-50 font-semibold focus:outline-none">
                    <option value="3">3d</option>
                    <option value="5">5d</option>
                    <option value="7" selected>7d</option>
                    <option value="14">14d</option>
                  </select>
                  <button onclick="handleBorrowAction('${book.id}', ${book.available})" class="px-2.5 py-1 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow transition ${book.available <= 0 ? 'opacity-40 cursor-not-allowed' : ''}" ${book.available <= 0 ? 'disabled' : ''}>Borrow</button>
                </div>
              `}
            ` : `
              <button onclick="populateEditForm('${book.id}')" class="px-2 py-1 text-xs font-semibold rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition flex items-center gap-1"><i class="fa-solid fa-pen-to-square"></i> Edit</button>
              <button onclick="handleDelete('${book.id}')" class="px-2 py-1 text-xs font-semibold rounded-lg bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 transition flex items-center gap-1"><i class="fa-solid fa-trash-can"></i> Delete</button>
            `}
          </div>
        </td>
      </tr>
    `;
  }).join("");
}

if (catalogPrevBtn) {
  catalogPrevBtn.addEventListener("click", () => {
    if (catalogCurrentPage > 1) {
      catalogCurrentPage--;
      renderBookTable(allBooks);
    }
  });
}

if (catalogNextBtn) {
  catalogNextBtn.addEventListener("click", () => {
    const totalPages = Math.ceil(allBooks.length / catalogItemsPerPage);
    if (catalogCurrentPage < totalPages) {
      catalogCurrentPage++;
      renderBookTable(allBooks);
    }
  });
}

function updateDashboardStats(books) {
  let totalCopies = 0;
  let availableCopies = 0;

  books.forEach((b) => {
    totalCopies += Number(b.copies) || 0;
    availableCopies += Number(b.available) || 0;
  });

  const borrowedCopies = totalCopies - availableCopies;

  if (totalCountEl) totalCountEl.textContent = totalCopies;
  if (availableCountEl) availableCountEl.textContent = availableCopies;
  if (borrowedCountEl) borrowedCountEl.textContent = borrowedCopies < 0 ? 0 : borrowedCopies;
}

if (bookForm) {
  bookForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (currentUserRole !== "admin") {
      alert("Only Admins can modify books.");
      return;
    }

    const id = bookIdInput.value;
    let categoryValue = categoryInput.value;

    if (categoryValue === "__ADD_NEW__") {
      const newCat = prompt("Enter category name:");
      categoryValue = newCat && newCat.trim() !== "" ? newCat.trim() : "General";
    }

    let subCategoryValue = subCategoryInput ? subCategoryInput.value : "";
    if (subCategoryValue === "__ADD_NEW__") {
      const newSubCat = prompt("Enter sub-genre name:");
      subCategoryValue = newSubCat && newSubCat.trim() !== "" ? newSubCat.trim() : "";
    }

    const bookData = {
      title: titleInput.value.trim(),
      author: authorInput.value.trim(),
      isbn: isbnInput.value.trim(),
      summary: summaryInput ? summaryInput.value.trim() : "",
      coverUrl: coverUrlInput ? coverUrlInput.value.trim() : "",
      category: categoryValue,
      subCategory: subCategoryValue ? subCategoryValue.trim() : "",
      copies: parseInt(copiesInput.value, 10),
      available: parseInt(availableInput.value, 10)
    };

    try {
      if (id) {
        await updateDoc(doc(db, "books", id), bookData);
      } else {
        await addDoc(booksCollection, bookData);
      }
      resetForm();
    } catch (err) {
      alert("Error saving book: " + err.message);
    }
  });
}

window.populateEditForm = (id) => {
  if (!isAdminPage) {
    sessionStorage.setItem("editBookId", id);
    window.location.href = "admin-dashboard.html";
    return;
  }

  switchAdminTab("catalog");

  const book = allBooks.find((b) => b.id === id);
  if (!book) return;

  if (bookIdInput) bookIdInput.value = book.id;
  if (titleInput) titleInput.value = book.title;
  if (authorInput) authorInput.value = book.author;
  if (isbnInput) isbnInput.value = book.isbn || "";
  if (summaryInput) summaryInput.value = book.summary || "";
  if (coverUrlInput) coverUrlInput.value = book.coverUrl || "";
  if (subCategoryInput) subCategoryInput.value = book.subCategory || "";
  
  if (categoryInput) {
    const catVal = book.category || "General";
    let hasOption = Array.from(categoryInput.options).some(opt => opt.value === catVal);
    if (!hasOption) {
      const newOpt = document.createElement("option");
      newOpt.value = catVal;
      newOpt.textContent = catVal;
      categoryInput.insertBefore(newOpt, categoryInput.lastElementChild);
    }
    categoryInput.value = catVal;
  }

  if (copiesInput) copiesInput.value = book.copies;
  if (availableInput) availableInput.value = book.available;

  if (formTitle) formTitle.innerHTML = `<i class="fa-solid fa-pen-to-square text-indigo-600"></i> Edit Book Details`;
  if (submitBtn) submitBtn.innerHTML = `<i class="fa-solid fa-check"></i> Update Book`;
  if (cancelBtn) cancelBtn.classList.remove("hidden");

  if (bookForm) bookForm.scrollIntoView({ behavior: 'smooth' });
};

function resetForm() {
  if (!bookForm) return;
  bookIdInput.value = "";
  bookForm.reset();
  formTitle.innerHTML = `<i class="fa-solid fa-plus-circle text-indigo-600"></i> Add New Book`;
  submitBtn.innerHTML = `<i class="fa-solid fa-floppy-disk"></i> Save Book`;
  cancelBtn.classList.add("hidden");
}

if (cancelBtn) cancelBtn.addEventListener("click", resetForm);

window.handleBorrowAction = async (bookId, currentAvailable) => {
  if (!auth.currentUser) {
    alert("Please sign in or register to submit borrowing requests.");
    window.location.href = "login.html";
    return;
  }

  if (currentUserRole === "admin") {
    alert("Admins cannot request to borrow books.");
    return;
  }

  if (currentAvailable <= 0) {
    alert("This book is out of stock.");
    return;
  }

  const book = allBooks.find(b => b.id === bookId);
  if (!book) return;

  const user = auth.currentUser;

  if (studentActiveBorrowedMap.has(bookId)) {
    alert("You already have an active request or borrowed copy for this book.");
    return;
  }

  const durationSelect = document.getElementById(`duration-select-${bookId}`);
  const requestedDays = durationSelect ? parseInt(durationSelect.value, 10) : 7;

  try {
    const userSnap = await getDoc(doc(db, "users", user.uid));
    const studentIdVal = userSnap.exists() ? (userSnap.data().studentId || "N/A") : "N/A";

    await addDoc(borrowedCollection, {
      bookId: bookId,
      bookTitle: book.title,
      bookAuthor: book.author,
      userId: user.uid,
      userEmail: user.email,
      studentId: studentIdVal,
      borrowedAt: new Date(),
      durationDays: requestedDays,
      dueDate: null,
      status: "pending",
      semester: activeSemesterCode || "UNASSIGNED"
    });

    alert(`Borrow request submitted for ${requestedDays} days! Waiting for Admin approval.`);
  } catch (err) {
    console.error("Request failed:", err);
  }
};

window.handleApproveRequest = async (requestId, bookId, durationDays = 7) => {
  try {
    const bookSnap = await getDoc(doc(db, "books", bookId));
    if (!bookSnap.exists()) return;

    const bookData = bookSnap.data();
    if ((bookData.available || 0) <= 0) return;

    const now = new Date();
    const dueDate = new Date();
    dueDate.setDate(now.getDate() + durationDays);

    await updateDoc(doc(db, "books", bookId), { available: bookData.available - 1 });
    await updateDoc(doc(db, "borrowed_books", requestId), {
      status: "approved",
      borrowedAt: now,
      dueDate: dueDate
    });
  } catch (err) {
    console.error("Approve failed:", err);
  }
};

window.handleDeclineRequest = async (requestId) => {
  try {
    await updateDoc(doc(db, "borrowed_books", requestId), { status: "declined" });
  } catch (err) {
    console.error("Decline failed:", err);
  }
};

window.handleReturnAction = async (bookId, borrowRecordId) => {
  if (!auth.currentUser) {
    window.location.href = "login.html";
    return;
  }

  const user = auth.currentUser;
  let docIdToUpdate = borrowRecordId;

  try {
    if (!docIdToUpdate) {
      const q = query(
        borrowedCollection,
        where("userId", "==", user.uid),
        where("bookId", "==", bookId),
        where("status", "==", "approved")
      );
      const querySnap = await getDocs(q);
      if (!querySnap.empty) {
        docIdToUpdate = querySnap.docs[0].id;
      }
    }

    const bookSnap = await getDoc(doc(db, "books", bookId));
    if (bookSnap.exists()) {
      const bookData = bookSnap.data();
      await updateDoc(doc(db, "books", bookId), { available: (bookData.available || 0) + 1 });
    }

    if (docIdToUpdate) {
      await updateDoc(doc(db, "borrowed_books", docIdToUpdate), {
        status: "returned",
        returnedAt: new Date()
      });

      if (bookId) {
        studentActiveBorrowedMap.delete(bookId);
        studentBorrowRecordMap.delete(bookId);
      }

      alert("Book returned successfully!");
    }
  } catch (err) {
    alert("Return transaction failed: " + err.message);
  }
};

window.handleDelete = async (id) => {
  if (currentUserRole !== "admin") {
    alert("Only Admins can delete books.");
    return;
  }

  if (confirm("Are you sure you want to delete this book?")) {
    try {
      await deleteDoc(doc(db, "books", id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  }
};

if (searchInput) {
  searchInput.addEventListener("input", () => {
    catalogCurrentPage = 1;
    renderBookTable(allBooks);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderAdminCalendar();
});
