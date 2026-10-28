/* Lecture 11: The Influence of Monetary and Fiscal Policy on Aggregate Demand — lab content (loaded after assets/lab.js) */

const CARDS = [
 ["Theory of liquidity preference","The interest rate adjusts to balance the supply of and demand for money.","Keynes’ theory of the short-run interest rate."],
 ["Money supply (liquidity preference)","Fixed by the central bank, so it doesn’t depend on the interest rate: a vertical line.",""],
 ["Money demand","How much wealth people want to hold as money (liquid, no interest) instead of bonds (interest, less liquid). Depends on Y, r and P.",""],
 ["Opportunity cost of holding money","The interest rate: the return you give up by holding money instead of bonds.","r ↑ → money demand ↓."],
 ["Interest-rate effect","P ↓ → money demand ↓ → r ↓ → I ↑ → quantity of goods demanded ↑. The most important reason AD slopes down in the U.S.",""],
 ["Monetary policy","The Fed changes the money supply through open-market operations to change interest rates and shift AD.","Lower MS → higher r → AD shifts left."],
 ["Federal funds rate","The rate banks charge each other on short-term loans. The news usually reports that the Fed targets it.",""],
 ["Liquidity trap","When the interest rate is zero and can’t be cut further, so conventional monetary policy may not work.","2008–2009: the Fed bought mortgages and other assets instead."],
 ["Fiscal policy","Government decisions about the level of spending and taxes.",""],
 ["Expansionary fiscal policy","An increase in G and/or a decrease in T. Shifts AD right.","A stimulus package."],
 ["Contractionary fiscal policy","A decrease in G and/or an increase in T. Shifts AD left.","Spending cuts to balance the budget."],
 ["Multiplier effect","The additional shifts in AD that happen when fiscal policy raises income and therefore consumer spending.","$20b of Boeing planes → wages and profits → more spending."],
 ["Marginal propensity to consume","MPC: the fraction of extra income households spend rather than save.","MPC = 0.8: income rises $100, C rises $80."],
 ["Spending multiplier","ΔY = ΔG × 1/(1 − MPC).","MPC 0.5 → 2; 0.75 → 4; 0.9 → 10."],
 ["Crowding-out effect","A fiscal expansion raises income, money demand and r, which reduces investment and shrinks the net AD shift.",""],
 ["Permanent vs temporary tax cut","A permanent tax cut raises consumption, and shifts AD, more than a temporary one.",""],
 ["Supply-siders","Economists who believe tax cuts strongly raise the incentive to work and so shift aggregate supply right.","People respond to incentives."],
 ["Active stabilization policy","Using monetary and fiscal policy to reduce fluctuations: expand when GDP is below its natural rate, contract when above.","Kennedy’s 1961 tax cut; Obama’s 2009 stimulus."],
 ["Policy lags","Monetary policy takes at least 6 months to affect output; fiscal changes need acts of Congress that can take months or years.","Why critics fear policy can destabilize."],
 ["Automatic stabilizers","Fiscal changes that stimulate AD in a recession with no new decisions: falling tax payments and rising unemployment and welfare spending.",""]
];
const CNOTE = {
 "Monetary policy":"📘 Lecture framework. 🕒 Today the Fed sets a target range for the federal funds rate and steers it mainly with the interest it pays on bank reserves.",
 "Liquidity trap":"🕒 Today: the Fed kept rates near zero in 2008–2015 and again in 2020–2022, and bought large amounts of Treasury and mortgage-backed securities.",
 "Spending multiplier":"📘 Textbook model: assumes no taxes, imports or crowding out. Real-world multipliers are usually smaller."
};
const TB = new Set(["c2a","c2b","c3a","c3b","c6a","c6b","c7a","c7b","q6","q7","q8","q13","q14","q15","q16","q17"]);
const TODAY = {
 c3a:"the Fed sets a target for the federal funds rate and steers it mainly through the interest it pays on reserves, but the direction is the same: higher rates shrink AD.",
 q8:"the Fed sets a target for the federal funds rate and steers it mainly through the interest it pays on reserves, but the direction is the same."
};

/* ---------- helpers ---------- */
const kv = (label, val) => `<div class="info" style="display:flex;justify-content:space-between;gap:10px;padding:8px 12px"><span style="color:var(--ink)">${label}</span><b style="margin:0;white-space:nowrap">${val}</b></div>`;
function sortActivity(el, title, sub, items, choices, hintFn){
  let k = 0, right = 0, first = true;
  el.innerHTML = `<div class="figt">${title}</div><p class="figsub">${sub}</p><div class="sbody"></div>`;
  const body = el.querySelector(".sbody");
  const draw = () => {
    if (k >= items.length){ body.innerHTML = `<div class="scen pop"><b>${right} of ${items.length}</b> on the first try.</div><button class="btn ghost" type="button">Try again</button>`; body.querySelector("button").onclick = () => { k = 0; right = 0; draw(); }; return; }
    first = true;
    body.innerHTML = `<div class="tally"><span>${k+1} of ${items.length}</span><span>${right} right</span></div><div class="scen pop">${items[k][0]}</div>
      <div class="choices" style="grid-template-columns:repeat(${Math.min(choices.length,2)},1fr)">${choices.map(c => `<button type="button" class="choice" data-z="${c[0]}">${c[1]}</button>`).join("")}</div><div class="fb"></div>`;
    body.querySelectorAll(".choice").forEach(b => b.onclick = () => {
      const ok = b.dataset.z === items[k][1];
      if (ok){ if (first){ right++; body.querySelector(".tally span:last-child").textContent = right + " right"; }
        body.querySelectorAll(".choice").forEach(x => x.disabled = true); b.classList.add("right");
        body.querySelector(".fb").innerHTML = `<div class="why"><b class="ok">Yes.</b> ${items[k][2]}</div>`;
        const nb = h("button","btn","Next"); nb.type = "button"; nb.style.marginTop = "10px"; nb.onclick = () => { k++; draw(); }; body.appendChild(nb);
      } else { first = false; b.classList.add("wrong"); b.disabled = true; body.querySelector(".fb").innerHTML = `<div class="why"><b class="no">Not quite.</b> ${hintFn(items[k], b.dataset.z)} Try again.</div>`; }
    });
  };
  draw();
}

/* ---------- two-panel diagrams ----------
   Money market:  MD: r = 9 + s − 0.08·M   (s > 0 shifts MD right/up);  MS vertical at M
   AD panel:      AD: P = 100 − (Y − 100 − d)                                              */
const mdR = (M, s) => 9 + s - 0.08*M;
function chart(o){
  const w = 340, h = o.h || 200, L = 40, R = 12, T = 14, B = 30;
  const X = v => L + (v - o.xr[0])/(o.xr[1]-o.xr[0])*(w-L-R), Y = v => (h-B) - (v - o.yr[0])/(o.yr[1]-o.yr[0])*(h-T-B);
  const inR = p => p[0] >= o.xr[0] && p[0] <= o.xr[1] && p[1] >= o.yr[0] && p[1] <= o.yr[1];
  let out = "";
  (o.lines || []).forEach(l => { const pts = l.pts.filter(inR); if (!pts.length) return; const col = l.faded ? "var(--border)" : l.color;
    out += `<polyline points="${pts.map(p => `${X(p[0]).toFixed(1)},${Y(p[1]).toFixed(1)}`).join(" ")}" style="fill:none;stroke:${col};stroke-width:${l.faded ? 2 : 3}${l.faded ? ";stroke-dasharray:6 5" : ""}"/>`;
    if (l.label){ const lp = l.at === "start" ? pts[0] : pts[pts.length-1]; let lx = X(lp[0]) + (l.dx ?? 4), anc = l.anchor || "start"; if (anc === "start" && lx > w - 50){ lx = X(lp[0]) - 4; anc = "end"; }
      out += `<text x="${lx}" y="${Math.max(26, Y(lp[1]) + (l.dy ?? -6))}" text-anchor="${anc}" class="sm halo" style="font-weight:700;fill:${l.faded ? "var(--muted)" : col}">${l.label}</text>`; } });
  const guides = (o.pts || []).map(p => `<line x1="${L}" y1="${Y(p.y)}" x2="${X(p.x)}" y2="${Y(p.y)}" style="stroke:var(--muted);stroke-width:1;stroke-dasharray:3 3"/><line x1="${X(p.x)}" y1="${Y(p.y)}" x2="${X(p.x)}" y2="${h-B}" style="stroke:var(--muted);stroke-width:1;stroke-dasharray:3 3"/>` + (p.yl ? `<text x="${L-4}" y="${Y(p.y)+4}" text-anchor="end" class="sm" style="font-weight:700">${p.yl}</text>` : "") + (p.xl ? `<text x="${X(p.x)}" y="${h-B+14}" text-anchor="middle" class="sm" style="font-weight:700">${p.xl}</text>` : "")).join("");
  const dots = (o.pts || []).map(p => `<circle cx="${X(p.x)}" cy="${Y(p.y)}" r="5.5" style="fill:${p.old ? "var(--surface)" : "var(--wrong)"};stroke:${p.old ? "var(--muted)" : "var(--surface)"};stroke-width:2"/>`).join("");
  return `<svg class="chart" viewBox="0 0 ${w} ${h}" role="img" aria-label="${o.title}">
    <text x="4" y="11" class="sm" style="font-weight:700">${o.title}</text>
    <line x1="${L}" y1="${T}" x2="${L}" y2="${h-B}" style="stroke:var(--ink);stroke-width:1.5"/><line x1="${L}" y1="${h-B}" x2="${w-R}" y2="${h-B}" style="stroke:var(--ink);stroke-width:1.5"/>
    <text x="${L+4}" y="${T+12}" class="sm mute">${o.yl}</text><text x="${w-R}" y="${h-4}" text-anchor="end" class="sm mute">${o.xl}</text>
    ${guides}${out}${dots}</svg>`;
}
function mm(o){ // o: {ms:[{M,label,faded}], md:[{s,label,faded}], pts:[{M,r,label,old}]}
  const lines = [];
  (o.md || []).forEach(d => { const pts = []; for (let M = 5; M <= 100; M += 1) pts.push([M, mdR(M, d.s)]); lines.push({pts, color:"var(--gold)", label:d.label, faded:d.faded, dy:-8}); });
  (o.ms || []).forEach(s => lines.push({pts:[[s.M, 0.4],[s.M, 9.6]], color:"var(--note)", label:s.label, faded:s.faded, dy:4}));
  return chart({title:"Money market", xr:[0,100], yr:[0,10], xl:"Quantity of money", yl:"interest rate r", lines, pts:(o.pts || []).map(p => ({x:p.M, y:p.r, yl:p.label, old:p.old}))});
}
function adp(o){ // o: {ad:[{d,label,faded}], pts:[{Y,P,label,old}]}
  const lines = (o.ad || []).map(a => { const pts = []; for (let Y = 60; Y <= 150; Y += 1) pts.push([Y, 100 - (Y - 100 - a.d)]); return {pts, color:"var(--gold)", label:a.label, faded:a.faded, dy:-8}; });
  return chart({title:"Aggregate demand", xr:[60,150], yr:[60,140], xl:"Y (real GDP)", yl:"price level P", lines, pts:(o.pts || []).map(p => ({x:p.Y, y:p.P, xl:p.label, old:p.old}))});
}

/* ---------- graphics ---------- */
function figMD(el){
  sortActivity(el, "What happens to money demand?", "From the lecture’s Active Learning 1. Money demand depends on Y, r and P.", [
    ["Real income Y rises (r and P unchanged).","r","People want to buy more goods, so they need more money: money demand <b>rises</b>. They sell bonds to get it."],
    ["The interest rate r rises (Y and P unchanged).","f","r is the opportunity cost of holding money. A higher r makes bonds more attractive, so people hold <b>less</b> money."],
    ["The price level P rises (Y and r unchanged).","r","Buying the same goods now takes more dollars, so money demand <b>rises</b>."],
    ["Real income falls in a recession.","f","Fewer purchases need less money, so money demand <b>falls</b>."]
  ], [["r","Money demand rises"],["f","Money demand falls"]], () => "Think: do people need more or fewer dollars, or is holding money more or less costly?");
}
function figMM(el){
  el.innerHTML = `<div class="figt"><span class="modeltag">📘 Textbook model, as in the lecture</span><br>The theory of liquidity preference</div><p class="figsub">The Fed fixes the money supply. Change income or the price level and watch money demand and the interest rate.</p>
    <label for="mm-y" style="display:flex;justify-content:space-between"><span>Real income Y</span><b class="mm-yv"></b></label><input type="range" id="mm-y" min="-2" max="2" step="1" value="0">
    <label for="mm-p" style="display:flex;justify-content:space-between"><span>Price level P</span><b class="mm-pv"></b></label><input type="range" id="mm-p" min="-2" max="2" step="1" value="0">
    <div class="mm-c"></div><p class="cap mm-cap" aria-live="polite"></p>`;
  const y = el.querySelector("#mm-y"), p = el.querySelector("#mm-p"), lbl = v => ["much lower","lower","starting level","higher","much higher"][v+2];
  const up = () => { const s = 0.6*(+y.value) + 0.6*(+p.value), r = mdR(50, s);
    el.querySelector(".mm-yv").textContent = lbl(+y.value); el.querySelector(".mm-pv").textContent = lbl(+p.value);
    el.querySelector(".mm-c").innerHTML = mm({ms:[{M:50, label:"MS"}], md: s === 0 ? [{s:0, label:"MD"}] : [{s:0, label:"MD₁", faded:true},{s, label:"MD₂"}], pts: s === 0 ? [{M:50, r, label:"r₁"}] : [{M:50, r:5, old:true},{M:50, r, label:"r₂"}]});
    el.querySelector(".mm-cap").innerHTML = s === 0 ? "<b>Equilibrium:</b> where money demand meets the fixed money supply, r = 5%." : s > 0 ? `More money is demanded at every interest rate, so MD shifts right. With MS fixed, people try to sell bonds and <b>r rises to ${r.toFixed(1)}%</b>.` : `Less money is demanded, so MD shifts left. People buy bonds and <b>r falls to ${r.toFixed(1)}%</b>.`; };
  y.oninput = up; p.oninput = up; up();
}
function figIRE(el){
  const ST = [
    {mm:{ms:[{M:50, label:"MS"}], md:[{s:1.2, label:"MD₁"}], pts:[{M:50, r:mdR(50,1.2), label:"r₁"}]}, ad:{ad:[{d:0, label:"AD"}], pts:[{Y:90, P:110, label:"Y₁"}]}, cap:"Start: the price level is P₁ = 110. Money demand is MD₁ and r = r₁. Output demanded is Y₁."},
    {mm:{ms:[{M:50, label:"MS"}], md:[{s:1.2, label:"MD₁", faded:true},{s:0, label:"MD₂"}], pts:[{M:50, r:mdR(50,1.2), old:true},{M:50, r:5, label:"r₂"}]}, ad:{ad:[{d:0, label:"AD"}], pts:[{Y:90, P:110, label:"Y₁", old:true}]}, cap:"The price level <b>falls</b> to 100. People need fewer dollars, so <b>money demand shifts left</b>. They buy bonds, and <b>r falls</b> to r₂."},
    {mm:{ms:[{M:50, label:"MS"}], md:[{s:1.2, label:"MD₁", faded:true},{s:0, label:"MD₂"}], pts:[{M:50, r:mdR(50,1.2), old:true},{M:50, r:5, label:"r₂"}]}, ad:{ad:[{d:0, label:"AD"}], pts:[{Y:90, P:110, old:true},{Y:100, P:100, label:"Y₂"}]}, cap:"Lower r makes borrowing cheaper, so <b>investment rises</b>. The quantity of goods demanded rises to Y₂: a move <b>down along</b> AD. That’s the interest-rate effect."}
  ];
  stepper(el, {title:'<span class="modeltag">📘 Textbook model, as in the lecture</span><br>How the interest-rate effect works', n:() => ST.length, draw:(i, st) => { st.innerHTML = mm(ST[i].mm) + adp(ST[i].ad); return ST[i].cap; }});
}
function figMonPol(el){
  let K = "cut";
  const SC = {cut:{M2:35, d:-12, word:"reduces"}, add:{M2:65, d:12, word:"increases"}};
  const top = `<div class="seg" role="group" aria-label="Fed action"><button type="button" aria-pressed="true" data-k="cut">Fed reduces MS</button><button type="button" aria-pressed="false" data-k="add">Fed increases MS</button></div>`;
  const sp = stepper(el, {title:'<span class="modeltag">📘 Textbook model, as in the lecture</span><br>Monetary policy shifts aggregate demand', top, n:() => 3, draw:(i, st) => {
    const s = SC[K], r2 = mdR(s.M2, 0), up = s.d < 0;
    const m = i === 0 ? {ms:[{M:50, label:"MS₁"}], md:[{s:0, label:"MD"}], pts:[{M:50, r:5, label:"r₁"}]} : {ms:[{M:50, label:"MS₁", faded:true},{M:s.M2, label:"MS₂"}], md:[{s:0, label:"MD"}], pts:[{M:50, r:5, old:true},{M:s.M2, r:r2, label:"r₂"}]};
    const a = i < 2 ? {ad:[{d:0, label:"AD₁"}], pts:[{Y:100, P:100, label:"Y₁"}]} : {ad:[{d:0, label:"AD₁", faded:true},{d:s.d, label:"AD₂"}], pts:[{Y:100, P:100, old:true},{Y:100 + s.d, P:100, label:"Y₂"}]};
    st.innerHTML = mm(m) + adp(a);
    return [ "Start: money supply MS₁, interest rate r₁, and output demanded Y₁ at the price level P₁.",
      `The Fed ${s.word} the money supply with open-market operations (${up ? "selling" : "buying"} bonds). MS shifts ${up ? "left" : "right"}, so <b>r ${up ? "rises" : "falls"}</b> to ${r2.toFixed(1)}%.`,
      `${up ? "Higher" : "Lower"} r ${up ? "reduces" : "raises"} investment at every price level, so <b>AD shifts ${up ? "left" : "right"}</b>: output demanded ${up ? "falls" : "rises"} from Y₁ to Y₂.`][i];
  }});
  el.querySelectorAll(".seg button").forEach(b => b.onclick = () => { K = b.dataset.k; el.querySelectorAll(".seg button").forEach(x => x.setAttribute("aria-pressed", x === b)); sp.reset(); });
}
function figStabilize(el){
  const EV = [
    ["Congress tries to balance the budget by cutting government spending.","d","up","Lower G reduces AD and output. To offset it, the Fed should <b>increase MS and lower r</b>, boosting investment."],
    ["A stock market boom increases household wealth.","u","down","Higher wealth raises C, pushing output above its natural rate. The Fed should <b>reduce MS and raise r</b> to cool AD."],
    ["War in the Middle East makes oil prices soar.","d","up","This cuts aggregate supply, so output falls. To stabilize output, the Fed should <b>increase MS and lower r</b>, though that means accepting higher prices."],
    ["A recession in Europe cuts demand for U.S. exports.","d","up","NX falls, so AD and output fall. The Fed should <b>increase MS and lower r</b>."],
    ["Firms become very optimistic and boost investment.","u","down","AD rises and output overshoots. The Fed should <b>reduce MS and raise r</b>."]
  ];
  let k = 0;
  el.innerHTML = `<div class="figt">You’re the Fed</div><p class="figsub">The lecture’s Active Learning 2, plus two more. For each event: what happens to output, and how should the Fed respond to stabilize it?</p><div class="st-b"></div>`;
  const body = el.querySelector(".st-b");
  const row = (key, label, opts) => `<div style="margin:8px 0"><div style="margin-bottom:4px">${label}</div><div class="rchips" style="margin:0" data-v="${key}">${opts.map(o => `<button type="button" class="chipbtn" aria-pressed="false" data-a="${o[0]}">${o[1]}</button>`).join("")}</div></div>`;
  const draw = () => {
    const e = EV[k], pick = {};
    body.innerHTML = `<div class="scen pop">${e[0]}</div>` + row("o","1. Short-run effect on output",[["u","Rises"],["d","Falls"]]) + row("f","2. The Fed should…",[["up","Increase MS, lower r"],["down","Reduce MS, raise r"]]) + `<button type="button" class="btn st-c" style="margin-top:6px">Check</button><div class="st-r"></div>`;
    body.querySelectorAll(".rchips").forEach(g => g.querySelectorAll("button").forEach(b => b.onclick = () => { g.querySelectorAll("button").forEach(x => x.setAttribute("aria-pressed", x === b)); pick[g.dataset.v] = b.dataset.a; }));
    body.querySelector(".st-c").onclick = () => {
      const ok1 = pick.o === e[1], ok2 = pick.f === e[2];
      body.querySelector(".st-r").innerHTML = `<div class="why" style="margin-top:10px"><b class="${ok1 && ok2 ? "ok" : "no"}">${ok1 && ok2 ? "Both right." : ok1 || ok2 ? "One of two." : "Not this time."}</b> ${e[3]}${!ok2 && ok1 ? " Remember: the Fed leans <b>against</b> the shock." : ""}</div>`;
      const nb = h("button","btn ghost", k < EV.length-1 ? "Next event" : "Start over"); nb.type = "button"; nb.style.marginTop = "10px"; nb.onclick = () => { k = (k+1) % EV.length; draw(); }; body.querySelector(".st-r").appendChild(nb);
    };
  };
  draw();
}
function figFiscalSort(el){
  sortActivity(el, "Expansionary or contractionary?", "Which way does each policy shift AD?", [
    ["The government buys $20 billion of planes from Boeing.","e","Higher G is expansionary: AD shifts right."],
    ["Congress raises income tax rates.","c","Higher taxes cut take-home pay and consumption: contractionary, AD shifts left."],
    ["Congress cuts defense spending to reduce the deficit.","c","Lower G is contractionary."],
    ["A tax cut for all households.","e","More take-home pay raises C: expansionary."],
    ["A new national highway-building program.","e","Higher G: expansionary in the short run (and it may also raise supply in the long run)."]
  ], [["e","Expansionary (AD right)"],["c","Contractionary (AD left)"]], () => "Does it raise G or lower T (expansionary), or the opposite?");
}
function figMult(el){
  el.innerHTML = `<div class="figt"><span class="modeltag">📘 Textbook model, as in the lecture</span><br>The multiplier, round by round</div><p class="figsub">The government buys $20 billion of planes from Boeing. Workers and owners spend part of their extra income, then the next people spend part of theirs…</p>
    <label for="mu-m" style="display:flex;justify-content:space-between"><span>MPC</span><b class="mu-mv"></b></label><input type="range" id="mu-m" min="0.5" max="0.9" step="0.05" value="0.8">
    <div class="mu-rows"></div>
    <div class="total"><div style="display:flex;justify-content:space-between;align-items:baseline"><span>Total shift in AD</span><span class="bignum mu-t"></span></div><div class="meter gold"><span class="mu-b"></span></div></div>
    <p class="cap mu-cap" aria-live="polite"></p><button type="button" class="btn mu-play" style="margin-top:10px">Play the rounds</button>`;
  const s = el.querySelector("#mu-m"); let timer = null;
  const show = (n) => { const m = +s.value, mult = 1/(1-m), total = 20*mult; let html = "", sum = 0;
    for (let k = 0; k < n; k++){ const v = 20*Math.pow(m,k); sum += v; html += `<div class="lrow ${k === n-1 ? "pop" : ""}" style="grid-template-columns:78px 1fr 64px"><span>${k === 0 ? "Boeing" : "Round " + (k+1)}</span><span class="b" style="width:${v/20*100}%"></span><span class="v">$${v.toFixed(1)}b</span></div>`; }
    if (n >= 8) html += `<div class="lrow" style="grid-template-columns:78px 1fr 64px"><span class="muted">…</span><span class="small muted">each round × ${m}</span><span></span></div>`;
    el.querySelector(".mu-rows").innerHTML = html;
    const shown = n >= 8 ? total : sum;
    el.querySelector(".mu-t").textContent = "$" + shown.toFixed(n >= 8 ? 0 : 1) + "b"; el.querySelector(".mu-b").style.width = Math.min(100, shown/200*100) + "%";
    el.querySelector(".mu-cap").innerHTML = n >= 8 ? `All rounds add up to $20b × 1/(1 − ${m}) = $20b × <b>${+mult.toFixed(2)}</b> = <b>$${total.toFixed(0)}b</b>. A bigger MPC means each round is bigger, so the multiplier is bigger.` : `So far: $${sum.toFixed(1)}b.`; };
  const play = () => { clearTimeout(timer); let n = 1; const tick = () => { show(n); if (n < 8){ n++; timer = setTimeout(tick, RM ? 0 : 550); } }; tick(); };
  s.oninput = () => { clearTimeout(timer); el.querySelector(".mu-mv").textContent = (+s.value).toFixed(2); show(8); };
  el.querySelector(".mu-play").onclick = play;
  el.querySelector(".mu-mv").textContent = "0.80"; show(8);
}
function figCrowd(el){
  const ST = [
    {m:{ms:[{M:50, label:"MS"}], md:[{s:0, label:"MD₁"}], pts:[{M:50, r:5, label:"r₁"}]}, a:{ad:[{d:0, label:"AD₁"}], pts:[{Y:100, P:100, label:"Y₁"}]}, cap:"Start: AD₁ and interest rate r₁."},
    {m:{ms:[{M:50, label:"MS"}], md:[{s:0, label:"MD₁"}], pts:[{M:50, r:5, label:"r₁"}]}, a:{ad:[{d:0, label:"AD₁", faded:true},{d:20, label:"AD₂"}], pts:[{Y:100, P:100, old:true},{Y:120, P:100, label:"Y₂"}]}, cap:"The government raises G (plus the multiplier), so AD shifts right to AD₂."},
    {m:{ms:[{M:50, label:"MS"}], md:[{s:0, label:"MD₁", faded:true},{s:1.6, label:"MD₂"}], pts:[{M:50, r:5, old:true},{M:50, r:6.6, label:"r₂"}]}, a:{ad:[{d:0, label:"AD₁", faded:true},{d:20, label:"AD₂"}], pts:[{Y:100, P:100, old:true},{Y:120, P:100, label:"Y₂"}]}, cap:"But higher income raises <b>money demand</b>. With MS fixed, <b>r rises</b> to r₂."},
    {m:{ms:[{M:50, label:"MS"}], md:[{s:0, label:"MD₁", faded:true},{s:1.6, label:"MD₂"}], pts:[{M:50, r:5, old:true},{M:50, r:6.6, label:"r₂"}]}, a:{ad:[{d:0, label:"AD₁", faded:true},{d:20, label:"AD₂", faded:true},{d:12, label:"AD₃"}], pts:[{Y:100, P:100, old:true},{Y:120, P:100, old:true},{Y:112, P:100, label:"Y₃"}]}, cap:"Higher r <b>crowds out</b> investment, pulling AD back to AD₃. The net shift is smaller than the fiscal expansion alone would suggest."}
  ];
  stepper(el, {title:'<span class="modeltag">📘 Textbook model, as in the lecture</span><br>How the crowding-out effect works', n:() => ST.length, draw:(i, st) => { st.innerHTML = mm(ST[i].m) + adp(ST[i].a); return ST[i].cap; }});
}
function figPlanner(el){
  el.innerHTML = `<div class="figt">How much should Congress spend?</div><p class="figsub">The lecture’s Active Learning 3. Choose the AD shift needed to end the recession and the MPC.</p>
    <label for="pl-t" style="display:flex;justify-content:space-between"><span>AD shift needed</span><b class="pl-tv"></b></label><input type="range" id="pl-t" min="100" max="300" step="50" value="200">
    <label for="pl-m" style="display:flex;justify-content:space-between"><span>MPC</span><b class="pl-mv"></b></label><input type="range" id="pl-m" min="0.5" max="0.9" step="0.05" value="0.8">
    <label for="pl-c" style="display:flex;justify-content:space-between"><span>Crowding out <span class="small muted">(illustrative share of the boost lost)</span></span><b class="pl-cv"></b></label><input type="range" id="pl-c" min="0" max="50" step="10" value="0">
    <div class="derive pl-f"></div><div style="display:flex;justify-content:space-between;align-items:baseline;margin-top:8px"><span>Increase G by</span><span class="bignum pl-g"></span></div><p class="cap pl-cap" aria-live="polite"></p>`;
  const t = el.querySelector("#pl-t"), m = el.querySelector("#pl-m"), c = el.querySelector("#pl-c");
  const up = () => { const T = +t.value, M = +m.value, C = +c.value/100, mult = 1/(1-M), G = T/mult/(1-C);
    el.querySelector(".pl-tv").textContent = "$" + T + "b"; el.querySelector(".pl-mv").textContent = M.toFixed(2); el.querySelector(".pl-cv").textContent = c.value + "%";
    el.querySelector(".pl-f").innerHTML = `Multiplier = 1 ÷ (1 − ${M.toFixed(2)}) = <b>${+mult.toFixed(2)}</b><br>Without crowding out: $${T}b ÷ ${+mult.toFixed(2)} = <b>$${(T/mult).toFixed(1)}b</b>` + (C ? `<br>With ${c.value}% crowded out: $${(T/mult).toFixed(1)}b ÷ ${(1-C).toFixed(1)} = <b>$${G.toFixed(1)}b</b>` : "");
    el.querySelector(".pl-g").textContent = "$" + G.toFixed(1) + "b";
    el.querySelector(".pl-cap").innerHTML = C ? `Crowding out shrinks the impact of each dollar of G, so Congress must spend <b>more</b>: $${G.toFixed(1)}b instead of $${(T/mult).toFixed(1)}b.` : (T === 200 && M === 0.8 ? "The lecture’s answer: multiplier 5, so increase G by <b>$40b</b>. Now add crowding out." : `Each $1 of G shifts AD by $${+mult.toFixed(2)}, so Congress needs $${(T/mult).toFixed(1)}b.`); };
  [t,m,c].forEach(x => x.oninput = up); up();
}
function figLags(el){
  const ST = [
    {mark:0, cap:"Quarter 0: a recession starts. Output falls below its natural rate."},
    {mark:2, cap:"About quarter 2: the data confirm the recession. Policymakers decide to act, and Congress begins debating a stimulus."},
    {mark:5, cap:"Quarter 5: after months of legislation (fiscal) or waiting for investment plans to change (monetary takes at least 6 months), the policy finally starts to work."},
    {mark:7, cap:"But by now the economy is recovering on its own. The stimulus adds demand during a boom, pushing output <b>above</b> its natural rate. That’s why critics say active policy can <b>destabilize</b>."}
  ];
  stepper(el, {title:"The problem of long lags", n:() => ST.length, draw:(i, st) => {
    const w = 340, h = 190, L = 34, R = 12, T = 16, B = 30, X = q => L + q/10*(w-L-R), Y = v => T + (2.2 - v)/4.4*(h-T-B);
    const gap = q => -1.8*Math.sin(q/10*2*Math.PI*0.9), stim = q => q >= 5 ? 0.9*(1 - Math.exp(-(q-5)*0.8)) : 0;
    const pts = f => Array.from({length:101}, (_,k) => { const q = k/10; return `${X(q).toFixed(1)},${Y(f(q)).toFixed(1)}`; }).join(" ");
    const ev = [[0,"Recession starts"],[2,"Decision"],[5,"Policy bites"],[7,"Boom + stimulus"]].slice(0, i+1);
    st.innerHTML = `<svg class="chart" viewBox="0 0 ${w} ${h}" role="img" aria-label="Output gap over time with a delayed policy response">
      <line x1="${L}" y1="${Y(0)}" x2="${w-R}" y2="${Y(0)}" style="stroke:var(--muted);stroke-width:1"/><text x="${L-4}" y="${Y(0)+4}" text-anchor="end" class="sm">YN</text>
      <text x="${L+4}" y="${T+2}" class="sm mute">output vs natural rate</text><text x="${w-R}" y="${h-6}" text-anchor="end" class="sm mute">quarters →</text>
      <polyline points="${pts(gap)}" style="fill:none;stroke:var(--note);stroke-width:2.5"/>
      ${i >= 2 ? `<polyline points="${pts(q => gap(q) + stim(q))}" style="fill:none;stroke:var(--wrong);stroke-width:2.5;stroke-dasharray:6 4"/>` : ""}
      ${ev.map((e,k) => `<line x1="${X(e[0])}" y1="${T+6}" x2="${X(e[0])}" y2="${h-B}" style="stroke:var(--gold);stroke-width:1.5;stroke-dasharray:3 3"/><text x="${X(e[0])+3}" y="${h-B+14}" class="sm" style="font-weight:700">${e[0]}</text>`).join("")}
    </svg><div class="legend" style="justify-content:flex-start;margin-top:4px"><span><i style="background:var(--note)"></i>without policy</span>${i >= 2 ? `<span><i style="background:var(--wrong)"></i>with delayed stimulus</span>` : ""}</div>
    <div class="chain" style="margin-top:8px">${ev.map((e,k) => (k ? "→" : "") + `<span class="chip">${e[1]}</span>`).join("")}</div>`;
    return ST[i].cap;
  }});
}
function figAuto(el){
  let mode = "rec";
  el.innerHTML = `<div class="figt">Automatic stabilizers</div><div class="seg" role="group" aria-label="Phase"><button type="button" aria-pressed="true" data-m="rec">Recession</button><button type="button" aria-pressed="false" data-m="boom">Boom</button></div><div class="au-b"></div>`;
  const draw = () => { const rec = mode === "rec";
    el.querySelector(".au-b").innerHTML = `<div class="orgrow"><div class="node"><div style="font-size:26px">🧾</div><b>Tax system</b><small>Incomes ${rec ? "fall" : "rise"}, so tax payments ${rec ? "<b>fall</b> automatically" : "<b>rise</b> automatically"}</small></div>
      <div class="node"><div style="font-size:26px">🏛️</div><b>Government spending</b><small>${rec ? "More people claim unemployment insurance and welfare: spending <b>rises</b>" : "Fewer people claim benefits: spending <b>falls</b>"}</small></div></div>
      <p class="cap">${rec ? "Both <b>support</b> aggregate demand during the recession, with no new law and no lag for Congress to act." : "Both <b>restrain</b> aggregate demand during the boom, automatically."}</p>`; };
  el.querySelectorAll(".seg button").forEach(b => b.onclick = () => { mode = b.dataset.m; el.querySelectorAll(".seg button").forEach(x => x.setAttribute("aria-pressed", x === b)); draw(); });
  draw();
}

/* ---------- lessons ---------- */
const STEPS = [
 { title:"Liquidity preference: what sets r", html:`
   <p>Earlier lectures covered the <b>long-run</b> effects of policy. This one is about the <b>short run</b>, where fiscal and monetary policy work through aggregate demand.</p>
   <p>The interest-rate effect is the most important reason AD slopes down in the U.S. To understand it, we need a theory of the interest rate: the ${g("Theory of liquidity preference","theory of liquidity preference")}.</p>
   <div class="stack">
     <div class="info"><b>${g("Money supply (liquidity preference)","Money supply")}</b><span>Fixed by the central bank. It doesn’t depend on r: a vertical line.</span></div>
     <div class="info"><b>${g("Money demand","Money demand")}</b><span>Households hold wealth as <b>money</b> (liquid, no interest) or <b>bonds</b> (interest, less liquid). Money demand depends on Y, r and P.</span></div>
   </div>
   <div class="fig" data-fig="md"></div>
   <div class="fig" data-fig="mm"></div>`,
   check:[
    {id:"c1a", q:"Why does money demand fall when the interest rate rises?", a:1,
     o:[["Because people have less income","Income is held constant here. What changed is the reward for holding bonds."],["Because r is the opportunity cost of holding money","Correct. Higher r makes bonds more attractive."],["Because the Fed reduces the money supply","That’s supply. The question is about demand."]],
     hint:"What do you give up by holding cash instead of bonds?", more:"That’s why money demand slopes downward."},
    {id:"c1b", q:"The price level rises, with Y and r unchanged. Money demand…", a:0,
     o:[["Rises","Correct. The same goods now cost more dollars."],["Falls","Do people need more or fewer dollars when prices are higher?"],["Doesn’t change","P is one of the three things money demand depends on."]],
     hint:"Same shopping list, higher prices. How much cash do you need?", more:"This sets up the interest-rate effect in Lesson 2."}
   ]},
 { title:"The interest-rate effect", html:`
   <p>Now connect the money market to aggregate demand. Watch both panels together.</p>
   <div class="fig" data-fig="ire"></div>
   <div class="formula">P ↓ → MD ↓ → r ↓ → I ↑ → quantity of goods demanded ↑</div>
   <p class="small muted">This is a movement <b>along</b> AD, because the price level caused it.</p>`,
   check:[
    {id:"c2a", q:"The price level falls. In the money market, what happens to r?", a:2,
     o:[["It rises, because money demand rises","Lower prices mean people need fewer dollars, not more."],["It doesn’t change, because MS is fixed","MS is fixed, but MD moved."],["It falls, because money demand falls","Correct."]],
     hint:"Step 2 of the diagram.", more:"Then investment rises."},
    {id:"c2b", q:"The interest-rate effect shows up in the AD diagram as…", a:0,
     o:[["A movement along the AD curve","Correct. P caused it, so it’s along the curve."],["A shift of AD to the right","Only changes not caused by P shift AD."],["A shift of SRAS","This is about demand, not supply."]],
     hint:"What started the chain?", more:"Monetary policy, in contrast, shifts AD."}
   ]},
 { title:"Monetary policy and aggregate demand", html:`
   <p>The Fed can use ${g("Monetary policy","monetary policy")} to shift AD. In the lecture, its instrument is the money supply, changed through open-market operations. The news usually reports that the Fed targets the ${g("Federal funds rate","federal funds rate")}: to hit it, the Fed changes MS.</p>
   <div class="fig" data-fig="monpol"></div>
   ${tn("The Fed’s instrument is the money supply; it changes MS with open-market operations to move the interest rate.","The Fed now sets a target range for the federal funds rate and steers it mainly by setting the interest rate it pays banks on their reserves, with reserves kept ‘ample.’ The direction is the same: higher rates reduce AD, lower rates raise it.")}`,
   check:[
    {id:"c3a", q:"The Fed reduces the money supply. In the short run…", a:1,
     o:[["r falls and AD shifts right","Less money supplied makes money scarcer. Does that lower r?"],["r rises and AD shifts left","Correct."],["r rises but AD doesn’t move","Higher r cuts investment at every price level."]],
     hint:"Follow the step-through with ‘Fed reduces MS.’", more:"This is contractionary monetary policy."},
    {id:"c3b", q:"Why does monetary policy shift AD, while a change in P only moves along it?", a:2,
     o:[["Because the Fed controls prices","The Fed controls money, not prices directly."],["Because monetary policy changes G","Monetary policy works through r and investment."],["Because the change in r isn’t caused by the price level","Correct. Anything other than P that changes spending shifts AD."]],
     hint:"Recall Lecture 10: what shifts AD?", more:"Same diagram, different cause."}
   ]},
 { title:"Using monetary policy to stabilize", html:`
   <p>The Fed can lean <b>against</b> shocks: expand when output is falling, contract when it’s overheating.</p>
   <div class="fig" data-fig="stab"></div>
   <h3>Liquidity traps</h3>
   <p>Monetary policy works by lowering interest rates. In a ${g("Liquidity trap","liquidity trap")}, rates are already at zero and can’t fall further. The central bank still has options: raise inflation expectations (making real rates negative), or buy other assets such as mortgages and corporate debt to lower those rates. The Fed did this in 2008–2009.</p>
   ${tn("The Fed bought mortgages and other assets in 2008–2009 when rates hit zero.","The Fed kept its policy rate near zero from late 2008 to 2015, and again from 2020 to 2022 during the pandemic, buying large amounts of Treasury and mortgage-backed securities both times.")}`,
   check:[
    {id:"c4a", q:"A stock market boom pushes output above its natural rate. To stabilize, the Fed should…", a:0,
     o:[["Reduce MS and raise r","Correct. That cools AD."],["Increase MS and lower r","That would push output even higher."],["Do nothing, since booms are good","Output above its natural rate leads to rising inflation."]],
     hint:"Lean against the shock.", more:"Active Learning 2, part B."},
    {id:"c4b", q:"In a liquidity trap, conventional monetary policy is limited because…", a:2,
     o:[["The Fed can’t buy any assets","It can buy other assets, like mortgages."],["Prices can’t change","Prices can still change."],["Nominal interest rates are already at zero and can’t be cut further","Correct."]],
     hint:"What does conventional policy usually do to rates?", more:"That’s why the Fed used asset purchases in 2008–2009."}
   ]},
 { title:"Fiscal policy and aggregate demand", html:`
   <p>${g("Fiscal policy")} is the government’s choice of spending (G) and taxes (T).</p>
   <div class="stack">
     <div class="info"><b>${g("Expansionary fiscal policy","Expansionary")}</b><span>G ↑ and/or T ↓ → AD shifts right.</span></div>
     <div class="info"><b>${g("Contractionary fiscal policy","Contractionary")}</b><span>G ↓ and/or T ↑ → AD shifts left.</span></div>
   </div>
   <div class="fig" data-fig="fsort"></div>
   <p><b>Taxes:</b> a tax cut raises take-home pay, so households spend more and AD shifts right. How much depends on the multiplier, crowding out, and whether households see the cut as ${g("Permanent vs temporary tax cut","permanent or temporary")}: a permanent cut raises spending more.</p>
   <p>Fiscal policy has two effects on AD that pull in opposite directions: the <b>multiplier effect</b> (next lesson) and the <b>crowding-out effect</b> (the one after).</p>`,
   check:[
    {id:"c5a", q:"Which is contractionary fiscal policy?", a:1,
     o:[["A tax cut","Lower taxes raise spending: expansionary."],["A cut in government purchases","Correct. AD shifts left."],["The Fed raising interest rates","That’s monetary policy, not fiscal."]],
     hint:"Fiscal = G and T. Which choice lowers G or raises T?", more:"Contractionary fiscal policy shifts AD left."},
    {id:"c5b", q:"Which tax cut will shift AD the most?", a:0,
     o:[["A permanent tax cut","Correct. Households expect higher income for years, so they spend more."],["A one-time temporary tax cut of the same size","People tend to save more of a one-time windfall."],["They have the same effect","Expectations about the future matter."]],
     hint:"Would you change your spending more for a one-time bonus or a permanent raise?", more:"Expectations shape how consumers respond."}
   ]},
 { title:"The multiplier effect", html:`
   <p>If the government buys $20 billion of planes from Boeing, Boeing’s workers and owners earn $20 billion more. They spend part of it, which becomes someone else’s income, and so on. That’s the ${g("Multiplier effect","multiplier effect")}.</p>
   <p>Its size depends on the ${g("Marginal propensity to consume","marginal propensity to consume")} (MPC): the share of extra income people spend.</p>
   <div class="fig" data-fig="mult"></div>
   <h3>Where the formula comes from</h3>
   <div class="derive">ΔY = ΔC + ΔG &nbsp;&nbsp;(I and NX don’t change)<br>ΔY = MPC × ΔY + ΔG<br>ΔY × (1 − MPC) = ΔG<br><b>ΔY = ΔG × 1/(1 − MPC)</b></div>
   <div class="stack">${[[0.5,2],[0.75,4],[0.9,10]].map(r => kv("MPC = " + r[0], "multiplier = " + r[1])).join("")}</div>
   <p>The multiplier works for any spending change. If a recession overseas cuts U.S. net exports by $10 billion, AD falls by $10 billion at first, then by more as lower incomes cut consumption.</p>`,
   check:[
    {id:"c6a", q:"If MPC = 0.75, the multiplier is…", a:2,
     o:[["0.75","That’s the MPC itself."],["1.33","That’s 1 ÷ 0.75. The formula uses 1 − MPC."],["4","Correct. 1 ÷ (1 − 0.75) = 1 ÷ 0.25 = 4."]],
     hint:"1 ÷ (1 − MPC).", more:"Each $1 of G raises AD by $4."},
    {id:"c6b", q:"A bigger MPC makes the multiplier…", a:0,
     o:[["Bigger","Correct. People spend more of each round, so the rounds stay large."],["Smaller","Slide the MPC up and watch the total."],["Unchanged","The multiplier depends on the MPC."]],
     hint:"Try MPC 0.5 vs 0.9 in the rounds graphic.", more:"MPC 0.9 gives a multiplier of 10."}
   ]},
 { title:"The crowding-out effect", html:`
   <p>Fiscal policy also has an effect in the <b>opposite</b> direction: the ${g("Crowding-out effect","crowding-out effect")}.</p>
   <div class="fig" data-fig="crowd"></div>
   <p>So the AD shift can end up <b>larger</b> than the fiscal change (multiplier) or <b>smaller</b> (crowding out), depending on which is stronger.</p>
   <div class="fig" data-fig="planner"></div>`,
   check:[
    {id:"c7a", q:"Why does a fiscal expansion raise the interest rate?", a:1,
     o:[["Because the Fed always raises rates when G rises","In this model the Fed holds MS fixed; the rise comes from the market."],["Higher income raises money demand, and with MS fixed, r rises","Correct."],["Because taxes rise","The expansion here is higher G, not higher taxes."]],
     hint:"Step 3 of the crowding-out diagram.", more:"Higher r then reduces investment."},
    {id:"c7b", q:"AD must shift right by $200b and MPC = 0.8. With crowding out, Congress should raise G by…", a:2,
     o:[["Exactly $40b","$40b is the answer with no crowding out."],["Less than $40b","Crowding out shrinks each dollar’s impact. Do you need more or less?"],["More than $40b","Correct. Crowding out offsets part of the boost."]],
     hint:"Move the crowding-out slider in the planner.", more:"Active Learning 3."}
   ]},
 { title:"Fiscal policy and aggregate supply", html:`
   <p>Most economists think fiscal policy mainly works through demand in the short run. But it may also affect <b>supply</b>.</p>
   <div class="stack">
     <div class="info"><b>Tax cuts and incentives</b><span>People respond to incentives. A lower tax rate may make people work more, raising the quantity supplied and shifting AS right. Economists who think this effect is large are called ${g("Supply-siders","supply-siders")}.</span></div>
     <div class="info"><b>Government spending on roads</b><span>Better roads may raise business productivity and shift AS right. This is probably more relevant in the long run: roads take time to build.</span></div>
   </div>`,
   check:[
    {id:"c8a", q:"Supply-siders believe that a tax cut…", a:1,
     o:[["Only affects aggregate demand","That’s the mainstream short-run view, not the supply-side view."],["Raises the incentive to work enough to shift AS right significantly","Correct."],["Lowers aggregate supply","They argue it raises supply."]],
     hint:"Supply-siders focus on incentives.", more:"Most economists think the demand effect dominates in the short run."},
    {id:"c8b", q:"Why is the supply effect of road spending mostly a long-run effect?", a:0,
     o:[["Roads take time to build and put into use","Correct."],["Roads reduce productivity","Better roads raise productivity."],["Because of crowding out","Crowding out affects demand, not this supply effect."]],
     hint:"How quickly can a new highway open?", more:"In the short run, road spending works mainly through demand."}
   ]},
 { title:"Should policy try to stabilize?", html:`
   <p>Since the Employment Act of 1946, stabilizing the economy has been a goal of U.S. policy. But economists debate how active it should be.</p>
   <div class="stack">
     <div class="info"><b>The case for</b><span>Keynes: “animal spirits” swing households and firms between optimism and pessimism. Booms and recessions abroad and stock market swings add more. ${g("Active stabilization policy","Active policy")} expands when GDP is below its natural rate and contracts when above. Kennedy (1961 tax cut) and Obama (2009 spending and tax cuts) followed this view.</span></div>
     <div class="info"><b>The case against</b><span>${g("Policy lags","Long lags")}: monetary policy takes at least 6 months to affect output, and fiscal changes need acts of Congress that can take months or years. Policy may arrive too late.</span></div>
   </div>
   <div class="fig" data-fig="lags"></div>
   <p>${g("Automatic stabilizers")} avoid the lag problem:</p>
   <div class="fig" data-fig="auto"></div>
   <p><b>Conclusion:</b> policymakers must weigh all the effects. A tax cut affects short-run demand and long-run saving and growth; slowing money growth lowers long-run inflation but can cost output and jobs in the short run.</p>
   ${tn("Kennedy’s 1961 tax cut and Obama’s 2009 stimulus as examples of active policy.","In 2020–2021, Congress passed several very large relief packages during the pandemic, while the Fed cut rates to near zero: active stabilization on a much bigger scale.")}`,
   check:[
    {id:"c9a", q:"Critics of active stabilization policy mainly worry that…", a:2,
     o:[["Policy has no effect at all","They accept policy has effects; the issue is timing."],["Automatic stabilizers are too strong","They generally support automatic stabilizers."],["Long lags mean policy may hit when the economy has already changed","Correct."]],
     hint:"Look at the lags step-through.", more:"They prefer focusing on long-run goals like growth and low inflation."},
    {id:"c9b", q:"Which is an automatic stabilizer?", a:1,
     o:[["A stimulus bill passed by Congress","That needs a deliberate decision."],["Unemployment insurance payments rising in a recession","Correct. No new law needed."],["The Fed cutting interest rates","That’s a deliberate monetary policy choice."]],
     hint:"Which one happens with no new decision?", more:"Falling tax payments in a recession are another."}
   ]}
];
const FIGS = { md:figMD, mm:figMM, ire:figIRE, monpol:figMonPol, stab:figStabilize, fsort:figFiscalSort, mult:figMult, crowd:figCrowd, planner:figPlanner, lags:figLags, auto:figAuto };

/* ---------- self-check ---------- */
const QUIZ = [
 {id:"q1", L:0, q:"In the theory of liquidity preference, the interest rate adjusts to balance…", a:1, hint:"Liquidity = money.", o:[["Saving and investment","That’s the long-run loanable funds model."],["Money supply and money demand","Right."],["Exports and imports","That’s net exports."],["AD and AS","Those set P and Y."]], more:"It’s Keynes’ theory of the short-run interest rate."},
 {id:"q2", L:0, q:"In this theory, the money supply curve is vertical because…", a:3, hint:"Who decides how much money exists?", o:[["People always hold the same amount of money","That describes demand, and it isn’t true."],["Interest rates never change","r changes when MD or MS shifts."],["Bonds pay no interest","Bonds do pay interest."],["The Fed fixes it, regardless of r","Right."]], more:"Shifts in MS are the Fed’s policy."},
 {id:"q3", L:0, q:"Which would increase money demand?", a:0, hint:"Y, r or P: which way does each move MD?", o:[["A rise in real income","Right. More purchases need more money."],["A rise in the interest rate","That lowers the quantity of money demanded."],["A fall in the price level","That lowers money demand."],["A fall in real income","That lowers money demand."]], more:"Higher Y or P raises money demand; higher r lowers it."},
 {id:"q4", L:0, q:"The opportunity cost of holding money is…", a:2, hint:"What do you give up by not owning bonds?", o:[["The price level","P affects how much money you need, not its cost."],["Inflation only","Inflation matters, but the lecture uses r."],["The interest rate","Right."],["Zero","Holding money means giving up interest."]], more:"That’s why MD slopes down."},
 {id:"q5", L:1, q:"The interest-rate effect says a lower price level leads to…", a:1, hint:"P ↓ → MD ↓ → r ? → I ?", o:[["Higher r and lower investment","Lower P reduces money demand, lowering r."],["Lower r and higher investment","Right."],["A shift of AD to the left","It’s a movement along AD."],["No change in investment","Investment responds to r."]], more:"The most important reason AD slopes down in the U.S."},
 {id:"q6", L:2, q:"To raise interest rates in the lecture’s framework, the Fed…", a:0, hint:"Make money scarcer.", o:[["Reduces the money supply through open-market operations","Right."],["Increases the money supply","That lowers rates."],["Raises taxes","That’s fiscal policy."],["Increases government spending","That’s fiscal policy."]], more:"Selling bonds drains money."},
 {id:"q7", L:2, q:"An increase in the money supply, in the short run…", a:2, hint:"MS right → r ? → AD ?", o:[["Raises r and shifts AD left","More money lowers r."],["Lowers r but doesn’t affect AD","Lower r raises investment."],["Lowers r and shifts AD right","Right."],["Only raises the price level","That’s the long-run quantity theory."]], more:"Expansionary monetary policy."},
 {id:"q8", L:2, q:"News reports say the Fed “targets the federal funds rate.” That rate is…", a:3, hint:"Who lends to whom?", o:[["The rate on mortgages","Mortgages are long-term household loans."],["The rate the Treasury pays","That’s a bond yield."],["The rate on savings accounts","That’s set by each bank."],["The rate banks charge each other on short-term loans","Right."]], more:"The Fed moves it with open-market operations."},
 {id:"q9", L:3, q:"Congress cuts spending to balance the budget. To stabilize output, the Fed should…", a:0, hint:"Lean against the shock.", o:[["Increase MS and lower r","Right. That offsets the drop in AD."],["Reduce MS and raise r","That would deepen the slowdown."],["Raise taxes","That’s not the Fed’s tool."],["Do nothing","Output would fall."]], more:"Active Learning 2, part A."},
 {id:"q10", L:3, q:"Oil prices soar because of war. To stabilize output, the Fed would…", a:1, hint:"Output falls after a supply shock.", o:[["Reduce MS and raise r","That would cut output further."],["Increase MS and lower r, accepting higher prices","Right."],["Cut government spending","Not a Fed tool."],["Fix the price of oil","The Fed doesn’t set oil prices."]], more:"Supply shocks create a tradeoff between output and prices."},
 {id:"q11", L:3, q:"A liquidity trap occurs when…", a:2, hint:"Rates can’t go lower.", o:[["Interest rates are very high","The problem is rates that are too low to cut."],["People hold no money","People hold plenty of money."],["The interest rate is zero","Right."],["The Fed stops trading bonds","The Fed can still trade, even other assets."]], more:"The Fed bought mortgages and other assets in 2008–2009."},
 {id:"q12", L:4, q:"Expansionary fiscal policy is…", a:1, hint:"G and T.", o:[["A decrease in G or an increase in T","That’s contractionary."],["An increase in G and/or a decrease in T","Right."],["The Fed lowering rates","That’s monetary policy."],["Balancing the budget","That usually means cutting G or raising T."]], more:"It shifts AD right."},
 {id:"q13", L:5, q:"If MPC = 0.9, the multiplier is…", a:3, hint:"1 ÷ (1 − MPC).", o:[["0.9","That’s the MPC."],["1.11","That’s 1 ÷ 0.9."],["9","Close: check 1 ÷ 0.1."],["10","Right."]], more:"A bigger MPC means a bigger multiplier."},
 {id:"q14", L:5, q:"MPC = 0.8 and G rises by $20b. With no crowding out, AD shifts right by…", a:2, hint:"Multiplier first: 1 ÷ 0.2.", o:[["$16b","That’s only the first round of consumption."],["$20b","That’s the initial shift before the multiplier."],["$100b","Right. $20b × 5."],["$25b","That’s $20b ÷ 0.8."]], more:"Each round is 80% of the last."},
 {id:"q15", L:5, q:"The multiplier also applies when…", a:0, hint:"Any component of spending.", o:[["A recession abroad cuts U.S. net exports","Right. The initial drop gets amplified."],["Only government spending changes","It applies to any spending change."],["The price level changes","Price changes move along AD."],["Only taxes change","It applies more broadly."]], more:"A $10b drop in NX reduces AD by more than $10b."},
 {id:"q16", L:6, q:"The crowding-out effect happens because a fiscal expansion…", a:1, hint:"Follow the money market.", o:[["Lowers interest rates","It raises them."],["Raises money demand and r, which reduces investment","Right."],["Raises the MPC","The MPC doesn’t change."],["Shifts SRAS left","Crowding out is about demand."]], more:"It dampens the AD shift."},
 {id:"q17", L:6, q:"AD needs to shift right $200b, MPC = 0.8, no crowding out. Congress should raise G by…", a:1, hint:"$200b ÷ multiplier.", o:[["$200b","Ignores the multiplier."],["$40b","Right. 5 × $40b = $200b."],["$160b","That’s 80% of $200b."],["$1,000b","That multiplies instead of divides."]], more:"With crowding out, more than $40b."},
 {id:"q18", L:7, q:"Supply-siders argue that tax cuts…", a:3, hint:"Incentives.", o:[["Only shift AD","That’s the mainstream short-run view."],["Reduce aggregate supply","They argue the opposite."],["Have no effect","They think the effect is large."],["Increase the incentive to work, shifting AS right","Right."]], more:"Most economists see the demand effect as dominant in the short run."},
 {id:"q19", L:8, q:"Monetary policy affects output and employment with a lag of at least…", a:2, hint:"From the lecture.", o:[["One day","Investment plans take time."],["One week","Much longer."],["6 months","Right."],["10 years","Not that long."]], more:"Fiscal policy can take months or years to pass."},
 {id:"q20", L:8, q:"Which is NOT an automatic stabilizer?", a:3, hint:"Which one requires a new decision?", o:[["Tax payments falling in a recession","That’s automatic."],["Unemployment insurance rising in a recession","That’s automatic."],["Welfare spending rising in a recession","That’s automatic."],["A new stimulus bill passed by Congress","Right. It needs deliberate action."]], more:"Automatic stabilizers avoid legislative lags."}
];
const ROUNDS = [["Round 1","Liquidity preference",0],["Round 2","Monetary policy",5],["Round 3","Stabilization and fiscal policy",10],["Round 4","Multiplier, crowding out, debate",15],["Mixed round","5 random questions",-1],["My weak spots","Questions you’ve missed before, mixed up",-2],["Multiplier drills","Multiplier and policy problems with new numbers",-3]];
function genDrill(){
  const pick = a => a[Math.floor(Math.random()*a.length)];
  const kind = Math.floor(Math.random()*3), M = pick([0.5,0.6,0.75,0.8,0.9]), mult = +(1/(1-M)).toFixed(2);
  let q, o, L, hint;
  if (kind === 0){ q = `If MPC = ${M}, what is the spending multiplier?`; L = 5; hint = "1 ÷ (1 − MPC).";
    o = [[String(mult),`Right. 1 ÷ (1 − ${M}) = ${mult}.`],[String(+(1/M).toFixed(2)),"That’s 1 ÷ MPC. The formula divides by 1 − MPC."],[String(M),"That’s the MPC itself."],[String(+(1-M).toFixed(2)),"That’s 1 − MPC. Now divide 1 by it."]]; }
  else if (kind === 1){ const G = pick([10,20,30,40,50]); q = `MPC = ${M} and government purchases rise by $${G}b. With no crowding out, how much does AD shift?`; L = 5; hint = "ΔY = ΔG × 1/(1 − MPC).";
    o = [["$" + +(G*mult).toFixed(1) + "b",`Right. $${G}b × ${mult}.`],["$" + G + "b","That’s just the first round."],["$" + +(G*M).toFixed(1) + "b","That’s only the first round of consumption."],["$" + +(G/M).toFixed(1) + "b","That divides by the MPC instead of multiplying by 1/(1 − MPC)."]]; }
  else { const T = pick([100,150,200,250,300]); q = `AD needs to shift right by $${T}b and MPC = ${M}. With no crowding out, how much should G rise?`; L = 6; hint = "ΔG = target ÷ multiplier.";
    o = [["$" + +(T/mult).toFixed(1) + "b",`Right. $${T}b ÷ ${mult}.`],["$" + T + "b","That ignores the multiplier."],["$" + +(T*mult).toFixed(1) + "b","That multiplies; you need to divide."],["$" + +(T*M).toFixed(1) + "b","Use the multiplier, not the MPC."]]; }
  const seen = new Set(); o = o.filter(x => !seen.has(x[0]) && seen.add(x[0]));
  return {id:"gen", gen:true, L, q, o, a:0, hint, more:"New numbers every round."};
}

/* ---------- short answers ---------- */
const WRITE = [
 {q:"Explain the theory of liquidity preference: what are money supply and money demand, and what determines money demand?",
  keys:[["r balances money supply and demand",/balanc.{0,40}(money|supply|demand)|equilibrium/i],["MS fixed by the Fed (vertical)",/(fixed|vertical|set).{0,40}(fed|central bank)|fed.{0,30}(fix|set)/i],["Money vs bonds: liquidity vs interest",/bond/i],["MD depends on Y, r and P (with directions)",/(income|y\b).{0,80}(interest|r\b).{0,80}(price|p\b)|opportunity cost/i]],
  model:"In the theory of liquidity preference, the interest rate adjusts to balance the supply of and demand for money. The money supply is fixed by the Fed and doesn’t depend on the interest rate, so it is vertical. Money demand reflects how much wealth people want to hold as money, which is liquid but pays no interest, instead of bonds, which pay interest. Money demand rises with real income and the price level, because people need more money for purchases, and falls with the interest rate, which is the opportunity cost of holding money."},
 {q:"Explain the interest-rate effect step by step, and why it is a movement along the AD curve.",
  keys:[["P falls → money demand falls",/(price|p\b).{0,30}(fall|lower|decreas).{0,60}money demand/i],["r falls",/(interest|r\b).{0,20}(fall|lower|decreas)/i],["Investment rises",/invest.{0,20}(rise|increas)/i],["Movement along AD (caused by P)",/along/i]],
  model:"When the price level falls, people need less money to buy goods, so money demand falls. With the money supply fixed, the interest rate falls. A lower interest rate makes borrowing cheaper, so investment rises and the quantity of goods and services demanded rises. Because the price level started the chain, this is a movement along the AD curve, not a shift."},
 {q:"Using the money market and AD diagrams, explain how the Fed can reduce aggregate demand.",
  keys:[["Open-market operations reduce MS",/(reduc|decreas|lower|sell).{0,40}(money supply|ms\b|bonds)/i],["r rises",/(interest|r\b).{0,20}(rise|increas|higher)/i],["Investment falls",/invest.{0,20}(fall|decreas|lower)/i],["AD shifts left",/ad.{0,20}(shift.{0,10})?left|shifts left/i]],
  model:"The Fed reduces the money supply through open-market operations, selling bonds. In the money market, the vertical money supply curve shifts left, so the interest rate rises. The higher interest rate reduces investment at every price level, so the aggregate-demand curve shifts left, lowering output in the short run."},
 {q:"For a stock market boom and for an oil price shock, describe the short-run effect on output and how the Fed should respond to stabilize output.",
  keys:[["Boom raises AD and output",/boom.{0,80}(rise|increas|above|raise)/i],["Fed reduces MS / raises r for the boom",/(reduc|decreas|lower).{0,20}(money supply|ms\b)|rais.{0,20}(interest|r\b)/i],["Oil shock reduces AS and output",/oil.{0,80}(supply|as\b).{0,40}(fall|reduc|decreas|left)|output.{0,20}fall/i],["Fed increases MS / lowers r for the oil shock (higher prices)",/(increas|rais).{0,20}(money supply|ms\b)|lower.{0,20}(interest|r\b)/i]],
  model:"A stock market boom increases household wealth and consumption, shifting AD right and pushing output above its natural rate. To stabilize, the Fed should reduce the money supply and raise interest rates to cool demand. An oil price shock reduces aggregate supply, so output falls. To stabilize output, the Fed should increase the money supply and lower interest rates to raise aggregate demand, though this means accepting a higher price level."},
 {q:"Explain the multiplier effect, derive the multiplier formula, and calculate the effect of a $20 billion increase in G when MPC = 0.8.",
  keys:[["Extra income → extra consumption → more income",/(income|wages|profit).{0,80}(spend|consum)/i],["MPC definition",/marginal propensity|mpc/i],["ΔY = ΔG / (1 − MPC)",/1\s?\/\s?\(?1\s?(−|-)\s?mpc|1 ?÷ ?\(?1 ?(−|-) ?mpc/i],["$20b × 5 = $100b",/100/]],
  model:"When the government buys $20 billion of planes, Boeing’s workers and owners receive $20 billion of income and spend part of it, which becomes income for others, who spend part of it again. The marginal propensity to consume (MPC) is the fraction of extra income spent. Since ΔY = ΔC + ΔG and ΔC = MPC × ΔY, ΔY = ΔG × 1/(1 − MPC). With MPC = 0.8, the multiplier is 1/0.2 = 5, so a $20 billion increase in G shifts AD right by $100 billion."},
 {q:"Explain the crowding-out effect using the money market and AD diagrams.",
  keys:[["G rises → AD shifts right / income rises",/(g\b|government).{0,60}(ad|income)/i],["Higher income raises money demand",/money demand.{0,20}(rise|increas)|md.{0,20}(rise|increas|right)/i],["r rises, investment falls",/(interest|r\b).{0,20}(rise|increas).{0,80}invest/i],["Net AD shift is smaller",/smaller|dampen|offset|reduc.{0,30}(shift|effect)/i]],
  model:"An increase in government spending shifts AD right and raises income. Higher income increases money demand, shifting the money demand curve right. With the money supply fixed, the interest rate rises. The higher interest rate reduces investment, which shifts AD partly back to the left. So the net increase in aggregate demand is smaller than it would be without crowding out."},
 {q:"The economy needs AD to shift right by $200 billion and MPC = 0.8. How much should G rise with no crowding out, and what changes if there is crowding out?",
  keys:[["Multiplier = 5",/\b5\b/],["G should rise $40 billion",/40/],["Crowding out reduces each dollar’s impact",/crowd/i],["So G must rise by more",/more|larger|greater|bigger/i]],
  model:"With MPC = 0.8 the multiplier is 1/(1 − 0.8) = 5, so with no crowding out Congress should increase G by $40 billion, since 5 × $40 billion = $200 billion. Crowding out raises interest rates and reduces investment, shrinking the impact of each dollar of G on AD, so Congress would need to increase G by more than $40 billion."},
 {q:"Summarize the debate over active stabilization policy and explain how automatic stabilizers work.",
  keys:[["Case for: animal spirits / fluctuations are costly",/animal spirits|keynes|fluctuat/i],["Case against: long lags",/lag/i],["Policy may destabilize",/destabiliz|too late|changed/i],["Automatic stabilizers: taxes fall, benefits rise in recessions",/(tax).{0,40}(fall|decreas|lower).{0,80}(unemployment|welfare|benefit|insurance)|(unemployment|welfare).{0,40}(rise|increas)/i]],
  model:"Supporters of active stabilization, following Keynes, argue that waves of optimism and pessimism (animal spirits) and shocks such as recessions abroad cause costly fluctuations, so policymakers should expand when output is below its natural rate and contract when it is above. Critics argue that policy works with long lags: monetary policy takes at least six months, and fiscal changes need legislation that can take months or years, so policy may arrive after conditions have changed and end up destabilizing the economy. Automatic stabilizers avoid these lags: in a recession, tax payments fall and spending on unemployment insurance and welfare rises automatically, supporting aggregate demand without any new decisions."}
];
const WTAG = [0,1,2,3,5,6,6,8];
