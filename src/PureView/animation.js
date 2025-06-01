export function animate(element, properties, duration = 300, easing = "ease-in-out", callback) {
  const startProperties = {};
  const startTime = performance.now();

  for (const prop in properties) {
    startProperties[prop] = getComputedStyle(element)[prop];
  }

  function update(currentTime) {
    const elapsedTime = currentTime - startTime;
    const progress = Math.min(1, elapsedTime / duration);
    const easedProgress = ease(progress, easing); // Kita perlu fungsi ease

    for (const prop in properties) {
      const startValue = parseFloat(startProperties[prop]);
      const endValue = parseFloat(properties[prop]);
      if (!isNaN(startValue) && !isNaN(endValue)) {
        const currentValue = startValue + (endValue - startValue) * easedProgress;
        element.style[prop] = currentValue + getUnit(startProperties[prop]);
      } else {
        // Handle kasus properti non-numerik jika perlu
        element.style[prop] = properties[prop];
      }
    }

    if (progress < 1) {
      requestAnimationFrame(update);
    } else if (callback) {
      callback();
    }
  }

  requestAnimationFrame(update);
}

function ease(t, easing) {
  if (easing === "linear") return t;
  if (easing === "ease-in") return t * t;
  if (easing === "ease-out") return t * (2 - t);
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; // ease-in-out
}

function getUnit(value) {
  const match = value.match(/([a-zA-Z%]+)$/);
  return match ? match[1] : "";
}
export function fadeIn(element, duration = 300, callback) {
  animate(element, { opacity: 1 }, duration, "ease-in", callback);
}

export function fadeOut(element, duration = 300, callback) {
  animate(element, { opacity: 0 }, duration, "ease-out", callback);
}
