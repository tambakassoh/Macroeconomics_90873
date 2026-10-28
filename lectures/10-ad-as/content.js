/* Lecture 10: Aggregate Demand and Aggregate Supply — lab content (loaded after assets/lab.js) */

const CARDS = [
 ["Business cycle","Short-run fluctuations in output and employment around the long-run trend.","Recessions and expansions."],
 ["Recession","A period of falling real incomes and rising unemployment.","2008–2009: real GDP fell about 4%."],
 ["Depression","A severe recession. Very rare.","The Great Depression, 1929–1933."],
 ["Aggregate-demand curve","Shows the quantity of all goods and services demanded at each price level.","It slopes downward."],
 ["Wealth effect","A higher price level lowers the real value of money people hold, so they feel poorer and consume less.","P ↑ → C ↓."],
 ["Interest-rate effect","A higher price level raises money demand and interest rates, so investment falls.","P ↑ → r ↑ → I ↓."],
 ["Exchange-rate effect","Higher interest rates attract foreign investors, the dollar appreciates, and net exports fall.","P ↑ → r ↑ → $ ↑ → NX ↓."],
 ["Shifts in AD","Any change in C, I, G or NX other than one caused by the price level shifts AD.","A stock market boom shifts AD right."],
 ["Long-run aggregate-supply curve","Vertical at the natural rate of output. In the long run, the price level doesn’t affect output.","Classical dichotomy."],
 ["Natural rate of output","YN: output when unemployment is at its natural rate. Also called potential or full-employment output.","Set by labor, capital, natural resources and technology."],
 ["Short-run aggregate-supply curve","Slopes upward over 1–2 years: a higher price level raises the quantity supplied.","The key to short-run fluctuations."],
 ["Sticky-wage theory","Nominal wages are set in advance. If P > PE, revenue rises but wages don’t, so firms produce more.","Labor contracts, social norms."],
 ["Sticky-price theory","Menu costs make some prices slow to adjust. Firms with sticky prices are relatively cheap, so they sell and produce more.","Printing new menus, changing price tags."],
 ["Misperceptions theory","Firms mistake a rise in the overall price level for a rise in their own relative price, and produce more.",""],
 ["Y = YN + a(P − PE)","Output rises above its natural rate when the price level is higher than expected.","a > 0 measures how much Y responds."],
 ["Expected price level","PE: the price level people expect. A higher PE shifts SRAS left.","Higher expected prices → higher wages set in advance."],
 ["Long-run equilibrium","Where AD, SRAS and LRAS meet: P = PE, Y = YN, unemployment at its natural rate.",""],
 ["Stagflation","Falling output with rising prices, caused by an adverse shift in SRAS.","The 1970s oil shocks."],
 ["Accommodating a supply shock","Using fiscal or monetary policy to raise AD after SRAS shifts left: output returns faster, but prices stay higher.",""],
 ["Four steps","1. AD or AS? 2. Left or right? 3. Short-run effect on P and Y. 4. Adjustment to the new long run.",""]
];
const CNOTE = {
 "Recession":"🕒 Today: the U.S. also had a short, very deep recession in 2020, during the pandemic.",
 "Y = YN + a(P − PE)":"📘 Textbook model, as in the lecture."
};
const TB = new Set(["c6a","c6b","c7a","c7b","c8a","c8b","c9a","c9b","q13","q14","q15","q16","q17","q18","q19","q20"]);
const TODAY = {};

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

/* ---------- historical data from the Lecture 10 slides ---------- */
const H10 = {"gdp":{"x0":1965.0,"dx":0.25,"y":[3516.3,3564.0,3636.3,3724.0,3815.4,3828.1,3853.3,3884.5,3918.7,3919.6,3950.8,3981.0,4063.0,4132.0,4160.3,4178.3,4244.1,4256.5,4283.4,4263.3,4256.6,4264.3,4302.3,4256.6,4374.0,4398.8,4433.9,4446.3,4525.8,4633.1,4677.5,4754.5,4876.2,4932.6,4906.3,4953.1,4909.6,4922.2,4873.5,4854.3,4795.3,4831.9,4913.3,4977.5,5090.7,5128.9,5154.1,5191.5,5251.8,5356.1,5451.9,5450.8,5469.4,5684.6,5740.3,5816.2,5825.9,5831.4,5873.3,5889.5,5908.5,5787.4,5776.6,5883.5,6005.7,5957.8,6030.2,5955.1,5857.3,5889.1,5866.4,5871.0,5944.0,6077.6,6197.5,6325.6,6448.3,6559.6,6623.3,6677.3,6740.3,6797.3,6903.5,6955.9,7022.8,7051.0,7119.0,7153.4,7193.0,7269.5,7332.6,7458.0,7496.6,7592.9,7632.1,7734.0,7806.6,7865.0,7927.4,7944.7,8027.7,8059.6,8059.5,7988.9,7950.2,8003.8,8037.5,8069.0,8157.6,8244.3,8329.4,8417.0,8432.5,8486.4,8531.1,8643.8,8727.9,8847.3,8904.3,9003.2,9025.3,9044.7,9120.7,9184.3,9247.2,9407.1,9488.9,9592.5,9666.2,9809.6,9932.7,10008.9,10103.4,10194.3,10328.8,10507.6,10601.2,10684.0,10819.9,11014.3,11043.0,11258.5,11267.9,11334.5,11297.2,11371.3,11340.1,11380.1,11477.9,11538.8,11596.4,11598.8,11645.8,11738.7,11935.5,12042.8,12127.6,12213.8,12303.5,12410.3,12534.1,12587.5,12683.2,12748.7,12915.9,12962.5,12965.9,13060.7,13089.3,13194.1,13268.5,13363.5,13339.2,13359.0,13223.5,12993.7,12832.6,12810.0,12860.8,13019.0,13138.8,13194.9,13278.5,13380.7,13438.8]},"inv":{"x0":1965.0,"dx":0.25,"y":[429.1,429.1,444.4,446.5,484.2,475.4,470.7,473.0,460.0,440.4,453.0,462.8,472.9,492.0,476.1,481.0,512.7,508.6,520.4,492.3,476.9,478.4,486.6,458.4,517.9,534.0,541.0,524.1,561.1,595.5,604.0,607.1,645.7,675.8,649.4,674.3,631.2,628.1,592.7,598.3,493.2,476.1,516.4,530.6,585.5,610.5,611.6,615.9,646.2,696.1,734.1,713.4,727.5,777.5,801.5,819.7,819.6,817.7,801.7,786.8,781.1,710.6,656.5,723.2,795.1,757.2,804.2,773.1,692.5,691.9,683.8,622.9,645.1,707.4,754.9,834.4,921.8,952.8,975.0,959.0,927.4,943.4,933.0,969.4,967.4,946.0,916.3,917.7,945.8,947.1,948.1,1022.0,964.4,987.9,994.2,1007.4,1046.0,1033.8,1021.6,1011.1,1021.1,1021.4,997.3,934.2,896.2,891.7,913.9,948.9,927.8,988.9,999.1,1030.8,1055.0,1063.3,1062.5,1118.6,1166.8,1234.9,1212.7,1269.2,1282.1,1247.6,1235.6,1270.4,1287.1,1353.8,1422.1,1418.2,1451.3,1544.0,1571.4,1596.5,1672.7,1652.7,1700.1,1754.7,1810.0,1803.7,1848.9,1914.6,1887.8,2018.5,1987.0,1987.8,1882.7,1876.7,1837.1,1731.2,1789.3,1810.8,1814.5,1813.2,1813.1,1823.7,1889.9,1959.8,1970.0,2055.6,2082.2,2125.2,2170.3,2131.5,2154.9,2232.2,2264.7,2261.2,2229.6,2166.0,2146.1,2195.1,2178.9,2126.1,2074.3,2033.8,1967.2,1753.8,1529.5,1453.2,1494.5,1585.7,1690.2,1791.5,1855.1,1761.3,1797.5]},"u":{"x0":1965.0,"dx":0.25,"y":[4.9,4.7,4.4,4.1,3.9,3.8,3.8,3.7,3.8,3.8,3.8,3.9,3.7,3.6,3.5,3.4,3.4,3.4,3.6,3.6,4.2,4.8,5.2,5.8,5.9,5.9,6.0,5.9,5.8,5.7,5.6,5.4,4.9,4.9,4.8,4.8,5.1,5.2,5.6,6.6,8.3,8.9,8.5,8.3,7.7,7.6,7.7,7.8,7.5,7.1,6.9,6.7,6.3,6.0,6.0,5.9,5.9,5.7,5.9,6.0,6.3,7.3,7.7,7.4,7.4,7.4,7.4,8.2,8.8,9.4,9.9,10.7,10.4,10.1,9.4,8.5,7.9,7.4,7.4,7.3,7.2,7.3,7.2,7.0,7.0,7.2,7.0,6.8,6.6,6.3,6.0,5.8,5.7,5.5,5.5,5.3,5.2,5.2,5.2,5.4,5.3,5.3,5.7,6.1,6.6,6.8,6.9,7.1,7.4,7.6,7.6,7.4,7.1,7.1,6.8,6.6,6.6,6.2,6.0,5.6,5.5,5.7,5.7,5.6,5.5,5.5,5.3,5.3,5.2,5.0,4.9,4.7,4.6,4.4,4.5,4.4,4.3,4.3,4.2,4.1,4.0,3.9,4.0,3.9,4.2,4.4,4.8,5.5,5.7,5.8,5.7,5.9,5.9,6.1,6.1,5.8,5.7,5.6,5.4,5.4,5.3,5.1,5.0,5.0,4.7,4.6,4.6,4.4,4.5,4.5,4.7,4.8,5.0,5.3,6.0,6.9,8.2,9.3,9.7,10.0,9.7,9.6,9.6,9.6,8.9]},"cs":{"x0":2000.0,"dx":0.083333,"y":[100.6,101.7,102.8,104.0,105.3,106.4,107.1,107.9,108.6,109.5,110.6,111.8,113.0,114.1,115.1,115.8,116.3,116.9,117.5,118.2,119.0,119.7,120.3,120.7,121.4,122.2,123.3,124.5,125.9,127.4,128.9,130.3,131.5,132.8,134.1,135.4,136.5,137.4,138.4,139.2,140.2,140.9,142.1,143.6,145.3,147.0,148.8,150.8,152.6,154.5,156.9,159.3,161.8,164.3,166.4,168.1,169.7,171.3,173.1,175.1,177.6,180.2,183.2,185.5,187.6,189.6,191.4,193.4,195.7,197.9,200.1,202.2,203.8,205.3,206.1,206.5,206.5,205.9,205.1,204.2,203.6,203.6,203.6,203.4,203.7,204.0,203.9,202.6,201.1,199.0,197.2,195.1,193.2,191.0,187.8,184.9,181.9,178.3,175.2,172.1,169.6,167.4,164.9,162.5,159.3,156.3,153.5,150.4,147.4,145.2,142.8,141.1,141.0,141.6,143.0,144.0,144.3,144.7,145.1,145.8,146.4,146.3,146.4,146.6,147.6,147.6,147.5,146.2,144.8,143.4,142.7,142.2,141.9,141.5,141.2]}};
const RECESS = [[1969.92,1970.83],[1973.83,1975.17],[1980.0,1980.5],[1981.5,1982.83],[1990.5,1991.17],[2001.17,2001.83],[2007.92,2009.42]];
function lineChart(o){
  const w = 340, h = 220, L = 46, R = 10, T = 12, B = 26, x0 = o.x0, x1 = o.x1, y0 = o.y0, y1 = o.y1;
  const X = x => L + (x-x0)/(x1-x0)*(w-L-R), Y = y => T + (y1-y)/(y1-y0)*(h-T-B);
  const shade = (o.recess ? RECESS : []).filter(r => r[1] > x0 && r[0] < x1).map(r => `<rect x="${X(Math.max(r[0],x0))}" y="${T}" width="${X(Math.min(r[1],x1))-X(Math.max(r[0],x0))}" height="${h-T-B}" style="fill:var(--gold-soft)"/>`).join("");
  const grid = o.ticks.map(v => `<line x1="${L}" y1="${Y(v)}" x2="${w-R}" y2="${Y(v)}" style="stroke:var(--line);stroke-width:1"/><text x="${L-4}" y="${Y(v)+4}" text-anchor="end" class="sm">${o.fmt(v)}</text>`).join("");
  const xt = o.xticks.map(t => `<text x="${X(t)}" y="${h-8}" text-anchor="middle" class="sm">${t}</text>`).join("");
  const line = `<polyline points="${o.y.map((v,i) => `${X(o.x0+i*o.dx).toFixed(1)},${Y(v).toFixed(1)}`).join(" ")}" style="fill:none;stroke:var(--note);stroke-width:2"/>`;
  const cur = o.at !== undefined ? `<line x1="${X(o.at)}" y1="${T}" x2="${X(o.at)}" y2="${h-B}" style="stroke:var(--ink);stroke-width:1;stroke-dasharray:3 3"/><circle cx="${X(o.at)}" cy="${Y(o.aty)}" r="5" style="fill:var(--wrong);stroke:var(--surface);stroke-width:2"/>` : "";
  return `<svg class="chart" viewBox="0 0 ${w} ${h}" role="img" aria-label="${o.aria}">${shade}${grid}${xt}${line}${cur}</svg>`;
}
function figFluct(el){
  const S = {
    gdp:{t:"Fact 1: fluctuations are irregular", lab:"Real GDP (billions of 2005 $)", d:H10.gdp, y0:3000, y1:14000, ticks:[4000,6000,8000,10000,12000,14000], fmt:v => "$" + (v/1000) + "T", val:v => "$" + v.toLocaleString("en-US") + " billion", note:"Real GDP grows over time, but with irregular dips. The shaded bars are recessions: no two are the same length or depth."},
    inv:{t:"Fact 2: quantities move together", lab:"Investment (billions of 2005 $)", d:H10.inv, y0:0, y1:2400, ticks:[0,600,1200,1800,2400], fmt:v => "$" + v, val:v => "$" + v.toLocaleString("en-US") + " billion", note:"Investment falls in every recession, and by much more (in percent) than GDP. Most macro quantities rise and fall together."},
    u:{t:"Fact 3: when output falls, unemployment rises", lab:"Unemployment rate (%)", d:H10.u, y0:0, y1:12, ticks:[0,3,6,9,12], fmt:v => v + "%", val:v => v + "%", note:"Unemployment jumps during each shaded recession, just as output falls."}
  };
  let k = "gdp";
  el.innerHTML = `<div class="figt">Three facts about economic fluctuations</div><p class="figsub">Data from the lecture’s slides, 1965–2011. Shaded bars are recessions.</p>
    <div class="seg" role="group" aria-label="Series" style="grid-template-columns:repeat(3,1fr)"><button type="button" aria-pressed="true" data-k="gdp" style="font-size:14px;padding:8px 4px">Real GDP</button><button type="button" aria-pressed="false" data-k="inv" style="font-size:14px;padding:8px 4px">Investment</button><button type="button" aria-pressed="false" data-k="u" style="font-size:14px;padding:8px 4px">Jobless rate</button></div>
    <div class="fl-t" style="font-weight:700;margin-bottom:4px"></div><div class="fl-c"></div>
    <label for="fl-y" style="display:flex;justify-content:space-between"><span>Year</span><b class="fl-yv"></b></label><input type="range" id="fl-y" min="1965" max="2011" step="0.25" value="2009">
    <div class="stack fl-v"></div><p class="cap fl-cap"></p>`;
  const sl = el.querySelector("#fl-y");
  const draw = () => { const s = S[k], t = +sl.value, i = Math.round((t - s.d.x0)/s.d.dx), v = s.d.y[i];
    el.querySelector(".fl-t").textContent = s.t;
    el.querySelector(".fl-c").innerHTML = lineChart({x0:1965, x1:2011, dx:s.d.dx, y:s.d.y, y0:s.y0, y1:s.y1, ticks:s.ticks, fmt:s.fmt, xticks:[1970,1980,1990,2000,2010], recess:true, at:t, aty:v, aria:s.lab});
    const q = ["Q1","Q2","Q3","Q4"][Math.round((t%1)*4)];
    el.querySelector(".fl-yv").textContent = Math.floor(t) + " " + q;
    const inRec = RECESS.some(r => t >= r[0] && t <= r[1]);
    el.querySelector(".fl-v").innerHTML = kv(s.lab, s.val(v)) + kv("In a recession?", inRec ? "<span style='color:var(--wrong)'>Yes</span>" : "No");
    el.querySelector(".fl-cap").innerHTML = s.note; };
  el.querySelectorAll(".seg button").forEach(b => b.onclick = () => { k = b.dataset.k; el.querySelectorAll(".seg button").forEach(x => x.setAttribute("aria-pressed", x === b)); draw(); });
  sl.oninput = draw; draw();
}

/* ---------- the AD–AS diagram ----------
   AD:   P = 100 − (Y − 100 − d)          (d > 0 shifts AD right)
   SRAS: P = PE + 0.5 (Y − YN)           (from Y = YN + 2(P − PE))
   LRAS: Y = YN                                                                 */
function sr(d, PE, YN){ YN = YN || 100; const u = (100 + d - PE + 0.5*(YN-100)) / 1.5; const Y = 100 + u; return {Y, P: 100 - (Y - 100 - d)}; }
function adas(o){
  const w = 340, h = 250, L = 40, R = 14, T = 14, B = 32, Xa = 60, Xb = 150, Ya = 60, Yb = 140;
  const X = y => L + (y-Xa)/(Xb-Xa)*(w-L-R), Yp = p => (h-B) - (p-Ya)/(Yb-Ya)*(h-T-B);
  const clip = pts => pts.filter(p => p[0] >= Xa && p[0] <= Xb && p[1] >= Ya && p[1] <= Yb);
  const poly = (pts, col, faded) => `<polyline points="${clip(pts).map(p => `${X(p[0]).toFixed(1)},${Yp(p[1]).toFixed(1)}`).join(" ")}" style="fill:none;stroke:${faded ? "var(--border)" : col};stroke-width:${faded ? 2 : 3}${faded ? ";stroke-dasharray:6 5" : ""}"/>`;
  const lab = (p, txt, col, anchor) => p ? `<text x="${X(p[0]) + (anchor === "end" ? -4 : 4)}" y="${Yp(p[1]) - 5}" text-anchor="${anchor || "start"}" class="sm halo" style="font-weight:700;fill:${col}">${txt}</text>` : "";
  let out = "";
  (o.ad || []).forEach(a => { const pts = []; for (let Y = 55; Y <= 155; Y += 1) pts.push([Y, 100 - (Y - 100 - a.d)]); const c = clip(pts); out += poly(pts, "var(--gold)", a.faded) + lab(c[c.length-1], a.label, a.faded ? "var(--muted)" : "var(--gold)", "end"); });
  (o.sras || []).forEach(s => { const YN = s.YN || 100, pts = []; for (let Y = 55; Y <= 155; Y += 1) pts.push([Y, s.PE + 0.5*(Y-YN)]); const c = clip(pts); out += poly(pts, "var(--note)", s.faded) + lab(c[c.length-1], s.label, s.faded ? "var(--muted)" : "var(--note)", "end"); });
  (o.lras || []).forEach(l => { out += poly([[l.Y, 62],[l.Y, 138]], "var(--ink)", l.faded) + `<text x="${X(l.Y)+4}" y="${Yp(136)}" class="sm halo" style="font-weight:700;fill:${l.faded ? "var(--muted)" : "var(--ink)"}">${l.label}</text>`; });
  const guides = (o.pts || []).map(p => `<line x1="${L}" y1="${Yp(p.P)}" x2="${X(p.Y)}" y2="${Yp(p.P)}" style="stroke:var(--muted);stroke-width:1;stroke-dasharray:3 3"/><line x1="${X(p.Y)}" y1="${Yp(p.P)}" x2="${X(p.Y)}" y2="${h-B}" style="stroke:var(--muted);stroke-width:1;stroke-dasharray:3 3"/>`).join("");
  const dots = (o.pts || []).map(p => `<circle cx="${X(p.Y)}" cy="${Yp(p.P)}" r="6" style="fill:${p.old ? "var(--surface)" : "var(--wrong)"};stroke:${p.old ? "var(--muted)" : "var(--surface)"};stroke-width:2"/><text x="${X(p.Y)+8}" y="${Yp(p.P)+16}" class="sm halo" style="font-weight:700">${p.label || ""}</text>`).join("");
  return `<svg class="chart" viewBox="0 0 ${w} ${h}" role="img" aria-label="${o.aria || "Aggregate demand and aggregate supply diagram"}">
    <line x1="${L}" y1="${T}" x2="${L}" y2="${h-B}" style="stroke:var(--ink);stroke-width:1.5"/><line x1="${L}" y1="${h-B}" x2="${w-R}" y2="${h-B}" style="stroke:var(--ink);stroke-width:1.5"/>
    <text x="6" y="${T+10}" class="sm" style="font-weight:700">P</text><text x="${w-R}" y="${h-B+20}" text-anchor="end" class="sm" style="font-weight:700">Y (real GDP)</text>
    <text x="${L+4}" y="${T+10}" class="sm mute">price level</text>
    ${guides}${out}${dots}</svg>`;
}

function figADSlope(el){
  const EF = [
    ["Wealth effect","C","Dollars you hold buy fewer goods. Real wealth falls, people feel poorer, so <b>consumption falls</b>.",["P ↑","real wealth ↓","C ↓"]],
    ["Interest-rate effect","I","Buying goods takes more dollars, so money demand rises and people sell bonds. <b>Interest rates rise</b>, so <b>investment falls</b>.",["P ↑","money demand ↑","r ↑","I ↓"]],
    ["Exchange-rate effect","NX","Higher U.S. interest rates attract foreign investors. The dollar <b>appreciates</b>, U.S. exports get pricier, so <b>net exports fall</b>.",["P ↑","r ↑","$ appreciates","NX ↓"]]
  ];
  el.innerHTML = `<div class="figt">Why AD slopes downward</div><p class="figsub">Raise or lower the price level and see the quantity demanded change. Then tap each effect.</p>
    <label for="ads-p" style="display:flex;justify-content:space-between"><span>Price level P</span><b class="ads-pv"></b></label><input type="range" id="ads-p" min="80" max="120" step="5" value="100">
    <div class="ads-c"></div>
    <div class="choices" style="grid-template-columns:repeat(3,1fr)">${EF.map((e,i) => `<button type="button" class="choice ads-e" data-i="${i}">${e[0]}<br><small>(${e[1]})</small></button>`).join("")}</div>
    <div class="ads-x" style="margin-top:10px"></div><p class="cap ads-cap" aria-live="polite"></p>`;
  const sl = el.querySelector("#ads-p");
  const draw = () => { const P = +sl.value, Y = 200 - P;
    el.querySelector(".ads-pv").textContent = P;
    el.querySelector(".ads-c").innerHTML = adas({ad:[{d:0, label:"AD"}], pts:[{Y, P, label: P === 100 ? "" : (P > 100 ? "higher P" : "lower P")}], aria:"AD curve with the chosen price level"});
    el.querySelector(".ads-cap").innerHTML = P === 100 ? "At P = 100, the quantity of goods and services demanded is 100." : P > 100 ? `A <b>higher</b> price level cuts the quantity demanded to <b>${Y}</b>: a move <b>up along</b> the AD curve, not a shift.` : `A <b>lower</b> price level raises the quantity demanded to <b>${Y}</b>: a move <b>down along</b> the AD curve.`; };
  el.querySelectorAll(".ads-e").forEach(b => b.onclick = () => { el.querySelectorAll(".ads-e").forEach(x => x.classList.remove("right")); b.classList.add("right"); const e = EF[+b.dataset.i];
    el.querySelector(".ads-x").innerHTML = `<div class="chain">${e[3].map((c,j) => (j ? "→" : "") + `<span class="chip">${c}</span>`).join("")}</div><p class="small" style="margin:8px 0 0">${e[2]}</p>`; });
  sl.oninput = draw; draw();
}
function figADSort(el){
  sortActivity(el, "Shift or slide?", "From the lecture’s Active Learning, plus a few more.", [
    ["A ten-year-old investment tax credit expires.","L","Investment falls at every price level, so AD shifts left."],
    ["The U.S. exchange rate falls.","R","U.S. goods get cheaper abroad, NX rises, so AD shifts right."],
    ["A fall in prices increases the real value of consumers’ wealth.","M","A change in P causes a movement along AD (the wealth effect), not a shift."],
    ["States replace sales taxes with taxes on interest, dividends and capital gains.","R","Saving is taxed more and spending less, so C rises and AD shifts right."],
    ["The stock market crashes.","L","Households feel poorer and cut consumption: AD shifts left."],
    ["The government increases defense spending.","R","G rises, so AD shifts right."],
    ["Canada and Mexico fall into recession.","L","They buy fewer U.S. exports, NX falls: AD shifts left."]
  ], [["R","AD shifts right"],["L","AD shifts left"],["M","Move along AD"]], (it, z) => z === "M" ? "Did the price level cause this, or something else?" : "Which of C, I, G or NX changes, and in which direction?");
}
function figLRASSort(el){
  sortActivity(el, "Which way does LRAS shift?", "LRAS moves when labor, capital, natural resources or technology change.", [
    ["A wave of immigration increases the labor force.","R","More labor raises the natural rate of output."],
    ["Baby boomers retire in large numbers.","L","Less labor lowers YN."],
    ["More people earn college degrees.","R","More human capital raises productivity and YN."],
    ["A hurricane destroys many factories.","L","Less physical capital lowers YN."],
    ["New mineral deposits are discovered.","R","More natural resources raise YN."],
    ["A new technology raises productivity.","R","Technological progress raises YN."],
    ["The price level rises 10%.","N","P doesn’t change labor, capital, resources or technology, so LRAS stays put."]
  ], [["R","LRAS shifts right"],["L","LRAS shifts left"],["N","No shift"]], (it, z) => z === "N" ? "Does this change labor, capital, resources or technology?" : "Does it add to or take away from the economy’s productive resources?");
}
function figGrowth(el){
  const ST = [
    {y:"1990", lr:[{Y:90, label:"LRAS₁₉₉₀"}], ad:[{d:-10, label:"AD₁₉₉₀"}], pts:[{Y:90, P:100, label:"1990"}], cap:"1990: output is at its natural rate where AD crosses LRAS."},
    {y:"2000", lr:[{Y:90, label:"", faded:true},{Y:105, label:"LRAS₂₀₀₀"}], ad:[{d:-10, label:"", faded:true},{d:20, label:"AD₂₀₀₀"}], pts:[{Y:90, P:100, old:true},{Y:105, P:115, label:"2000"}], cap:"Technological progress shifts LRAS right. Money growth shifts AD right even more. Output and the price level both rise."},
    {y:"2010", lr:[{Y:90, label:"", faded:true},{Y:105, label:"", faded:true},{Y:120, label:"LRAS₂₀₁₀"}], ad:[{d:-10, label:"", faded:true},{d:20, label:"", faded:true},{d:50, label:"AD₂₀₁₀"}], pts:[{Y:90, P:100, old:true},{Y:105, P:115, old:true},{Y:120, P:130, label:"2010"}], cap:"Over time: ongoing <b>growth</b> in output (LRAS moving right) and ongoing <b>inflation</b> (AD moving right faster)."}
  ];
  stepper(el, {title:'<span class="modeltag">📘 Textbook model, as in the lecture</span><br>Long-run growth and inflation', n:() => ST.length, draw:(i, st) => { const s = ST[i]; st.innerHTML = adas({lras:s.lr, ad:s.ad, pts:s.pts}); return s.cap; }});
}
function figSRASCalc(el){
  el.innerHTML = `<div class="figt"><span class="modeltag">📘 Textbook model, as in the lecture</span><br>Y = YN + a(P − PE)</div><p class="figsub">YN = 100 and a = 2. Choose the price level people expected, then the actual price level.</p>
    <label for="sc-e" style="display:flex;justify-content:space-between"><span>Expected price level PE</span><b class="sc-ev"></b></label><input type="range" id="sc-e" min="90" max="110" step="5" value="100">
    <label for="sc-p" style="display:flex;justify-content:space-between"><span>Actual price level P</span><b class="sc-pv"></b></label><input type="range" id="sc-p" min="85" max="120" step="5" value="110">
    <div class="sc-c"></div><div class="derive sc-f"></div><p class="cap sc-cap" aria-live="polite"></p>`;
  const e = el.querySelector("#sc-e"), p = el.querySelector("#sc-p");
  const up = () => { const PE = +e.value, P = +p.value, Y = 100 + 2*(P-PE);
    el.querySelector(".sc-ev").textContent = PE; el.querySelector(".sc-pv").textContent = P;
    el.querySelector(".sc-c").innerHTML = adas({lras:[{Y:100, label:"LRAS"}], sras:[{PE, label:"SRAS"}], pts:[{Y, P}]});
    el.querySelector(".sc-f").innerHTML = `Y = 100 + 2 × (${P} − ${PE}) = <b>${Y}</b>`;
    el.querySelector(".sc-cap").innerHTML = P > PE ? `Prices are <b>higher than expected</b>, so output is <b>above</b> its natural rate (${Y} > 100). Sticky wages, sticky prices or misperceptions make firms produce more.` :
      P < PE ? `Prices are <b>lower than expected</b>, so output is <b>below</b> its natural rate (${Y} < 100).` : `When P = PE, output equals its natural rate: the long run. That’s why LRAS is vertical.`; };
  e.oninput = up; p.oninput = up; up();
}
function figSlopeMatters(el){
  let mode = "sr";
  el.innerHTML = `<div class="figt">Why the slope of aggregate supply matters</div>
    <div class="seg" role="group" aria-label="Supply curve"><button type="button" aria-pressed="true" data-m="sr">Upward SRAS</button><button type="button" aria-pressed="false" data-m="lr">Vertical AS</button></div>
    <div class="sm-c"></div><p class="cap sm-cap"></p>`;
  const draw = () => {
    if (mode === "sr"){ const hi = sr(15,100), lo = sr(-15,100);
      el.querySelector(".sm-c").innerHTML = adas({ad:[{d:-15, label:"AD low"},{d:15, label:"AD high"}], sras:[{PE:100, label:"SRAS"}], pts:[{...lo, label:"low"},{...hi, label:"high"}]});
      el.querySelector(".sm-cap").innerHTML = `With an upward-sloping SRAS, swings in AD change <b>both</b> prices and output: output goes from ${lo.Y.toFixed(0)} to ${hi.Y.toFixed(0)}. That’s how demand causes recessions and booms.`;
    } else {
      el.querySelector(".sm-c").innerHTML = adas({ad:[{d:-15, label:"AD low"},{d:15, label:"AD high"}], lras:[{Y:100, label:"AS"}], pts:[{Y:100, P:85, label:"low"},{Y:100, P:115, label:"high"}]});
      el.querySelector(".sm-cap").innerHTML = "If AS were vertical, swings in AD would change <b>only prices</b>. Output and employment wouldn’t fluctuate at all.";
    } };
  el.querySelectorAll(".seg button").forEach(b => b.onclick = () => { mode = b.dataset.m; el.querySelectorAll(".seg button").forEach(x => x.setAttribute("aria-pressed", x === b)); draw(); });
  draw();
}
function figPE(el){
  el.innerHTML = `<div class="figt"><span class="modeltag">📘 Textbook model, as in the lecture</span><br>Expected prices shift SRAS</div><p class="figsub">Raise the expected price level and watch SRAS move.</p>
    <label for="pe-s" style="display:flex;justify-content:space-between"><span>Expected price level PE</span><b class="pe-v"></b></label><input type="range" id="pe-s" min="85" max="115" step="5" value="100">
    <div class="pe-c"></div><p class="cap pe-cap" aria-live="polite"></p>`;
  const s = el.querySelector("#pe-s");
  const up = () => { const PE = +s.value; el.querySelector(".pe-v").textContent = PE;
    el.querySelector(".pe-c").innerHTML = adas({lras:[{Y:100, label:"LRAS"}], ad:[{d:0, label:"AD"}], sras: PE === 100 ? [{PE:100, label:"SRAS"}] : [{PE:100, label:"", faded:true},{PE, label:"SRAS"}], pts: PE === 100 ? [{Y:100, P:100, label:"long-run eq’m"}] : [{Y:100, P:100, old:true}]});
    el.querySelector(".pe-cap").innerHTML = PE === 100 ? "<b>Long-run equilibrium:</b> AD, SRAS and LRAS meet. P = PE = 100, Y = YN = 100, and unemployment is at its natural rate." :
      PE > 100 ? "Higher expected prices lead workers and firms to set <b>higher wages</b>. At each P, production is less profitable, so <b>SRAS shifts left</b>." :
      "Lower expected prices mean lower wages are set, so production is more profitable at each P: <b>SRAS shifts right</b>."; };
  s.oninput = up; up();
}
function figADShock(el){
  let K = "crash";
  const SC = {crash:{d:-15, steps:["Start at long-run equilibrium A: Y = YN, P = PE = 100.",
                    "Steps 1–2: a stock market crash cuts consumption, so <b>AD shifts left</b>.",
                    "Step 3: short-run equilibrium <b>B</b>. Prices and output are lower, and unemployment is higher.",
                    "Step 4: over time, people expect lower prices, wages adjust, and <b>SRAS shifts right</b> until long-run equilibrium <b>C</b>. Output and unemployment are back at their natural levels, with a lower price level."]},
              canada:{d:15, steps:["Start at long-run equilibrium A.",
                    "Steps 1–2: a boom in Canada raises U.S. exports, so NX rises and <b>AD shifts right</b>.",
                    "Step 3: short-run equilibrium <b>B</b>. Prices and output are higher, and unemployment is lower.",
                    "Step 4: over time, expected prices rise, wages rise, and <b>SRAS shifts left</b> until long-run equilibrium <b>C</b>. Output and unemployment are back to normal, at a higher price level."]}};
  const top = `<div class="seg" role="group" aria-label="Event"><button type="button" aria-pressed="true" data-k="crash">Stock market crash</button><button type="button" aria-pressed="false" data-k="canada">Boom in Canada</button></div>`;
  const sp = stepper(el, {title:'<span class="modeltag">📘 Textbook model, as in the lecture</span><br>The effects of a shift in AD', top, n:() => 4, draw:(i, st) => {
    const d = SC[K].d, B = sr(d, 100), Cp = 100 + d, A = {Y:100, P:100};
    const o = {lras:[{Y:100, label:"LRAS"}]};
    if (i === 0){ o.ad = [{d:0, label:"AD₁"}]; o.sras = [{PE:100, label:"SRAS₁"}]; o.pts = [{...A, label:"A"}]; }
    else if (i === 1){ o.ad = [{d:0, label:"", faded:true},{d, label:"AD₂"}]; o.sras = [{PE:100, label:"SRAS₁"}]; o.pts = [{...A, label:"A", old:true}]; }
    else if (i === 2){ o.ad = [{d:0, label:"", faded:true},{d, label:"AD₂"}]; o.sras = [{PE:100, label:"SRAS₁"}]; o.pts = [{...A, label:"A", old:true},{...B, label:"B"}]; }
    else { o.ad = [{d:0, label:"", faded:true},{d, label:"AD₂"}]; o.sras = [{PE:100, label:"", faded:true},{PE:Cp, label:"SRAS₂"}]; o.pts = [{...A, label:"A", old:true},{...B, label:"B", old:true},{Y:100, P:Cp, label:"C"}]; }
    st.innerHTML = adas(o);
    return SC[K].steps[i];
  }});
  el.querySelectorAll(".seg button").forEach(b => b.onclick = () => { K = b.dataset.k; el.querySelectorAll(".seg button").forEach(x => x.setAttribute("aria-pressed", x === b)); sp.reset(); });
}
function figBigShifts(el){
  let k = "dep";
  const D = {dep:{t:"The Great Depression, 1929–1933", why:"Money supply fell 28% (banking problems) and stock prices fell 90%, cutting C and I: a huge <b>leftward</b> AD shift.", rows:[["Real GDP","fell 27%","down"],["Price level","fell 22%","down"],["Unemployment","3% → 25%","up"]]},
             ww2:{t:"The World War II boom, 1939–1944", why:"Government outlays rose from $9.1 billion to $91.3 billion: a huge <b>rightward</b> AD shift.", rows:[["Real GDP","rose 90%","up"],["Price level","rose 20%","up"],["Unemployment","17% → 1%","down"]]}};
  el.innerHTML = `<div class="figt">Two big AD shifts in history</div><div class="seg" role="group" aria-label="Episode"><button type="button" aria-pressed="true" data-k="dep">Great Depression</button><button type="button" aria-pressed="false" data-k="ww2">World War II</button></div><div class="bs-b"></div>`;
  const draw = () => { const s = D[k]; el.querySelector(".bs-b").innerHTML = `<b style="font-family:var(--serif)">${s.t}</b><p class="small" style="margin:6px 0 10px">${s.why}</p><div class="stack">${s.rows.map(r => kv(r[0], `<span class="pill ${r[2]}">${r[1]}</span>`)).join("")}</div><p class="cap">Prices and output moved in the <b>same direction</b>: the fingerprint of an AD shift.</p>`; };
  el.querySelectorAll(".seg button").forEach(b => b.onclick = () => { k = b.dataset.k; el.querySelectorAll(".seg button").forEach(x => x.setAttribute("aria-pressed", x === b)); draw(); });
  draw();
}
function figHousing(el){
  const d = H10.cs;
  el.innerHTML = `<div class="figt">U.S. house prices, 2000–2011</div><p class="figsub">Case-Shiller Home Price Index (2000 = 100), from the lecture’s slide.</p><div class="hs-c"></div>
    <label for="hs-y" style="display:flex;justify-content:space-between"><span>Date</span><b class="hs-yv"></b></label><input type="range" id="hs-y" min="0" max="${d.y.length-1}" step="1" value="78">
    <div class="stack hs-v"></div><p class="cap hs-cap"></p>`;
  const sl = el.querySelector("#hs-y");
  const draw = () => { const i = +sl.value, t = d.x0 + i*d.dx, v = d.y[i], yr = Math.floor(t + 1e-6), mo = Math.round((t - yr)*12);
    el.querySelector(".hs-c").innerHTML = lineChart({x0:2000, x1:2011.2, dx:d.dx, y:d.y, y0:80, y1:220, ticks:[80,120,160,200], fmt:v => v, xticks:[2000,2002,2004,2006,2008,2010], recess:true, at:t, aty:v, aria:"Case-Shiller home price index 2000 to 2011"});
    el.querySelector(".hs-yv").textContent = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][mo] + " " + yr;
    el.querySelector(".hs-v").innerHTML = kv("Home price index", v.toFixed(1)) + kv("Change since Jan 2000", (v >= 100.6 ? "+" : "") + (v/100.6*100 - 100).toFixed(0) + "%");
    el.querySelector(".hs-cap").innerHTML = t < 2006.4 ? "2002–2006: prices soared on low interest rates, easy credit for sub-prime borrowers, homeownership policies and mortgage securitization. Wealthier households spent more: <b>AD shifted right</b>." :
      "2006–2009: the crash left millions of homeowners “underwater,” triggered foreclosures and losses on mortgage-backed securities, and hit construction hard: <b>AD shifted left</b>."; };
  sl.oninput = draw; draw();
}
function figOil(el){
  let K = "wait";
  const top = `<div class="seg" role="group" aria-label="Policy"><button type="button" aria-pressed="true" data-k="wait">Policymakers wait</button><button type="button" aria-pressed="false" data-k="acc">Accommodate</button></div>`;
  const B = sr(0, 115);
  const sp = stepper(el, {title:'<span class="modeltag">📘 Textbook model, as in the lecture</span><br>An oil price shock', top, n:() => 4, draw:(i, st) => {
    const o = {lras:[{Y:100, label:"LRAS"}]}, A = {Y:100, P:100};
    if (i === 0){ o.ad = [{d:0, label:"AD₁"}]; o.sras = [{PE:100, label:"SRAS₁"}]; o.pts = [{...A, label:"A"}]; st.innerHTML = adas(o); return "Start at long-run equilibrium A."; }
    if (i === 1){ o.ad = [{d:0, label:"AD₁"}]; o.sras = [{PE:100, label:"", faded:true},{PE:115, label:"SRAS₂"}]; o.pts = [{...A, label:"A", old:true}]; st.innerHTML = adas(o); return "Steps 1–2: higher oil prices raise production costs, so <b>SRAS shifts left</b> (assume LRAS doesn’t move)."; }
    if (i === 2){ o.ad = [{d:0, label:"AD₁"}]; o.sras = [{PE:100, label:"", faded:true},{PE:115, label:"SRAS₂"}]; o.pts = [{...A, label:"A", old:true},{...B, label:"B"}]; st.innerHTML = adas(o); return "Step 3: short-run equilibrium <b>B</b>: prices <b>higher</b>, output <b>lower</b>, unemployment higher. Falling output with rising prices is <b>stagflation</b>."; }
    if (K === "wait"){ o.ad = [{d:0, label:"AD₁"}]; o.sras = [{PE:115, label:"", faded:true},{PE:100, label:"SRAS₁"}]; o.pts = [{...B, label:"B", old:true},{...A, label:"A"}]; st.innerHTML = adas(o); return "Step 4 (do nothing): low employment pushes wages down, SRAS shifts back right, and the economy returns to <b>A</b>. Slow and painful, but prices end where they started."; }
    o.ad = [{d:0, label:"", faded:true},{d:15, label:"AD₂"}]; o.sras = [{PE:115, label:"SRAS₂"}]; o.pts = [{...B, label:"B", old:true},{Y:100, P:115, label:"C"}]; st.innerHTML = adas(o);
    return "Step 4 (accommodate): fiscal or monetary policy shifts <b>AD right</b> to C. Output is back at YN quickly, but the price level is <b>permanently higher</b>.";
  }});
  el.querySelectorAll(".seg button").forEach(b => b.onclick = () => { K = b.dataset.k; el.querySelectorAll(".seg button").forEach(x => x.setAttribute("aria-pressed", x === b)); sp.reset(); });
}
function figOilTable(el){
  const R = [["Real oil prices","+138%","+99%"],["CPI","+21%","+26%"],["Real GDP","−0.7%","+2.9%"],["Number unemployed","+3.5 million","+1.4 million"]];
  el.innerHTML = `<div class="figt">The 1970s oil shocks</div><p class="figsub">From the lecture.</p>
    <div class="stack">${R.map(r => `<div class="info" style="display:grid;grid-template-columns:1fr auto auto;gap:12px;align-items:center;padding:8px 12px"><span style="color:var(--ink)">${r[0]}</span><b style="margin:0;text-align:right">${r[1]}</b><b style="margin:0;text-align:right">${r[2]}</b></div>`).join("")}</div>
    <div style="display:grid;grid-template-columns:1fr auto auto;gap:12px;font-size:13px;color:var(--muted);padding:0 12px"><span></span><span>1973–75</span><span>1978–80</span></div>
    <p class="cap">Both times, prices jumped and unemployment rose together: stagflation, the fingerprint of an SRAS shift.</p>`;
}
function figPredictAS(el){
  const EV = [
    ["Consumers become pessimistic and cut spending.","AD","L","↓","↓"],
    ["Firms become optimistic and invest more (“animal spirits”).","AD","R","↑","↑"],
    ["A drought sharply raises food production costs.","SRAS","L","↑","↓"],
    ["Workers and firms expect much lower prices next year.","SRAS","R","↓","↑"],
    ["The government cuts taxes for households.","AD","R","↑","↑"],
    ["A recession in Europe cuts demand for U.S. exports.","AD","L","↓","↓"]
  ];
  let k = 0;
  el.innerHTML = `<div class="figt">Practice the four steps</div><p class="figsub">For each event: which curve, which way, and what happens to P and Y in the short run?</p><div class="pp-b"></div>`;
  const body = el.querySelector(".pp-b");
  const row = (key, label, opts) => `<div style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin:6px 0;flex-wrap:wrap"><span>${label}</span><span class="rchips" style="margin:0" data-v="${key}">${opts.map(o => `<button type="button" class="chipbtn" aria-pressed="false" data-a="${o[0]}">${o[1]}</button>`).join("")}</span></div>`;
  const draw = () => {
    const e = EV[k], pick = {};
    body.innerHTML = `<div class="scen pop">${e[0]}</div>` + row("c","1. Which curve?",[["AD","AD"],["SRAS","SRAS"]]) + row("d","2. Which way?",[["L","Left"],["R","Right"]]) + row("p","3. Price level",[["↑","↑"],["↓","↓"]]) + row("y","3. Output",[["↑","↑"],["↓","↓"]]) +
      `<button type="button" class="btn pp-chk" style="margin-top:8px">Check</button><div class="pp-r"></div>`;
    body.querySelectorAll(".rchips").forEach(g => g.querySelectorAll("button").forEach(b => b.onclick = () => { g.querySelectorAll("button").forEach(x => x.setAttribute("aria-pressed", x === b)); pick[g.dataset.v] = b.dataset.a; }));
    body.querySelector(".pp-chk").onclick = () => {
      const ans = {c:e[1], d:e[2], p:e[3], y:e[4]}, names = {c:"Curve", d:"Direction", p:"Price level", y:"Output"};
      const n = Object.keys(ans).filter(x => pick[x] === ans[x]).length;
      body.querySelector(".pp-r").innerHTML = `<div class="stack">${Object.keys(ans).map(x => kv(names[x], `${pick[x] || "?"} <span style="color:${pick[x] === ans[x] ? "var(--right)" : "var(--wrong)"}">${pick[x] === ans[x] ? "✓" : "✕ answer " + (x === "d" ? (ans[x] === "L" ? "Left" : "Right") : ans[x])}</span>`)).join("")}</div>
        <p class="cap"><b>${n} of 4.</b> ${e[1] === "AD" ? "AD shifts move P and Y in the <b>same</b> direction." : "SRAS shifts move P and Y in <b>opposite</b> directions."} Step 4: in the long run, expectations adjust and output returns to YN.</p>`;
      const nb = h("button","btn ghost", k < EV.length-1 ? "Next event" : "Start over"); nb.type = "button"; nb.style.marginTop = "10px"; nb.onclick = () => { k = (k+1) % EV.length; draw(); }; body.querySelector(".pp-r").appendChild(nb);
    };
  };
  draw();
}


/* Lecture 10 upgrade: synchronized historical-series explorer. All plotted points
   are taken from the original Lecture 10 series already in H10. */
function figCycleCompare(el){
  let mode='gdp';
  const series={gdp:{label:'Real GDP',data:H10.gdp,unit:'billions of 2005 dollars'},inv:{label:'Real investment',data:H10.inv,unit:'billions of 2005 dollars'},u:{label:'Unemployment',data:H10.u,unit:'percent of labor force'}};
  el.innerHTML=`<div class="figt">Explore the business cycle across three indicators</div>
    <p class="figsub">Lecture slides 3–5 · The same recession periods on all three historical series. Change the window and inspect the corresponding values. Values come from the original slide datasets, not estimates from chart images.</p>
    <div class="seg" role="group" aria-label="Historical indicator" style="grid-template-columns:repeat(3,1fr)">
    <button type="button" data-k="gdp" aria-pressed="true" style="font-size:14px;padding:8px 4px">GDP</button><button type="button" data-k="inv" aria-pressed="false" style="font-size:14px;padding:8px 4px">Investment</button><button type="button" data-k="u" aria-pressed="false" style="font-size:14px;padding:8px 4px">Jobless rate</button></div>
    <div class="cy-graph"></div>
    <label for="cy-from">Starting year <b class="cy-from-val"></b></label><input id="cy-from" type="range" min="1965" max="2005" step="1" value="2000"/>
    <label for="cy-to">Ending year <b class="cy-to-val"></b></label><input id="cy-to" type="range" min="1970" max="2011" step="1" value="2011"/>
    <div class="cy-summary stack"></div><button type="button" class="btn ghost cy-export">Download all three historical series (CSV)</button>
    <p class="cap">Historical and educational illustration, not a forecast. The shaded recession windows are provided by the lecture lab; recent recessions after 2011 are not included.</p>`;
  const a=el.querySelector('#cy-from'),b=el.querySelector('#cy-to');
  function draw(){
    let start=+a.value,end=+b.value;if(end<=start+1){end=Math.min(2011,start+2);b.value=end;}
    el.querySelector('.cy-from-val').textContent=start;
    el.querySelector('.cy-to-val').textContent=end;
    const d=series[mode].data, first=Math.max(0,Math.round((start-d.x0)/d.dx)),last=Math.min(d.y.length-1,Math.round((end-d.x0)/d.dx));
    const values=d.y.slice(first,last+1),low=Math.min(...values),high=Math.max(...values),pad=Math.max((high-low)*.12,.1);
    const span=high-low+2*pad, raw=span/4, mag=Math.pow(10,Math.floor(Math.log10(raw))), step=[1,2,2.5,5,10].map(m=>m*mag).find(v=>v>=raw), t0=Math.ceil((low-pad)/step)*step, tickvals=[];for(let v=t0;v<=high+pad+1e-9;v+=step)tickvals.push(Math.round(v*100)/100);
    const ys=Math.max(1,Math.ceil((end-start)/4)), years=[];for(let y=start;y<=end-ys*0.6;y+=ys)years.push(y);
    // lineChart's x0 is the start of its dataset, so pass a sliced series.
    el.querySelector('.cy-graph').innerHTML=lineChart({x0:d.x0+first*d.dx,x1:d.x0+last*d.dx,dx:d.dx,y:values,y0:low-pad,y1:high+pad,ticks:tickvals,fmt:v=>mode==='u'?(+v.toFixed(1))+'%':(v>=1000?'$'+(+(v/1000).toFixed(1))+'T':'$'+Math.round(v)),xticks:years,recess:true,aria:series[mode].label+' during '+start+' to '+end});
    const startVal=values[0],lastVal=values[values.length-1],delta=lastVal-startVal;
    el.querySelector('.cy-summary').innerHTML=kv('Indicator',series[mode].label)+kv('Start',startVal.toLocaleString('en-US',{maximumFractionDigits:1})+' '+series[mode].unit)+kv('End',lastVal.toLocaleString('en-US',{maximumFractionDigits:1})+' '+series[mode].unit)+kv('Net change',(delta>=0?'+':'')+delta.toLocaleString('en-US',{maximumFractionDigits:1}));
  }
  el.querySelectorAll('[data-k]').forEach(btn=>btn.onclick=()=>{mode=btn.dataset.k;el.querySelectorAll('[data-k]').forEach(x=>x.setAttribute('aria-pressed',String(x===btn)));draw();});
  a.addEventListener('input',draw);b.addEventListener('input',draw);
  el.querySelector('.cy-export').onclick=()=>{
    const rows=['Year,Quarter,Real GDP (billions 2005 USD),Real Investment (billions 2005 USD),Unemployment rate (%)'];
    for(let i=0;i<H10.gdp.y.length;i++){let year=1965+Math.floor(i/4),quarter=i%4+1;rows.push([year,quarter,H10.gdp.y[i],H10.inv.y[i],H10.u.y[i]].join(','));}
    const blob=new Blob([rows.join('\r\n')+'\r\n'],{type:'text/csv;charset=utf-8'}),url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download='lecture10_historical_series_1965_2011.csv';document.body.appendChild(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
  };
  draw();
}
function figADASDiagnostic(el){
  let d=0,pe=100,yn=100;
  el.innerHTML=`<div class="figt">Interactive AD–AS Shock Laboratory</div>
    <p class="figsub">Drag the shifts to move the curves. See how the equilibrium price level and output respond together. This is a teaching model with index values, not observed economic data.</p>
    <p class="small muted" style="margin:8px 0 4px">Try an example, or drag the sliders:</p><div class="seg" style="grid-template-columns:repeat(3,1fr)" role="group" aria-label="Apply an example shock"><button type="button" data-preset="demand">Demand ↓</button><button type="button" data-preset="oil">Oil shock</button><button type="button" data-preset="growth">Growth ↑</button></div>
    <label for="adx">Aggregate demand shift: <b class="adxv">0</b></label><input id="adx" type="range" min="-25" max="25" value="0" step="1">
    <label for="asx">Short-run supply cost / expected-price shift: <b class="asxv">0</b></label><input id="asx" type="range" min="-20" max="20" value="0" step="1">
    <label for="lrx">Potential output (LRAS): <b class="lrxv">100</b></label><input id="lrx" type="range" min="85" max="115" value="100" step="1">
    <div class="sc-chart"></div><div class="sc-readout stack"></div><p class="cap sc-text"></p>
    <button class="btn ghost sc-reset" type="button">Reset all curves</button>`;
  const sliders=[el.querySelector('#adx'),el.querySelector('#asx'),el.querySelector('#lrx')];
  function render(){
    d=+sliders[0].value;pe=100+(+sliders[1].value);yn=+sliders[2].value;
    const eq=sr(d,pe,yn),baseline=sr(0,100,100);
    const deltaY=eq.Y-baseline.Y,deltaP=eq.P-baseline.P;
    el.querySelector('.adxv').textContent=(d>0?'+':'')+d;
    el.querySelector('.asxv').textContent=(pe-100>0?'+':'')+(pe-100);
    el.querySelector('.lrxv').textContent=yn;
    el.querySelector('.sc-chart').innerHTML=adas({ad:[{d:0,label:'AD₀',faded:d!==0},{d,label:'AD₁'}],sras:[{PE:100,YN:100,label:'SRAS₀',faded:pe!==100||yn!==100},{PE:pe,YN:yn,label:'SRAS₁'}],lras:[{Y:100,label:'LRAS₀',faded:yn!==100},{Y:yn,label:'LRAS₁'}],pts:[{...baseline,label:'A',old:true},{...eq,label:'B'}]});
    el.querySelector('.sc-readout').innerHTML=kv('New short-run output index',eq.Y.toFixed(1))+kv('New short-run price index',eq.P.toFixed(1))+kv('Output vs. initial',(deltaY>=0?'+':'')+deltaY.toFixed(1))+kv('Prices vs. initial',(deltaP>=0?'+':'')+deltaP.toFixed(1));
    let explanation=d===0&&pe===100&&yn===100?'Baseline: the three curves intersect at the long-run equilibrium, with price level 100 and output 100.':`Compared with the baseline, output ${deltaY>0.05?'rises':deltaY<-.05?'falls':'stays approximately unchanged'} and the price level ${deltaP>.05?'rises':deltaP<-.05?'falls':'stays approximately unchanged'}.`;
    explanation+=' AD changes aggregate spending; SRAS cost/expectations shifts change short-run production incentives; LRAS marks potential output. Changes in potential output also shift the modeled short-run supply relation.';
    el.querySelector('.sc-text').textContent=explanation;
  }
  sliders.forEach(x=>x.addEventListener('input',render));
  el.querySelectorAll('[data-preset]').forEach(b=>b.addEventListener('click',()=>{
    const val={demand:[-18,0,100],oil:[0,18,100],growth:[0,0,112]}[b.dataset.preset];sliders.forEach((el,i)=>el.value=val[i]);render();
  }));
  el.querySelector('.sc-reset').onclick=()=>{sliders.forEach((x,i)=>x.value=[0,0,100][i]);render();};
  render();
}

/* ---------- lessons ---------- */
const STEPS = [
 { title:"Short-run economic fluctuations", html:`
   <p>Over the long run, U.S. real GDP grows about 3% a year. In the short run, it fluctuates around that trend.</p>
   <div class="stack">
     <div class="info"><b>${g("Recession","Recessions")}</b><span>Periods of falling real incomes and rising unemployment.</span></div>
     <div class="info"><b>${g("Depression","Depressions")}</b><span>Severe recessions. Very rare.</span></div>
   </div>
   <p>Short-run fluctuations are often called ${g("Business cycle","business cycles")}.</p>
   <div class="fig" data-fig="fluct"></div>
   <div class="fig" data-fig="cyclecompare"></div>
   ${tn("Long-run growth of about 3% a year; data run to 2011.","U.S. growth has averaged closer to 2% a year in recent decades. Since 2011 there was one more recession: a short, very deep one in 2020, when unemployment briefly passed 14%.")}`,
   check:[
    {id:"c1a", q:"Which is NOT one of the three facts about economic fluctuations?", a:2,
     o:[["Fluctuations are irregular and unpredictable","That’s Fact 1. Look for the one that isn’t on the list."],["Most macro quantities fluctuate together","That’s Fact 2."],["Recessions happen every five years like clockwork","Correct: this is false. Fact 1 says fluctuations are irregular."],["When output falls, unemployment rises","That’s Fact 3."]],
     hint:"Look at the shaded bars on the chart. Are they evenly spaced?", more:"That’s why forecasting recessions is so hard."},
    {id:"c1b", q:"During recessions, investment spending typically…", a:0,
     o:[["Falls, often sharply","Correct. Investment swings much more than GDP."],["Rises","Switch the chart to Investment and look at the shaded bars."],["Stays constant","Investment is one of the most volatile parts of GDP."]],
     hint:"Use the Investment tab and slide to 2009.", more:"Fact 2: most macro quantities fluctuate together."}
   ]},
 { title:"A new model for the short run", html:`
   <p>The previous lectures used <b>classical economics</b>: the classical dichotomy (real vs nominal variables) and monetary neutrality.</p>
   <p>Most economists think classical theory describes the <b>long run</b>, but not the short run. In the short run, nominal changes (like the money supply or P) <b>can</b> affect real variables (like Y and unemployment).</p>
   <p>So for the short run, we use the model of <b>aggregate demand and aggregate supply</b>. It determines the equilibrium price level P and real GDP Y.</p>
   <div class="fig" data-fig="intro"></div>`,
   check:[
    {id:"c2a", q:"According to most economists, classical theory (monetary neutrality) describes…", a:1,
     o:[["The short run but not the long run","It’s the other way around."],["The long run but not the short run","Correct."],["Neither","Most economists accept it for the long run."]],
     hint:"Can money affect output temporarily?", more:"That’s why we need a separate short-run model."},
    {id:"c2b", q:"In the AD–AS diagram, the vertical axis shows…", a:0,
     o:[["The price level","Correct."],["Real GDP","That’s the horizontal axis."],["The interest rate","That’s a different diagram."]],
     hint:"Look at the axes in the diagram.", more:"The horizontal axis is real GDP, Y."}
   ]},
 { title:"Why AD slopes downward", html:`
   <p>The ${g("Aggregate-demand curve","AD curve")} shows how much output is demanded at each price level. With Y = C + I + G + NX and G fixed by policy, we ask how P affects C, I and NX.</p>
   <div class="fig" data-fig="adslope"></div>
   <div class="stack">
     <div class="info"><b>${g("Wealth effect","Wealth effect")}</b><span>P ↑ → C ↓</span></div>
     <div class="info"><b>${g("Interest-rate effect","Interest-rate effect")}</b><span>P ↑ → I ↓</span></div>
     <div class="info"><b>${g("Exchange-rate effect","Exchange-rate effect")}</b><span>P ↑ → NX ↓</span></div>
   </div>`,
   check:[
    {id:"c3a", q:"The price level rises. Through the wealth effect, consumption…", a:1,
     o:[["Rises","Higher prices make the dollars you hold worth less. Do you feel richer?"],["Falls","Correct. Real wealth is lower, so people spend less."],["Doesn’t change","The wealth effect is exactly about consumption changing."]],
     hint:"Tap the wealth effect button.", more:"That’s one reason AD slopes down."},
    {id:"c3b", q:"Which effect works through investment?", a:2,
     o:[["The wealth effect","That one works through consumption."],["The exchange-rate effect","That one works through net exports."],["The interest-rate effect","Correct. Higher P → higher interest rates → lower I."]],
     hint:"Which effect changes interest rates first?", more:"The exchange-rate effect builds on the interest-rate effect."}
   ]},
 { title:"What shifts AD", html:`
   <p>${g("Shifts in AD","Anything that changes C, I, G or NX, except a change in P, shifts AD.")} A change in P just moves the economy <b>along</b> the curve.</p>
   <div class="stack">
     <div class="info"><b>C</b><span>Stock market boom or crash, saving preferences, tax cuts or hikes.</span></div>
     <div class="info"><b>I</b><span>New equipment, optimism or pessimism (“animal spirits”), interest rates and monetary policy, investment tax credits.</span></div>
     <div class="info"><b>G</b><span>Federal, state and local spending.</span></div>
     <div class="info"><b>NX</b><span>Booms or recessions abroad, exchange-rate swings.</span></div>
   </div>
   <div class="fig" data-fig="adsort"></div>`,
   check:[
    {id:"c4a", q:"A ten-year-old investment tax credit expires. The AD curve…", a:1,
     o:[["Shifts right","Losing a tax credit makes investment less attractive."],["Shifts left","Correct. I falls at every price level."],["Doesn’t move; the economy moves down AD","Only a change in P moves along AD."],["Doesn’t move; the economy moves up AD","Only a change in P moves along AD."]],
     hint:"Which component changes, and is it caused by P?", more:"This was clicker question 1 in the lecture."},
    {id:"c4b", q:"A fall in prices raises the real value of consumers’ wealth. The AD curve…", a:2,
     o:[["Shifts right","The cause here is the price level itself."],["Shifts left","Lower prices make people feel richer, not poorer."],["Doesn’t shift; the economy moves down along AD","Correct. That’s the wealth effect."]],
     hint:"Is this change caused by P?", more:"Clicker question 3."}
   ]},
 { title:"Long-run aggregate supply", html:`
   <p>The ${g("Long-run aggregate-supply curve","LRAS curve")} is <b>vertical</b> at the ${g("Natural rate of output","natural rate of output")} YN (potential, or full-employment, output).</p>
   <p>YN depends on labor, capital, natural resources and technology. A change in P doesn’t affect any of these, so it doesn’t affect YN: the classical dichotomy.</p>
   <div class="fig" data-fig="lrassort"></div>
   <div class="fig" data-fig="growth"></div>`,
   check:[
    {id:"c5a", q:"Why is the LRAS curve vertical?", a:0,
     o:[["The price level doesn’t affect labor, capital, natural resources or technology","Correct."],["Because the Fed fixes output","The Fed doesn’t set output."],["Because prices never change in the long run","Prices can change a lot; output just doesn’t respond in the long run."]],
     hint:"What determines YN?", more:"That’s the classical dichotomy at work."},
    {id:"c5b", q:"Over the long run, technology shifts LRAS right and money growth shifts AD right. The result is…", a:2,
     o:[["Growth with falling prices","AD shifts right faster than LRAS."],["Inflation with no growth","LRAS is moving right too."],["Ongoing growth in output and ongoing inflation","Correct."]],
     hint:"Step through the 1990–2010 diagram.", more:"That’s the long-run picture behind the short-run fluctuations."}
   ]},
 { title:"Short-run aggregate supply", html:`
   <p>Over 1–2 years, the ${g("Short-run aggregate-supply curve","SRAS curve")} slopes <b>upward</b>: a higher price level raises the quantity supplied. This positive slope is the key to short-run fluctuations.</p>
   <div class="fig" data-fig="slope"></div>
   <h3>Three theories of the upward slope</h3>
   <div class="stack">
     <div class="info"><b>1. ${g("Sticky-wage theory","Sticky wages")}</b><span>Wages are set in advance using PE. If P > PE, revenue rises but labor costs don’t, so firms produce more.</span></div>
     <div class="info"><b>2. ${g("Sticky-price theory","Sticky prices")}</b><span>Menu costs keep some prices fixed. When money rises unexpectedly, firms with sticky prices are relatively cheap, so they sell and produce more.</span></div>
     <div class="info"><b>3. ${g("Misperceptions theory","Misperceptions")}</b><span>A firm sees its own price rise and thinks its relative price rose, so it produces more.</span></div>
   </div>
   <p>All three say output departs from YN when P differs from the price level people expected:</p>
   <div class="fig" data-fig="srascalc"></div>`,
   check:[
    {id:"c6a", q:"In all three theories, output rises above its natural rate when…", a:1,
     o:[["The price level equals the expected price level","Then Y = YN."],["The price level is higher than expected","Correct. Y = YN + a(P − PE) with P > PE."],["The price level is lower than expected","That pushes output below YN."]],
     hint:"Try P > PE in the calculator.", more:"These imperfections are temporary, so in the long run P = PE."},
    {id:"c6b", q:"Under the sticky-wage theory, why do firms produce more when P > PE?", a:2,
     o:[["Because workers demand higher wages","Wages are stuck at the level set in advance."],["Because menu costs fall","That’s the sticky-price theory’s mechanism."],["Revenue rises but wages are fixed, so production is more profitable","Correct."]],
     hint:"What was set in advance based on PE?", more:"The sticky-price and misperceptions theories reach the same result in different ways."}
   ]},
 { title:"SRAS shifts and long-run equilibrium", html:`
   <p>Over time, sticky wages and prices adjust and misperceptions are corrected. In the long run, P = PE and AS is vertical.</p>
   <p>Everything that shifts LRAS also shifts SRAS. In addition, the ${g("Expected price level","expected price level")} shifts SRAS:</p>
   <div class="fig" data-fig="pe"></div>
   <p>In ${g("Long-run equilibrium","long-run equilibrium")}: P = PE, Y = YN, and unemployment is at its natural rate.</p>`,
   check:[
    {id:"c7a", q:"The expected price level rises. The SRAS curve…", a:0,
     o:[["Shifts left","Correct. Higher wages are set, so production is less profitable at each P."],["Shifts right","Higher expected prices raise costs set in advance."],["Doesn’t move","PE is a key SRAS shifter."]],
     hint:"Move the PE slider up.", more:"That’s how the economy returns to long-run equilibrium after a shock."},
    {id:"c7b", q:"In long-run equilibrium…", a:2,
     o:[["P is above PE","Then output would be above YN."],["Unemployment is zero","It’s at its natural rate, which isn’t zero."],["P = PE and Y = YN","Correct."]],
     hint:"Where do all three curves meet?", more:"Unemployment is at its natural rate there."}
   ]},
 { title:"A shift in aggregate demand", html:`
   <div class="stack">
     <div class="info"><b>${g("Four steps","The four steps")}</b><span>1. Does the event shift AD or AS? 2. Left or right? 3. Short-run effect on P and Y. 4. How the economy moves to the new long run.</span></div>
   </div>
   <div class="fig" data-fig="adshock"></div>
   <div class="fig" data-fig="shockcompare"></div>
   <div class="fig" data-fig="bigshifts"></div>
   <h3>Case study: the 2008–2009 recession</h3>
   <p>From December 2007 to June 2009, real GDP fell about 4%. Unemployment rose from 4.4% (May 2007) to 10.1% (October 2009). Housing was at the center.</p>
   <div class="fig" data-fig="housing"></div>
   <p>The policy response: the Fed cut its federal funds rate target to near zero and bought mortgage-backed securities; the Treasury injected capital into banks; and fiscal policy added about $800 billion in spending increases and tax cuts. All aimed to shift AD back to the right.</p>`,
   check:[
    {id:"c8a", q:"A stock market crash. In the short run, P and Y…", a:1,
     o:[["Both rise","A crash cuts consumption. Which way does AD shift?"],["Both fall","Correct. AD shifts left, so the economy moves to B."],["P rises, Y falls","That’s the pattern of an SRAS shift."]],
     hint:"Step through the crash diagram to point B.", more:"In the long run, SRAS shifts right and output returns to YN."},
    {id:"c8b", q:"The Fed’s rate cuts and loan purchases in 2008–2009 were mainly meant to…", a:1,
     o:[["Maintain or increase NX","Lower rates affect NX somewhat, but that wasn’t the main aim."],["Maintain or increase I, shifting AD right","Correct."],["Shift SRAS out","These policies work on demand."]],
     hint:"Lower interest rates and easier credit affect which spending most?", more:"The $800 billion fiscal package aimed at G and C."}
   ]},
 { title:"A shift in aggregate supply", html:`
   <div class="fig" data-fig="oil"></div>
   <p>${g("Stagflation")}: falling output and rising prices. Policymakers face a tradeoff: wait for wages to fall, or ${g("Accommodating a supply shock","accommodate")} by raising AD and accept permanently higher prices.</p>
   <div class="fig" data-fig="oiltable"></div>
   <p><b>John Maynard Keynes</b> (<i>The General Theory</i>, 1936) argued that recessions can come from inadequate demand, and that policymakers should shift AD rather than wait. His famous line: “In the long run, we are all dead.”</p>
   <div class="fig" data-fig="predict"></div>`,
   check:[
    {id:"c9a", q:"An oil price shock causes, in the short run…", a:2,
     o:[["Higher output and higher prices","That’s an AD shift to the right."],["Lower output and lower prices","That’s an AD shift to the left."],["Lower output and higher prices (stagflation)","Correct. SRAS shifts left."]],
     hint:"SRAS shifts move P and Y in opposite directions.", more:"Like the 1970s oil shocks."},
    {id:"c9b", q:"If policymakers accommodate an adverse supply shock, then…", a:0,
     o:[["Output returns to YN faster, but prices stay permanently higher","Correct."],["Output and prices both return to where they started","That happens if they wait."],["Prices fall back down","Raising AD pushes prices up further."]],
     hint:"Try the ‘Accommodate’ tab at step 4.", more:"The tradeoff: faster recovery vs higher prices."}
   ]}
];
function figIntro(el){
  el.innerHTML = `<div class="figt">The model of aggregate demand and aggregate supply</div>` + adas({ad:[{d:0, label:"AD"}], sras:[{PE:100, label:"SRAS"}], pts:[{Y:100, P:100, label:"equilibrium"}]}) +
    `<p class="cap">Where AD (aggregate demand) crosses SRAS (short-run aggregate supply), we get the equilibrium price level and real GDP.</p>`;
}
const FIGS = { cyclecompare:figCycleCompare, shockcompare:figADASDiagnostic, fluct:figFluct, intro:figIntro, adslope:figADSlope, adsort:figADSort, lrassort:figLRASSort, growth:figGrowth, slope:figSlopeMatters, srascalc:figSRASCalc, pe:figPE, adshock:figADShock, bigshifts:figBigShifts, housing:figHousing, oil:figOil, oiltable:figOilTable, predict:figPredictAS };

/* ---------- self-check ---------- */
const QUIZ = [
 {id:"q1", L:0, q:"A recession is a period of…", a:1, hint:"Think of the shaded bars.", o:[["Rising real incomes and falling unemployment","That’s an expansion."],["Falling real incomes and rising unemployment","Right."],["Falling prices only","Prices may or may not fall."],["Rising interest rates","Not the definition."]], more:"A depression is a severe recession."},
 {id:"q2", L:0, q:"Which macroeconomic quantity swings the most during recessions?", a:2, hint:"Compare the Investment and GDP charts.", o:[["Government spending","G is set by policy and often rises."],["Population","Not a short-run fluctuation."],["Investment","Right."],["The natural rate of output","That’s a long-run concept."]], more:"Fact 2: most quantities move together."},
 {id:"q3", L:1, q:"Monetary neutrality is believed to hold…", a:0, hint:"Classical theory and time horizon.", o:[["In the long run","Right."],["In the short run only","Short-run money changes can affect output."],["Never","Most economists accept it for the long run."],["Only during recessions","It’s about time horizon, not the cycle."]], more:"That’s why the short run needs AD–AS."},
 {id:"q4", L:1, q:"The AD–AS model determines…", a:3, hint:"Look at the axes.", o:[["The interest rate and money supply","That’s the money market."],["Saving and investment","That’s loanable funds."],["The exchange rate","That’s the FX market."],["The price level and real GDP","Right."]], more:"P on the vertical axis, Y on the horizontal."},
 {id:"q5", L:2, q:"Which is NOT a reason AD slopes downward?", a:2, hint:"Three effects: wealth, interest rate, exchange rate.", o:[["The wealth effect","That’s one of the three."],["The interest-rate effect","That’s one of the three."],["The menu-cost effect","Right, this isn’t one. Menu costs explain SRAS."],["The exchange-rate effect","That’s one of the three."]], more:"Menu costs are part of the sticky-price theory of SRAS."},
 {id:"q6", L:2, q:"Through the exchange-rate effect, a higher price level…", a:0, hint:"P ↑ → r ↑ → ?", o:[["Appreciates the dollar and lowers NX","Right."],["Depreciates the dollar and raises NX","Higher interest rates attract foreign money."],["Has no effect on NX","It lowers NX."],["Raises G","G is fixed by policy."]], more:"It builds on the interest-rate effect."},
 {id:"q7", L:3, q:"The U.S. exchange rate falls. The AD curve…", a:0, hint:"What happens to NX?", o:[["Shifts right","Right. NX rises."],["Shifts left","Cheaper U.S. goods sell more abroad."],["Moves down along AD","Not caused by P."],["Moves up along AD","Not caused by P."]], more:"Clicker question 2."},
 {id:"q8", L:3, q:"Which shifts AD left?", a:3, hint:"Look for a fall in C, I, G or NX.", o:[["A tax cut for households","That raises C."],["A stock market boom","That raises C."],["Higher defense spending","That raises G."],["A recession in countries that buy U.S. exports","Right. NX falls."]], more:"Any change in C, I, G or NX not caused by P."},
 {id:"q9", L:4, q:"The natural rate of output depends on…", a:1, hint:"The economy’s productive resources.", o:[["The price level","P doesn’t affect YN."],["Labor, capital, natural resources and technology","Right."],["The money supply","Money is neutral in the long run."],["Consumer confidence","That shifts AD."]], more:"These shift LRAS."},
 {id:"q10", L:4, q:"Which shifts LRAS to the right?", a:2, hint:"More resources or better technology.", o:[["A rise in the price level","Doesn’t affect YN."],["Factories destroyed by a hurricane","That shifts it left."],["Immigration that increases the labor force","Right."],["A stock market crash","That shifts AD."]], more:"LRAS moves with labor, capital, resources and technology."},
 {id:"q11", L:5, q:"Over 1–2 years, the SRAS curve is…", a:0, hint:"Short run vs long run.", o:[["Upward sloping","Right."],["Vertical","That’s LRAS."],["Downward sloping","That’s AD."],["Horizontal","Not in this model."]], more:"Its slope is the key to fluctuations."},
 {id:"q12", L:5, q:"The sticky-price theory relies on…", a:3, hint:"Why don’t some firms change prices right away?", o:[["Labor contracts","That’s the sticky-wage theory."],["Firms confusing relative and overall prices","That’s the misperceptions theory."],["The wealth effect","That’s about AD."],["Menu costs","Right."]], more:"Firms with sticky prices become relatively cheap."},
 {id:"q13", L:5, q:"Y = YN + a(P − PE). If YN = 100, a = 2, P = 105 and PE = 100, then Y is…", a:1, hint:"Plug in: 100 + 2 × (105 − 100).", o:[["105","That adds the price gap without multiplying by a."],["110","Right."],["100","That would need P = PE."],["90","Check the sign: P > PE."]], more:"Output is above its natural rate when prices are higher than expected."},
 {id:"q14", L:5, q:"If the AS curve were vertical in the short run, a fall in AD would…", a:2, hint:"Toggle ‘Vertical AS’.", o:[["Lower output only","With vertical AS, output can’t change."],["Lower both output and prices","That needs an upward SRAS."],["Lower prices only","Right."],["Do nothing","Prices would fall."]], more:"That’s why the upward SRAS matters."},
 {id:"q15", L:6, q:"A rise in the expected price level shifts SRAS…", a:0, hint:"Higher wages set in advance.", o:[["Left","Right answer."],["Right","Higher expected prices raise costs."],["Not at all","PE is a key SRAS shifter."],["Only in the long run","It shifts SRAS now."]], more:"That’s how the economy self-corrects after a boom."},
 {id:"q16", L:7, q:"A boom in Canada. In the long run, U.S. output…", a:1, hint:"Step 4 of the Canada diagram.", o:[["Stays higher permanently","Expectations adjust and SRAS shifts left."],["Returns to its natural rate, at a higher price level","Right."],["Falls below its natural rate","It returns to YN."],["Returns to YN at a lower price level","The price level ends higher."]], more:"Clicker activity 2 in the lecture."},
 {id:"q17", L:7, q:"During the Great Depression, both output and prices fell. This pattern points to…", a:2, hint:"Same direction or opposite?", o:[["A rightward SRAS shift","That lowers prices but raises output."],["A leftward SRAS shift","That raises prices."],["A leftward AD shift","Right."],["A rightward LRAS shift","That raises output."]], more:"Money supply fell 28% and stock prices fell 90%."},
 {id:"q18", L:7, q:"Rising house prices in 2002–2006 would, in the short run, shift…", a:0, hint:"Homeowners felt wealthier.", o:[["AD out, through consumption","Right. This was a lecture clicker question."],["AD out, through net exports","House prices mainly affect household wealth."],["SRAS out, through price expectations","This is a demand-side effect."],["AD in, through investment","Rising prices boost spending."]], more:"The crash later shifted AD in."},
 {id:"q19", L:8, q:"Stagflation is…", a:3, hint:"Stagnation + inflation.", o:[["Rising output and rising prices","That’s an AD boom."],["Falling output and falling prices","That’s an AD bust."],["Rising output and falling prices","That’s a favorable supply shift."],["Falling output and rising prices","Right."]], more:"Caused by an adverse SRAS shift."},
 {id:"q20", L:8, q:"Keynes’ “In the long run, we are all dead” argues that…", a:1, hint:"What did Keynes want policymakers to do?", o:[["The long run is all that matters","He meant the opposite."],["Policymakers shouldn’t just wait for the long run; they should act on demand","Right."],["Money is always neutral","Keynes stressed short-run effects of demand."],["Recessions can’t be fixed","He believed policy could help."]], more:"Next lecture: how fiscal and monetary policy shift AD."}
];
const ROUNDS = [["Round 1","Fluctuations and the model",0],["Round 2","Aggregate demand",5],["Round 3","Aggregate supply",10],["Round 4","Shocks and history",15],["Mixed round","5 random questions",-1],["My weak spots","Questions you’ve missed before, mixed up",-2],["Four-step drills","Random events: which curve, which way, what happens?",-3]];
function genDrill(){
  const EVS = [
    ["Households become much more pessimistic about the future","AD","L"],["Firms rush to buy new equipment","AD","R"],["The government raises spending on roads","AD","R"],["A recession hits major U.S. trading partners","AD","L"],
    ["The dollar depreciates sharply","AD","R"],["A tax increase on households","AD","L"],["Oil prices jump","SRAS","L"],["Expected prices fall","SRAS","R"],["Expected prices rise","SRAS","L"],["A bad harvest raises food costs","SRAS","L"]
  ];
  const e = EVS[Math.floor(Math.random()*EVS.length)], ask = Math.floor(Math.random()*3);
  const P = e[1] === "AD" ? (e[2] === "R" ? "rises" : "falls") : (e[2] === "L" ? "rises" : "falls");
  const Y = e[2] === "R" ? "rises" : "falls";
  let q, o, a;
  if (ask === 0){ q = `${e[0]}. In the short run, which curve shifts, and which way?`; const opts = [["AD shifts right","AD","R"],["AD shifts left","AD","L"],["SRAS shifts right","SRAS","R"],["SRAS shifts left","SRAS","L"]];
    o = opts.map(x => [x[0], x[1] === e[1] && x[2] === e[2] ? "Right." : (x[1] !== e[1] ? (e[1] === "AD" ? "This changes spending (C, I, G or NX), so it’s a demand shift." : "This changes production costs or expected prices, so it’s a supply shift.") : "Right curve, wrong direction. Does it raise or lower spending/costs?")]); a = opts.findIndex(x => x[1] === e[1] && x[2] === e[2]); }
  else if (ask === 1){ q = `${e[0]}. In the short run, the price level…`; o = [["Rises", P === "rises" ? "Right." : "Not quite. Find the curve and direction first, then read off P."],["Falls", P === "falls" ? "Right." : "Not quite. Find the curve and direction first, then read off P."]]; a = P === "rises" ? 0 : 1; }
  else { q = `${e[0]}. In the short run, real GDP…`; o = [["Rises", Y === "rises" ? "Right." : "Not quite. Find the curve and direction first, then read off Y."],["Falls", Y === "falls" ? "Right." : "Not quite. Find the curve and direction first, then read off Y."]]; a = Y === "rises" ? 0 : 1; }
  return {id:"gen", gen:true, L: e[1] === "AD" ? 7 : 8, q, o, a, hint:"AD shifts move P and Y the same way; SRAS shifts move them opposite ways.", more:"In the long run, output returns to YN."};
}

/* ---------- short answers ---------- */
const WRITE = [
 {q:"State the three facts about economic fluctuations.", keys:[["Irregular and unpredictable",/irregular|unpredictable/i],["Quantities fluctuate together",/together|move together|co-?move/i],["Output falls, unemployment rises",/unemployment.{0,30}(rise|increas)/i]],
  model:"First, economic fluctuations are irregular and unpredictable. Second, most macroeconomic quantities, such as GDP, income, spending and investment, fluctuate together. Third, as output falls, unemployment rises."},
 {q:"Explain the three reasons the aggregate-demand curve slopes downward.", keys:[["Wealth effect: P ↑ lowers real wealth, C falls",/wealth/i],["Interest-rate effect: P ↑ raises r, I falls",/interest.?rate effect|interest rate.{0,60}invest/i],["Exchange-rate effect: dollar appreciates, NX falls",/exchange.?rate|apprecia/i],["Each lowers quantity demanded",/(quantity|output|goods).{0,30}(demanded|fall)|(c|consumption|i\b|investment|nx|net exports).{0,20}(fall|decreas)/i]],
  model:"First, the wealth effect: a higher price level lowers the real value of money people hold, so they feel poorer and consumption falls. Second, the interest-rate effect: a higher price level raises money demand, pushing up interest rates and lowering investment. Third, the exchange-rate effect: higher U.S. interest rates attract foreign investors, the dollar appreciates, U.S. exports become more expensive and net exports fall. Each effect reduces the quantity of goods and services demanded."},
 {q:"What shifts the AD curve? Give one example for each of C, I, G and NX, and explain why a change in the price level does not shift AD.", keys:[["C example",/stock|tax|consum|wealth/i],["I example",/invest|equipment|animal spirits|tax credit|interest/i],["G example",/government spending|defense|roads|schools|\bg\b/i],["NX example",/export|abroad|exchange rate|canada|recession in/i],["P causes movement along AD",/(along|movement).{0,40}(curve|ad)/i]],
  model:"Any change in consumption, investment, government purchases or net exports other than one caused by the price level shifts AD. For example, a stock market boom raises C, an investment tax credit raises I, higher defense spending raises G, and a boom in Canada raises NX; each shifts AD right. A change in the price level is already captured by the slope of AD, so it causes a movement along the curve, not a shift."},
 {q:"Why is the long-run aggregate-supply curve vertical, and what can shift it?", keys:[["YN depends on labor, capital, resources, technology",/(labor|capital|resources|technology)/i],["P doesn’t affect these",/price level.{0,60}(not|doesn.t|no).{0,20}affect|classical dichotomy/i],["Shifters: e.g., immigration, investment, discoveries, technology",/immigra|education|degree|hurricane|discover|technolog/i]],
  model:"In the long run, output equals the natural rate YN, which depends on the economy’s labor, capital, natural resources and technology. A change in the price level doesn’t affect any of these, so it doesn’t affect output: the LRAS curve is vertical (the classical dichotomy). LRAS shifts when these determinants change, for example immigration increasing the labor force, investment in capital, new mineral discoveries, or technological progress."},
 {q:"Describe the three theories of the upward-sloping SRAS curve and what they have in common.", keys:[["Sticky wages",/sticky.?wage/i],["Sticky prices / menu costs",/sticky.?price|menu cost/i],["Misperceptions",/misperception|relative price/i],["Y = YN + a(P − PE)",/p\s?(−|-|>)\s?pe|expected price/i]],
  model:"The sticky-wage theory says nominal wages are set in advance based on the expected price level, so if prices rise more than expected, production becomes more profitable and firms produce more. The sticky-price theory says menu costs keep some prices fixed, so when the price level rises, firms with sticky prices are relatively cheap and sell more. The misperceptions theory says firms mistake a rise in the overall price level for a rise in their relative price and increase output. All three imply output deviates from its natural rate when the price level differs from what was expected: Y = YN + a(P − PE)."},
 {q:"Using the four steps, analyze the short-run and long-run effects of a stock market crash.", keys:[["Affects C, shifts AD",/(consum|\bc\b).{0,40}(ad|aggregate demand)|ad.{0,20}shift/i],["AD shifts left",/left/i],["Short run: P and Y fall, unemployment rises",/(p|price).{0,40}(y|output).{0,20}(fall|lower|decreas)|both fall/i],["Long run: PE falls, SRAS shifts right, Y back to YN, lower P",/(sras).{0,30}right|back to.{0,20}(natural|yn)|lower price/i]],
  model:"Step 1: a stock market crash makes households poorer, reducing consumption, so it affects AD. Step 2: AD shifts left. Step 3: in the short run the economy moves to a new equilibrium with a lower price level, lower output and higher unemployment. Step 4: over time people expect lower prices, wages and prices adjust, and SRAS shifts right until the economy reaches a new long-run equilibrium with output and unemployment back at their natural rates but a lower price level."},
 {q:"Explain stagflation using an oil price shock, and describe the policy choice it creates.", keys:[["Oil shock raises costs, SRAS shifts left",/(sras|supply).{0,30}(left|in)|cost/i],["P rises, Y falls: stagflation",/stagflation|(output|y).{0,30}(fall|lower).{0,60}(price|p\b).{0,20}(rise|higher)/i],["Wait: wages fall, back to A",/wait|do nothing|wages fall|self.?correct/i],["Accommodate: raise AD, Y back but P permanently higher",/accommodat|permanent|higher price/i]],
  model:"Higher oil prices raise production costs, shifting SRAS left. In the short run the price level rises while output falls and unemployment rises: stagflation. Policymakers can wait, in which case high unemployment eventually pushes wages down, SRAS shifts back right, and the economy returns to its original equilibrium. Or they can accommodate the shock by using fiscal or monetary policy to raise AD, which returns output to its natural rate faster but leaves the price level permanently higher."},
 {q:"Explain the role of the housing market in the 2008–2009 recession using the AD–AS model, and describe the policy response.", keys:[["House prices rose 2002–2006: AD right",/(house|housing).{0,80}(rise|rose|boom)/i],["Crash: underwater, foreclosures, losses: AD left",/crash|underwater|foreclos|toxic|ad.{0,20}left/i],["Fed cut rates / bought securities",/fed.{0,60}(rate|zero|purchas|bought)/i],["Fiscal: $800 billion spending and tax cuts; shift AD right",/800|fiscal|spending.{0,20}tax/i]],
  model:"From 2002 to 2006, house prices rose because of low interest rates, easy credit and mortgage securitization, raising household wealth and spending and shifting AD right. The 2006–2009 crash left homeowners underwater, caused foreclosures and losses on mortgage-backed securities, and hurt construction, shifting AD left: output fell about 4% and unemployment rose to 10.1%. The Fed cut the federal funds rate to near zero and bought mortgage-backed securities, the Treasury recapitalized banks, and fiscal policy added about $800 billion in spending and tax cuts, all intended to shift AD back to the right."}
];
const WTAG = [0,2,3,4,5,7,8,7];
