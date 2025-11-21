// Scroll Progress Bar
function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        progressBar.style.width = scrolled + '%';
    });
}

// Scroll Reveal Animation no Estilo Apple - Progressivo e Suave
function initScrollReveal() {
    // Apple-style easing curves
    const appleEasing = 'cubic-bezier(0.25, 0.1, 0.25, 1)'; // Apple's standard easing
    const appleEasingSmooth = 'cubic-bezier(0.42, 0, 0.58, 1)'; // Apple's smooth easing
    
    // Função para animação progressiva baseada em scroll
    function animateOnScroll(element, options = {}) {
        const {
            translateY = 60,
            opacityStart = 0,
            opacityEnd = 1,
            scaleStart = 0.95,
            scaleEnd = 1,
            duration = 1000,
            delay = 0
        } = options;
        
        let rafId = null;
        let hasAnimated = false;
        let isActive = true;
        
        function updateAnimation() {
            if (!isActive) return;
            
            const rect = element.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            const elementTop = rect.top;
            const elementHeight = rect.height;
            
            // Calcular progresso baseado na posição do elemento
            const viewportCenter = windowHeight * 0.5;
            const elementCenter = elementTop + (elementHeight * 0.5);
            const distanceFromCenter = elementCenter - viewportCenter;
            
            // Quando o elemento está próximo do centro da viewport
            if (distanceFromCenter < windowHeight * 0.3 && distanceFromCenter > -windowHeight * 0.3) {
                // Calcular progresso (0 a 1)
                const progress = Math.max(0, Math.min(1, 
                    1 - (Math.abs(distanceFromCenter) / (windowHeight * 0.3))
                ));
                
                // Aplicar easing suave da Apple
                const easedProgress = progress < 0.5 
                    ? 2 * progress * progress 
                    : 1 - Math.pow(-2 * progress + 2, 2) / 2;
                
                // Aplicar transformações progressivas
                const currentTranslateY = translateY * (1 - easedProgress);
                const currentOpacity = opacityStart + (opacityEnd - opacityStart) * easedProgress;
                const currentScale = scaleStart + (scaleEnd - scaleStart) * easedProgress;
                
                element.style.opacity = currentOpacity;
                element.style.transform = `translate3d(0, ${currentTranslateY}px, 0) scale(${currentScale})`;
                element.style.willChange = 'opacity, transform';
                
                if (easedProgress > 0.95 && !hasAnimated) {
                    hasAnimated = true;
                    element.style.willChange = 'auto';
                    // Parar animação quando completa
                    isActive = false;
                    if (rafId) {
                        cancelAnimationFrame(rafId);
                        rafId = null;
                    }
                    return;
                }
                
                rafId = requestAnimationFrame(updateAnimation);
            } else if (elementTop > windowHeight) {
                // Elemento ainda não entrou na viewport
                element.style.opacity = opacityStart;
                element.style.transform = `translate3d(0, ${translateY}px, 0) scale(${scaleStart})`;
                rafId = requestAnimationFrame(updateAnimation);
            } else if (elementTop + elementHeight < 0) {
                // Elemento já passou da viewport - animação completa
                element.style.opacity = opacityEnd;
                element.style.transform = `translate3d(0, 0, 0) scale(${scaleEnd})`;
                element.style.willChange = 'auto';
                isActive = false;
                if (rafId) {
                    cancelAnimationFrame(rafId);
                    rafId = null;
                }
            } else {
                rafId = requestAnimationFrame(updateAnimation);
            }
        }
        
        // Inicializar estado
        element.style.opacity = opacityStart;
        element.style.transform = `translate3d(0, ${translateY}px, 0) scale(${scaleStart})`;
        element.style.transition = `opacity ${duration}ms ${appleEasingSmooth}, transform ${duration}ms ${appleEasingSmooth}`;
        
        // Delay inicial se especificado
        if (delay > 0) {
            setTimeout(() => {
                updateAnimation();
            }, delay);
        } else {
            updateAnimation();
        }
        
        // Cleanup quando elemento sair da viewport
        return () => {
            if (rafId) {
                cancelAnimationFrame(rafId);
            }
        };
    }
    
    // Animações para elementos scroll-bottom no estilo Apple
    const scrollBottomElements = document.querySelectorAll('.scroll-bottom');
    scrollBottomElements.forEach((el, index) => {
        animateOnScroll(el, {
            translateY: 50,
            opacityStart: 0,
            opacityEnd: 1,
            scaleStart: 0.98,
            scaleEnd: 1,
            duration: 1200,
            delay: index * 100
        });
    });

    // Observar todos os elementos com classe animate-on-scroll (estilo Apple)
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    animateElements.forEach((el, index) => {
        animateOnScroll(el, {
            translateY: 40,
            opacityStart: 0,
            opacityEnd: 1,
            scaleStart: 0.97,
            scaleEnd: 1,
            duration: 1000,
            delay: index * 80
        });
    });

    // Observar cards e itens com animação progressiva no estilo Apple
    const cards = document.querySelectorAll('.depoimento-card, .caso-item, .conteudo-item, .bonus-item, .atencao-item');
    cards.forEach((card, index) => {
        animateOnScroll(card, {
            translateY: 30,
            opacityStart: 0,
            opacityEnd: 1,
            scaleStart: 0.96,
            scaleEnd: 1,
            duration: 1000,
            delay: (index % 3) * 100
        });
    });
}

// Animações de Texto Letra por Letra (inspirado no site de referência)
function initLetterAnimations() {
    const letterElements = document.querySelectorAll('.letter-animate');
    
    letterElements.forEach(element => {
        // Salvar HTML original para preservar spans e outros elementos
        const originalHTML = element.innerHTML;
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = originalHTML;
        
        // Extrair texto preservando estrutura
        function processNode(node, parentSpan) {
            if (node.nodeType === Node.TEXT_NODE) {
                const text = node.textContent;
                text.split('').forEach((char, charIndex) => {
                    const letterSpan = document.createElement('span');
                    letterSpan.className = 'letter';
                    letterSpan.textContent = char === ' ' ? '\u00A0' : char;
                    letterSpan.style.display = 'inline-block';
                    letterSpan.style.opacity = '0';
                    letterSpan.style.transform = 'translateY(100%)';
                    parentSpan.appendChild(letterSpan);
                });
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                // Preservar elementos HTML (como spans do Facebook)
                const clone = node.cloneNode(false);
                const wordSpan = document.createElement('span');
                wordSpan.style.display = 'inline-block';
                wordSpan.style.marginRight = '0.3em';
                
                Array.from(node.childNodes).forEach(child => {
                    processNode(child, wordSpan);
                });
                
                clone.appendChild(wordSpan);
                parentSpan.appendChild(clone);
            }
        }
        
        element.innerHTML = '';
        const container = document.createElement('span');
        container.style.display = 'inline-block';
        
        Array.from(tempDiv.childNodes).forEach(node => {
            processNode(node, container);
        });
        
        element.appendChild(container);
        
        // Aplicar delays progressivos
        const letters = element.querySelectorAll('.letter');
        letters.forEach((letter, index) => {
            letter.style.transition = `opacity 0.5s ease ${index * 0.03}s, transform 0.5s ease ${index * 0.03}s`;
        });
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const letters = entry.target.querySelectorAll('.letter');
                    letters.forEach(letter => {
                        letter.style.opacity = '1';
                        letter.style.transform = 'translateY(0)';
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        
        observer.observe(element);
    });
}

// Animações 3D no Scroll (inspirado no site de referência)
function init3DScrollAnimations() {
    const elements3D = document.querySelectorAll('[data-3d]');
    
    elements3D.forEach(element => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    window.addEventListener('scroll', function update3D() {
                        const rect = entry.target.getBoundingClientRect();
                        const centerY = rect.top + rect.height / 2;
                        const viewportCenter = window.innerHeight / 2;
                        const distance = centerY - viewportCenter;
                        const maxDistance = window.innerHeight;
                        const rotation = (distance / maxDistance) * 30; // Max 30 graus
                        const scale = 1 - Math.abs(distance / maxDistance) * 0.2; // Scale de 1 a 0.8
                        
                        entry.target.style.transform = `perspective(1200px) rotateX(${rotation}deg) scale(${scale})`;
                        
                        if (!entry.isIntersecting) {
                            window.removeEventListener('scroll', update3D);
                        }
                    });
                }
            });
        }, { threshold: [0, 0.25, 0.5, 0.75, 1] });
        
        observer.observe(element);
    });
}

// Header Scroll Effect
function initHeaderScroll() {
    const header = document.querySelector('.header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });
}

// FAQ Accordion
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Fecha todos os outros itens
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Abre/fecha o item clicado
            if (isActive) {
                item.classList.remove('active');
            } else {
                item.classList.add('active');
            }
        });
    });
}

// Smooth Scroll
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Parallax Effect no Estilo Apple - Sutil e Progressivo
function initParallax() {
    const parallaxElements = document.querySelectorAll('[data-parallax], .parallax, [data-speed]');
    
    let ticking = false;
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        const windowHeight = window.innerHeight;
        
        parallaxElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            const speed = parseFloat(element.dataset.speed) || parseFloat(element.dataset.parallax) || 0.15; // Mais sutil
            
            // Verificar se o elemento está visível
            if (rect.bottom >= 0 && rect.top <= window.innerHeight) {
                // Calcular progresso baseado na posição do elemento (estilo Apple)
                const elementCenter = rect.top + (rect.height / 2);
                const viewportCenter = windowHeight / 2;
                const distanceFromCenter = elementCenter - viewportCenter;
                
                // Parallax progressivo e suave (mais sutil que antes)
                const parallaxAmount = distanceFromCenter * speed * 0.5; // Reduzido para ser mais sutil
                
                // Aplicar transformação suave
                element.style.transform = `translate3d(0, ${parallaxAmount}px, 0)`;
                element.style.willChange = 'transform';
                element.style.transition = 'transform 0.1s cubic-bezier(0.25, 0.1, 0.25, 1)';
            }
        });
        
        ticking = false;
    }
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }, { passive: true });
    
    // Inicializar
    updateParallax();
}

// Counter Animation
function initCounter() {
    const statNumber = document.querySelector('.stat-number');
    if (!statNumber) return;

    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                entry.target.classList.add('counted');
                animateCounter(entry.target);
            }
        });
    }, observerOptions);

    observer.observe(statNumber);
}


// Hover Effects
function initHoverEffects() {
    const cards = document.querySelectorAll('.depoimento-card, .caso-item, .conteudo-item, .bonus-item, .preco-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s ease';
        });
    });
}

// Cursor Glow Effect
function initCursorGlow() {
    if (window.matchMedia('(pointer: fine)').matches) {
        const cursor = document.createElement('div');
        cursor.className = 'cursor-glow';
        document.body.appendChild(cursor);

        let mouseX = 0;
        let mouseY = 0;
        let cursorX = 0;
        let cursorY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        function animateCursor() {
            cursorX += (mouseX - cursorX) * 0.1;
            cursorY += (mouseY - cursorY) * 0.1;
            cursor.style.left = cursorX + 'px';
            cursor.style.top = cursorY + 'px';
            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        const glowElements = document.querySelectorAll('.btn-primary, .atencao-item.highlight-box, .preco-card, .caso-item, .bonus-item');
        
        glowElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.opacity = '1';
                cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
            });
            el.addEventListener('mouseleave', () => {
                cursor.style.opacity = '0';
                cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            });
        });
    }
}

// Form Validation
function initForm() {
    const form = document.getElementById('formulario');
    if (!form) return;

    const telefoneInput = document.getElementById('telefone');
    if (telefoneInput) {
        telefoneInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length <= 11) {
                if (value.length <= 10) {
                    value = value.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
                } else {
                    value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
                }
                e.target.value = value;
            }
        });
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const nome = document.getElementById('nome')?.value.trim();
        const email = document.getElementById('email')?.value.trim();
        const telefone = document.getElementById('telefone')?.value.trim();

        if (!nome || nome.length < 3) {
            alert('Por favor, insira seu nome completo.');
            return;
        }

        if (!email || !isValidEmail(email)) {
            alert('Por favor, insira um e-mail válido.');
            return;
        }

        if (!telefone || telefone.length < 14) {
            alert('Por favor, insira um telefone válido com DDD.');
            return;
        }

        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        
        submitButton.disabled = true;
        submitButton.innerHTML = 'Enviando...';

        setTimeout(() => {
            alert('🎉 Parabéns! Sua inscrição foi realizada com sucesso!\n\nEm breve você receberá um e-mail com os próximos passos.');
            form.reset();
            submitButton.disabled = false;
            submitButton.innerHTML = originalText;
        }, 2000);
    });
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Stagger Animation no Estilo Apple - Progressivo e Suave
function initStaggerAnimation() {
    const grids = document.querySelectorAll('.depoimentos-grid, .casos-grid, .conteudo-grid, .bonus-grid, .atencao-grid');
    
    grids.forEach(grid => {
        const items = grid.querySelectorAll('.depoimento-card, .caso-item, .conteudo-item, .bonus-item, .atencao-item');
        
        // Inicializar estado dos itens
        items.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translate3d(0, 30px, 0) scale(0.96)';
            item.style.transition = `opacity 0.8s cubic-bezier(0.25, 0.1, 0.25, 1) ${index * 80}ms, 
                                     transform 0.8s cubic-bezier(0.25, 0.1, 0.25, 1) ${index * 80}ms`;
            item.style.willChange = 'opacity, transform';
        });
        
        const gridObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    items.forEach((item, index) => {
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'translate3d(0, 0, 0) scale(1)';
                            item.style.willChange = 'auto';
                        }, index * 80);
                    });
                    gridObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        gridObserver.observe(grid);
    });
}

// Smooth Number Counter with easing
function animateCounter(element) {
    const target = element.textContent;
    const finalValue = parseInt(target.replace(/\D/g, ''));
    const duration = 2000;
    const startTime = performance.now();
    const startValue = 0;

    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (ease-out)
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(startValue + (finalValue - startValue) * easeOut);
        
        element.textContent = `+${current.toLocaleString('pt-BR')}`;
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = `+${finalValue.toLocaleString('pt-BR')}`;
        }
    }
    
    requestAnimationFrame(updateCounter);
}

// Função para trocar logos baseado no tema
function updateLogos() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const headerLogo = document.getElementById('headerLogo');
    const heroLogo = document.getElementById('heroLogo');
    const footerLogo = document.getElementById('footerLogo');
    
    if (isDark) {
        // Modo escuro: logo padrão (preta)
        if (headerLogo) headerLogo.src = 'assets/logo.png';
        if (heroLogo) heroLogo.src = 'assets/logo.png';
        if (footerLogo) footerLogo.src = 'assets/logo.png';
    } else {
        // Modo claro: logo roxa
        if (headerLogo) headerLogo.src = 'assets/logo-roxo.png';
        if (heroLogo) heroLogo.src = 'assets/logo-roxo.png';
        if (footerLogo) footerLogo.src = 'assets/logo-roxo.png';
    }
}

// Theme Toggle Function
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;
    
    // Get saved theme or default to dark
    const savedTheme = localStorage.getItem('theme') || 'dark';
    
    // Apply saved theme
    if (savedTheme === 'dark') {
        html.setAttribute('data-theme', 'dark');
    } else {
        html.removeAttribute('data-theme');
    }
    
    // Atualizar logos inicialmente
    updateLogos();
    
    // Toggle theme on button click
    themeToggle.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        
        if (currentTheme === 'dark') {
            html.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
        } else {
            html.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        }
        
        // Atualizar logos ao trocar tema
        updateLogos();
    });
}

// Animações de Títulos com Letras (inspirado no site de referência)
function initTitleLetterAnimations() {
    const titleElements = document.querySelectorAll('.section-title, .preco-question, .faq-title-main');
    
    titleElements.forEach(title => {
        // Verificar se já foi processado
        if (title.classList.contains('letters-processed')) return;
        title.classList.add('letters-processed');
        
        const text = title.textContent.trim();
        const words = text.split(' ');
        
        title.innerHTML = '';
        
        words.forEach((word, wordIndex) => {
            const wordSpan = document.createElement('span');
            wordSpan.style.display = 'inline-block';
            wordSpan.style.marginRight = '0.3em';
            wordSpan.style.overflow = 'hidden';
            
            word.split('').forEach((char, charIndex) => {
                const letterSpan = document.createElement('span');
                letterSpan.className = 'letter';
                letterSpan.textContent = char === ' ' ? '\u00A0' : char;
                letterSpan.style.display = 'inline-block';
                letterSpan.style.opacity = '0';
                letterSpan.style.transform = 'translateY(100%)';
                letterSpan.style.transition = `opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)`;
                wordSpan.appendChild(letterSpan);
            });
            
            title.appendChild(wordSpan);
            if (wordIndex < words.length - 1) {
                title.appendChild(document.createTextNode(' '));
            }
        });
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const letters = entry.target.querySelectorAll('.letter');
                    letters.forEach((letter, index) => {
                        setTimeout(() => {
                            letter.style.opacity = '1';
                            letter.style.transform = 'translateY(0)';
                        }, index * 30);
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        
        observer.observe(title);
    });
}

// Smooth Scroll Melhorado (inspirado em Lenis)
// Smooth Scroll no Estilo Apple - Suave e Natural
function initSmoothScrollEnhanced() {
    // Habilitar smooth scroll nativo do CSS (estilo Apple)
    document.documentElement.style.scrollBehavior = 'smooth';
    
    let isScrolling = false;
    
    function smoothScrollTo(target) {
        if (isScrolling) return;
        
        isScrolling = true;
        const startPosition = window.pageYOffset;
        const targetPosition = target.offsetTop - 80;
        const distance = targetPosition - startPosition;
        const duration = 800; // Mais rápido, estilo Apple
        let startTime = null;
        
        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            
            // Easing function no estilo Apple: cubic-bezier(0.25, 0.1, 0.25, 1)
            // Aproximação do easing da Apple
            const ease = progress < 0.5 
                ? 2 * progress * progress * (2.7 * progress - 1.7)
                : 1 - Math.pow(-2 * progress + 2, 2) / 2;
            
            window.scrollTo(0, startPosition + distance * ease);
            
            if (progress < 1) {
                requestAnimationFrame(animation);
            } else {
                isScrolling = false;
            }
        }
        
        requestAnimationFrame(animation);
    }
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '#!') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                smoothScrollTo(target);
            }
        });
    });
}

// Efeito de Hover 3D para Cards
function init3DCardHover() {
    const cards = document.querySelectorAll('.preco-card-modern, .depoimento-card, .conteudo-item, .bonus-item-modern, .preco-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
            card.style.transition = 'transform 0.1s ease-out';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
            card.style.transition = 'transform 0.5s ease-out';
        });
    });
    
    // Efeito 3D no formulário também
    const modalContent = document.querySelector('.modal-content');
    const modalWrapper = document.querySelector('.modal-wrapper');
    
    if (modalContent && modalWrapper) {
        modalWrapper.addEventListener('mousemove', (e) => {
            const rect = modalWrapper.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 30; // Mais sutil que os cards
            const rotateY = (centerX - x) / 30;
            
            modalContent.style.transform = `translateY(-8px) perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            modalContent.style.transition = 'transform 0.1s ease-out';
        });
        
        modalWrapper.addEventListener('mouseleave', () => {
            modalContent.style.transform = 'translateY(-8px) perspective(1000px) rotateX(0) rotateY(0)';
            modalContent.style.transition = 'transform 0.5s ease-out';
        });
    }
}

// Logo do cabeçalho volta para o primeiro bloco
function initLogoClick() {
    const headerLogo = document.getElementById('headerLogo');
    if (headerLogo) {
        // Adicionar evento no elemento img ou no container
        const logoContainer = headerLogo.closest('.logo');
        if (logoContainer) {
            logoContainer.style.cursor = 'pointer';
            logoContainer.addEventListener('click', () => {
                const heroSection = document.querySelector('.hero');
                if (heroSection) {
                    heroSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                } else {
                    // Se não encontrar hero, vai para o topo
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            });
        }
    }
}

// Configurar todos os botões para abrir o modal
function initButtonsModal() {
    // Selecionar todos os botões que devem abrir o modal
    const buttons = document.querySelectorAll('.btn-primary, .btn-primary-modern, .btn-nav');
    
    buttons.forEach(button => {
        // Verificar se não é o botão de submit do formulário
        if (button.type !== 'submit' && !button.classList.contains('already-configured')) {
            button.classList.add('already-configured');
            
            // Remover href se existir e adicionar evento
            if (button.tagName === 'A') {
                button.href = '#';
            }
            
            button.addEventListener('click', (e) => {
                e.preventDefault();
                openModal();
            });
        }
    });
}

// ============================================
// MELHORIAS MODERNAS 2025
// ============================================

// 1. Typewriter Effect no Hero
function initTypewriter() {
    const element = document.querySelector('.typewriter-code');
    if (!element) return;

    const texts = [
        'utm_source=facebook&utm_campaign=vendas',
        'utm_source=instagram&utm_medium=cpc',
        'utm_source=email&utm_campaign=newsletter'
    ];
    
    let currentTextIndex = 0;
    let currentCharIndex = 0;
    let isDeleting = false;
    const speed = 100;
    const deleteSpeed = 50;

    function type() {
        const currentText = texts[currentTextIndex];
        
        if (isDeleting) {
            element.textContent = currentText.substring(0, currentCharIndex - 1);
            currentCharIndex--;
            
            if (currentCharIndex === 0) {
                isDeleting = false;
                currentTextIndex = (currentTextIndex + 1) % texts.length;
                setTimeout(type, 500);
                return;
            }
            
            setTimeout(type, deleteSpeed);
        } else {
            element.textContent = currentText.substring(0, currentCharIndex + 1);
            currentCharIndex++;
            
            if (currentCharIndex === currentText.length) {
                isDeleting = true;
                setTimeout(type, 2000); // Pausa antes de deletar
                return;
            }
            
            setTimeout(type, speed);
        }
    }

    // Iniciar após um pequeno delay
    setTimeout(type, 1000);
}

// 2. Demonstração Interativa de UTMs
function initUTMDemo() {
    const baseUrlInput = document.getElementById('utm-base-url');
    const sourceButtons = document.querySelectorAll('.utm-source-btn');
    const resultUrl = document.getElementById('utm-result-url');
    const copyBtn = document.getElementById('utm-copy-btn');
    const previewSource = document.getElementById('preview-source');
    const previewMedium = document.getElementById('preview-medium');
    const previewCampaign = document.getElementById('preview-campaign');

    let currentUTM = {
        source: '',
        medium: '',
        campaign: '',
        term: '',
        content: ''
    };

    function updateUTMUrl() {
        const baseUrl = baseUrlInput.value.trim() || 'https://seusite.com.br';
        const params = [];
        
        if (currentUTM.source) params.push(`utm_source=${encodeURIComponent(currentUTM.source)}`);
        if (currentUTM.medium) params.push(`utm_medium=${encodeURIComponent(currentUTM.medium)}`);
        if (currentUTM.campaign) params.push(`utm_campaign=${encodeURIComponent(currentUTM.campaign)}`);
        if (currentUTM.term) params.push(`utm_term=${encodeURIComponent(currentUTM.term)}`);
        if (currentUTM.content) params.push(`utm_content=${encodeURIComponent(currentUTM.content)}`);

        const separator = baseUrl.includes('?') ? '&' : '?';
        const fullUrl = params.length > 0 ? `${baseUrl}${separator}${params.join('&')}` : baseUrl;
        
        resultUrl.textContent = fullUrl;

        // Atualizar preview
        previewSource.textContent = currentUTM.source || '-';
        previewMedium.textContent = currentUTM.medium || '-';
        previewCampaign.textContent = currentUTM.campaign || '-';
    }

    // Event listeners para botões de source
    sourceButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remover active de todos
            sourceButtons.forEach(b => b.classList.remove('active'));
            // Adicionar active no clicado
            btn.classList.add('active');

            // Atualizar UTM
            currentUTM.source = btn.dataset.source || '';
            currentUTM.medium = btn.dataset.medium || '';
            currentUTM.campaign = btn.dataset.campaign || '';

            updateUTMUrl();
        });
    });

    // Atualizar quando base URL mudar
    baseUrlInput.addEventListener('input', updateUTMUrl);

    // Botão de copiar
    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            const url = resultUrl.textContent;
            navigator.clipboard.writeText(url).then(() => {
                const originalText = copyBtn.innerHTML;
                copyBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"></path></svg> Copiado!';
                copyBtn.classList.add('copied');
                
                setTimeout(() => {
                    copyBtn.innerHTML = originalText;
                    copyBtn.classList.remove('copied');
                }, 2000);
            }).catch(err => {
                console.error('Erro ao copiar:', err);
                alert('Erro ao copiar. Tente selecionar e copiar manualmente.');
            });
        });
    }
}

// 3. Micro-interações Magnéticas
function initMagneticButtons() {
    const buttons = document.querySelectorAll('.btn-primary, .btn-primary-modern, .btn-nav, .utm-source-btn');
    
    buttons.forEach(button => {
        button.addEventListener('mousemove', (e) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            const moveX = x * 0.15;
            const moveY = y * 0.15;
            
            button.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.05)`;
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translate(0, 0) scale(1)';
        });
    });
}

// ============================================
// EFEITOS VISUAIS PREMIUM 2025
// ============================================

// ============================================
// TECNOLOGIAS DE INOVAÇÃO DO MERCADO
// ============================================

// 1. Lenis Smooth Scroll Premium
function initLenisSmoothScroll() {
    // Verificar se Lenis está disponível (aguardar um pouco mais se necessário)
    if (typeof Lenis === 'undefined') {
        console.warn('Lenis não carregado, usando smooth scroll nativo');
        // Fallback para smooth scroll nativo
        document.documentElement.style.scrollBehavior = 'smooth';
        
        // Manter funcionalidade de links internos
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (href === '#' || href === '#!') return;
                
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const headerOffset = 80;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
        return;
    }
    
    try {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical', 
            smooth: true,
            smoothTouch: false,
            touchMultiplier: 2,
            wheelMultiplier: 1,
        });

        // Função de animação
        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);
        
        // Conectar links internos ao Lenis
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (href === '#' || href === '#!') return;
                
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    lenis.scrollTo(target, {
                        offset: -80,
                        duration: 1.5
                    });
                }
            });
        });
        
        // Garantir que o scroll funcione
        window.lenis = lenis;
        
        return lenis;
    } catch (error) {
        console.error('Erro ao inicializar Lenis:', error);
        // Fallback
        document.documentElement.style.scrollBehavior = 'smooth';
    }
}

// 2. Efeito Spotlight Premium (com borda iluminada)
function initSpotlight() {
    // Seleciona todos os cards que devem ter o efeito
    const cards = document.querySelectorAll('.conteudo-item, .bonus-item-modern, .faq-item, .preco-card-modern');
    
    cards.forEach(card => {
        card.classList.add('spotlight-card'); // Adiciona a classe CSS necessária
        
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Passa as coordenadas para o CSS
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
        
        // Resetar posição ao sair
        card.addEventListener('mouseleave', () => {
            card.style.setProperty('--mouse-x', '50%');
            card.style.setProperty('--mouse-y', '50%');
        });
    });
}


// Initialize all functions when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initScrollProgress();
    // initScrollReveal(); // Desabilitado - removendo animações
    initHeaderScroll();
    initFAQ();
    // Lenis desabilitado - usando smooth scroll nativo
    // initLenisSmoothScroll(); // Desabilitado
    initSmoothScrollEnhanced(); // Smooth Scroll nativo melhorado
    initParallax(); // Parallax reativado
    // initCounter(); // Desabilitado
    initHoverEffects();
    initForm();
    initCursorGlow();
    // initStaggerAnimation(); // Desabilitado - removendo animações
    // initTitleLetterAnimations(); // Desabilitado - removendo animações
    init3DCardHover(); // Reativado - animação 3D ao passar o mouse
    initLogoClick(); // Logo volta para o topo
    initButtonsModal(); // Todos os botões abrem o modal
    initUrgencyCounter(); // Contador de urgência
    initTypewriter(); // Efeito typewriter no Hero
    initUTMDemo(); // Demonstração interativa de UTMs
    initMagneticButtons(); // Micro-interações magnéticas
    initSpotlight(); // Efeito Spotlight Premium nos cards
});

// Add CSS for cursor glow
const style = document.createElement('style');
style.textContent = `
    .cursor-glow {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(0, 102, 255, 0.6) 0%, rgba(123, 0, 255, 0.3) 50%, transparent 70%);
        position: fixed;
        pointer-events: none;
        z-index: 9999;
        opacity: 0;
        transition: opacity 0.3s ease, transform 0.3s ease;
        transform: translate(-50%, -50%) scale(1);
        mix-blend-mode: screen;
    }
    
    @media (max-width: 768px) {
        .cursor-glow {
            display: none;
        }
    }
`;
document.head.appendChild(style);

// Função para obter parâmetros da URL
function getURLParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name) || '';
}

// Função para detectar modelo do dispositivo via User Agent
function detectDeviceModel(userAgent) {
    // iPhone
    if (userAgent.match(/iPhone/i)) {
        const model = userAgent.match(/iPhone\s*([\d,]+)/i);
        return model ? `iPhone ${model[1]}` : 'iPhone';
    }
    
    // iPad
    if (userAgent.match(/iPad/i)) {
        const model = userAgent.match(/iPad/i);
        return 'iPad';
    }
    
    // Android - tentar detectar modelo
    if (userAgent.match(/Android/i)) {
        // Modelos comuns do Android
        const androidModels = {
            'SM-': 'Samsung Galaxy',
            'Pixel': 'Google Pixel',
            'Mi ': 'Xiaomi',
            'Redmi': 'Xiaomi Redmi',
            'POCO': 'Xiaomi POCO',
            'Moto': 'Motorola',
            'OnePlus': 'OnePlus',
            'OPPO': 'OPPO',
            'vivo': 'Vivo',
            'Realme': 'Realme'
        };
        
        for (const [key, brand] of Object.entries(androidModels)) {
            if (userAgent.includes(key)) {
                return brand;
            }
        }
        return 'Android Device';
    }
    
    // Desktop - detectar marca/modelo quando possível
    if (userAgent.match(/Macintosh/i)) {
        return 'Mac';
    }
    if (userAgent.match(/Windows/i)) {
        return 'Windows PC';
    }
    if (userAgent.match(/Linux/i)) {
        return 'Linux PC';
    }
    
    return 'Unknown';
}

// Função para capturar geolocalização (requer permissão do usuário)
async function captureGeolocation() {
    return new Promise((resolve) => {
        if (!navigator.geolocation) {
            resolve(null);
            return;
        }
        
        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    accuracy: position.coords.accuracy
                });
            },
            (error) => {
                // Usuário negou permissão ou erro
                resolve(null);
            },
            { timeout: 5000, enableHighAccuracy: false }
        );
    });
}

// Função para capturar IP e localização via API externa
async function captureIPLocation() {
    try {
        // Usando ipapi.co (gratuito, 1000 requisições/dia)
        const response = await fetch('https://ipapi.co/json/', {
            timeout: 5000
        });
        
        if (!response.ok) throw new Error('API error');
        
        const data = await response.json();
        
        return {
            ip: data.ip || null,
            country: data.country_name || null,
            country_code: data.country_code || null,
            region: data.region || null,
            region_code: data.region_code || null,
            city: data.city || null,
            postal: data.postal || null, // CEP/Código Postal
            latitude: data.latitude || null,
            longitude: data.longitude || null,
            timezone: data.timezone || null,
            isp: data.org || null
        };
    } catch (error) {
        // Se falhar, tentar API alternativa (ip-api.com)
        try {
            const response = await fetch('http://ip-api.com/json/', {
                timeout: 5000
            });
            
            if (!response.ok) throw new Error('API error');
            
            const data = await response.json();
            
            return {
                ip: data.query || null,
                country: data.country || null,
                country_code: data.countryCode || null,
                region: data.regionName || null,
                region_code: data.region || null,
                city: data.city || null,
                postal: data.zip || null,
                latitude: data.lat || null,
                longitude: data.lon || null,
                timezone: data.timezone || null,
                isp: data.isp || null
            };
        } catch (error2) {
            console.warn('Não foi possível capturar localização por IP:', error2);
            return null;
        }
    }
}

// Função para capturar informações do User Agent e Navegador
async function captureUserAgentInfo() {
    const userAgent = navigator.userAgent;
    
    // Detectar navegador
    let browser = 'Unknown';
    if (userAgent.indexOf('Chrome') > -1 && userAgent.indexOf('Edg') === -1) browser = 'Chrome';
    else if (userAgent.indexOf('Firefox') > -1) browser = 'Firefox';
    else if (userAgent.indexOf('Safari') > -1 && userAgent.indexOf('Chrome') === -1) browser = 'Safari';
    else if (userAgent.indexOf('Edg') > -1) browser = 'Edge';
    else if (userAgent.indexOf('Opera') > -1 || userAgent.indexOf('OPR') > -1) browser = 'Opera';
    
    // Detectar sistema operacional
    let os = 'Unknown';
    let osVersion = 'Unknown';
    if (userAgent.indexOf('Windows') > -1) {
        os = 'Windows';
        const winVersion = userAgent.match(/Windows NT ([\d.]+)/);
        if (winVersion) osVersion = winVersion[1];
    } else if (userAgent.indexOf('Mac') > -1) {
        os = 'macOS';
        const macVersion = userAgent.match(/Mac OS X ([\d_]+)/);
        if (macVersion) osVersion = macVersion[1].replace(/_/g, '.');
    } else if (userAgent.indexOf('Linux') > -1) os = 'Linux';
    else if (userAgent.indexOf('Android') > -1) {
        os = 'Android';
        const androidVersion = userAgent.match(/Android ([\d.]+)/);
        if (androidVersion) osVersion = androidVersion[1];
    } else if (userAgent.indexOf('iOS') > -1 || userAgent.indexOf('iPhone') > -1 || userAgent.indexOf('iPad') > -1) {
        os = 'iOS';
        const iosVersion = userAgent.match(/OS ([\d_]+)/);
        if (iosVersion) osVersion = iosVersion[1].replace(/_/g, '.');
    }
    
    // Detectar dispositivo e modelo
    let device = 'Desktop';
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) {
        device = 'Mobile';
    } else if (navigator.maxTouchPoints && navigator.maxTouchPoints > 2) {
        device = 'Tablet';
    }
    
    const deviceModel = detectDeviceModel(userAgent);
    
    // Detectar idioma
    const language = navigator.language || navigator.userLanguage;
    
    // Detectar timezone
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    // Detectar resolução da tela
    const screenResolution = `${window.screen.width}x${window.screen.height}`;
    const viewportSize = `${window.innerWidth}x${window.innerHeight}`;
    
    // Detectar cores suportadas
    const colorDepth = window.screen.colorDepth;
    
    // Detectar se é modo escuro
    const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Detectar referrer (página de origem)
    const referrer = document.referrer || 'Direct';
    
    // Detectar se cookies estão habilitados
    const cookiesEnabled = navigator.cookieEnabled;
    
    // Detectar conexão (se disponível)
    const connectionType = navigator.connection ? {
        effectiveType: navigator.connection.effectiveType,
        downlink: navigator.connection.downlink,
        rtt: navigator.connection.rtt
    } : null;
    
    // Capturar IP e localização (assíncrono)
    const ipLocation = await captureIPLocation();
    
    // Capturar geolocalização (requer permissão)
    const geolocation = await captureGeolocation();
    
    return {
        // Informações do User Agent
        user_agent: userAgent,
        browser: browser,
        browser_version: userAgent.match(/(?:Chrome|Firefox|Safari|Edg|Opera)\/(\d+)/)?.[1] || 'Unknown',
        os: os,
        os_version: osVersion,
        device: device,
        device_model: deviceModel,
        language: language,
        timezone: timezone,
        
        // Informações da Tela
        screen_resolution: screenResolution,
        viewport_size: viewportSize,
        color_depth: colorDepth,
        prefers_dark_mode: prefersDarkMode,
        
        // Informações de Navegação
        referrer: referrer,
        page_url: window.location.href,
        page_path: window.location.pathname,
        page_query: window.location.search,
        page_hash: window.location.hash,
        
        // Informações Técnicas
        cookies_enabled: cookiesEnabled,
        online_status: navigator.onLine,
        connection_type: connectionType,
        
        // Localização por IP (API externa)
        ip_location: ipLocation ? {
            ip: ipLocation.ip,
            country: ipLocation.country,
            country_code: ipLocation.country_code,
            state: ipLocation.region,
            state_code: ipLocation.region_code,
            city: ipLocation.city,
            postal_code: ipLocation.postal, // CEP
            latitude: ipLocation.latitude,
            longitude: ipLocation.longitude,
            isp: ipLocation.isp
        } : null,
        
        // Geolocalização (GPS - requer permissão)
        geolocation: geolocation,
        
        // Timestamp
        timestamp: new Date().toISOString(),
        local_time: new Date().toLocaleString('pt-BR'),
        
        // Informações de Performance (se disponível)
        performance_timing: performance.timing ? {
            page_load_time: performance.timing.loadEventEnd - performance.timing.navigationStart,
            dom_ready_time: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart
        } : null
    };
}

// Função para capturar todas as UTMs
function captureUTMs() {
    const utmParams = {
        utm_source: getURLParameter('utm_source'),
        utm_medium: getURLParameter('utm_medium'),
        utm_campaign: getURLParameter('utm_campaign'),
        utm_term: getURLParameter('utm_term'),
        utm_content: getURLParameter('utm_content')
    };
    
    // Preencher campos ocultos
    document.getElementById('utm_source').value = utmParams.utm_source;
    document.getElementById('utm_medium').value = utmParams.utm_medium;
    document.getElementById('utm_campaign').value = utmParams.utm_campaign;
    document.getElementById('utm_term').value = utmParams.utm_term;
    document.getElementById('utm_content').value = utmParams.utm_content;
    
    return utmParams;
}

// Função para abrir o modal
function openModal() {
    const modal = document.getElementById('inscricaoModal');
    captureUTMs(); // Capturar UTMs ao abrir o modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevenir scroll do body
    
    // Focar no primeiro campo
    setTimeout(() => {
        document.getElementById('nome').focus();
    }, 300);
}

// Função para fechar o modal
function closeModal() {
    const modal = document.getElementById('inscricaoModal');
    modal.classList.remove('active');
    document.body.style.overflow = ''; // Restaurar scroll do body
}

// Fechar modal ao clicar fora
window.onclick = function(event) {
    const modal = document.getElementById('inscricaoModal');
    if (event.target === modal) {
        closeModal();
    }
}

// Fechar modal com ESC
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeModal();
    }
});

// Formatação de telefone
function formatPhone(input) {
    let value = input.value.replace(/\D/g, '');
    
    if (value.length <= 10) {
        value = value.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
    } else {
        value = value.replace(/^(\d{2})(\d{5})(\d{0,4}).*/, '($1) $2-$3');
    }
    
    input.value = value;
}

// Adicionar formatação ao campo de telefone
document.addEventListener('DOMContentLoaded', function() {
    const telefoneInput = document.getElementById('telefone');
    if (telefoneInput) {
        telefoneInput.addEventListener('input', function() {
            formatPhone(this);
        });
    }
    
    // Fechar modal com botão X
    const closeBtn = document.querySelector('.modal-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    
    // Capturar UTMs ao carregar a página
    captureUTMs();
});

// Envio do formulário
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('inscricaoForm');
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Coletar dados do formulário
            const nome = document.getElementById('nome')?.value.trim();
            const email = document.getElementById('email')?.value.trim();
            const telefone = document.getElementById('telefone')?.value.trim();
            
            // Validação
            if (!nome || nome.length < 3) {
                alert('Por favor, insira seu nome completo.');
                return;
            }
            
            if (!email || !isValidEmail(email)) {
                alert('Por favor, insira um e-mail válido.');
                return;
            }
            
            if (!telefone || telefone.length < 14) {
                alert('Por favor, insira um telefone válido com DDD.');
                return;
            }
            
            // Obter referência do botão de submit
            const submitButton = form.querySelector('button[type="submit"]');
            const originalText = submitButton.innerHTML;
            
            // Desabilitar botão e mostrar loading
            submitButton.disabled = true;
            submitButton.innerHTML = 'Capturando informações...';
            
            // Capturar informações do User Agent (agora é assíncrono)
            const userAgentInfo = await captureUserAgentInfo();
            
            const formData = {
                // Dados do formulário
                nome: nome,
                email: email,
                telefone: telefone,
                
                // UTMs
                utm_source: document.getElementById('utm_source')?.value || '',
                utm_medium: document.getElementById('utm_medium')?.value || '',
                utm_campaign: document.getElementById('utm_campaign')?.value || '',
                utm_term: document.getElementById('utm_term')?.value || '',
                utm_content: document.getElementById('utm_content')?.value || '',
                
                // Informações do User Agent e Navegador
                ...userAgentInfo
            };
            
            // Atualizar texto do botão
            submitButton.innerHTML = 'Enviando...';
            
            // Enviar para o webhook
            fetch('https://n8n.raiarruda.com.br/webhook/formulario-rastreamento-de-dados', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Erro HTTP: ${response.status}`);
                }
                return response.json().catch(() => ({})); // Tenta parsear JSON, mas não falha se não for JSON
            })
            .then(data => {
                console.log('Sucesso:', data);
                alert('🎉 Parabéns! Sua inscrição foi realizada com sucesso!\n\nEm breve você receberá um e-mail com os próximos passos.');
                closeModal();
                form.reset();
            })
            .catch((error) => {
                console.error('Erro ao enviar formulário:', error);
                alert('Ops! Ocorreu um erro ao enviar seu formulário. Por favor, tente novamente ou entre em contato conosco.');
            })
            .finally(() => {
                // Reabilitar botão
                submitButton.disabled = false;
                submitButton.innerHTML = originalText;
            });
        });
    }
});

// ============================================
// NOVAS FUNCIONALIDADES
// ============================================

// 2. Notificações Flutuantes em Diferentes Posições
function initUrgencyCounter() {
    let vagasRestantes = 7;
    let pessoasVendo = 12;
    let currentNotifications = [];
    const maxNotifications = 3; // Máximo de notificações visíveis simultaneamente
    
    // Posições possíveis para as notificações
    const positions = [
        'notification-position-top-right',
        'notification-position-top-left',
        'notification-position-bottom-right',
        'notification-position-bottom-left',
        'notification-position-center-right',
        'notification-position-center-left',
        'notification-position-middle-top',
        'notification-position-middle-bottom'
    ];
    
    // Nomes para as notificações de inscrição
    const nomes = ['Maria', 'João', 'Ana', 'Carlos', 'Juliana', 'Pedro', 'Fernanda', 'Ricardo', 'Larissa', 'Bruno', 'Patricia', 'Marcos', 'Camila', 'Rafael'];
    const cidades = ['São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Curitiba', 'Porto Alegre', 'Brasília', 'Salvador', 'Recife', 'Fortaleza', 'Manaus'];
    
    function getRandomPosition() {
        // Evita posições muito próximas
        const usedPositions = currentNotifications.map(n => n.dataset.position);
        const availablePositions = positions.filter(p => !usedPositions.includes(p));
        
        if (availablePositions.length > 0) {
            return availablePositions[Math.floor(Math.random() * availablePositions.length)];
        }
        return positions[Math.floor(Math.random() * positions.length)];
    }
    
    function criarNotificacaoFlutuante(template, position) {
        const notification = document.createElement('div');
        notification.className = `floating-notification ${position}`;
        notification.dataset.position = position;
        
        const content = document.createElement('div');
        content.className = 'floating-notification-content';
        
        const icon = document.createElement('span');
        icon.className = 'floating-notification-icon';
        icon.textContent = template.icon;
        
        const textWrapper = document.createElement('div');
        textWrapper.className = 'floating-notification-text';
        textWrapper.innerHTML = template.text;
        
        const time = document.createElement('span');
        time.className = 'floating-notification-time';
        const minutos = Math.floor(Math.random() * 5) + 1;
        time.textContent = `há ${minutos} minuto${minutos > 1 ? 's' : ''}`;
        
        const closeBtn = document.createElement('span');
        closeBtn.className = 'floating-notification-close';
        closeBtn.innerHTML = '×';
        closeBtn.onclick = (e) => {
            e.stopPropagation();
            removerNotificacao(notification);
        };
        
        textWrapper.appendChild(time);
        content.appendChild(icon);
        content.appendChild(textWrapper);
        notification.appendChild(content);
        notification.appendChild(closeBtn);
        
        // Click na notificação fecha ela
        notification.onclick = () => {
            removerNotificacao(notification);
        };
        
        return notification;
    }
    
    function removerNotificacao(notification) {
        const index = currentNotifications.indexOf(notification);
        if (index > -1) {
            currentNotifications.splice(index, 1);
        }
        notification.classList.add('fade-out');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 400);
    }
    
    function mostrarNotificacaoFlutuante(template) {
        // Limitar número de notificações
        if (currentNotifications.length >= maxNotifications) {
            // Remove a mais antiga
            const oldest = currentNotifications.shift();
            removerNotificacao(oldest);
        }
        
        const position = getRandomPosition();
        const notification = criarNotificacaoFlutuante(template, position);
        
        document.body.appendChild(notification);
        currentNotifications.push(notification);
        
        // Remove após 10 segundos
        setTimeout(() => {
            removerNotificacao(notification);
        }, 10000);
    }
    
    function gerarNotificacaoPersonalizada() {
        const tipo = Math.random();
        
        if (tipo < 0.3) {
            // Notificação de vagas
            vagasRestantes = Math.max(3, vagasRestantes - Math.floor(Math.random() * 2));
            return {
                icon: '🔥',
                text: `Últimas <strong>${vagasRestantes}</strong> vagas disponíveis!`,
                type: 'vagas'
            };
        } else if (tipo < 0.5) {
            // Notificação de visualizações
            pessoasVendo = Math.floor(Math.random() * (25 - 8 + 1)) + 8;
            return {
                icon: '👁️',
                text: `<strong>${pessoasVendo}</strong> pessoas visualizando agora`,
                type: 'visualizacoes'
            };
        } else if (tipo < 0.7) {
            // Notificação de inscrição
            const nome = nomes[Math.floor(Math.random() * nomes.length)];
            const cidade = cidades[Math.floor(Math.random() * cidades.length)];
            return {
                icon: '✅',
                text: `${nome} de ${cidade} acabou de se inscrever`,
                type: 'inscricao'
            };
        } else {
            // Notificação de urgência
            return {
                icon: '⏰',
                text: 'Oferta termina em breve! Não perca sua vaga',
                type: 'urgencia'
            };
        }
    }
    
    // Mostrar primeira notificação após 2 segundos
    setTimeout(() => {
        mostrarNotificacaoFlutuante({
            icon: '🔥',
            text: `Últimas <strong>${vagasRestantes}</strong> vagas disponíveis!`,
            type: 'vagas'
        });
    }, 2000);
    
    // Mostrar segunda notificação após 5 segundos
    setTimeout(() => {
        mostrarNotificacaoFlutuante({
            icon: '👁️',
            text: `<strong>${pessoasVendo}</strong> pessoas visualizando agora`,
            type: 'visualizacoes'
        });
    }, 5000);
    
    // Gerar novas notificações periodicamente
    setInterval(() => {
        const notification = gerarNotificacaoPersonalizada();
        mostrarNotificacaoFlutuante(notification);
    }, 10000 + Math.random() * 5000); // Entre 10 e 15 segundos
}


