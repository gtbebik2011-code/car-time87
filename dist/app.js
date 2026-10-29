const slides = [...document.querySelectorAll('.hero-image')];
const slideButtons = [...document.querySelectorAll('.slide-button')];
const carNames = ['Porsche', 'BMW', 'Audi'];
slideButtons.forEach((button, index) => button.addEventListener('click', () => {
  slides.forEach((slide, i) => slide.classList.toggle('is-active', i === index));
  slideButtons.forEach((control, i) => {
    control.classList.toggle('is-active', i === index);
    control.setAttribute('aria-pressed', String(i === index));
  });
  document.querySelector('#slide-status').textContent = `Фото ${index + 1} з 3 — ${carNames[index]}`;
}));

const menuToggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('.mobile-nav');
function closeMenu() {
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Відкрити меню');
  menu.hidden = true;
}
menuToggle.addEventListener('click', () => {
  const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Відкрити меню' : 'Закрити меню');
  menu.hidden = isOpen;
});
menu.querySelectorAll('a,button').forEach(item => item.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
document.addEventListener('click', event => {
  if (!menu.hidden && !menu.contains(event.target) && !menuToggle.contains(event.target)) closeMenu();
});
window.matchMedia('(min-width:701px)').addEventListener('change', event => { if (event.matches) closeMenu(); });

const services = [
  { title: 'Хімчистка інтер’єру', description: 'Чистота та свіжість у кожній деталі. Дбайливий догляд за сидіннями, оббивкою та поверхнями салону. Підберемо догляд з урахуванням матеріалів і стану вашого автомобіля.' },
  { title: 'Полірування кузова', description: 'Відновлюємо глибину кольору та блиск. Оцінимо стан лакофарбового покриття й підберемо відповідний догляд для вашого автомобіля.' },
  { title: 'Захисні покриття', description: 'Довготривалий захист вашого авто. Допоможемо підібрати покриття та розповімо, як підтримувати результат після процедури.' },
  { title: 'Відновлення оптики', description: 'Чітке світло та доглянутий вигляд фар. Оцінимо стан оптики та запропонуємо відповідний спосіб відновлення.' }
];
const dialog = document.querySelector('#detail-dialog');
const dialogTitle = document.querySelector('#dialog-title');
const dialogDescription = document.querySelector('.dialog-description');
const dialogServices = document.querySelector('.dialog-services');
function openDialog(title, description, showServices = false) {
  dialogTitle.textContent = title;
  dialogDescription.textContent = description;
  dialogServices.hidden = !showServices;
  closeMenu();
  if (!dialog.open) { dialog.showModal(); document.body.classList.add('dialog-open'); }
}
document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('close', () => document.body.classList.remove('dialog-open'));
dialog.addEventListener('click', event => {
  const rect = dialog.getBoundingClientRect();
  if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
});
document.querySelectorAll('[data-contact]').forEach(button => button.addEventListener('click', () => {
  openDialog('Ваше авто заслуговує на увагу', 'Розкажіть нам про свій автомобіль. Допоможемо обрати послугу та домовимося про зручний час для візиту.');
}));
document.querySelectorAll('[data-service]').forEach(button => button.addEventListener('click', () => {
  const service = services[Number(button.dataset.service)];
  openDialog(service.title, service.description);
}));
services.forEach(service => {
  const button = document.createElement('button');
  button.textContent = `${service.title} ↗`;
  button.addEventListener('click', () => openDialog(service.title, service.description));
  dialogServices.append(button);
});
document.querySelector('.all-services').addEventListener('click', () => openDialog('Послуги для вашого авто', 'Від чистоти салону до захисту кузова — оберіть догляд, який потрібен вашому автомобілю.', true));
document.querySelectorAll('[data-section]').forEach(button => button.addEventListener('click', () => {
  const section = button.dataset.section;
  if (section === 'Наші роботи') {
    closeMenu();
    document.querySelector('#works').scrollIntoView({behavior: 'smooth'});
  } else if (section === 'Про нас') {
    closeMenu();
    document.querySelector('#about').scrollIntoView({behavior: 'smooth'});
  } else if (section === 'Корисне') {
    closeMenu();
    document.querySelector('#tips').scrollIntoView({behavior: 'smooth'});
  } else if (section === 'Відгуки') {
    closeMenu();
    document.querySelector('#reviews').scrollIntoView({behavior: 'smooth'});
  } else {
    openDialog(section, 'Цей розділ незабаром з’явиться на сайті. А поки — зателефонуйте нам, щоб дізнатися більше про студію та догляд за вашим автомобілем.');
  }
}));

// On touch screens, brighten only the cards currently passing through the viewport.
const touchCards = window.matchMedia('(max-width: 700px), (hover: none), (pointer: coarse)');
const cards = [...document.querySelectorAll('.service-card')];
const cardObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => entry.target.classList.toggle('is-in-view', touchCards.matches && entry.isIntersecting));
}, { threshold: .35, rootMargin: '-10% 0px -12% 0px' });
cards.forEach(card => cardObserver.observe(card));
touchCards.addEventListener('change', () => {
  cards.forEach(card => { card.classList.remove('is-in-view'); cardObserver.unobserve(card); cardObserver.observe(card); });
});

const comparison = document.querySelector('.comparison');
const comparisonRange = document.querySelector('.comparison-range');
comparisonRange.addEventListener('input', () => {
  comparison.style.setProperty('--split', `${comparisonRange.value}%`);
  comparisonRange.setAttribute('aria-valuetext', `${comparisonRange.value}% до, ${100 - comparisonRange.value}% після`);
});

const worksTrack = document.querySelector('#works-track');
const workItems = [...worksTrack.children];
const workPrev = document.querySelector('#works-prev');
const workNext = document.querySelector('#works-next');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
function moveWorks(direction) {
  worksTrack.scrollBy({left: direction * (workItems[0].getBoundingClientRect().width + 18), behavior: reducedMotion.matches ? 'instant' : 'smooth'});
}
workPrev.addEventListener('click', () => moveWorks(-1));
workNext.addEventListener('click', () => moveWorks(1));
function updateWorks() {
  const max = worksTrack.scrollWidth - worksTrack.clientWidth;
  const progress = max > 0 ? Math.min(1, Math.max(0, worksTrack.scrollLeft / max)) : 0;
  document.querySelector('.works-progress span').style.transform = `translateX(${progress * 300}%)`;
  const index = Math.round(worksTrack.scrollLeft / (workItems[0].getBoundingClientRect().width + 18));
  document.querySelector('#works-count').textContent = `${String(Math.min(index + 1, workItems.length)).padStart(2, '0')} / 04`;
  workPrev.disabled = worksTrack.scrollLeft < 2;
  workNext.disabled = worksTrack.scrollLeft >= max - 2;
}
worksTrack.addEventListener('scroll', updateWorks, {passive:true});
window.addEventListener('resize', updateWorks);
updateWorks();
document.querySelector('#view-works').addEventListener('click', () => {
  worksTrack.classList.toggle('show-all');
  document.querySelector('#view-works').firstChild.textContent = worksTrack.classList.contains('show-all') ? 'Згорнути роботи ' : 'Дивитись всі роботи ';
  updateWorks();
});
const lightbox = document.querySelector('#work-lightbox');
document.querySelectorAll('[data-work-image]').forEach(button => button.addEventListener('click', () => {
  lightbox.querySelector('img').src = button.dataset.workImage;
  lightbox.querySelector('img').alt = button.dataset.workTitle;
  lightbox.querySelector('p').textContent = button.dataset.workTitle;
  lightbox.showModal();
  document.body.classList.add('dialog-open');
}));
lightbox.querySelector('button').addEventListener('click', () => lightbox.close());
lightbox.addEventListener('click', event => { if (event.target === lightbox) lightbox.close(); });
lightbox.addEventListener('close', () => document.body.classList.remove('dialog-open'));

const studioMore = document.querySelector('.studio-more');
studioMore.addEventListener('click', () => {
  const expanded = studioMore.getAttribute('aria-expanded') === 'true';
  studioMore.setAttribute('aria-expanded', String(!expanded));
  document.querySelector('#studio-details').hidden = expanded;
  studioMore.firstChild.textContent = expanded ? 'Більше про нас ' : 'Згорнути ';
});

const articles = [
  {
    title: 'Як правильно мити автомобіль взимку?', category: 'Догляд', image: './assets/article-wash.png',
    paragraphs: [
      'Узимку на кузові накопичуються бруд і дорожні реагенти. Регулярне делікатне миття допомагає прибрати їх із поверхні та зберегти доглянутий вигляд автомобіля.',
      'Починайте з попереднього змивання забруднень. Не тріть сухий бруд губкою й не використовуйте гарячу воду на промерзлому кузові: різкі перепади температур небажані для покриття та скла.',
      'Для контактного етапу використовуйте автомобільний шампунь, чисту м’яку рукавицю та окремий інвентар для коліс. Дотримуйтесь інструкції засобу й не давайте піні висихати на поверхні.',
      'Після миття ретельно висушіть кузов, ущільнювачі та дверні отвори. У мороз краще обрати приміщення, де автомобіль можна повністю висушити перед виїздом.'
    ]
  },
  {
    title: 'Чому варто наносити керамічне покриття?', category: 'Захист', image: './assets/article-protection.png',
    paragraphs: [
      'Керамічне покриття — додатковий шар догляду за лакофарбовою поверхнею. Воно може підкреслити глибину кольору та полегшити регулярне очищення автомобіля.',
      'Гідрофобний ефект допомагає воді збиратися в краплі й стікати з поверхні. Результат залежить від самого складу, підготовки кузова та подальшого догляду.',
      'Покриття не робить кузов невразливим: воно не замінює захисну плівку від сколів і не скасовує потреби в обережному митті. Забруднення варто видаляти своєчасно, без жорстких щіток та абразивних засобів.',
      'Перед нанесенням потрібно оцінити стан лаку й підготувати поверхню. Термін витримки після процедури та правила наступного миття уточнюйте для конкретного покриття.'
    ]
  },
  {
    title: 'Як підтримувати чистоту салону?', category: 'Інтер’єр', image: './assets/article-interior.png',
    paragraphs: [
      'Чистий салон починається з простого регулярного догляду. Прибирайте сміття, витрушуйте килимки та пилососьте сидіння і стики, де накопичуються пил і пісок.',
      'Для поверхонь використовуйте чисту мікрофібру та засоби, призначені саме для відповідного матеріалу. Шкіра, тканина, екрани й декоративні вставки потребують різного підходу.',
      'Новий засіб спершу перевіряйте на непомітній ділянці. Не заливайте поверхні рідиною: наносіть її на серветку, якщо це дозволяє інструкція, і працюйте без зайвого натиску.',
      'Свіжі плями промокайте, а не розтирайте. Якщо забруднення в’їлося або ви не впевнені в матеріалі, краще підібрати професійне очищення, щоб не пошкодити оббивку.'
    ]
  }
];
const articleDialog = document.querySelector('#article-dialog');
const articleCover = articleDialog.querySelector('.article-cover');
const articleText = articleDialog.querySelector('.article-text');
const articleList = articleDialog.querySelector('.article-list');
function showArticle(index) {
  const article = articles[index];
  articleCover.hidden = false;
  articleCover.querySelector('img').src = article.image;
  articleCover.querySelector('img').alt = article.title;
  articleCover.querySelector('.tip-category').textContent = article.category;
  document.querySelector('#article-title').textContent = article.title;
  articleText.replaceChildren(...article.paragraphs.map(text => { const p = document.createElement('p'); p.textContent = text; return p; }));
  articleList.hidden = true;
  articleDialog.querySelector('.article-back').hidden = false;
  if (!articleDialog.open) { articleDialog.showModal(); document.body.classList.add('dialog-open'); }
  articleDialog.scrollTop = 0;
}
function showArticleList() {
  articleCover.hidden = true;
  document.querySelector('#article-title').textContent = 'Рекомендації для клієнтів';
  articleText.replaceChildren();
  articleList.hidden = false;
  articleDialog.querySelector('.article-back').hidden = true;
  if (!articleDialog.open) { articleDialog.showModal(); document.body.classList.add('dialog-open'); }
  articleDialog.scrollTop = 0;
}
articles.forEach((article,index) => {
  const button = document.createElement('button');
  const image = document.createElement('img'); image.src = article.image; image.alt = ''; image.loading = 'lazy';
  const label = document.createElement('span'); label.textContent = article.title;
  button.append(image,label);
  button.addEventListener('click', () => showArticle(index));
  articleList.append(button);
});
document.querySelectorAll('[data-article]').forEach(button => button.addEventListener('click', () => showArticle(Number(button.dataset.article))));
document.querySelector('#all-articles').addEventListener('click', showArticleList);
articleDialog.querySelector('.article-back').addEventListener('click', showArticleList);
articleDialog.querySelector('.article-close').addEventListener('click', () => articleDialog.close());
articleDialog.addEventListener('close', () => document.body.classList.remove('dialog-open'));
articleDialog.addEventListener('click', event => {
  const rect = articleDialog.getBoundingClientRect();
  if (event.target === articleDialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) articleDialog.close();
});
const tipsTrack = document.querySelector('#tips-track');
const tipsPrev = document.querySelector('#tips-prev');
const tipsNext = document.querySelector('#tips-next');
function moveTips(direction) {
  const gap = parseFloat(getComputedStyle(tipsTrack).gap) || 0;
  tipsTrack.scrollBy({left:direction * (tipsTrack.firstElementChild.getBoundingClientRect().width + gap),behavior:reducedMotion.matches?'instant':'smooth'});
}
function updateTips() {
  tipsPrev.disabled = tipsTrack.scrollLeft < 2;
  tipsNext.disabled = tipsTrack.scrollLeft >= tipsTrack.scrollWidth - tipsTrack.clientWidth - 2;
}
tipsPrev.addEventListener('click', () => moveTips(-1));
tipsNext.addEventListener('click', () => moveTips(1));
tipsTrack.addEventListener('scroll',updateTips,{passive:true});
window.addEventListener('resize',updateTips);
updateTips();

const reviewsTrack = document.querySelector('#reviews-track');
const reviewsPrev = document.querySelector('#reviews-prev');
const reviewsNext = document.querySelector('#reviews-next');
function updateReviews() {
  reviewsPrev.disabled = reviewsTrack.scrollLeft < 2;
  reviewsNext.disabled = reviewsTrack.scrollLeft >= reviewsTrack.scrollWidth - reviewsTrack.clientWidth - 2;
}
function moveReviews(direction) {
  const gap = parseFloat(getComputedStyle(reviewsTrack).gap) || 0;
  reviewsTrack.scrollBy({left:direction * (reviewsTrack.firstElementChild.getBoundingClientRect().width + gap),behavior:reducedMotion.matches?'instant':'smooth'});
}
reviewsPrev.addEventListener('click', () => moveReviews(-1));
reviewsNext.addEventListener('click', () => moveReviews(1));
reviewsTrack.addEventListener('scroll',updateReviews,{passive:true});
window.addEventListener('resize',updateReviews);

const reviewDialog = document.querySelector('#review-dialog');
const reviewForm = document.querySelector('#review-form');
const reviewStorageKey = 'cartime87-local-reviews';
let localReviews = [];
function renderLocalReview(review) {
  const card = document.createElement('article'); card.className = 'review-card local-review';
  const author = document.createElement('div'); author.className = 'review-author';
  const avatar = document.createElement('span'); avatar.className = 'review-avatar'; avatar.setAttribute('aria-hidden','true'); avatar.textContent = Array.from(review.name)[0].toLocaleUpperCase('uk');
  const info = document.createElement('div'); const name = document.createElement('h3'); name.textContent = review.name;
  const stars = document.createElement('p'); stars.className = 'review-stars'; stars.textContent = '★'.repeat(review.rating) + '☆'.repeat(5-review.rating); stars.setAttribute('aria-label', `${review.rating} з 5`);
  const text = document.createElement('p'); text.className = 'review-text'; text.textContent = review.text;
  const label = document.createElement('p'); label.className = 'local-review-note'; label.textContent = 'Ваш відгук · лише у цьому браузері';
  info.append(name,stars); author.append(avatar,info); card.append(author,text,label); reviewsTrack.prepend(card);
}
try {
  const saved = JSON.parse(localStorage.getItem(reviewStorageKey) || '[]');
  if (Array.isArray(saved)) {
    localReviews = saved.filter(r => r && typeof r.name === 'string' && r.name.trim() && r.name.length<=60 && typeof r.text === 'string' && r.text.length>=5 && r.text.length<=600 && Number.isInteger(r.rating) && r.rating>=1 && r.rating<=5).slice(-20);
    localReviews.forEach(renderLocalReview);
  }
} catch { /* Reviews remain usable when browser storage is unavailable. */ }
document.querySelector('#leave-review').addEventListener('click', () => {
  reviewForm.querySelector('.review-form-status').textContent = '';
  reviewDialog.showModal(); document.body.classList.add('dialog-open');
});
reviewDialog.querySelector('.review-close').addEventListener('click', () => reviewDialog.close());
reviewDialog.addEventListener('close', () => document.body.classList.remove('dialog-open'));
reviewDialog.addEventListener('click', event => {
  const rect = reviewDialog.getBoundingClientRect();
  if (event.target === reviewDialog && (event.clientX<rect.left || event.clientX>rect.right || event.clientY<rect.top || event.clientY>rect.bottom)) reviewDialog.close();
});
let reviewToastTimer;
reviewForm.addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(reviewForm);
  const review = {name:String(data.get('name')).trim(),text:String(data.get('text')).trim(),rating:Number(data.get('rating'))};
  if (!review.name || review.text.length<5) {reviewForm.querySelector('.review-form-status').textContent = 'Вкажіть ім’я та напишіть відгук щонайменше з 5 символів.';return;}
  const next = [...localReviews,review].slice(-20);
  try { localStorage.setItem(reviewStorageKey,JSON.stringify(next)); }
  catch {reviewForm.querySelector('.review-form-status').textContent = 'Не вдалося зберегти відгук. Перевірте, чи дозволено зберігання даних у браузері.';return;}
  localReviews = next;
  reviewsTrack.querySelectorAll('.local-review').forEach(card=>card.remove());
  localReviews.forEach(renderLocalReview);
  reviewForm.reset(); reviewDialog.close();
  reviewsTrack.scrollTo({left:0,behavior:'instant'}); updateReviews();
  const toast = document.querySelector('.review-toast'); toast.hidden = false;
  clearTimeout(reviewToastTimer); reviewToastTimer = setTimeout(()=>{toast.hidden = true;},5000);
});
updateReviews();
