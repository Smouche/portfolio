window.addEventListener('load', () => {
	document.body.classList.add('is-loaded');
});

const portraitImages = ['port1.jpg', 'port2.jpg', 'port3.jpg', 'port4.jpg', 'port5.jpg'];
let portraitIndex = 0;
const portraitImg = document.getElementById('portraitImg');

if (portraitImg) {
	setInterval(() => {
		portraitIndex = (portraitIndex + 1) % portraitImages.length;
		portraitImg.src = 'assets/img/' + portraitImages[portraitIndex];
	}, 500);
}

const supportsCustomCursor = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

if (supportsCustomCursor) {
	const customCursor = document.createElement('img');
	customCursor.className = 'custom-cursor';
	customCursor.src = 'assets/img/cursor.svg';
	customCursor.alt = '';
	customCursor.setAttribute('aria-hidden', 'true');
	document.body.appendChild(customCursor);

	window.addEventListener('mousemove', (event) => {
		customCursor.style.left = `${event.clientX}px`;
		customCursor.style.top = `${event.clientY}px`;
		customCursor.classList.add('is-visible');
	});

	window.addEventListener('mouseleave', () => {
		customCursor.classList.remove('is-visible');
	});
}
