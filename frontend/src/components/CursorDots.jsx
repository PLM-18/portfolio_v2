import React, { useEffect, useRef } from "react";

const GOOGLE_COLORS = [
    { main: "#4285F4", glow: "rgba(66, 133, 244, 0.85)" }, // Blue
    { main: "#EA4335", glow: "rgba(234, 67, 53, 0.85)" },  // Red
    { main: "#FBBC05", glow: "rgba(251, 188, 5, 0.85)" },  // Yellow
    { main: "#34A853", glow: "rgba(52, 168, 83, 0.85)" },  // Green
    { main: "#38BDF8", glow: "rgba(56, 189, 248, 0.85)" }, // Cyan
    { main: "#A855F7", glow: "rgba(168, 85, 247, 0.85)" }, // Purple
];

export const CursorDots = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        // Check for reduced motion preference
        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;
        if (prefersReducedMotion) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d", { alpha: true });
        if (!ctx) return;

        let animationFrameId;
        let width = (canvas.width = window.innerWidth);
        let height = (canvas.height = window.innerHeight);
        let dpr = window.devicePixelRatio || 1;

        const resizeCanvas = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            dpr = window.devicePixelRatio || 1;
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            ctx.scale(dpr, dpr);
        };

        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);

        // Mouse state
        const mouse = {
            x: -200,
            y: -200,
            targetX: -200,
            targetY: -200,
            speed: 0,
            isHovering: false,
            isVisible: false,
            opacity: 0,
        };

        // Orbiting floating dots configuration
        const DOT_COUNT = GOOGLE_COLORS.length;
        const dots = GOOGLE_COLORS.map((colorObj, i) => {
            const baseAngle = (i * 2 * Math.PI) / DOT_COUNT;
            const baseOrbit = 26 + (i % 3) * 10;
            return {
                color: colorObj.main,
                glow: colorObj.glow,
                baseAngle,
                angle: baseAngle,
                orbitRadius: baseOrbit,
                speed: (i % 2 === 0 ? 1 : -1) * (0.022 + (i % 4) * 0.007),
                wobbleSpeed: 0.035 + (i % 3) * 0.015,
                wobbleAmp: 6 + (i % 2) * 4,
                size: 3.5 + (i % 3) * 0.8,
                x: -200,
                y: -200,
                vx: 0,
                vy: 0,
                spring: 0.11 + (i % 3) * 0.025,
                friction: 0.82,
                history: [],
            };
        });

        // Particle explosions on click
        const particles = [];
        // Shockwave ripples on click
        const ripples = [];

        // Trigger click explosion effects
        const createClickBurst = (x, y) => {
            // 1. Elastic shock impulse pushing orbiting dots outward
            dots.forEach((dot) => {
                const dx = dot.x - x;
                const dy = dot.y - y;
                const dist = Math.hypot(dx, dy) || 1;
                const force = 14 + Math.random() * 8;
                dot.vx += (dx / dist) * force;
                dot.vy += (dy / dist) * force;
            });

            // 2. Shockwave expanding rings
            ripples.push({
                x,
                y,
                radius: 2,
                maxRadius: 65 + Math.random() * 20,
                alpha: 1,
                lineWidth: 2.5,
                color: GOOGLE_COLORS[Math.floor(Math.random() * GOOGLE_COLORS.length)].main,
                glow: GOOGLE_COLORS[Math.floor(Math.random() * GOOGLE_COLORS.length)].glow,
            });

            ripples.push({
                x,
                y,
                radius: 1,
                maxRadius: 40 + Math.random() * 15,
                alpha: 0.8,
                lineWidth: 1.5,
                color: "#81ecff",
                glow: "rgba(129, 236, 255, 0.9)",
            });

            // 3. Spark burst particles
            const sparkCount = 20 + Math.floor(Math.random() * 8);
            for (let i = 0; i < sparkCount; i++) {
                const angle = (i * (2 * Math.PI)) / sparkCount + (Math.random() - 0.5) * 0.5;
                const speed = 3.5 + Math.random() * 7;
                const colorObj = GOOGLE_COLORS[i % GOOGLE_COLORS.length];
                particles.push({
                    x,
                    y,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    size: 2.5 + Math.random() * 3,
                    color: colorObj.main,
                    glow: colorObj.glow,
                    alpha: 1,
                    decay: 0.02 + Math.random() * 0.02,
                    gravity: 0.06,
                    friction: 0.94,
                });
            }
        };

        // Event listeners
        const handleMouseMove = (e) => {
            mouse.targetX = e.clientX;
            mouse.targetY = e.clientY;
            if (!mouse.isVisible) {
                mouse.x = e.clientX;
                mouse.y = e.clientY;
                dots.forEach((dot) => {
                    dot.x = e.clientX;
                    dot.y = e.clientY;
                });
            }
            mouse.isVisible = true;

            // Check if hovering interactive element
            const target = document.elementFromPoint(e.clientX, e.clientY);
            if (target) {
                const interactive = target.closest(
                    'a, button, input, textarea, select, [role="button"], [tabindex]:not([tabindex="-1"]), .cursor-pointer'
                );
                const computed = window.getComputedStyle(target);
                mouse.isHovering = !!(interactive || computed.cursor === "pointer");
            } else {
                mouse.isHovering = false;
            }
        };

        const handleMouseDown = (e) => {
            mouse.targetX = e.clientX;
            mouse.targetY = e.clientY;
            mouse.isVisible = true;
            createClickBurst(e.clientX, e.clientY);
        };

        const handleMouseLeave = () => {
            mouse.isVisible = false;
        };

        const handleMouseEnter = (e) => {
            mouse.targetX = e.clientX;
            mouse.targetY = e.clientY;
            mouse.isVisible = true;
        };

        const handleTouchStart = (e) => {
            if (e.touches && e.touches[0]) {
                const touch = e.touches[0];
                mouse.targetX = touch.clientX;
                mouse.targetY = touch.clientY;
                mouse.x = touch.clientX;
                mouse.y = touch.clientY;
                mouse.isVisible = true;
                createClickBurst(touch.clientX, touch.clientY);
            }
        };

        const handleTouchMove = (e) => {
            if (e.touches && e.touches[0]) {
                const touch = e.touches[0];
                mouse.targetX = touch.clientX;
                mouse.targetY = touch.clientY;
                mouse.isVisible = true;
            }
        };

        const handleTouchEnd = () => {
            setTimeout(() => {
                mouse.isVisible = false;
            }, 600);
        };

        window.addEventListener("mousemove", handleMouseMove, { passive: true });
        window.addEventListener("mousedown", handleMouseDown, { passive: true });
        document.addEventListener("mouseleave", handleMouseLeave, { passive: true });
        document.addEventListener("mouseenter", handleMouseEnter, { passive: true });
        window.addEventListener("touchstart", handleTouchStart, { passive: true });
        window.addEventListener("touchmove", handleTouchMove, { passive: true });
        window.addEventListener("touchend", handleTouchEnd, { passive: true });

        let tick = 0;

        // Main animation loop
        const animate = () => {
            tick++;

            ctx.clearRect(0, 0, width, height);

            // Smooth cursor opacity fade in/out
            if (mouse.isVisible) {
                mouse.opacity = Math.min(1, mouse.opacity + 0.08);
            } else {
                mouse.opacity = Math.max(0, mouse.opacity - 0.05);
            }

            // Smooth mouse center tracking
            const mouseSpeedX = mouse.targetX - mouse.x;
            const mouseSpeedY = mouse.targetY - mouse.y;
            mouse.x += mouseSpeedX * 0.28;
            mouse.y += mouseSpeedY * 0.28;
            mouse.speed = Math.hypot(mouseSpeedX, mouseSpeedY);

            const globalAlpha = mouse.opacity;

            if (globalAlpha > 0.01) {
                // --- 1. Draw connecting constellation lines between nearby floating dots ---
                ctx.save();
                for (let i = 0; i < dots.length; i++) {
                    for (let j = i + 1; j < dots.length; j++) {
                        const dotA = dots[i];
                        const dotB = dots[j];
                        const d = Math.hypot(dotA.x - dotB.x, dotA.y - dotB.y);
                        const maxDist = mouse.isHovering ? 65 : 45;
                        if (d < maxDist) {
                            const lineAlpha = (1 - d / maxDist) * 0.22 * globalAlpha;
                            ctx.beginPath();
                            ctx.moveTo(dotA.x, dotA.y);
                            ctx.lineTo(dotB.x, dotB.y);
                            ctx.strokeStyle = `rgba(129, 236, 255, ${lineAlpha})`;
                            ctx.lineWidth = 0.8;
                            ctx.stroke();
                        }
                    }
                }
                ctx.restore();

                // --- 2. Update and draw floating trailing dots ---
                dots.forEach((dot, index) => {
                    // Orbit angle and radius calculation
                    dot.angle += mouse.isHovering ? dot.speed * 1.6 : dot.speed;

                    const hoverScale = mouse.isHovering ? 1.45 : 1.0;
                    const wobble = Math.sin(tick * dot.wobbleSpeed + index * 1.2) * dot.wobbleAmp;
                    const r = dot.orbitRadius * hoverScale + wobble;

                    // Target position on orbit around mouse
                    const targetX = mouse.x + Math.cos(dot.angle) * r;
                    const targetY = mouse.y + Math.sin(dot.angle) * r;

                    // Spring physics
                    dot.vx += (targetX - dot.x) * dot.spring;
                    dot.vy += (targetY - dot.y) * dot.spring;
                    dot.vx *= dot.friction;
                    dot.vy *= dot.friction;
                    dot.x += dot.vx;
                    dot.y += dot.vy;

                    // Store history for trailing motion tail
                    dot.history.push({ x: dot.x, y: dot.y });
                    if (dot.history.length > 5) dot.history.shift();

                    ctx.save();

                    // Draw trailing motion tail
                    if (dot.history.length > 1) {
                        ctx.beginPath();
                        ctx.moveTo(dot.history[0].x, dot.history[0].y);
                        for (let h = 1; h < dot.history.length; h++) {
                            ctx.lineTo(dot.history[h].x, dot.history[h].y);
                        }
                        ctx.strokeStyle = dot.glow;
                        ctx.globalAlpha = 0.3 * globalAlpha;
                        ctx.lineWidth = dot.size * 0.6;
                        ctx.lineCap = "round";
                        ctx.stroke();
                    }

                    // Draw glowing dot
                    ctx.globalAlpha = globalAlpha;
                    ctx.shadowBlur = mouse.isHovering ? 14 : 9;
                    ctx.shadowColor = dot.glow;
                    ctx.fillStyle = dot.color;

                    ctx.beginPath();
                    const currentSize = mouse.isHovering ? dot.size * 1.25 : dot.size;
                    ctx.arc(dot.x, dot.y, currentSize, 0, Math.PI * 2);
                    ctx.fill();

                    // Inner bright core
                    ctx.beginPath();
                    ctx.fillStyle = "#ffffff";
                    ctx.globalAlpha = 0.75 * globalAlpha;
                    ctx.shadowBlur = 0;
                    ctx.arc(dot.x, dot.y, currentSize * 0.38, 0, Math.PI * 2);
                    ctx.fill();

                    ctx.restore();
                });

                // --- 3. Draw central pointer core dot / reticle ---
                ctx.save();
                ctx.globalAlpha = globalAlpha;

                if (mouse.isHovering) {
                    ctx.beginPath();
                    ctx.arc(mouse.x, mouse.y, 7, 0, Math.PI * 2);
                    ctx.strokeStyle = "#81ecff";
                    ctx.lineWidth = 1.5;
                    ctx.shadowColor = "rgba(129, 236, 255, 0.8)";
                    ctx.shadowBlur = 8;
                    ctx.stroke();

                    ctx.beginPath();
                    ctx.arc(mouse.x, mouse.y, 2, 0, Math.PI * 2);
                    ctx.fillStyle = "#ffffff";
                    ctx.fill();
                } else {
                    ctx.beginPath();
                    ctx.arc(mouse.x, mouse.y, 3, 0, Math.PI * 2);
                    ctx.fillStyle = "#81ecff";
                    ctx.shadowColor = "rgba(129, 236, 255, 0.9)";
                    ctx.shadowBlur = 10;
                    ctx.fill();

                    ctx.beginPath();
                    ctx.arc(mouse.x, mouse.y, 1.2, 0, Math.PI * 2);
                    ctx.fillStyle = "#ffffff";
                    ctx.shadowBlur = 0;
                    ctx.fill();
                }
                ctx.restore();
            }

            // --- 4. Render click shockwave ripples ---
            for (let i = ripples.length - 1; i >= 0; i--) {
                const ripple = ripples[i];
                ripple.radius += (ripple.maxRadius - ripple.radius) * 0.12 + 1.2;
                ripple.alpha -= 0.028;

                if (ripple.alpha <= 0 || ripple.radius >= ripple.maxRadius) {
                    ripples.splice(i, 1);
                    continue;
                }

                ctx.save();
                ctx.beginPath();
                ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
                ctx.strokeStyle = ripple.color;
                ctx.lineWidth = ripple.lineWidth;
                ctx.globalAlpha = Math.max(0, ripple.alpha);
                ctx.shadowColor = ripple.glow;
                ctx.shadowBlur = 12;
                ctx.stroke();
                ctx.restore();
            }

            // --- 5. Render spark burst particles ---
            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                p.x += p.vx;
                p.y += p.vy;
                p.vy += p.gravity;
                p.vx *= p.friction;
                p.vy *= p.friction;
                p.size *= 0.96;
                p.alpha -= p.decay;

                if (p.alpha <= 0 || p.size <= 0.3) {
                    particles.splice(i, 1);
                    continue;
                }

                ctx.save();
                ctx.globalAlpha = Math.max(0, p.alpha);
                ctx.shadowColor = p.glow;
                ctx.shadowBlur = 8;
                ctx.fillStyle = p.color;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();

                // Spark center highlight
                ctx.beginPath();
                ctx.fillStyle = "#ffffff";
                ctx.globalAlpha = Math.max(0, p.alpha * 0.8);
                ctx.shadowBlur = 0;
                ctx.arc(p.x, p.y, p.size * 0.4, 0, Math.PI * 2);
                ctx.fill();

                ctx.restore();
            }

            animationFrameId = requestAnimationFrame(animate);
        };

        animationFrameId = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener("resize", resizeCanvas);
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mousedown", handleMouseDown);
            document.removeEventListener("mouseleave", handleMouseLeave);
            document.removeEventListener("mouseenter", handleMouseEnter);
            window.removeEventListener("touchstart", handleTouchStart);
            window.removeEventListener("touchmove", handleTouchMove);
            window.removeEventListener("touchend", handleTouchEnd);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-[99999] w-full h-full"
            style={{ touchAction: "none" }}
        />
    );
};

export default CursorDots;