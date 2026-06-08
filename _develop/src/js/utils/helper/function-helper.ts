/**
 * Add CSS class to an HTML element
 */
const addClass = (element: HTMLElement, className: string): void => {
  element.classList.add(className);
};

/**
 * Remove CSS class from an HTML element
 */
const removeClass = (element: HTMLElement, className: string): void => {
  element.classList.remove(className);
};

/**
 * Query selector helper that returns typed HTMLElement
 */
const selector = (selector: string): HTMLElement => {
  return document.querySelector(selector) as HTMLElement;
};

/**
 * Query selector all helper that returns array of elements
 */
const selectorAll = (selector: string): HTMLElement[] => {
  return Array.from(document.querySelectorAll(selector));
};

/**
 * Escape HTML special characters to prevent XSS
 */
const escapeHtmlSpecialChars = (str: string): string => {
  const entities: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '`': '&#96;',
    '$': '&#36;',
    '@': '&#64;',
    '^': '&#94;',
    '|': '&#124;',
    '~': '&#126;'
  };

  return String(str).replace(/[&<>"'`$@^|~]/g, char => entities[char]);
};

/**
 * Debounce function execution
 */
const debounce = <T extends (...args: any[]) => void>(
  callback: T,
  wait: number = 150
): ((...args: Parameters<T>) => void) => {

  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>): void => {
    clearTimeout(timeout);
    timeout = setTimeout(() => callback(...args), wait);
  };
};

const setParams = (key: string, value: string) => {
  const location: string = String(window.location);
  const url = new URL(location);
  url.searchParams.set(key, value);
  if (!value || value === '') {
    url.searchParams.delete(key);
  } else {
    url.searchParams.set(key, value);
  }
  const searchParams = `?${url.searchParams.toString()}`;
  window.history.replaceState(null, '', searchParams);
  if (searchParams === '?') {
    window.history.replaceState(null, '', window.location.pathname);
  }
};

const getParams = () => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  if (urlParams.size === 0) return null;
  const params = Object.fromEntries(urlParams);
  return params;
};

export { addClass, escapeHtmlSpecialChars, removeClass, selector, selectorAll, debounce, getParams, setParams };
