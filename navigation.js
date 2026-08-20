// Shared responsive navigation and hero preview swapper used by Intervoxa pages.
const menuToggle = document.querySelector(".menu-toggle");
const primaryNavigation = document.querySelector("#primaryNavigation");

function closeMenu() {
  menuToggle?.setAttribute("aria-expanded", "false");
  primaryNavigation?.classList.remove("is-open");
}

menuToggle?.addEventListener("click", () => {
  const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isExpanded));
  primaryNavigation?.classList.toggle("is-open");
});

primaryNavigation?.addEventListener("click", (event) => {
  if (event.target instanceof HTMLAnchorElement) {
    closeMenu();
  }
});

window.addEventListener("resize", () => {
  if (window.innerWidth >= 768) {
    closeMenu();
  }
});

// Interactive Hero Question Preview Switcher
const heroRoleTitle = document.querySelector("#heroRoleTitle");
const heroQuestionText = document.querySelector("#heroQuestionText");
const heroAnswerHint = document.querySelector("#heroAnswerHint");
const heroNextQuestionBtn = document.querySelector("#heroNextQuestionBtn");

const heroQuestions = [
  { role: "Java Developer Round", question: "Explain the difference between ArrayList and LinkedList with one real use case.", hint: "Tip: Highlight O(1) random access vs O(1) insertion/deletion at endpoints." },
  { role: "Frontend Developer Round", question: "How does the Browser Event Loop handle Async tasks, Microtasks, and Macrotasks?", hint: "Tip: Contrast Promise resolution (Microtasks) with setTimeout/setInterval (Macrotasks)." },
  { role: "Python Developer Round", question: "What is the difference between shallow copy and deep copy in Python?", hint: "Tip: Explain how nested objects retain references in shallow copies." },
  { role: "AI / ML Engineer Round", question: "What is Overfitting in machine learning, and how do you mitigate it?", hint: "Tip: Mention L1/L2 regularization, dropout, cross-validation, and more training data." },
  { role: "HR & Behavioral Round", question: "Tell me about a technical project failure you experienced and how you resolved it.", hint: "Tip: Use the STAR framework: Situation, Task, Action, and Result with key learnings." },
];

let heroIndex = 0;

heroNextQuestionBtn?.addEventListener("click", () => {
  heroIndex = (heroIndex + 1) % heroQuestions.length;
  const current = heroQuestions[heroIndex];
  if (heroRoleTitle) heroRoleTitle.textContent = current.role;
  if (heroQuestionText) heroQuestionText.textContent = current.question;
  if (heroAnswerHint) heroAnswerHint.textContent = current.hint;
});
