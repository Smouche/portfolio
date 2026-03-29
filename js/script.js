window.addEventListener('load', () => {
	document.body.classList.add('is-loaded');
});

// Nav fade-in on scroll
const nav = document.querySelector('nav');
if (nav) {
	window.addEventListener('scroll', () => {
		const isAtTop = window.scrollY === 0;
		const isAtBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 10;
		
		if (isAtTop || isAtBottom) {
			nav.classList.remove('scrolled');
		} else {
			nav.classList.add('scrolled');
		}
	}, { passive: true });
}

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

const homeLink = document.querySelector('.homeLink');

if (homeLink) {
	homeLink.addEventListener('click', (event) => {
		const onIndexPage = window.location.pathname.endsWith('/index.html') || window.location.pathname === '/' || window.location.pathname === '';

		if (onIndexPage) {
			event.preventDefault();
			window.scrollTo({ top: 0, behavior: 'smooth' });
		} else {
			homeLink.setAttribute('href', 'index.html#top');
		}
	});
}

const navLinks = document.querySelectorAll('nav .ulWhite a');
const sections = document.querySelectorAll('#top, #projects, #about, #archive, #contact');

if (navLinks.length > 0 && sections.length > 0) {
	const observerOptions = {
		root: null,
		rootMargin: '-50px 0px -50% 0px',
		threshold: 0
	};

	const updateActiveNav = () => {
		const pageOnIndex = window.location.pathname.endsWith('/index.html') || window.location.pathname === '/' || window.location.pathname === '';
		
		if (!pageOnIndex) {
			navLinks.forEach(link => link.classList.remove('active'));
			return;
		}

		sections.forEach((section) => {
			const rect = section.getBoundingClientRect();
			if (rect.top <= window.innerHeight / 2 && rect.bottom > window.innerHeight / 2) {
				const sectionId = section.id;
				navLinks.forEach(link => {
					if (link.getAttribute('href') === `index.html#${sectionId}`) {
						link.classList.add('active');
					} else {
						link.classList.remove('active');
					}
				});
			}
		});
	};

	window.addEventListener('scroll', updateActiveNav, { passive: true });
	updateActiveNav();
}

const archiveImages = document.querySelectorAll('.archiveItem img');
const archiveModal = document.getElementById('archiveModal');
const archiveModalImage = document.getElementById('archiveModalImage');
const archiveModalClose = document.getElementById('archiveModalClose');

if (archiveImages.length > 0 && archiveModal && archiveModalImage && archiveModalClose) {
	const openArchiveModal = (image) => {
		archiveModalImage.src = image.currentSrc || image.src;
		archiveModalImage.alt = image.alt || 'Archive image';
		archiveModal.classList.add('is-open');
		archiveModal.setAttribute('aria-hidden', 'false');
		document.body.classList.add('modal-open');
	};

	const closeArchiveModal = () => {
		archiveModal.classList.remove('is-open');
		archiveModal.setAttribute('aria-hidden', 'true');
		document.body.classList.remove('modal-open');
		archiveModalImage.src = '';
	};

	archiveImages.forEach((image) => {
		image.addEventListener('click', () => openArchiveModal(image));
	});

	archiveModalClose.addEventListener('click', closeArchiveModal);

	archiveModal.addEventListener('click', (event) => {
		if (event.target === archiveModal) {
			closeArchiveModal();
		}
	});

	window.addEventListener('keydown', (event) => {
		if (event.key === 'Escape' && archiveModal.classList.contains('is-open')) {
			closeArchiveModal();
		}
	});
}

const sketchesSection = document.querySelector('.projectSketches');
const sketchImages = document.querySelectorAll('.projectSketches .sketchImage');

if (sketchesSection && sketchImages.length > 0) {
	const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

	const updateSketches = () => {
		const rect = sketchesSection.getBoundingClientRect();
		const scrollableDistance = Math.max(1, sketchesSection.offsetHeight - window.innerHeight);
		const rawProgress = -rect.top / scrollableDistance;
		const progress = clamp(rawProgress, 0, 1);

		sketchImages.forEach((image, index) => {
			const stagger = index * 0.06;
			const localProgress = clamp((progress - stagger) / (1 - stagger), 0, 1);
			const translateY = 120 - localProgress * 260;
			image.style.transform = `translateY(${translateY}vh)`;
		});
	};

	window.addEventListener('scroll', updateSketches, { passive: true });
	window.addEventListener('resize', updateSketches);
	updateSketches();
}
