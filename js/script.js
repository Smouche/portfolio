/**
 * Portfolio Website - Main Scripts
 * Organized by feature with clear separation of concerns
 */

/* ========================================
   CONSTANTS & CONFIGURATION
   ======================================== */

const CONFIG = {
	// Responsive zoom breakpoints
	responsiveZoom: {
		largeWidth: 1600,
		largeHeight: 950,
		smallWidth: 1350,
		smallHeight: 800
	},
	// Scroll observers
	observers: {
		h2RevealThreshold: 0.25,
		insightsThreshold: 0.35,
		navScrollThreshold: 10
	},
	// Sketch animation
	sketches: {
		imageStagger: 0.06,
		baseTranslateY: 120,
		scrollDistance: 260
	}
};

/* ========================================
   UTILITY FUNCTIONS
   ======================================== */

/**
 * Clamp a value between min and max
 */
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

/**
 * Check if currently on the index page
 */
const isOnIndexPage = () => {
	const pathname = window.location.pathname;
	return pathname.endsWith('/index.html') || pathname === '/' || pathname === '';
};

/**
 * Check if user prefers reduced motion
 */
const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ========================================
   LIFECYCLE EVENTS
   ======================================== */

/**
 * Fade in background elements when page loads
 */
window.addEventListener('load', () => {
	document.body.classList.add('is-loaded');
});

/* ========================================
   RESPONSIVE ZOOM
   ======================================== */

/**
 * Apply responsive zoom based on viewport size
 */
const applyResponsiveZoom = () => {
	const { largeWidth, largeHeight, smallWidth, smallHeight } = CONFIG.responsiveZoom;
	const width = window.innerWidth;
	const height = window.innerHeight;
	let scale = 1;

	if (width > largeWidth && height > largeHeight) {
		scale = Math.min(width / largeWidth, height / largeHeight);
	} else if (width < smallWidth || height < smallHeight) {
		scale = Math.min(width / smallWidth, height / smallHeight);
	}

	document.documentElement.style.setProperty('--page-zoom-scale', String(scale));
	document.documentElement.style.zoom = String(scale);
};

window.addEventListener('resize', applyResponsiveZoom);
applyResponsiveZoom();

/* ========================================
   NAVIGATION BEHAVIOR
   ======================================== */

/**
 * Update navigation styling on scroll
 */
const initNavScrollBehavior = () => {
	const nav = document.querySelector('nav');
	if (!nav) return;

	window.addEventListener('scroll', () => {
		const isAtTop = window.scrollY === 0;
		const isAtBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - CONFIG.observers.navScrollThreshold;

		if (isAtTop || isAtBottom) {
			nav.classList.remove('is-scrolled');
		} else {
			nav.classList.add('is-scrolled');
		}
	}, { passive: true });
};

/**
 * Update active navigation link based on scroll position
 */
const initNavActiveState = () => {
	const navLinks = document.querySelectorAll('nav .ulWhite a');
	const sections = document.querySelectorAll('#top, #projects, #about, #archive, #contact');

	if (navLinks.length === 0 || sections.length === 0) return;

	const updateActiveNav = () => {
		if (!isOnIndexPage()) {
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
};

/**
 * Handle home link click behavior
 */
const initHomeLink = () => {
	const homeLink = document.querySelector('.homeLink');
	if (!homeLink) return;

	homeLink.addEventListener('click', (event) => {
		if (isOnIndexPage()) {
			event.preventDefault();
			window.scrollTo({ top: 0, behavior: 'smooth' });
		} else {
			homeLink.setAttribute('href', 'index.html#top');
		}
	});
};

initNavScrollBehavior();
initNavActiveState();
initHomeLink();

/* ========================================
   H2 HEADING REVEAL ANIMATION
   ======================================== */

/**
 * Initialize reveal animation for offset h2 headings
 */
const initH2RevealAnimation = () => {
	const offsetH2Headings = Array.from(document.querySelectorAll('h2')).filter((heading) => {
		const computedStyle = window.getComputedStyle(heading);
		return computedStyle.left !== 'auto' && computedStyle.left !== '0px';
	});

	if (offsetH2Headings.length === 0) return;

	const doesPrefersReducedMotion = prefersReducedMotion();

	offsetH2Headings.forEach((heading) => {
		const computedStyle = window.getComputedStyle(heading);
		heading.dataset.targetLeft = computedStyle.left;
		heading.classList.add('h2-reveal');

		if (doesPrefersReducedMotion) {
			heading.style.left = computedStyle.left;
		} else {
			heading.style.left = '0px';
		}
	});

	if (doesPrefersReducedMotion || !('IntersectionObserver' in window)) return;

	const revealObserver = new IntersectionObserver((entries) => {
		entries.forEach((entry) => {
			const heading = entry.target;

			if (entry.isIntersecting) {
				heading.style.left = heading.dataset.targetLeft || '0px';
			} else {
				heading.style.left = '0px';
			}
		});
	}, { threshold: CONFIG.observers.h2RevealThreshold });

	offsetH2Headings.forEach((heading) => revealObserver.observe(heading));
};

initH2RevealAnimation();

/* ========================================
   ARCHIVE MODAL
   ======================================== */

/**
 * Initialize archive image gallery modal
 */
const initArchiveModal = () => {
	const archiveImages = document.querySelectorAll('.archiveItem img');
	const archiveModal = document.getElementById('archiveModal');
	const archiveModalImage = document.getElementById('archiveModalImage');
	const archiveModalClose = document.getElementById('archiveModalClose');

	if (archiveImages.length === 0 || !archiveModal || !archiveModalImage || !archiveModalClose) return;

	/**
	 * Open modal with selected image
	 */
	const openModal = (image) => {
		archiveModalImage.src = image.currentSrc || image.src;
		archiveModalImage.alt = image.alt || 'Archive image';
		archiveModal.classList.add('is-open');
		archiveModal.setAttribute('aria-hidden', 'false');
		document.body.classList.add('is-modal-open');
	};

	/**
	 * Close modal and cleanup
	 */
	const closeModal = () => {
		archiveModal.classList.remove('is-open');
		archiveModal.setAttribute('aria-hidden', 'true');
		document.body.classList.remove('is-modal-open');
		archiveModalImage.src = '';
	};

	// Add click handlers to archive images
	archiveImages.forEach((image) => {
		image.addEventListener('click', () => openModal(image));
	});

	// Close button
	archiveModalClose.addEventListener('click', closeModal);

	// Close when clicking outside image
	archiveModal.addEventListener('click', (event) => {
		if (event.target === archiveModal) {
			closeModal();
		}
	});

	// Close on escape key
	window.addEventListener('keydown', (event) => {
		if (event.key === 'Escape' && archiveModal.classList.contains('is-open')) {
			closeModal();
		}
	});
};

initArchiveModal();

/* ========================================
   SKETCH IMAGE SCROLL ANIMATION
   ======================================== */

/**
 * Animate sketch images based on scroll position
 */
const initSketchScrollAnimation = () => {
	const sketchesSection = document.querySelector('.projectSketches');
	const sketchImages = document.querySelectorAll('.projectSketches .sketchImage');

	if (!sketchesSection || sketchImages.length === 0) return;

	const updateSketchPositions = () => {
		const rect = sketchesSection.getBoundingClientRect();
		const scrollableDistance = Math.max(1, sketchesSection.offsetHeight - window.innerHeight);
		const rawProgress = -rect.top / scrollableDistance;
		const progress = clamp(rawProgress, 0, 1);

		sketchImages.forEach((image, index) => {
			const stagger = index * CONFIG.sketches.imageStagger;
			const localProgress = clamp((progress - stagger) / (1 - stagger), 0, 1);
			const translateY = CONFIG.sketches.baseTranslateY - localProgress * CONFIG.sketches.scrollDistance;
			image.style.transform = `translateY(${translateY}vh)`;
		});
	};

	window.addEventListener('scroll', updateSketchPositions, { passive: true });
	window.addEventListener('resize', updateSketchPositions);
	updateSketchPositions();
};

initSketchScrollAnimation();

/* ========================================
   INSIGHTS SECTION ANIMATION
   ======================================== */

/**
 * Trigger insight cards animation when section becomes visible
 */
const initInsightsAnimation = () => {
	const insightsSection = document.querySelector('.projectInsights');
	if (!insightsSection) return;

	const doesPrefersReducedMotion = prefersReducedMotion();

	if (doesPrefersReducedMotion) {
		insightsSection.classList.add('is-visible');
		return;
	}

	if (!('IntersectionObserver' in window)) {
		insightsSection.classList.add('is-visible');
		return;
	}

	const insightsObserver = new IntersectionObserver((entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				insightsSection.classList.add('is-visible');
			} else {
				insightsSection.classList.remove('is-visible');
			}
		});
	}, { threshold: CONFIG.observers.insightsThreshold });

	insightsObserver.observe(insightsSection);
};

initInsightsAnimation();

/* ========================================
   PROJECT FINAL VIDEO
   ======================================== */

/**
 * Control final showcase video playback based on visibility and click interaction
 */
const initProjectFinalVideo = () => {
	const finalVideo = document.querySelector('.projectFinalVideo');
	if (!finalVideo) return;

	const syncPausedState = () => {
		finalVideo.classList.toggle('is-paused', finalVideo.paused);
	};

	finalVideo.controls = false;
	finalVideo.loop = true;
	finalVideo.playsInline = true;
	finalVideo.setAttribute('playsinline', '');
	syncPausedState();

	finalVideo.addEventListener('play', syncPausedState);
	finalVideo.addEventListener('pause', syncPausedState);

	finalVideo.addEventListener('click', () => {
		if (finalVideo.paused) {
			finalVideo.play().catch(() => {});
		} else {
			finalVideo.pause();
		}
	});

	if (!('IntersectionObserver' in window)) return;

	const videoObserver = new IntersectionObserver((entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting && entry.intersectionRatio >= 0.99) {
				finalVideo.play().catch(() => {});
			} else {
				finalVideo.pause();
			}
		});
	}, {
		threshold: [0, 0.99, 1]
	});

	videoObserver.observe(finalVideo);
};

initProjectFinalVideo();
