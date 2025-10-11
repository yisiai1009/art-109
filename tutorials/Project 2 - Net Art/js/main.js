/* =========================
   Mood Buttons · Main JS
   ========================= */

// DOM
var currentMoodEl = document.getElementById('current-mood');
var moodLinkEl    = document.getElementById('mood-link');
var copyBtn       = document.getElementById('copy-link');
var emojiGrid     = document.getElementById('emoji-grid');
var wordGrid      = document.getElementById('word-grid');
var burstLayer    = document.getElementById('burst-layer');
var rainLayer     = document.getElementById('rain-layer');

var REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Moods */
var MOODS = { happy:'happy', sad:'sad', angry:'angry', sleepy:'sleepy' };

function setMood(moodKey) {
  if (!MOODS[moodKey]) return;
  document.body.classList.remove('mood-happy','mood-sad','mood-angry','mood-sleepy');
  document.body.classList.add('mood-' + moodKey);
  currentMoodEl.textContent = moodKey;

  // Shareable URL
  var url = new URL(window.location.href);
  url.searchParams.set('mood', moodKey);
  window.history.replaceState({}, '', url);
  moodLinkEl.textContent = url.toString();
}

// Init from URL
(function initMoodFromURL(){
  var params = new URLSearchParams(window.location.search);
  var initial = params.get('mood');
  if (initial && MOODS[initial]) setMood(initial);
})();

// Bind mood buttons
document.querySelectorAll('.mood-btn').forEach(function(btn){
  btn.addEventListener('click', function(){
    var moodKey = btn.getAttribute('data-mood');
    setMood(moodKey);
    var r = btn.getBoundingClientRect();
    burstAt(r.left + r.width/2, r.top + r.height/2, moodKey);
  });
});

/* =========================
   Surprise Emoji Rain THEMES (defined early)
   ========================= */
var RAIN_THEMES = {
  // Birthday
  '🎂': ['🎂','🎉','🎈','🎁','🧁','🍰','🥳'],
  '🎉': ['🎉','🎊','🎈','🎁','✨','💫'],
  '🎈': ['🎈','🎉','🎊','✨'],
  // Wedding
  '💒': ['💒','💍','👰‍♀️','🤵‍♂️','💖','💐','🥂'],
  '💍': ['💍','💒','💖','👰‍♀️','🤵‍♂️','🥂'],
  '👰‍♀️': ['👰‍♀️','🤵‍♂️','💍','💒','💐','💞'],
  '🤵‍♂️': ['🤵‍♂️','👰‍♀️','💍','💒','💐','💞'],
  // Seasonal
  '🎃': ['🎃','🕸️','🕷️','🍬','🧙‍♀️','🌕'],
  '🎄': ['🎄','🎁','✨','⭐️','🕯️','⛄️']
};

/* =========================
   Emoji Data (groups used for word-buttons)
   ========================= */
// (kept from your previous reduced lists)
var CAT_food = [
  '🍴','🍽️','🥢','🍚','🍜','🍲','🍛','🍝','🍣','🍤','🥟',
  '🍔','🍟','🍕','🌭','🥪','🌮','🌯','🥨','🍿','🍗','🥩','🍖',
  '🍦','🍧','🍨','🍩','🍪','🎂','🧁','🍫','🍬','🍭','🥛','🍺','🍷','🥤','☕️'
];
var CAT_party = [
  '🎉','🎊','🎈','🎁','🎀','🥳','🎂','🍾','🥂','👑','🎄','🎃','🎆','🎇','💒','💍'
];
var CAT_emotions = [
  '😊','😄','😍','🤩','🥰','😂','❤️','💖','😢','😭','😤','😠','💔',
  '😜','😏','🤪','😅','😂','😴','🥱','😫','🤒','🤧','😮','😲','😳','😱'
];
var CAT_animals = [
  '🐶','🐱','🐰','🦊','🐻','🐼','🐨','🐯','🦁','🐮','🐷','🐸',
  '🐦','🐤','🐥','🦆','🐝','🦋','🐞',
  '🐠','🐟','🐬','🦈','🐳','🐙',
  '🌹','🌸','💐','🌷','🍀','🌲','🎄','🌵',
  '☀️','🌤️','⛅️','🌧️','⛈️','🌈','🌊','🏔️'
];
var CAT_travel = [
  '🚗','🚕','🚌','🏎️','🚑','🚲','🛵','🚄','✈️','🚀','🛶','⛵️',
  '🗽','🎡','🎢','🏯','🏰','⛩️','🗿','🗺️','🧭','📍'
];
var CAT_activities = [
  '⚽️','🏀','🏈','⚾️','🎾','🏐','🎱',
  '🏊‍♂️','🚴‍♀️','🏄‍♂️','⛷️','🏂','🛹','🎿',
  '🏆','🎖️','🥇','🥈','🥉',
  '🎤','🎧','🎼','🎹','🥁','🎨','🎭'
];
var CAT_objects = [
  '📱','💻','📷','💡', '📚','📝','✏️','📎', '🛏️','🛁','🪑', '👑','👓','🕶️','🎒'
];
var CAT_symbols = [
  '❤️','💙','💜','🤍','💔', '🔴','🟡','🟢','🔵','🟣','♦️','♠️', '✅','❌','➡️','⭕️','🚫'
];
var CAT_people = [
  '👶','🧒','👨','👩','👵', '👮‍♀️','👷‍♂️','👨‍⚕️','👩‍🍳','👰‍♀️','🤵‍♂️', '👋','👌','👍','👀','💪'
];

/* SPECIAL: only show the rainy/surprise set in "Tap Any Emoji" */
var ALL_EMOJIS = ['🎂','🎉','🎈','💒','💍','👰‍♀️','🤵‍♂️','🎃','🎄'];

/* Word groups for the lower buttons */
var WORD_GROUPS = [
  { key:'people',     label:'😃💁 People',     emojis: CAT_people },
  { key:'animals',    label:'🐻🌻 Animals',    emojis: CAT_animals },
  { key:'food',       label:'🍔🍹 Food',       emojis: CAT_food },
  { key:'activities', label:'🎷⚽️ Activities', emojis: CAT_activities },
  { key:'travel',     label:'🚘🌇 Travel',     emojis: CAT_travel },
  { key:'objects',    label:'💡🎉 Objects',    emojis: CAT_objects },
  { key:'symbols',    label:'💖🔣 Symbols',    emojis: CAT_symbols },
  { key:'flags',      label:'🎌🏳️‍🌈 Flags',   emojis: ['🏳️','🏴','🏁','🚩','🏳️‍🌈','🏳️‍⚧️','🇺🇸','🇨🇳','🇯🇵','🇰🇷','🇫🇷','🇩🇪','🇬🇧','🇮🇹','🇪🇸','🇨🇦','🇲🇽'] }
];

/* =========================
   Build UI
   ========================= */
function makeEmojiButton(char) {
  var b = document.createElement('button');
  b.className = 'emoji-btn';
  if (RAIN_THEMES[char]) b.classList.add('rainy'); // highlight rainy ones
  b.type = 'button';
  b.textContent = char;
  b.title = RAIN_THEMES[char] ? '💧 This emoji triggers rain!' : 'Click for fireworks';
  b.addEventListener('click', function(){
    var r = b.getBoundingClientRect();
    burstAt(r.left + r.width/2, r.top + r.height/2, currentMoodOrDefault());
    maybeRain(char);
  });
  return b;
}

function buildEmojiGrid() {
  ALL_EMOJIS.forEach(function(em){ emojiGrid.appendChild(makeEmojiButton(em)); });
}
function buildWordGrid() {
  WORD_GROUPS.forEach(function(g){
    var b = document.createElement('button');
    b.className = 'word-btn';
    b.type = 'button';
    b.textContent = g.label;
    b.addEventListener('click', function(){
      var cx = window.innerWidth / 2;
      var cy = window.innerHeight / 2;
      burstFromSet(cx, cy, g.emojis);
    });
    wordGrid.appendChild(b);
  });
}
buildEmojiGrid();
buildWordGrid();

function currentMoodOrDefault(){
  var params = new URLSearchParams(window.location.search);
  return params.get('mood') || 'happy';
}

/* =========================
   Firework Burst (DOM + CSS)
   ========================= */
var MOOD_EMOJI_SET = {
  happy: ['😃','✨','🌟','🟡','💫'],
  sad:   ['😢','💧','🫧','🔵','🥲'],
  angry: ['😡','💢','🔥','🟥','⚡️'],
  sleepy:['😴','💤','🌙','⭐️','🟣']
};

function burstAt(x, y, moodKey) {
  var set = MOOD_EMOJI_SET[moodKey] || ['✨'];
  var count = REDUCED ? 10 : 18;
  for (var i = 0; i < count; i++) {
    var el = document.createElement('span');
    el.className = 'particle';
    el.textContent = set[i % set.length];

    var angle = (Math.PI * 2) * (i / count) + (Math.random() * 0.6 - 0.3);
    var power = (REDUCED ? 60 : 120) * (0.6 + Math.random() * 0.8);
    var tx = Math.cos(angle) * power;
    var ty = Math.sin(angle) * power;
    var scale = (0.8 + Math.random() * 0.8).toFixed(2);

    el.style.left = (x - 12) + 'px';
    el.style.top  = (y - 12) + 'px';
    el.style.setProperty('--tx', 'translateX(' + tx.toFixed(2) + 'px)');
    el.style.setProperty('--ty', ' translateY(' + ty.toFixed(2) + 'px)');
    el.style.setProperty('--scale', scale);

    burstLayer.appendChild(el);
    el.addEventListener('animationend', function(){
      if (this && this.parentNode) this.parentNode.removeChild(this);
    });
  }
}
function burstFromSet(x, y, set) {
  var count = REDUCED ? 12 : 22;
  for (var i = 0; i < count; i++) {
    var el = document.createElement('span');
    el.className = 'particle';
    el.textContent = set[i % set.length];

    var angle = (Math.PI * 2) * (i / count) + (Math.random() * 0.8 - 0.4);
    var power = (REDUCED ? 60 : 130) * (0.6 + Math.random() * 1.0);
    var tx = Math.cos(angle) * power;
    var ty = Math.sin(angle) * power;
    var scale = (0.9 + Math.random() * 0.9).toFixed(2);

    el.style.left = (x - 12) + 'px';
    el.style.top  = (y - 12) + 'px';
    el.style.setProperty('--tx', 'translateX(' + tx.toFixed(2) + 'px)');
    el.style.setProperty('--ty', ' translateY(' + ty.toFixed(2) + 'px)');
    el.style.setProperty('--scale', scale);

    burstLayer.appendChild(el);
    el.addEventListener('animationend', function(){
      if (this && this.parentNode) this.parentNode.removeChild(this);
    });
  }
}

/* =========================
   Emoji Rain
   ========================= */
function maybeRain(emoji) {
  if (!RAIN_THEMES[emoji]) return;
  emojiRain(RAIN_THEMES[emoji], REDUCED ? 40 : 90, 2000);
}
function emojiRain(set, drops, durationMs) {
  if (!rainLayer) return;
  for (var i = 0; i < drops; i++) {
    var d = document.createElement('span');
    d.className = 'raindrop';
    d.textContent = set[i % set.length];

    var x = Math.random() * (window.innerWidth - 40);
    var size = (Math.random() * 1.6 + 1.4).toFixed(2) + 'rem';
    d.style.left = x + 'px';
    d.style.setProperty('--size', size);
    d.style.animationDelay = (Math.random() * 0.8) + 's';

    rainLayer.appendChild(d);
    (function(node){
      setTimeout(function(){
        if (node && node.parentNode) node.parentNode.removeChild(node);
      }, durationMs + 2000);
    })(d);
  }
}

/* =========================
   Copy link
   ========================= */
if (copyBtn) {
  copyBtn.addEventListener('click', function(){
    var text = moodLinkEl.textContent || window.location.href;
    if (!navigator.clipboard) { alert('Copy not supported. Please copy the URL manually.'); return; }
    navigator.clipboard.writeText(text).then(function(){
      copyBtn.textContent = 'Copied!';
      setTimeout(function(){ copyBtn.textContent = 'Copy link'; }, 900);
    });
  });
}

/* =========================
   Background click = burst
   ========================= */
document.addEventListener('click', function(e){
  var isBtn = e.target.closest('.mood-btn, .emoji-btn, .word-btn, .btn, a');
  if (isBtn) return;
  burstAt(e.clientX, e.clientY, currentMoodOrDefault());
});
