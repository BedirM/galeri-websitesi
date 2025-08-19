// MÜJDE AUTO Oto Galeri JavaScript

// Performance optimization: Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Error handling utility
function handleError(error, context) {
    console.error(`Error in ${context}:`, error);
    // Could send to analytics service in production
}

// Performance monitoring
function logPerformanceMetric(metric, value) {
    if (typeof gtag !== 'undefined') {
        gtag('event', 'timing_complete', {
            name: metric,
            value: value
        });
    }
    console.log(`Performance: ${metric} = ${value}ms`);
}

// Page load performance tracking (kept outside DOMContentLoaded for early metrics)
window.addEventListener('load', function() {
    try {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        logPerformanceMetric('page_load_time', loadTime);
        
        // Log Core Web Vitals if available
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (entry.entryType === 'largest-contentful-paint') {
                        logPerformanceMetric('LCP', entry.startTime);
                    }
                }
            });
            observer.observe({ entryTypes: ['largest-contentful-paint'] });
        }
    } catch (error) {
        handleError(error, 'performance monitoring');
    }
});

// Error boundary for unhandled errors
window.addEventListener('error', function(event) {
    handleError(event.error, 'unhandled error');
});

window.addEventListener('unhandledrejection', function(event) {
    handleError(event.reason, 'unhandled promise rejection');
});

// Performance monitoring and optimization
class PerformanceMonitor {
    constructor() {
        this.metrics = {};
        this.observers = [];
        this.init();
    }

    init() {
        if ('PerformanceObserver' in window) {
            this.observeLCP();
            this.observeFID();
            this.observeCLS();
        }
        this.observePageLoad();
        this.observeResources();
    }

    observeLCP() {
        const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                this.metrics.LCP = entry.startTime;
                this.logMetric('LCP', entry.startTime);
            }
        });
        observer.observe({ entryTypes: ['largest-contentful-paint'] });
        this.observers.push(observer);
    }

    observeFID() {
        const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                this.metrics.FID = entry.processingStart - entry.startTime;
                this.logMetric('FID', this.metrics.FID);
            }
        });
        observer.observe({ entryTypes: ['first-input'] });
        this.observers.push(observer);
    }

    observeCLS() {
        let clsValue = 0;
        const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (!entry.hadRecentInput) {
                    clsValue += entry.value;
                    this.metrics.CLS = clsValue;
                    this.logMetric('CLS', clsValue);
                }
            }
        });
        observer.observe({ entryTypes: ['layout-shift'] });
        this.observers.push(observer);
    }

    observePageLoad() {
        window.addEventListener('load', () => {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            this.metrics.pageLoadTime = loadTime;
            this.logMetric('Page Load Time', loadTime);
        });
    }

    observeResources() {
        const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (entry.entryType === 'resource') {
                    this.logMetric('Resource Load', entry.duration, entry.name);
                }
            }
        });
        observer.observe({ entryTypes: ['resource'] });
        this.observers.push(observer);
    }

    logMetric(name, value, details = '') {
        const message = `Performance: ${name} = ${value}ms${details ? ` (${details})` : ''}`;
        console.log(message);
        if (typeof gtag !== 'undefined') {
            gtag('event', 'timing_complete', {
                name: name,
                value: Math.round(value),
                event_category: 'Performance'
            });
        }
    }

    getMetrics() {
        return this.metrics;
    }

    destroy() {
        this.observers.forEach(observer => observer.disconnect());
    }
}

// Enhanced Security Manager
class SecurityManager {
    constructor() {
        this.csrfToken = this.generateCSRFToken();
        this.init();
    }

    init() {
        // Prevent clickjacking
        if (window.self !== window.top) {
            window.top.location = window.self.location;
        }
        
        // Add CSRF token to forms
        this.addCSRFTokenToForms();
        
        // Enhanced input sanitization
        this.setupInputSanitization();
        
        // Advanced spam detection
        this.setupAdvancedSpamDetection();
        
        // Monitor suspicious activity
        this.monitorSuspiciousActivity();
        
        // Prevent common attacks
        this.preventCommonAttacks();
    }

    generateCSRFToken() {
        const array = new Uint32Array(8);
        crypto.getRandomValues(array);
        return Array.from(array, dec => ('0' + dec.toString(16)).substr(-2)).join('');
    }

    addCSRFTokenToForms() {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            const csrfInput = document.createElement('input');
            csrfInput.type = 'hidden';
            csrfInput.name = '_csrf';
            csrfInput.value = this.csrfToken;
            form.appendChild(csrfInput);
        });
    }

    setupInputSanitization() {
        const inputs = document.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', (e) => {
                this.sanitizeInput(e.target);
            });
        });
    }

    sanitizeInput(input) {
        let value = input.value;
        
        // Remove potentially dangerous characters
        value = value.replace(/[<>]/g, '');
        
        // Prevent script injection
        value = value.replace(/javascript:/gi, '');
        value = value.replace(/on\w+=/gi, '');
        
        input.value = value;
    }

    setupAdvancedSpamDetection() {
        // Honeypot enhancement
        const honeypotFields = document.querySelectorAll('input[name="website"]');
        honeypotFields.forEach(field => {
            field.style.display = 'none';
            field.setAttribute('tabindex', '-1');
            field.setAttribute('autocomplete', 'off');
        });

        // Time-based spam detection
        this.formSubmissionTimes = new Map();
    }

    monitorSuspiciousActivity() {
        let clickCount = 0;
        let lastClickTime = 0;
        
        document.addEventListener('click', (e) => {
            const now = Date.now();
            if (now - lastClickTime < 100) { // Rapid clicks
                clickCount++;
                if (clickCount > 50) {
                    console.warn('Suspicious rapid clicking detected');
                    this.handleSuspiciousActivity('rapid_clicking');
                }
            } else {
                clickCount = 1;
            }
            lastClickTime = now;
        });

        // Monitor for automated form filling
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            let fillTime = 0;
            const startTime = Date.now();
            
            form.addEventListener('input', () => {
                fillTime = Date.now() - startTime;
            });
            
            form.addEventListener('submit', (e) => {
                if (fillTime < 2000) { // Form filled too quickly
                    console.warn('Suspicious form submission speed detected');
                    this.handleSuspiciousActivity('fast_form_fill');
                }
            });
        });
    }

    preventCommonAttacks() {
        // Prevent right-click context menu (optional)
        document.addEventListener('contextmenu', (e) => {
            if (e.target.tagName === 'IMG') {
                e.preventDefault();
            }
        });

        // Prevent text selection on sensitive elements
        const sensitiveElements = document.querySelectorAll('.nav-brand, .signature-name');
        sensitiveElements.forEach(el => {
            el.style.userSelect = 'none';
            el.style.webkitUserSelect = 'none';
        });

        // Disable drag and drop on images
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            img.draggable = false;
        });
    }

    handleSuspiciousActivity(type) {
        console.warn(`Suspicious activity detected: ${type}`);
        // In production, you might want to send this to a monitoring service
    }

    validateCSRFToken(token) {
        return token === this.csrfToken;
    }
}

// Typewriter effect function
function typeWriter(element, text, speed = 100) {
    if (!element || !text) return; // Add null check
    let i = 0;
    const originalText = text; // Store original text to reset
    element.textContent = '';
    
    function type() {
        if (i < originalText.length) {
            element.textContent += originalText.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

// Notification function
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    // Dinamik pozisyon hesaplama
    const isMobile = window.innerWidth <= 768;
    const navbarHeight = 70; // Navbar yüksekliği
    const topPosition = isMobile ? navbarHeight + 20 : 20; // Desktop'ta 20px, mobilde navbar altında
    
    notification.style.cssText = `
        position: fixed;
        top: ${topPosition}px;
        right: ${isMobile ? '15px' : '20px'};
        left: ${isMobile ? '15px' : 'auto'};
        padding: ${isMobile ? '12px 15px' : '15px 20px'};
        border-radius: 5px;
        color: white;
        font-weight: bold;
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: ${isMobile ? 'none' : '400px'};
        width: ${isMobile ? 'calc(100% - 30px)' : 'auto'};
        text-align: ${isMobile ? 'center' : 'left'};
        font-size: ${isMobile ? '0.9rem' : '1rem'};
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
    `;

    if (type === 'success') {
        notification.style.backgroundColor = '#27ae60';
    } else if (type === 'info') {
        notification.style.backgroundColor = '#3498db';
    } else { // error
        notification.style.backgroundColor = '#e74c3c';
    }

    notification.textContent = message;
    document.body.appendChild(notification);

    // Ekran boyutu değişikliklerini dinle
    const updatePosition = () => {
        const currentIsMobile = window.innerWidth <= 768;
        const currentTopPosition = currentIsMobile ? navbarHeight + 20 : 20;
        
        notification.style.top = `${currentTopPosition}px`;
        notification.style.right = currentIsMobile ? '15px' : '20px';
        notification.style.left = currentIsMobile ? '15px' : 'auto';
        notification.style.width = currentIsMobile ? 'calc(100% - 30px)' : 'auto';
        notification.style.maxWidth = currentIsMobile ? 'none' : '400px';
        notification.style.textAlign = currentIsMobile ? 'center' : 'left';
        notification.style.fontSize = currentIsMobile ? '0.9rem' : '1rem';
        notification.style.padding = currentIsMobile ? '12px 15px' : '15px 20px';
    };

    window.addEventListener('resize', updatePosition);

    setTimeout(() => notification.style.transform = 'translateX(0)', 100); // Slide in
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)'; // Slide out
        setTimeout(() => {
            window.removeEventListener('resize', updatePosition);
            notification.remove();
        }, 300); // Remove after animation
    }, 5000); // Stay for 5 seconds
}

// Helper function to initialize typewriter effect on scroll
function setupTypewriterOnScroll(selector, speed = 100) {
    const element = document.querySelector(selector);
    if (!element) return;

    // Initially hide the text
    element.style.opacity = '0';
    element.style.visibility = 'hidden';
    const initialText = element.textContent; // Store text before it's cleared by typewriter

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                element.style.visibility = 'visible';
                element.style.opacity = '1';
                typeWriter(element, initialText, speed); // Use original text
                observer.unobserve(entry.target); // Stop observing once animated
            }
        });
    }, { threshold: 0.5 }); // Trigger when 50% of element is visible
    
    observer.observe(element);
}

// Helper function for hover effects
function setupHoverEffect(selector, enterTransform, leaveTransform) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = enterTransform;
        });
        item.addEventListener('mouseleave', function() {
            this.style.transform = leaveTransform;
        });
    });
}

// Vehicle Modal Function
function showVehicleModal(imgSrc, title, details, price) {
    const existingModal = document.querySelector('.vehicle-modal');
    if (existingModal) {
        existingModal.remove();
    }

    const modal = document.createElement('div');
    modal.className = 'vehicle-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.9);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 2000;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;

    modal.innerHTML = `
        <div class="modal-content" style="
            max-width: 90%;
            max-height: 90%;
            text-align: center;
            color: white;
            background: rgba(255,255,255,0.1);
            padding: 30px;
            border-radius: 15px;
            backdrop-filter: blur(10px);
        ">
            <button class="close-btn" style="
                position: absolute;
                top: 20px;
                right: 20px;
                background: none;
                border: none;
                color: white;
                font-size: 2rem;
                cursor: pointer;
            ">&times;</button>
            <img src="${imgSrc}" alt="${title}" style="
                max-width: 100%;
                max-height: 60vh;
                border-radius: 10px;
                margin-bottom: 20px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.5);
            ">
            <h3 style="color: #ff6b35; margin-bottom: 15px;">${title}</h3>
            <p style="margin-bottom: 15px; font-size: 1.1rem;">${details}</p>
            <div style="
                background: linear-gradient(135deg, #27ae60, #2ecc71);
                padding: 15px 30px;
                border-radius: 25px;
                display: inline-block;
                font-size: 1.3rem;
                font-weight: bold;
            ">${price}</div>
            <div style="margin-top: 20px;">
                <button class="btn btn-primary btn-lg me-3">
                    <i class="fas fa-phone"></i> Ara
                </button>
                <button class="btn btn-outline-light btn-lg">
                    <i class="fas fa-info-circle"></i> Detaylar
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    setTimeout(() => modal.style.opacity = '1', 10);
    
    const closeBtn = modal.querySelector('.close-btn');
    closeBtn.addEventListener('click', () => {
        modal.style.opacity = '0';
        setTimeout(() => modal.remove(), 300);
    });
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.opacity = '0';
            setTimeout(() => modal.remove(), 300);
        }
    });
    // Add keyboard navigation for vehicle modal (Moved from DOMContentLoaded)
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const currentModal = document.querySelector('.vehicle-modal');
            if (currentModal) {
                currentModal.style.opacity = '0';
                setTimeout(() => currentModal.remove(), 300);
            }
        }
    });
}

// Enhanced Error Handling and User Feedback
class UserFeedbackManager {
    constructor() {
        this.notifications = [];
        this.maxNotifications = 3;
        this.init();
    }

    init() {
        this.createNotificationContainer();
        this.setupGlobalErrorHandling();
    }

    createNotificationContainer() {
        const container = document.createElement('div');
        container.id = 'notification-container';
        container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            max-width: 400px;
        `;
        document.body.appendChild(container);
    }

    setupGlobalErrorHandling() {
        window.addEventListener('error', (e) => {
            this.showNotification('Bir hata oluştu. Lütfen sayfayı yenileyin.', 'error');
            console.error('Global error:', e.error);
        });

        window.addEventListener('unhandledrejection', (e) => {
            this.showNotification('Beklenmeyen bir hata oluştu.', 'error');
            console.error('Unhandled promise rejection:', e.reason);
        });
    }

    showNotification(message, type = 'info', duration = 5000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            background: ${this.getNotificationColor(type)};
            color: white;
            padding: 15px 20px;
            margin-bottom: 10px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            transform: translateX(100%);
            transition: transform 0.3s ease;
            font-weight: 500;
            position: relative;
            overflow: hidden;
        `;

        notification.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: space-between;">
                <span>${message}</span>
                <button class="notification-close" style="
                    background: none;
                    border: none;
                    color: white;
                    cursor: pointer;
                    font-size: 18px;
                    margin-left: 10px;
                ">&times;</button>
            </div>
            <div class="notification-progress" style="
                position: absolute;
                bottom: 0;
                left: 0;
                height: 3px;
                background: rgba(255,255,255,0.3);
                width: 100%;
                transform: scaleX(1);
                transform-origin: left;
                transition: transform ${duration}ms linear;
            "></div>
        `;

        const container = document.getElementById('notification-container');
        container.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Progress bar animation
        setTimeout(() => {
            const progress = notification.querySelector('.notification-progress');
            if (progress) {
                progress.style.transform = 'scaleX(0)';
            }
        }, 100);

        // Auto remove
        const timeout = setTimeout(() => {
            this.removeNotification(notification);
        }, duration);

        // Manual close
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            clearTimeout(timeout);
            this.removeNotification(notification);
        });

        this.notifications.push(notification);
        this.manageNotificationCount();
    }

    removeNotification(notification) {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
            const index = this.notifications.indexOf(notification);
            if (index > -1) {
                this.notifications.splice(index, 1);
            }
        }, 300);
    }

    manageNotificationCount() {
        if (this.notifications.length > this.maxNotifications) {
            const oldest = this.notifications.shift();
            this.removeNotification(oldest);
        }
    }

    getNotificationColor(type) {
        const colors = {
            success: '#27ae60',
            error: '#e74c3c',
            warning: '#f39c12',
            info: '#3498db'
        };
        return colors[type] || colors.info;
    }

    showLoading(element, message = 'Yükleniyor...') {
        const loadingOverlay = document.createElement('div');
        loadingOverlay.className = 'loading-overlay';
        loadingOverlay.innerHTML = `
            <div class="loading-content">
                <div class="loading-spinner"></div>
                <p>${message}</p>
            </div>
        `;
        loadingOverlay.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(255,255,255,0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            border-radius: inherit;
        `;

        element.style.position = 'relative';
        element.appendChild(loadingOverlay);
        return loadingOverlay;
    }

    hideLoading(element) {
        const overlay = element.querySelector('.loading-overlay');
        if (overlay) {
            overlay.remove();
        }
    }
}

// Enhanced form validation with better UX
class FormValidator {
    constructor(formId) {
        this.form = document.getElementById(formId);
        this.fields = {};
        this.init();
    }

    init() {
        if (!this.form) return;
        
        this.setupFieldValidation();
        this.setupRealTimeValidation();
        this.setupFormSubmission();
    }

    setupFieldValidation() {
        const inputs = this.form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            this.fields[input.name] = {
                element: input,
                isValid: false,
                errorMessage: ''
            };
        });
    }

    setupRealTimeValidation() {
        Object.values(this.fields).forEach(field => {
            const input = field.element;
            
            input.addEventListener('blur', () => {
                this.validateField(input.name);
            });
            
            input.addEventListener('input', () => {
                this.clearFieldError(input.name);
            });
        });
    }

    validateField(fieldName) {
        const field = this.fields[fieldName];
        if (!field) return false;

        const input = field.element;
        const value = input.value.trim();
        let isValid = true;
        let errorMessage = '';

        switch (fieldName) {
            case 'name':
                if (!value) {
                    errorMessage = 'Ad Soyad alanı zorunludur';
                    isValid = false;
                } else if (value.length < 2) {
                    errorMessage = 'Ad Soyad en az 2 karakter olmalıdır';
                    isValid = false;
                } else if (!/^[A-Za-zğüşıöçĞÜŞİÖÇ\s]+$/.test(value)) {
                    errorMessage = 'Sadece harf ve boşluk kullanabilirsiniz';
                    isValid = false;
                }
                break;

            case 'email':
                if (!value) {
                    errorMessage = 'E-posta alanı zorunludur';
                    isValid = false;
                } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
                    errorMessage = 'Geçerli bir e-posta adresi giriniz';
                    isValid = false;
                }
                break;

            case 'phone':
                if (!value) {
                    errorMessage = 'Telefon alanı zorunludur';
                    isValid = false;
                } else {
                    const digitsOnly = value.replace(/\D/g, '');
                    if (digitsOnly.length < 10 || digitsOnly.length > 15) {
                        errorMessage = 'Telefon numarası 10 ile 15 rakam arasında olmalıdır';
                        isValid = false;
                    }
                }
                break;

            case 'message':
                if (!value) {
                    errorMessage = 'Mesaj alanı zorunludur';
                    isValid = false;
                } else if (value.length < 10) {
                    errorMessage = 'Mesaj en az 10 karakter olmalıdır';
                    isValid = false;
                } else if (value.length > 500) {
                    errorMessage = 'Mesaj en fazla 500 karakter olabilir';
                    isValid = false;
                }
                break;
        }

        field.isValid = isValid;
        field.errorMessage = errorMessage;

        if (!isValid) {
            this.showFieldError(fieldName, errorMessage);
        } else {
            this.showFieldSuccess(fieldName);
        }

        return isValid;
    }

    showFieldError(fieldName, message) {
        const field = this.fields[fieldName];
        if (!field) return;

        const input = field.element;
        input.classList.add('is-invalid');
        input.classList.remove('is-valid');

        let errorDiv = input.parentNode.querySelector('.invalid-feedback');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'invalid-feedback';
            input.parentNode.appendChild(errorDiv);
        }
        errorDiv.textContent = message;
    }

    showFieldSuccess(fieldName) {
        const field = this.fields[fieldName];
        if (!field) return;

        const input = field.element;
        input.classList.add('is-valid');
        input.classList.remove('is-invalid');

        const errorDiv = input.parentNode.querySelector('.invalid-feedback');
        if (errorDiv) {
            errorDiv.remove();
        }
    }

    clearFieldError(fieldName) {
        const field = this.fields[fieldName];
        if (!field) return;

        const input = field.element;
        input.classList.remove('is-invalid', 'is-valid');

        const errorDiv = input.parentNode.querySelector('.invalid-feedback');
        if (errorDiv) {
            errorDiv.remove();
        }
    }

    validateForm() {
        let isValid = true;
        Object.keys(this.fields).forEach(fieldName => {
            if (!this.validateField(fieldName)) {
                isValid = false;
            }
        });
        return isValid;
    }

    setupFormSubmission() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (this.validateForm()) {
                this.submitForm();
            } else {
                if (window.userFeedback && typeof window.userFeedback.showNotification === 'function') {
                    window.userFeedback.showNotification('Lütfen tüm zorunlu alanları doldurun.', 'error');
                } else if (typeof showNotification === 'function') {
                    showNotification('Lütfen tüm zorunlu alanları doldurun.', 'error');
                } else {
                    alert('Lütfen tüm zorunlu alanları doldurun.');
                }
            }
        });
    }

    submitForm() {
        const submitBtn = this.form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="loading-spinner me-2"></span>Gönderiliyor...';
        
        // Web3Forms'e gönderim
        const formData = new FormData(this.form);
        
        // Web3Forms endpoint'i
        const web3formsUrl = 'https://api.web3forms.com/submit';
        
        fetch(web3formsUrl, {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        })
        .then(data => {
            console.log('Web3Forms response:', data);
            
            if (data.success) {
                // Başarı mesajı göster
                if (typeof showNotification === 'function') {
                    showNotification('Mesajınız başarıyla gönderildi!', 'success');
                } else {
                    alert('Mesajınız başarıyla gönderildi!');
                }
                
                this.form.reset();
                
                // Clear all validation states
                Object.keys(this.fields).forEach(fieldName => {
                    this.clearFieldError(fieldName);
                });
            } else {
                throw new Error('Form submission failed');
            }
        })
        .catch(error => {
            console.error('Form submission error:', error);
            // Hata mesajı göster
            if (typeof showNotification === 'function') {
                showNotification('Mesaj gönderilirken bir hata oluştu. Lütfen tekrar deneyin.', 'error');
            } else {
                alert('Mesaj gönderilirken bir hata oluştu. Lütfen tekrar deneyin.');
            }
        })
        .finally(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        });
    }
}

// Allow only name-related characters (letters and spaces)
function allowNameChars(event) {
    const char = String.fromCharCode(event.which);
    const allowedChars = /[A-Za-zğüşıöçĞÜŞİÖÇ\s]/;
    
    if (!allowedChars.test(char)) {
        event.preventDefault();
        return false;
    }
    return true;
}

// Validate name input and remove invalid characters
function validateNameInput(input) {
    let value = input.value;
    const allowedChars = /[A-Za-zğüşıöçĞÜŞİÖÇ\s]/g;
    
    const cleanedValue = value.match(allowedChars);
    
    if (cleanedValue) {
        input.value = cleanedValue.join('');
    } else {
        input.value = '';
    }
    
    const cleanLength = value.replace(/[^A-Za-zğüşıöçĞÜŞİÖÇ]/g, '').length;
    if (cleanLength > 0) {
        console.log(`Ad alanında ${cleanLength} harf var`);
    }
}

// Allow only phone-related characters
function allowPhoneChars(event) {
    const char = String.fromCharCode(event.which);
    const allowedChars = /[0-9\s\(\)\+\-\#]/;
    
    if (!allowedChars.test(char)) {
        event.preventDefault();
        return false;
    }
    return true;
}

// Validate phone input and remove invalid characters
function validatePhoneInput(input) {
    let value = input.value;
    const allowedChars = /[0-9\s\(\)\+\-\#]/g;
    
    const cleanedValue = value.match(allowedChars);
    
    if (cleanedValue) {
        input.value = cleanedValue.join('');
    } else {
        input.value = '';
    }
    
    const digitsOnly = value.replace(/\D/g, '');
    if (digitsOnly.length > 0) {
        console.log(`Telefon numarasında ${digitsOnly.length} rakam var`);
    }
}

// Spam protection: Rate limiting
const formSubmissionHistory = new Map();

function isSpamAttempt(userId, currentTime) {
    try {
        const userHistory = formSubmissionHistory.get(userId) || [];
        const recentSubmissions = userHistory.filter(time => currentTime - time < 60000); // 1 minute window
        
        if (recentSubmissions.length >= 3) { // Max 3 submissions per minute
            return true;
        }
        
        userHistory.push(currentTime);
        if (userHistory.length > 10) {
            userHistory.splice(0, userHistory.length - 10);
        }
        formSubmissionHistory.set(userId, userHistory);
        return false;
    } catch (error) {
        handleError(error, 'spam detection');
        return false;
    }
}

// Generate unique user ID based on IP and user agent
function generateUserId() {
    try {
        const userAgent = navigator.userAgent;
        const screenRes = `${screen.width}x${screen.height}`;
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        
        let hash = 0;
        const str = userAgent + screenRes + timezone;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash).toString(36);
    } catch (error) {
        handleError(error, 'user ID generation');
        return 'unknown';
    }
}

// Vehicle search functionality
function addVehicleSearch() {
    const searchBar = document.createElement('div');
    searchBar.className = 'vehicle-search';
    searchBar.style.cssText = `
        position: fixed;
        top: 100px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 1000;
        background: white;
        padding: 15px;
        border-radius: 25px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.2);
        display: none;
    `;
    searchBar.innerHTML = `
        <div class="input-group">
            <input type="text" class="form-control" placeholder="Araç markası, model veya özellik ara..." id="vehicleSearch">
            <button class="btn btn-primary" type="button">
                <i class="fas fa-search"></i>
            </button>
        </div>
    `;
    document.body.appendChild(searchBar);

    const debouncedShowHideSearchBar = debounce(() => {
        const mainContent = document.querySelector('.main-content');
        const scrollTop = mainContent ? mainContent.scrollTop : window.scrollY;
        if (scrollTop > 200) {
            searchBar.style.display = 'block';
        } else {
            searchBar.style.display = 'none';
        }
    }, 50);
    const mainContent = document.querySelector('.main-content');
    const scrollElement = mainContent || window;
    scrollElement.addEventListener('scroll', debouncedShowHideSearchBar);
    debouncedShowHideSearchBar(); // Initial check

    const searchInput = searchBar.querySelector('#vehicleSearch');
    const searchBtn = searchBar.querySelector('button');

    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        if (!searchTerm) {
            showNotification('Lütfen arama yapmak istediğiniz araç bilgisini girin', 'error');
            return;
        }

        const isMainPage = window.location.pathname.includes('index.html') || window.location.pathname.endsWith('/');
        if (!isMainPage) {
            const searchUrl = `index.html?search=${encodeURIComponent(searchTerm)}`;
            window.location.href = searchUrl;
            return;
        }
        performMainPageSearch(searchTerm);
    }
}

// Main page search functionality
function performMainPageSearch(searchTerm) {
    try {
        const vehicleCards = document.querySelectorAll('.vehicle-card');
        const searchResultsHeader = document.getElementById('searchResultsHeader');
        let visibleCount = 0;
        
        // Show search results header
        if (searchResultsHeader) {
            searchResultsHeader.style.display = 'block';
        }
        
        vehicleCards.forEach(card => {
            const title = card.querySelector('h5').textContent.toLowerCase();
            const details = card.querySelector('p').textContent.toLowerCase();
            
            if (title.includes(searchTerm) || details.includes(searchTerm)) {
                card.style.display = 'block';
                card.classList.add('search-result');
                visibleCount++;
                setTimeout(() => {
                    card.classList.remove('search-result');
                }, 1000);
            } else {
                card.style.display = 'none';
                card.classList.remove('search-result');
            }
        });

        if (visibleCount === 0) {
            showNotification('Aradığınız kriterlere uygun araç bulunamadı. Detaylı bilgi ve özel kampanyalar için lütfen bizimle iletişime geçiniz.', 'info');
        } else {
            showNotification(`${visibleCount} araç bulundu`, 'success');
            const vehiclesSection = document.querySelector('#vehicles');
            if (vehiclesSection) {
                vehiclesSection.scrollIntoView({ behavior: 'smooth' });
            }
        }
    } catch (error) {
        handleError(error, 'main page search');
        showNotification('Arama sırasında bir hata oluştu', 'error');
    }
}

// Clear search function
function clearSearch() {
    try {
        // Hide search results header
        const searchResultsHeader = document.getElementById('searchResultsHeader');
        if (searchResultsHeader) {
            searchResultsHeader.style.display = 'none';
        }
        
        // Clear search input
        const searchInput = document.querySelector('#vehicleSearch');
        if (searchInput) {
            searchInput.value = '';
        }
        
        // Show all vehicle cards
        const vehicleCards = document.querySelectorAll('.vehicle-card');
        vehicleCards.forEach(card => {
            card.style.display = 'block';
            card.classList.remove('search-result');
        });
        
        // Show success message
        showNotification('Arama temizlendi, tüm araçlar gösteriliyor', 'success');
        
    } catch (error) {
        handleError(error, 'clear search');
        showNotification('Arama temizlenirken bir hata oluştu', 'error');
    }
}

// Check URL search parameter and perform search if present
function checkURLSearchParameter() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const searchTerm = urlParams.get('search');
        
        if (searchTerm) {
            console.log('Search parameter found:', searchTerm);
            setTimeout(() => {
                const searchInput = document.querySelector('#vehicleSearch');
                if (searchInput) {
                    searchInput.value = searchTerm;
                }
                performMainPageSearch(searchTerm);
                const newUrl = window.location.pathname;
                window.history.replaceState({}, document.title, newUrl);
            }, 1000);
        }
    } catch (error) {
        handleError(error, 'URL search parameter check');
    }
}

// Enhanced Analytics and User Behavior Tracking
class AnalyticsManager {
    constructor() {
        this.events = [];
        this.sessionStart = Date.now();
        this.init();
    }

    init() {
        this.trackPageView();
        this.trackUserEngagement();
        this.trackFormInteractions();
        this.trackVehicleInteractions();
        this.trackPerformanceMetrics();
    }

    trackPageView() {
        const pageData = {
            event: 'page_view',
            page: window.location.pathname,
            title: document.title,
            timestamp: Date.now(),
            userAgent: navigator.userAgent,
            screenResolution: `${screen.width}x${screen.height}`,
            language: navigator.language
        };
        
        this.sendEvent(pageData);
    }

    trackUserEngagement() {
        // Track scroll depth
        let maxScroll = 0;
        const mainContent = document.querySelector('.main-content');
        const scrollElement = mainContent || window;
        
        scrollElement.addEventListener('scroll', debounce(() => {
            const scrollTop = mainContent ? mainContent.scrollTop : window.scrollY;
            const scrollHeight = mainContent ? mainContent.scrollHeight : document.documentElement.scrollHeight;
            const scrollPercent = Math.round((scrollTop / (scrollHeight - window.innerHeight)) * 100);
            
            if (scrollPercent > maxScroll) {
                maxScroll = scrollPercent;
                if (maxScroll % 25 === 0) { // Track every 25%
                    this.sendEvent({
                        event: 'scroll_depth',
                        depth: maxScroll,
                        page: window.location.pathname
                    });
                }
            }
        }, 1000));

        // Track time on page
        setInterval(() => {
            const timeOnPage = Math.round((Date.now() - this.sessionStart) / 1000);
            if (timeOnPage % 30 === 0) { // Track every 30 seconds
                this.sendEvent({
                    event: 'time_on_page',
                    seconds: timeOnPage,
                    page: window.location.pathname
                });
            }
        }, 30000);
    }

    trackFormInteractions() {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            // Track form start
            const inputs = form.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                input.addEventListener('focus', () => {
                    this.sendEvent({
                        event: 'form_field_focus',
                        field: input.name,
                        form: form.id || 'contact_form'
                    });
                });
            });

            // Track form submission
            form.addEventListener('submit', (e) => {
                this.sendEvent({
                    event: 'form_submit',
                    form: form.id || 'contact_form',
                    success: true
                });
            });
        });
    }

    trackVehicleInteractions() {
        const vehicleCards = document.querySelectorAll('.vehicle-card');
        vehicleCards.forEach(card => {
            card.addEventListener('click', () => {
                const title = card.querySelector('h5')?.textContent || 'Unknown Vehicle';
                this.sendEvent({
                    event: 'vehicle_click',
                    vehicle: title,
                    page: window.location.pathname
                });
            });
        });

        // Track search
        const searchInput = document.querySelector('#vehicleSearch');
        if (searchInput) {
            searchInput.addEventListener('input', debounce((e) => {
                if (e.target.value.length > 2) {
                    this.sendEvent({
                        event: 'vehicle_search',
                        query: e.target.value,
                        page: window.location.pathname
                    });
                }
            }, 1000));
        }
    }

    trackPerformanceMetrics() {
        // Track Core Web Vitals
        if ('PerformanceObserver' in window) {
            // Largest Contentful Paint
            const lcpObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                this.sendEvent({
                    event: 'performance_metric',
                    metric: 'LCP',
                    value: Math.round(lastEntry.startTime),
                    page: window.location.pathname
                });
            });
            lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

            // First Input Delay
            const fidObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    this.sendEvent({
                        event: 'performance_metric',
                        metric: 'FID',
                        value: Math.round(entry.processingStart - entry.startTime),
                        page: window.location.pathname
                    });
                });
            });
            fidObserver.observe({ entryTypes: ['first-input'] });

            // Cumulative Layout Shift
            let clsValue = 0;
            const clsObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                        if (clsValue > 0.1) {
                            this.sendEvent({
                                event: 'performance_metric',
                                metric: 'CLS',
                                value: Math.round(clsValue * 1000) / 1000,
                                page: window.location.pathname
                            });
                        }
                    }
                });
            });
            clsObserver.observe({ entryTypes: ['layout-shift'] });
        }
    }

    sendEvent(data) {
        // Add session data
        data.sessionId = this.getSessionId();
        data.timestamp = Date.now();
        
        // Store locally for offline sync
        this.events.push(data);

        // Sadece localStorage'da sakla (statik barındırma için)
        this.storeLocally(data);
        
        // Keep only last 100 events in memory
        if (this.events.length > 100) {
            this.events = this.events.slice(-100);
        }
    }

    // Statik sitede ağ isteği atmayalım (405 hatasının kaynağı burasıydı)
    sendToAnalytics(_data) {
        this.storeLocally(_data);
    }

    storeLocally(data) {
        try {
            const existingData = JSON.parse(localStorage.getItem('analytics_data') || '[]');
            existingData.push({
                ...data,
                timestamp: new Date().toISOString()
            });
            if (existingData.length > 100) {
                existingData.splice(0, existingData.length - 100);
            }
            localStorage.setItem('analytics_data', JSON.stringify(existingData));
        } catch (error) {
            console.log('Could not store analytics data locally');
        }
    }

    getSessionId() {
        let sessionId = sessionStorage.getItem('analytics_session_id');
        if (!sessionId) {
            sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            sessionStorage.setItem('analytics_session_id', sessionId);
        }
        return sessionId;
    }

    // Sync offline events when back online
    syncOfflineEvents() {
        if (this.events.length > 0) {
            this.events.forEach(event => {
                this.sendToAnalytics(event);
            });
            this.events = [];
        }
    }
}

// Service Worker Registration
async function registerServiceWorker() {
    // Only register Service Worker if not running on file:// protocol
    if (window.location.protocol === 'file:') {
        console.log('Service Worker: Skipping registration in local development (file:// protocol)');
        return;
    }
    
    if ('serviceWorker' in navigator) {
        try {
            const registration = await navigator.serviceWorker.register('/sw.js');
            console.log('Service Worker registered successfully:', registration);
            
            // Check for updates
            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        // New version available
                        showUpdateNotification();
                    }
                });
            });
            
            // Handle service worker updates
            navigator.serviceWorker.addEventListener('controllerchange', () => {
                console.log('New service worker activated');
                window.location.reload();
            });
            
        } catch (error) {
            console.error('Service Worker registration failed:', error);
        }
    }
}

// Show update notification
function showUpdateNotification() {
    if (window.userFeedback && typeof window.userFeedback.showNotification === 'function') {
        window.userFeedback.showNotification(
            'Yeni bir güncelleme mevcut. Sayfayı yenileyin.',
            'info',
            10000
        );
    } else if (typeof showNotification === 'function') {
        showNotification('Yeni bir güncelleme mevcut. Sayfayı yenileyin.', 'info');
    }
}

// PWA Install Prompt
let deferredPrompt;

// Only load PWA manifest if not running on file:// protocol
if (window.location.protocol !== 'file:') {
    // Add manifest link dynamically
    const manifestLink = document.createElement('link');
    manifestLink.rel = 'manifest';
    manifestLink.href = 'manifest.json';
    document.head.appendChild(manifestLink);
}

//window.addEventListener('beforeinstallprompt', (e) => {
    // Show install button or notification
    //showInstallPrompt();
//});

function showInstallPrompt() {
    if (window.userFeedback && typeof window.userFeedback.showNotification === 'function') {
        window.userFeedback.showNotification(
            'MÜJDE AUTO\'yu ana ekranınıza ekleyin!',
            'info',
            8000
        );
    } else if (typeof showNotification === 'function') {
        showNotification('MÜJDE AUTO\'yu ana ekranınıza ekleyin!', 'info');
    }
}

// Handle app install
window.addEventListener('appinstalled', () => {
    console.log('PWA installed successfully');
    deferredPrompt = null;
    
    if (window.userFeedback && typeof window.userFeedback.showNotification === 'function') {
        window.userFeedback.showNotification(
            'MÜJDE AUTO başarıyla yüklendi!',
            'success'
        );
    } else if (typeof showNotification === 'function') {
        showNotification('MÜJDE AUTO başarıyla yüklendi!', 'success');
    }
});

// Main DOMContentLoaded logic
document.addEventListener('DOMContentLoaded', function() {
    // Initialize managers
    const performanceMonitor = new PerformanceMonitor();
    const securityManager = new SecurityManager();

    // Global hale getir (diğer fonksiyonlar erişebilsin)
    window.userFeedback = new UserFeedbackManager();
    const analyticsManager = new AnalyticsManager();
    
    // Initialize form validation
    const contactForm = document.querySelector('#contactForm');
    if (contactForm) {
        const formValidator = new FormValidator('contactForm');
    }
    
    // Setup character counter for message field
    const messageTextarea = document.querySelector('#message');
    const charCount = document.querySelector('#charCount');
    if (messageTextarea && charCount) {
        messageTextarea.addEventListener('input', function() {
            const currentLength = this.value.length;
            charCount.textContent = currentLength;
            
            if (currentLength > 450) {
                charCount.style.color = '#dc3545';
            } else if (currentLength > 400) {
                charCount.style.color = '#ffc107';
            } else {
                charCount.style.color = '#6c757d';
            }
        });
    }
    
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Custom navbar functionality
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            const icons = this.querySelectorAll('.nav-toggle-icon');
            icons.forEach((icon, index) => {
                if (navMenu.classList.contains('active')) {
                    if (index === 0) icon.style.transform = 'rotate(45deg) translate(5px, 5px)';
                    if (index === 1) icon.style.opacity = '0';
                    if (index === 2) icon.style.transform = 'rotate(-45deg) translate(7px, -6px)';
                } else {
                    icon.style.transform = 'none';
                    icon.style.opacity = '1';
                }
            });
        });
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                const icons = navToggle.querySelectorAll('.nav-toggle-icon');
                icons.forEach(icon => {
                    icon.style.transform = 'none';
                    icon.style.opacity = '1';
                });
            });
        });
        document.addEventListener('click', function(e) {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                const icons = navToggle.querySelectorAll('.nav-toggle-icon');
                icons.forEach(icon => {
                    icon.style.transform = 'none';
                    icon.style.opacity = '1';
                });
            }
        });
    }
    
    // Custom navbar scroll effect
    const customNavbar = document.querySelector('.custom-navbar');
    if (customNavbar) {
        const mainContent = document.querySelector('.main-content');
        const debouncedScrollNavbar = debounce(function() {
            const scrollTop = mainContent ? mainContent.scrollTop : window.scrollY;
            if (scrollTop > 50) {
                customNavbar.style.backgroundColor = 'rgba(33, 37, 41, 0.95)';
                customNavbar.style.backdropFilter = 'blur(10px)';
            } else {
                customNavbar.style.backgroundColor = '#212529';
                customNavbar.style.backdropFilter = 'none';
            }
        }, 50);
        const scrollElement = mainContent || window;
        scrollElement.addEventListener('scroll', debouncedScrollNavbar);
    }

    // Vehicle card click events
    const vehicleCards = document.querySelectorAll('.vehicle-card');
    vehicleCards.forEach(card => {
        card.addEventListener('click', function () {
            const img = this.querySelector('img');
            const titleEl = this.querySelector('h5');
            const detailsEl = this.querySelector('p');
            const priceEl = this.querySelector('.price');

            const title = titleEl ? titleEl.textContent : "Araç";
            const details = detailsEl ? detailsEl.textContent : "Detay yok";
            const price = priceEl ? priceEl.textContent : "Fiyat belirtilmedi";

            // Yeni sayfa açma yok, sadece alert ile göster
            alert(`${title}\n${details}\n${price}`);
        });

        // Hover tooltip ekle
        const img = card.querySelector('img');
        const titleEl = card.querySelector('h5');
        if (img && titleEl) {
            img.title = titleEl.textContent;
        }
    });

    // Add scroll reveal animation (optimized)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    const observer = new IntersectionObserver(function(entries) {
        try {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        } catch (error) {
            handleError(error, 'intersection observer');
        }
    }, observerOptions);

    // Observe elements for animation with error handling
    const animateElements = document.querySelectorAll('.vehicle-card, .service-card, .feature-item, .mission-card, .vision-card, .value-card, .team-card, .stat-item, .service-item, .contact-form, .info-card, .map-container, .accordion-item');
    animateElements.forEach(el => {
        try {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        } catch (error) {
            handleError(error, 'element animation setup');
        }
    });

    // Back to Top Button
    const backToTopButton = document.getElementById('backToTop');
    if (backToTopButton) {
        const mainContent = document.querySelector('.main-content');
        const debouncedScrollBackToTop = debounce(function() {
            const scrollTop = mainContent ? mainContent.scrollTop : window.scrollY;
            if (scrollTop > 300) {
                backToTopButton.classList.add('show');
            } else {
                backToTopButton.classList.remove('show');
            }
        }, 50);
        
        // Listen to scroll on main-content instead of window
        const scrollElement = mainContent || window;
        scrollElement.addEventListener('scroll', debouncedScrollBackToTop);
        
        backToTopButton.addEventListener('click', function() {
            if (mainContent) {
                mainContent.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            } else {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }
        });
    }

    // Add hover effects
    setupHoverEffect('.service-card', 'translateY(-10px) scale(1.02)', 'translateY(0) scale(1)');
    setupHoverEffect('.mission-card, .vision-card', 'translateY(-10px) scale(1.02)', 'translateY(0) scale(1)');
    setupHoverEffect('.value-card', 'translateY(-10px) scale(1.02)', 'translateY(0) scale(1)');
    setupHoverEffect('.team-card', 'translateY(-10px) scale(1.02)', 'translateY(0) scale(1)');
    setupHoverEffect('.stat-item', 'translateY(-5px) scale(1.05)', 'translateY(0) scale(1)');
    setupHoverEffect('.service-item', 'translateY(-10px) scale(1.02)', 'translateY(0) scale(1)');
    setupHoverEffect('.contact-form', 'translateY(-5px) scale(1.01)', 'translateY(0) scale(1)');
    setupHoverEffect('.info-card', 'translateY(-5px) scale(1.02)', 'translateY(0) scale(1)');
    setupHoverEffect('.map-container', 'translateY(-5px) scale(1.01)', 'translateY(0) scale(1)');
    setupHoverEffect('.accordion-item', 'translateY(-2px) scale(1.01)', 'translateY(0) scale(1)');
    setupHoverEffect('.social-links .btn', 'translateY(-3px) scale(1.05)', 'translateY(0) scale(1)');
    
    // Add typing effect to hero title (Main page)
    setupTypewriterOnScroll('.hero-section h1', 80); // Fast on main page

    // Add typing effects for other section titles
    setupTypewriterOnScroll('#servicesTitle');
    setupTypewriterOnScroll('#whyChooseTitle');
    setupTypewriterOnScroll('#aboutContentTitle');
    setupTypewriterOnScroll('#valuesTitle');
    setupTypewriterOnScroll('#teamTitle');
    setupTypewriterOnScroll('#contactFormTitle');
    setupTypewriterOnScroll('#mapTitle');
    setupTypewriterOnScroll('#faqTitle');
    setupTypewriterOnScroll('#socialTitle');

    // Add vehicle search functionality
    addVehicleSearch();

    // Check for search parameter in URL and perform search if present
    checkURLSearchParameter();
    
    // Register Service Worker for PWA
    registerServiceWorker();
});
