import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface SectionAnimationOptions {
  trigger: HTMLElement;
  start?: string;
  end?: string;
  scrub?: boolean | number;
  pin?: boolean;
  markers?: boolean;
}

export function createParallax(
  element: HTMLElement,
  options: SectionAnimationOptions & { yPercent?: number },
): ScrollTrigger {
  const { trigger, start = "top bottom", end = "bottom top", yPercent = -20 } =
    options;

  return ScrollTrigger.create({
    trigger,
    start,
    end,
    scrub: true,
    animation: gsap.to(element, {
      yPercent,
      ease: "none",
    }),
  });
}

export function createFadeUpSection(
  elements: HTMLElement[],
  trigger: HTMLElement,
  start = "top 75%",
): ScrollTrigger {
  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger,
      start,
      toggleActions: "play none none reverse",
    },
  });

  elements.forEach((element, index) => {
    timeline.fromTo(
      element,
      {
        opacity: 0,
        y: 80,
        filter: "blur(12px)",
      },
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 1,
        ease: "power3.out",
      },
      index * 0.12,
    );
  });

  return timeline.scrollTrigger as ScrollTrigger;
}

export function createPinnedSection(
  element: HTMLElement,
  options: SectionAnimationOptions,
): ScrollTrigger {
  return ScrollTrigger.create({
    trigger: element,
    start: options.start ?? "top top",
    end: options.end ?? "+=100%",
    pin: options.pin ?? true,
    scrub: options.scrub ?? 1,
    anticipatePin: 1,
  });
}
