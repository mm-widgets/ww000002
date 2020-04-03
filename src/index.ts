import Swiper from 'swiper';

const no = 'mm-000002';

const styles = `
<link href="//cdn.jsdelivr.net/npm/swiper@5.2.1/css/swiper.css" rel="stylesheet">
<style>
.${no}{
	width: inherit;
	height: inherit;
	overflow: hidden;
	position: relative;
}

.${no} .swiper-slide {
	text-align: center;
	display: -webkit-box;
	display: -ms-flexbox;
	display: -webkit-flex;
	display: flex;
	-webkit-box-pack: center;
	-ms-flex-pack: center;
	-webkit-justify-content: center;
	justify-content: center;
	-webkit-box-align: center;
	-ms-flex-align: center;
	-webkit-align-items: center;
	align-items: center;
}
</style>
`;

const tpl = `
${styles}
<div class='${no}'>
	<div class='swiper-wrapper'>
	</div>
	<div class='swiper-pagination'></div>

	<div class='swiper-button-prev'></div>
	<div class='swiper-button-next'></div>

	<div class='swiper-scrollbar'></div>
</div>
`;

export default class CustomCalendar extends HTMLElement {
	private swiper!: Swiper;
	// private dom: ShadowRoot;
	// constructor() {
	// 	super();
	// 	 this.dom = this.attachShadow({ mode: 'closed' });
	// }

	public connectedCallback() {
		this.style.display = 'inline-block';
		const dom = document.createElement('div');
		dom.style.width = 'inherit';
		dom.style.height = 'inherit';
		dom.innerHTML = tpl;
		const content = Array.from(this.children);
		Array.from(this.childNodes).forEach((child) => {
			this.removeChild(child);
		});
		const wrapper = dom.querySelector<HTMLDivElement>('.swiper-wrapper')!;
		content.forEach((child) => {
			if (!child.classList.contains('swiper-slide')) {
				child.classList.add('swiper-slide');
			}
			wrapper.appendChild(child);
		});
		const nextEl = dom.querySelector<HTMLElement>('.swiper-button-next')!;
		const prevEl = dom.querySelector<HTMLElement>('.swiper-button-prev')!;
		const pagination_el = dom.querySelector<HTMLElement>('.swiper-pagination')!;
		const root = dom.querySelector<HTMLElement>(`.${no}`);
		this.appendChild(dom);

		const loop = get_boolean_attribute(this, 'loop');
		const show_dot = get_boolean_attribute(this, 'show-dot');
		const show_nav = get_boolean_attribute(this, 'show-nav');
		const auto_play = get_boolean_attribute(this, 'auto-play');
		const delay = parseInt(this.getAttribute('delay') || '3000', 10);
		const speed = parseInt(this.getAttribute('speed') || '800', 10);

		const autoplay = auto_play ? {
			delay
		} : false;

		const navigation = (() => {
			if (show_nav) {
				return {
					nextEl,
					prevEl
				};
			}
			nextEl.remove();
			prevEl.remove();
			return {} as unknown as undefined;	// 虽然ts定义可以传undefined,但是实际上会报错

		})();

		const pagination = show_dot ? {
			clickable: true,
			el: pagination_el
		} : {} as unknown as undefined;

		this.swiper = new Swiper(root!, {
			autoplay,
			effect: 'slide',	// 只有这一种动效支持最好
			keyboard: {
				enabled: true,
				onlyInViewport: true
			},
			loop,
			navigation,
			pagination,
			speed
		});
		// this.swiper.on('click', () => {
		// 	this.swiper.clickedSlide;
		// });
	}

	public next() {
		this.swiper.slideNext();
	}

	public prev() {
		this.swiper.slidePrev();
	}

	public reset() {
		this.swiper.slideReset();
	}

	public goto(index: number) {
		this.swiper.slideToLoop(index);
	}
}

if (!window.customElements.get(no)) {
	window.customElements.define(no, CustomCalendar);
}

function get_boolean_attribute(node: HTMLElement, attribute: string) {
	if (node.hasAttribute(attribute)) {
		const value = node.getAttribute(attribute);
		if (value) {
			return value.toLocaleLowerCase() !== 'false';
		}
		return true;
	}
	return false;
}
