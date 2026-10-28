/* Lecture 9: A Macroeconomic Theory of the Open Economy — lab content (loaded after assets/lab.js) */

const CARDS = [
 ["Loanable funds market (open economy)","Supply = national saving S. Demand = domestic investment I + net capital outflow NCO. The real interest rate r balances them.","S = I + NCO."],
 ["Supply of loanable funds","National saving. It rises when the real interest rate rises.","Higher r rewards saving."],
 ["Demand for loanable funds","I + NCO. Both fall when the real interest rate rises, so demand slopes down.","Firms borrow less; foreign assets look less attractive."],
 ["NCO and the interest rate","A higher U.S. real interest rate makes U.S. assets more attractive, so NCO falls.","r rises from 5% to 7%: Americans buy fewer foreign assets, foreigners buy more U.S. assets."],
 ["Market for foreign-currency exchange","Supply of dollars = NCO. Demand for dollars = NX. The real exchange rate E balances them.","NCO = NX."],
 ["Supply of dollars (FX market)","Equal to NCO: Americans sell dollars to buy foreign assets. It is a vertical line because E doesn’t affect saving or investment.",""],
 ["Demand for dollars (FX market)","Equal to NX: foreigners need dollars to buy U.S. net exports. It slopes down because a higher E makes U.S. goods more expensive.",""],
 ["Real exchange rate (E)","E = (e × P) ÷ P*: the real value of a dollar in the foreign-exchange market.","A higher E means U.S. goods cost more relative to foreign goods."],
 ["NCO links the two markets","The interest rate from the loanable funds market sets NCO, and NCO is the supply of dollars in the foreign-exchange market.","r ↑ → NCO ↓ → supply of dollars ↓ → E ↑."],
 ["Twin deficits","The tendency for a government budget deficit and a trade deficit to occur together.","U.S. budget deficits in the 1980s came with trade deficits."],
 ["Trade policy","A government policy that directly influences how much a country imports or exports.","Tariffs, quotas, voluntary export restrictions."],
 ["Tariff","A tax on imported goods.","A 25% tax on imported steel."],
 ["Import quota","A limit on the quantity of a good that can be imported.","At most 1 million Japanese cars a year."],
 ["Voluntary export restriction","When a government pressures another country to limit its exports. Essentially the same as an import quota.","Japan’s car export limits in the 1980s."],
 ["Capital flight","A large and sudden reduction in the demand for assets located in a country.","Mexico 1994, Southeast Asia 1997, Russia 1998, Argentina 2002."],
 ["Investment tax incentive","A policy that makes investment more attractive. It raises demand for loanable funds.","Short run like a deficit (r ↑, E ↑, NX ↓), but it raises long-run growth."]
];
const CNOTE = {
 "Twin deficits":"📘 A tendency, not a law. Saving and investment can change for other reasons too.",
 "Capital flight":"🕒 Today: the same pattern appears whenever investors suddenly lose confidence in a country."
};

const TB = new Set(["c4a","c4b","c5a","c5b","c6a","c6b","c7a","c7b","q11","q12","q13","q14","q15","q16","q17","q18"]);
const TODAY = {};

/* ================= the model =================
   Loanable funds:  S(r) = 30 + sS + 5r       D(r) = I + NCO = (75 + dS − 2.5r) + (30 + nS − 5r)
   NCO(r) = 30 + nS − 5r       FX market: supply of dollars = NCO;  demand NX(E) = 40 + xS − 40E          */
function eqm(sh){
  const s = Object.assign({sS:0,dS:0,nS:0,xS:0}, sh);
  const r = (75 + s.dS + s.nS - s.sS) / 12.5;
  const Q = 30 + s.sS + 5*r, NCO = 30 + s.nS - 5*r, I = 75 + s.dS - 2.5*r, E = (40 + s.xS - NCO) / 40;
  return {s, r, Q, NCO, I, E, NX:NCO};
}
function pnl(o){
  const w = 340, h = o.h || 196, xa = o.xr[0], xb = o.xr[1], ya = o.yr[0], yb = o.yr[1];
  const X = x => 46 + (x-xa)/(xb-xa)*(w-64), Y = y => (h-34) - (y-ya)/(yb-ya)*(h-56);
  const inX = x => x >= xa && x <= xb, inY = y => y >= ya && y <= yb;
  const path = pts => pts.filter(p => inX(p[0]) && inY(p[1])).map(p => `${X(p[0]).toFixed(1)},${Y(p[1]).toFixed(1)}`).join(" ");
  const lines = (o.lines || []).map(L => {
    const col = L.faded ? "var(--border)" : L.color;
    const pts = path(L.pts); const last = L.pts.filter(p => inX(p[0]) && inY(p[1])); const lp = L.labelAt === "start" ? last[0] : last[last.length-1];
    return `<polyline points="${pts}" style="fill:none;stroke:${col};stroke-width:${L.faded ? 2 : 3}${L.faded ? ";stroke-dasharray:6 5" : ""}"/>` +
      (lp && L.label ? (() => { let lx = X(lp[0]) + (L.dx || 4), anc = L.anchor || "start"; const ly = Math.max(30, Y(lp[1]) + (L.dy || -6));
        if (anc === "start" && lx > w - 64){ lx = Math.min(X(lp[0]) - 4, w - 6); anc = "end"; }
        return `<text x="${lx}" y="${ly}" text-anchor="${anc}" class="sm halo" style="font-weight:700;fill:${col}">${L.label}</text>`; })() : "");
  }).join("");
  const hl = (o.hl || []).map(v => `<line x1="46" y1="${Y(v.y)}" x2="${X(v.x)}" y2="${Y(v.y)}" style="stroke:var(--muted);stroke-width:1;stroke-dasharray:3 3"/><text x="40" y="${Y(v.y)+4}" text-anchor="end" class="sm" style="font-weight:700">${v.label}</text>` +
    (v.vx ? `<line x1="${X(v.x)}" y1="${Y(v.y)}" x2="${X(v.x)}" y2="${h-34}" style="stroke:var(--muted);stroke-width:1;stroke-dasharray:3 3"/>` : "")).join("");
  const dots = (o.dots || []).map(d => `<circle cx="${X(d.x)}" cy="${Y(d.y)}" r="5.5" style="fill:${d.old ? "var(--surface)" : "var(--wrong)"};stroke:${d.old ? "var(--muted)" : "var(--surface)"};stroke-width:2"/>`).join("");
  const gap = o.gap ? `<line x1="${X(o.gap.x1)}" y1="${Y(o.gap.y)}" x2="${X(o.gap.x2)}" y2="${Y(o.gap.y)}" style="stroke:var(--wrong);stroke-width:2.5" marker-start="url(#pA)" marker-end="url(#pA)"/><text x="${(X(o.gap.x1)+X(o.gap.x2))/2}" y="${Y(o.gap.y)-8}" text-anchor="middle" class="sm halo" style="font-weight:700;fill:var(--wrong)">${o.gap.label}</text>` : "";
  const zero = o.zeroX !== undefined ? `<line x1="${X(o.zeroX)}" y1="20" x2="${X(o.zeroX)}" y2="${h-34}" style="stroke:var(--line);stroke-width:1"/><text x="${X(o.zeroX)}" y="${h-20}" text-anchor="middle" class="sm mute">0</text>` : "";
  return `<svg class="chart" viewBox="0 0 ${w} ${h}" role="img" aria-label="${o.aria || o.title}">
    <defs><marker id="pA" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" style="fill:var(--wrong)"/></marker></defs>
    <text x="4" y="13" class="sm" style="font-weight:700">${o.title}</text>
    ${zero}
    <line x1="46" y1="20" x2="46" y2="${h-34}" style="stroke:var(--ink);stroke-width:1.5"/><line x1="46" y1="${h-34}" x2="${w-12}" y2="${h-34}" style="stroke:var(--ink);stroke-width:1.5"/>
    <text x="8" y="${h/2}" class="sm mute" transform="rotate(-90 12 ${h/2})" text-anchor="middle">${o.yl}</text>
    <text x="${(w+34)/2}" y="${h-6}" text-anchor="middle" class="sm mute">${o.xl}</text>
    ${hl}${lines}${gap}${dots}</svg>`;
}
const rr = [1,11], rngR = () => { const a = []; for (let r = 0.5; r <= 11.5; r += 0.25) a.push(r); return a; };
function lfPanel(sh, old, extra){
  const s = Object.assign({sS:0,dS:0,nS:0}, sh), o = old ? Object.assign({sS:0,dS:0,nS:0}, old) : null, e = eqm(sh);
  const lines = [];
  if (o && (o.sS !== s.sS)) lines.push({pts:rngR().map(r => [30+o.sS+5*r, r]), faded:true, label:"S₁", color:"var(--note)"});
  if (o && (o.dS + o.nS !== s.dS + s.nS)) lines.push({pts:rngR().map(r => [105+o.dS+o.nS-7.5*r, r]), faded:true, label:"D₁", color:"var(--gold)", labelAt:"start", dx:-24, dy:12});
  lines.push({pts:rngR().map(r => [30+s.sS+5*r, r]), color:"var(--note)", label: o && o.sS !== s.sS ? "S₂" : "S = saving"});
  lines.push({pts:rngR().map(r => [105+s.dS+s.nS-7.5*r, r]), color:"var(--gold)", label: o && (o.dS+o.nS !== s.dS+s.nS) ? "D₂" : "D = I + NCO", labelAt:"start", dx:-6, dy:-10, anchor:"end"});
  const dots = [{x:e.Q, y:e.r}]; const hl = [{x:e.Q, y:e.r, label:"r" + (o && Math.abs(eqm(old).r - e.r) > 0.01 ? "₂" : ""), vx:true}];
  if (o){ const e0 = eqm(old); if (Math.abs(e0.r - e.r) > 0.01){ dots.unshift({x:e0.Q, y:e0.r, old:true}); hl.unshift({x:e0.Q, y:e0.r, label:"r₁"}); } }
  return pnl(Object.assign({title:"(a) Loanable funds", xr:[20,100], yr:[0,12], xl:"Quantity of loanable funds", yl:"Real interest rate", lines, dots, hl}, extra || {}));
}
function ncoPanel(sh, old, extra){
  const s = Object.assign({nS:0}, sh), e = eqm(sh), lines = [];
  if (old && (old.nS || 0) !== s.nS) lines.push({pts:rngR().map(r => [30+(old.nS||0)-5*r, r]), faded:true, label:"NCO₁", color:"var(--note)"});
  lines.push({pts:rngR().map(r => [30+s.nS-5*r, r]), color:"var(--note)", label: old && (old.nS||0) !== s.nS ? "NCO₂" : "NCO"});
  const dots = [{x:e.NCO, y:e.r}], hl = [{x:e.NCO, y:e.r, label:"r" + (old && Math.abs(eqm(old).r - e.r) > 0.01 ? "₂" : ""), vx:true}];
  if (old){ const e0 = eqm(old); if (Math.abs(e0.r - e.r) > 0.01 || Math.abs(e0.NCO - e.NCO) > 0.01){ dots.unshift({x:e0.NCO, y:e0.r, old:true}); } }
  return pnl(Object.assign({title:"(b) Net capital outflow", xr:[-25,30], yr:[0,12], xl:"Net capital outflow", yl:"Real interest rate", lines, dots, hl, zeroX:0}, extra || {}));
}
function fxPanel(sh, old, extra, cur){
  const s = Object.assign({xS:0}, sh), e = eqm(sh), lines = [], Es = []; for (let E = 0.4; E <= 1.62; E += 0.02) Es.push(E);
  const e0 = old ? eqm(old) : null;
  const left = e0 && e.NCO < e0.NCO;
  if (e0 && Math.abs(e0.NCO - e.NCO) > 0.01) lines.push({pts:[[e0.NCO,0.45],[e0.NCO,1.55]], faded:true, label:"S₁", color:"var(--note)", dy:4, dx: left ? 4 : -4, anchor: left ? "start" : "end"});
  if (old && (old.xS || 0) !== s.xS) lines.push({pts:Es.map(E => [40+(old.xS||0)-40*E, E]), faded:true, label:"D₁", color:"var(--gold)", labelAt:"start", dx:-26, dy:14});
  lines.push({pts:[[e.NCO,0.45],[e.NCO,1.55]], color:"var(--note)", label: e0 && Math.abs(e0.NCO - e.NCO) > 0.01 ? "S₂" : "S = NCO", dy:4, dx: left ? -4 : 4, anchor: left ? "end" : "start"});
  lines.push({pts:Es.map(E => [40+s.xS-40*E, E]), color:"var(--gold)", label: old && (old.xS||0) !== s.xS ? "D₂ = NX" : "D = NX", labelAt:"start", dx:6, dy:14});
  const dots = [{x:e.NCO, y:e.E}], hl = [{x:e.NCO, y:e.E, label:"E" + (old ? "₂" : "")}];
  if (e0 && Math.abs(e0.E - e.E) > 0.01){ dots.unshift({x:e0.NCO, y:e0.E, old:true}); hl.unshift({x:e0.NCO, y:e0.E, label:"E₁"}); }
  return pnl(Object.assign({title:"(c) Foreign-currency exchange", xr:[-25,30], yr:[0.4,1.6], xl:"Quantity of " + (cur || "dollars") + " (net)", yl:"Real exchange rate", lines, dots, hl, zeroX:0}, extra || {}));
}
const arr = (a, b, tol) => Math.abs(a-b) < (tol || 0.01) ? "–" : (b > a ? "↑" : "↓");

/* ---------- interactive graphics ---------- */
function figLF(el){
  el.innerHTML = `<div class="figt"><span class="modeltag">📘 Textbook model, as in the lecture</span><br>Loanable funds and net capital outflow</div><p class="figsub">Move the interest rate and watch both demand pieces respond. Equilibrium is at 6%.</p>
    <label for="lf-r" style="display:flex;justify-content:space-between"><span>Real interest rate r</span><b class="lf-rv"></b></label><input type="range" id="lf-r" min="3" max="9" step="0.5" value="6">
    <div class="lf-c"></div><p class="cap lf-cap" aria-live="polite"></p>`;
  const s = el.querySelector("#lf-r");
  const up = () => { const r = +s.value, S = 30+5*r, D = 105-7.5*r, I = 75-2.5*r, N = 30-5*r;
    el.querySelector(".lf-rv").textContent = r + "%";
    const g = Math.abs(S-D) < 0.01 ? null : {x1:Math.min(S,D), x2:Math.max(S,D), y:r, label: S > D ? "Surplus of funds" : "Shortage of funds"};
    el.querySelector(".lf-c").innerHTML = pnl({title:"(a) Loanable funds", xr:[20,100], yr:[0,12], xl:"Quantity of loanable funds", yl:"Real interest rate",
        lines:[{pts:rngR().map(x => [30+5*x, x]), color:"var(--note)", label:"S = saving"},{pts:rngR().map(x => [105-7.5*x, x]), color:"var(--gold)", label:"D = I + NCO", labelAt:"start", dx:-6, dy:-10, anchor:"end"}],
        hl:[{x:Math.max(S,D), y:r, label:r+"%"}], gap:g, dots:g ? [] : [{x:S, y:r}]}) +
      ncoPanel({}, null, {hl:[{x:N, y:r, label:r+"%", vx:true}], dots:[{x:N, y:r}]});
    el.querySelector(".lf-cap").innerHTML = `At ${r}%: saving ${S}, investment ${I}, NCO ${N > 0 ? "+" : ""}${N}. ` + (r < 6 ? "A <b>lower</b> r makes U.S. assets less attractive, so Americans buy more foreign assets and foreigners buy fewer U.S. ones: <b>NCO rises</b>. Demand exceeds saving, so r gets pushed back up." : r > 6 ? "A <b>higher</b> r makes U.S. assets more attractive: <b>NCO falls</b> (here it’s negative, a capital inflow). Saving exceeds demand, so r gets pushed back down." : "<b>Equilibrium:</b> saving (60) = investment (60) + NCO (0).");
  };
  s.oninput = up; up();
}
function figFX(el){
  el.innerHTML = `<div class="figt"><span class="modeltag">📘 Textbook model, as in the lecture</span><br>The market for foreign-currency exchange</div><p class="figsub">Move the real exchange rate E. NCO is fixed at 0 by the loanable funds market.</p>
    <label for="fx-e" style="display:flex;justify-content:space-between"><span>Real exchange rate E</span><b class="fx-ev"></b></label><input type="range" id="fx-e" min="0.7" max="1.3" step="0.05" value="1">
    <div class="fx-c"></div><p class="cap fx-cap" aria-live="polite"></p>`;
  const s = el.querySelector("#fx-e");
  const up = () => { const E = +s.value, NX = 40-40*E; el.querySelector(".fx-ev").textContent = E.toFixed(2);
    const g = Math.abs(NX) < 0.01 ? null : {x1:Math.min(0,NX), x2:Math.max(0,NX), y:E, label: NX > 0 ? "Excess demand for $" : "Excess supply of $"};
    el.querySelector(".fx-c").innerHTML = fxPanel({}, null, {gap:g, dots: g ? [] : [{x:0, y:1}], hl:[{x:Math.max(0,NX), y:E, label:E.toFixed(2)}]});
    el.querySelector(".fx-cap").innerHTML = E > 1 ? `At E = ${E.toFixed(2)}, U.S. goods are expensive for foreigners, so NX (demand for dollars) is only ${NX.toFixed(0)}: more dollars are supplied than demanded, and <b>E falls</b> back toward 1.` :
      E < 1 ? `At E = ${E.toFixed(2)}, U.S. goods are cheap, so NX is ${NX.toFixed(0)}: foreigners want more dollars than are supplied, and <b>E rises</b> back toward 1.` :
      `<b>Equilibrium:</b> the dollars demanded for net exports equal the dollars supplied by net capital outflow.`; };
  s.oninput = up; up();
}
function figLink(el){
  el.innerHTML = `<div class="figt"><span class="modeltag">📘 Textbook model, as in the lecture</span><br>NCO connects the two markets</div><p class="figsub">Suppose the loanable funds market sets r. Move it and follow the chain.</p>
    <label for="lk-r" style="display:flex;justify-content:space-between"><span>Real interest rate r</span><b class="lk-rv"></b></label><input type="range" id="lk-r" min="4" max="8" step="0.4" value="6">
    <div class="lk-c"></div><div class="chain lk-ch" style="margin-top:6px"></div><p class="cap lk-cap" aria-live="polite"></p>`;
  const s = el.querySelector("#lk-r");
  const up = () => { const r = +s.value, N = 30-5*r, E = (40-N)/40; el.querySelector(".lk-rv").textContent = r.toFixed(1) + "%";
    el.querySelector(".lk-c").innerHTML = ncoPanel({}, null, {hl:[{x:N, y:r, label:r.toFixed(1)+"%", vx:true}], dots:[{x:N, y:r}]}) +
      pnl({title:"(c) Foreign-currency exchange", xr:[-25,30], yr:[0.4,1.6], xl:"Quantity of dollars (net)", yl:"Real exchange rate", zeroX:0,
        lines:[{pts:[[N,0.45],[N,1.55]], color:"var(--note)", label:"S = NCO"},{pts:Array.from({length:61},(_,k) => { const e = 0.4+k*0.02; return [40-40*e, e]; }), color:"var(--gold)", label:"D = NX", labelAt:"start", dx:6, dy:14}],
        dots:[{x:N, y:E}], hl:[{x:N, y:E, label:E.toFixed(2)}]});
    const up1 = r > 6, eq = Math.abs(r-6) < 0.01;
    el.querySelector(".lk-ch").innerHTML = eq ? "" : `<span class="chip ${up1 ? "up" : "down"}">r ${up1 ? "↑" : "↓"}</span>→<span class="chip ${up1 ? "down" : "up"}">NCO ${up1 ? "↓" : "↑"}</span>→<span class="chip">supply of $ ${up1 ? "↓" : "↑"}</span>→<span class="chip ${up1 ? "up" : "down"}">E ${up1 ? "↑" : "↓"}</span>→<span class="chip ${up1 ? "down" : "up"}">NX ${up1 ? "↓" : "↑"}</span>`;
    el.querySelector(".lk-cap").innerHTML = eq ? "At r = 6%, NCO = 0, so the supply of dollars is 0 and E = 1 with balanced trade." :
      `NCO = ${N.toFixed(0)}, so the supply of dollars sits at ${N.toFixed(0)} and the real exchange rate is <b>${E.toFixed(2)}</b>. ${up1 ? "Anything that raises r <b>appreciates</b> the dollar." : "A lower r <b>depreciates</b> the dollar."}`; };
  s.oninput = up; up();
}

const SCEN = {
  deficit:{title:"A government budget deficit", sh:{sS:-15}, steps:[
    "Start: the budget and trade are both balanced. r = 6%, NCO = 0, E = 1.",
    "Panel (a): the deficit <b>reduces national saving</b>, so supply shifts left (S₁ → S₂). The real interest rate rises from 6% to <b>7.2%</b>, and investment falls (crowding out).",
    "Panel (b): the higher r makes U.S. assets more attractive, so <b>NCO falls</b> from 0 to −6 (a capital inflow).",
    "Panel (c): lower NCO means fewer dollars supplied, so supply shifts left. The real exchange rate <b>appreciates</b> from 1 to 1.15, and NX falls to −6: a <b>trade deficit</b>."],
    sum:"Saving ↓, r ↑, I ↓, NCO ↓, E ↑, NX ↓. A budget deficit tends to bring a trade deficit: the “twin deficits.”"},
  invest:{title:"An investment tax incentive", sh:{dS:15}, steps:[
    "Start: r = 6%, NCO = 0, E = 1, balanced trade.",
    "Panel (a): firms want to invest more at every r, so <b>demand for loanable funds shifts right</b> (D₁ → D₂). r rises to <b>7.2%</b>. Investment rises (from 60 to 72).",
    "Panel (b): the higher r <b>reduces NCO</b> to −6.",
    "Panel (c): the supply of dollars shifts left, so the dollar <b>appreciates</b> to 1.15 and NX falls to −6."],
    sum:"r ↑, I ↑, NCO ↓, E ↑, NX ↓. Same short-run direction as a deficit, but investment rises instead of falling, which helps long-run growth."},
  quota:{title:"An import quota on Japanese cars", sh:{xS:15}, steps:[
    "Start: r = 6%, NCO = 0, E = 1, balanced trade.",
    "Panels (a) and (b): a quota doesn’t change saving or investment, so <b>nothing moves</b>. r stays 6% and NCO stays 0.",
    "Panel (b): with NCO unchanged, the supply of dollars doesn’t move either.",
    "Panel (c): fewer car imports means higher NX at each E, so <b>demand for dollars shifts right</b>. E rises to <b>1.375</b>, until NX is back at 0. Imports fell, but the stronger dollar cut exports just as much: <b>NX doesn’t change</b>."],
    sum:"r –, NCO –, E ↑, NX –. Imports ↓ and exports ↓. Jobs saved in the car industry are lost in export industries."},
  flight:{title:"Capital flight from Mexico (1994)", sh:{nS:15}, cur:"pesos", steps:[
    "Start: Mexico’s market at r = 6%, NCO = 0, E = 1. (Seen from Mexico, so the currency is the peso.)",
    "Panel (b): nervous investors sell Mexican assets, so <b>NCO rises at every r</b> (the NCO curve shifts right).",
    "Panel (a): demand for loanable funds = I + NCO, so it shifts right too. Mexico’s r rises to <b>7.2%</b>.",
    "Panel (c): higher NCO means <b>more pesos supplied</b>. Supply shifts right and the peso <b>depreciates</b> from 1 to 0.775."],
    sum:"NCO ↑, r ↑, E ↓ (the peso falls), NX ↑. The same pattern hit Southeast Asia (1997), Russia (1998) and Argentina (2002)."},
  china:{title:"Foreigners buy more U.S. assets (China case)", sh:{nS:-15}, steps:[
    "Start: r = 6%, NCO = 0, E = 1.",
    "Panel (b): China buys U.S. assets at every r, so <b>U.S. NCO falls</b> (the curve shifts left).",
    "Panel (a): demand for loanable funds (I + NCO) shifts left, so U.S. r falls to <b>4.8%</b> and investment rises.",
    "Panel (c): NCO is now −9, so fewer dollars are supplied. The dollar <b>appreciates</b> to 1.225 and NX falls to −9: more imports from China, a bigger U.S. trade deficit."],
    sum:"U.S. NCO ↓, r ↓, E ↑, NX ↓. U.S. consumers gain cheaper imports; some U.S. industries face tougher competition."}
};
function figScenario(el, key){
  const sc = SCEN[key]; let K = key;
  const opts = el.dataset.opts ? el.dataset.opts.split(",") : null;
  const top = opts ? `<div class="seg" role="group" aria-label="Scenario">${opts.map((k,i) => `<button type="button" aria-pressed="${i===0}" data-k="${k}">${k === "flight" ? "Capital flight" : "China buys U.S. assets"}</button>`).join("")}</div>` : "";
  const sp = stepper(el, {title:`<span class="modeltag">📘 Textbook model, as in the lecture</span><br><span class="sc-t">${sc.title}</span>`, top, n:() => 5, draw:(i, st) => {
    const S = SCEN[K], base = {}, sh = S.sh, cur = S.cur;
    const lfShift = (sh.sS || sh.dS) ? 1 : (sh.nS ? 2 : 99);
    const ncoStep = sh.nS ? 1 : 2;
    const showLF = i >= lfShift ? sh : base, showNCO = i >= Math.min(ncoStep, lfShift + (sh.nS ? 0 : 1)) ? sh : base, showFX = i >= 3 ? sh : base;
    const lfh = lfPanel(i >= lfShift ? sh : base, i >= lfShift ? base : null);
    const ncoSh = i >= ncoStep && sh.nS ? {nS:sh.nS} : {};
    const ncoEq = i >= 2 || (sh.nS && i >= 1) ? sh : base;
    let ncoh;
    if (sh.nS && i === 1) ncoh = ncoPanel({nS:sh.nS}, {nS:0}, {dots:[{x:0, y:6, old:true}], hl:[{x:0, y:6, label:"r₁", vx:true}]});
    else ncoh = ncoPanel(i >= 2 || (sh.nS && i >= 1) ? sh : base, (i >= 2 || (sh.nS && i >= 1)) ? base : null);
    const fxh = fxPanel(i >= 3 ? sh : base, i >= 3 ? base : null, null, cur);
    const e0 = eqm({}), e1 = eqm(sh);
    if (i === 4){
      st.innerHTML = lfh + ncoh + fxh + `<div class="stack">${[["Real interest rate r",e0.r,e1.r,"%"],["Investment I",e0.I,e1.I,""],["Net capital outflow",e0.NCO,e1.NCO,""],["Real exchange rate E",e0.E,e1.E,""],["Net exports NX",e0.NX,e1.NX,""]].map(v => kv(v[0], `${+v[1].toFixed(3)}${v[3]} → ${+v[2].toFixed(3)}${v[3]} <span style="color:${arr(v[1],v[2]) === "–" ? "var(--muted)" : "var(--wrong)"}">${arr(v[1],v[2])}</span>`)).join("")}</div>`;
      return "<b>Summary:</b> " + S.sum;
    }
    st.innerHTML = lfh + ncoh + fxh;
    return S.steps[i];
  }});
  if (opts) el.querySelectorAll(".seg button").forEach(b => b.onclick = () => { K = b.dataset.k; el.querySelector(".sc-t").textContent = SCEN[K].title; el.querySelectorAll(".seg button").forEach(x => x.setAttribute("aria-pressed", x === b)); sp.reset(); });
}
const kv = (label, val) => `<div class="info" style="display:flex;justify-content:space-between;gap:10px;padding:8px 12px"><span style="color:var(--ink)">${label}</span><b style="margin:0;white-space:nowrap">${val}</b></div>`;

function figJobs(el){
  el.innerHTML = `<div class="figt">Does the quota save jobs?</div>
    <div class="orgrow"><div class="node hot"><div style="font-size:26px">🚗</div><b>U.S. car industry</b><small>Fewer Japanese cars → more U.S. cars sold → <b>jobs saved</b></small></div>
    <div class="node dim"><div style="font-size:26px">✈️🌽</div><b>U.S. export industries</b><small>Stronger dollar → exports cost more abroad → <b>jobs lost</b></small></div></div>
    <p class="cap">The quota <b>moves</b> jobs from export industries to the car industry. It doesn’t reduce the trade deficit, because NX = NCO and the quota doesn’t change saving or investment.</p>`;
}
function sortActivity(el, title, sub, items, choices, hintFn){
  let k = 0, right = 0, first = true;
  el.innerHTML = `<div class="figt">${title}</div><p class="figsub">${sub}</p><div class="sbody"></div>`;
  const body = el.querySelector(".sbody");
  const draw = () => {
    if (k >= items.length){ body.innerHTML = `<div class="scen pop"><b>${right} of ${items.length}</b> on the first try.</div><button class="btn ghost" type="button">Try again</button>`; body.querySelector("button").onclick = () => { k = 0; right = 0; draw(); }; return; }
    first = true;
    body.innerHTML = `<div class="tally"><span>${k+1} of ${items.length}</span><span>${right} right</span></div><div class="scen pop">${items[k][0]}</div>
      <div class="choices" style="grid-template-columns:repeat(${choices.length},1fr)">${choices.map(c => `<button type="button" class="choice" data-z="${c[0]}">${c[1]}</button>`).join("")}</div><div class="fb"></div>`;
    body.querySelectorAll(".choice").forEach(b => b.onclick = () => {
      const ok = b.dataset.z === items[k][1];
      if (ok){ if (first){ right++; body.querySelector(".tally span:last-child").textContent = right + " right"; }
        body.querySelectorAll(".choice").forEach(x => x.disabled = true); b.classList.add("right");
        body.querySelector(".fb").innerHTML = `<div class="why"><b class="ok">Yes.</b> ${items[k][2]}</div>`;
        const nb = h("button","btn","Next"); nb.type = "button"; nb.style.marginTop = "10px"; nb.onclick = () => { k++; draw(); }; body.appendChild(nb);
      } else { first = false; b.classList.add("wrong"); b.disabled = true; body.querySelector(".fb").innerHTML = `<div class="why"><b class="no">Not quite.</b> ${hintFn(items[k])} Try again.</div>`; }
    });
  };
  draw();
}
function figMyth(el){
  sortActivity(el, "Myth or reality?", "The lecture’s conclusion: don’t blame our problems on the international economy.", [
    ["“The U.S. trade deficit is caused by other countries’ unfair trade practices.”","m","The model says NX = S − I. The deficit comes from low U.S. saving relative to investment."],
    ["“A quota on imports will shrink the trade deficit.”","m","The quota doesn’t change NCO, so the dollar appreciates until NX is back where it was."],
    ["“A government budget deficit tends to push the trade balance toward deficit.”","r","Lower saving → higher r → lower NCO → stronger dollar → lower NX."],
    ["“Stagnant living standards are caused by imports.”","m","Living standards depend on productivity growth, not on imports."],
    ["“Capital flight raises a country’s interest rates and weakens its currency.”","r","Mexico 1994: NCO rose, r rose and the peso fell."]
  ], [["m","Myth"],["r","Reality"]], () => "Think about what the model says moves NX: saving and investment.");
}
function figPredict(el){
  const EV = [
    ["The government runs a larger budget deficit.", {sS:-15}],
    ["New tax breaks encourage firms to invest.", {dS:15}],
    ["The U.S. puts a quota on imported cars.", {xS:15}],
    ["Households start saving much more.", {sS:15}],
    ["Foreign investors suddenly want to buy many more U.S. assets.", {nS:-15}]
  ];
  const VARS = [["r","Real interest rate"],["NCO","Net capital outflow"],["E","Real exchange rate"],["NX","Net exports"]];
  let k = 0;
  el.innerHTML = `<div class="figt"><span class="modeltag">📘 Textbook model, as in the lecture</span><br>Predict, then check</div><p class="figsub">Pick ↑, ↓ or – for each variable, then check your predictions.</p><div class="pbody"></div>`;
  const body = el.querySelector(".pbody");
  const draw = () => {
    const [txt, sh] = EV[k], e0 = eqm({}), e1 = eqm(sh), pick = {};
    body.innerHTML = `<div class="scen pop">${txt}</div>` + VARS.map(v => `<div style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin:6px 0"><span>${v[1]}</span><span class="rchips" style="margin:0" data-v="${v[0]}">${["↑","↓","–"].map(a => `<button type="button" class="chipbtn" aria-pressed="false" data-a="${a}">${a}</button>`).join("")}</span></div>`).join("") +
      `<button type="button" class="btn pchk" style="margin-top:8px">Check my predictions</button><div class="pres"></div>`;
    body.querySelectorAll(".rchips").forEach(g => g.querySelectorAll("button").forEach(b => b.onclick = () => { g.querySelectorAll("button").forEach(x => x.setAttribute("aria-pressed", x === b)); pick[g.dataset.v] = b.dataset.a; }));
    body.querySelector(".pchk").onclick = () => {
      const ans = {r:arr(e0.r,e1.r), NCO:arr(e0.NCO,e1.NCO), E:arr(e0.E,e1.E), NX:arr(e0.NX,e1.NX)};
      let n = 0; VARS.forEach(v => { if (pick[v[0]] === ans[v[0]]) n++; });
      body.querySelector(".pres").innerHTML = `<div class="stack">${VARS.map(v => kv(v[1], `${pick[v[0]] || "?"} <span style="color:${pick[v[0]] === ans[v[0]] ? "var(--right)" : "var(--wrong)"}">${pick[v[0]] === ans[v[0]] ? "✓" : "✕ answer " + ans[v[0]]}</span>`)).join("")}</div>
        <p class="cap"><b>${n} of 4.</b> Chain: ${sh.sS < 0 ? "saving ↓ → r ↑ → NCO ↓ → E ↑ → NX ↓" : sh.sS > 0 ? "saving ↑ → r ↓ → NCO ↑ → E ↓ → NX ↑" : sh.dS ? "investment demand ↑ → r ↑ → NCO ↓ → E ↑ → NX ↓" : sh.xS ? "saving and investment unchanged → r, NCO unchanged → demand for $ ↑ → E ↑ → NX unchanged" : "NCO ↓ at every r → demand for LF ↓ → r ↓ → supply of $ ↓ → E ↑ → NX ↓"}.</p>`;
      const nb = h("button","btn ghost", k < EV.length-1 ? "Next event" : "Start over"); nb.type = "button"; nb.style.marginTop = "10px"; nb.onclick = () => { k = (k+1) % EV.length; draw(); }; body.querySelector(".pres").appendChild(nb);
    };
  };
  draw();
}

/* ---------- lessons ---------- */
const STEPS = [
 { title:"Loanable funds in an open economy", html:`
   <p>Lecture 8 gave us the pieces: net exports, net capital outflow and exchange rates. Now we tie them into one model.</p>
   <div class="formula">S = I + NCO</div>
   <div class="stack">
     <div class="info"><b>${g("Supply of loanable funds","Supply")} = national saving (S)</b><span>Rises with the real interest rate r.</span></div>
     <div class="info"><b>${g("Demand for loanable funds","Demand")} = I + NCO</b><span>A dollar of saving can buy domestic capital (I) or a foreign asset (NCO). Both fall when r rises.</span></div>
   </div>
   <p>Why does NCO fall when r rises? r is the return on U.S. assets. A <b>higher</b> r makes U.S. assets more attractive, so Americans buy fewer foreign assets and foreigners buy more U.S. ones: ${g("NCO and the interest rate","NCO falls")}.</p>
   <div class="fig" data-fig="lf"></div>`,
   check:[
    {id:"c1a", q:"In an open economy, the demand for loanable funds comes from…", a:1,
     o:[["Saving","Saving is the supply side."],["Domestic investment plus net capital outflow","Correct. A dollar of saving can fund a U.S. factory or buy a foreign asset."],["Net exports only","NX equals NCO, but demand in this market is I + NCO."]],
     hint:"S = I + NCO. Which side is supply?", more:"That’s why the demand curve is labeled D = I + NCO."},
    {id:"c1b", q:"The U.S. real interest rate falls. What happens to U.S. NCO?", a:0,
     o:[["It rises","Correct. U.S. assets pay less, so more money goes abroad."],["It falls","A lower return at home makes foreign assets more attractive, not less."],["It doesn’t change","NCO depends on r. Move the slider and watch."]],
     hint:"Use the slider: move r below 6%. Where does the NCO dot go?", more:"So the NCO curve slopes downward."}
   ]},
 { title:"The market for foreign-currency exchange", html:`
   <div class="formula">NCO = NX</div>
   <div class="stack">
     <div class="info"><b>${g("Demand for dollars (FX market)","Demand for dollars")} = NX</b><span>Foreigners need dollars to buy U.S. net exports.</span></div>
     <div class="info"><b>${g("Supply of dollars (FX market)","Supply of dollars")} = NCO</b><span>Americans sell dollars to get the foreign currency they need to buy foreign assets.</span></div>
   </div>
   <p>The price in this market is the ${g("Real exchange rate (E)","real exchange rate E")} = (e × P) ÷ P*. A higher E makes U.S. goods more expensive for foreigners, so demand (NX) slopes down. Supply is <b>vertical</b>: E doesn’t change saving or investment, so it doesn’t change NCO.</p>
   <div class="fig" data-fig="fx"></div>
   <p class="small muted">When NX is negative, we import more than we export and pay with dollars. Foreigners use those dollars to buy U.S. assets, so NCO is negative too.</p>`,
   check:[
    {id:"c2a", q:"Why is the supply of dollars in the foreign-exchange market vertical?", a:2,
     o:[["Because the Fed fixes the exchange rate","The Fed isn’t setting E in this model."],["Because NX doesn’t depend on E","NX is demand, and it does depend on E."],["Because E doesn’t affect saving or investment, so it doesn’t affect NCO","Correct."]],
     hint:"Supply of dollars = NCO. What determines NCO?", more:"NCO is set by r in the loanable funds market."},
    {id:"c2b", q:"If E rises above equilibrium, there is…", a:0,
     o:[["An excess supply of dollars, so E falls","Correct. Expensive U.S. goods mean fewer dollars demanded."],["An excess demand for dollars, so E rises further","A higher E lowers NX, the demand for dollars."],["No effect","An imbalance pushes E back."]],
     hint:"Move the slider above 1. Which is bigger: dollars supplied or demanded?", more:"E adjusts until NX = NCO."}
   ]},
 { title:"How the two markets connect", html:`
   <p>${g("NCO links the two markets","Net capital outflow is the link.")}</p>
   <div class="stack">
     <div class="info"><b>1. Loanable funds market sets r</b><span>Where saving meets I + NCO.</span></div>
     <div class="info"><b>2. r sets NCO</b><span>Read it off the NCO curve.</span></div>
     <div class="info"><b>3. NCO is the supply of dollars</b><span>That sets E in the foreign-exchange market, and NX = NCO.</span></div>
   </div>
   <div class="fig" data-fig="link"></div>
   <p>Key rule: <b>anything that raises r reduces NCO and appreciates the real exchange rate.</b></p>`,
   check:[
    {id:"c3a", q:"Something raises the U.S. real interest rate. The real exchange rate…", a:0,
     o:[["Appreciates","Correct. r ↑ → NCO ↓ → fewer dollars supplied → E ↑."],["Depreciates","Follow the chain: what happens to the supply of dollars?"],["Is unaffected","The markets are linked through NCO."]],
     hint:"Move the slider up and follow the chips.", more:"And NX falls along with NCO."},
    {id:"c3b", q:"Which variable connects the loanable funds market to the foreign-exchange market?", a:1,
     o:[["Net exports","NX is determined in the FX market, but the link runs through a different variable."],["Net capital outflow","Correct. It’s part of demand in one market and the supply in the other."],["The nominal exchange rate","This model uses the real exchange rate, and it isn’t the link."]],
     hint:"Which variable appears in both markets?", more:"NCO is part of loanable funds demand and is the supply of dollars."}
   ]},
 { title:"Budget deficits and the twin deficits", html:`
   <p>Suppose the government, starting with a balanced budget and balanced trade, runs a budget deficit. Step through all three panels.</p>
   <div class="fig" data-fig="scen" data-key="deficit"></div>
   <p>U.S. data show that budget deficits and trade deficits often move together: the ${g("Twin deficits","twin deficits")}.</p>
   <p>One more effect: as foreigners acquire more U.S. assets, U.S. debt to the rest of the world grows. These are mostly private debts, the sum of individual choices, not money “we” owe collectively.</p>
   ${tn("At the end of 2009, the U.S. owned $18.4 trillion of foreign assets and foreigners owned $21.1 trillion of U.S. assets, a net debt of $2.7 trillion.","After many more years of deficits, the Bureau of Economic Analysis put that net gap at about $21 trillion in early 2026.")}`,
   check:[
    {id:"c4a", q:"A budget deficit reduces national saving. What happens to the real interest rate and NCO?", a:2,
     o:[["r falls, NCO rises","Less saving means fewer loanable funds. Does that make borrowing cheaper?"],["r rises, NCO rises","r rises, but a higher r makes U.S. assets more attractive."],["r rises, NCO falls","Correct."]],
     hint:"Step 1 and step 2 of the diagram.", more:"Investment also falls: crowding out."},
    {id:"c4b", q:"Starting from balanced trade, a budget deficit causes the real exchange rate to…", a:0,
     o:[["Appreciate, creating a trade deficit","Correct. Lower NCO, fewer dollars supplied, higher E, lower NX."],["Depreciate, creating a trade surplus","Did the supply of dollars rise or fall?"],["Stay the same, with balanced trade","The FX supply curve moved in step 3."]],
     hint:"Look at panel (c) in step 3.", more:"Hence the “twin deficits.”"}
   ]},
 { title:"Investment incentives", html:`
   <p>Now suppose the government offers tax incentives for investment.</p>
   <div class="fig" data-fig="scen" data-key="invest"></div>
   <div class="stack">
     <div class="info"><b>Same short-run direction as a deficit</b><span>r ↑, NCO ↓, E ↑, NX ↓.</span></div>
     <div class="info"><b>Opposite long-run effect</b><span>An effective ${g("Investment tax incentive","investment incentive")} <b>raises</b> investment, boosting productivity and living standards. A budget deficit <b>reduces</b> investment.</span></div>
   </div>`,
   check:[
    {id:"c5a", q:"An investment tax incentive shifts which curve in the loanable funds market?", a:1,
     o:[["Supply, to the left","Supply is saving. Did saving change?"],["Demand, to the right","Correct. Firms want to borrow more at every r."],["Neither","Investment is part of demand. Something moves."]],
     hint:"Demand = I + NCO. Which part changed?", more:"Then r rises and the rest of the chain follows."},
    {id:"c5b", q:"What is the key difference between a budget deficit and an investment incentive?", a:2,
     o:[["They move the exchange rate in opposite directions","Both appreciate the real exchange rate."],["Only the deficit raises interest rates","Both raise r."],["The incentive raises investment; the deficit lowers it","Correct, which matters for long-run growth."]],
     hint:"Compare what happens to I in each summary table.", more:"Investment builds the capital stock that raises future productivity."}
   ]},
 { title:"Trade policy: tariffs and quotas", html:`
   <p>${g("Trade policy")} directly changes imports or exports: a ${g("Tariff","tariff")} (tax on imports), an ${g("Import quota","import quota")} (limit on imports), or a ${g("Voluntary export restriction","voluntary export restriction")}.</p>
   <p>Politicians often restrict imports to save jobs or cut the trade deficit. Does it work? Here’s a quota on Japanese cars:</p>
   <div class="fig" data-fig="scen" data-key="quota"></div>
   <div class="fig" data-fig="jobs"></div>`,
   check:[
    {id:"c6a", q:"Why doesn’t an import quota reduce the trade deficit?", a:1,
     o:[["Because imports don’t actually fall","Imports of cars do fall. What else changes?"],["Because it doesn’t change saving or investment, so NCO and NX stay the same","Correct. The dollar appreciates until NX is back where it started."],["Because quotas raise interest rates","Panels (a) and (b) didn’t move."]],
     hint:"NX = NCO = S − I. Did the quota change S or I?", more:"Exports fall as much as imports."},
    {id:"c6b", q:"After the quota, the real exchange rate…", a:0,
     o:[["Appreciates","Correct. Demand for dollars rose with NX at the old E."],["Depreciates","Did demand for dollars rise or fall?"],["Is unchanged","The demand curve shifted in panel (c)."]],
     hint:"Look at panel (c) in step 3.", more:"The stronger dollar is what costs export jobs."}
   ]},
 { title:"Capital flows and capital flight", html:`
   <p>${g("Capital flight")} is a large, sudden drop in demand for a country’s assets. In 1994, political instability in Mexico made investors sell Mexican assets and pull their money out. We look at it from <b>Mexico’s</b> side.</p>
   <div class="fig" data-fig="scen" data-key="flight" data-opts="flight,china"></div>
   <p>Capital flight hit Mexico (1994), Southeast Asia (1997), Russia (1998) and Argentina (2002): interest rates rose and currencies fell.</p>
   <p><b>China case study</b> (second tab): China bought U.S. assets to hold down its own currency and boost exports. In the U.S., the dollar appreciated against the renminbi, imports from China rose, and the trade deficit grew. Some politicians wanted trade restrictions, but U.S. consumers benefited, and the net effect was probably small.</p>`,
   check:[
    {id:"c7a", q:"During capital flight from Mexico, Mexico’s NCO curve…", a:0,
     o:[["Shifts right, so NCO rises","Correct. Investors move money out at every interest rate."],["Shifts left, so NCO falls","They’re selling Mexican assets. Does capital flow in or out?"],["Doesn’t move","The whole point is that investors changed their behavior."]],
     hint:"Step 1 of the capital flight diagram.", more:"That raises demand for loanable funds, so Mexico’s r rises."},
    {id:"c7b", q:"Capital flight causes the country’s currency to…", a:1,
     o:[["Appreciate","More of the currency is being sold. Does that raise its value?"],["Depreciate","Correct. Higher NCO means more pesos supplied."],["Stay the same","The supply curve shifts in panel (c)."]],
     hint:"Look at the supply of pesos in panel (c).", more:"Mexico, Southeast Asia, Russia and Argentina all saw this."}
   ]},
 { title:"Putting it together", html:`
   <p>The big lesson: <b>the trade deficit comes from our own saving and investment</b>, not from other countries’ “unfair” practices. Stagnant living standards come from low productivity growth, not imports.</p>
   <div class="fig" data-fig="myth"></div>
   <p>Now practice the whole model on new events:</p>
   <div class="fig" data-fig="predict"></div>`,
   check:[
    {id:"c8a", q:"According to the lecture, the main cause of the U.S. trade deficit is…", a:2,
     o:[["Unfair trade practices abroad","The model says NX = S − I. Where’s trade policy in that?"],["Too many imports","Imports are part of NX, but what determines NX overall?"],["Low U.S. saving relative to investment","Correct."]],
     hint:"NX = NCO = S − I.", more:"That’s why import restrictions don’t fix the deficit."},
    {id:"c8b", q:"Households decide to save more. What happens to net exports?", a:0,
     o:[["They rise","Correct. Saving ↑ → r ↓ → NCO ↑ → E ↓ → NX ↑."],["They fall","More saving lowers r. Follow the chain."],["No change","Saving is in the S = I + NCO identity, so NX changes."]],
     hint:"It’s the opposite of a budget deficit.", more:"Raising saving is the model’s answer to a trade deficit."}
   ]}
];
const FIGS = { lf:figLF, fx:figFX, link:figLink, scen:el => figScenario(el, el.dataset.key), jobs:figJobs, myth:figMyth, predict:figPredict };

/* ---------- self-check ---------- */
const QUIZ = [
 {id:"q1", L:0, q:"In an open economy, the supply of loanable funds comes from…", a:0, hint:"Who supplies funds to borrowers?", o:[["National saving","Right."],["Net capital outflow","NCO is part of demand."],["Net exports","NX equals NCO, which is on the demand side."],["Investment","Investment is demand."]], more:"S = I + NCO."},
 {id:"q2", L:0, q:"Why does demand for loanable funds slope downward?", a:2, hint:"What happens to I and NCO when r rises?", o:[["Because saving rises with r","That’s why supply slopes up."],["Because NX rises with r","NX equals NCO, which falls with r."],["Because both I and NCO fall when r rises","Right."],["It doesn’t; it’s vertical","Only the FX supply curve is vertical."]], more:"Higher r: fewer projects worth borrowing for, and U.S. assets look better than foreign ones."},
 {id:"q3", L:0, q:"A higher U.S. real interest rate makes NCO…", a:1, hint:"Which assets look more attractive?", o:[["Rise","U.S. assets now pay more. Does money flow out?"],["Fall","Right."],["Unchanged","NCO depends on r."],["Equal to saving","Not generally."]], more:"Americans keep money home; foreigners buy U.S. assets."},
 {id:"q4", L:1, q:"In the foreign-exchange market, the demand for dollars comes from…", a:3, hint:"Why do foreigners need dollars?", o:[["NCO","NCO is the supply of dollars."],["Saving","Saving is in the other market."],["The Fed","Not in this model."],["Net exports","Right. Foreigners need dollars to buy U.S. net exports."]], more:"Demand slopes down: higher E means fewer net exports."},
 {id:"q5", L:1, q:"The supply of dollars in the foreign-exchange market equals…", a:0, hint:"Why do Americans sell dollars?", o:[["NCO","Right. To buy foreign assets."],["NX","NX is demand."],["Imports only","Imports matter for NX, not for this supply curve."],["The money supply","This isn’t the money market."]], more:"And it’s vertical."},
 {id:"q6", L:1, q:"A higher real exchange rate E means…", a:2, hint:"E = (e × P) ÷ P*.", o:[["U.S. goods are cheaper for foreigners","That would be a lower E."],["NX rises","Expensive U.S. goods mean fewer exports."],["U.S. goods are more expensive relative to foreign goods","Right."],["NCO rises","E doesn’t affect NCO."]], more:"So NX falls as E rises."},
 {id:"q7", L:1, q:"In equilibrium in the foreign-exchange market…", a:1, hint:"Supply = demand.", o:[["S = I","That’s a closed economy idea."],["NX = NCO","Right."],["E = 1 always","E is whatever balances the market."],["NX = 0 always","NX can be negative or positive."]], more:"The identity from Lecture 8 is the equilibrium condition."},
 {id:"q8", L:2, q:"Anything that raises r will…", a:0, hint:"Follow the chain through NCO.", o:[["Reduce NCO and appreciate the real exchange rate","Right."],["Raise NCO and depreciate E","Higher r makes U.S. assets more attractive."],["Leave E unchanged","The markets are linked."],["Raise NX","Lower NCO means lower NX."]], more:"r ↑ → NCO ↓ → E ↑ → NX ↓."},
 {id:"q9", L:2, q:"Which variable is the link between the two markets?", a:3, hint:"It appears in both diagrams.", o:[["Saving","Only in loanable funds."],["The nominal exchange rate","Not part of this model’s link."],["Investment","Only in loanable funds."],["Net capital outflow","Right."]], more:"Part of LF demand, and the FX supply."},
 {id:"q10", L:3, q:"A budget deficit affects national saving by…", a:1, hint:"Public saving = T − G.", o:[["Raising it","A deficit is negative public saving."],["Lowering it","Right."],["Not changing it","Public saving is part of national saving."],["Turning it into NCO","Saving falls; NCO falls separately."]], more:"Supply of loanable funds shifts left."},
 {id:"q11", L:3, q:"Which list gives the effects of a budget deficit in order?", a:2, hint:"Start in the loanable funds market.", o:[["NX ↓ → E ↑ → r ↑ → saving ↓","That’s backwards."],["Saving ↓ → r ↓ → NCO ↑ → E ↓","A drop in saving raises r."],["Saving ↓ → r ↑ → NCO ↓ → E ↑ → NX ↓","Right."],["Saving ↑ → r ↓ → NX ↑","A deficit lowers saving."]], more:"The lecture’s summary slide."},
 {id:"q12", L:3, q:"The “twin deficits” refers to…", a:0, hint:"Which two deficits move together?", o:[["Budget deficits and trade deficits tending to occur together","Right."],["Two years of budget deficits in a row","It’s about two different deficits."],["The U.S. and China both running deficits","China often runs surpluses."],["Deficits in saving and investment","Saving and investment aren’t usually called deficits."]], more:"Lower saving drives both."},
 {id:"q13", L:4, q:"An investment tax incentive will…", a:3, hint:"It shifts demand for loanable funds right.", o:[["Lower r and depreciate the dollar","Demand rising pushes r up."],["Leave NX unchanged","r rises, so NCO and NX fall."],["Reduce investment","It raises investment."],["Raise r, reduce NCO, appreciate E and reduce NX","Right."]], more:"Like a deficit in the short run, better for long-run growth."},
 {id:"q14", L:4, q:"Why is an investment incentive better for long-run living standards than a budget deficit?", a:1, hint:"Compare what happens to I.", o:[["It lowers interest rates","Both raise r."],["It raises investment and productivity growth","Right."],["It creates a trade surplus","It pushes toward a deficit too."],["It doesn’t affect the exchange rate","Both appreciate E."]], more:"A deficit crowds out investment."},
 {id:"q15", L:5, q:"An import quota on cars affects the foreign-exchange market by…", a:2, hint:"At each E, what happens to NX?", o:[["Shifting supply of dollars left","NCO didn’t change, so supply didn’t move."],["Shifting supply of dollars right","Same: NCO is unchanged."],["Shifting demand for dollars right","Right. Fewer imports means higher NX at each E."],["Nothing","Demand for dollars changes."]], more:"E rises until NX returns to its old level."},
 {id:"q16", L:5, q:"After an import quota, U.S. net exports…", a:3, hint:"NX = NCO. Did NCO change?", o:[["Rise a lot","The dollar appreciates and cuts exports."],["Fall a lot","Imports fell too."],["Become positive","Only if NCO became positive."],["Stay the same","Right. Imports and exports both fall."]], more:"Trade policy can’t fix a trade deficit in this model."},
 {id:"q17", L:6, q:"Capital flight from a country causes its interest rate to ___ and its currency to ___.", a:0, hint:"NCO shifts right in that country.", o:[["Rise; depreciate","Right."],["Fall; appreciate","Investors are pulling money out."],["Rise; appreciate","More currency supplied lowers its value."],["Fall; depreciate","Demand for loanable funds rose."]], more:"Mexico 1994."},
 {id:"q18", L:6, q:"When China buys large amounts of U.S. assets, the dollar ___ and the U.S. trade deficit ___.", a:1, hint:"U.S. NCO falls.", o:[["Depreciates; shrinks","Fewer dollars supplied raises the dollar’s value."],["Appreciates; grows","Right."],["Appreciates; shrinks","A stronger dollar lowers NX."],["Doesn’t change; doesn’t change","U.S. NCO falls."]], more:"Cheaper imports for U.S. consumers."},
 {id:"q19", L:7, q:"According to the lecture’s conclusion, U.S. trade deficits are caused mainly by…", a:2, hint:"NX = S − I.", o:[["Unfair trade practices abroad","The lecture calls this a myth."],["Too little protection","Protection doesn’t change NX."],["Low U.S. saving","Right."],["High U.S. productivity","Productivity affects living standards."]], more:"Don’t blame the international economy."},
 {id:"q20", L:7, q:"Households save more. The real exchange rate…", a:1, hint:"Saving ↑ → r ↓ → …", o:[["Appreciates","Lower r raises NCO, adding dollars to the market."],["Depreciates","Right."],["Is unchanged","The chain runs through NCO."],["Becomes fixed","Exchange rates still float."]], more:"And NX rises."}
];
const ROUNDS = [["Round 1","Loanable funds and FX markets",0],["Round 2","The link and budget deficits",5],["Round 3","Deficits, incentives, trade policy",10],["Round 4","Capital flight and conclusions",15],["Mixed round","5 random questions",-1],["My weak spots","Questions you’ve missed before, mixed up",-2],["Direction drills","Random events: which way does each variable move?",-3]];
function genDrill(){
  const EVS = [
    ["The government runs a larger budget deficit", {sS:-15}, 3, "saving ↓ → r ↑ → NCO ↓ → E ↑ → NX ↓"],
    ["The government cuts its budget deficit", {sS:15}, 3, "saving ↑ → r ↓ → NCO ↑ → E ↓ → NX ↑"],
    ["A new tax credit boosts investment demand", {dS:15}, 4, "investment demand ↑ → r ↑ → NCO ↓ → E ↑ → NX ↓"],
    ["The U.S. imposes a quota on imports", {xS:15}, 5, "S and I unchanged → r and NCO unchanged → demand for $ ↑ → E ↑ → NX unchanged"],
    ["Foreign investors pour money into U.S. assets", {nS:-15}, 6, "NCO ↓ at every r → r ↓ → supply of $ ↓ → E ↑ → NX ↓"],
    ["Political turmoil makes investors flee the U.S. (capital flight)", {nS:15}, 6, "NCO ↑ at every r → r ↑ → supply of $ ↑ → E ↓ → NX ↑"]
  ];
  const VARS = [["r","the real interest rate"],["NCO","net capital outflow"],["E","the real exchange rate"],["NX","net exports"]];
  const ev = EVS[Math.floor(Math.random()*EVS.length)], v = VARS[Math.floor(Math.random()*VARS.length)];
  const e0 = eqm({}), e1 = eqm(ev[1]), ans = arr(e0[v[0]], e1[v[0]]);
  const label = {"↑":"Rises","↓":"Falls","–":"Doesn’t change"};
  const o = [["↑"],["↓"],["–"]].map(a => [label[a[0]], a[0] === ans ? `Right. Chain: ${ev[3]}.` : `Not this one. Trace the chain step by step: ${ev[3].split("→")[0].trim()} → …`]);
  return {id:"gen", gen:true, L:ev[2], q:`${ev[0]}. What happens to ${v[1]}?`, o, a:["↑","↓","–"].indexOf(ans), hint:"Start with saving or investment (or NCO), find r, then follow NCO → E → NX.", more:"New events every round."};
}

/* ---------- short answers ---------- */
const WRITE = [
 {q:"In an open economy, what are the supply and demand in the market for loanable funds? Explain why NCO depends on the real interest rate.",
  keys:[["Supply = national saving",/supply.{0,40}sav/i],["Demand = I + NCO",/demand.{0,40}(invest|i\b).{0,20}(nco|net capital)/i],["Higher r makes domestic assets more attractive",/(higher|rise|increase).{0,40}(r\b|interest).{0,80}(attractive|domestic assets|u\.?s\.? assets)/i],["So NCO falls when r rises",/nco.{0,30}(fall|decreas|lower|drop)/i]],
  model:"In an open economy, the supply of loanable funds is national saving, and the demand is domestic investment plus net capital outflow (S = I + NCO), because a dollar of saving can buy domestic capital or a foreign asset. NCO depends negatively on the real interest rate: when r rises, U.S. assets become more attractive, so Americans buy fewer foreign assets and foreigners buy more U.S. assets, and NCO falls."},
 {q:"Describe the market for foreign-currency exchange: what are supply and demand, what is the price, and why is supply vertical?",
  keys:[["Demand for dollars = NX",/demand.{0,40}(nx|net exports)/i],["Supply of dollars = NCO",/supply.{0,40}(nco|net capital)/i],["Price = real exchange rate",/real exchange rate/i],["Vertical because E doesn’t affect saving/investment/NCO",/vertical.{0,120}(sav|invest|nco)|(sav|invest|nco).{0,120}vertical/i]],
  model:"In the market for foreign-currency exchange, the demand for dollars comes from net exports, since foreigners need dollars to buy U.S. goods, and the supply of dollars comes from net capital outflow, since Americans sell dollars to buy foreign assets. The price is the real exchange rate E. Demand slopes down because a higher E makes U.S. goods more expensive. Supply is vertical because E does not affect saving or investment, so it does not affect NCO."},
 {q:"Explain how net capital outflow connects the loanable funds market and the foreign-exchange market.",
  keys:[["LF market determines r",/(loanable funds).{0,60}(determin|set).{0,20}(r\b|interest)/i],["r determines NCO",/(r\b|interest rate).{0,40}(determin|set|affect).{0,20}nco/i],["NCO is the supply of dollars",/nco.{0,40}supply.{0,20}dollar|supply.{0,20}dollar.{0,40}nco/i],["Higher r → lower NCO → appreciation",/apprecia/i]],
  model:"The loanable funds market determines the real interest rate r. That r determines net capital outflow through the downward-sloping NCO curve. NCO is the supply of dollars in the foreign-exchange market, so it determines the real exchange rate and net exports. Anything that raises r reduces NCO, reduces the supply of dollars, and appreciates the real exchange rate."},
 {q:"Using the open-economy model, explain step by step the effects of a government budget deficit.",
  keys:[["Saving falls; supply of LF shifts left",/sav.{0,30}(fall|decreas|lower|reduc)/i],["r rises; investment falls",/(r\b|interest).{0,20}(rise|increas)/i],["NCO falls",/nco.{0,20}(fall|decreas|lower|reduc)/i],["Supply of dollars falls; E appreciates",/apprecia/i],["NX falls: twin deficits",/(nx|net exports).{0,20}(fall|decreas|lower|reduc)|trade deficit|twin/i]],
  model:"A budget deficit reduces national saving, shifting the supply of loanable funds left. The real interest rate rises and domestic investment falls. The higher interest rate makes U.S. assets more attractive, so net capital outflow falls. Lower NCO reduces the supply of dollars in the foreign-exchange market, so the real exchange rate appreciates. The stronger dollar reduces net exports, pushing the trade balance toward deficit: the twin deficits."},
 {q:"Compare an investment tax incentive with a budget deficit. How are their effects similar, and how are they different?",
  keys:[["Incentive shifts demand for LF right",/demand.{0,40}(right|increas|rise)/i],["Both raise r, lower NCO, appreciate E, lower NX",/(both|similar|same).{0,80}(r\b|interest|apprecia|nco|nx)/i],["Incentive raises investment; deficit lowers it",/invest.{0,40}(rise|increas|higher).{0,120}(deficit).{0,60}(reduc|lower|fall)|deficit.{0,60}(reduc|lower|fall).{0,30}invest/i],["Long-run growth / living standards",/long.?run|growth|productiv|living standard/i]],
  model:"An investment tax incentive raises investment demand, shifting the demand for loanable funds to the right. Like a budget deficit, it raises the real interest rate, reduces NCO, appreciates the real exchange rate and reduces net exports. The key difference is investment: the incentive increases investment, raising productivity growth and living standards in the long run, while a budget deficit reduces investment, lowering future productivity."},
 {q:"Can an import quota reduce a country’s trade deficit or save jobs? Explain with the model.",
  keys:[["Quota doesn’t change S or I, so NCO unchanged",/(sav|invest).{0,80}(nco).{0,30}(unchang|same|not change|doesn.t change)|nco.{0,30}(unchang|same|not change|doesn.t change)/i],["Demand for dollars rises; E appreciates",/apprecia/i],["NX unchanged; exports fall with imports",/(nx|net exports|trade deficit).{0,40}(unchang|same|not change|doesn.t change|not reduce)|exports.{0,20}fall/i],["Jobs saved in one industry, lost in exports",/job.{0,120}(export)/i]],
  model:"An import quota does not change saving or investment, so it does not change net capital outflow or the supply of dollars. It reduces imports, so net exports rise at each exchange rate and the demand for dollars shifts right. The real exchange rate appreciates until net exports return to their original level, equal to the unchanged NCO. So the trade deficit doesn’t shrink. The quota saves jobs in the car industry but the stronger dollar reduces exports, destroying jobs in export industries."},
 {q:"What is capital flight? Using Mexico in 1994, explain its effects on interest rates and the exchange rate.",
  keys:[["Large, sudden drop in demand for a country’s assets",/(sudden|large).{0,60}(demand|sell|pull).{0,40}asset/i],["NCO rises at every r",/nco.{0,40}(rise|increas|shift)/i],["Demand for LF rises; r rises",/(interest|r\b).{0,30}(rise|increas)/i],["More pesos supplied; peso depreciates",/(peso|currency).{0,40}deprecia|deprecia.{0,40}peso/i]],
  model:"Capital flight is a large and sudden reduction in the demand for assets located in a country. In 1994, political instability in Mexico made investors sell Mexican assets and pull their capital out, so Mexico’s NCO rose at every interest rate. Since demand for loanable funds equals I + NCO, demand rose and Mexico’s interest rate rose. Higher NCO also increased the supply of pesos in the foreign-exchange market, so the peso depreciated."},
 {q:"Explain the lecture’s conclusion: why shouldn’t we blame the U.S. trade deficit on other countries?",
  keys:[["NX = S − I",/s\s?(−|-)\s?i|saving.{0,40}investment/i],["Deficit caused by low U.S. saving",/low.{0,20}saving|saving.{0,20}(low|less|insufficient)/i],["Not unfair trade practices",/unfair|other countries|trade practices/i],["Living standards depend on productivity, not imports",/productiv/i]],
  model:"In the open-economy model, net exports equal net capital outflow, which equals saving minus investment. So the U.S. trade deficit is caused by low U.S. saving relative to investment, not by other countries’ unfair trade practices, and trade restrictions can’t fix it. Likewise, stagnant living standards come from low productivity growth, not from imports. Understanding this helps separate myth from reality in debates about trade."}
];
const WTAG = [0,1,2,3,4,5,6,7];
