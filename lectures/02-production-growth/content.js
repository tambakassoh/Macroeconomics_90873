/* Lecture 2: Production and Growth — lab content (loaded after assets/lab.js) */

const CARDS = [
 ["Productivity","The quantity of goods and services produced by each unit of labor input: output per worker (or per hour).","Crusoe’s standard of living depends on how many fish he catches."],
 ["Physical capital","The stock of equipment and structures used to produce goods and services. A produced factor of production.","Fishing poles, machines, factories."],
 ["Human capital","The knowledge and skills workers acquire through education, training and experience.","Crusoe’s training in fishing."],
 ["Natural resources","Inputs provided by nature: land, water, minerals. Renewable (forests) or nonrenewable (oil).","Plentiful fish near the island."],
 ["Technological knowledge","Society’s understanding of the best ways to produce goods and services. Common (assembly lines) or proprietary (a patented drug).",""],
 ["Technology vs human capital","Technology is what’s in the textbooks; human capital is the time workers have spent reading them.",""],
 ["Aggregate production function","Y = A F(L, K, H, N): output depends on technology, labor, physical capital, human capital and natural resources.",""],
 ["Constant returns to scale","Doubling all inputs (L, K, H, N) doubles output: xY = A F(xL, xK, xH, xN).",""],
 ["Output per worker","Y/L = A F(1, K/L, H/L, N/L): productivity depends on capital, human capital and resources per worker, and technology.",""],
 ["Rule of 70","A quantity growing at g% a year doubles in about 70 ÷ g years.","2% → about 35 years; 7% → about 10 years."],
 ["Diminishing returns","The benefit from an extra unit of an input falls as the quantity of that input rises.","Each extra machine adds less output than the last."],
 ["Catch-up effect","Countries that start off poor tend to grow faster than countries that start off rich, because capital is more productive where it’s scarce.","South Korea and other East Asian economies."],
 ["Foreign direct investment","Capital investment owned and operated by foreigners in the domestic economy.","A foreign carmaker builds and runs a local factory."],
 ["Foreign portfolio investment","Foreigners lend money to domestic firms, which use it to buy capital.","Buying a local company’s bonds."],
 ["World Bank","Raises funds in advanced countries and lends them to developing countries.",""],
 ["Positive externality","A benefit one person’s action gives to bystanders. Education and R&D create new ideas others can use.",""],
 ["Property rights","People’s ability to exercise authority over the resources they own. Needed so people will save and invest for the future.",""],
 ["Malthus","Thomas Robert Malthus (1766–1834) predicted population growth would cause widespread poverty. The evidence so far hasn’t supported him.",""]
];
const CNOTE = {
 "Rule of 70":"📘 An approximation. It’s very accurate for growth rates of a few percent a year."
};
const TB = new Set(["c4a","c4b","q12","q13","q14"]);
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
      <div class="choices" style="grid-template-columns:repeat(2,1fr)">${choices.map(c => `<button type="button" class="choice" data-z="${c[0]}">${c[1]}</button>`).join("")}</div><div class="fb"></div>`;
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
function figGrowth(el){
  el.innerHTML = `<div class="figt">The power of compounding</div><p class="figsub">Start every economy at an income of $1,000 per person. Pick a growth rate and watch 50 years unfold.</p>
    <label for="gr-g" style="display:flex;justify-content:space-between"><span>Your growth rate</span><b class="gr-gv"></b></label><input type="range" id="gr-g" min="0" max="8" step="0.5" value="2">
    <div class="gr-c"></div>
    <div class="stack gr-v"></div><p class="cap gr-cap" aria-live="polite"></p>`;
  const s = el.querySelector("#gr-g");
  const draw = () => { const g = +s.value; el.querySelector(".gr-gv").textContent = g + "% a year";
    const SER = [[g, "var(--wrong)", "Your rate"],[2, "var(--note)", "U.S. (≈2%)"],[7, "var(--gold)", "East Asia (≈7%)"],[0, "var(--muted)", "No growth"]];
    const w = 340, hh = 210, L = 46, R = 12, T = 12, B = 26, maxY = 1000*Math.pow(1.08, 50), X = t => L + t/50*(w-L-R), Y = v => T + (1 - Math.log10(v/1000)/Math.log10(maxY/1000))*(hh-T-B);
    const ticks = [1000, 10000, 40000].filter(v => v <= maxY);
    const lines = SER.map(s2 => `<polyline points="${Array.from({length:51},(_,t) => `${X(t).toFixed(1)},${Y(1000*Math.pow(1+s2[0]/100,t)).toFixed(1)}`).join(" ")}" style="fill:none;stroke:${s2[1]};stroke-width:${s2[2] === "Your rate" ? 3.5 : 2}${s2[2] === "No growth" ? ";stroke-dasharray:5 4" : ""}"/>`).join("");
    el.querySelector(".gr-c").innerHTML = `<svg class="chart" viewBox="0 0 ${w} ${hh}" role="img" aria-label="Income paths over 50 years at different growth rates">
      ${ticks.map(v => `<line x1="${L}" y1="${Y(v)}" x2="${w-R}" y2="${Y(v)}" style="stroke:var(--line)"/><text x="${L-4}" y="${Y(v)+4}" text-anchor="end" class="sm">$${v/1000}k</text>`).join("")}
      ${[0,10,20,30,40,50].map(t => `<text x="${X(t)}" y="${hh-8}" text-anchor="middle" class="sm">${t}</text>`).join("")}<text x="${w-R}" y="${T+10}" text-anchor="end" class="sm mute">years →</text>${lines}</svg>
      <div class="legend" style="justify-content:flex-start;flex-wrap:wrap">${SER.map(s2 => `<span><i style="background:${s2[1]}"></i>${s2[2]}</span>`).join("")}</div>`;
    const after = 1000*Math.pow(1+g/100, 50), dbl = g > 0 ? 70/g : null;
    el.querySelector(".gr-v").innerHTML = kv("Income after 50 years", "$" + Math.round(after).toLocaleString("en-US")) + kv("Doubles about every", dbl ? dbl.toFixed(0) + " years (70 ÷ " + g + ")" : "never");
    el.querySelector(".gr-cap").innerHTML = g === 0 ? "With no growth, income stays at $1,000 forever, like some countries in Africa in the lecture." : `At ${g}% a year, income doubles roughly every ${dbl.toFixed(0)} years. Small differences in growth rates add up to <b>huge</b> differences in living standards. (The chart uses a ratio scale, so equal steps mean equal growth rates.)`; };
  s.oninput = draw; draw();
}
function figCrusoe(el){
  const D = [["K","🎣 Fishing poles","Physical capital"],["H","🎓 Training in fishing","Human capital"],["N","🐟 Fish near the island","Natural resources"],["A","💡 New fishing techniques","Technological knowledge"]];
  el.innerHTML = `<div class="figt">Robinson Crusoe’s productivity</div><p class="figsub">Everything Crusoe consumes, he must catch himself. Raise each factor and see how many fish he catches per day.</p>
    ${D.map(d => `<label for="cr-${d[0]}" style="display:flex;justify-content:space-between"><span>${d[1]}</span><b class="cr-${d[0]}v"></b></label><input type="range" id="cr-${d[0]}" min="1" max="5" step="1" value="2">`).join("")}
    <div style="display:flex;justify-content:space-between;align-items:baseline"><span>Fish per day</span><span class="bignum cr-f"></span></div>
    <div class="cr-fish" style="font-size:24px;line-height:1.3;min-height:34px" aria-hidden="true"></div><p class="cap cr-cap" aria-live="polite"></p>`;
  let last = "K";
  const up = () => { const v = {}; D.forEach(d => v[d[0]] = +el.querySelector("#cr-" + d[0]).value);
    const f = 2*v.A*Math.pow(v.K, 0.35)*Math.pow(v.H, 0.35)*Math.pow(v.N, 0.3);
    D.forEach(d => el.querySelector(".cr-" + d[0] + "v").textContent = ["very low","low","medium","high","very high"][v[d[0]]-1]);
    el.querySelector(".cr-f").textContent = f.toFixed(1); el.querySelector(".cr-fish").textContent = "🐟".repeat(Math.min(40, Math.round(f)));
    const d = D.find(x => x[0] === last);
    el.querySelector(".cr-cap").innerHTML = `Crusoe’s standard of living is his <b>productivity</b>. The factor you just changed, ${d[1].slice(3).toLowerCase()}, is <b>${d[2].toLowerCase()}</b>. Same four determinants for a whole economy.`; };
  D.forEach(d => el.querySelector("#cr-" + d[0]).oninput = () => { last = d[0]; up(); });
  up();
}
function figDeterminants(el){
  sortActivity(el, "Which determinant of productivity?", "Physical capital (K), human capital (H), natural resources (N) or technological knowledge (A)?", [
    ["A new factory with modern machines","K","Equipment and structures: physical capital."],
    ["A worker earns a nursing degree","H","Skills acquired through education: human capital."],
    ["A country’s oil fields","N","Provided by nature: a nonrenewable natural resource."],
    ["Henry Ford’s assembly line, copied by other industries","A","A better way of producing: common technological knowledge."],
    ["A patented new drug only one company may produce","A","Proprietary technological knowledge."],
    ["Years of on-the-job experience","H","Experience builds human capital."],
    ["Forests a country can harvest and replant","N","A renewable natural resource."],
    ["Laptops for an office’s staff","K","Tools for workers: physical capital."]
  ], [["K","Physical capital"],["H","Human capital"],["N","Natural resources"],["A","Technology"]], (it, z) => ({K:"Is it equipment or a structure?", H:"Is it a skill inside a worker?", N:"Is it provided by nature?", A:"Is it society’s know-how about producing?"}[z]));
}
function figCRS(el){
  el.innerHTML = `<div class="figt"><span class="modeltag">📘 Textbook model, as in the lecture</span><br>Constant returns to scale</div><p class="figsub">Start with L = 10 workers, K = 40, H = 20, N = 30 and output Y = 100. Scale <b>all</b> inputs by x.</p>
    <label for="cs-x" style="display:flex;justify-content:space-between"><span>Scale factor x</span><b class="cs-xv"></b></label><input type="range" id="cs-x" min="0.5" max="3" step="0.5" value="1">
    <div class="stack cs-v"></div><p class="cap cs-cap" aria-live="polite"></p>`;
  const s = el.querySelector("#cs-x");
  const up = () => { const x = +s.value;
    el.querySelector(".cs-xv").textContent = "× " + x;
    el.querySelector(".cs-v").innerHTML = kv("Inputs (L, K, H, N)", `${10*x}, ${40*x}, ${20*x}, ${30*x}`) + kv("Output Y", 100*x) + kv("Output per worker Y/L", (100*x)/(10*x)) + kv("Capital per worker K/L", (40*x)/(10*x));
    el.querySelector(".cs-cap").innerHTML = x === 1 ? "Move the slider to scale every input." : `Scaling all inputs by ${x} scales output by ${x}: xY = A F(xL, xK, xH, xN). But <b>output per worker stays 10</b>, because K/L, H/L and N/L didn’t change. Productivity depends on inputs <b>per worker</b> and technology.`; };
  s.oninput = up; up();
}
function figDiminish(el){
  el.innerHTML = `<div class="figt"><span class="modeltag">📘 Textbook model, as in the lecture</span><br>Diminishing returns and catch-up</div><p class="figsub">Output per worker rises with capital per worker, but each extra unit adds less. Move a country along the curve.</p>
    <label for="dm-k" style="display:flex;justify-content:space-between"><span>Capital per worker</span><b class="dm-kv"></b></label><input type="range" id="dm-k" min="1" max="9" step="1" value="2">
    <div class="dm-c"></div><div class="stack dm-v"></div><p class="cap dm-cap" aria-live="polite"></p>`;
  const s = el.querySelector("#dm-k"), f = k => 10*Math.sqrt(k);
  const up = () => { const k = +s.value, y0 = f(k), y1 = f(k+1);
    el.querySelector(".dm-kv").textContent = k;
    const w = 340, hh = 210, L = 40, R = 12, T = 14, B = 30, X = v => L + v/10*(w-L-R), Y = v => (hh-B) - v/34*(hh-T-B);
    const pts = Array.from({length:101}, (_,i) => { const kk = i/10; return `${X(kk).toFixed(1)},${Y(f(kk)).toFixed(1)}`; }).join(" ");
    el.querySelector(".dm-c").innerHTML = `<svg class="chart" viewBox="0 0 ${w} ${hh}" role="img" aria-label="Diminishing returns to capital per worker">
      <line x1="${L}" y1="${T}" x2="${L}" y2="${hh-B}" style="stroke:var(--ink);stroke-width:1.5"/><line x1="${L}" y1="${hh-B}" x2="${w-R}" y2="${hh-B}" style="stroke:var(--ink);stroke-width:1.5"/>
      <text x="${L+4}" y="${T+10}" class="sm mute">output per worker</text><text x="${w-R}" y="${hh-6}" text-anchor="end" class="sm mute">capital per worker</text>
      <polyline points="${pts}" style="fill:none;stroke:var(--note);stroke-width:3"/>
      <line x1="${X(k)}" y1="${Y(y0)}" x2="${X(k+1)}" y2="${Y(y0)}" style="stroke:var(--gold);stroke-width:2.5"/><line x1="${X(k+1)}" y1="${Y(y0)}" x2="${X(k+1)}" y2="${Y(y1)}" style="stroke:var(--wrong);stroke-width:3"/>
      <circle cx="${X(k)}" cy="${Y(y0)}" r="5.5" style="fill:var(--wrong);stroke:var(--surface);stroke-width:2"/>
      <text x="${X(k+1)+5}" y="${(Y(y0)+Y(y1))/2+4}" class="sm halo" style="font-weight:700;fill:var(--wrong)">+${(y1-y0).toFixed(1)}</text></svg>`;
    el.querySelector(".dm-v").innerHTML = kv("Output per worker now", y0.toFixed(1)) + kv("Gain from one more unit of capital", "+" + (y1-y0).toFixed(1));
    el.querySelector(".dm-cap").innerHTML = k <= 3 ? `A <b>poor</b> country with little capital gains a lot from one more unit (+${(y1-y0).toFixed(1)}). That’s the <b>catch-up effect</b>: countries that start poor can grow faster.` : `A <b>rich</b> country with lots of capital gains much less from one more unit (+${(y1-y0).toFixed(1)}). Higher saving raises the <b>level</b> of income, but not the long-run <b>growth rate</b>.`; };
  s.oninput = up; up();
}
function figPolicy(el){
  sortActivity(el, "Which channel does each policy work through?", "Policies raise productivity by adding physical capital, human capital or technology, or by protecting incentives to invest.", [
    ["Higher national saving funds new factories","K","More saving and investment build physical capital."],
    ["A foreign carmaker builds and runs a plant here (FDI)","K","Investment from abroad adds physical capital and raises local workers’ productivity."],
    ["Public schools and student loan programs","H","Education builds human capital, and creates positive externalities."],
    ["Better nutrition and health care","H","Healthier workers are more productive: health is human capital. Fogel credits better nutrition and health with about 30% of Britain’s growth, 1790–1980."],
    ["National Science Foundation research grants","A","R&D adds to technological knowledge, with positive externalities."],
    ["Courts that reliably enforce contracts","P","Property rights and stability let people trust they’ll enjoy the future benefits of saving and schooling."],
    ["Free trade agreements","P","Trade lets countries specialize and import foreign capital; it works like a technology for turning exports into imports."]
  ], [["K","Physical capital"],["H","Human capital"],["A","Technology"],["P","Incentives & trade"]], (it, z) => ({K:"Does it add equipment or structures?", H:"Does it improve workers’ skills or health?", A:"Does it create new knowledge?", P:"Does it protect incentives or open markets?"}[z]));
}
function figPop(el){
  el.innerHTML = `<div class="figt"><span class="modeltag">📘 Textbook model, as in the lecture</span><br>Population growth: dilution vs ideas</div>
    <p class="figsub">An economy has 100 units of capital. Add workers and watch capital per worker.</p>
    <label for="pp-l" style="display:flex;justify-content:space-between"><span>Number of workers L</span><b class="pp-lv"></b></label><input type="range" id="pp-l" min="10" max="40" step="5" value="10">
    <div class="pp-tools" style="font-size:20px;line-height:1.4;margin:6px 0" aria-hidden="true"></div>
    <div class="stack pp-v"></div><p class="cap pp-cap" aria-live="polite"></p>`;
  const s = el.querySelector("#pp-l");
  const up = () => { const L = +s.value, kl = 100/L, yl = 10*Math.sqrt(kl);
    el.querySelector(".pp-lv").textContent = L;
    el.querySelector(".pp-tools").innerHTML = Array.from({length:Math.round(L/5)}, () => "🧑‍🔧" + "🔧".repeat(Math.max(1, Math.round(kl/2)))).join(" ");
    el.querySelector(".pp-v").innerHTML = kv("Capital per worker K/L", kl.toFixed(1)) + kv("Output per worker (fixed technology)", yl.toFixed(1));
    el.querySelector(".pp-cap").innerHTML = L === 10 ? "Ten workers share 100 units of capital: 10 each." : `With ${L} workers, the same capital is spread thinner: <b>${kl.toFixed(1)} per worker</b>, so productivity falls. That’s the <b>dilution</b> effect. But more people may also mean more inventors and faster technological progress. So far, the evidence hasn’t supported Malthus’ prediction of mass poverty.`; };
  s.oninput = up; up();
}

/* ---------- lessons ---------- */
const STEPS = [
 { title:"Economic growth around the world", html:`
   <p>Real GDP per person in the U.S., Japan or Germany is about <b>10 times</b> that of India, Indonesia or Nigeria. Why?</p>
   <div class="stack">
     <div class="info"><b>U.S.</b><span>Real GDP per person has grown about 2% a year over the past century (1.83% a year since 1870). Average income is more than 7 times what it was a century ago.</span></div>
     <div class="info"><b>Japan</b><span>2.76% a year since 1890. In 1890 it was about as rich as Mexico and Argentina; now it’s similar to Germany and the U.K.</span></div>
     <div class="info"><b>East Asia</b><span>Singapore, South Korea and Taiwan grew about 7% a year for decades: income doubles every 10 years.</span></div>
     <div class="info"><b>Some countries</b><span>Especially in Africa, GDP per person hasn’t grown at all.</span></div>
   </div>
   <div class="fig" data-fig="growth"></div>
   <p>The ${g("Rule of 70","rule of 70")}: something growing at g% a year doubles in about 70 ÷ g years.</p>
   ${tn("U.S. income per person is about 6 times China’s and 12 times India’s.","Fast growth in China and India since those figures has narrowed the gaps considerably. Check the World Bank’s data for current comparisons.")}`,
   check:[
    {id:"c1a", q:"An economy grows 7% a year. About how long does it take income to double?", a:1,
     o:[["7 years","That would need about 10% growth. Use the rule of 70."],["10 years","Correct. 70 ÷ 7 = 10."],["70 years","That’s the doubling time at 1% growth."]],
     hint:"Divide 70 by the growth rate.", more:"That’s what East Asian economies achieved."},
    {id:"c1b", q:"Why do small differences in growth rates matter so much?", a:2,
     o:[["They don’t; levels matter more than growth","Over decades, growth determines levels."],["Because prices change","These are real (inflation-adjusted) growth rates."],["Because growth compounds year after year","Correct."]],
     hint:"Compare the 2% and 7% lines after 50 years.", more:"At 2% income rises about 2.7×; at 7%, about 29×."}
   ]},
 { title:"Why productivity matters", html:`
   <p>Picture <b>Robinson Crusoe</b>, a sailor stranded on a desert island. Everything he consumes, he must produce himself. His standard of living depends on his ${g("Productivity","productivity")}: how many fish he catches per hour of work.</p>
   <p>The same is true for a whole economy: a country can enjoy a high standard of living only if it produces a lot of goods and services per worker. (The Bureau of Labor Statistics measures output per hour; we’ll use output per worker.)</p>
   <div class="fig" data-fig="crusoe"></div>`,
   check:[
    {id:"c2a", q:"What determines Crusoe’s standard of living?", a:0,
     o:[["His productivity","Correct. He can only consume what he produces."],["The money supply on the island","There’s no money: he consumes only what he catches."],["The price of fish","He doesn’t buy fish; he catches them."]],
     hint:"Everything he eats, he must catch.", more:"The same logic applies to GDP per person."},
    {id:"c2b", q:"For an economy, productivity is best measured as…", a:1,
     o:[["Total GDP","Total GDP depends on how many people there are."],["Output per worker (or per hour worked)","Correct."],["The number of workers","That’s the labor force, not productivity."]],
     hint:"Productivity is output per unit of labor input.", more:"The BLS measures output per hour of work."}
   ]},
 { title:"The four determinants of productivity", html:`
   <div class="stack">
     <div class="info"><b>${g("Physical capital","Physical capital")} per worker (K/L)</b><span>Equipment and structures. A produced factor of production: yesterday’s output, today’s input.</span></div>
     <div class="info"><b>${g("Human capital","Human capital")} per worker (H/L)</b><span>Knowledge and skills from education, training and experience. Less tangible, but also “produced” in schools.</span></div>
     <div class="info"><b>${g("Natural resources","Natural resources")} per worker (N/L)</b><span>Land, water, minerals; renewable or nonrenewable. Helpful, but Japan is very productive with few resources.</span></div>
     <div class="info"><b>${g("Technological knowledge","Technological knowledge")} (A)</b><span>The best ways to produce. Common (assembly lines) or proprietary (patented drugs).</span></div>
   </div>
   <p>${g("Technology vs human capital","Technology vs human capital")}: technological knowledge is what’s in the textbooks; human capital is the time each worker has spent reading them.</p>
   <div class="fig" data-fig="det"></div>`,
   check:[
    {id:"c3a", q:"A company patents a new drug and has exclusive rights to make it. This is…", a:2,
     o:[["Human capital","Human capital is a worker’s skills, not the company’s know-how."],["Physical capital","A patent isn’t equipment or a structure."],["Proprietary technological knowledge","Correct."]],
     hint:"Who can use the knowledge?", more:"Assembly lines are an example of common knowledge."},
    {id:"c3b", q:"Which is the best description of the difference between technological knowledge and human capital?", a:0,
     o:[["Technology is society’s know-how; human capital is each worker’s ability to use it","Correct."],["They’re the same thing","Closely related, but distinct."],["Technology means machines; human capital means workers","Machines are physical capital."]],
     hint:"Think of textbooks vs time spent reading them.", more:"Both raise productivity."}
   ]},
 { title:"The aggregate production function", html:`
   <div class="formula">Y = A F(L, K, H, N)</div>
   <p>Holding inputs fixed, more technology A raises output directly. With ${g("Constant returns to scale","constant returns to scale")}, doubling every input doubles output: 2Y = A F(2L, 2K, 2H, 2N).</p>
   <div class="fig" data-fig="crs"></div>
   <div class="derive">xY = A F(xL, xK, xH, xN) for any x<br>Set x = 1/L:<br><b>Y/L = A F(1, K/L, H/L, N/L)</b></div>
   <p>That’s the Crusoe story in math: ${g("Output per worker","productivity")} depends on capital, human capital and resources <b>per worker</b>, and on technology.</p>
   <h3>Are natural resources a limit to growth?</h3>
   <p>Maybe not. Technology makes production more resource-efficient, and natural-resource prices, while volatile (think oil shocks), have stayed stable or even fallen over long periods. If price measures scarcity, demand has been falling as fast as supply, or faster.</p>`,
   check:[
    {id:"c4a", q:"Under constant returns to scale, doubling L, K, H and N…", a:1,
     o:[["Doubles output per worker","Output doubles, but so does the number of workers."],["Doubles output and leaves output per worker unchanged","Correct."],["Leaves output unchanged","Constant returns means output scales with inputs."]],
     hint:"Use the scale slider and watch Y/L.", more:"That’s why productivity depends on inputs per worker."},
    {id:"c4b", q:"Y/L = A F(1, K/L, H/L, N/L) says productivity rises when…", a:2,
     o:[["The number of workers rises with everything else fixed","That lowers K/L, H/L and N/L."],["Total GDP rises","Total GDP can rise just from more workers."],["Capital, human capital or resources per worker, or technology, rise","Correct."]],
     hint:"Which variables appear on the right side?", more:"Policy works through these channels."}
   ]},
 { title:"Saving, investment and catch-up", html:`
   <p>Physical capital is produced, so a country can build more of it, but only by <b>saving and investing more and consuming less today</b>.</p>
   <p>Economists usually assume capital has ${g("Diminishing returns","diminishing returns")}:</p>
   <div class="fig" data-fig="dim"></div>
   <div class="stack">
     <div class="info"><b>Level, not growth</b><span>Higher saving leads to higher productivity and incomes in the long run, but not to permanently higher growth rates.</span></div>
     <div class="info"><b>${g("Catch-up effect","Catch-up effect")}</b><span>Poor countries gain more from extra capital, so they can grow faster than rich ones. This helped fast-growing East Asian economies like South Korea.</span></div>
   </div>`,
   check:[
    {id:"c5a", q:"Because of diminishing returns, a permanent rise in saving leads in the long run to…", a:0,
     o:[["A higher level of income, but not a permanently higher growth rate","Correct."],["A permanently higher growth rate","Each extra unit of capital adds less, so growth slows back down."],["No change in income","More capital does raise income."]],
     hint:"Watch the gains shrink as you move right on the curve.", more:"Growth is temporarily faster during the transition."},
    {id:"c5b", q:"The catch-up effect says that…", a:1,
     o:[["Rich countries grow fastest because they have the most capital","Extra capital adds less where capital is already plentiful."],["Poor countries can grow faster because extra capital is more productive there","Correct."],["All countries grow at the same rate","Growth rates differ widely."]],
     hint:"Compare the gain at low and high capital per worker.", more:"South Korea is the lecture’s example."}
   ]},
 { title:"Policies that raise productivity", html:`
   <div class="stack">
     <div class="info"><b>Investment from abroad</b><span>${g("Foreign direct investment","Foreign direct investment")} (foreigners build and run capital here) and ${g("Foreign portfolio investment","foreign portfolio investment")} (foreigners lend to local firms). Foreigners earn a return, but local workers become more productive. The ${g("World Bank")} lends to developing countries.</span></div>
     <div class="info"><b>Education</b><span>Builds human capital, at the cost of wages forgone while in school. It may matter even more than physical capital because of ${g("Positive externality","positive externalities")}: new ideas benefit everyone.</span></div>
     <div class="info"><b>Health and nutrition</b><span>Robert Fogel estimates better nutrition and health explain about 30% of Britain’s growth in GDP per person from 1790 to 1980; calorie intake rose 26% and average height rose 3.6 inches.</span></div>
     <div class="info"><b>${g("Property rights","Property rights")} and political stability</b><span>People will only save, invest and study if they trust they’ll enjoy the future benefits.</span></div>
     <div class="info"><b>Free trade</b><span>Lets countries specialize in what they do best and import foreign capital.</span></div>
     <div class="info"><b>Research and development</b><span>Adds to technological knowledge, with positive externalities. Hence grants from the National Science Foundation and National Institutes of Health.</span></div>
   </div>
   <div class="fig" data-fig="policy"></div>`,
   check:[
    {id:"c6a", q:"Why might human capital matter even more than physical capital for growth?", a:2,
     o:[["It has no cost","It costs tuition and forgone wages."],["It never has diminishing returns","The lecture doesn’t claim that."],["Educated workers create ideas that benefit others: positive externalities","Correct."]],
     hint:"What spills over to other people?", more:"That’s one reason governments are heavily involved in education."},
    {id:"c6b", q:"Why do property rights and political stability matter for growth?", a:1,
     o:[["They increase natural resources","They don’t change resources directly."],["People sacrifice today only if they trust they’ll enjoy the future benefits","Correct."],["They lower taxes","Not necessarily."]],
     hint:"Saving and schooling both trade today for tomorrow.", more:"Without them, people consume now instead of investing."}
   ]},
 { title:"Population growth", html:`
   <p>From Y/L = A F(1, K/L, H/L, N/L), more workers L can <b>lower</b> productivity by diluting capital and stretching natural resources:</p>
   <div class="fig" data-fig="pop"></div>
   <p>But more people may also mean faster technological progress, because there are more people to discover and invent.</p>
   <p>Which effect wins? It’s hard to say for sure, but the evidence so far hasn’t supported ${g("Malthus")}’ view that population growth leads to widespread poverty.</p>
   <p><b>Big picture:</b> productivity can rise through many channels: saving and investment, foreign investment, education, health, property rights, free trade, R&D, and population effects.</p>`,
   check:[
    {id:"c7a", q:"Holding capital fixed, faster population growth tends to…", a:0,
     o:[["Dilute capital per worker and lower productivity","Correct."],["Raise capital per worker","More workers share the same capital."],["Have no effect on productivity","K/L falls, so Y/L falls."]],
     hint:"Use the workers slider.", more:"That’s the dilution effect."},
    {id:"c7b", q:"What does the evidence say about Malthus’ prediction?", a:2,
     o:[["It has been fully confirmed","Living standards have risen as population grew."],["Population growth always raises productivity","The lecture says it’s hard to say which effect wins."],["It hasn’t supported widespread poverty from population growth","Correct."]],
     hint:"Look at the last paragraph of the lesson.", more:"Technological progress has outpaced dilution so far."}
   ]}
];
const FIGS = { growth:figGrowth, crusoe:figCrusoe, det:figDeterminants, crs:figCRS, dim:figDiminish, policy:figPolicy, pop:figPop };

/* ---------- self-check ---------- */
const QUIZ = [
 {id:"q1", L:0, q:"U.S. real GDP per person has grown about how fast per year over the past century?", a:1, hint:"From the lecture.", o:[["0.5%","Too slow: income wouldn’t have risen 7-fold."],["About 2%","Right."],["About 7%","That’s East Asia’s rate."],["About 10%","Far too fast."]], more:"About 1.83% a year since 1870."},
 {id:"q2", L:0, q:"At 2% growth a year, income doubles about every…", a:2, hint:"Rule of 70.", o:[["2 years","That’s far too fast."],["20 years","70 ÷ 2 isn’t 20."],["35 years","Right."],["70 years","That’s at 1% growth."]], more:"70 ÷ 2 = 35."},
 {id:"q3", L:0, q:"Japan’s growth since 1890 shows that…", a:0, hint:"Where did Japan start and end?", o:[["Countries can move from poor to rich through sustained growth","Right."],["Rich countries always stay rich","Japan moved up the ranks."],["Natural resources determine income","Japan has few natural resources."],["Growth is impossible without oil","Japan grew without much oil."]], more:"From Mexico’s level to Germany’s."},
 {id:"q4", L:1, q:"Productivity is…", a:3, hint:"Per unit of labor.", o:[["Total output","That ignores how many work."],["The number of workers","That’s labor input."],["The price level","Not related."],["Output per unit of labor input","Right."]], more:"Output per worker or per hour."},
 {id:"q5", L:1, q:"Crusoe’s standard of living depends mainly on…", a:0, hint:"He eats what he catches.", o:[["How many fish he catches","Right."],["How much money he has","There’s no money on the island."],["Interest rates","Not relevant to Crusoe."],["Imports","He’s alone on an island."]], more:"His productivity."},
 {id:"q6", L:2, q:"Physical capital is…", a:1, hint:"Equipment and structures.", o:[["Money in the bank","That’s financial capital."],["The stock of equipment and structures used in production","Right."],["Workers’ skills","That’s human capital."],["Land and minerals","Those are natural resources."]], more:"A produced factor of production."},
 {id:"q7", L:2, q:"Human capital is built through…", a:2, hint:"Skills.", o:[["Buying machines","That’s physical capital."],["Discovering oil","That’s natural resources."],["Education, training and experience","Right."],["Patents","That’s technology."]], more:"Less tangible than physical capital."},
 {id:"q8", L:2, q:"Which is a nonrenewable natural resource?", a:0, hint:"Can it regrow?", o:[["Oil","Right."],["Forests","Renewable."],["A trained engineer","Human capital."],["A factory","Physical capital."]], more:"Forests are renewable."},
 {id:"q9", L:2, q:"Japan shows that…", a:3, hint:"Resources vs productivity.", o:[["Natural resources are necessary for wealth","Japan is rich without many."],["Technology doesn’t matter","Japan relies heavily on it."],["Human capital is unimportant","Not the lesson."],["A country can be productive with few natural resources","Right."]], more:"Other determinants can compensate."},
 {id:"q10", L:2, q:"Henry Ford’s assembly line, copied across industries, is an example of…", a:1, hint:"Shared know-how.", o:[["Proprietary technology","Others could copy it."],["Common technological knowledge","Right."],["Physical capital","It’s a method, not a machine."],["Human capital","It’s society’s know-how."]], more:"A patented drug is proprietary."},
 {id:"q11", L:3, q:"In Y = A F(L, K, H, N), A stands for…", a:2, hint:"Not an input you can touch.", o:[["Labor","That’s L."],["Natural resources","That’s N."],["Technological knowledge","Right."],["Physical capital","That’s K."]], more:"More A raises output directly."},
 {id:"q12", L:3, q:"Constant returns to scale means…", a:0, hint:"Scale all inputs together.", o:[["Doubling all inputs doubles output","Right."],["Doubling capital doubles output","All inputs, not just one."],["Output never changes","It changes with inputs."],["Each extra worker adds the same output","That’s about one input."]], more:"xY = A F(xL, xK, xH, xN)."},
 {id:"q13", L:3, q:"Y/L = A F(1, K/L, H/L, N/L) shows productivity depends on…", a:3, hint:"Per-worker variables.", o:[["Total population","L only appears in ratios."],["The money supply","Not in the function."],["Total GDP","That’s Y, not Y/L."],["Inputs per worker and technology","Right."]], more:"Derived by setting x = 1/L."},
 {id:"q14", L:4, q:"Diminishing returns to capital means…", a:1, hint:"Each extra machine…", o:[["More capital lowers output","It still raises output."],["Each extra unit of capital adds less output than the last","Right."],["Capital wears out","That’s depreciation."],["Growth never stops","It implies growth from saving fades."]], more:"So higher saving raises levels, not long-run growth."},
 {id:"q15", L:4, q:"The catch-up effect predicts that…", a:2, hint:"Where is capital most productive?", o:[["Rich countries grow faster","Extra capital adds less there."],["All countries have equal income","Not in the lecture."],["Poor countries tend to grow faster than rich ones","Right."],["Growth depends only on population","Not the idea."]], more:"East Asia, such as South Korea."},
 {id:"q16", L:5, q:"Foreign direct investment is when…", a:0, hint:"Owned and operated.", o:[["Foreigners build and operate capital in the domestic economy","Right."],["Foreigners lend to domestic firms","That’s portfolio investment."],["The government buys foreign bonds","Not FDI."],["Workers move abroad","That’s migration."]], more:"It raises local workers’ productivity."},
 {id:"q17", L:5, q:"The cost of education includes…", a:3, hint:"What do students give up?", o:[["Nothing; it’s free","Even free school has a cost."],["Only tuition","There’s another big cost."],["Lower GDP forever","Education raises GDP over time."],["The wages students forgo while in school","Right."]], more:"The lecture calls it a “negative salary.”"},
 {id:"q18", L:5, q:"Fogel estimated better nutrition and health explain about what share of Britain’s growth from 1790 to 1980?", a:1, hint:"From the lecture.", o:[["5%","Larger than that."],["30%","Right."],["75%","Too large."],["100%","Other factors mattered too."]], more:"Health is part of human capital."},
 {id:"q19", L:5, q:"Governments fund research through agencies like the NSF because R&D…", a:2, hint:"Who benefits from a discovery?", o:[["Has no benefits","It raises productivity."],["Only helps the researcher","Others use the ideas too."],["Creates positive externalities","Right."],["Lowers population","Not related."]], more:"Discoveries benefit many people."},
 {id:"q20", L:6, q:"Population growth may RAISE productivity because…", a:0, hint:"More people, more…", o:[["More people means more inventors and faster technological progress","Right."],["It raises capital per worker","It lowers it."],["It increases natural resources","It stretches them."],["Malthus said so","Malthus predicted the opposite."]], more:"Which effect wins is still debated."}
];
const ROUNDS = [["Round 1","Growth and productivity",0],["Round 2","Determinants of productivity",5],["Round 3","Production function and catch-up",10],["Round 4","Policies and population",15],["Mixed round","5 random questions",-1],["My weak spots","Questions you’ve missed before, mixed up",-2],["Growth drills","Rule of 70, compounding and per-worker problems with new numbers",-3]];
function genDrill(){
  const pick = a => a[Math.floor(Math.random()*a.length)];
  const kind = Math.floor(Math.random()*3); let q, o, L, hint;
  if (kind === 0){ const g = pick([1,2,3.5,5,7,10]); const d = +(70/g).toFixed(1);
    q = `An economy grows ${g}% a year. About how many years until income doubles?`; L = 0; hint = "Rule of 70: 70 ÷ growth rate.";
    o = [[String(d),`Right. 70 ÷ ${g} = ${d}.`],[String(+(100/g).toFixed(1)),"That uses 100. The rule uses 70."],[String(+(g*7).toFixed(1)),"Divide 70 by the growth rate; don’t multiply."],[String(+(70*g).toFixed(0)),"Divide, don’t multiply."]]; }
  else if (kind === 1){ const g = pick([2,5,7,10]), n = pick([1,2,3]); const yrs = Math.round(70/g)*n, mult = Math.pow(2,n);
    q = `Income grows ${g}% a year, doubling about every ${Math.round(70/g)} years. Starting at $5,000, about how much is it after ${yrs} years?`; L = 0; hint = "Count the doublings.";
    o = [["$" + (5000*mult).toLocaleString("en-US"),`Right: ${n} doubling${n > 1 ? "s" : ""}, so × ${mult}.`],["$" + (5000*(1+g*yrs/100)).toLocaleString("en-US",{maximumFractionDigits:0}),"That adds simple growth. Growth compounds."],["$" + (5000*2*n).toLocaleString("en-US"),"Each doubling multiplies by 2 again; it doesn’t add."],["$" + (5000*(n+1)).toLocaleString("en-US"),"Compounding doubles each period."]]; }
  else { const K = pick([100,200,300,600]), L1 = pick([10,20,30]), L2 = L1*2;
    q = `An economy has ${K} units of capital. Workers rise from ${L1} to ${L2}, with capital unchanged. What happens to capital per worker?`; L = 6; hint = "K/L before and after.";
    o = [[`Falls from ${+(K/L1).toFixed(1)} to ${+(K/L2).toFixed(1)}`,"Right: the dilution effect."],[`Rises from ${+(K/L1).toFixed(1)} to ${+(2*K/L1).toFixed(1)}`,"More workers share the same capital, so each gets less."],["Stays the same","K is fixed and L doubled, so K/L changes."]]; }
  const seen = new Set(); o = o.filter(x => !seen.has(x[0]) && seen.add(x[0]));
  return {id:"gen", gen:true, L, q, o, a:0, hint, more:"New numbers every round."};
}

/* ---------- short answers ---------- */
const WRITE = [
 {q:"Explain why small differences in growth rates lead to large differences in income over time. Use the rule of 70 and the lecture’s examples.",
  keys:[["Compounding",/compound/i],["Rule of 70: doubling time = 70 ÷ g",/70/],["2% → about 35 years",/35/],["7% → about 10 years (East Asia)",/\b10\b|east asia|korea|singapore|taiwan/i]],
  model:"Growth compounds: each year’s growth builds on the previous year’s higher income. By the rule of 70, something growing at g% a year doubles in about 70 ÷ g years. U.S. income per person has grown about 2% a year, so it doubles roughly every 35 years and is more than 7 times as large as a century ago. Singapore, South Korea and Taiwan grew about 7% a year, doubling income every 10 years, while some African countries didn’t grow at all, so their gaps widened enormously."},
 {q:"Using the Robinson Crusoe example, explain why productivity determines living standards.",
  keys:[["Crusoe consumes only what he produces",/(consum|eat).{0,40}(produc|catch)/i],["Productivity = output per unit of labor",/productiv.{0,60}(per|each).{0,20}(worker|hour|labor)/i],["Same for an economy (income = output)",/economy|country|gdp/i]],
  model:"Crusoe is stranded alone, so everything he consumes he must produce himself: his standard of living is how many fish he catches per hour, his productivity. The same holds for an economy: since income equals output, a country can enjoy high living standards only if it produces a lot of goods and services per worker. Productivity is the key determinant of living standards."},
 {q:"Describe the four determinants of productivity, with an example of each, and explain the difference between technological knowledge and human capital.",
  keys:[["Physical capital",/physical capital|equipment|machine|structure/i],["Human capital",/human capital|education|training|skill/i],["Natural resources",/natural resource|land|oil|mineral|forest/i],["Technological knowledge",/technolog/i],["Textbook vs reading distinction",/textbook|society.{0,40}(understand|know)|individual/i]],
  model:"Productivity depends on physical capital per worker (equipment and structures, like fishing poles or factories), human capital per worker (knowledge and skills from education, training and experience), natural resources per worker (land, water, minerals, like oil or forests), and technological knowledge (society’s understanding of the best ways to produce, like the assembly line). Technological knowledge is society’s understanding of how the world works, while human capital is each worker’s ability to use it: technology is reflected in textbooks, human capital in the time workers have spent reading them."},
 {q:"Write the aggregate production function, explain constant returns to scale, and show how it implies that productivity depends on inputs per worker.",
  keys:[["Y = A F(L, K, H, N)",/y\s?=\s?a\s?\*?\s?f/i],["Doubling all inputs doubles output",/doubl.{0,60}(input|all).{0,40}doubl|xy\s?=/i],["Set x = 1/L",/1\s?\/\s?l/i],["Y/L depends on K/L, H/L, N/L and A",/k\s?\/\s?l|per worker/i]],
  model:"The aggregate production function is Y = A F(L, K, H, N), where Y is output, L labor, K physical capital, H human capital, N natural resources and A technology. With constant returns to scale, multiplying all inputs by x multiplies output by x: xY = A F(xL, xK, xH, xN). Setting x = 1/L gives Y/L = A F(1, K/L, H/L, N/L), so output per worker depends on physical capital, human capital and natural resources per worker, and on technology."},
 {q:"Explain diminishing returns to capital and its two implications: for the effect of higher saving and for the catch-up effect.",
  keys:[["Each extra unit adds less",/(extra|additional).{0,40}(less|smaller|declin)/i],["Higher saving raises level, not long-run growth rate",/level.{0,80}(not|rather than).{0,40}growth/i],["Poor countries gain more from capital",/poor.{0,80}(more|faster|gain)/i],["Catch-up (East Asia/South Korea)",/catch.?up|korea|east asia/i]],
  model:"Diminishing returns means the benefit from an extra unit of capital falls as the amount of capital rises. One implication is that higher saving leads in the long run to higher levels of productivity and income, but not to permanently higher growth rates. Another is the catch-up effect: poor countries with little capital gain more from each extra unit, so countries that start poor tend to grow faster than rich ones, as fast-growing East Asian economies like South Korea did."},
 {q:"Describe three government policies that can raise productivity, and explain which determinant each works through.",
  keys:[["Saving/investment or investment from abroad → physical capital",/(saving|investment|fdi|foreign).{0,80}(physical capital|capital)/i],["Education or health → human capital",/(education|school|health|nutrition).{0,80}human capital/i],["R&D → technology (externalities)",/(research|r&d|r & d).{0,80}(technolog|externalit)/i],["Property rights, stability or free trade",/property|stability|free trade|trade/i]],
  model:"Policies that encourage saving and investment, or attract foreign direct and portfolio investment, add physical capital per worker. Education, health and nutrition programs build human capital, and education has positive externalities because new ideas benefit everyone. Research and development funding, such as NSF grants, adds to technological knowledge. Protecting property rights and political stability, and promoting free trade, support all of these by letting people trust they’ll enjoy the future benefits of saving and investing and by allowing specialization."},
 {q:"How can population growth both lower and raise productivity? What does the evidence suggest about Malthus’ prediction?",
  keys:[["Dilutes capital per worker",/dilut|capital per worker|spread/i],["Stretches natural resources",/resource/i],["More people → more ideas/technology",/(more people|population).{0,80}(idea|invent|technolog|discover)/i],["Evidence hasn’t supported Malthus",/malthus.{0,80}(not|hasn.t|wrong|no)|not supported/i]],
  model:"Population growth can lower productivity by diluting physical and human capital, since the same capital is spread over more workers, and by stretching natural resources too thin. But it can also raise productivity, because more people means more potential inventors and faster technological progress. It’s hard to say which effect wins, but so far the evidence has not supported Malthus’ view that population growth will lead to widespread poverty."}
];
const WTAG = [0,1,2,3,4,5,6];
