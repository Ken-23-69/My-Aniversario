//© Zero - Código libre no comercial



function iniciarAnimacion() {
  // Mostrar los elementos ocultos
  document.getElementById('floating-objects').style.display = '';
  document.getElementById('dedication-text').style.display = '';
  document.getElementById('countdown').style.display = '';
  document.getElementById('tree-container').style.display = '';

  // Cargar el SVG y animar los corazones
  fetch('Img/treelove.svg')
    .then(res => res.text())
    .then(svgText => {
      const container = document.getElementById('tree-container');
      container.innerHTML = svgText;
      const svg = container.querySelector('svg');
      if (!svg) return;

      // Animación de "dibujo" para todos los paths
      const allPaths = Array.from(svg.querySelectorAll('path'));
      allPaths.forEach(path => {
        path.style.stroke = '#222';
        path.style.strokeWidth = '2.5';
        path.style.fillOpacity = '0';
        const length = path.getTotalLength();
        path.style.strokeDasharray = length;
        path.style.strokeDashoffset = length;
        path.style.transition = 'none';
      });

      // Forzar reflow y luego animar
      setTimeout(() => {
        allPaths.forEach((path, i) => {
          path.style.transition = `stroke-dashoffset 1.2s cubic-bezier(.77,0,.18,1) ${i * 0.08}s, fill-opacity 0.5s ${0.9 + i * 0.08}s`;
          path.style.strokeDashoffset = 0;
          setTimeout(() => {
            path.style.fillOpacity = '1';
            path.style.stroke = '';
            path.style.strokeWidth = '';
          }, 1200 + i * 80);
        });

        // Después de la animación de dibujo, mueve y agranda el SVG
        const totalDuration = 1200 + (allPaths.length - 1) * 80 + 500;
        setTimeout(() => {
          svg.classList.add('move-and-scale');
          // Cambiar el fondo después de mover el árbol
          document.body.style.background = '#83c5be';
          // Mostrar texto con efecto typing
          setTimeout(() => {
            showDedicationText();
            // Mostrar petalos flotando
            startFloatingObjects();
            // Mostrar cuenta regresiva
            showCountdown();
            // Iniciar música de fondo
            playBackgroundMusic();
          }, 1200); //Tiempo para agrandar el SVG
        }, totalDuration);
      }, 50);

      // Selecciona los corazones (formas rojas)
      const heartPaths = allPaths.filter(el => {
        const style = el.getAttribute('style') || '';
        return style.includes('#FC6F58') || style.includes('#C1321F');
      });
      heartPaths.forEach(path => {
        path.classList.add('animated-heart');
      });
    });
}

// Efecto máquina de escribir para el texto de dedicatoria (seguidores)
function getURLParam(name) {
  const url = new URL(window.location.href);
  return url.searchParams.get(name);
}

function showDedicationText() { //seguidores
  let text = getURLParam('text');
  if (!text) {
    text = `Amor mío:\n\

Cada día doy gracias a Dios por haberte puesto en mi camino. Eres una bendición que llena mi vida de luz, paz y amor verdadero. Tu forma de expresar lo que sientes, tan sincera, tan profunda, me toca el alma. En cada gesto, en cada palabra tuya, veo el amor puro que nace de tu corazón lleno de bondad. Te amo con un enorme amor, que confía, que espera, y que sueña con toda una vida a tu lado My Niña Hermosa. ❤️‍🩹`;  } else {
    text = decodeURIComponent(text).replace(/\\n/g, '\n');
  }
  const container = document.getElementById('dedication-text');
  container.classList.add('typing');
  let i = 0;
  function type() {
    if (i <= text.length) {
      container.textContent = text.slice(0, i);
      i++;
      setTimeout(type, text[i - 2] === '\n' ? 350 : 45);
    } else {
      // Al terminar el typing, mostrar la firma animada
      setTimeout(showSignature, 600);
    }
  }
  type();
}

// Firma manuscrita animada
function showSignature() {
  // Cambia para buscar la firma dentro del contenedor de dedicatoria
  const dedication = document.getElementById('dedication-text');
  let signature = dedication.querySelector('#signature');
  if (!signature) {
    signature = document.createElement('div');
    signature.id = 'signature';
    signature.className = 'signature';
    dedication.appendChild(signature);
  }
  let firma = getURLParam('firma');
  signature.textContent = firma ? decodeURIComponent(firma) : "Con todo mi corazón, Tu Niño❤️";
  signature.classList.add('visible');
}



// Controlador de objetos flotantes
function startFloatingObjects() {
  const container = document.getElementById('floating-objects');
  let count = 0;
  function spawn() {
    let el = document.createElement('div');
    el.className = 'floating-petal';
    // Posición inicial
    el.style.left = `${Math.random() * 90 + 2}%`;
    el.style.top = `${100 + Math.random() * 10}%`;
    el.style.opacity = 0.7 + Math.random() * 0.3;
    container.appendChild(el);

    // Animación flotante
    const duration = 6000 + Math.random() * 4000;
    const drift = (Math.random() - 0.5) * 60;
    setTimeout(() => {
      el.style.transition = `transform ${duration}ms linear, opacity 1.2s`;
      el.style.transform = `translate(${drift}px, -110vh) scale(${0.8 + Math.random() * 0.6}) rotate(${Math.random() * 360}deg)`;
      el.style.opacity = 0.2;
    }, 30);

    // Eliminar después de animar
    setTimeout(() => {
      if (el.parentNode) el.parentNode.removeChild(el);
    }, duration + 2000);

    // Generar más objetos
    if (count++ < 32) setTimeout(spawn, 350 + Math.random() * 500);
    else setTimeout(spawn, 1200 + Math.random() * 1200);
  }
  spawn();
}

// Cuenta regresiva o fecha especia
function showCountdown() {
  const container = document.getElementById('countdown');
  let startParam = getURLParam('start');
  let eventParam = getURLParam('event');
  let startDate = startParam ? new Date(startParam + 'T00:00:00') : new Date('2024-01-02T00:00:00');
  let eventDate = eventParam ? new Date(eventParam + 'T00:00:00') : new Date('2025-05-02T00:00:00');

  function update() {
    const now = new Date();
    let diff = now - startDate;
    let days = Math.floor(diff / (1000 * 60 * 60 * 24));

    // Comprobar si hoy es el aniversario
    let isAnniversary =
      now.getFullYear() === eventDate.getFullYear() &&
      now.getMonth() === eventDate.getMonth() &&
      now.getDate() === eventDate.getDate();

    let html = `Llevamos juntos: <b>${days}</b> días<br>`;

    if (isAnniversary) {
      // Calcular el tiempo restante hasta la medianoche
      let endOfDay = new Date(now);
      endOfDay.setHours(23, 59, 59, 999);
      let eventDiff = endOfDay - now;
      let hours = Math.floor(eventDiff / (1000 * 60 * 60));
      let minutes = Math.floor((eventDiff / (1000 * 60)) % 60);
      let seconds = Math.floor((eventDiff / 1000) % 60);
      html += `¡Feliz aniversario!<br>Quedan: <b>${hours}h ${minutes}m ${seconds}s</b> de celebración 🎉`;
    } else {
      // Mostrar días restantes para el aniversario
      let eventDiff = eventDate - now;
      let eventDays = Math.max(0, Math.floor(eventDiff / (1000 * 60 * 60 * 24)));
      html += `Nuestro aniversario: <b>${eventDays} días</b>`;
    }

    container.innerHTML = html;
    container.classList.add('visible');
  }
  update();
  setInterval(update, 1000);
}



// --- Música de fondo ---
function playBackgroundMusic() {
  const audio = document.getElementById('bg-music');
  if (!audio) return;

  // --- Opción archivo local por parámetro 'musica' ---
  let musicaParam = getURLParam('musica');
  if (musicaParam) {
    // Decodifica y previene rutas maliciosas
    musicaParam = decodeURIComponent(musicaParam).replace(/[^\w\d .\-]/g, '');
    audio.src = 'Music/' + musicaParam;
  }

  // --- Opción YouTube (solo mensaje de ayuda) ---
  let youtubeParam = getURLParam('youtube');
  if (youtubeParam) {
    // Muestra mensaje de ayuda para descargar el audio
    let helpMsg = document.getElementById('yt-help-msg');
    if (!helpMsg) {
      helpMsg = document.createElement('div');
      helpMsg.id = 'yt-help-msg';
      helpMsg.style.position = 'fixed';
      helpMsg.style.right = '18px';
      helpMsg.style.bottom = '180px';
      helpMsg.style.background = 'rgba(255,255,255,0.95)';
      helpMsg.style.color = '#e60026';
      helpMsg.style.padding = '10px 16px';
      helpMsg.style.borderRadius = '12px';
      helpMsg.style.boxShadow = '0 2px 8px #e6002633';
      helpMsg.style.fontSize = '1.05em';
      helpMsg.style.zIndex = 100;
      helpMsg.innerHTML = 'Para usar música de YouTube, descarga el audio (por ejemplo, usando y2mate, 4K Video Downloader, etc.), colócalo en la carpeta <b>Music</b> y usa la URL así:<br><br><code>?musica=nombre.mp3</code>';
      document.body.appendChild(helpMsg);
      setTimeout(() => { if(helpMsg) helpMsg.remove(); }, 15000);
    }
  }

  // Elimina el botón de música si existe
  let btn = document.getElementById('music-btn');
  if (btn) btn.remove();
  audio.volume = 0.7;
  audio.loop = true;
  // Intentar reproducir automáticamente
  audio.play().catch(() => {
    // Si falla el autoplay, no mostrar ningún botón
  });
}


// Mostrar solo el botón al inicio, y esperar el click para iniciar todo
window.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('start-btn');
  btn.style.display = '';
  btn.addEventListener('click', () => {
    btn.style.display = 'none';
    iniciarAnimacion();
  });
});
