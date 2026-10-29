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
  if (section === 'Про нас') {
    openDialog('Увага до деталей', 'Car Time 87 — детейлінг студія, де якість і акуратність завжди на першому місці. Ми працюємо з автомобілями, як зі своїми, і цінуємо довіру кожного клієнта.');
  } else {
    openDialog(section, 'Цей розділ незабаром з’явиться на сайті. А поки — зателефонуйте нам, щоб дізнатися більше про студію та догляд за вашим автомобілем.');
  }
}));
