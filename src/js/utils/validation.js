// Form validation utilities
class Validation {
  constructor() {
    this.rules = new Map();
    this.messages = new Map();
    this.setupDefaultRules();
    this.setupDefaultMessages();
  }

  setupDefaultRules() {
    // Basic validation rules
    this.rules.set('required', (value) => {
      if (typeof value === 'string') return value.trim().length > 0;
      if (Array.isArray(value)) return value.length > 0;
      return value !== null && value !== undefined && value !== '';
    });

    this.rules.set('email', (value) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value);
    });

    this.rules.set('min', (value, min) => {
      if (typeof value === 'string') return value.length >= min;
      if (typeof value === 'number') return value >= min;
      return false;
    });

    this.rules.set('max', (value, max) => {
      if (typeof value === 'string') return value.length <= max;
      if (typeof value === 'number') return value <= max;
      return false;
    });

    this.rules.set('minLength', (value, min) => {
      return typeof value === 'string' && value.length >= min;
    });

    this.rules.set('maxLength', (value, max) => {
      return typeof value === 'string' && value.length <= max;
    });

    this.rules.set('pattern', (value, pattern) => {
      const regex = new RegExp(pattern);
      return regex.test(value);
    });

    this.rules.set('numeric', (value) => {
      return !isNaN(value) && !isNaN(parseFloat(value));
    });

    this.rules.set('integer', (value) => {
      return Number.isInteger(Number(value));
    });

    this.rules.set('positive', (value) => {
      return Number(value) > 0;
    });

    this.rules.set('negative', (value) => {
      return Number(value) < 0;
    });

    this.rules.set('url', (value) => {
      try {
        new URL(value);
        return true;
      } catch {
        return false;
      }
    });

    this.rules.set('phone', (value) => {
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      return phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''));
    });

    this.rules.set('date', (value) => {
      const date = new Date(value);
      return date instanceof Date && !isNaN(date);
    });

    this.rules.set('dateAfter', (value, afterDate) => {
      const date = new Date(value);
      const after = new Date(afterDate);
      return date > after;
    });

    this.rules.set('dateBefore', (value, beforeDate) => {
      const date = new Date(value);
      const before = new Date(beforeDate);
      return date < before;
    });

    this.rules.set('confirmed', (value, confirmValue) => {
      return value === confirmValue;
    });

    this.rules.set('in', (value, allowedValues) => {
      return allowedValues.includes(value);
    });

    this.rules.set('notIn', (value, forbiddenValues) => {
      return !forbiddenValues.includes(value);
    });

    this.rules.set('alpha', (value) => {
      return /^[a-zA-Z]+$/.test(value);
    });

    this.rules.set('alphaNumeric', (value) => {
      return /^[a-zA-Z0-9]+$/.test(value);
    });

    this.rules.set('alphaSpace', (value) => {
      return /^[a-zA-Z\s]+$/.test(value);
    });

    this.rules.set('strongPassword', (value) => {
      // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special char
      const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      return strongRegex.test(value);
    });
  }

  setupDefaultMessages() {
    this.messages.set('required', 'This field is required.');
    this.messages.set('email', 'Please enter a valid email address.');
    this.messages.set('min', 'Value must be at least {0}.');
    this.messages.set('max', 'Value must not exceed {0}.');
    this.messages.set('minLength', 'Must be at least {0} characters long.');
    this.messages.set('maxLength', 'Must not exceed {0} characters.');
    this.messages.set('pattern', 'Invalid format.');
    this.messages.set('numeric', 'Must be a valid number.');
    this.messages.set('integer', 'Must be a whole number.');
    this.messages.set('positive', 'Must be a positive number.');
    this.messages.set('negative', 'Must be a negative number.');
    this.messages.set('url', 'Please enter a valid URL.');
    this.messages.set('phone', 'Please enter a valid phone number.');
    this.messages.set('date', 'Please enter a valid date.');
    this.messages.set('dateAfter', 'Date must be after {0}.');
    this.messages.set('dateBefore', 'Date must be before {0}.');
    this.messages.set('confirmed', 'Values do not match.');
    this.messages.set('in', 'Invalid selection.');
    this.messages.set('notIn', 'This value is not allowed.');
    this.messages.set('alpha', 'Only letters are allowed.');
    this.messages.set('alphaNumeric', 'Only letters and numbers are allowed.');
    this.messages.set('alphaSpace', 'Only letters and spaces are allowed.');
    this.messages.set('strongPassword', 'Password must be at least 8 characters with uppercase, lowercase, number, and special character.');
  }

  // Add custom validation rule
  addRule(name, validator, message) {
    this.rules.set(name, validator);
    if (message) {
      this.messages.set(name, message);
    }
  }

  // Add custom error message
  addMessage(rule, message) {
    this.messages.set(rule, message);
  }

  // Validate a single value against rules
  validateValue(value, rules, fieldName = 'Field') {
    const errors = [];
    
    for (const rule of rules) {
      let ruleName, ruleParams = [];
      
      if (typeof rule === 'string') {
        const parts = rule.split(':');
        ruleName = parts[0];
        if (parts[1]) {
          ruleParams = parts[1].split(',');
        }
      } else if (typeof rule === 'object') {
        ruleName = rule.rule;
        ruleParams = rule.params || [];
      }
      
      if (this.rules.has(ruleName)) {
        const validator = this.rules.get(ruleName);
        const isValid = validator(value, ...ruleParams);
        
        if (!isValid) {
          let message = this.messages.get(ruleName) || 'Validation failed.';
          
          // Replace placeholders in message
          ruleParams.forEach((param, index) => {
            message = message.replace(`{${index}}`, param);
          });
          
          // Replace field name placeholder
          message = message.replace('{field}', fieldName);
          
          errors.push({
            rule: ruleName,
            message: message,
            params: ruleParams
          });
        }
      }
    }
    
    return errors;
  }

  // Validate an object against a schema
  validate(data, schema) {
    const errors = {};
    let isValid = true;
    
    for (const [field, rules] of Object.entries(schema)) {
      const value = data[field];
      const fieldErrors = this.validateValue(value, rules, field);
      
      if (fieldErrors.length > 0) {
        errors[field] = fieldErrors;
        isValid = false;
      }
    }
    
    return {
      isValid,
      errors
    };
  }

  // Validate a form element
  validateForm(form, schema) {
    const formData = new FormData(form);
    const data = {};
    
    // Convert FormData to object
    for (const [key, value] of formData.entries()) {
      data[key] = value;
    }
    
    const result = this.validate(data, schema);
    
    // Clear previous errors
    this.clearFormErrors(form);
    
    // Display errors
    if (!result.isValid) {
      this.displayFormErrors(form, result.errors);
    }
    
    return result;
  }

  // Clear form errors
  clearFormErrors(form) {
    const errorElements = form.querySelectorAll('.form-error');
    errorElements.forEach(el => el.remove());
    
    const invalidInputs = form.querySelectorAll('.error');
    invalidInputs.forEach(input => input.classList.remove('error'));
  }

  // Display form errors
  displayFormErrors(form, errors) {
    for (const [field, fieldErrors] of Object.entries(errors)) {
      const input = form.querySelector(`[name="${field}"]`);
      
      if (input) {
        input.classList.add('error');
        
        // Create error message element
        const errorDiv = document.createElement('div');
        errorDiv.className = 'form-error';
        errorDiv.textContent = fieldErrors[0].message; // Show first error
        
        // Insert error message after input
        input.parentNode.insertBefore(errorDiv, input.nextSibling);
      }
    }
  }

  // Real-time validation for form fields
  setupRealTimeValidation(form, schema) {
    for (const field of Object.keys(schema)) {
      const input = form.querySelector(`[name="${field}"]`);
      
      if (input) {
        const validateField = () => {
          const value = input.value;
          const rules = schema[field];
          const errors = this.validateValue(value, rules, field);
          
          // Clear previous errors for this field
          const existingError = input.parentNode.querySelector('.form-error');
          if (existingError) {
            existingError.remove();
          }
          
          input.classList.remove('error', 'valid');
          
          if (errors.length > 0) {
            input.classList.add('error');
            
            const errorDiv = document.createElement('div');
            errorDiv.className = 'form-error';
            errorDiv.textContent = errors[0].message;
            input.parentNode.insertBefore(errorDiv, input.nextSibling);
          } else if (value.trim() !== '') {
            input.classList.add('valid');
          }
        };
        
        // Validate on blur and input events
        input.addEventListener('blur', validateField);
        input.addEventListener('input', Helpers.debounce(validateField, 300));
      }
    }
  }

  // Sanitize input values
  sanitize(value, type = 'string') {
    if (value === null || value === undefined) return '';
    
    switch (type) {
      case 'string':
        return String(value).trim();
      
      case 'email':
        return String(value).toLowerCase().trim();
      
      case 'number':
        const num = parseFloat(value);
        return isNaN(num) ? 0 : num;
      
      case 'integer':
        const int = parseInt(value);
        return isNaN(int) ? 0 : int;
      
      case 'boolean':
        return Boolean(value);
      
      case 'html':
        // Basic HTML sanitization (remove script tags)
        return String(value)
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
          .replace(/javascript:/gi, '')
          .replace(/on\w+="[^"]*"/gi, '');
      
      case 'alphaNumeric':
        return String(value).replace(/[^a-zA-Z0-9]/g, '');
      
      case 'alpha':
        return String(value).replace(/[^a-zA-Z]/g, '');
      
      case 'numeric':
        return String(value).replace(/[^0-9.-]/g, '');
      
      default:
        return String(value).trim();
    }
  }

  // Batch sanitize an object
  sanitizeObject(data, schema) {
    const sanitized = {};
    
    for (const [key, type] of Object.entries(schema)) {
      if (data.hasOwnProperty(key)) {
        sanitized[key] = this.sanitize(data[key], type);
      }
    }
    
    return sanitized;
  }

  // Common validation schemas
  static getCommonSchemas() {
    return {
      login: {
        email: ['required', 'email'],
        password: ['required', 'minLength:6']
      },
      
      registration: {
        name: ['required', 'minLength:2', 'maxLength:50', 'alphaSpace'],
        email: ['required', 'email'],
        password: ['required', 'strongPassword'],
        confirmPassword: ['required']
      },
      
      profile: {
        name: ['required', 'minLength:2', 'maxLength:50'],
        email: ['required', 'email'],
        phone: ['phone'],
        website: ['url']
      },
      
      quiz: {
        subject: ['required'],
        duration: ['required', 'numeric', 'min:5', 'max:180'],
        questionCount: ['required', 'integer', 'min:5', 'max:100']
      }
    };
  }

  // Validate password strength
  checkPasswordStrength(password) {
    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      special: /[@$!%*?&]/.test(password)
    };
    
    const score = Object.values(checks).filter(Boolean).length;
    
    let strength = 'Very Weak';
    if (score >= 5) strength = 'Very Strong';
    else if (score >= 4) strength = 'Strong';
    else if (score >= 3) strength = 'Medium';
    else if (score >= 2) strength = 'Weak';
    
    return {
      score,
      strength,
      checks,
      isStrong: score >= 4
    };
  }

  // File validation
  validateFile(file, options = {}) {
    const errors = [];
    
    // Check file size
    if (options.maxSize && file.size > options.maxSize) {
      errors.push(`File size must not exceed ${Helpers.formatFileSize(options.maxSize)}`);
    }
    
    if (options.minSize && file.size < options.minSize) {
      errors.push(`File size must be at least ${Helpers.formatFileSize(options.minSize)}`);
    }
    
    // Check file type
    if (options.allowedTypes) {
      const fileType = file.type;
      const fileExtension = file.name.split('.').pop().toLowerCase();
      
      const isTypeAllowed = options.allowedTypes.some(type => {
        if (type.includes('/')) {
          return fileType === type;
        } else {
          return fileExtension === type.toLowerCase();
        }
      });
      
      if (!isTypeAllowed) {
        errors.push(`File type not allowed. Allowed types: ${options.allowedTypes.join(', ')}`);
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Image validation
  validateImage(file, options = {}) {
    return new Promise((resolve) => {
      const fileValidation = this.validateFile(file, {
        allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
        ...options
      });
      
      if (!fileValidation.isValid) {
        resolve(fileValidation);
        return;
      }
      
      const img = new Image();
      const url = URL.createObjectURL(file);
      
      img.onload = () => {
        const errors = [];
        
        if (options.maxWidth && img.width > options.maxWidth) {
          errors.push(`Image width must not exceed ${options.maxWidth}px`);
        }
        
        if (options.maxHeight && img.height > options.maxHeight) {
          errors.push(`Image height must not exceed ${options.maxHeight}px`);
        }
        
        if (options.minWidth && img.width < options.minWidth) {
          errors.push(`Image width must be at least ${options.minWidth}px`);
        }
        
        if (options.minHeight && img.height < options.minHeight) {
          errors.push(`Image height must be at least ${options.minHeight}px`);
        }
        
        if (options.aspectRatio) {
          const ratio = img.width / img.height;
          const expectedRatio = options.aspectRatio;
          const tolerance = 0.1;
          
          if (Math.abs(ratio - expectedRatio) > tolerance) {
            errors.push(`Image aspect ratio should be ${expectedRatio}:1`);
          }
        }
        
        URL.revokeObjectURL(url);
        
        resolve({
          isValid: errors.length === 0,
          errors,
          dimensions: {
            width: img.width,
            height: img.height
          }
        });
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve({
          isValid: false,
          errors: ['Invalid image file']
        });
      };
      
      img.src = url;
    });
  }
}

// Create global instance
window.Validation = new Validation();