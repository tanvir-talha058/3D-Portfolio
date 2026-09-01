import React, { useEffect, useRef } from 'react';

export default function NeuralBackground({ isLightMode }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width, height;
    let particles = [];
    let shockwaves = [];
    const maxDistance = 140;
    const particleCount = window.innerWidth < 768 ? 40 : 85;

    const mouse = {
      x: null,
      y: null,
      radius: 170
    };

    function initDimensions() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }

    class Particle {
      constructor(x, y, isBurst = false) {
        this.x = x !== undefined ? x : Math.random() * width;
        this.y = y !== undefined ? y : Math.random() * height;
        const speedMultiplier = isBurst ? 2.8 : 0.6;
        this.vx = (Math.random() - 0.5) * speedMultiplier;
        this.vy = (Math.random() - 0.5) * speedMultiplier;
        this.radius = isBurst ? Math.random() * 3 + 1.5 : Math.random() * 2 + 1;
        this.isPrimary = Math.random() > 0.4;
        this.alpha = Math.random() * 0.4 + 0.2;
        this.life = isBurst ? 120 : Infinity;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.life !== Infinity) {
          this.life--;
          this.alpha *= 0.98;
        }

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Mouse avoidance / attraction
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            const angle = Math.atan2(dy, dx);
            this.x -= Math.cos(angle) * force * 1.8;
            this.y -= Math.sin(angle) * force * 1.8;
          }
        }

        // Apply shockwaves
        for (const sw of shockwaves) {
          const dx = this.x - sw.x;
          const dy = this.y - sw.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (Math.abs(dist - sw.radius) < 25) {
            const angle = Math.atan2(dy, dx);
            this.x += Math.cos(angle) * sw.force;
            this.y += Math.sin(angle) * sw.force;
          }
        }
      }

      draw() {
        if (this.alpha <= 0.01) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        if (isLightMode) {
          ctx.fillStyle = this.isPrimary
            ? `rgba(37, 99, 235, ${this.alpha * 0.6})`
            : `rgba(79, 70, 229, ${this.alpha * 0.5})`;
        } else {
          ctx.fillStyle = this.isPrimary
            ? `rgba(56, 189, 248, ${this.alpha})`
            : `rgba(99, 102, 241, ${this.alpha})`;
        }
        ctx.fill();
      }
    }

    function createParticles() {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    }

    function connectParticles() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const opacity = (1 - dist / maxDistance) * (isLightMode ? 0.14 : 0.22);
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = isLightMode
              ? `rgba(37, 99, 235, ${opacity})`
              : `rgba(56, 189, 248, ${opacity})`;
            ctx.lineWidth = isLightMode ? 0.85 : 0.75;
            ctx.stroke();
          }
        }
      }
    }

    function drawShockwaves() {
      for (let i = shockwaves.length - 1; i >= 0; i--) {
        const sw = shockwaves[i];
        sw.radius += 4;
        sw.alpha *= 0.94;
        sw.force *= 0.92;

        if (sw.alpha > 0.01) {
          ctx.beginPath();
          ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
          ctx.strokeStyle = isLightMode
            ? `rgba(37, 99, 235, ${sw.alpha * 0.5})`
            : `rgba(56, 189, 248, ${sw.alpha * 0.6})`;
          ctx.lineWidth = 2;
          ctx.stroke();
        } else {
          shockwaves.splice(i, 1);
        }
      }
    }

    function render() {
      ctx.clearRect(0, 0, width, height);
      drawShockwaves();

      for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].draw();
        if (particles[i].life <= 0) {
          particles.splice(i, 1);
        }
      }

      connectParticles();
      animationFrameId = requestAnimationFrame(render);
    }

    const handleResize = () => {
      initDimensions();
      createParticles();
    };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    const handleClick = (e) => {
      // Create a shockwave and burst particles
      shockwaves.push({
        x: e.clientX,
        y: e.clientY,
        radius: 5,
        alpha: 0.8,
        force: 6
      });

      for (let i = 0; i < 6; i++) {
        particles.push(new Particle(e.clientX, e.clientY, true));
      }
    };

    initDimensions();
    createParticles();
    render();

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('click', handleClick);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('click', handleClick);
    };
  }, [isLightMode]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
        opacity: isLightMode ? 0.6 : 0.65
      }}
    />
  );
}
