// Utility helper functions
class Helpers {
  // Date and time utilities
  static formatDate(date, format = 'short') {
    const d = new Date(date);
    
    const formats = {
      short: d.toLocaleDateString(),
      long: d.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      time: d.toLocaleTimeString(),
      datetime: d.toLocaleString(),
      iso: d.toISOString(),
      relative: this.getRelativeTime(d)
    };
    
    return formats[format] || formats.short;
  }

  static getRelativeTime(date) {
    const now = new Date();
    const diff = now - new Date(date);
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (seconds < 60) return 'just now';
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (weeks < 4) return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    if (months < 12) return `${months} month${months > 1 ? 's' : ''} ago`;
    return `${years} year${years > 1 ? 's' : ''} ago`;
  }

  static formatDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }

  // String utilities
  static capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  static titleCase(str) {
    return str.replace(/\w\S*/g, (txt) => 
      txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  }

  static slugify(str) {
    return str
      .toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-');
  }

  static truncate(str, length = 100, suffix = '...') {
    if (str.length <= length) return str;
    return str.substring(0, length).trim() + suffix;
  }

  static stripHtml(html) {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  }

  // Number utilities
  static formatNumber(num, decimals = 0) {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(num);
  }

  static formatPercentage(num, decimals = 1) {
    return new Intl.NumberFormat('en-US', {
      style: 'percent',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(num / 100);
  }

  static clamp(num, min, max) {
    return Math.min(Math.max(num, min), max);
  }

  static randomBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  static roundTo(num, decimals) {
    return Number(Math.round(num + 'e' + decimals) + 'e-' + decimals);
  }

  // Array utilities
  static shuffle(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  static chunk(array, size) {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  static unique(array) {
    return [...new Set(array)];
  }

  static groupBy(array, key) {
    return array.reduce((groups, item) => {
      const group = typeof key === 'function' ? key(item) : item[key];
      groups[group] = groups[group] || [];
      groups[group].push(item);
      return groups;
    }, {});
  }

  static sortBy(array, key, direction = 'asc') {
    return [...array].sort((a, b) => {
      const aVal = typeof key === 'function' ? key(a) : a[key];
      const bVal = typeof key === 'function' ? key(b) : b[key];
      
      if (aVal < bVal) return direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  }

  // Object utilities
  static deepClone(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj.getTime());
    if (obj instanceof Array) return obj.map(item => this.deepClone(item));
    if (typeof obj === 'object') {
      const cloned = {};
      Object.keys(obj).forEach(key => {
        cloned[key] = this.deepClone(obj[key]);
      });
      return cloned;
    }
  }

  static merge(target, ...sources) {
    if (!sources.length) return target;
    const source = sources.shift();

    if (this.isObject(target) && this.isObject(source)) {
      for (const key in source) {
        if (this.isObject(source[key])) {
          if (!target[key]) Object.assign(target, { [key]: {} });
          this.merge(target[key], source[key]);
        } else {
          Object.assign(target, { [key]: source[key] });
        }
      }
    }

    return this.merge(target, ...sources);
  }

  static isObject(item) {
    return item && typeof item === 'object' && !Array.isArray(item);
  }

  static pick(obj, keys) {
    return keys.reduce((result, key) => {
      if (key in obj) {
        result[key] = obj[key];
      }
      return result;
    }, {});
  }

  static omit(obj, keys) {
    const result = { ...obj };
    keys.forEach(key => delete result[key]);
    return result;
  }

  // DOM utilities
  static createElement(tag, attributes = {}, children = []) {
    const element = document.createElement(tag);
    
    Object.entries(attributes).forEach(([key, value]) => {
      if (key === 'className') {
        element.className = value;
      } else if (key === 'innerHTML') {
        element.innerHTML = value;
      } else if (key === 'textContent') {
        element.textContent = value;
      } else if (key.startsWith('on')) {
        element.addEventListener(key.slice(2).toLowerCase(), value);
      } else {
        element.setAttribute(key, value);
      }
    });
    
    children.forEach(child => {
      if (typeof child === 'string') {
        element.appendChild(document.createTextNode(child));
      } else {
        element.appendChild(child);
      }
    });
    
    return element;
  }

  static getElement(selector) {
    return document.querySelector(selector);
  }

  static getElements(selector) {
    return Array.from(document.querySelectorAll(selector));
  }

  static addClass(element, className) {
    if (element) element.classList.add(className);
  }

  static removeClass(element, className) {
    if (element) element.classList.remove(className);
  }

  static toggleClass(element, className) {
    if (element) element.classList.toggle(className);
  }

  static hasClass(element, className) {
    return element ? element.classList.contains(className) : false;
  }

  // Event utilities
  static debounce(func, wait, immediate = false) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        timeout = null;
        if (!immediate) func(...args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func(...args);
    };
  }

  static throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  static once(func) {
    let called = false;
    return function(...args) {
      if (!called) {
        called = true;
        return func.apply(this, args);
      }
    };
  }

  // Storage utilities
  static setStorage(key, value, type = 'local') {
    try {
      const storage = type === 'session' ? sessionStorage : localStorage;
      storage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Storage error:', error);
      return false;
    }
  }

  static getStorage(key, defaultValue = null, type = 'local') {
    try {
      const storage = type === 'session' ? sessionStorage : localStorage;
      const item = storage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Storage error:', error);
      return defaultValue;
    }
  }

  static removeStorage(key, type = 'local') {
    try {
      const storage = type === 'session' ? sessionStorage : localStorage;
      storage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Storage error:', error);
      return false;
    }
  }

  static clearStorage(type = 'local') {
    try {
      const storage = type === 'session' ? sessionStorage : localStorage;
      storage.clear();
      return true;
    } catch (error) {
      console.error('Storage error:', error);
      return false;
    }
  }

  // URL utilities
  static getUrlParams() {
    return new URLSearchParams(window.location.search);
  }

  static getUrlParam(name, defaultValue = null) {
    const params = this.getUrlParams();
    return params.get(name) || defaultValue;
  }

  static setUrlParam(name, value) {
    const url = new URL(window.location);
    url.searchParams.set(name, value);
    window.history.replaceState({}, '', url);
  }

  static removeUrlParam(name) {
    const url = new URL(window.location);
    url.searchParams.delete(name);
    window.history.replaceState({}, '', url);
  }

  // Validation utilities
  static isEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static isUrl(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  static isPhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
  }

  static isEmpty(value) {
    if (value === null || value === undefined) return true;
    if (typeof value === 'string') return value.trim().length === 0;
    if (Array.isArray(value)) return value.length === 0;
    if (typeof value === 'object') return Object.keys(value).length === 0;
    return false;
  }

  // Performance utilities
  static measureTime(func, label = 'Function') {
    const start = performance.now();
    const result = func();
    const end = performance.now();
    console.log(`${label} took ${end - start} milliseconds`);
    return result;
  }

  static memoize(func) {
    const cache = new Map();
    return function(...args) {
      const key = JSON.stringify(args);
      if (cache.has(key)) {
        return cache.get(key);
      }
      const result = func.apply(this, args);
      cache.set(key, result);
      return result;
    };
  }

  // Color utilities
  static hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  static rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }

  static getContrastColor(hexColor) {
    const rgb = this.hexToRgb(hexColor);
    if (!rgb) return '#000000';
    
    const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
    return brightness > 128 ? '#000000' : '#ffffff';
  }

  // File utilities
  static formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  static getFileExtension(filename) {
    return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
  }

  static downloadFile(data, filename, type = 'text/plain') {
    const blob = new Blob([data], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // Device utilities
  static isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  static isTablet() {
    return /iPad|Android(?!.*Mobile)/i.test(navigator.userAgent);
  }

  static isDesktop() {
    return !this.isMobile() && !this.isTablet();
  }

  static getDeviceType() {
    if (this.isMobile()) return 'mobile';
    if (this.isTablet()) return 'tablet';
    return 'desktop';
  }

  static getViewportSize() {
    return {
      width: Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0),
      height: Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
    };
  }

  // Animation utilities
  static animate(element, keyframes, options = {}) {
    if (!element || !element.animate) return null;
    
    const defaultOptions = {
      duration: 300,
      easing: 'ease-in-out',
      fill: 'forwards'
    };
    
    return element.animate(keyframes, { ...defaultOptions, ...options });
  }

  static fadeIn(element, duration = 300) {
    return this.animate(element, [
      { opacity: 0 },
      { opacity: 1 }
    ], { duration });
  }

  static fadeOut(element, duration = 300) {
    return this.animate(element, [
      { opacity: 1 },
      { opacity: 0 }
    ], { duration });
  }

  static slideUp(element, duration = 300) {
    const height = element.offsetHeight;
    return this.animate(element, [
      { height: `${height}px`, opacity: 1 },
      { height: '0px', opacity: 0 }
    ], { duration });
  }

  static slideDown(element, duration = 300) {
    const height = element.scrollHeight;
    return this.animate(element, [
      { height: '0px', opacity: 0 },
      { height: `${height}px`, opacity: 1 }
    ], { duration });
  }
}

// Make Helpers available globally
window.Helpers = Helpers;