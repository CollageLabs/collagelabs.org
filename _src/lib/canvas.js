const canvas = document.querySelector('.banner-bg');

const defaultParticleSettings = {
	count: [1, 5],
	interval: [5000, 10000],
	radius: [1, 2],
	opacity: [.01, .2],
	color: '#ffffff',
	variationX: [5, 15],
	variationY: [2.5, 7.5]
};

const defaultSettings = {
	triangleSize: 70,
	bleed: 120,
	noise: 100,
	// colors: ["#e74c3c", "#240705"],
	// colors: ["#2ecc71", "#093019"],
	colors: ["#3498db", "#07151f"],
	pointVariationX: 20,
	pointVariationY: 35,
	pointAnimationSpeed: 15000,
	maxFps: 144,
	animationOffset: 250,
	particleSettings: defaultParticleSettings
};

Thpace.default.create(canvas, defaultSettings);