import React, { useEffect, useRef } from 'react';

const GradientShader = ({
  introReveal = 0,
  rippleReveal = 0,
  getSamplePoints,
  onLuminance,
  onCanvasReady,
}) => {
  const canvasRef = useRef(null);
  const mousePos = useRef({ x: 0.5, y: 0.5 });
  const mouseVel = useRef({ x: 0, y: 0 });
  const rippleCenter = useRef({ x: 0.5, y: 0.5 });
  const timeRef = useRef(0);
  const introRevealRef = useRef(introReveal);
  const rippleRevealRef = useRef(rippleReveal);
  const interactingRef = useRef(0);
  const lastMoveRef = useRef(0);
  const getSamplePointsRef = useRef(getSamplePoints);
  const onLuminanceRef = useRef(onLuminance);
  const onCanvasReadyRef = useRef(onCanvasReady);
  const pixelBuf = useRef(new Uint8Array(4));

  useEffect(() => {
    introRevealRef.current = introReveal;
  }, [introReveal]);

  useEffect(() => {
    rippleRevealRef.current = rippleReveal;
  }, [rippleReveal]);

  useEffect(() => {
    getSamplePointsRef.current = getSamplePoints;
    onLuminanceRef.current = onLuminance;
    onCanvasReadyRef.current = onCanvasReady;
  }, [getSamplePoints, onLuminance, onCanvasReady]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', { preserveDrawingBuffer: true })
      || canvas.getContext('experimental-webgl', { preserveDrawingBuffer: true });
    if (!gl) {
      console.error('WebGL not supported');
      return;
    }

    const vertexShaderSource = `
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    const fragmentShaderSource = `
      precision highp float;
      uniform float time;
      uniform vec2 resolution;
      uniform vec2 mouse;
      uniform vec2 mouseVel;
      uniform vec2 rippleCenter;
      uniform float intro;
      uniform float ripple;
      uniform float interacting;

      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
      }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        float a = hash(i);
        float b = hash(i + vec2(1.0, 0.0));
        float c = hash(i + vec2(0.0, 1.0));
        float d = hash(i + vec2(1.0, 1.0));
        return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
      }

      float fbm(vec2 p) {
        float value = 0.0;
        float amplitude = 0.5;
        for (int i = 0; i < 5; i++) {
          value += amplitude * noise(p);
          p = p * 2.02 + vec2(1.7, 9.2);
          amplitude *= 0.5;
        }
        return value;
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / resolution.xy;
        float aspect = resolution.x / resolution.y;
        vec2 p = vec2(uv.x * aspect, uv.y);
        vec2 centered = uv - 0.5;

        float flowTime = time * 0.05 * intro;

        vec2 flowWarp = vec2(
          sin(p.y * 1.5 + flowTime * 0.85),
          cos(p.x * 1.4 - flowTime * 0.75)
        ) * 0.16 * intro;

        vec2 baseP = p + flowWarp;

        vec2 mouseP = vec2(mouse.x * aspect + (1.0 - aspect) * 0.5, mouse.y);
        vec2 toMouse = mouseP - p;
        float dist = length(toMouse);
        float localMask = exp(-dist * 4.2) * interacting;

        vec2 vel = vec2(mouseVel.x * aspect, mouseVel.y);
        vec2 advect = -vel * localMask * 0.55;
        vec2 pull = normalize(toMouse + 0.0001) * localMask * 0.05;

        vec2 sampleP = baseP + advect + pull;

        vec2 warpA = vec2(
          fbm(sampleP * 1.35 + flowTime * 0.45),
          fbm(sampleP * 1.35 + vec2(4.2, 1.9) + flowTime * 0.38)
        );
        vec2 warpB = vec2(
          fbm(sampleP * 1.1 + warpA * 1.4 + vec2(1.3, 2.8) + flowTime * 0.32),
          fbm(sampleP * 1.1 + warpA * 1.4 + vec2(6.1, 3.7) - flowTime * 0.28)
        );

        float flow = fbm(sampleP * 1.6 + warpB * 2.2 + flowTime * 0.55);
        float flowDetail = fbm(sampleP * 3.2 + warpA * 1.1 - flowTime * 0.22);
        float blend = smoothstep(0.0, 1.0, flow * 0.72 + flowDetail * 0.28);

        vec3 deep     = vec3(0.26, 0.14, 0.07);
        vec3 midBrown = vec3(0.50, 0.34, 0.17);
        vec3 warm     = vec3(0.68, 0.50, 0.31);
        vec3 light    = vec3(0.82, 0.67, 0.50);
        vec3 cream    = vec3(0.93, 0.90, 0.84);

        vec3 color = mix(deep, midBrown, smoothstep(0.08, 0.42, blend));
        color = mix(color, warm,  smoothstep(0.28, 0.58, blend));
        color = mix(color, light, smoothstep(0.48, 0.78, blend));
        color = mix(color, cream, smoothstep(0.68, 0.96, blend) * 0.55);

        float softPulse = 0.5 + 0.5 * fbm(sampleP * 0.9 + warpB * 0.6 + flowTime * 0.18);
        color = mix(color, cream, softPulse * 0.08);

        vec2 dropCenter = vec2(rippleCenter.x * aspect, rippleCenter.y);
        float dropDist = distance(p, dropCenter);
        float rippleWave = sin(dropDist * 9.0 - ripple * 14.0) * exp(-dropDist * 2.8) * (1.0 - ripple);
        float rippleReveal = smoothstep(0.0, 1.0, ripple) + rippleWave * 0.12 * (1.0 - ripple);
        float reveal = clamp(max(intro, rippleReveal), 0.0, 1.0);

        float glow = 0.72 + reveal * 0.28 + sin(flowTime * 0.4) * 0.04 * intro;
        color *= glow;

        float edge = length(centered * vec2(aspect, 1.0));
        float vignette = 1.0 - edge * edge * 0.14;
        color *= mix(0.88, vignette, reveal);

        vec3 darkBase = vec3(0.06, 0.05, 0.04);
        color = mix(darkBase, color, reveal);

        gl_FragColor = vec4(color, 1.0);
      }
    `;

    const compileShader = (source, type) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compile error:', gl.getShaderInfoLog(shader));
      }
      return shader;
    };

    const vertexShader = compileShader(vertexShaderSource, gl.VERTEX_SHADER);
    const fragmentShader = compileShader(fragmentShaderSource, gl.FRAGMENT_SHADER);

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(program));
    }

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );

    const timeUniform = gl.getUniformLocation(program, 'time');
    const resolutionUniform = gl.getUniformLocation(program, 'resolution');
    const mouseUniform = gl.getUniformLocation(program, 'mouse');
    const mouseVelUniform = gl.getUniformLocation(program, 'mouseVel');
    const rippleCenterUniform = gl.getUniformLocation(program, 'rippleCenter');
    const introUniform = gl.getUniformLocation(program, 'intro');
    const rippleUniform = gl.getUniformLocation(program, 'ripple');
    const interactingUniform = gl.getUniformLocation(program, 'interacting');
    const positionAttrib = gl.getAttribLocation(program, 'position');

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
      onCanvasReadyRef.current?.(canvas.width, canvas.height);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const handleMouseMove = (e) => {
      const nx = e.clientX / window.innerWidth;
      const ny = 1.0 - e.clientY / window.innerHeight;
      mouseVel.current.x = (nx - mousePos.current.x) * 3.5;
      mouseVel.current.y = (ny - mousePos.current.y) * 3.5;
      mousePos.current.x = nx;
      mousePos.current.y = ny;
      interactingRef.current = 1.0;
      lastMoveRef.current = performance.now();
    };

    const handleMouseLeave = () => {
      interactingRef.current = 0.0;
      mouseVel.current.x = 0;
      mouseVel.current.y = 0;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    let frameId;
    let frameCount = 0;
    const animate = () => {
      timeRef.current += 0.016;

      if (performance.now() - lastMoveRef.current > 120) {
        interactingRef.current = Math.max(0, interactingRef.current - 0.06);
        mouseVel.current.x *= 0.92;
        mouseVel.current.y *= 0.92;
      }

      rippleCenter.current.x += (mousePos.current.x - rippleCenter.current.x) * 0.08;
      rippleCenter.current.y += (mousePos.current.y - rippleCenter.current.y) * 0.08;

      gl.useProgram(program);
      gl.uniform1f(timeUniform, timeRef.current);
      gl.uniform2f(resolutionUniform, canvas.width, canvas.height);
      gl.uniform2f(mouseUniform, mousePos.current.x, mousePos.current.y);
      gl.uniform2f(mouseVelUniform, mouseVel.current.x, mouseVel.current.y);
      gl.uniform2f(rippleCenterUniform, rippleCenter.current.x, rippleCenter.current.y);
      gl.uniform1f(introUniform, introRevealRef.current);
      gl.uniform1f(rippleUniform, rippleRevealRef.current);
      gl.uniform1f(interactingUniform, interactingRef.current);

      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.vertexAttribPointer(positionAttrib, 2, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(positionAttrib);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      frameCount += 1;
      if (frameCount % 2 === 0 && onLuminanceRef.current && getSamplePointsRef.current) {
        const points = getSamplePointsRef.current();
        if (points.length > 0) {
          const luminance = {};
          const buf = pixelBuf.current;
          points.forEach(({ key, x, y }) => {
            const px = Math.max(0, Math.min(canvas.width - 1, Math.floor(x)));
            const py = Math.max(0, Math.min(canvas.height - 1, Math.floor(y)));
            gl.readPixels(px, py, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, buf);
            luminance[key] =
              (buf[0] * 0.299 + buf[1] * 0.587 + buf[2] * 0.114) / 255;
          });
          onLuminanceRef.current(luminance);
        }
      }

      frameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'block',
        zIndex: 0,
      }}
    />
  );
};

export default GradientShader;