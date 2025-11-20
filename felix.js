        let auroraColors = [
            { r: 255, g: 110, b: 199 },  // Rosa
            { r: 120, g: 115, b: 245 },  // Púrpura
            { r: 79, g: 195, b: 247 },   // Azul
            { r: 255, g: 215, b: 0 },    // Dorado
            { r: 76, g: 175, b: 80 }     // Verde
        ];

        function resizeCanvases() {
            auroraCanvas.width = window.innerWidth;
            auroraCanvas.height = window.innerHeight;
            fireworksCanvas.width = window.innerWidth;
            fireworksCanvas.height = window.innerHeight;
        }

        resizeCanvases();
        window.addEventListener('resize', resizeCanvases);

        // Clase mejorada para ondas de aurora
        class AuroraWave {
            constructor() {
                this.reset();
            }

            reset() {
                this.y = Math.random() * auroraCanvas.height * 0.6;
                this.amplitude = 50 + Math.random() * 150;
                this.frequency = 0.001 + Math.random() * 0.004;
                this.speed = 0.3 + Math.random() * 2.5;
                this.offset = Math.random() * Math.PI * 2;
                this.color = auroraColors[Math.floor(Math.random() * auroraColors.length)];
                this.opacity = 0.2 + Math.random() * 0.5;
                this.waveCount = 3 + Math.floor(Math.random() * 3);
            }

            update() {
                this.offset += this.speed * 0.01;
            }

            draw() {
                for (let w = 0; w < this.waveCount; w++) {
                    auroraCtx.beginPath();
                    auroraCtx.moveTo(0, this.y + w * 20);

                    for (let x = 0; x <= auroraCanvas.width; x += 3) {
                        const y = this.y + w * 20 + 
                                 Math.sin(x * this.frequency + this.offset + w * 0.5) * this.amplitude +
                                 Math.cos(x * this.frequency * 0.5 + this.offset * 1.5) * (this.amplitude * 0.3);
                        auroraCtx.lineTo(x, y);
                    }

                    auroraCtx.lineTo(auroraCanvas.width, 0);
                    auroraCtx.lineTo(0, 0);
                    auroraCtx.closePath();

                    const gradient = auroraCtx.createLinearGradient(0, this.y - this.amplitude, 0, this.y + this.amplitude);
                    gradient.addColorStop(0, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 0)`);
                    gradient.addColorStop(0.3, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.opacity * 0.5})`);
                    gradient.addColorStop(0.5, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.opacity})`);
                    gradient.addColorStop(0.7, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.opacity * 0.5})`);
                    gradient.addColorStop(1, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 0)`);

                    auroraCtx.fillStyle = gradient;
                    auroraCtx.fill();
                }
            }
        }

        // Sistema de fuegos artificiales espectacular
        class Firework {
            constructor(x, y, targetY, color) {
                this.x = x;
                this.y = y;
                this.targetY = targetY;
                this.color = color;
                this.velocity = -15 - Math.random() * 5;
                this.exploded = false;
                this.particles = [];
                this.trail = [];
            }

            update() {
                if (!this.exploded) {
                    this.velocity += 0.3;
                    this.y += this.velocity;
                    
                    // Añadir a la estela
                    this.trail.push({ x: this.x, y: this.y, life: 1 });
                    
                    // Limitar tamaño de la estela
                    if (this.trail.length > 20) {
                        this.trail.shift();
                    }
                    
                    // Actualizar vida de la estela
                    this.trail.forEach(point => {
                        point.life *= 0.95;
                    });
                    
                    if (this.velocity >= 0 || this.y <= this.targetY) {
                        this.explode();
                    }
                } else {
                    this.particles.forEach((particle, index) => {
                        particle.update();
                        if (particle.life <= 0) {
                            this.particles.splice(index, 1);
                        }
                    });
                }
            }

            explode() {
                this.exploded = true;
                const particleCount = 50 + Math.floor(Math.random() * 50);
                
                for (let i = 0; i < particleCount; i++) {
                    const angle = (Math.PI * 2 / particleCount) * i + Math.random() * 0.5;
                    const velocity = 2 + Math.random() * 6;
                    
                    this.particles.push(new Particle(
                        this.x, 
                        this.y, 
                        Math.cos(angle) * velocity, 
                        Math.sin(angle) * velocity, 
                        this.color
                    ));
                }
            }

            draw() {
                if (!this.exploded) {
                    // Dibujar estela
                    this.trail.forEach((point, index) => {
                        fireworksCtx.beginPath();
                        fireworksCtx.arc(point.x, point.y, 2 * point.life, 0, Math.PI * 2);
                        fireworksCtx.fillStyle = `rgba(255, 215, 0, ${point.life * 0.5})`;
                        fireworksCtx.fill();
                    });
                    
                    // Dibujar cohete
                    fireworksCtx.beginPath();
                    fireworksCtx.arc(this.x, this.y, 3, 0, Math.PI * 2);
                    fireworksCtx.fillStyle = this.color;
                    fireworksCtx.fill();
                } else {
                    this.particles.forEach(particle => particle.draw());
                }
            }
        }

        class Particle {
            constructor(x, y, vx, vy, color) {
                this.x = x;
                this.y = y;
                this.vx = vx;
                this.vy = vy;
                this.color = color;
                this.life = 1;
                this.decay = 0.015 + Math.random() * 0.01;
                this.size = 2 + Math.random() * 2;
                this.trail = [];
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;
                this.vy += 0.1; // Gravedad
                this.vx *= 0.99; // Fricción
                this.life -= this.decay;
                
                // Añadir estela
                if (Math.random() > 0.7) {
                    this.trail.push({ x: this.x, y: this.y, life: this.life });
                }
                
                if (this.trail.length > 10) {
                    this.trail.shift();
                }
            }

            draw() {
                // Dibujar estela
                this.trail.forEach((point, index) => {
                    fireworksCtx.beginPath();
                    fireworksCtx.arc(point.x, point.y, this.size * 0.5 * point.life, 0, Math.PI * 2);
                    fireworksCtx.fillStyle = `${this.color.replace('rgb', 'rgba').replace(')', `, ${point.life * 0.3})`)}`;
                    fireworksCtx.fill();
                });
                
                // Dibujar partícula principal
                fireworksCtx.save();
                fireworksCtx.globalAlpha = this.life;
                fireworksCtx.beginPath();
                fireworksCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                
                // Gradiente radial para efecto de brillo
                const gradient = fireworksCtx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
                gradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
                gradient.addColorStop(0.4, this.color);
                gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
                
                fireworksCtx.fillStyle = gradient;
                fireworksCtx.fill();
                fireworksCtx.restore();
            }
        }

        const auroraWaves = [];
        for (let i = 0; i < 6; i++) {
            auroraWaves.push(new AuroraWave());
        }

        let fireworks = [];

        function animateAurora() {
            auroraCtx.clearRect(0, 0, auroraCanvas.width, auroraCanvas.height);
            
            auroraWaves.forEach(wave => {
                wave.update();
                wave.draw();
            });
            
            requestAnimationFrame(animateAurora);
        }

        function animateFireworks() {
            fireworksCtx.fillStyle = 'rgba(0, 0, 0, 0.1)';
            fireworksCtx.fillRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);
            
            fireworks.forEach((firework, index) => {
                firework.update();
                firework.draw();
                
                if (firework.exploded && firework.particles.length === 0) {
                    fireworks.splice(index, 1);
                }
            });
            
            requestAnimationFrame(animateFireworks);
        }

        animateAurora();
        animateFireworks();

        // Crear estrellas mejoradas
        function createStars() {
            for (let i = 0; i < 80; i++) {
                const star = document.createElement('div');
                star.className = Math.random() > 0.7 ? 'star bright' : 'star';
                star.style.width = star.style.height = Math.random() * 4 + 'px';
                star.style.left = Math.random() * 100 + '%';
                star.style.top = Math.random() * 100 + '%';
                star.style.animationDelay = Math.random() * 3 + 's';
                star.style.animationDuration = (2 + Math.random() * 3) + 's';
                document.body.appendChild(star);
            }
        }

        createStars();

        // Funciones interactivas espectaculares
        function createSpectacularFireworks() {
            const colors = [
                'rgb(255, 110, 199)',
                'rgb(120, 115, 245)',
                'rgb(79, 195, 247)',
                'rgb(255, 215, 0)',
                'rgb(255, 105, 180)',
                'rgb(147, 112, 219)',
                'rgb(255, 182, 193)',
                'rgb(135, 206, 250)'
            ];
            
            // Crear múltiples fuegos artificiales
            for (let i = 0; i < 8; i++) {
                setTimeout(() => {
                    const x = Math.random() * fireworksCanvas.width;
                    const y = fireworksCanvas.height;
                    const targetY = 100 + Math.random() * 200;
                    const color = colors[Math.floor(Math.random() * colors.length)];
                    
                    fireworks.push(new Firework(x, y, targetY, color));
                }, i * 200);
            }
            
            // Segunda ronda
            setTimeout(() => {
                for (let i = 0; i < 6; i++) {
                    setTimeout(() => {
                        const x = Math.random() * fireworksCanvas.width;
                        const y = fireworksCanvas.height;
                        const targetY = 150 + Math.random() * 150;
                        const color = colors[Math.floor(Math.random() * colors.length)];
                        
                        fireworks.push(new Firework(x, y, targetY, color));
                    }, i * 300);
                }
            }, 2000);
        }

        function makeTulipsDance() {
            const tulips = document.querySelectorAll('.tulip');
            const bouquet = document.getElementById('bouquet');
            
            // Animación del ramo completo
            bouquet.style.animation = 'bouquetFloat 2s ease-in-out infinite, bouquetRotate 4s linear infinite';
            
            tulips.forEach((tulip, index) => {
                setTimeout(() => {
                    tulip.style.animation = 'windEffect 1s ease-in-out infinite, flowerBreathe 0.5s ease-in-out infinite';
                    tulip.style.transform = `
                        rotate(${Math.sin(index) * 45}deg) 
                        rotateY(${Math.cos(index) * 30}deg) 
                        rotateZ(${Math.sin(index * 2) * 20}deg) 
                        scale(${1 + Math.sin(index) * 0.3})
                        translateY(${Math.sin(index * 3) * 20}px)
                    `;
                }, index * 100);
            });

            setTimeout(() => {
                bouquet.style.animation = 'bouquetFloat 8s ease-in-out infinite, bouquetRotate 20s linear infinite';
                tulips.forEach(tulip => {
                    tulip.style.animation = 'windEffect 4s ease-in-out infinite';
                });
            }, 8000);
        }

        function changeAuroraColors() {
            auroraColors = [];
            for (let i = 0; i < 5; i++) {
                auroraColors.push({
                    r: Math.floor(Math.random() * 155) + 100,
                    g: Math.floor(Math.random() * 155) + 100,
                    b: Math.floor(Math.random() * 155) + 100
                });
            }
            auroraWaves.forEach(wave => wave.reset());
        }

        function createMagicSparkles() {
            for (let i = 0; i < 100; i++) {
                setTimeout(() => {
                    const sparkle = document.createElement('div');
                    sparkle.className = 'particle sparkle';
                    sparkle.style.left = Math.random() * window.innerWidth + 'px';
                    sparkle.style.top = Math.random() * window.innerHeight + 'px';
                    sparkle.style.animation = `sparkleAnim ${1.5 + Math.random() * 2}s ease-out forwards`;
                    document.body.appendChild(sparkle);

                    setTimeout(() => sparkle.remove(), 3500);
                }, i * 30);
            }
        }

        function createFlowerExplosion() {
            const flowers = ['🌸', '🌺', '🌷', '🌹', '🌻', '🌼', '💐', '🏵️'];
            
            for (let i = 0; i < 50; i++) {
                setTimeout(() => {
                    const flower = document.createElement('div');
                    flower.textContent = flowers[Math.floor(Math.random() * flowers.length)];
                    flower.style.position = 'fixed';
                    flower.style.fontSize = (20 + Math.random() * 30) + 'px';
                    flower.style.left = Math.random() * window.innerWidth + 'px';
                    flower.style.top = Math.random() * window.innerHeight + 'px';
                    flower.style.zIndex = '10';
                    flower.style.pointerEvents = 'none';
                    flower.style.animation = `sparkleAnim ${2 + Math.random() * 2}s ease-out forwards`;
                    document.body.appendChild(flower);

                    setTimeout(() => flower.remove(), 4000);
                }, i * 50);
            }
        }

        function createRainbowEffect() {
            const rainbow = document.createElement('div');
            rainbow.style.cssText = `
                position: fixed;
                top: 0;
                left: -50%;
                width: 200%;
                height: 100%;
                background: linear-gradient(90deg, 
                    rgba(255,0,0,0.3), rgba(255,127,0,0.3), rgba(255,255,0,0.3),
                    rgba(0,255,0,0.3), rgba(0,0,255,0.3), rgba(75,0,130,0.3), 
                    rgba(148,0,211,0.3), rgba(255,0,0,0.3));
                z-index: 3;
                pointer-events: none;
                animation: rainbowSweep 3s ease-in-out forwards;
            `;
            
            document.body.appendChild(rainbow);
            
            setTimeout(() => rainbow.remove(), 3000);
        }

        // Agregar animación de arcoíris dinámicamente
        const style = document.createElement('style');
        style.textContent = `
            @keyframes rainbowSweep {
                0% { transform: translateX(0); opacity: 0; }
                50% { opacity: 0.6; }
                100% { transform: translateX(50%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);

        // Interacción mejorada con tulipanes
        document.querySelectorAll('.tulip').forEach(tulip => {
            tulip.addEventListener('click', function() {
                this.style.transform = 'scale(1.5) rotateY(360deg) rotateZ(180deg) translateY(-30px)';
                createMagicSparkles();
                
                // Crear pequeños fuegos artificiales alrededor del tulipán
                const rect = this.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                
                for (let i = 0; i < 5; i++) {
                    setTimeout(() => {
                        const angle = (Math.PI * 2 / 5) * i;
                        const distance = 50;
                        const x = centerX + Math.cos(angle) * distance;
                        const y = centerY + Math.sin(angle) * distance;
                        
                        fireworks.push(new Firework(x, y, y - 50, 'rgb(255, 215, 0)'));
                    }, i * 100);
                }
                
                setTimeout(() => {
                    this.style.transform = '';
                }, 1500);
            });
        });

        // Animación inicial automática espectacular
        setTimeout(() => {
            createSpectacularFireworks();
        }, 2000);

        setTimeout(() => {
            createMagicSparkles();
        }, 4000);

        setTimeout(() => {
            makeTulipsDance();
        }, 6000);

        setTimeout(() => {
            createRainbowEffect();
        }, 8000);

        // Efecto de ratón mágico mejorado
        document.addEventListener('mousemove', (e) => {
            if (Math.random() > 0.92) {
                const sparkle = document.createElement('div');
                sparkle.className = 'particle magic-orb';
                sparkle.style.left = e.pageX + 'px';
                sparkle.style.top = e.pageY + 'px';
                sparkle.style.animation = `sparkleAnim ${1 + Math.random() * 1}s ease-out forwards`;
                document.body.appendChild(sparkle);

                setTimeout(() => sparkle.remove(), 2000);
            }
        });

        // Fuegos artificiales automáticos periódicos
        setInterval(() => {
            if (Math.random() > 0.7) {
                const x = Math.random() * fireworksCanvas.width;
                const y = fireworksCanvas.height;
                const targetY = 100 + Math.random() * 200;
                const colors = [
                    'rgb(255, 110, 199)',
                    'rgb(120, 115, 245)',
                    'rgb(79, 195, 247)',
                    'rgb(255, 215, 0)'
                ];
                const color = colors[Math.floor(Math.random() * colors.length)];
                
                fireworks.push(new Firework(x, y, targetY, color));
            }
        }, 3000);

        console.log('🌷✨ ¡Feliz 17 Cumpleaños Nancy! ✨🌷');
        console.log('🎆 Fuegos artificiales espectaculares activados 🌌');
        console.log('🦄 Magia extra desplegada 🌟');