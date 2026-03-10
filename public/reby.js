let scene, camera, renderer, shockwaveMesh, clock;
function initShockwave() {
  if (typeof THREE === "undefined") {
    console.error("Three.js is not loaded yet!");
    return;
  }
  const container = document.getElementById('shockwaveContainer');
  if (!container) return console.error("Shockwave container not found!");
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;
  renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);
  clock = new THREE.Clock();
  const geometry = new THREE.SphereGeometry(0.1, 32, 32);
  const material = new THREE.MeshBasicMaterial({
    color: 0x00ffff,
    wireframe: true,
    transparent: true,
    opacity: 1
  });
  shockwaveMesh = new THREE.Mesh(geometry, material);
  scene.add(shockwaveMesh);
  shockwaveMesh.visible = false;
  animateShockwave();
}
document.addEventListener("DOMContentLoaded", () => {
  if (typeof THREE !== "undefined") {
    initShockwave();
  }
});
function lightningStrike(messages) {
  if (typeof THREE === 'undefined') return;

  // Lightning geometry: jagged line
  const points = [];
  let x = 0, y = 10, z = 0; // start above camera
  for (let i = 0; i < 5; i++) {
    x += (Math.random() - 0.5) * 2;
    y -= 2 + Math.random() * 2;
    z += (Math.random() - 0.5) * 2;
    points.push(new THREE.Vector3(x, y, z));
  }

  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({ color: 0xffffee, linewidth: 2 });
  const lightning = new THREE.Line(geometry, material);
  scene.add(lightning);

  // Lightning flash effect
  const flash = new THREE.PointLight(0xffffff, 5, 50);
  flash.position.set(0, 5, 0);
  scene.add(flash);

  let elapsed = 0;
  const duration = 0.3; // 0.3 sec flash
  const animateLightning = () => {
    if (elapsed < duration) {
      flash.intensity = 5 * Math.sin((elapsed / duration) * Math.PI);
      renderer.render(scene, camera);
      elapsed += 0.016;
      requestAnimationFrame(animateLightning);
    } else {
      scene.remove(lightning);
      scene.remove(flash);
      renderer.render(scene, camera);
    }
  };
  animateLightning();
  messages.forEach((msg, index) => {
    msg.style.transition = 'transform 1s ease-out, opacity 1s ease';
    setTimeout(() => {
      const dx = (Math.random() - 0.5) * 500;
      const dy = -window.innerHeight - Math.random() * 200;
      const dz = (Math.random() - 0.5) * 500;
      msg.style.transform = `translate3d(${dx}px, ${dy}px, ${dz}px) rotate(${Math.random()*720}deg) scale(0.2)`;
      msg.style.opacity = '0';
    }, index * 50); 
  });
  setTimeout(() => messagesDiv.innerHTML = '', messages.length * 50 + 1000);
}
function activateShockwave() {
  if (typeof THREE === "undefined") return;
  if (!shockwaveMesh) initShockwave();
  shockwaveMesh.visible = true;
  if (clock && clock.start) clock.start();
}
console.log('reby.js loaded');
const socket = io();
const nameInput = document.getElementById('nameInput');
const joinBtn = document.getElementById('joinBtn');
const app = document.getElementById('app');
const heading = document.getElementById('heading');
const messagesDiv = document.querySelector('.messages');
const messageInput = document.getElementById('messageInput');
const typingIndicator = document.querySelector('.typingIndicator');
const membersList = document.getElementById('membersList');
const menuDots = document.getElementById('menuDots');
const menuPopup = document.getElementById('menuPopup');
const createRoomBtn = document.getElementById('createRoom');
const joinRoomBtn = document.getElementById('joinRoom');
const leaveRoomBtn = document.getElementById('leaveRoom');
const toggleMusicBtn = document.getElementById('toggleMusic');
const actionBtn = document.getElementById("actionBtn");
let mediaRecorder;
let audioChunks = [];
let recording = false;
const playlist = ["https://files.catbox.moe/ergpmh.mp4","https://files.catbox.moe/6ywqzp.mp4","https://files.catbox.moe/hjv93p.mp4"];
let currentTrack = 0;
let musicEnabled = true;
const audioPlayer = new Audio();
audioPlayer.volume = 1.0;
audioPlayer.preload = "auto";
audioPlayer.addEventListener("ended", () => {
  currentTrack = (currentTrack + 1) % playlist.length;
  audioPlayer.src = playlist[currentTrack];
  if (musicEnabled) audioPlayer.play().catch(() => {});
});
function startMusic() { if (!musicEnabled) return; audioPlayer.src = playlist[currentTrack]; audioPlayer.play().catch(() => {}); }
function stopMusic() { audioPlayer.pause(); audioPlayer.currentTime = 0; }
if (toggleMusicBtn) {
  toggleMusicBtn.textContent = musicEnabled ? "🎵 Music: ON" : "🎵 Music: OFF";
  toggleMusicBtn.addEventListener("click", () => {
    musicEnabled = !musicEnabled;
    toggleMusicBtn.textContent = musicEnabled ? "🎵 Music: ON" : "🎵 Music: OFF";
    if (musicEnabled && currentRoom !== 'global') startMusic(); else stopMusic();
  });
}
const privateImages = [
  "/images/slider1.jpg",
  "/images/slider2.jpg",
  "/images/slider3.jpg",
  "/images/slider4.jpg",
  "/images/slider5.jpg",
  "/images/slider6.jpg",
  "/images/slider7.jpg",
  "/images/slider8.jpg",
];
let slideIndex = 0, slideInterval = null, showingA = true;
const slideA = document.getElementById("slide1");
const slideB = document.getElementById("slide2");
function startSlideshow() {
  stopSlideshow();
  slideA.style.backgroundImage = `url('${privateImages[0]}')`;
  slideB.style.backgroundImage = `url('${privateImages[1]}')`;
  slideIndex = 1;
  slideA.classList.add("top");
  slideB.classList.remove("top");
  showingA = true;
  slideInterval = setInterval(() => {
    const next = privateImages[(slideIndex + 1) % privateImages.length];
    if (showingA) {
      slideB.style.backgroundImage = `url('${next}')`;
      slideB.classList.add("top");
      slideA.classList.remove("top");
    } else {
      slideA.style.backgroundImage = `url('${next}')`;
      slideA.classList.add("top");
      slideB.classList.remove("top");
    }
    showingA = !showingA;
    slideIndex = (slideIndex + 1) % privateImages.length;
  }, 30000);
}
function stopSlideshow() {
  clearInterval(slideInterval);
  slideInterval = null;
  slideA.classList.add("top");
  slideB.classList.remove("top");
}
let username = '';
let currentRoom = 'global';
let typingTimer = null;
function showApp() {
  document.querySelector('.overlay')?.classList.add('hidden');
  app.classList.remove('hidden');
}
function appendMessage(type, payload) {
  const el = document.createElement('div');
  if (type === 'system') {
    el.className = 'system wobble';
    el.textContent = payload;
  } else {
    const me = payload.name === username;
    el.className = me ? 'message msg-right' : 'message msg-left';
    if (payload.audio) {
      appendVoiceMessage(payload.name, payload.audio, me);
      return;
    } else {
      el.innerHTML = `<div class="meta">${payload.name}</div><div class="body">${payload.text}</div>`;
    }
  }
  messagesDiv.appendChild(el);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}
function appendVoiceMessage(name, audioSrc, isMe) {
  const el = document.createElement('div');
  el.className = isMe ? 'message msg-right' : 'message msg-left';
  el.innerHTML = `
    <div class="meta">${name}</div>
    <div class="voice-container">
      <button class="play-btn">▶️</button>
      <div class="voice-wave">
        <span></span><span></span><span></span><span></span><span></span>
      </div>
    </div>
  `;
  messagesDiv.appendChild(el);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
  const audio = new Audio(audioSrc);
  audio.preload = 'auto';
  const playBtn = el.querySelector('.play-btn');
  const waveEl = el.querySelector('.voice-wave');
  playBtn.addEventListener('click', () => {
    if (audio.paused) {
      audio.play();
      waveEl.classList.add('playing');
      playBtn.textContent = '⏸️';
    } else {
      audio.pause();
      waveEl.classList.remove('playing');
      playBtn.textContent = '▶️';
    }
  });
  audio.addEventListener('ended', () => {
    waveEl.classList.remove('playing');
    playBtn.textContent = '▶️';
  });
}
joinBtn.addEventListener('click', () => {
  const v = nameInput.value.trim();
  if (!v) return alert('Enter your name');
  username = v;
  localStorage.setItem('chat_name', username);
  showApp();
  heading.textContent = 'IN THE END ALWAYS THE BIGGEST ONE WINS☠️';
  socket.emit('joinGlobal', username);
});
nameInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') joinBtn.click();
});
function sendMessage() {
  const text = messageInput.value.trim();
  if (!text) return;
  socket.emit('chatMessage', { room: currentRoom, name: username, msg: text });
  messageInput.value = '';
  actionBtn.classList.remove("send");
  actionBtn.classList.add("mic");
  actionBtn.textContent = "🎤";
  socket.emit('stopTyping', { name: username, room: currentRoom });
}
messageInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    if (messageInput.value.trim()) sendMessage();
  }
});
messageInput.addEventListener("input", () => {
  if (messageInput.value.trim()) {
    actionBtn.classList.add("send");
    actionBtn.classList.remove("mic");
    actionBtn.textContent = "➤";
  } else {
    actionBtn.classList.remove("send");
    actionBtn.classList.add("mic");
    actionBtn.textContent = "🎤";
  }
});
actionBtn.addEventListener("click", () => {
  if (actionBtn.classList.contains("send")) sendMessage();
});
let holdRecording = false;
async function startRecording() {
  if (!username || !actionBtn.classList.contains("mic")) return;
  holdRecording = true;
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  mediaRecorder = new MediaRecorder(stream);
  audioChunks = [];
  mediaRecorder.ondataavailable = e => audioChunks.push(e.data);
  mediaRecorder.start();
  actionBtn.classList.add("recording");
}
function stopRecording() {
  if (!holdRecording) return;
  holdRecording = false;
  if (!mediaRecorder) return;
  mediaRecorder.stop();
  actionBtn.classList.remove("recording");
  mediaRecorder.onstop = () => {
    const blob = new Blob(audioChunks, { type: "audio/webm" });
    const reader = new FileReader();
    reader.onloadend = () => {
      socket.emit("voiceMessage", {
        room: currentRoom,
        name: username,
        audio: reader.result
      });
    };
    reader.readAsDataURL(blob);
  };
}
function cancelRecording() {
  holdRecording = false;
  if (mediaRecorder && mediaRecorder.state !== "inactive") mediaRecorder.stop();
  actionBtn.classList.remove("recording");
}
actionBtn.addEventListener("mousedown", startRecording);
actionBtn.addEventListener("touchstart", startRecording);
actionBtn.addEventListener("mouseup", stopRecording);
actionBtn.addEventListener("mouseleave", cancelRecording);
actionBtn.addEventListener("touchend", stopRecording);menuDots?.addEventListener('click', (e) => {
  e.stopPropagation();
  menuPopup?.classList.toggle('show');
});

window.addEventListener('click', (e) => {
  if (!menuPopup?.contains(e.target) && !menuDots?.contains(e.target)) {
    menuPopup?.classList.remove('show');
  }
});
createRoomBtn?.addEventListener('click', () => {
  if (!username) return alert('Join first');
  socket.emit('createRoom', username);
});
joinRoomBtn?.addEventListener('click', () => {
  if (!username) return alert('Join first');
  const pin = prompt('Enter 4-digit PIN to join:');
  if (pin) socket.emit('joinRoom', { name: username, code: pin.trim() });
});
leaveRoomBtn?.addEventListener('click', () => {
  if (!username) return;
  socket.emit('leaveRoom', { name: username, room: currentRoom });
  currentRoom = 'global';
  heading.textContent = 'IN THE END ALWAYS THE BIGGER ONE WINS☠️';
  stopSlideshow();
  if (slideA) { slideA.style.backgroundImage = "url('https://files.catbox.moe/3jvej7.jpg')"; slideA.classList.add("top"); }
  if (slideB) { slideB.style.backgroundImage = ""; slideB.classList.remove("top"); }
  musicEnabled = false;
  stopMusic();
  leaveRoomBtn.classList.add('hidden');
  socket.emit('requestActive', 'global');
  socket.emit('clearChat');
});
socket.on('connect', () => { console.log('[client] connected', socket.id); });
socket.on('message', (data) => {
  if (!data) return;
  if (data.type === 'system') appendMessage('system', data.msg);
  else if (data.type === 'chat') appendMessage('chat', { name: data.name, text: data.msg, audio: data.audio });
});
socket.on('updateMembers', (members) => {
  membersList.innerHTML = '';
  members.forEach(m => { const li = document.createElement('li'); li.innerHTML = `<span class="dot"></span> ${m}`; membersList.appendChild(li); });
});
socket.on('displayTyping', (name) => { typingIndicator.textContent = `${name} is typing...`; typingIndicator.classList.add('show'); });
socket.on('hideTyping', () => { typingIndicator.classList.remove('show'); typingIndicator.textContent = ''; });
socket.on('roomCreated', (code) => {
  alert('Your Room Code: ' + code + ' ✨');
  currentRoom = code;
  musicEnabled = true;
  if (toggleMusicBtn) toggleMusicBtn.textContent = "🎵 Music: ON";
  startMusic();
  startSlideshow();
  heading.textContent = 'FREECHAT';
  leaveRoomBtn.classList.remove('hidden');
  socket.emit('requestActive', code);
  socket.emit('clearChat');
});
socket.on('roomJoined', (code) => {
  currentRoom = code;
  musicEnabled = true;
  if (toggleMusicBtn) toggleMusicBtn.textContent = "🎵 Music: ON";
  startMusic();
  startSlideshow();
  heading.textContent = 'FREECHAT';
  leaveRoomBtn.classList.remove('hidden');
  socket.emit('requestActive', code);
  socket.emit('clearChat');
});
socket.on('clearChat', () => {
  const messages = Array.from(document.querySelectorAll('.messages .message'));

  // ---------- 1. Screen shake ----------
  document.body.style.transition = 'transform 0.1s ease';
  document.body.style.transform = 'scale(1.02) rotateZ(1deg)';
  setTimeout(() => {
    document.body.style.transform = 'scale(1) rotateZ(0)';
  }, 200);

  // ---------- 2. Message hurricane effect ----------
  messages.forEach((msg, index) => {
    msg.style.transition =
      'transform 1.5s cubic-bezier(0.77,0,0.175,1), opacity 1.2s ease, filter 1s ease';
    
    setTimeout(() => {
      const angle = Math.random() * Math.PI * 2; // spin around
      const radius = 200 + Math.random() * 300; // distance from center
      const height = -window.innerHeight - Math.random() * 400; // fly upward
      const rx = 720 + Math.random() * 360;
      const ry = 720 + Math.random() * 360;
      msg.style.transform = `translate3d(${Math.cos(angle) * radius}px, ${height}px, ${Math.sin(angle) * radius}px) rotateX(${rx}deg) rotateY(${ry}deg) scale(0.1)`;
      msg.style.opacity = '0';
      msg.style.filter = 'blur(8px)';
    }, index * 50);
  });

  // ---------- 3. Remove messages ----------
  setTimeout(() => {
    messagesDiv.innerHTML = '';
  }, messages.length * 50 + 1500);

  // ---------- 4. Optional: add tornado particle effect in Three.js ----------
  if (typeof THREE !== 'undefined' && scene) {
    for (let i = 0; i < 20; i++) {
      const particle = new THREE.Mesh(
        new THREE.SphereGeometry(0.05, 4, 4),
        new THREE.MeshBasicMaterial({ color: 0xffffff })
      );
      particle.position.set((Math.random() - 0.5) * 5, 0, (Math.random() - 0.5) * 5);
      scene.add(particle);

      let t = 0;
      const animateParticle = () => {
        if (t < 2) {
          const angle = t * 20 + i;
          particle.position.x = Math.cos(angle) * (0.5 + t * 3);
          particle.position.z = Math.sin(angle) * (0.5 + t * 3);
          particle.position.y = t * 5;
          renderer.render(scene, camera);
          t += 0.05;
          requestAnimationFrame(animateParticle);
        } else {
          scene.remove(particle);
        }
      };
      animateParticle();
    }
  }
});
