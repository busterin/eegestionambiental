document.addEventListener("DOMContentLoaded", () => {
  /* ✅ FIX: altura real en móviles (evita corte abajo) */
  function setAppHeightVar() {
    const h = window.innerHeight;
    document.documentElement.style.setProperty("--appH", `${h}px`);
  }
  setAppHeightVar();
  window.addEventListener("resize", setAppHeightVar);
  window.addEventListener("orientationchange", setAppHeightVar);

  // -------------------------
  // ✅ DURACIÓN DE PARTIDA (oculta)
  // -------------------------
  const GAME_DURATION_MS = 5 * 60 * 1000; // 5 minutos
  let gameEndAt = null;
  let gameClockTimer = null;

  // ✅ nunca más de 10 puntos activos a la vez
  const MAX_ACTIVE_POINTS = 10;

  // -------------------------
  // ✅ ETIQUETAS NUEVAS
  // -------------------------
  const TAGS = [
    "Sostenibilidad",
    "Transporte sostenible",
    "Eficiencia energética",
    "Energías renovables",
    "Cambio climático",
    "Reciclaje"
  ];

  // -------------------------
  // ✅ 30 MISIONES NUEVAS (con etiqueta)
  // -------------------------
  const MISSIONS = [
    // Sostenibilidad (5)
    { id: "m1",  title: "Plan de consumo responsable", internalTag: "Sostenibilidad", text: "Define una pauta rápida para reducir consumos innecesarios en el equipo sin frenar la actividad." },
    { id: "m2",  title: "Checklist de compras verdes", internalTag: "Sostenibilidad", text: "Crea un criterio de compra sostenible para materiales y proveedores en 10 minutos." },
    { id: "m3",  title: "Mapa de impactos", internalTag: "Sostenibilidad", text: "Identifica los 3 impactos ambientales principales del día y prioriza acciones." },
    { id: "m4",  title: "Revisión de hábitos", internalTag: "Sostenibilidad", text: "Detecta un hábito poco sostenible y propón una alternativa viable para el equipo." },
    { id: "m5",  title: "Objetivo semanal verde", internalTag: "Sostenibilidad", text: "Define un objetivo ambiental simple y medible para la semana." },

    // Transporte sostenible (5)
    { id: "m6",  title: "Ruta eficiente", internalTag: "Transporte sostenible", text: "Optimiza una ruta para reducir desplazamientos y tiempo total." },
    { id: "m7",  title: "Plan de movilidad compartida", internalTag: "Transporte sostenible", text: "Organiza un sistema de coche compartido para dos trayectos recurrentes." },
    { id: "m8",  title: "Cambio modal", internalTag: "Transporte sostenible", text: "Propón cómo sustituir un trayecto en coche por alternativa más sostenible sin perder operativa." },
    { id: "m9",  title: "Punto de encuentro", internalTag: "Transporte sostenible", text: "Define un punto logístico para agrupar recogidas y reducir viajes duplicados." },
    { id: "m10", title: "Comunicación de movilidad", internalTag: "Transporte sostenible", text: "Redacta un mensaje breve para impulsar movilidad sostenible sin que suene obligatorio." },

    // Eficiencia energética (5)
    { id: "m11", title: "Luces y equipos", internalTag: "Eficiencia energética", text: "Revisa 3 focos de consumo y define acciones inmediatas (apagados, horarios, automatización)." },
    { id: "m12", title: "Modo ahorro", internalTag: "Eficiencia energética", text: "Configura un protocolo rápido de ahorro energético para el cierre del día." },
    { id: "m13", title: "Optimizar climatización", internalTag: "Eficiencia energética", text: "Ajusta el uso de climatización para reducir consumo manteniendo confort básico." },
    { id: "m14", title: "Stand-by cero", internalTag: "Eficiencia energética", text: "Elimina consumos en stand-by en un área y deja un recordatorio visible." },
    { id: "m15", title: "Medición express", internalTag: "Eficiencia energética", text: "Define una métrica sencilla para controlar consumo energético semanal." },

    // Energías renovables (5)
    { id: "m16", title: "Plan solar básico", internalTag: "Energías renovables", text: "Propón un esquema de aprovechamiento solar (aunque sea conceptual) para un espacio." },
    { id: "m17", title: "Divulgación renovable", internalTag: "Energías renovables", text: "Crea una mini explicación clara para que cualquiera entienda por qué apostar por renovables." },
    { id: "m18", title: "Priorizar fuentes limpias", internalTag: "Energías renovables", text: "Decide qué fuentes renovables encajan mejor según uso y contexto del equipo." },
    { id: "m19", title: "Contrato verde", internalTag: "Energías renovables", text: "Prepara un checklist para validar si un suministro es realmente renovable." },
    { id: "m20", title: "Energía para eventos", internalTag: "Energías renovables", text: "Diseña un plan para reducir uso de generadores y favorecer energía limpia en un evento." },

    // Cambio climático (5)
    { id: "m21", title: "Riesgo climático", internalTag: "Cambio climático", text: "Detecta un riesgo climático (calor, lluvia, etc.) y propone un plan de adaptación rápido." },
    { id: "m22", title: "Mensaje de concienciación", internalTag: "Cambio climático", text: "Redacta un mensaje breve que conecte acciones pequeñas con impacto real." },
    { id: "m23", title: "Plan de resiliencia", internalTag: "Cambio climático", text: "Crea 3 medidas para mejorar resiliencia del equipo ante eventos extremos." },
    { id: "m24", title: "Huella rápida", internalTag: "Cambio climático", text: "Identifica 2 actividades que más emiten y una mejora inmediata para cada una." },
    { id: "m25", title: "Compromiso público", internalTag: "Cambio climático", text: "Propón un compromiso simple y comunicable para reducir impacto climático." },

    // Reciclaje (5)
    { id: "m26", title: "Puntos de reciclaje", internalTag: "Reciclaje", text: "Reorganiza puntos de reciclaje para que sean obvios y accesibles en un espacio." },
    { id: "m27", title: "Separación correcta", internalTag: "Reciclaje", text: "Crea una guía visual rápida para evitar errores típicos al separar residuos." },
    { id: "m28", title: "Reducir residuos", internalTag: "Reciclaje", text: "Elige un residuo recurrente y propone sustitución o reducción inmediata." },
    { id: "m29", title: "Reciclaje en evento", internalTag: "Reciclaje", text: "Diseña un mini sistema de recogida y separación de residuos para un evento." },
    { id: "m30", title: "Reutilización creativa", internalTag: "Reciclaje", text: "Propón una forma de reutilizar un material común antes de desecharlo." }
  ];

  // -------------------------
  // ✅ 10 PERSONAJES (2 tags cada uno) + imágenes
  // (Asignación “al azar” pero fija/determinística para no cambiar en cada recarga)
  // -------------------------
  const TEAM_MEMBERS = [
    { id: "p1",  name: "Personaje 1",  img: "images/personaje1.png",  tags: ["Sostenibilidad", "Reciclaje"] },
    { id: "p2",  name: "Personaje 2",  img: "images/personaje2.png",  tags: ["Transporte sostenible", "Cambio climático"] },
    { id: "p3",  name: "Personaje 3",  img: "images/personaje3.png",  tags: ["Eficiencia energética", "Energías renovables"] },
    { id: "p4",  name: "Personaje 4",  img: "images/personaje4.png",  tags: ["Sostenibilidad", "Eficiencia energética"] },
    { id: "p5",  name: "Personaje 5",  img: "images/personaje5.png",  tags: ["Reciclaje", "Cambio climático"] },
    { id: "p6",  name: "Personaje 6",  img: "images/personaje6.png",  tags: ["Transporte sostenible", "Eficiencia energética"] },
    { id: "p7",  name: "Personaje 7",  img: "images/personaje7.png",  tags: ["Energías renovables", "Sostenibilidad"] },
    { id: "p8",  name: "Personaje 8",  img: "images/personaje8.png",  tags: ["Cambio climático", "Energías renovables"] },
    { id: "p9",  name: "Personaje 9",  img: "images/personaje9.png",  tags: ["Reciclaje", "Transporte sostenible"] },
    { id: "p10", name: "Personaje 10", img: "images/personaje10.png", tags: ["Eficiencia energética", "Sostenibilidad"] }
  ];

  // -------------------------
  // Tiempos
  // -------------------------
  const MISSION_LIFETIME_MS = 2 * 60 * 1000;  // rojo antes de perderse
  const EXECUTION_TIME_MS   = 60 * 1000;      // ✅ 1 minuto en amarillo

  // ✅ regla: match suma 80%, no match suma 10%
  const MATCH_ADD = 0.8;
  const NO_MATCH_ADD = 0.1;

  const SCORE_WIN = 1;
  const SCORE_LOSE = 0;

  const SPAWN_MIN_DELAY_MS = 900;
  const SPAWN_MAX_DELAY_MS = 3800;

  // -------------------------
  // DOM
  // -------------------------
  const introScreen = document.getElementById("introScreen");
  const introStartBtn = document.getElementById("introStartBtn");
  const introInfoBtn = document.getElementById("introInfoBtn");
  const infoModal = document.getElementById("infoModal");
  const closeInfoBtn = document.getElementById("closeInfoBtn");

  const startScreen = document.getElementById("startScreen");
  const startBtn = document.getElementById("startBtn");

  const prevAvatarBtn = document.getElementById("prevAvatarBtn");
  const nextAvatarBtn = document.getElementById("nextAvatarBtn");
  const avatarPreviewImg = document.getElementById("avatarPreviewImg");
  const dot0 = document.getElementById("dot0");
  const dot1 = document.getElementById("dot1");

  const teamScreen = document.getElementById("teamScreen");
  const teamGrid = document.getElementById("teamGrid");
  const teamCountEl = document.getElementById("teamCount");
  const teamHint = document.getElementById("teamHint");
  const teamConfirmBtn = document.getElementById("teamConfirmBtn");

  const gameRoot = document.getElementById("gameRoot");
  const mapEl = document.getElementById("map");
  const playerImg = document.getElementById("playerImg");
  const progressEl = document.getElementById("progress");

  const missionModal = document.getElementById("missionModal");
  const missionTitleEl = document.getElementById("missionTitle");
  const missionTextEl = document.getElementById("missionText");
  const closeModalBtn = document.getElementById("closeModalBtn");
  const charactersGrid = document.getElementById("charactersGrid");
  const pickHint = document.getElementById("pickHint");
  const confirmBtn = document.getElementById("confirmBtn");

  const rouletteModal = document.getElementById("rouletteModal");
  const rouletteWheel = document.getElementById("rouletteWheel");
  const rouletteOutcome = document.getElementById("rouletteOutcome");
  const rouletteOkBtn = document.getElementById("rouletteOkBtn");

  const finalModal = document.getElementById("finalModal");
  const finalScoreEl = document.getElementById("finalScore");
  const playAgainBtn = document.getElementById("playAgainBtn");

  const deckBtn = document.getElementById("deckBtn");
  const deckModal = document.getElementById("deckModal");
  const closeDeckBtn = document.getElementById("closeDeckBtn");
  const deckGrid = document.getElementById("deckGrid");

  const cardInfoModal = document.getElementById("cardInfoModal");
  const cardInfoTitle = document.getElementById("cardInfoTitle");
  const cardInfoText = document.getElementById("cardInfoText");
  const closeCardInfoBtn = document.getElementById("closeCardInfoBtn");

  const specialModal = document.getElementById("specialModal");
  const closeSpecialBtn = document.getElementById("closeSpecialBtn");
  const specialCancelBtn = document.getElementById("specialCancelBtn");
  const specialAcceptBtn = document.getElementById("specialAcceptBtn");

  // -------------------------
  // Estado
  // -------------------------
  let score = 0;
  let pendingMissions = [...MISSIONS];
  let activePoints = new Map();
  let completedMissionIds = new Set();
  let lockedCharIds = new Set();

  let currentMissionId = null;
  let selectedCharIds = new Set();

  let lifeTicker = null;
  let spawnTimer = null;
  let noSpawnRect = null;

  // ✅ Equipo (6)
  let selectedTeamIds = new Set();
  let availableCharacters = [];
  let availableCards = [];

  // ✅ Avatares (solo 2) sin nombre
  const AVATARS = [
    { key: "a1", src: "images/avatar1.png", alt: "Avatar 1" },
    { key: "a2", src: "images/avatar2.png", alt: "Avatar 2" }
  ];

  let avatarIndex = 0;
  let specialUsed = false;
  let specialArmed = false;

  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
  const rand = (min, max) => Math.random() * (max - min) + min;
  const randInt = (min, max) => Math.floor(rand(min, max + 1));

  function setScore(delta){ score += delta; }
  function setProgress(){ progressEl.textContent = String(completedMissionIds.size); }

  function showModal(el){ el.classList.add("show"); el.setAttribute("aria-hidden","false"); }
  function hideModal(el){ el.classList.remove("show"); el.setAttribute("aria-hidden","true"); }

  function isAnyModalOpen() {
    return (
      missionModal.classList.contains("show") ||
      rouletteModal.classList.contains("show") ||
      finalModal.classList.contains("show") ||
      deckModal.classList.contains("show") ||
      cardInfoModal.classList.contains("show") ||
      specialModal.classList.contains("show") ||
      infoModal.classList.contains("show")
    );
  }

  function setGlobalPause(paused){
    const now = performance.now();
    for (const st of activePoints.values()){
      st.isPaused = paused;
      st.lastTickAt = now;
    }
  }

  function setSpecialArmedUI(isArmed){
    playerImg.classList.toggle("special-armed", !!isArmed);
  }

  function normalizeTag(tag){
    const t = String(tag || "").trim().toLowerCase();

    // normalización sencilla para evitar acentos / variantes
    if (t.includes("sosten")) return "Sostenibilidad";
    if (t.includes("transporte")) return "Transporte sostenible";
    if (t.includes("eficien")) return "Eficiencia energética";
    if (t.includes("renovable")) return "Energías renovables";
    if (t.includes("clim")) return "Cambio climático";
    if (t.includes("recicl")) return "Reciclaje";

    // fallback
    return tag;
  }

  function computeChance(mission, chosenIds){
    const missionTag = normalizeTag(mission.internalTag);
    let p = 0;

    for (const cid of chosenIds){
      const ch = availableCharacters.find(c => c.id === cid);
      if (!ch) continue;

      const tags = Array.isArray(ch.tags) ? ch.tags : [ch.tags];
      const match = tags.map(normalizeTag).includes(missionTag);
      p += match ? MATCH_ADD : NO_MATCH_ADD;
    }
    return clamp(p, 0, 1);
  }

  function computeNoSpawnRect(){
    const mapRect = mapEl.getBoundingClientRect();
    const imgRect = playerImg.getBoundingClientRect();
    if (!mapRect.width || !imgRect.width) return;

    const margin = 14;
    noSpawnRect = {
      left: (imgRect.left - mapRect.left) - margin,
      top: (imgRect.top - mapRect.top) - margin,
      right: (imgRect.right - mapRect.left) + margin,
      bottom: (imgRect.bottom - mapRect.top) + margin
    };
  }

  function pointWouldOverlapNoSpawn(xPx, yPx){
    if (!noSpawnRect) return false;
    const r = 14;
    const left = xPx - r, right = xPx + r, top = yPx - r, bottom = yPx + r;
    return !(right < noSpawnRect.left || left > noSpawnRect.right || bottom < noSpawnRect.top || top > noSpawnRect.bottom);
  }

  // -------------------------
  // Pantallas
  // -------------------------
  function goToStartScreen(){
    introScreen.classList.add("hidden");
    startScreen.classList.remove("hidden");
    teamScreen.classList.add("hidden");
    gameRoot.classList.add("hidden");
  }

  function goToTeamScreen(){
    startScreen.classList.add("hidden");
    teamScreen.classList.remove("hidden");
    renderTeamSelection();
  }

  // -------------------------
  // Avatar carousel (solo imagen)
  // -------------------------
  function animateCarousel(direction){
    const dx = direction > 0 ? 24 : -24;
    avatarPreviewImg.animate(
      [{ transform: `translateX(${dx}px)`, opacity: 0 }, { transform: "translateX(0px)", opacity: 1 }],
      { duration: 220, easing: "cubic-bezier(.2,.8,.2,1)" }
    );
  }

  function renderAvatarCarousel(direction=0){
    const a = AVATARS[avatarIndex];
    avatarPreviewImg.src = a.src;
    avatarPreviewImg.alt = a.alt;

    dot0?.classList.toggle("active", avatarIndex === 0);
    dot1?.classList.toggle("active", avatarIndex === 1);

    if (direction !== 0) animateCarousel(direction);
  }

  function prevAvatar(){
    avatarIndex = (avatarIndex - 1 + AVATARS.length) % AVATARS.length;
    renderAvatarCarousel(-1);
  }
  function nextAvatar(){
    avatarIndex = (avatarIndex + 1) % AVATARS.length;
    renderAvatarCarousel(+1);
  }

  // -------------------------
  // Equipo (6 de 10) - mostrar etiquetas
  // -------------------------
  function updateTeamUI(){
    const n = selectedTeamIds.size;
    teamCountEl.textContent = String(n);
    teamConfirmBtn.disabled = n !== 6;

    if (n < 6) teamHint.textContent = "Elige 6 personajes para continuar.";
    else teamHint.textContent = "Perfecto. Pulsa Confirmar para empezar.";
  }

  function renderTeamSelection(){
    teamGrid.innerHTML = "";

    TEAM_MEMBERS.forEach(p=>{
      const isSelected = selectedTeamIds.has(p.id);
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "team-card" + (isSelected ? " selected" : "");

      const tag1 = p.tags?.[0] ?? "";
      const tag2 = p.tags?.[1] ?? "";

      btn.innerHTML = `
        <img src="${p.img}" alt="${p.name}" />
        <div class="team-card-name">
          <div class="team-card-row">
            <span>${p.name}</span>
            <span class="pill">${isSelected ? "Elegido" : "Elegir"}</span>
          </div>
          <div class="team-tags" aria-label="Etiquetas">
            <span class="tag-pill">${tag1}</span>
            <span class="tag-pill">${tag2}</span>
          </div>
        </div>
      `;

      btn.addEventListener("click", ()=>{
        if (isSelected) selectedTeamIds.delete(p.id);
        else{
          if (selectedTeamIds.size >= 6) return;
          selectedTeamIds.add(p.id);
        }
        renderTeamSelection();
        updateTeamUI();
      });

      teamGrid.appendChild(btn);
    });

    updateTeamUI();
  }

  function commitTeam(){
    const selected = [...selectedTeamIds]
      .map(id => TEAM_MEMBERS.find(p => p.id === id))
      .filter(Boolean);

    availableCharacters = selected.map(p => ({ id: p.id, name: p.name, tags: p.tags }));
    availableCards = selected.map(p => ({
      id: "card_" + p.id,
      name: p.name,
      img: p.img,
      text: `Etiquetas: ${p.tags.join(" · ")}`
    }));

    if (availableCharacters.length !== 6 || availableCards.length !== 6) return false;
    return true;
  }

  // -------------------------
  // Normalización tamaño sprite mapa (se mantiene)
  // -------------------------
  const spriteBoxCache = new Map();
  let referenceVisibleHeightPx = null;

  async function getSpriteBox(src){
    if (spriteBoxCache.has(src)) return spriteBoxCache.get(src);

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = src;

    await new Promise((res, rej)=>{
      img.onload = () => res();
      img.onerror = () => rej(new Error("No se pudo cargar " + src));
    });

    const hasPngAlpha = /\.png$/i.test(src) || /\.webp$/i.test(src);
    if (!hasPngAlpha){
      const out = { w: img.naturalWidth, h: img.naturalHeight, boxH: img.naturalHeight, boxW: img.naturalWidth };
      spriteBoxCache.set(src, out);
      return out;
    }

    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    ctx.drawImage(img, 0, 0);

    const { data, width, height } = ctx.getImageData(0, 0, canvas.width, canvas.height);

    let minX = width, minY = height, maxX = -1, maxY = -1;
    const A_TH = 16;

    for (let y=0; y<height; y++){
      const row = y * width * 4;
      for (let x=0; x<width; x++){
        const a = data[row + x*4 + 3];
        if (a > A_TH){
          if (x < minX) minX = x;
          if (y < minY) minY = y;
          if (x > maxX) maxX = x;
          if (y > maxY) maxY = y;
        }
      }
    }

    if (maxX < 0 || maxY < 0){
      const out = { w: img.naturalWidth, h: img.naturalHeight, boxH: img.naturalHeight, boxW: img.naturalWidth };
      spriteBoxCache.set(src, out);
      return out;
    }

    const boxW = (maxX - minX + 1);
    const boxH = (maxY - minY + 1);

    const out = { w: img.naturalWidth, h: img.naturalHeight, boxH, boxW };
    spriteBoxCache.set(src, out);
    return out;
  }

  async function applyNormalizedMapSizeFor(src){
    const baseWidthPx = parseFloat(getComputedStyle(playerImg).width) || 120;
    const box = await getSpriteBox(src);

    const visibleHeight = box.boxH * (baseWidthPx / box.w);

    if (referenceVisibleHeightPx == null){
      referenceVisibleHeightPx = visibleHeight;
      playerImg.style.width = "";
      return;
    }

    const neededWidth = referenceVisibleHeightPx * (box.w / box.boxH);
    const clamped = Math.max(baseWidthPx * 0.75, Math.min(neededWidth, baseWidthPx * 1.8));
    playerImg.style.width = `${clamped}px`;
  }

  async function applySelectedAvatarToMap(){
    const a = AVATARS[avatarIndex];
    playerImg.src = a.src;
    playerImg.alt = a.alt;

    playerImg.style.width = "";

    if (playerImg.complete){
      await applyNormalizedMapSizeFor(a.src);
      computeNoSpawnRect();
    } else {
      playerImg.addEventListener("load", async ()=>{
        await applyNormalizedMapSizeFor(a.src);
        computeNoSpawnRect();
      }, { once:true });
    }
  }

  // -------------------------
  // Reloj oculto
  // -------------------------
  function startGameClock(){
    clearInterval(gameClockTimer);
    gameEndAt = performance.now() + GAME_DURATION_MS;

    gameClockTimer = setInterval(()=>{
      const now = performance.now();
      if (now >= gameEndAt) endGameByTime();
    }, 250);
  }

  function endGameByTime(){
    clearInterval(gameClockTimer);
    gameClockTimer = null;

    clearInterval(lifeTicker);
    clearTimeout(spawnTimer);

    rouletteOkBtn.disabled = true;

    hideModal(missionModal);
    hideModal(rouletteModal);
    hideModal(deckModal);
    hideModal(cardInfoModal);
    hideModal(specialModal);

    finishGame();
  }

  // -------------------------
  // Juego
  // -------------------------
  function startGame(){
    teamScreen.classList.add("hidden");
    gameRoot.classList.remove("hidden");

    specialUsed = false;
    specialArmed = false;
    setSpecialArmedUI(false);

    applySelectedAvatarToMap();

    const refreshNoSpawn = () => computeNoSpawnRect();
    if (playerImg.complete) refreshNoSpawn();
    else playerImg.addEventListener("load", refreshNoSpawn, { once:true });

    setProgress();

    startGameClock();
    startLifeTicker();
    scheduleNextSpawn();
  }

  function createMissionPoint(mission){
    const point = document.createElement("div");
    point.className = "point";
    point.setAttribute("role","button");
    point.setAttribute("tabindex","0");
    point.setAttribute("aria-label", `Misión: ${mission.title}`);

    const mapRect = mapEl.getBoundingClientRect();

    let xPct = 50, yPct = 50;
    for (let i=0;i<40;i++){
      xPct = rand(8,92);
      yPct = rand(10,86);
      const xPx = (xPct/100) * mapRect.width;
      const yPx = (yPct/100) * mapRect.height;
      if (!pointWouldOverlapNoSpawn(xPx, yPx)) break;
    }

    point.style.left = `${xPct}%`;
    point.style.top  = `${yPct}%`;

    const state = {
      mission,
      pointEl: point,
      remainingMs: MISSION_LIFETIME_MS,
      lastTickAt: performance.now(),
      phase: "spawned",
      isPaused: false,
      assignedCharIds: new Set(),
      chance: null,
      execRemainingMs: null
    };

    point.addEventListener("click", ()=>onPointClick(mission.id));
    point.addEventListener("keydown",(e)=>{
      if (e.key==="Enter" || e.key===" "){
        e.preventDefault();
        onPointClick(mission.id);
      }
    });

    mapEl.appendChild(point);
    activePoints.set(mission.id, state);
  }

  function onPointClick(missionId){
    const st = activePoints.get(missionId);
    if (!st) return;
    if (completedMissionIds.has(missionId)) return;

    if (specialArmed && !specialUsed){
      specialUsed = true;
      specialArmed = false;
      setSpecialArmedUI(false);
      openForcedWinRoulette(missionId);
      return;
    }

    if (st.phase === "spawned") return openMission(missionId);
    if (st.phase === "executing") return;
    if (st.phase === "ready") return openRouletteForMission(missionId);
  }

  function removePoint(missionId){
    const st = activePoints.get(missionId);
    if (!st) return;
    st.pointEl?.parentNode?.removeChild(st.pointEl);
    activePoints.delete(missionId);
  }

  function releaseCharsForMission(missionId){
    const st = activePoints.get(missionId);
    if (!st) return;
    for (const cid of (st.assignedCharIds || [])) lockedCharIds.delete(cid);
  }

  function failMission(missionId){
    if (completedMissionIds.has(missionId)) return;
    completedMissionIds.add(missionId);
    setProgress();
    setScore(SCORE_LOSE);
    releaseCharsForMission(missionId);
    removePoint(missionId);
  }

  function winMission(missionId){
    if (completedMissionIds.has(missionId)) return;
    completedMissionIds.add(missionId);
    setProgress();
    setScore(SCORE_WIN);
    releaseCharsForMission(missionId);
    removePoint(missionId);
  }

  function scheduleNextSpawn(){
    clearTimeout(spawnTimer);
    if (gameClockTimer === null) return;

    if (activePoints.size >= MAX_ACTIVE_POINTS){
      spawnTimer = setTimeout(()=>scheduleNextSpawn(), 800);
      return;
    }

    if (pendingMissions.length === 0) pendingMissions = [...MISSIONS];

    spawnTimer = setTimeout(()=>{
      if (gameClockTimer === null) return;
      if (activePoints.size >= MAX_ACTIVE_POINTS){ scheduleNextSpawn(); return; }

      const idx = randInt(0, pendingMissions.length - 1);
      const mission = pendingMissions.splice(idx, 1)[0];
      createMissionPoint(mission);
      scheduleNextSpawn();
    }, randInt(SPAWN_MIN_DELAY_MS, SPAWN_MAX_DELAY_MS));
  }

  function startLifeTicker(){
    clearInterval(lifeTicker);

    lifeTicker = setInterval(()=>{
      const now = performance.now();

      for (const [mid, st] of activePoints.entries()){
        if (st.isPaused){ st.lastTickAt = now; continue; }
        const dt = now - st.lastTickAt;
        st.lastTickAt = now;

        if (st.phase === "spawned"){
          st.remainingMs -= dt;
          if (st.remainingMs <= 0) failMission(mid);
          continue;
        }

        if (st.phase === "executing"){
          st.execRemainingMs -= dt;
          if (st.execRemainingMs <= 0){
            st.phase = "ready";
            st.execRemainingMs = 0;
            st.pointEl.classList.remove("assigned");
            st.pointEl.classList.add("ready");
          }
        }
      }
    }, 200);
  }

  function openMission(missionId){
    const st = activePoints.get(missionId);
    if (!st) return;

    setGlobalPause(true);
    currentMissionId = missionId;
    selectedCharIds = new Set();

    missionTitleEl.textContent = st.mission.title;
    missionTextEl.textContent  = st.mission.text;

    pickHint.textContent = "Selecciona al menos 1 personaje (máximo 2).";
    pickHint.style.opacity = "1";

    renderCharacters();
    showModal(missionModal);
  }

  function closeMissionModal(){
    hideModal(missionModal);
    currentMissionId = null;
    selectedCharIds = new Set();
    if (!isAnyModalOpen()) setGlobalPause(false);
  }

  function renderCharacters(){
    charactersGrid.innerHTML = "";

    availableCharacters.forEach(ch=>{
      const locked = lockedCharIds.has(ch.id);
      const card = document.createElement("div");
      card.className = "char" + (locked ? " locked" : "");
      card.innerHTML = `
        <div><div class="name">${ch.name}</div></div>
        <div class="pill">${locked ? "Ocupado" : "Elegir"}</div>
      `;
      card.addEventListener("click", ()=>{
        if (locked){
          pickHint.textContent = "Ese personaje está ocupado en otra misión.";
          pickHint.style.opacity = "1";
          return;
        }
        toggleCharacter(ch.id, card);
      });
      charactersGrid.appendChild(card);
    });
  }

  function toggleCharacter(charId, cardEl){
    if (selectedCharIds.has(charId)){
      selectedCharIds.delete(charId);
      cardEl.classList.remove("selected");
      cardEl.querySelector(".pill").textContent = "Elegir";
    } else {
      if (selectedCharIds.size >= 2){
        pickHint.textContent = "Máximo 2 personajes por misión.";
        pickHint.style.opacity = "1";
        return;
      }
      selectedCharIds.add(charId);
      cardEl.classList.add("selected");
      cardEl.querySelector(".pill").textContent = "Elegido";
    }
  }

  function confirmMission(){
    const st = currentMissionId ? activePoints.get(currentMissionId) : null;
    if (!st) return;

    if (selectedCharIds.size < 1){
      pickHint.textContent = "Debes seleccionar al menos 1 personaje.";
      pickHint.style.opacity = "1";
      return;
    }

    st.assignedCharIds = new Set(selectedCharIds);
    st.chance = computeChance(st.mission, st.assignedCharIds);

    for (const cid of st.assignedCharIds) lockedCharIds.add(cid);

    st.phase = "executing";
    st.execRemainingMs = EXECUTION_TIME_MS;
    st.lastTickAt = performance.now();
    st.pointEl.classList.add("assigned");
    st.pointEl.classList.remove("ready");

    hideModal(missionModal);
    currentMissionId = null;
    selectedCharIds = new Set();
    if (!isAnyModalOpen()) setGlobalPause(false);
  }

  function spinRoulette(chance, onDone, forcedWin=null){
    rouletteOutcome.textContent = "";
    rouletteOkBtn.disabled = true;

    const greenPct = clamp(chance, 0.01, 1) * 100;
    rouletteWheel.style.background = `conic-gradient(from 0deg,
      rgba(46,229,157,.85) 0 ${greenPct}%,
      rgba(255,59,59,.85) ${greenPct}% 100%)`;

    const turns = randInt(4,7);
    const finalDeg = turns * 360 + randInt(0,359);

    rouletteWheel.animate(
      [{ transform:"rotate(0deg)" }, { transform:`rotate(${finalDeg}deg)` }],
      { duration:1400, easing:"cubic-bezier(.2,.8,.2,1)", fill:"forwards" }
    );

    setTimeout(()=>{
      const win = (forcedWin === null) ? (Math.random() < chance) : forcedWin;
      rouletteOutcome.textContent = win ? "✅ ¡Éxito!" : "❌ Fallo";
      rouletteOutcome.style.color = win ? "var(--ok)" : "var(--danger)";
      rouletteOkBtn.disabled = false;
      onDone(win);
    }, 1500);
  }

  function openRouletteForMission(missionId){
    const st = activePoints.get(missionId);
    if (!st || st.phase !== "ready") return;

    setGlobalPause(true);
    showModal(rouletteModal);

    spinRoulette(st.chance ?? 0.10, (win)=>{
      rouletteOkBtn.onclick = ()=>{
        hideModal(rouletteModal);
        win ? winMission(missionId) : failMission(missionId);
        rouletteOkBtn.disabled = true;
        if (!isAnyModalOpen()) setGlobalPause(false);
      };
    });
  }

  function openForcedWinRoulette(missionId){
    const st = activePoints.get(missionId);
    if (!st) return;

    setGlobalPause(true);
    showModal(rouletteModal);

    spinRoulette(1, ()=>{
      rouletteOkBtn.onclick = ()=>{
        hideModal(rouletteModal);
        winMission(missionId);
        rouletteOkBtn.disabled = true;
        if (!isAnyModalOpen()) setGlobalPause(false);
      };
    }, true);
  }

  function openCardInfo(cardData){
    setGlobalPause(true);
    cardInfoTitle.textContent = cardData.name;
    cardInfoText.textContent = cardData.text;
    showModal(cardInfoModal);
  }
  function closeCardInfo(){
    hideModal(cardInfoModal);
    if (!isAnyModalOpen()) setGlobalPause(false);
  }

  function openDeck(){
    setGlobalPause(true);
    deckGrid.innerHTML = "";

    availableCards.forEach(cardData=>{
      const card = document.createElement("button");
      card.type = "button";
      card.className = "deck-card";
      card.innerHTML = `
        <img src="${cardData.img}" alt="${cardData.name}" />
        <div class="deck-card-name">
          <span>${cardData.name}</span>
          <span class="pill">Ver</span>
        </div>
      `;
      card.addEventListener("click", ()=>openCardInfo(cardData));
      deckGrid.appendChild(card);
    });

    showModal(deckModal);
  }

  function closeDeck(){
    hideModal(deckModal);
    if (!isAnyModalOpen()) setGlobalPause(false);
  }

  function openSpecialModal(){
    if (specialUsed) return;
    setGlobalPause(true);
    showModal(specialModal);
  }

  function cancelSpecial(){
    specialArmed = false;
    setSpecialArmedUI(false);
    hideModal(specialModal);
    if (!isAnyModalOpen()) setGlobalPause(false);
  }

  function acceptSpecial(){
    if (specialUsed) return;
    specialArmed = true;
    setSpecialArmedUI(true);
    hideModal(specialModal);
    if (!isAnyModalOpen()) setGlobalPause(false);
  }

  function finishGame(){
    clearInterval(lifeTicker);
    clearTimeout(spawnTimer);
    clearInterval(gameClockTimer);
    gameClockTimer = null;

    finalScoreEl.textContent = String(score);
    setGlobalPause(true);
    showModal(finalModal);
  }

  function resetGame(){
    hideModal(missionModal);
    hideModal(rouletteModal);
    hideModal(finalModal);
    hideModal(deckModal);
    hideModal(cardInfoModal);
    hideModal(specialModal);
    hideModal(infoModal);

    clearInterval(lifeTicker);
    clearTimeout(spawnTimer);
    clearInterval(gameClockTimer);
    gameClockTimer = null;

    for (const st of activePoints.values()){
      st.pointEl?.parentNode?.removeChild(st.pointEl);
    }

    score = 0;
    pendingMissions = [...MISSIONS];
    activePoints = new Map();
    completedMissionIds = new Set();
    lockedCharIds = new Set();

    currentMissionId = null;
    selectedCharIds = new Set();

    specialUsed = false;
    specialArmed = false;
    setSpecialArmedUI(false);

    setProgress();
    setGlobalPause(false);
  }

  // -------------------------
  // EVENTS
  // -------------------------
  introStartBtn.addEventListener("click", goToStartScreen);

  // Info modal
  introInfoBtn?.addEventListener("click", ()=>showModal(infoModal));
  closeInfoBtn?.addEventListener("click", ()=>hideModal(infoModal));
  infoModal?.addEventListener("click", (e)=>{ if (e.target === infoModal) hideModal(infoModal); });

  prevAvatarBtn.addEventListener("click", prevAvatar);
  nextAvatarBtn.addEventListener("click", nextAvatar);

  document.addEventListener("keydown", (e)=>{
    if (!introScreen.classList.contains("hidden")){
      if (e.key === "Enter") goToStartScreen();
      return;
    }
    if (!startScreen.classList.contains("hidden")){
      if (e.key === "ArrowLeft") prevAvatar();
      if (e.key === "ArrowRight") nextAvatar();
    }
  });

  // Avatar -> Team
  startBtn.addEventListener("click", ()=>{
    selectedTeamIds = new Set();
    teamConfirmBtn.disabled = true;
    teamCountEl.textContent = "0";
    teamHint.textContent = "Elige 6 personajes para continuar.";
    goToTeamScreen();
  });

  // Confirm team -> Start game
  teamConfirmBtn.addEventListener("click", ()=>{
    if (selectedTeamIds.size !== 6) return;
    if (!commitTeam()) return;
    startGame();
  });

  // Habilidad avatar
  playerImg.addEventListener("click", openSpecialModal);

  closeModalBtn.addEventListener("click", closeMissionModal);
  missionModal.addEventListener("click", (e)=>{ if (e.target === missionModal) closeMissionModal(); });
  confirmBtn.addEventListener("click", confirmMission);

  deckBtn.addEventListener("click", openDeck);
  closeDeckBtn.addEventListener("click", closeDeck);
  deckModal.addEventListener("click", (e)=>{ if (e.target === deckModal) closeDeck(); });

  closeCardInfoBtn.addEventListener("click", closeCardInfo);
  cardInfoModal.addEventListener("click", (e)=>{ if (e.target === cardInfoModal) closeCardInfo(); });

  closeSpecialBtn.addEventListener("click", cancelSpecial);
  specialCancelBtn.addEventListener("click", cancelSpecial);
  specialAcceptBtn.addEventListener("click", acceptSpecial);
  specialModal.addEventListener("click", (e)=>{ if (e.target === specialModal) cancelSpecial(); });

  playAgainBtn.addEventListener("click", ()=>{
    resetGame();
    gameRoot.classList.add("hidden");
    introScreen.classList.remove("hidden");
    startScreen.classList.add("hidden");
    teamScreen.classList.add("hidden");
    avatarIndex = 0;
    renderAvatarCarousel(0);
  });

  window.addEventListener("resize", ()=>{
    setAppHeightVar();
    if (!gameRoot.classList.contains("hidden")) computeNoSpawnRect();
  });

  // init
  renderAvatarCarousel(0);

  // referencia tamaño sprite
  if (playerImg?.getAttribute("src")){
    const src = playerImg.getAttribute("src");
    playerImg.addEventListener("load", async ()=>{
      try{
        referenceVisibleHeightPx = null;
        await applyNormalizedMapSizeFor(src);
      } catch {}
    }, { once:true });
  }
});
