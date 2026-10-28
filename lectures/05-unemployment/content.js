/* Lecture 5: Unemployment and Its Natural Rate — lab content (loaded after assets/lab.js) */

const CARDS = [
 ["Natural rate of unemployment","The unemployment rate the economy has in normal times, even without a recession. The long-run rate.","Around 5% in the lecture."],
 ["Cyclical unemployment","The extra unemployment above the natural rate during recessions. Short-run fluctuations.",""],
 ["Current Population Survey","The BLS’s monthly survey of about 60,000 households, used to measure unemployment.",""],
 ["Employed","Paid full- or part-time workers, the self-employed, and people temporarily absent (illness, vacation).",""],
 ["Unemployed","Not employed, available for work, and looked for a job in the past four weeks; or temporarily laid off awaiting recall.",""],
 ["Not in the labor force","Everyone else 16 and over: students, homemakers, retirees, discouraged workers.",""],
 ["Labor force","Employed + unemployed.","139.9 + 14.3 = 154.2 million (2009)."],
 ["Unemployment rate","Unemployed ÷ labor force × 100.","14.3 ÷ 154.2 = 9.3% (2009)."],
 ["Labor force participation rate","Labor force ÷ adult population × 100.","154.2 ÷ 235.9 = 65.4% (2009)."],
 ["Discouraged worker","Someone who wants a job but has given up looking. Counted as out of the labor force, which lowers the unemployment rate.",""],
 ["Spell paradox","Most spells of unemployment are short, yet most unemployment observed at any moment is long-term.",""],
 ["Frictional unemployment","Unemployment from the time it takes workers to find jobs that best suit them. The jobs exist; finding them takes time.",""],
 ["Structural unemployment","Unemployment because there aren’t enough jobs for everyone who wants one, often because wages are above equilibrium.",""],
 ["Job search","The process by which workers find appropriate jobs given their tastes and skills.",""],
 ["Sectoral shifts","Changes in demand across industries or regions that cause layoffs in some and hiring in others.","Oil prices rise: energy hires, airlines lay off."],
 ["Unemployment insurance","Government program that partly protects workers’ incomes when they lose jobs. Reduces hardship but can lengthen job search.",""],
 ["Minimum-wage laws","Set a wage floor above equilibrium for some workers, causing a surplus of labor: structural unemployment, especially for teenagers.",""],
 ["Union","An association of workers that bargains with employers over wages, benefits and conditions (collective bargaining), and can strike.","Raises members’ wages 10–20%."],
 ["Insiders and outsiders","Union members (insiders) gain higher wages; outsiders are hurt because fewer workers are hired.",""],
 ["Efficiency wages","Above-equilibrium wages firms choose to pay to raise productivity: health, turnover, quality, effort.","Henry Ford’s $5 day in 1914."]
];
const CNOTE = {
 "Natural rate of unemployment":"🕒 Today: the CBO’s estimate is about 4.4%, lower than the 5.2% in the lecture.",
 "Union":"🕒 Today: about 10% of U.S. workers are union members."
};
const TB = new Set(["c5a","c5b","q12","q13"]);
const TODAY = {};

/* ---------- helpers ---------- */
const kv = (label, val) => `<div class="info" style="display:flex;justify-content:space-between;gap:10px;padding:8px 12px"><span style="color:var(--ink)">${label}</span><b style="margin:0;white-space:nowrap">${val}</b></div>`;
const numIn = (cls, val) => `<input type="text" class="${cls}" value="${val}" inputmode="decimal" autocomplete="off" style="width:100%;min-width:0;font:600 16px var(--sans);padding:6px 4px;text-align:center;border:1.5px solid var(--border);border-radius:8px;background:var(--surface);color:var(--ink)">`;
function sortActivity(el, title, sub, items, choices, hintFn){
  let k = 0, right = 0, first = true;
  el.innerHTML = `<div class="figt">${title}</div><p class="figsub">${sub}</p><div class="sbody"></div>`;
  const body = el.querySelector(".sbody");
  const draw = () => {
    if (k >= items.length){ body.innerHTML = `<div class="scen pop"><b>${right} of ${items.length}</b> on the first try.</div><button class="btn ghost" type="button">Try again</button>`; body.querySelector("button").onclick = () => { k = 0; right = 0; draw(); }; return; }
    first = true;
    body.innerHTML = `<div class="tally"><span>${k+1} of ${items.length}</span><span>${right} right</span></div><div class="scen pop">${items[k][0]}</div>
      <div class="choices" style="grid-template-columns:repeat(${Math.min(choices.length,3)},1fr)">${choices.map(c => `<button type="button" class="choice" data-z="${c[0]}">${c[1]}</button>`).join("")}</div><div class="fb"></div>`;
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

/* ---------- graphics ---------- */
function figClassify(el){
  sortActivity(el, "Employed, unemployed, or not in the labor force?", "How the BLS classifies each adult 16 and over.", [
    ["Maria works 15 hours a week at a café.","e","Part-time paid work counts as employed."],
    ["Dev is home with the flu this week, but has a full-time job.","e","Temporarily absent for illness or vacation: still employed."],
    ["Lee lost his job and sent out applications last week.","u","Not working, available, and looked within four weeks: unemployed."],
    ["A factory worker is laid off and waiting to be recalled.","u","Temporary layoffs awaiting recall count as unemployed."],
    ["Jo is a full-time college student not looking for work.","n","Students not seeking work are not in the labor force."],
    ["Sam retired last year.","n","Retirees are not in the labor force."],
    ["Kim wants a job but stopped looking months ago.","n","A discouraged worker isn’t searching, so isn’t counted as unemployed."],
    ["Ana runs her own small bakery.","e","Working in your own business counts as employed."]
  ], [["e","Employed"],["u","Unemployed"],["n","Not in labor force"]], (it, z) => z === "u" ? "To be unemployed you must be without work and have looked in the past four weeks (or be awaiting recall)." : z === "e" ? "Is this person doing paid work, or only temporarily absent from a job?" : "Is the person working, or actively looking for work?");
}
function figRates(el){
  const D0 = {E:139.9, U:14.3, N:81.7};
  el.innerHTML = `<div class="figt">Compute the unemployment and participation rates</div><p class="figsub">The lecture’s 2009 numbers (millions). Change any number.</p>
    <div class="orgrow" style="grid-template-columns:repeat(3,1fr)"><label class="small" style="text-align:center">Employed${numIn("rt-E", D0.E)}</label><label class="small" style="text-align:center">Unemployed${numIn("rt-U", D0.U)}</label><label class="small" style="text-align:center">Not in LF${numIn("rt-N", D0.N)}</label></div>
    <div class="rt-bar" style="display:flex;height:22px;border-radius:6px;overflow:hidden;margin:12px 0 4px"></div>
    <div class="legend" style="justify-content:flex-start;flex-wrap:wrap"><span><i style="background:var(--note)"></i>employed</span><span><i style="background:var(--wrong)"></i>unemployed</span><span><i style="background:var(--border)"></i>not in labor force</span></div>
    <div class="derive rt-f" style="margin-top:10px"></div><button type="button" class="btn ghost rt-reset" style="margin-top:8px">Back to 2009 numbers</button>`;
  const v = k => +el.querySelector(".rt-" + k).value || 0;
  const up = () => { const E = v("E"), U = v("U"), N = v("N"), LF = E + U, pop = LF + N, ur = LF ? U/LF*100 : 0, lfpr = pop ? LF/pop*100 : 0;
    el.querySelector(".rt-bar").innerHTML = pop ? `<span style="width:${E/pop*100}%;background:var(--note)"></span><span style="width:${U/pop*100}%;background:var(--wrong)"></span><span style="width:${N/pop*100}%;background:var(--border)"></span>` : "";
    el.querySelector(".rt-f").innerHTML = `Labor force = ${E} + ${U} = <b>${+LF.toFixed(1)}</b> million<br>Unemployment rate = ${U} ÷ ${+LF.toFixed(1)} × 100 = <b>${ur.toFixed(1)}%</b><br>Participation rate = ${+LF.toFixed(1)} ÷ ${+pop.toFixed(1)} × 100 = <b>${lfpr.toFixed(1)}%</b>`; };
  el.querySelectorAll(".orgrow input").forEach(x => x.oninput = up);
  el.querySelector(".rt-reset").onclick = () => { Object.keys(D0).forEach(k => el.querySelector(".rt-" + k).value = D0[k]); up(); };
  up();
}
function figDiscouraged(el){
  const ST = [
    {E:140, U:14, N:82, who:"Pat has a job.", cap:"Start: 140 million employed, 14 million unemployed."},
    {E:139, U:15, N:82, who:"Pat loses the job and starts looking.", cap:"Unemployed rise, labor force unchanged: the unemployment rate <b>rises</b>. That reflects real hardship."},
    {E:139, U:14, N:83, who:"Months later, Pat gives up looking.", cap:"Pat is now a <b>discouraged worker</b>, out of the labor force. Unemployed and the labor force both fall, so the rate <b>falls</b>, even though nothing got better."},
    {E:139, U:15, N:82, who:"The economy picks up, and Pat starts searching again.", cap:"Pat re-enters as unemployed, so the rate <b>rises</b>, even though conditions improved. The rate doesn’t always track the economy’s health."}
  ];
  let prev = null;
  stepper(el, {title:"The discouraged worker problem", n:() => ST.length, draw:(i, st) => {
    const s = ST[i], LF = s.E + s.U, ur = s.U/LF*100, p = prev ? prev.U/(prev.E+prev.U)*100 : ur;
    st.innerHTML = `<div class="scen pop" style="font-size:16px">👤 ${s.who}</div><div class="stack">${kv("Employed", s.E + " million")}${kv("Unemployed", s.U + " million")}${kv("Not in labor force", s.N + " million")}${kv("Unemployment rate", `${ur.toFixed(2)}% ${i ? `<span style="color:${ur > p + 1e-9 ? "var(--wrong)" : ur < p - 1e-9 ? "var(--right)" : "var(--muted)"}">${ur > p + 1e-9 ? "↑" : ur < p - 1e-9 ? "↓" : "–"}</span>` : ""}`)}</div>`;
    prev = s; return s.cap;
  }});
}
function figSpells(el){
  const ST = [
    {wk:0, cap:"55 people become unemployed during the year. Watch week by week."},
    {wk:10, cap:"Every week, one person loses a job and finds a new one by the end of the week: a <b>one-week spell</b>. Three others lost jobs at the start of the year and are still looking."},
    {wk:30, cap:"At <b>any moment</b>, 4 people are unemployed: this week’s short-spell person, plus the 3 long-term people. So 3 of 4 unemployed people are long-term."},
    {wk:52, cap:"By year’s end: 52 of 55 spells lasted only a week. <b>Most spells are short</b>, yet <b>most unemployment at any moment is long-term</b>. Both facts are true."}
  ];
  stepper(el, {title:"Short spells, long-term unemployment", n:() => ST.length, draw:(i, st) => {
    const wk = ST[i].wk, row = (lbl, cells) => `<div style="display:grid;grid-template-columns:50px 1fr;gap:6px;align-items:center;margin:3px 0"><span class="small">${lbl}</span><span style="display:flex;gap:1px">${cells}</span></div>`;
    const cell = on => `<i style="flex:1;height:14px;border-radius:2px;background:${on ? "var(--wrong)" : "var(--line)"}"></i>`;
    const longRows = [1,2,3].map(k => row("Long " + k, Array.from({length:52}, (_,w) => cell(wk > 0 && w < wk)).join(""))).join("");
    const shortRow = row("Short", Array.from({length:52}, (_,w) => `<i style="flex:1;height:14px;border-radius:2px;background:${w < wk ? "var(--gold)" : "var(--line)"};opacity:${w < wk && w !== wk-1 ? 0.5 : 1}"></i>`).join(""));
    st.innerHTML = `<p class="small muted" style="margin:0 0 6px">Week ${wk} of 52 · each box is a week · <span style="color:var(--wrong)">■</span> long spells · <span style="color:var(--gold)">■</span> one-week spells</p>${longRows}${shortRow}
      <div class="stack" style="margin-top:10px">${kv("Spells so far", (wk ? wk + 3 : 0) + (wk >= 52 ? " (52 short, 3 long)" : ""))}${kv("Unemployed right now", wk ? "4 (3 long-term)" : "0")}</div>`;
    return ST[i].cap;
  }});
}
function figShift(el){
  const ST = [
    {cap:"Oil prices rise sharply. Demand shifts between industries: a <b>sectoral shift</b>.", n:[["⛽ Energy exploration","",""],["✈️ Airlines","",""],["🚗 Auto makers","",""]]},
    {cap:"Energy companies start hiring; airlines and automakers lay workers off.", n:[["⛽ Energy exploration","up","Hiring"],["✈️ Airlines","down","Layoffs"],["🚗 Auto makers","down","Layoffs"]]},
    {cap:"The laid-off workers need time to search for new jobs, maybe in a new industry or region. Meanwhile they’re unemployed: <b>frictional unemployment</b>. The jobs exist; matching takes time.", n:[["⛽ Energy exploration","up","Openings"],["🔎 Searching workers","", "Frictional unemployment"],["✈️🚗 Airlines, autos","down","Smaller"]]}
  ];
  stepper(el, {title:"Sectoral shifts and job search", n:() => ST.length, draw:(i, st) => {
    st.innerHTML = `<div class="stack">${ST[i].n.map(r => kv(r[0], r[2] ? `<span class="pill ${r[1]}">${r[2]}</span>` : "")).join("")}</div>`;
    return ST[i].cap;
  }});
}
function figMinWage(el){
  el.innerHTML = `<div class="figt"><span class="modeltag">📘 Textbook model, as in the lecture</span><br>A minimum wage above equilibrium</div><p class="figsub">The market for low-skilled (often teenage) labor. Equilibrium wage: $10.</p>
    <label for="mw-w" style="display:flex;justify-content:space-between"><span>Minimum wage</span><b class="mw-wv"></b></label><input type="range" id="mw-w" min="8" max="14" step="0.5" value="10">
    <div class="mw-c"></div><div class="stack mw-v"></div><p class="cap mw-cap" aria-live="polite"></p>`;
  const s = el.querySelector("#mw-w"), Ls = w => 20 + 4*w, Ld = w => 120 - 6*w;
  const up = () => { const mw = +s.value, W = Math.max(mw, 10), sup = Ls(W), dem = Ld(W), gap = Math.max(0, sup - dem);
    el.querySelector(".mw-wv").textContent = "$" + mw.toFixed(2);
    const w = 340, hh = 220, L = 40, R = 12, T = 14, B = 30, X = q => L + q/110*(w-L-R), Y = v => (hh-B) - (v-4)/14*(hh-T-B);
    const ln = (f, col, lab, at) => { const pts = []; for (let v = 4.5; v <= 17.5; v += 0.5) pts.push([f(v), v]); const P = pts.filter(p => p[0] >= 0 && p[0] <= 110); const lp = at === "s" ? P[0] : P[P.length-1];
      return `<polyline points="${P.map(p => `${X(p[0]).toFixed(1)},${Y(p[1]).toFixed(1)}`).join(" ")}" style="fill:none;stroke:${col};stroke-width:3"/><text x="${X(lp[0]) - 4}" y="${Math.max(26, Y(lp[1]) - 6)}" text-anchor="end" class="sm halo" style="font-weight:700;fill:${col}">${lab}</text>`; };
    el.querySelector(".mw-c").innerHTML = `<svg class="chart" viewBox="0 0 ${w} ${hh}" role="img" aria-label="Labor market with a minimum wage">
      <line x1="${L}" y1="${T}" x2="${L}" y2="${hh-B}" style="stroke:var(--ink);stroke-width:1.5"/><line x1="${L}" y1="${hh-B}" x2="${w-R}" y2="${hh-B}" style="stroke:var(--ink);stroke-width:1.5"/>
      <text x="${L+4}" y="${T+10}" class="sm mute">wage</text><text x="${w-R}" y="${hh-4}" text-anchor="end" class="sm mute">quantity of labor</text>
      ${ln(Ls, "var(--note)", "Labor supply")}${ln(Ld, "var(--gold)", "Labor demand", "s")}
      <line x1="${L}" y1="${Y(W)}" x2="${w-R}" y2="${Y(W)}" style="stroke:var(--ink);stroke-width:1.5;stroke-dasharray:${mw > 10 ? "0" : "4 4"}"/><text x="${L-4}" y="${Y(W)+4}" text-anchor="end" class="sm" style="font-weight:700">$${W}</text>
      ${gap ? `<line x1="${X(dem)}" y1="${Y(W)-8}" x2="${X(sup)}" y2="${Y(W)-8}" style="stroke:var(--wrong);stroke-width:3"/><text x="${(X(dem)+X(sup))/2}" y="${Y(W)-14}" text-anchor="middle" class="sm halo" style="font-weight:700;fill:var(--wrong)">Unemployment</text>` : `<circle cx="${X(60)}" cy="${Y(10)}" r="5.5" style="fill:var(--wrong);stroke:var(--surface);stroke-width:2"/>`}</svg>`;
    el.querySelector(".mw-v").innerHTML = kv("Workers who want jobs", sup) + kv("Jobs firms offer", dem) + kv("Unemployed (surplus of labor)", `<span style="color:${gap ? "var(--wrong)" : "var(--muted)"}">${gap}</span>`);
    el.querySelector(".mw-cap").innerHTML = mw <= 10 ? (mw < 10 ? "A minimum wage <b>below</b> $10 doesn’t bind: the market pays $10 anyway, and everyone who wants work finds it." : "At the equilibrium wage, the quantity of labor supplied equals the quantity demanded.") :
      `At $${mw.toFixed(2)}, ${sup} people want jobs but firms offer only ${dem}. The ${gap} left over can’t find work even after searching: <b>structural unemployment</b>.`; };
  s.oninput = up; up();
}
function figUnion(el){
  let on = false;
  el.innerHTML = `<div class="figt">Insiders and outsiders</div><p class="figsub">Unions raise members’ wages through collective bargaining, by 10–20% according to studies.</p>
    <div class="seg" role="group" aria-label="Union"><button type="button" aria-pressed="true" data-u="0">No union</button><button type="button" aria-pressed="false" data-u="1">Union wins 15%</button></div>
    <div class="un-b"></div><p class="cap un-cap"></p>`;
  const draw = () => { const wage = on ? 23 : 20, jobs = on ? 8 : 10;
    el.querySelector(".un-b").innerHTML = `<div style="font-size:26px;line-height:1.4;margin:6px 0" aria-hidden="true">${"🧑‍🏭".repeat(jobs)}${on ? "🚶".repeat(2) : ""}</div>` +
      `<div class="stack">${kv("Wage per hour", "$" + wage)}${kv("Workers hired", jobs)}${kv("Insiders (members) gain?", on ? "<span class='pill up'>Yes: +$3/hr</span>" : "–")}${kv("Outsiders left without these jobs", on ? "<span class='pill down'>2</span>" : "0")}</div>`;
    el.querySelector(".un-cap").innerHTML = on ? "<b>Insiders</b> earn more. But at the higher wage, firms hire fewer workers, so <b>outsiders</b> are hurt: like a minimum wage, this causes structural unemployment. (Numbers are illustrative.)" : "Without a union, wages settle at the market level and firms hire 10 workers."; };
  el.querySelectorAll(".seg button").forEach(b => b.onclick = () => { on = b.dataset.u === "1"; el.querySelectorAll(".seg button").forEach(x => x.setAttribute("aria-pressed", x === b)); draw(); });
  draw();
}
function figEffic(el){
  const R = [["🩺","Worker health","Better-paid workers eat better and are healthier, so more productive. Most relevant in developing countries."],["🔁","Worker turnover","Hiring and training is costly. Higher pay keeps workers from quitting."],["⭐","Worker quality","A higher wage attracts the best applicants; a low one attracts only those who can’t earn more elsewhere."],["💪","Work effort","Well-treated workers work harder, and work harder to keep a job they couldn’t match elsewhere."]];
  el.innerHTML = `<div class="figt">Why would a firm pay more than it has to?</div><p class="figsub">Tap each reason.</p>
    <div class="choices" style="grid-template-columns:repeat(2,1fr)">${R.map((r,i) => `<button type="button" class="choice ef" data-i="${i}"><span style="font-size:24px">${r[0]}</span><br>${r[1]}</button>`).join("")}</div>
    <p class="cap ef-cap" aria-live="polite">Efficiency wages: employers <b>choose</b> above-equilibrium wages to raise productivity.</p>`;
  el.querySelectorAll(".ef").forEach(b => b.onclick = () => { el.querySelectorAll(".ef").forEach(x => x.classList.remove("right")); b.classList.add("right"); const r = R[+b.dataset.i]; el.querySelector(".ef-cap").innerHTML = `<b>${r[1]}:</b> ${r[2]}`; });
}
function figNatural(el){
  const EV = [
    ["The government raises the minimum wage.","u","s","A higher wage floor creates a bigger surplus of labor: more <b>structural</b> unemployment, raising the natural rate."],
    ["The internet makes it easier to advertise and find job openings.","d","f","Faster matching shortens job search: less <b>frictional</b> unemployment, lowering the natural rate."],
    ["U.S. unions have become much weaker since the 1950s.","d","s","Fewer wages pushed above equilibrium: less <b>structural</b> unemployment, lowering the natural rate."],
    ["Music downloading puts record and CD stores out of business.","u","f","A sectoral shift: laid-off workers must search for new jobs, raising <b>frictional</b> unemployment."]
  ];
  let k = 0;
  el.innerHTML = `<div class="figt">The lecture’s closing questions</div><p class="figsub">For each change: what happens to the natural rate, and does it work through frictional or structural unemployment?</p><div class="nt-b"></div>`;
  const body = el.querySelector(".nt-b");
  const row = (key, label, opts) => `<div style="margin:8px 0"><div style="margin-bottom:4px">${label}</div><div class="rchips" style="margin:0" data-v="${key}">${opts.map(o => `<button type="button" class="chipbtn" aria-pressed="false" data-a="${o[0]}">${o[1]}</button>`).join("")}</div></div>`;
  const draw = () => { const e = EV[k], pick = {};
    body.innerHTML = `<div class="scen pop">${e[0]}</div>` + row("d","1. Natural rate of unemployment",[["u","Rises"],["d","Falls"]]) + row("t","2. Through which type?",[["f","Frictional"],["s","Structural"]]) + `<button type="button" class="btn nt-c" style="margin-top:6px">Check</button><div class="nt-r"></div>`;
    body.querySelectorAll(".rchips").forEach(g => g.querySelectorAll("button").forEach(b => b.onclick = () => { g.querySelectorAll("button").forEach(x => x.setAttribute("aria-pressed", x === b)); pick[g.dataset.v] = b.dataset.a; }));
    body.querySelector(".nt-c").onclick = () => { const a = pick.d === e[1], b2 = pick.t === e[2];
      body.querySelector(".nt-r").innerHTML = `<div class="why" style="margin-top:10px"><b class="${a && b2 ? "ok" : "no"}">${a && b2 ? "Both right." : a || b2 ? "One of two." : "Not this time."}</b> ${e[3]}${!b2 ? " Remember: frictional = jobs exist but matching takes time; structural = not enough jobs at the going wage." : ""}</div>`;
      const nb = h("button","btn ghost", k < EV.length-1 ? "Next question" : "Start over"); nb.type = "button"; nb.style.marginTop = "10px"; nb.onclick = () => { k = (k+1) % EV.length; draw(); }; body.querySelector(".nt-r").appendChild(nb); };
  };
  draw();
}

/* ---------- lessons ---------- */
const STEPS = [
 { title:"Identifying unemployment", html:`
   <p>Like GDP, unemployment is a key measure of economic well-being. Every month, the Bureau of Labor Statistics runs the ${g("Current Population Survey","Current Population Survey")} of about 60,000 households and puts each adult 16 and over into one of three groups:</p>
   <div class="stack">
     <div class="info"><b>${g("Employed","Employed")}</b><span>Paid full- or part-time work, own business, or temporarily absent.</span></div>
     <div class="info"><b>${g("Unemployed","Unemployed")}</b><span>No job, available, and looked in the past four weeks; or laid off awaiting recall.</span></div>
     <div class="info"><b>${g("Not in the labor force","Not in the labor force")}</b><span>Everyone else: students, homemakers, retirees.</span></div>
   </div>
   <div class="fig" data-fig="classify"></div>
   <div class="formula" style="font-size:17px">${g("Labor force","Labor force")} = employed + unemployed</div>
   <div class="formula" style="font-size:17px">${g("Unemployment rate","Unemployment rate")} = unemployed ÷ labor force × 100</div>
   <div class="formula" style="font-size:17px">${g("Labor force participation rate","Participation rate")} = labor force ÷ adult population × 100</div>
   <div class="fig" data-fig="rates"></div>`,
   check:[
    {id:"c1a", q:"A full-time student who isn’t looking for work is classified as…", a:2,
     o:[["Employed","Being a student isn’t paid work."],["Unemployed","To be unemployed you must be looking for work."],["Not in the labor force","Correct."]],
     hint:"Is the student working, or looking?", more:"Retirees and homemakers are also out of the labor force."},
    {id:"c1b", q:"Employed = 140 million and unemployed = 10 million. The unemployment rate is…", a:1,
     o:[["7.1%","That divides by the employed. Divide by the labor force."],["6.7%","Correct. 10 ÷ 150 × 100."],["10%","That’s the number of unemployed, not a rate."]],
     hint:"Labor force = employed + unemployed.", more:"Use the calculator to check."}
   ]},
 { title:"Why the unemployment rate can mislead", html:`
   <p>The hardest part of measuring unemployment is telling the unemployed apart from people out of the labor force.</p>
   <div class="fig" data-fig="disc"></div>
   <p>Another puzzle concerns how long unemployment lasts. Most ${g("Spell paradox","spells of unemployment are short")}, yet most unemployment you see at any moment is long-term. How can both be true?</p>
   <div class="fig" data-fig="spells"></div>`,
   check:[
    {id:"c2a", q:"An unemployed worker gives up looking and becomes discouraged. The unemployment rate…", a:0,
     o:[["Falls","Correct. They leave both the unemployed count and the labor force."],["Rises","They stop being counted as unemployed."],["Doesn’t change","Both the numerator and the denominator change."]],
     hint:"Step 3 of the discouraged-worker step-through.", more:"So a falling rate isn’t always good news."},
    {id:"c2b", q:"In the lecture’s example, why are most unemployed people at any moment long-term?", a:2,
     o:[["Because most spells are long","52 of 55 spells were one week."],["Because short spells aren’t counted","They are counted."],["Long spells pile up, while short ones come and go","Correct."]],
     hint:"Count who’s unemployed during any single week.", more:"3 of 4 unemployed at any time had year-long spells."}
   ]},
 { title:"The natural rate: frictional and structural", html:`
   <p>There’s unemployment even in good times. Economists distinguish:</p>
   <div class="stack">
     <div class="info"><b>${g("Natural rate of unemployment","Natural rate")}</b><span>Unemployment in normal times: the long-run rate. About 5% in the lecture, and 5.2% by the CBO’s estimate then.</span></div>
     <div class="info"><b>${g("Cyclical unemployment","Cyclical unemployment")}</b><span>Extra unemployment in recessions: short-run swings around the natural rate.</span></div>
   </div>
   <p>Two kinds of explanation for the natural rate:</p>
   <div class="stack">
     <div class="info"><b>${g("Frictional unemployment","Frictional")}</b><span>The jobs exist; it just takes time to find the right one. Explained by job search.</span></div>
     <div class="info"><b>${g("Structural unemployment","Structural")}</b><span>There aren’t enough jobs for everyone who wants one. Explained by minimum wages, unions and efficiency wages.</span></div>
   </div>
   ${tn("The CBO estimates the natural rate of unemployment at 5.2%.","The CBO’s current estimate (it now calls it the “noncyclical rate”) is about 4.4%.")}`,
   check:[
    {id:"c3a", q:"The natural rate of unemployment is…", a:1,
     o:[["Zero, in a healthy economy","There’s always some unemployment, even in good times."],["The unemployment rate in normal times, without a recession","Correct."],["The extra unemployment in a recession","That’s cyclical unemployment."]],
     hint:"Long run vs short run.", more:"About 5% in the lecture."},
    {id:"c3b", q:"Workers who are unemployed because jobs exist but finding the right one takes time are…", a:0,
     o:[["Frictionally unemployed","Correct."],["Structurally unemployed","Structural means not enough jobs at the going wage."],["Cyclically unemployed","That’s extra unemployment in recessions."]],
     hint:"Do the jobs exist?", more:"Job search explains frictional unemployment."}
   ]},
 { title:"Job search", html:`
   <p>${g("Job search")} is how workers find jobs that match their tastes and skills. Because the economy is always changing, some frictional unemployment is inevitable.</p>
   <div class="fig" data-fig="shift"></div>
   <p>Another example: when Dell took market share from Hewlett-Packard, HP laid workers off and Dell hired. A century ago, the biggest U.S. industries were cotton goods, woolen goods, men’s clothing and lumber; today they include autos, aircraft, communications and electronic components.</p>
   <div class="stack">
     <div class="info"><b>Public policy</b><span>Government training and re-training programs can reduce frictional unemployment.</span></div>
     <div class="info"><b>${g("Unemployment insurance","Unemployment insurance")}</b><span>Protects workers’ incomes, making risk-averse workers better off, but lets them search longer, which can raise frictional unemployment.</span></div>
   </div>`,
   check:[
    {id:"c4a", q:"Oil prices rise. Energy firms hire while airlines lay off. The resulting unemployment is…", a:2,
     o:[["Cyclical","It isn’t caused by a recession."],["Structural","Jobs exist in energy; it’s a matching problem."],["Frictional, from a sectoral shift","Correct."]],
     hint:"Are there jobs available somewhere?", more:"Workers need time to move between industries."},
    {id:"c4b", q:"How can unemployment insurance raise frictional unemployment?", a:0,
     o:[["It lets unemployed workers search longer for the right job","Correct."],["It forces firms to lay workers off","It doesn’t cause layoffs."],["It raises the minimum wage","That’s a different policy."]],
     hint:"What does income support change about job search?", more:"It still makes risk-averse workers better off."}
   ]},
 { title:"Minimum-wage laws", html:`
   <p>${g("Minimum-wage laws","A minimum wage")} set above the equilibrium wage creates a surplus of labor.</p>
   <div class="fig" data-fig="minwage"></div>
   <p>This is <b>structural</b> unemployment: these workers can’t find jobs even after extensive search. It mainly affects low-wage workers, especially teenagers. More generally, <b>anything that keeps wages above equilibrium</b> causes structural unemployment.</p>`,
   check:[
    {id:"c5a", q:"A minimum wage set above the equilibrium wage causes…", a:1,
     o:[["A shortage of workers","At a higher wage, more people want work, not fewer."],["A surplus of labor: structural unemployment","Correct."],["No change, because firms ignore it","It’s a legal floor."]],
     hint:"Move the slider above $10.", more:"The gap between supply and demand is unemployment."},
    {id:"c5b", q:"A minimum wage set below the equilibrium wage…", a:2,
     o:[["Causes large unemployment","Workers already earn more than the minimum."],["Lowers everyone’s wages","The market still pays the equilibrium wage."],["Has no effect: it doesn’t bind","Correct."]],
     hint:"Move the slider below $10.", more:"Only a binding floor creates a surplus."}
   ]},
 { title:"Unions and collective bargaining", html:`
   <p>A ${g("Union","union")} bargains with employers over wages, benefits and working conditions through <b>collective bargaining</b>. If they can’t agree, it can organize a <b>strike</b>.</p>
   <div class="fig" data-fig="union"></div>
   <p>In the 1940s and 1950s, about one-third of U.S. workers were unionized; the lecture puts it at about 12% now.</p>
   ${tn("About 12% of U.S. workers are unionized.","Union membership has kept falling: about 10% of U.S. wage and salary workers now belong to a union.")}`,
   check:[
    {id:"c6a", q:"When a union raises wages above equilibrium, who is hurt?", a:1,
     o:[["Insiders (union members)","Members get the higher wage."],["Outsiders, because fewer workers are hired","Correct."],["No one","Higher wages mean fewer jobs."]],
     hint:"Toggle the union on: who’s left out?", more:"The effect resembles a minimum wage."},
    {id:"c6b", q:"Studies suggest unions raise members’ wages by about…", a:0,
     o:[["10–20%","Correct."],["1–2%","Larger than that."],["50–100%","Much too large."]],
     hint:"From the lecture.", more:"Unionization has fallen from about one-third of workers."}
   ]},
 { title:"Efficiency wages", html:`
   <p>Like minimum wages and unions, ${g("Efficiency wages","efficiency wages")} keep wages above equilibrium. The difference: here the <b>employer chooses</b> to pay more, to raise productivity.</p>
   <div class="fig" data-fig="effic"></div>
   <p><b>Henry Ford, 1914:</b> Ford paid workers $5 a day, about twice what other jobs paid. Turnover and absenteeism fell, and Ford called the decision “one of the finest cost-cutting moves we ever made.”</p>
   <p><b>Conclusion:</b> the natural rate of unemployment comes from frictional unemployment (job search) and structural unemployment (minimum wages, unions, efficiency wages). Try the lecture’s closing questions:</p>
   <div class="fig" data-fig="natural"></div>`,
   check:[
    {id:"c7a", q:"How do efficiency wages differ from minimum wages and union wages?", a:2,
     o:[["They’re below equilibrium","Efficiency wages are above equilibrium."],["They’re set by law","That’s the minimum wage."],["The employer chooses them voluntarily","Correct."]],
     hint:"Who decides the wage in each case?", more:"All three keep wages above equilibrium."},
    {id:"c7b", q:"Henry Ford’s $5 day mainly reduced…", a:1,
     o:[["Ford’s profits","He called it a cost-cutting move."],["Worker turnover and absenteeism","Correct."],["The number of cars produced","Not the effect described."]],
     hint:"From the lecture’s Ford story.", more:"That’s the turnover (and effort) reason."}
   ]}
];
const FIGS = { classify:figClassify, rates:figRates, disc:figDiscouraged, spells:figSpells, shift:figShift, minwage:figMinWage, union:figUnion, effic:figEffic, natural:figNatural };

/* ---------- self-check ---------- */
const QUIZ = [
 {id:"q1", L:0, q:"The BLS measures unemployment using…", a:1, hint:"A monthly household survey.", o:[["Tax returns","Not the source."],["The Current Population Survey of about 60,000 households","Right."],["Unemployment insurance claims only","Not the main measure."],["The census every 10 years","Too infrequent."]], more:"Monthly."},
 {id:"q2", L:0, q:"Someone laid off and waiting to be recalled is…", a:0, hint:"Temporary layoffs.", o:[["Unemployed","Right."],["Employed","They aren’t working."],["Not in the labor force","Temporary layoffs count as unemployed."],["Discouraged","They expect to return."]], more:"Even without searching."},
 {id:"q3", L:0, q:"The labor force equals…", a:2, hint:"Two groups.", o:[["The adult population","Includes those not in the labor force."],["Employed only","Add the unemployed."],["Employed + unemployed","Right."],["Unemployed + not in labor force","No."]], more:"154.2 million in 2009."},
 {id:"q4", L:0, q:"In 2009, the labor force participation rate was about…", a:3, hint:"154.2 ÷ 235.9.", o:[["9.3%","That’s the unemployment rate."],["35%","Too low."],["91%","That’s the employment share of the labor force."],["65.4%","Right."]], more:"Labor force ÷ adult population."},
 {id:"q5", L:0, q:"Unemployed 20 million, labor force 200 million. The unemployment rate is…", a:1, hint:"Unemployed ÷ labor force.", o:[["20%","That’s 20 ÷ 100."],["10%","Right."],["11.1%","That divides by employed."],["0.1%","Multiply by 100."]], more:"20 ÷ 200 × 100."},
 {id:"q6", L:1, q:"A discouraged worker is counted as…", a:2, hint:"Not searching.", o:[["Unemployed","They stopped looking."],["Employed","They aren’t working."],["Not in the labor force","Right."],["Both","Only one category."]], more:"So the rate understates hardship."},
 {id:"q7", L:1, q:"A discouraged worker starts looking again. The unemployment rate…", a:0, hint:"Re-entering as unemployed.", o:[["Rises","Right."],["Falls","They join the unemployed."],["Doesn’t change","Both numerator and denominator change."],["Becomes zero","No."]], more:"Even though conditions improved."},
 {id:"q8", L:1, q:"Which is true about unemployment spells?", a:3, hint:"The 55-person example.", o:[["Most spells are long","Most are short."],["Most unemployment at any moment is short-term","It’s mostly long-term."],["Spells don’t matter","They explain the paradox."],["Most spells are short, but most unemployment at a moment is long-term","Right."]], more:"Both are true."},
 {id:"q9", L:2, q:"Cyclical unemployment is…", a:1, hint:"Recessions.", o:[["Unemployment in normal times","That’s the natural rate."],["Extra unemployment during recessions","Right."],["Caused by minimum wages","That’s structural."],["Caused by job search","That’s frictional."]], more:"Short-run swings around the natural rate."},
 {id:"q10", L:2, q:"Structural unemployment means…", a:0, hint:"Not enough jobs.", o:[["There aren’t enough jobs for everyone who wants one","Right."],["Jobs exist but take time to find","That’s frictional."],["Unemployment only in recessions","That’s cyclical."],["People not looking for work","They’re not in the labor force."]], more:"Often caused by above-equilibrium wages."},
 {id:"q11", L:3, q:"Which policy could reduce frictional unemployment?", a:2, hint:"Faster matching.", o:[["Raising the minimum wage","That raises structural unemployment."],["Longer unemployment benefits","They can lengthen search."],["Job training and re-training programs","Right."],["Stronger unions","That’s structural."]], more:"So can better job-matching tools."},
 {id:"q12", L:4, q:"Minimum-wage unemployment mainly affects…", a:1, hint:"Who earns near the minimum?", o:[["Highly paid professionals","Their wages are well above the minimum."],["Low-wage workers, especially teenagers","Right."],["Retirees","Not in the labor force."],["Union members","Not the main group."]], more:"It’s structural unemployment."},
 {id:"q13", L:4, q:"A binding minimum wage causes the quantity of labor supplied to ___ the quantity demanded.", a:0, hint:"Above equilibrium.", o:[["Exceed","Right."],["Fall below","At a higher wage, more want to work."],["Equal","Only at equilibrium."],["Have no relation to","They’re compared in the diagram."]], more:"The gap is unemployment."},
 {id:"q14", L:5, q:"Collective bargaining is…", a:3, hint:"Unions.", o:[["A minimum wage law","Set by government."],["A strike","A strike is what happens if bargaining fails."],["Job search","Individual, not collective."],["Union negotiation with employers over pay and conditions","Right."]], more:"Unions raise wages 10–20%."},
 {id:"q15", L:5, q:"Unions’ effects on unemployment resemble those of…", a:1, hint:"Wages above equilibrium.", o:[["Unemployment insurance","That affects search."],["Minimum-wage laws","Right."],["The internet","That helps matching."],["Sectoral shifts","Those cause frictional unemployment."]], more:"Insiders gain; outsiders lose."},
 {id:"q16", L:5, q:"In the 1940s and 1950s, about what share of U.S. workers were unionized?", a:2, hint:"From the lecture.", o:[["5%","Much higher."],["12%","That’s the lecture’s figure for recent times."],["About one-third","Right."],["90%","Too high."]], more:"It has fallen since."},
 {id:"q17", L:6, q:"Which is NOT a reason for efficiency wages?", a:3, hint:"Health, turnover, quality, effort.", o:[["Worker health","One of the four."],["Lower turnover","One of the four."],["Better applicants","One of the four."],["Government requirements","Right: that would be a minimum wage."]], more:"Firms choose efficiency wages."},
 {id:"q18", L:6, q:"Offering a higher wage to attract the best applicants is the ___ reason for efficiency wages.", a:0, hint:"Who applies?", o:[["Worker quality","Right."],["Worker health","Health is about nutrition."],["Turnover","Turnover is about keeping workers."],["Minimum wage","Not an efficiency wage reason."]], more:"A low wage attracts weaker applicants."},
 {id:"q19", L:6, q:"The internet makes job matching easier. The natural rate of unemployment…", a:1, hint:"Search gets faster.", o:[["Rises, through structural unemployment","Matching is a frictional issue."],["Falls, through frictional unemployment","Right."],["Falls, through structural unemployment","It doesn’t change wages above equilibrium."],["Doesn’t change","Faster search lowers frictional unemployment."]], more:"A lecture closing question."},
 {id:"q20", L:6, q:"Unions in the U.S. have weakened since the 1950s. This tends to ___ the natural rate through ___ unemployment.", a:2, hint:"Fewer above-equilibrium wages.", o:[["Raise; frictional","Unions affect wages, not search."],["Raise; structural","Weaker unions mean fewer wages above equilibrium."],["Lower; structural","Right."],["Lower; frictional","It works through wages."]], more:"A lecture closing question."}
];
const ROUNDS = [["Round 1","Measuring unemployment",0],["Round 2","Misleading rates and the natural rate",5],["Round 3","Job search, minimum wage, unions",10],["Round 4","Unions, efficiency wages, conclusions",15],["Mixed round","5 random questions",-1],["My weak spots","Questions you’ve missed before, mixed up",-2],["Number drills","Labor-force statistics with new numbers",-3]];
function genDrill(){
  const pick = a => a[Math.floor(Math.random()*a.length)];
  const kind = Math.floor(Math.random()*3); let q, o, L, hint;
  const E = pick([120,140,150,160]), U = pick([6,8,10,12,15]), N = pick([60,70,80,90]);
  const LF = E + U, ur = +(U/LF*100).toFixed(1), lf = +(LF/(LF+N)*100).toFixed(1);
  if (kind === 0){ q = `Employed: ${E} million. Unemployed: ${U} million. What is the unemployment rate?`; L = 0; hint = "Unemployed ÷ (employed + unemployed) × 100.";
    o = [[ur + "%",`Right. ${U} ÷ ${LF} × 100.`],[+(U/E*100).toFixed(1) + "%","That divides by the employed only. Use the labor force."],[U + "%","That’s the count, not a rate."],[+(U/(LF+N)*100).toFixed(1) + "%","That divides by the whole adult population."]]; }
  else if (kind === 1){ q = `Employed: ${E}m, unemployed: ${U}m, not in the labor force: ${N}m. What is the labor force participation rate?`; L = 0; hint = "Labor force ÷ adult population × 100.";
    o = [[lf + "%",`Right. ${LF} ÷ ${LF+N} × 100.`],[+(E/(LF+N)*100).toFixed(1) + "%","That leaves out the unemployed, who are in the labor force."],[+(LF/E*100).toFixed(1) + "%","Divide by the whole adult population."],[ur + "%","That’s the unemployment rate."]]; }
  else { const d = pick([1,2]); const ur2 = +((U-d)/(LF-d)*100).toFixed(2), ur1 = +(U/LF*100).toFixed(2);
    q = `Employed ${E}m, unemployed ${U}m. Then ${d} million unemployed people become discouraged and stop looking. What happens to the unemployment rate?`; L = 1; hint = "They leave both the unemployed count and the labor force.";
    o = [[`Falls from ${ur1}% to ${ur2}%`,"Right: the discouraged-worker effect."],[`Rises from ${ur1}% to ${+((U+d)/(LF+d)*100).toFixed(2)}%`,"They stop being counted as unemployed."],["Doesn’t change","Both the unemployed and the labor force fall, so the rate changes."]]; }
  const seen = new Set(); o = o.filter(x => !seen.has(x[0]) && seen.add(x[0]));
  return {id:"gen", gen:true, L, q, o, a:0, hint, more:"New numbers every round."};
}

/* ---------- short answers ---------- */
const WRITE = [
 {q:"Explain how the BLS classifies adults, and compute the 2009 unemployment rate and participation rate from the lecture’s numbers (employed 139.9m, unemployed 14.3m, not in labor force 81.7m).",
  keys:[["Three categories with definitions",/employed.{0,200}unemployed.{0,200}not in the labor force/i],["Labor force = 154.2",/154\.2/],["Unemployment rate 9.3%",/9\.3/],["Participation rate 65.4%",/65\.4/]],
  model:"Each month the BLS surveys about 60,000 households and classifies adults 16 and over as employed (paid work, own business, or temporarily absent), unemployed (no job, available, and looked in the past four weeks, or awaiting recall), or not in the labor force (everyone else). In 2009 the labor force was 139.9 + 14.3 = 154.2 million, so the unemployment rate was 14.3 ÷ 154.2 × 100 = 9.3%, and the participation rate was 154.2 ÷ 235.9 × 100 = 65.4%."},
 {q:"Explain why changes in the unemployment rate don’t always reflect economic conditions, using discouraged workers.",
  keys:[["Discouraged worker definition",/(given up|stopped|stop).{0,30}(look|search)/i],["Not counted in labor force → rate falls",/(rate).{0,40}(fall|decreas|lower)/i],["Returning to search → rate rises",/(look|search).{0,60}(rate).{0,30}(rise|increas)/i],["Misleading signal",/mislead|not.{0,20}(accurate|reflect)|even though/i]],
  model:"A discouraged worker wants a job but has given up looking, so the BLS counts them as out of the labor force rather than unemployed. When an unemployed person becomes discouraged, both the number unemployed and the labor force fall, so the unemployment rate falls even though nothing has improved. When the economy picks up and discouraged workers start looking again, they’re counted as unemployed, so the rate rises even though conditions are better. So changes in the rate can give misleading signals."},
 {q:"Explain how most spells of unemployment can be short while most unemployment at any moment is long-term. Use the lecture’s example.",
  keys:[["55 people: 52 one-week spells",/52/],["3 people unemployed all year",/\b3\b|three/i],["At any moment 4 unemployed, 3 long-term",/\b4\b|four/i],["Long spells accumulate in the snapshot",/any (given )?(point|moment|time)|snapshot|pile up/i]],
  model:"Suppose 55 people become unemployed during a year. Each week, one person loses a job and finds a new one by week’s end, so 52 of the 55 spells last only a week. But three workers lose their jobs at the start of the year and stay unemployed all year. At any given moment, four people are unemployed, and three of them are in year-long spells. So most spells are short, but most of the unemployment observed at any point is long-term, because long spells accumulate in the snapshot."},
 {q:"Distinguish frictional from structural unemployment and name the theories that explain each.",
  keys:[["Frictional: jobs exist, matching takes time",/frictional.{0,120}(time|search|match)/i],["Job search explains frictional",/job search/i],["Structural: not enough jobs",/structural.{0,120}(not enough|too few|surplus)/i],["Minimum wage, unions, efficiency wages",/minimum.{0,80}union.{0,80}efficiency|efficiency.{0,80}union|union.{0,80}efficiency/i]],
  model:"Frictional unemployment arises because it takes time for workers to find the jobs best suited to them: the jobs exist, but search and matching take time. It’s explained by job search, including sectoral shifts and unemployment insurance. Structural unemployment arises because there aren’t enough jobs for everyone who wants one, usually because wages are above the equilibrium level. It’s explained by minimum-wage laws, unions and efficiency wages."},
 {q:"Explain why some frictional unemployment is inevitable, and how unemployment insurance affects it.",
  keys:[["Economy always changing / sectoral shifts",/sector|always changing|industr|shift/i],["Example (oil, Dell/HP, industries)",/oil|dell|hp|hewlett|airline|cotton|lumber/i],["UI protects income (risk-averse better off)",/protect|income|risk/i],["UI lengthens search",/(search|look).{0,30}longer|longer.{0,30}(search|look)/i]],
  model:"The economy is always changing: demand shifts among industries and regions, as when rising oil prices lead energy firms to hire while airlines and automakers lay off, or when Dell took business from HP. Displaced workers need time to find new jobs, so some frictional unemployment is inevitable. Unemployment insurance partly protects workers’ incomes, making risk-averse workers better off, but it also lets them search longer for the right job, which can increase frictional unemployment."},
 {q:"Using a labor market diagram, explain how a minimum wage causes unemployment, and who is most affected.",
  keys:[["Minimum wage above equilibrium",/above.{0,20}equilibrium/i],["Quantity supplied exceeds demanded (surplus)",/surplus|exceed|more.{0,30}than.{0,30}(jobs|demand)/i],["Structural unemployment",/structural/i],["Low-wage workers, especially teenagers",/teen|low.?wage|young/i]],
  model:"In the market for low-skilled labor, a minimum wage set above the equilibrium wage raises the quantity of labor supplied, since more people want to work at the higher wage, and lowers the quantity demanded, since firms hire fewer workers. The surplus of labor is unemployment, and it’s structural: these workers can’t find jobs even after searching. It mainly affects low-wage workers, especially teenagers."},
 {q:"Explain how unions and efficiency wages each raise unemployment, and how they differ.",
  keys:[["Unions: collective bargaining raises wages 10–20%",/collective|bargain|10/i],["Insiders gain, outsiders hurt",/insider|outsider/i],["Efficiency wages: firms choose higher wages for productivity",/efficiency.{0,120}(firm|employer).{0,40}(choose|voluntar|pay)/i],["Four reasons (health, turnover, quality, effort) or Ford",/health|turnover|quality|effort|ford/i]],
  model:"Unions use collective bargaining, backed by the threat of strikes, to raise members’ wages above equilibrium, by 10–20% according to studies. Insiders benefit, but at higher wages firms hire fewer workers, so outsiders are hurt and structural unemployment rises. Efficiency wages also keep wages above equilibrium, but here employers choose to pay more because it raises productivity through better worker health, lower turnover, higher-quality applicants and greater effort, as with Henry Ford’s $5 day in 1914. Both create a surplus of labor."},
 {q:"Answer two of the lecture’s closing questions: what happens to the natural rate if the minimum wage rises, and if the internet makes job search easier? Through which type of unemployment?",
  keys:[["Minimum wage rise → natural rate rises",/minimum.{0,80}(rise|increas|higher)/i],["…through structural",/structural/i],["Internet → natural rate falls",/internet.{0,120}(fall|lower|decreas|reduc)/i],["…through frictional",/frictional/i]],
  model:"A higher minimum wage raises the wage floor further above equilibrium, creating a larger surplus of labor, so the natural rate of unemployment rises through more structural unemployment. The internet makes it easier for firms to advertise openings and for workers to find them, shortening job search, so the natural rate falls through less frictional unemployment."}
];
const WTAG = [0,1,1,2,3,4,5,6];
