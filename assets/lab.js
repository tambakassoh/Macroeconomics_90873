/* Shared study-lab engine. Each lecture page loads this, then its own content.js, then calls initLab({...}). */
/* ================= storage ================= */
let KEY = "lab";
const blank = () => ({ step:-1, last:0, seen:{}, done:{}, first:{}, known:[], missed:{}, rounds:{}, write:{}, drafts:{} });
let S = blank();
let GLOSS = {};
let CFG = {};
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch(e) {} };

const $ = s => document.querySelector(s);
const h = (tag, cls, html) => { const n = document.createElement(tag); if (cls) n.className = cls; if (html !== undefined) n.innerHTML = html; return n; };
const shuffle = a => { a = a.slice(); for (let i = a.length-1; i > 0; i--) { const j = Math.floor(Math.random()*(i+1)); [a[i],a[j]] = [a[j],a[i]]; } return a; };
const $$ = v => "$" + (+v).toLocaleString("en-US", {minimumFractionDigits: (+v) % 1 ? 2 : 0, maximumFractionDigits:2});
const RM = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const tn = (lec, now) => `<div class="thennow"><div><b>📘 In the lecture</b>${lec}</div><div><b>🕒 Today</b>${now}</div></div>`;
const g = (term, label) => `<button type="button" class="gl" data-g="${term}">${label || term.toLowerCase()}</button>`;
function lessonListHTML(){
  return `<div class="lessonlist"><a class="hubrow only-mobile" href="${CFG.hub}">← All lectures</a><button type="button" data-l="-1" class="${S.step < 0 ? "cur" : ""}"><span class="dot done" style="background:var(--gold)"></span>Lab home</button>` +
    STEPS.map((s,i) => `<button type="button" data-l="${i}" class="${i === S.step ? "cur" : ""}"><span class="dot ${S.done[i] ? "done" : S.seen[i] ? "seen" : ""}"></span>${i+1}. ${s.title}</button>`).join("") + `</div>`;
}
function bindLessonList(root){ root.querySelectorAll("[data-l]").forEach(b => b.onclick = () => { S.step = +b.dataset.l; save(); closeSheet(); go("lab"); }); }
function renderSideLessons(){ const el = $("#sidelessons"); el.innerHTML = `<h4>Lessons</h4>` + lessonListHTML(); bindLessonList(el); }
function openLessons(){
  $("#sheet-t").textContent = "Lessons"; $("#sheet-d").innerHTML = lessonListHTML(); $("#sheet-e").textContent = ""; $("#sheet-n").textContent = "";
  bindLessonList($("#sheet-d"));
  $("#sheet-bg").style.display = "block"; requestAnimationFrame(() => $("#sheet").classList.add("on")); $("#sheet-x").focus();
}
function openSheet(term){
  const c = GLOSS[term]; if (!c) return;
  $("#sheet-t").textContent = c[0]; $("#sheet-d").textContent = c[1]; $("#sheet-e").textContent = "Example: " + c[2]; $("#sheet-n").textContent = CNOTE[c[0]] || "";
  $("#sheet-bg").style.display = "block"; requestAnimationFrame(() => $("#sheet").classList.add("on")); $("#sheet-x").focus();
}
function closeSheet(){ $("#sheet").classList.remove("on"); $("#sheet-bg").style.display = "none"; }
const modelNote = item => (TB.has(item.id) ? `<span class="todaynote"><span class="modeltag">📘 Textbook model, as in the lecture</span></span>` : "") + (TODAY[item.id] ? `<span class="todaynote">🕒 Today: ${TODAY[item.id]}</span>` : "");
function teachQ(parent, item, mode, onDone){
  const box = h("div","q"); box.appendChild(h("p","",item.q));
  const opts = h("div","opts"); const fb = h("div","fb");
  let order = shuffle(item.o.map((_,i) => i));
  let tries = 0, finished = false;
  const finish = (firstOk, revealed) => { finished = true; opts.querySelectorAll(".opt").forEach(x => x.disabled = true); onDone && onDone(firstOk, revealed); };
  order.forEach(i => {
    const [text, why] = item.o[i];
    const b = h("button","opt",text); b.type = "button";
    b.onclick = () => {
      if (finished) return;
      const ok = i === item.a; tries++;
      if (tries === 1 && !item.gen){ S.first[item.id] = ok; if (!ok) S.missed[item.id] = 1; save(); }
      if (ok){
        b.classList.add("right");
        fb.innerHTML = `<div class="why"><b class="ok">${tries === 1 ? "Correct." : "You got there."}</b> ${why}<span class="more">${item.more}</span>${modelNote(item)}</div>`;
        finish(tries === 1, false);
      } else {
        b.classList.add("wrong"); b.disabled = true;
        fb.innerHTML = `<div class="why"><b class="no">Not quite.</b> ${why}</div>` +
          `<div class="hint"><b>${tries === 1 ? "Hint" : "Another way in"}:</b> ${tries === 1 ? item.hint : "Rule out the choices you now know are wrong, then look back at this lesson’s picture. " + item.hint}</div>` +
          `<p class="muted small" style="margin:6px 0 0">Have another go. Mistakes are part of learning here.</p>`;
        if (tries >= 2){
          const rv = h("button","linkbtn","Show me the answer and why"); rv.type = "button";
          rv.onclick = () => {
            [...opts.children][order.indexOf(item.a)].classList.add("right");
            fb.innerHTML = `<div class="why"><b>The answer is “${item.o[item.a][0]}”.</b> ${item.o[item.a][1]}<span class="more">${item.more}</span>${modelNote(item)}</div><p class="muted small" style="margin:6px 0 0">It’s in your Review deck, so you can come back to it later.</p>`;
            finish(false, true);
          };
          fb.appendChild(rv);
        }
      }
    };
    opts.appendChild(b);
  });
  box.append(opts, fb); parent.appendChild(box);
}

/* ================= generic stepper ================= */
function stepper(el, cfg){
  el.innerHTML = `<div class="figt">${cfg.title}</div>${cfg.sub ? `<p class="figsub">${cfg.sub}</p>` : ""}${cfg.top || ""}<div class="stage"></div><p class="cap" aria-live="polite"></p>
    <div class="stepnav"><button type="button" class="btn ghost sb">Back</button><span class="sdots"></span><button type="button" class="btn sn">Next</button></div>`;
  const stage = el.querySelector(".stage"), cap = el.querySelector(".cap"), back = el.querySelector(".sb"), next = el.querySelector(".sn"), dots = el.querySelector(".sdots");
  let i = 0;
  const upd = () => {
    const n = cfg.n();
    cap.innerHTML = cfg.draw(i, stage);
    back.disabled = i === 0; next.textContent = i === n-1 ? "Replay" : "Next";
    dots.innerHTML = Array.from({length:n}, (_,k) => `<i class="${k===i ? "on" : ""}"></i>`).join("");
  };
  back.onclick = () => { if (i > 0){ i--; upd(); } };
  next.onclick = () => { i = i === cfg.n()-1 ? 0 : i+1; upd(); };
  upd();
  return { reset(){ i = 0; upd(); } };
}

function renderLab(){
  const v = $("#v-lab"); v.innerHTML = "";
  setTimeout(renderSideLessons, 0);
  const doneN = Object.keys(S.done).length;
  if (S.step < 0){
    v.innerHTML = `<h1>${CFG.title}</h1><p class="muted">${CFG.subtitle}</p>
      <p>This is a practice space, not a test. Explore, make mistakes, and every answer will explain itself.</p>
      <div class="startcard"><b style="font-family:var(--serif)">Your path through the lab</b>
        <ol class="flowlist">
          <li><b>Learn.</b> Read and explore ${STEPS.length} short animated lessons.</li>
          <li><b>Practice.</b> Try the questions and play with the models. Retry as often as you like.</li>
          <li><b>Review.</b> Flashcards for terms, plus every question you missed.</li>
          <li><b>Self-check.</b> Quiz rounds and short written answers like your professor’s.</li>
          <li><b>Reflect.</b> See your strengths and what to study next.</li>
        </ol>
        <p class="muted small" style="margin:10px 0 0">Go in any order. Progress saves on this device only.</p></div>
      ${CFG.thenNow === false ? "" : `<div class="thennow" style="margin-bottom:16px"><div><b>📘 In the lecture</b>Look for these boxes.</div><div><b>🕒 Today</b>They show where today’s Fed works differently. For quizzes, use the lecture’s version.</div></div>`}`;
    const b = h("button","btn", Object.keys(S.seen).length ? "Continue where I left off" : "Start lesson 1"); b.type = "button";
    b.onclick = () => { S.step = Math.max(0, Math.min(S.last || 0, STEPS.length-1)); save(); renderLab(); window.scrollTo(0,0); };
    v.appendChild(b);
    const list = h("div","rounds");
    STEPS.forEach((s, i) => {
      const st = S.done[i] ? "Practiced" : S.seen[i] ? "Visited" : "";
      const r = h("button","round",`<span><b>${i+1}. ${s.title}</b></span><span class="score">${st}</span>`); r.type = "button";
      r.onclick = () => { S.step = i; save(); renderLab(); window.scrollTo(0,0); };
      list.appendChild(r);
    });
    v.appendChild(h("h3","","Or jump to a lesson")); v.appendChild(list);
    return;
  }
  if (S.step >= STEPS.length){
    v.innerHTML = `<h1>You’ve reached the end</h1><p>You’ve explored all ${STEPS.length} lessons${doneN < STEPS.length ? ` and practiced ${doneN}` : ""}. Next, see what you’ve mastered and what to look at again.</p>`;
    const a = h("button","btn","See my reflection"); a.type = "button"; a.onclick = () => go("prog");
    const b = h("button","btn ghost","Review missed questions"); b.type = "button"; b.style.marginTop = "10px"; b.onclick = () => { go("cards"); setDeck("missed"); };
    const c = h("button","btn ghost","Practice short answers"); c.type = "button"; c.style.marginTop = "10px"; c.onclick = () => go("write");
    v.append(a,b,c); return;
  }
  S.seen[S.step] = 1; S.last = S.step; save();
  const st = STEPS[S.step];
  v.innerHTML = `<div class="labhead"><span>Lesson ${S.step+1} of ${STEPS.length}</span></div>
    <div class="track" role="group" aria-label="Jump to a lesson">${STEPS.map((s,i) => `<button type="button" data-j="${i}" aria-label="Lesson ${i+1}: ${s.title}" class="${S.done[i] ? "done" : S.seen[i] ? "seen" : ""}${i === S.step ? " now" : ""}"></button>`).join("")}</div>
    <h2>${st.title}</h2>${st.html}`;
  v.querySelectorAll(".track button").forEach(b => b.onclick = () => { S.step = +b.dataset.j; save(); renderLab(); window.scrollTo(0,0); });
  v.querySelectorAll("[data-fig]").forEach(f => FIGS[f.dataset.fig](f));
  const ck = h("div","check"); ck.innerHTML = `<h3>Practice</h3><p class="muted small" style="margin:0">Try these. Every answer explains itself, and you can retry as often as you like.</p>`;
  const qbox = h("div");
  const again = h("button","btn ghost","Practice these again"); again.type = "button"; again.style.marginTop = "14px";
  const loadQs = () => {
    qbox.innerHTML = ""; let n = 0;
    st.check.forEach(item => teachQ(qbox, item, "check", () => { n++; if (n === st.check.length){ S.done[S.step] = true; save(); again.textContent = "Practice these again (answers reshuffled)"; } }));
  };
  again.onclick = () => { loadQs(); ck.scrollIntoView({behavior: RM ? "auto" : "smooth", block:"start"}); };
  loadQs(); ck.append(qbox, again);
  const nav = h("div","btnrow");
  const back = h("button","btn ghost","Previous"); back.type = "button"; back.disabled = S.step === 0;
  const next = h("button","btn", S.step === STEPS.length-1 ? "Finish" : "Next lesson"); next.type = "button";
  back.onclick = () => { S.step--; save(); renderLab(); window.scrollTo(0,0); };
  next.onclick = () => { S.step++; save(); renderLab(); window.scrollTo(0,0); };
  nav.append(back, next); v.append(ck, nav);
}

function renderQuizHome(){
  const v = $("#v-quiz");
  v.innerHTML = `<h2>Self-check</h2><p class="muted">Five questions per round. Retry any question as often as you like. Your score counts first tries only, and it’s just for you. Every round can be repeated as often as you like.</p><div class="rounds" id="rounds"></div>`;
  ROUNDS.forEach((r, ri) => {
    const best = S.rounds[ri];
    const b = h("button","round",`<span><b>${r[0]}</b><small>${r[1]}</small></span><span class="score">${r[2] <= -2 ? (r[2] === -2 ? (Object.keys(ALLQ).filter(id => S.missed[id] || S.first[id] === false).length + " to practice") : "Practice") : best !== undefined ? "Best " + best + "/5" : "Start"}</span>`); b.type = "button";
    b.onclick = () => runRound(ri); $("#rounds").appendChild(b);
  });
}
function runRound(ri){
  const r = ROUNDS[ri];
  let qs;
  if (r[2] === -3) qs = Array.from({length:5}, genDrill);
  else if (r[2] === -2){
    const ids = Object.keys(ALLQ).filter(id => S.missed[id] || S.first[id] === false);
    if (!ids.length){ const v0 = $("#v-quiz"); v0.innerHTML = `<h2>No weak spots yet</h2><p>You haven’t missed any questions so far. Try a round or a lesson’s practice, and anything you miss will show up here.</p>`; const b0 = h("button","btn ghost","All rounds"); b0.type = "button"; b0.onclick = renderQuizHome; v0.appendChild(b0); return; }
    qs = shuffle(ids).slice(0,5).map(id => ALLQ[id]);
  }
  else qs = r[2] < 0 ? shuffle(QUIZ).slice(0,5) : shuffle(QUIZ.slice(r[2], r[2]+5));
  const total = qs.length;
  let n = 0, right = 0; const res = [];
  const v = $("#v-quiz");
  const show = () => {
    v.innerHTML = `<div class="labhead"><span>${r[0]} · Question ${n+1} of ${total}</span><button class="linkbtn" type="button" id="qz-quit">All rounds</button></div>
      <div class="dots">${qs.map((_,i) => `<i class="${res[i] === true ? "ok" : res[i] === false ? "no" : i === n ? "now" : ""}"></i>`).join("")}</div>`;
    $("#qz-quit").onclick = renderQuizHome;
    const area = h("div"); v.appendChild(area);
    const nb = h("button","btn", n === total-1 ? "See how I did" : "Next question"); nb.type = "button"; nb.disabled = true; nb.style.marginTop = "18px";
    teachQ(area, qs[n], "quiz", ok => { res[n] = ok; if (ok) right++; nb.disabled = false; v.querySelectorAll(".dots i")[n].className = ok ? "ok" : "no"; });
    nb.onclick = () => { n++; if (n < total){ show(); window.scrollTo(0,0); } else finish(); };
    v.appendChild(nb);
  };
  const finish = () => {
    if (r[2] > -2 && (S.rounds[ri] === undefined || right > S.rounds[ri])) S.rounds[ri] = right; save();
    const missed = res.filter(x => !x).length;
    const lessons = [...new Set(qs.filter((q,i) => !res[i]).map(q => q.gen ? q.L : lessonOf(q.id)).filter(L => L >= 0))];
    v.innerHTML = `<h2>${right} of ${total} on the first try</h2><div class="dots">${res.map(x => `<i class="${x ? "ok" : "no"}"></i>`).join("")}</div>
      <p>${right === total ? "Every one on the first try. Nicely done." : right >= 3 ? "Good progress. You worked through the rest, and that counts too." : "You worked through every question, and that’s how this sticks. A quick look back at the lessons below will help."}</p>
      ${missed ? `<p class="small muted">Questions you missed on the first try are now in your Review deck.</p>` : ""}`;
    lessons.forEach(L => { const b = h("button","btn ghost",`Revisit lesson ${L+1}: ${STEPS[L].title}`); b.type = "button"; b.style.marginTop = "10px"; b.onclick = () => { S.step = L; save(); go("lab"); }; v.appendChild(b); });
    const a = h("button","btn", r[2] === -3 ? "New numbers, another round" : r[2] === -2 ? "Practice weak spots again" : "Try this round again"); a.type = "button"; a.style.marginTop = "10px"; a.onclick = () => runRound(ri);
    const c = h("button","btn ghost","All rounds"); c.type = "button"; c.style.marginTop = "10px"; c.onclick = renderQuizHome;
    v.append(a, c); window.scrollTo(0,0);
  };
  show(); window.scrollTo(0,0);
}

/* ================= flashcards (terms + missed questions) ================= */
let ALLQ = {};
let deckMode = "learn", list = [], pos = 0;
function buildDeck(){
  if (deckMode === "missed") list = shuffle(Object.keys(S.missed).filter(id => ALLQ[id])).map(id => ({kind:"q", id}));
  else list = shuffle(CARDS.map((_,i) => i)).filter(i => deckMode === "all" || !S.known.includes(i)).map(i => ({kind:"t", i}));
  pos = 0;
}
function setDeck(m){ deckMode = m; document.querySelectorAll("#v-cards .seg button").forEach(b => b.setAttribute("aria-pressed", b.dataset.d === m)); buildDeck(); drawCard(); }
function drawCard(anim){
  const c = $("#fc"); c.classList.remove("flipped","slide"); if (anim && !RM){ void c.offsetWidth; c.classList.add("slide"); }
  const mc = Object.keys(S.missed).length;
  document.querySelector('#v-cards .seg button[data-d="missed"]').textContent = `Missed (${mc})`;
  $("#fc-known").textContent = deckMode === "missed" ? "" : `${S.known.length} of ${CARDS.length} terms known`;
  const term = $("#fc-term");
  if (!list.length){
    term.className = "term"; term.textContent = deckMode === "missed" ? "Nothing missed" : "All done!";
    $("#fc-s1").textContent = $("#fc-s2").textContent = "";
    $("#fc-def").textContent = deckMode === "missed" ? "Questions you get wrong on the first try will appear here." : "Every term is marked as known. Choose ‘All terms’ to review them, or tap ‘Still learning’ on any card to put it back in this deck.";
    $("#fc-ex").textContent = ""; $("#fc-note").textContent = ""; $("#fc-pos").textContent = ""; $("#fc-got").disabled = $("#fc-again").disabled = true; return;
  }
  $("#fc-got").disabled = $("#fc-again").disabled = false;
  if (pos >= list.length) pos = 0; if (pos < 0) pos = list.length-1;
  const it = list[pos];
  if (it.kind === "t"){
    const cd = CARDS[it.i]; term.className = "term"; term.textContent = cd[0];
    $("#fc-def").textContent = cd[1]; $("#fc-ex").textContent = "Example: " + cd[2]; $("#fc-note").textContent = CNOTE[cd[0]] || "";
    $("#fc-s1").textContent = $("#fc-s2").textContent = "No. " + String(it.i+1).padStart(2,"0");
  } else {
    const q = ALLQ[it.id]; term.className = "term qtext"; term.textContent = q.q;
    $("#fc-def").innerHTML = `<b>${q.o[q.a][0]}</b><br>${q.o[q.a][1]}`; $("#fc-ex").textContent = q.more; $("#fc-note").textContent = TB.has(q.id) ? "📘 Textbook model, as in the lecture." + (TODAY[q.id] ? " 🕒 Today: " + TODAY[q.id] : "") : "";
    $("#fc-s1").textContent = $("#fc-s2").textContent = "Missed question";
  }
  $("#fc-pos").textContent = `Card ${pos+1} of ${list.length}`;
}

function renderWriteHome(){
  const v = $("#v-write");
  v.innerHTML = `<h2>Short answer practice</h2><p class="muted">Write answers like your professor’s quizzes, then compare yours with a model answer. This is self-assessment: you decide how well you covered each point. Model answers follow the lecture’s textbook model.</p>
    <details class="tips"><summary>How to write a strong short answer</summary><ol style="padding-left:20px;margin:8px 0 0"><li><b>Define</b> the key term in one sentence.</li><li><b>Explain how</b> it works, step by step.</li><li><b>Add an example or a number</b> ($100 deposit, R = 10%).</li></ol><p style="margin:8px 0 0">Three to five sentences is usually enough.</p></details>
    <div class="rounds" id="wl"></div>`;
  WRITE.forEach((w, i) => {
    const best = S.write[i];
    const b = h("button","round",`<span><b>Question ${i+1}</b><small>${w.q}</small></span><span class="score">${best !== undefined ? best + "%" : "Start"}</span>`); b.type = "button";
    b.onclick = () => openWrite(i); $("#wl").appendChild(b);
  });
}
function openWrite(i){
  const w = WRITE[i], v = $("#v-write");
  v.innerHTML = `<div class="labhead"><span>Question ${i+1} of ${WRITE.length}</span><button class="linkbtn" type="button" id="w-back">All questions</button></div>
    <div class="prompt">${w.q}</div>
    <details class="tips"><summary>Need a nudge?</summary><p style="margin:8px 0 0">A full answer covers ${w.keys.length} points. Define, explain how, then give an example or number.</p></details>
    <label for="w-txt" class="muted small">Your answer</label><textarea id="w-txt" placeholder="Write 3–5 sentences…"></textarea>
    <div class="btnrow"><button class="btn ghost" type="button" id="w-fresh">Start fresh</button><button class="btn" type="button" id="w-check">Check my answer</button></div><div id="w-res"></div>`;
  $("#w-back").onclick = renderWriteHome;
  const ta = $("#w-txt"); ta.value = S.drafts[i] || "";
  $("#w-fresh").onclick = () => { if (ta.value && !confirm("Clear your answer and start again?")) return; ta.value = ""; S.drafts[i] = ""; save(); $("#w-res").innerHTML = ""; ta.focus(); }; ta.oninput = () => { S.drafts[i] = ta.value; save(); };
  $("#w-check").onclick = () => {
    const t = ta.value.trim();
    if (t.split(/\s+/).length < 8){ $("#w-res").innerHTML = `<p class="fb"><b class="no">Write a bit more first.</b> Aim for at least 3 sentences, so you practice the full answer.</p>`; return; }
    const hits = w.keys.map(k => k[1].test(t));
    const res = $("#w-res");
    res.innerHTML = `<h3>Key points</h3><p class="muted small" style="margin:0 0 4px">Ticked points were found in your answer. If you covered one in other words, tick it yourself. Be honest!</p><div id="w-kp"></div>
      <p class="cap" id="w-score"></p><h3>Model answer</h3><div class="model">${w.model}</div>
      <p class="muted small" style="margin-top:10px">Compare: did you define, explain how, and give a number or example?</p>
      <div class="btnrow even"><button class="btn ghost" type="button" id="w-again">Revise my answer</button><button class="btn" type="button" id="w-next">${i < WRITE.length-1 ? "Next question" : "All questions"}</button></div>`;
    const kp = $("#w-kp");
    w.keys.forEach((k, j) => {
      const l = h("label","kp",`<input type="checkbox" ${hits[j] ? "checked" : ""}><span>${k[0]}${hits[j] ? '<span class="found">found</span>' : ""}</span>`);
      kp.appendChild(l);
    });
    const upd = () => {
      const c = kp.querySelectorAll("input:checked").length, pct = Math.round(c / w.keys.length * 100);
      $("#w-score").innerHTML = `<b>${c} of ${w.keys.length} key points (${pct}%).</b> ${pct === 100 ? "A complete answer." : pct >= 60 ? "Solid. Add the missing points to make it complete." : "Read the model answer, then revise yours and check again."}`;
      if (S.write[i] === undefined || pct > S.write[i]) S.write[i] = pct; save();
    };
    kp.querySelectorAll("input").forEach(x => x.onchange = upd); upd();
    $("#w-again").onclick = () => { ta.focus(); window.scrollTo({top: ta.getBoundingClientRect().top + window.scrollY - 80}); };
    $("#w-next").onclick = () => { if (i < WRITE.length-1){ openWrite(i+1); window.scrollTo(0,0); } else renderWriteHome(); };
    res.scrollIntoView({behavior: RM ? "auto" : "smooth", block:"start"});
  };
}

function lessonOf(id){ for (let i = 0; i < STEPS.length; i++) if (STEPS[i].check.some(q => q.id === id)) return i; const q = QUIZ.find(x => x.id === id); return q ? q.L : -1; }
function lessonReport(){
  return STEPS.map((s, i) => {
    const ids = Object.keys(S.first).filter(id => lessonOf(id) === i);
    const right = ids.filter(id => S.first[id]).length;
    const ws = WTAG.map((L,k) => L === i ? S.write[k] : undefined).filter(x => x !== undefined);
    const parts = []; if (ids.length) parts.push(right / ids.length); if (ws.length) parts.push(ws.reduce((a,b) => a+b, 0) / ws.length / 100);
    const score = parts.length ? parts.reduce((a,b) => a+b, 0) / parts.length : null;
    const status = score === null ? (S.seen[i] ? "Visited, not practiced" : "Not started") : score >= 0.8 ? "Strong" : score >= 0.5 ? "Getting there" : "Needs more practice";
    const cls = score === null ? "" : score >= 0.8 ? "good" : score >= 0.5 ? "mid" : "low";
    const missed = Object.keys(S.missed).filter(id => lessonOf(id) === i).length;
    const ev = [];
    if (ids.length) ev.push(`${right} of ${ids.length} ${ids.length === 1 ? "question" : "questions"} right on the first try`);
    if (ws.length) ev.push(`short answers ${Math.round(ws.reduce((a,b) => a+b, 0) / ws.length)}%`);
    return {i, title:s.title, score, status, cls, missed, ev};
  });
}
function renderProg(){
  const rep = lessonReport();
  const strong = rep.filter(r => r.cls === "good"), weak = rep.filter(r => r.cls === "low" || r.cls === "mid");
  const mc = Object.keys(S.missed).length;
  const v = $("#v-prog");
  v.innerHTML = `<h2>Reflect</h2><p class="muted">A picture of what you’ve mastered and what to look at next. It’s based on your first tries and your short answers, and it’s only for you. Practice a lesson again and this updates to your latest attempt.</p>
    <div class="startcard"><b style="font-family:var(--serif)">Your strengths</b><p class="small" style="margin:4px 0 10px">${strong.length ? strong.map(r => r.title).join(", ") : "Practice a few lessons and your strengths will show up here."}</p>
    <b style="font-family:var(--serif)">Worth more practice</b><p class="small" style="margin:4px 0 0">${weak.length ? weak.map(r => r.title).join(", ") : rep.some(r => r.score !== null) ? "Nothing flagged. Keep it fresh with the Review deck." : "Nothing yet."}</p></div>
    <div id="rf-list"></div>`;
  const list = $("#rf-list");
  rep.forEach(r => {
    const c = h("div","stat");
    c.innerHTML = `<div class="row"><span><b>${r.i+1}. ${r.title}</b></span><span class="tag ${r.cls}">${r.status}</span></div>
      ${r.ev.length ? `<p class="small muted" style="margin:6px 0 0">${r.ev.join(" · ")}</p>` : ""}
      ${r.score !== null ? `<div class="bar"><span style="width:${Math.round(r.score*100)}%"></span></div>` : ""}`;
    const row = h("div","rfbtns");
    const a = h("button","chipbtn", S.seen[r.i] ? "Revisit lesson" : "Start lesson"); a.type = "button"; a.onclick = () => { S.step = r.i; save(); go("lab"); }; row.appendChild(a);
    if (r.missed){ const b = h("button","chipbtn",`Review ${r.missed} missed`); b.type = "button"; b.onclick = () => { go("cards"); setDeck("missed"); }; row.appendChild(b); }
    c.appendChild(row); list.appendChild(c);
  });
  const extra = h("div","");
  const wv = Object.values(S.write);
  extra.innerHTML = `<h3>Other practice</h3>
    <div class="stat"><div class="row"><span>Terms marked “Got it”</span><span class="v">${S.known.length}/${CARDS.length}</span></div><div class="bar"><span style="width:${Math.round(S.known.length/CARDS.length*100)}%"></span></div></div>
    <div class="stat"><div class="row"><span>Missed questions waiting in Review</span><span class="v">${mc}</span></div></div>
    <div class="stat"><div class="row"><span>Self-check rounds tried</span><span class="v">${Object.keys(S.rounds).length}/5</span></div></div>
    <div class="stat"><div class="row"><span>Short answers written</span><span class="v">${wv.length}/${WRITE.length}</span></div></div>`;
  v.appendChild(extra);
  const dl = h("button","btn","Download my summary"); dl.type = "button"; dl.style.marginTop = "8px";
  dl.onclick = () => {
    const lines = [CFG.title + ": " + CFG.lecture + " — my study summary", "Saved " + new Date().toLocaleDateString(), ""];
    rep.forEach(r => lines.push(`${r.i+1}. ${r.title}: ${r.status}${r.ev.length ? " (" + r.ev.join("; ") + ")" : ""}`));
    lines.push("", `Terms known: ${S.known.length}/${CARDS.length}`, `Missed questions to review: ${mc}`, `Short answers written: ${wv.length}/${WRITE.length}`);
    const missedQ = Object.keys(S.missed).map(id => ALLQ[id]).filter(Boolean);
    if (missedQ.length){ lines.push("", "Questions to review:"); missedQ.forEach(q => lines.push(`- ${q.q} → ${q.o[q.a][0]}`)); }
    const blob = new Blob([lines.join("\n")], {type:"text/plain"});
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = CFG.key + "-summary.txt"; document.body.appendChild(a); a.click(); a.remove();
  };
  const reset = h("button","btn ghost","Start fresh (erase progress)"); reset.type = "button"; reset.style.marginTop = "10px";
  reset.onclick = () => { if (!confirm("Erase all progress on this device?")) return; S = blank(); save(); setDeck("learn"); renderLab(); renderQuizHome(); renderWriteHome(); renderProg(); };
  v.append(dl, reset);
}

/* ================= navigation ================= */
function go(view){
  document.querySelectorAll(".tabbar button").forEach(b => { if (b.dataset.v === view) b.setAttribute("aria-current","page"); else b.removeAttribute("aria-current"); });
  document.querySelectorAll(".view").forEach(x => x.classList.toggle("on", x.id === "v-" + view));
  if (view === "lab") renderLab();
  if (view === "prog") renderProg();
  if (view === "quiz") renderQuizHome();
  if (view === "write") renderWriteHome();
  if (view === "cards"){ buildDeck(); drawCard(); }
  closeSheet(); window.scrollTo(0,0);
}

/* ================= init ================= */
function initLab(cfg){
  CFG = Object.assign({hub:"../../index.html", thenNow:true}, cfg);
  KEY = CFG.key;
  try { const r = localStorage.getItem(KEY); if (r) S = Object.assign(blank(), JSON.parse(r)); } catch(e) {}
  document.title = CFG.title + " – " + CFG.lecture;
  if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost")){
    navigator.serviceWorker.register("/sw.js");
    const head = document.head, add = (tag, attrs) => { const n = document.createElement(tag); Object.entries(attrs).forEach(([k,v]) => n.setAttribute(k, v)); head.appendChild(n); };
    add("link", {rel:"manifest", href:"/manifest.webmanifest"}); add("link", {rel:"apple-touch-icon", href:"/icons/apple-touch-icon.png"}); add("link", {rel:"icon", type:"image/png", href:"/icons/favicon-32.png"});
    const tc = document.querySelector('meta[name="theme-color"]'); if (tc) tc.setAttribute("content", "#B00B00");
  }
  document.body.insertAdjacentHTML("afterbegin", `<header class="appbar only-mobile">
  <div class="wrap appbar-in">
    <a class="appbar-title" href="${CFG.hub}">${CFG.title}</a>
    <button type="button" class="lessonsbtn" id="lessons-btn" aria-haspopup="dialog">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16"/></svg>Lessons
    </button>
  </div>
</header>

<main class="wrap">
  <section class="view on" id="v-lab" aria-label="Lab"></section>

  <section class="view" id="v-cards" aria-label="Flashcards">
    <h2>Review</h2>
    <p class="muted small">Tap to flip. Swipe for the next card. “Got it” moves a card out of your deck; “Still learning” keeps it.</p>
    <div class="seg seg3" role="group" aria-label="Which deck">
      <button type="button" data-d="learn" aria-pressed="true">To learn</button>
      <button type="button" data-d="missed" aria-pressed="false">Missed</button>
      <button type="button" data-d="all" aria-pressed="false">All terms</button>
    </div>
    <div class="cardmeta"><span id="fc-pos"></span><span id="fc-known"></span></div>
    <div class="cardzone" id="fc-zone">
      <div class="fcard" id="fc" tabindex="0" role="button" aria-label="Flashcard. Press to flip.">
        <div class="inner">
          <div class="face front"><span class="serial" id="fc-s1"></span><div class="term" id="fc-term"></div><div class="hint2">Tap to flip</div></div>
          <div class="face back"><span class="serial" id="fc-s2"></span><p class="def" id="fc-def"></p><p class="ex" id="fc-ex"></p><p class="cardnote" id="fc-note"></p></div>
        </div>
      </div>
    </div>
    <div class="btnrow even">
      <button class="btn ghost" id="fc-again" type="button">Still learning</button>
      <button class="btn" id="fc-got" type="button">Got it</button>
    </div>
  </section>

  <section class="view" id="v-quiz" aria-label="Quiz"></section>
  <section class="view" id="v-write" aria-label="Short answer practice"></section>
  <section class="view" id="v-prog" aria-label="Progress"></section>
</main>

<nav class="tabbar" aria-label="Main menu">
  <div class="brand"><a class="hublink" href="${CFG.hub}">← All lectures</a><b>${CFG.title}</b><small>${CFG.lecture}</small></div>
  <div class="in">
    <button type="button" data-v="lab" aria-current="page"><svg viewBox="0 0 24 24"><path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-9V3"/><path d="M7.5 15h9"/></svg><span class="lbl">Learn</span></button>
    <button type="button" data-v="cards"><svg viewBox="0 0 24 24"><rect x="3" y="6" width="14" height="12" rx="2"/><path d="M7 3h12a2 2 0 0 1 2 2v10"/></svg><span class="lbl">Review</span></button>
    <button type="button" data-v="quiz"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6V14M12 17.5v.01"/></svg><span class="lbl">Check</span></button>
    <button type="button" data-v="write"><svg viewBox="0 0 24 24"><path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13 7l4 4"/></svg><span class="lbl">Write</span></button>
    <button type="button" data-v="prog"><svg viewBox="0 0 24 24"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></svg><span class="lbl">Reflect</span></button>
  </div>
  <div class="sidelessons" id="sidelessons" aria-label="Lessons"></div>
</nav>

<div class="sheet-bg" id="sheet-bg"></div>
<div class="sheet" id="sheet" role="dialog" aria-modal="true" aria-labelledby="sheet-t">
  <button class="x" id="sheet-x" type="button" aria-label="Close">×</button>
  <h3 id="sheet-t"></h3><div id="sheet-d" class="sheetbody"></div><p class="muted" id="sheet-e"></p><p class="cardnote" id="sheet-n"></p>
</div>
`);
  CARDS.forEach(c => GLOSS[c[0]] = c);
  STEPS.forEach(s => s.check.forEach(q => ALLQ[q.id] = q)); QUIZ.forEach(q => ALLQ[q.id] = q);
$("#lessons-btn").onclick = openLessons;
document.addEventListener("click", e => { const t = e.target.closest(".gl"); if (t) openSheet(t.dataset.g); });
$("#sheet-bg").onclick = closeSheet; $("#sheet-x").onclick = closeSheet;
document.addEventListener("keydown", e => { if (e.key === "Escape") closeSheet(); });
$("#fc").onclick = () => $("#fc").classList.toggle("flipped");
$("#fc").onkeydown = e => { if (e.key === " " || e.key === "Enter"){ e.preventDefault(); $("#fc").classList.toggle("flipped"); } if (e.key === "ArrowRight"){ pos++; drawCard(true); } if (e.key === "ArrowLeft"){ pos--; drawCard(true); } };
$("#fc-got").onclick = () => {
  const it = list[pos];
  if (it.kind === "t"){ if (!S.known.includes(it.i)) S.known.push(it.i); if (deckMode === "learn") list.splice(pos,1); else pos++; }
  else { delete S.missed[it.id]; list.splice(pos,1); }
  save(); drawCard(true);
};
$("#fc-again").onclick = () => { const it = list[pos]; if (it.kind === "t") S.known = S.known.filter(x => x !== it.i); save(); pos++; drawCard(true); };
document.querySelectorAll("#v-cards .seg button").forEach(b => b.onclick = () => setDeck(b.dataset.d));
(function swipe(){
  let x0 = null, y0 = null, moved = false; const z = $("#fc-zone");
  z.addEventListener("touchstart", e => { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; moved = false; }, {passive:true});
  z.addEventListener("touchmove", e => { if (x0 !== null && Math.abs(e.touches[0].clientX - x0) > 10) moved = true; }, {passive:true});
  z.addEventListener("touchend", e => {
    if (x0 === null) return; const dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0; x0 = null;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)){ pos += dx < 0 ? 1 : -1; drawCard(true); }
  });
  z.addEventListener("click", e => { if (moved){ e.stopPropagation(); moved = false; } }, true);
})();
document.querySelectorAll(".tabbar button").forEach(b => b.onclick = () => go(b.dataset.v));
buildDeck(); drawCard();
renderLab(); renderQuizHome(); renderWriteHome();
}
