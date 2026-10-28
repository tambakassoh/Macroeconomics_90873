/* Lecture 1: Measuring a Nation's Income (GDP and CPI) — lab content (loaded after assets/lab.js) */

const CARDS = [
 ["Macroeconomics","The study of economy-wide aggregates: total output, prices, unemployment, growth.","Microeconomics studies individual households and firms."],
 ["Gross domestic product","GDP: the market value of all final goods and services produced within a country in a given period of time.",""],
 ["Income = expenditure","For the economy as a whole, every dollar spent is a dollar of someone’s income, so GDP measures both.",""],
 ["Final good","A good sold to its end user, not used up to make another good.","A new car, not the steel inside it."],
 ["Non-market activities","Work that isn’t sold in a market, like housework and childcare. Not counted in GDP.",""],
 ["Consumption (C)","Household spending on durable goods, nondurable goods and services.","Cars, food, haircuts."],
 ["Investment (I)","Spending on capital equipment, structures and inventories. Newly built houses count here.","Machines, factories, unsold cars."],
 ["Inventory investment","Goods produced but not yet sold count as investment in the year they’re produced.","A car built in 2009 and sold in 2010 counts in 2009 GDP."],
 ["Government purchases (G)","Federal, state and local spending on goods and services, including government workers’ salaries.",""],
 ["Transfer payments","Government payments not in exchange for goods or services, like Social Security. Not counted in GDP.",""],
 ["Net exports (NX)","Exports minus imports.","A $100,000 imported Porsche raises C and lowers NX equally, so GDP doesn’t change."],
 ["Y = C + I + G + NX","GDP is the sum of its four components.",""],
 ["Nominal GDP","Output valued at current prices.","Rises when prices rise, even if output doesn’t."],
 ["Real GDP","Output valued at constant base-year prices, correcting for inflation.","Rises only when the economy produces more."],
 ["GDP deflator","(Nominal GDP ÷ real GDP) × 100. Measures the price level of all domestically produced final goods.",""],
 ["Consumer price index","CPI: (cost of the basket this year ÷ cost in the base year) × 100. Measures the cost of a typical consumer’s basket.","Computed by the Bureau of Labor Statistics."],
 ["Inflation rate","(CPI this year − CPI last year) ÷ CPI last year × 100.",""],
 ["Converting dollars over time","Value in today’s dollars = value in past dollars × (CPI today ÷ CPI then).","$80,000 in 1931 × (207 ÷ 15.2) ≈ $1.09 million in 2007."],
 ["Indexation","Automatic correction of a dollar amount for inflation, by law or contract.","Social Security benefits rise each year with the CPI."],
 ["Real interest rate","Nominal interest rate − inflation rate.","10% nominal with 3% inflation = 7% real."]
];
const CNOTE = {
 "Indexation":"🕒 Today: Social Security’s yearly cost-of-living adjustment uses a version of the CPI for wage earners (CPI-W).",
 "Consumer price index":"🕒 Today: the CPI is far higher than the lecture’s 2007 value of 207. Check bls.gov for the latest."
};
const TB = new Set([]);
const TODAY = {};

/* ---------- helpers ---------- */
const kv = (label, val) => `<div class="info" style="display:flex;justify-content:space-between;gap:10px;padding:8px 12px"><span style="color:var(--ink)">${label}</span><b style="margin:0;white-space:nowrap">${val}</b></div>`;
const money = v => (v < 0 ? "−$" : "$") + Math.abs(v).toLocaleString("en-US", {maximumFractionDigits:0});
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
const numIn = (cls, val) => `<input type="text" class="${cls}" value="${val}" inputmode="decimal" autocomplete="off" aria-label="value" style="width:100%;min-width:0;font:600 15px var(--sans);padding:6px 2px;text-align:center;border:1.5px solid var(--border);border-radius:8px;background:var(--surface);color:var(--ink)">`;

/* ---------- graphics ---------- */
function figFlow(el){
  const ST = [
    {on:[], cap:"Two groups: <b>households</b> (who own labor, land and capital) and <b>firms</b> (who produce goods and services). They meet in two markets."},
    {on:["f1","f2"], cap:"<b>Market for factors of production:</b> households sell or rent labor, land and capital to firms, and receive wages, rent and profit. That’s households’ <b>income</b>."},
    {on:["f1","f2","g1","g2"], cap:"<b>Market for goods and services:</b> firms sell output to households, who spend their income on it. That’s <b>expenditure</b>, and it’s firms’ revenue."},
    {on:["f1","f2","g1","g2","eq"], cap:"Every dollar of spending is a dollar of someone’s income. So for the whole economy, <b>income = expenditure</b>, and GDP measures both."}
  ];
  stepper(el, {title:"The circular flow: why income equals expenditure", n:() => ST.length, draw:(i, st) => {
    const on = k => ST[i].on.includes(k);
    const arrow = (k, txt, dir) => `<div class="tx ${on(k) ? "tx-ok pop" : ""}" style="${on(k) ? "" : "opacity:.35"};margin-top:6px;justify-content:center;text-align:center"><span>${dir} ${txt}</span></div>`;
    st.innerHTML = `<div class="orgrow"><div class="node"><div style="font-size:28px">🏠</div><b>Households</b><small>own labor, land, capital</small></div><div class="node gold"><div style="font-size:28px">🏭</div><b>Firms</b><small>produce goods and services</small></div></div>
      <p class="small" style="margin:10px 0 0;font-weight:700">Factor markets</p>${arrow("f1","Labor, land, capital","→")}${arrow("f2","Wages, rent, profit = income","←")}
      <p class="small" style="margin:10px 0 0;font-weight:700">Goods and services markets</p>${arrow("g1","Goods and services","←")}${arrow("g2","Spending = expenditure","→")}
      ${on("eq") ? `<div class="formula pop">Total income = total expenditure = GDP</div>` : ""}`;
    return ST[i].cap;
  }});
}
function figInGDP(el){
  sortActivity(el, "Is it in this year’s U.S. GDP?", "Check each part of the definition: market value, final, newly produced, within the country, this period.", [
    ["You buy a brand-new car made in Michigan this year.","y","A final good, newly produced in the U.S."],
    ["You buy a used car from your neighbor.","n","It was produced, and counted, in an earlier year. Only newly produced goods count."],
    ["A Canadian engineer works in Texas.","y","GDP counts production <b>within</b> the U.S., whoever does it."],
    ["A U.S. citizen works in Toronto.","n","That production happens in Canada, so it’s in Canada’s GDP."],
    ["A parent cooks dinner and cares for their kids at home.","n","Non-market activities have no market price, so they aren’t counted."],
    ["You pay $25 for a haircut.","y","Services count, at their market value."],
    ["A steel mill sells steel to Ford to build cars.","n","Steel used to make cars is an intermediate good; it’s counted inside the car’s final value. Counting it again would double count."],
    ["Your grandmother receives her Social Security check.","n","A transfer payment buys no new good or service, so it isn’t part of GDP."]
  ], [["y","Counts in GDP"],["n","Doesn’t count"]], () => "Run through the definition: is it a market sale of a new, final good or service, produced in the U.S. this period?");
}
function figComp(el){
  sortActivity(el, "Which component of GDP?", "Y = C + I + G + NX", [
    ["A family buys groceries.","C","Household spending on nondurable goods: consumption."],
    ["A family buys a newly built house.","I","By convention, new houses count as investment."],
    ["Intel builds a new chip factory.","I","Structures used to produce future goods: investment."],
    ["Your city pays its police officers’ salaries.","G","Government workers’ salaries are government purchases."],
    ["Boeing sells airplanes to British Airways.","NX","A U.S. export raises net exports."],
    ["A student pays for a doctor’s visit.","C","Household spending on services: consumption."],
    ["The Defense Department buys new jets.","G","Government purchase of goods."]
  ], [["C","C"],["I","I"],["G","G"],["NX","NX"]], (it, z) => ({C:"Is a household buying something to use now?", I:"Is it capital, a structure, inventory, or a new house?", G:"Is a government buying it?", NX:"Is it a sale to, or purchase from, another country?"}[z]));
}
function figInventory(el){
  const ST = [
    {y:"2009", rows:[["Consumption",0],["Investment (inventory)",50000],["GDP",50000]], cap:"2009: Ford builds a $50,000 car, but it sits unsold. Inventory counts as <b>investment</b>, so investment and GDP both rise by $50,000."},
    {y:"2010", rows:[["Consumption",50000],["Investment (inventory)",-50000],["GDP",0]], cap:"2010: the car sells. Consumption rises $50,000, but Ford’s inventory falls, so investment falls $50,000. <b>GDP doesn’t change.</b>"},
    {y:"Lesson", rows:[["2009 GDP",50000],["2010 GDP",0]], cap:"The car adds to GDP in the year it’s <b>produced</b> (2009), not the year it’s sold (2010)."}
  ];
  stepper(el, {title:"Ford’s unsold car", n:() => ST.length, draw:(i, st) => {
    st.innerHTML = `<div class="scen pop" style="font-size:17px">🚗 ${ST[i].y}</div><div class="stack">${ST[i].rows.map(r => kv(r[0], `<span style="color:${r[1] > 0 ? "var(--right)" : r[1] < 0 ? "var(--wrong)" : "var(--muted)"}">${r[1] > 0 ? "+" : ""}${money(r[1])}</span>`)).join("")}</div>`;
    return ST[i].cap;
  }});
}
function figNXex(el){
  let K = "porsche";
  const SC = {
    porsche:{t:"You buy a $100,000 Porsche made in Germany", steps:[
      {rows:[["Consumption",100000],["Net exports",0],["U.S. GDP",100000]], cap:"Your purchase raises U.S. consumption by $100,000…"},
      {rows:[["Consumption",100000],["Net exports",-100000],["U.S. GDP",0]], cap:"…but it’s an import, so net exports fall by $100,000. <b>U.S. GDP doesn’t change</b>, which is right: the income was earned by a German firm."}]},
    boeing:{t:"Boeing sells $100 million of planes to British Airways", steps:[
      {rows:[["Consumption",0],["Net exports",100000000],["U.S. GDP",100000000]], cap:"An export: net exports rise by $100 million, and so does U.S. GDP."},
      {rows:[["Consumption",0],["Net exports",100000000],["U.S. GDP",100000000]], cap:"That’s right, because the income was earned by a U.S. firm and its workers."}]}
  };
  const top = `<div class="seg" role="group" aria-label="Example"><button type="button" aria-pressed="true" data-k="porsche">Import: Porsche</button><button type="button" aria-pressed="false" data-k="boeing">Export: Boeing</button></div>`;
  const sp = stepper(el, {title:"Why net exports are in GDP", top, n:() => 2, draw:(i, st) => {
    const s = SC[K], rows = s.steps[i].rows, cap = s.steps[i].cap;
    st.innerHTML = `<div class="scen pop" style="font-size:16px">${s.t}</div><div class="stack">${rows.map(r => kv(r[0], `<span style="color:${r[1] > 0 ? "var(--right)" : r[1] < 0 ? "var(--wrong)" : "var(--muted)"}">${r[1] > 0 ? "+" : ""}${money(r[1])}</span>`)).join("")}</div>`;
    return cap;
  }});
  el.querySelectorAll(".seg button").forEach(b => b.onclick = () => { K = b.dataset.k; el.querySelectorAll(".seg button").forEach(x => x.setAttribute("aria-pressed", x === b)); sp.reset(); });
}
function figRealGDP(el){
  const D0 = {pp:[10,11,12], pq:[400,500,600], lp:[2,2.5,3], lq:[1000,1100,1200]};
  el.innerHTML = `<div class="figt">Compute nominal GDP, real GDP and the deflator</div><p class="figsub">A two-good economy (a practice example). Base year: 2020. Edit any price or quantity.</p>
    <div class="tbl" style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:14px"><thead><tr><th style="text-align:left">Year</th><th>🍕 price</th><th>🍕 qty</th><th>☕ price</th><th>☕ qty</th></tr></thead><tbody class="rg-in"></tbody></table></div>
    <div class="rg-out" style="margin-top:10px"></div><p class="cap rg-cap" aria-live="polite"></p><button type="button" class="btn ghost rg-reset" style="margin-top:8px">Reset numbers</button>`;
  const yrs = [2020,2021,2022];
  const build = d => { el.querySelector(".rg-in").innerHTML = yrs.map((y,i) => `<tr><td style="padding:4px 4px 4px 0;font-weight:700">${y}</td>${["pp","pq","lp","lq"].map(k => `<td style="padding:2px">${numIn("rg-" + k + i, d[k][i], k[1] === "p" ? 0.5 : 50)}</td>`).join("")}</tr>`).join(""); el.querySelectorAll(".rg-in input").forEach(x => x.oninput = calc); };
  const v = (k,i) => +el.querySelector(".rg-" + k + i).value || 0;
  const calc = () => {
    const rows = yrs.map((y,i) => { const nom = v("pp",i)*v("pq",i) + v("lp",i)*v("lq",i), real = v("pp",0)*v("pq",i) + v("lp",0)*v("lq",i); return {y, nom, real, def: real ? nom/real*100 : 0}; });
    el.querySelector(".rg-out").innerHTML = `<div class="tbl" style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:14px"><thead><tr><th style="text-align:left">Year</th><th>Nominal GDP</th><th>Real GDP</th><th>Deflator</th><th>Inflation</th></tr></thead><tbody>${rows.map((r,i) => `<tr><td style="font-weight:700;padding:4px 0">${r.y}</td><td style="text-align:center">${money(r.nom)}</td><td style="text-align:center">${money(r.real)}</td><td style="text-align:center">${r.def.toFixed(1)}</td><td style="text-align:center">${i ? ((r.def/rows[i-1].def - 1)*100).toFixed(1) + "%" : "–"}</td></tr>`).join("")}</tbody></table></div>`;
    const r1 = rows[1];
    el.querySelector(".rg-cap").innerHTML = `2021 nominal GDP uses 2021 prices: ${money(v("pp",1))} × ${v("pq",1)} + $${v("lp",1)} × ${v("lq",1)} = <b>${money(r1.nom)}</b>. Real GDP uses <b>2020 prices</b> with 2021 quantities: ${money(v("pp",0))} × ${v("pq",1)} + $${v("lp",0)} × ${v("lq",1)} = <b>${money(r1.real)}</b>. Deflator = ${money(r1.nom)} ÷ ${money(r1.real)} × 100 = <b>${r1.def.toFixed(1)}</b>.`;
  };
  el.querySelector(".rg-reset").onclick = () => { build(D0); calc(); };
  build(D0); calc();
}
function figWhatIf(el){
  let mode = "q";
  el.innerHTML = `<div class="figt">What changes when…</div><div class="seg" role="group" aria-label="Scenario"><button type="button" aria-pressed="true" data-m="q">Quantities rise</button><button type="button" aria-pressed="false" data-m="p">Prices rise</button></div><div class="wi-b"></div>`;
  const draw = () => { const q = mode === "q";
    el.querySelector(".wi-b").innerHTML = `<p class="small" style="margin:0 0 8px">${q ? "All quantities rise 10%; prices stay the same." : "All prices rise 10%; quantities stay the same."}</p><div class="stack">${kv("Real GDP", q ? "<span class='pill up'>rises 10%</span>" : "<span class='pill'>unchanged</span>")}${kv("Nominal GDP", "<span class='pill up'>rises 10%</span>")}${kv("GDP deflator", q ? "<span class='pill'>unchanged</span>" : "<span class='pill up'>rises 10%</span>")}</div>
      <p class="cap">${q ? "More output: real and nominal GDP rise together, so their ratio, the deflator, doesn’t move." : "Higher prices only: nominal GDP rises but real GDP doesn’t, so the deflator rises. The percentage rise in the deflator is the <b>inflation rate</b>."}</p>`; };
  el.querySelectorAll(".seg button").forEach(b => b.onclick = () => { mode = b.dataset.m; el.querySelectorAll(".seg button").forEach(x => x.setAttribute("aria-pressed", x === b)); draw(); });
  draw();
}
function figCPI(el){
  const D0 = {a:[1,2,3], b:[4,5,6]};
  el.innerHTML = `<div class="figt">Build a CPI</div><p class="figsub">Step 1: the basket is <b>4 hot dogs and 2 hamburgers</b> (a practice example). Steps 2–4: record prices, cost the basket, and compare with the base year, 2020. Edit the prices.</p>
    <div class="tbl" style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:14px"><thead><tr><th style="text-align:left">Year</th><th>🌭 price</th><th>🍔 price</th></tr></thead><tbody class="cp-in"></tbody></table></div>
    <div class="cp-out" style="margin-top:10px"></div><p class="cap cp-cap" aria-live="polite"></p>`;
  const yrs = [2020,2021,2022];
  el.querySelector(".cp-in").innerHTML = yrs.map((y,i) => `<tr><td style="font-weight:700;padding:4px 4px 4px 0">${y}</td><td style="padding:3px">${numIn("cp-a" + i, D0.a[i], 0.5)}</td><td style="padding:3px">${numIn("cp-b" + i, D0.b[i], 0.5)}</td></tr>`).join("");
  const v = (k,i) => +el.querySelector(".cp-" + k + i).value || 0;
  const calc = () => {
    const cost = yrs.map((_,i) => 4*v("a",i) + 2*v("b",i)), cpi = cost.map(c => cost[0] ? c/cost[0]*100 : 0);
    el.querySelector(".cp-out").innerHTML = `<div class="stack">${yrs.map((y,i) => kv(`${y}: basket ${money(cost[i])}`, `CPI ${cpi[i].toFixed(1)}${i ? ` · inflation ${((cpi[i]/cpi[i-1]-1)*100).toFixed(1)}%` : ""}`)).join("")}</div>`;
    el.querySelector(".cp-cap").innerHTML = `2021 basket: 4 × $${v("a",1)} + 2 × $${v("b",1)} = ${money(cost[1])}. CPI = ${money(cost[1])} ÷ ${money(cost[0])} × 100 = <b>${cpi[1].toFixed(1)}</b>. Inflation 2021 → 2022 = (${cpi[2].toFixed(1)} − ${cpi[1].toFixed(1)}) ÷ ${cpi[1].toFixed(1)} × 100 = <b>${((cpi[2]/cpi[1]-1)*100).toFixed(1)}%</b>.`;
  };
  el.querySelectorAll(".cp-in input").forEach(x => x.oninput = calc); calc();
}
function figSalary(el){
  const PRE = [["Babe Ruth, 1931",80000,15.2],["President Hoover, 1931",75000,15.2],["Custom",50000,30]];
  el.innerHTML = `<div class="figt">Who was paid more?</div><p class="figsub">Convert old salaries into 2007 dollars (CPI 2007 = 207), using the lecture’s numbers.</p>
    <div class="seg" role="group" aria-label="Example" style="grid-template-columns:repeat(3,1fr)">${PRE.map((p,i) => `<button type="button" aria-pressed="${i === 0}" data-i="${i}" style="font-size:14px;padding:8px 4px">${p[0].split(",")[0]}</button>`).join("")}</div>
    <div class="orgrow"><label class="small">Salary then ($)${numIn("sa-s", 80000, 1000)}</label><label class="small">CPI then${numIn("sa-c", 15.2, 0.1)}</label></div>
    <div class="derive sa-f" style="margin-top:10px"></div><div style="display:flex;justify-content:space-between;align-items:baseline;margin-top:8px"><span>In 2007 dollars</span><span class="bignum sa-v"></span></div>
    <p class="cap sa-cap" aria-live="polite"></p>`;
  const s = el.querySelector(".sa-s"), c = el.querySelector(".sa-c"); let k = 0;
  const up = () => { const S = +s.value, C = +c.value; if (!(S > 0 && C > 0)) return; const v = S*207/C;
    el.querySelector(".sa-f").innerHTML = `Value in 2007 $ = value then × (CPI 2007 ÷ CPI then)<br>= ${money(S)} × (207 ÷ ${C}) = <b>${money(v)}</b>`;
    el.querySelector(".sa-v").textContent = money(v);
    el.querySelector(".sa-cap").innerHTML = k === 0 ? "Ruth’s $80,000 was worth about <b>$1.09 million</b> in 2007 dollars, far less than the $28 million that player B earned in 2007. Even after adjusting for inflation, B was paid much more." :
      k === 1 ? "Hoover’s $75,000 was worth about <b>$1.02 million</b> in 2007 dollars, more than twice the $400,000 that President George W. Bush earned in 2007." : "Try your own numbers: a family member’s first salary, or the price of something from years ago."; };
  el.querySelectorAll(".seg button").forEach(b => b.onclick = () => { k = +b.dataset.i; el.querySelectorAll(".seg button").forEach(x => x.setAttribute("aria-pressed", x === b)); s.value = PRE[k][1]; c.value = PRE[k][2]; up(); });
  s.oninput = up; c.oninput = up; up();
}
function figInterest(el){
  el.innerHTML = `<div class="figt">Your bank account: nominal vs real</div><p class="figsub">You deposit $1,000 at 10% a year. Choose the inflation rate.</p>
    <label for="in-p" style="display:flex;justify-content:space-between"><span>Inflation rate</span><b class="in-pv"></b></label><input type="range" id="in-p" min="-4" max="15" step="1" value="3">
    <div class="in-bars" style="margin:8px 0"></div><div class="stack in-v"></div><p class="cap in-cap" aria-live="polite"></p>`;
  const s = el.querySelector("#in-p");
  const bar = (label, val, col) => `<div class="lrow" style="grid-template-columns:96px 1fr 54px"><span>${label}</span><span class="b" style="width:${Math.max(0, val)*5}%;background:${col}"></span><span class="v">${val}%</span></div>`;
  const up = () => { const pi = +s.value, real = 10 - pi;
    el.querySelector(".in-pv").textContent = pi + "%";
    el.querySelector(".in-bars").innerHTML = bar("Nominal", 10, "var(--ink)") + bar("Inflation", pi, "var(--gold)") + bar("Real", real, real >= 0 ? "var(--note)" : "var(--wrong)");
    el.querySelector(".in-v").innerHTML = kv("Dollars after one year", "$1,100") + kv("Real gain in buying power", `${real}%`);
    el.querySelector(".in-cap").innerHTML = pi < 0 ? `<b>Deflation:</b> prices fall ${-pi}%, so each dollar buys more. The real rate (${real}%) is <b>bigger</b> than the nominal rate.` :
      real < 0 ? `You have 10% more dollars, but prices rose ${pi}%, so your real return is 10 − ${pi} = <b>${real}%</b>: you lost buying power.` :
      `You have 10% more dollars, but they buy ${pi}% less: real return = 10 − ${pi} = <b>${real}%</b>. ${pi > 0 ? "Under inflation, the nominal rate is bigger than the real rate." : ""}`; };
  s.oninput = up; up();
}

/* ---------- lessons ---------- */
const STEPS = [
 { title:"Macroeconomics and the circular flow", html:`
   <p>${g("Macroeconomics")} (from the Greek <i>makro</i>, “big”) studies the economy as a whole: households, firms and government together. Microeconomics studies individual decisions.</p>
   <h3>Three big questions</h3>
   <div class="stack">
     <div class="info"><b>What determines the standard of living?</b><span>Average income in the U.S. is nearly $200 a day; in parts of Africa it’s around $5.50; the world average is around $40.</span></div>
     <div class="info"><b>What determines the cost of living?</b><span>A BMW X5 costs about $60,000 in the U.S. but $100,000 in South Korea.</span></div>
     <div class="info"><b>Why does the economy fluctuate?</b><span>Booms and recessions.</span></div>
   </div>
   <p>This lecture is about measuring the economy with ${g("Gross domestic product","GDP")}, which measures two things at once: everyone’s total income, and total spending on the economy’s output.</p>
   <div class="fig" data-fig="flow"></div>`,
   check:[
    {id:"c1a", q:"Why can GDP measure both total income and total expenditure?", a:2,
     o:[["Because the government sets them equal","No one sets them equal; it follows from how transactions work."],["Because households never save","Saving doesn’t break the equality for the economy as a whole."],["Because every dollar spent is a dollar of someone’s income","Correct."]],
     hint:"Follow one dollar around the circular flow.", more:"That’s why GDP is a measure of the economy’s income."},
    {id:"c1b", q:"In the market for factors of production, households…", a:0,
     o:[["Sell or rent labor, land and capital to firms","Correct."],["Buy goods and services from firms","That happens in the goods and services market."],["Pay taxes to firms","Firms don’t collect taxes."]],
     hint:"Factors of production are the inputs firms need.", more:"Their wages, rent and profit are households’ income."}
   ]},
 { title:"Measuring GDP", html:`
   <div class="formula" style="font-size:17px">GDP = the market value of all final goods and services produced within a country in a given period of time</div>
   <div class="stack">
     <div class="info"><b>Market value</b><span>Everything is measured in dollars. If an apple costs twice as much as an orange, it counts twice as much. ${g("Non-market activities","Non-market activities")} like housework don’t count.</span></div>
     <div class="info"><b>Final</b><span>Only ${g("Final good","final goods")}, sold to the end user.</span></div>
     <div class="info"><b>Goods and services, newly produced</b><span>A new car counts; a used car doesn’t.</span></div>
     <div class="info"><b>Within a country</b><span>A Canadian working in the U.S. counts in U.S. GDP; an American working in Canada doesn’t.</span></div>
     <div class="info"><b>In a given period</b><span>Usually a quarter (3 months) or a year.</span></div>
   </div>
   <div class="fig" data-fig="ingdp"></div>`,
   check:[
    {id:"c2a", q:"Why doesn’t the sale of a used car count in this year’s GDP?", a:1,
     o:[["Because used cars have no market value","They do have a market price."],["Because it was produced, and counted, in an earlier year","Correct. GDP counts only newly produced goods."],["Because cars are intermediate goods","A car bought by a household is a final good."]],
     hint:"Which word in the definition rules it out?", more:"The dealer’s service in selling it can count, but the car itself doesn’t."},
    {id:"c2b", q:"A U.S. citizen works in Canada. Her income counts in…", a:0,
     o:[["Canada’s GDP","Correct. GDP counts production within the country."],["U.S. GDP","GDP is about where production happens, not citizenship."],["Neither country’s GDP","It’s produced in Canada, so Canada counts it."]],
     hint:"“Within a country.”", more:"And a Canadian working in the U.S. counts in U.S. GDP."}
   ]},
 { title:"The components of GDP", html:`
   <div class="formula">Y = C + I + G + NX</div>
   <div class="stack">
     <div class="info"><b>${g("Consumption (C)","Consumption")}</b><span>Households: durable goods (cars, appliances), nondurables (food), services (haircuts).</span></div>
     <div class="info"><b>${g("Investment (I)","Investment")}</b><span>Firms: capital equipment, structures, inventories. New houses count here too.</span></div>
     <div class="info"><b>${g("Government purchases (G)","Government purchases")}</b><span>Goods and services bought by all levels of government, including employees’ salaries. ${g("Transfer payments","Transfer payments")} such as Social Security <b>don’t</b> count.</span></div>
     <div class="info"><b>${g("Net exports (NX)","Net exports")}</b><span>Exports minus imports.</span></div>
   </div>
   <div class="fig" data-fig="comp"></div>
   <div class="fig" data-fig="inventory"></div>
   <div class="fig" data-fig="nxex"></div>`,
   check:[
    {id:"c3a", q:"A family buys a newly built house. In GDP, this is counted as…", a:1,
     o:[["Consumption","Households buy it, but there’s a special convention for new houses."],["Investment","Correct. By convention, new houses are investment."],["Not counted","It’s newly produced, so it counts."]],
     hint:"Check the investment list in this lesson.", more:"Buying an existing house doesn’t count at all."},
    {id:"c3b", q:"You buy a $100,000 Porsche made in Germany. U.S. GDP…", a:2,
     o:[["Rises by $100,000","Consumption rises, but something else falls."],["Falls by $100,000","Imports subtract, but consumption added the same amount."],["Doesn’t change","Correct. C rises $100,000 and NX falls $100,000."]],
     hint:"Use the Porsche step-through.", more:"Right, because a German firm earned the income."}
   ]},
 { title:"Real vs nominal GDP", html:`
   <p>If GDP rises, either the economy is producing <b>more</b>, or goods are selling at <b>higher prices</b>. We need to separate the two.</p>
   <div class="stack">
     <div class="info"><b>${g("Nominal GDP","Nominal GDP")}</b><span>This year’s output at this year’s prices.</span></div>
     <div class="info"><b>${g("Real GDP","Real GDP")}</b><span>This year’s output at <b>base-year</b> prices. Corrects for inflation.</span></div>
   </div>
   <div class="formula">${g("GDP deflator","GDP deflator")} = (nominal GDP ÷ real GDP) × 100</div>
   <div class="fig" data-fig="realgdp"></div>
   <div class="fig" data-fig="whatif"></div>`,
   check:[
    {id:"c4a", q:"Prices of all goods rise 5%, but quantities don’t change. Real GDP…", a:2,
     o:[["Rises 5%","Real GDP uses base-year prices. Did quantities change?"],["Falls 5%","Nothing real got smaller."],["Doesn’t change","Correct. Only nominal GDP and the deflator rise."]],
     hint:"Try the ‘Prices rise’ tab.", more:"The deflator rises 5%: that’s the inflation rate."},
    {id:"c4b", q:"Nominal GDP is $8,250 and real GDP is $7,200. The GDP deflator is about…", a:0,
     o:[["114.6","Correct. 8,250 ÷ 7,200 × 100."],["87.3","That’s real ÷ nominal. Nominal goes on top."],["1,050","That’s the difference, not the ratio."]],
     hint:"(Nominal ÷ real) × 100.", more:"Prices are about 14.6% above the base year."}
   ]},
 { title:"The consumer price index", html:`
   <p>The ${g("Consumer price index","CPI")}, computed by the Bureau of Labor Statistics, measures the cost of the goods and services a typical consumer buys.</p>
   <div class="stack">
     <div class="info"><b>1. Fix the basket</b><span>Survey consumers to find what they buy.</span></div>
     <div class="info"><b>2. Find the prices</b><span>Record each good’s price each year.</span></div>
     <div class="info"><b>3. Cost the basket</b><span>Price × quantity, summed, each year.</span></div>
     <div class="info"><b>4. Compute the index</b><span>CPI = (cost this year ÷ cost in the base year) × 100.</span></div>
   </div>
   <div class="formula">${g("Inflation rate","Inflation rate")} = (CPI this year − CPI last year) ÷ CPI last year × 100</div>
   <div class="fig" data-fig="cpi"></div>`,
   check:[
    {id:"c5a", q:"The basket costs $12 in the base year and $18 this year. The CPI this year is…", a:1,
     o:[["18","That’s the cost, not the index."],["150","Correct. 18 ÷ 12 × 100."],["50","That’s the percentage increase, not the index level."]],
     hint:"(Cost this year ÷ cost in base year) × 100.", more:"The base year’s CPI is always 100."},
    {id:"c5b", q:"The CPI goes from 150 to 200. The inflation rate is…", a:2,
     o:[["50%","That divides by the base-year 100. Divide by last year’s CPI."],["25%","That divides by 200; use the earlier year."],["33.3%","Correct. (200 − 150) ÷ 150 × 100."]],
     hint:"Divide the change by last year’s CPI.", more:"Percent changes always use the starting value."}
   ]},
 { title:"Comparing dollars from different years", html:`
   <p>In 1931, player A earned $80,000. In 2007, player B earned $28 million. Who was really paid more?</p>
   <div class="derive">Baskets A could buy = $80,000 ÷ cost of a basket in 1931<br>Cost of those baskets in 2007 = cost of a basket in 2007 × that number<br>Which simplifies to:<br><b>Value in today’s dollars = value then × (CPI today ÷ CPI then)</b></div>
   <div class="fig" data-fig="salary"></div>
   ${tn("CPI 1931 = 15.2 and CPI 2007 = 207.","The CPI has kept rising since 2007, so these salaries would be worth even more in today’s dollars. Use the same formula with the latest CPI from bls.gov.")}`,
   check:[
    {id:"c6a", q:"To convert a 1931 salary into 2007 dollars, you multiply it by…", a:0,
     o:[["CPI 2007 ÷ CPI 1931","Correct."],["CPI 1931 ÷ CPI 2007","That would shrink it. Prices were lower in 1931."],["CPI 2007 − CPI 1931","Use a ratio, not a difference."]],
     hint:"Prices rose, so the converted number should be bigger.", more:"$80,000 × (207 ÷ 15.2) ≈ $1.09 million."},
    {id:"c6b", q:"After adjusting for inflation, how did President Hoover’s 1931 salary compare with President Bush’s 2007 salary of $400,000?", a:2,
     o:[["It was smaller","Convert $75,000 with the CPI ratio first."],["About the same","Check the conversion: 75,000 × 207 ÷ 15.2."],["More than twice as large","Correct. About $1.02 million in 2007 dollars."]],
     hint:"Try the Hoover button.", more:"Inflation adjustment can flip intuitions."}
   ]},
 { title:"Indexation and real interest rates", html:`
   <p>${g("Indexation")}: the automatic correction of a dollar amount for inflation, by law or contract. For example, Social Security benefits rise each year with the CPI.</p>
   <p>Interest rates need correcting too, because loans and deposits involve dollars at different times.</p>
   <div class="formula">${g("Real interest rate","Real interest rate")} = nominal interest rate − inflation rate</div>
   <div class="fig" data-fig="interest"></div>
   <div class="stack">
     <div class="info"><b>Under inflation</b><span>The nominal rate is bigger than the real rate: dollars lose value over time.</span></div>
     <div class="info"><b>Under deflation</b><span>The real rate is bigger than the nominal rate: dollars gain value over time.</span></div>
   </div>`,
   check:[
    {id:"c7a", q:"Your account pays 10%, and inflation turns out to be 12%. Your real interest rate is…", a:1,
     o:[["22%","That adds them. The real rate subtracts inflation."],["−2%","Correct. 10 − 12 = −2. You lose buying power."],["2%","Check the order: nominal minus inflation."]],
     hint:"Real = nominal − inflation. Can it be negative?", more:"Real rates can be negative."},
    {id:"c7b", q:"During deflation, which is bigger?", a:0,
     o:[["The real interest rate","Correct. Falling prices make each dollar worth more."],["The nominal interest rate","That’s true during inflation."],["They’re always equal","Only when inflation is exactly zero."]],
     hint:"Try a negative inflation rate on the slider.", more:"Real = nominal − (negative inflation) = bigger."}
   ]}
];
const FIGS = { flow:figFlow, ingdp:figInGDP, comp:figComp, inventory:figInventory, nxex:figNXex, realgdp:figRealGDP, whatif:figWhatIf, cpi:figCPI, salary:figSalary, interest:figInterest };

/* ---------- self-check ---------- */
const QUIZ = [
 {id:"q1", L:0, q:"Macroeconomics studies…", a:2, hint:"Makro = big.", o:[["Individual firms’ pricing decisions","That’s microeconomics."],["A single household’s budget","That’s microeconomics."],["The economy as a whole","Right."],["Only government","It covers households, firms and government together."]], more:"Aggregates like GDP, inflation and unemployment."},
 {id:"q2", L:0, q:"For the economy as a whole, income…", a:1, hint:"Every transaction has a buyer and a seller.", o:[["Is greater than expenditure","Every dollar spent is someone’s income."],["Equals expenditure","Right."],["Is less than expenditure","Same reasoning."],["Has no link to expenditure","They’re two sides of every transaction."]], more:"That’s why GDP measures both."},
 {id:"q3", L:1, q:"Which is included in GDP?", a:0, hint:"New, final, market, produced here.", o:[["A new haircut service","Right."],["A used textbook resold online","Not newly produced."],["Unpaid housework","Non-market activity."],["Social Security payments","A transfer payment."]], more:"Services count at their market value."},
 {id:"q4", L:1, q:"GDP counts only final goods to avoid…", a:3, hint:"What if steel and the car were both counted?", o:[["Counting services","Services are counted."],["Counting imports","Imports are handled through NX."],["Measuring inflation","Not the reason."],["Double counting","Right."]], more:"The steel’s value is already inside the car’s price."},
 {id:"q5", L:1, q:"A Canadian citizen works in the U.S. Her output is counted in…", a:1, hint:"Within a country.", o:[["Canada’s GDP","GDP is about location."],["U.S. GDP","Right."],["Both","It’s counted once, where it happens."],["Neither","It’s produced in the U.S."]], more:"Citizenship doesn’t matter for GDP."},
 {id:"q6", L:2, q:"GDP equals…", a:2, hint:"Four components.", o:[["C + I + G","Missing net exports."],["C + I + G + imports","Imports are subtracted, not added."],["C + I + G + NX","Right."],["C + S + T","That’s not the expenditure identity."]], more:"Y = C + I + G + NX."},
 {id:"q7", L:2, q:"Which is counted as investment?", a:0, hint:"Capital, structures, inventories, new houses.", o:[["A newly built house","Right."],["Buying shares of stock","That’s a financial investment, not GDP investment."],["Groceries","That’s consumption."],["A government salary","That’s G."]], more:"GDP ‘investment’ means new capital goods."},
 {id:"q8", L:2, q:"Ford builds a car in 2009 that sells in 2010. In 2010…", a:3, hint:"Inventories fall as C rises.", o:[["GDP rises by the car’s value","It was counted in 2009."],["Investment rises","Inventory is used up, so I falls."],["Consumption falls","Consumption rises when it’s bought."],["C rises, I falls, GDP is unchanged","Right."]], more:"Goods count when produced, not when sold."},
 {id:"q9", L:2, q:"Social Security payments are…", a:1, hint:"Does the government buy anything?", o:[["Government purchases in GDP","They don’t buy goods or services."],["Transfer payments, not counted in GDP","Right."],["Consumption","When recipients spend them, that spending is C, but the payment itself isn’t GDP."],["Investment","Not capital goods."]], more:"Only spending on goods and services counts."},
 {id:"q10", L:2, q:"Why are imports subtracted in GDP?", a:2, hint:"The Porsche example.", o:[["Because imports are bad","It’s accounting, not judgment."],["To measure inflation","Not related."],["Because their value was already counted in C, I or G but produced abroad","Right."],["Because the government taxes them","Not the reason."]], more:"So GDP counts only domestic production."},
 {id:"q11", L:3, q:"Real GDP values output at…", a:0, hint:"Real = corrected for inflation.", o:[["Base-year prices","Right."],["Current prices","That’s nominal GDP."],["Future prices","Not used."],["World prices","Not used."]], more:"So only quantity changes move it."},
 {id:"q12", L:3, q:"The GDP deflator equals…", a:2, hint:"Ratio of nominal to real.", o:[["Real ÷ nominal × 100","Upside down."],["Nominal − real","It’s a ratio."],["Nominal ÷ real × 100","Right."],["CPI ÷ 100","Different index."]], more:"Its percent change is the inflation rate."},
 {id:"q13", L:3, q:"Quantities rise 10% and prices are unchanged. The GDP deflator…", a:3, hint:"Nominal and real both rise 10%.", o:[["Rises 10%","Only if prices rose."],["Falls 10%","Prices didn’t fall."],["Rises 20%","No."],["Doesn’t change","Right."]], more:"The deflator only moves with prices."},
 {id:"q14", L:4, q:"The CPI is computed by…", a:1, hint:"A Department of Labor agency.", o:[["The Federal Reserve","The Fed uses it but doesn’t compute it."],["The Bureau of Labor Statistics","Right."],["The Treasury","No."],["Congress","No."]], more:"It tracks a typical consumer’s basket."},
 {id:"q15", L:4, q:"In the base year, the CPI equals…", a:0, hint:"Cost ÷ itself × 100.", o:[["100","Right."],["0","Ratio of a number to itself is 1, times 100."],["1","Multiply by 100."],["The cost of the basket","That’s dollars, not the index."]], more:"Other years are measured relative to it."},
 {id:"q16", L:4, q:"The CPI rises from 200 to 210. Inflation is…", a:2, hint:"(210 − 200) ÷ 200.", o:[["10%","That divides by 100."],["4.8%","That divides by 210."],["5%","Right."],["210%","That’s the index level."]], more:"Always divide by the earlier year."},
 {id:"q17", L:5, q:"$1,000 in a year when CPI was 50 is worth how much when CPI is 250?", a:1, hint:"× (250 ÷ 50).", o:[["$200","That divides the wrong way."],["$5,000","Right."],["$1,200","Use a ratio, not adding the difference."],["$1,000","Prices rose fivefold."]], more:"Value now = value then × (CPI now ÷ CPI then)."},
 {id:"q18", L:6, q:"Indexation means…", a:3, hint:"Automatic adjustment.", o:[["Ranking countries by GDP","Not this."],["Building a CPI basket","That’s CPI construction."],["Subtracting imports","That’s NX."],["Automatically adjusting a dollar amount for inflation","Right."]], more:"Social Security is indexed to the CPI."},
 {id:"q19", L:6, q:"Nominal rate 6%, inflation 2%. The real rate is…", a:0, hint:"Nominal − inflation.", o:[["4%","Right."],["8%","That adds."],["3%","That divides."],["−4%","Check the order."]], more:"Your buying power grows 4%."},
 {id:"q20", L:6, q:"Under inflation, which is bigger?", a:1, hint:"Real = nominal − inflation, with inflation positive.", o:[["The real interest rate","Subtracting positive inflation makes it smaller."],["The nominal interest rate","Right."],["They’re equal","Only with zero inflation."],["It depends on GDP","It depends only on inflation."]], more:"Under deflation it’s the reverse."}
];
const ROUNDS = [["Round 1","GDP and what it counts",0],["Round 2","The components of GDP",5],["Round 3","Real GDP, deflator, CPI",10],["Round 4","CPI and inflation adjustments",15],["Mixed round","5 random questions",-1],["My weak spots","Questions you’ve missed before, mixed up",-2],["Number drills","Deflator, inflation, conversions and real rates with new numbers",-3]];
function genDrill(){
  const pick = a => a[Math.floor(Math.random()*a.length)];
  const kind = Math.floor(Math.random()*4); let q, o, L, hint;
  if (kind === 0){ const real = pick([400,500,800,1000]), d = pick([105,110,120,125,150]), nom = real*d/100;
    q = `Nominal GDP is $${nom.toLocaleString("en-US")} billion and real GDP is $${real} billion. What is the GDP deflator?`; L = 3; hint = "(Nominal ÷ real) × 100.";
    o = [[String(d),`Right. ${nom} ÷ ${real} × 100.`],[String(+(real/nom*100).toFixed(1)),"That’s real ÷ nominal. Nominal goes on top."],[String(nom-real),"That’s the difference, not the ratio."],[String(+(nom/real).toFixed(2)),"Don’t forget × 100."]]; }
  else if (kind === 1){ const c0 = pick([100,120,150,200,250]), r = pick([2,4,5,10,20]), c1 = +(c0*(1+r/100)).toFixed(1);
    q = `The CPI rises from ${c0} to ${c1}. What is the inflation rate?`; L = 4; hint = "(new − old) ÷ old × 100.";
    o = [[r + "%",`Right. (${c1} − ${c0}) ÷ ${c0} × 100.`],[+((c1-c0)/c1*100).toFixed(1) + "%","That divides by the new CPI; use the old one."],[+(c1-c0).toFixed(1) + "%","That’s the point change. Divide by the starting CPI."],[+(c1/c0*100).toFixed(1) + "%","That’s the ratio, not the percent change."]]; }
  else if (kind === 2){ const v = pick([1000,5000,20000,50000]), c0 = pick([20,25,40,50]), c1 = pick([100,150,200,250]); const out = v*c1/c0;
    q = `$${v.toLocaleString("en-US")} when the CPI was ${c0} is worth how much when the CPI is ${c1}?`; L = 5; hint = "Value now = value then × (CPI now ÷ CPI then).";
    o = [[money(out),`Right. $${v.toLocaleString("en-US")} × (${c1} ÷ ${c0}).`],[money(v*c0/c1),"That ratio is upside down. Prices rose, so the value should grow."],[money(v + (c1-c0)),"Use a ratio of CPIs, not their difference."],[money(v),"Prices changed, so the value in today’s dollars changes."]]; }
  else { const n = pick([3,5,6,8,10]), pi = pick([1,2,4,6,9,12]); const r = n - pi;
    q = `A deposit pays ${n}% and inflation is ${pi}%. What is the real interest rate?`; L = 6; hint = "Real = nominal − inflation.";
    o = [[r + "%",`Right. ${n} − ${pi} = ${r}%.`],[(n+pi) + "%","That adds inflation; subtract it."],[(pi-n) + "%","Check the order: nominal minus inflation."],[+(n/pi).toFixed(2) + "%","No division: subtract."]]; }
  const seen = new Set(); o = o.filter(x => !seen.has(x[0]) && seen.add(x[0]));
  return {id:"gen", gen:true, L, q, o, a:0, hint, more:"New numbers every round."};
}

/* ---------- short answers ---------- */
const WRITE = [
 {q:"Define GDP and explain why it measures both total income and total expenditure.",
  keys:[["Market value",/market value/i],["Final goods and services",/final/i],["Within a country, in a period",/within|country|period|year|quarter/i],["Every dollar spent is someone’s income",/(spen|expenditure).{0,60}income|income.{0,60}(equal|=).{0,20}expenditure/i]],
  model:"GDP is the market value of all final goods and services produced within a country in a given period of time. It measures both total income and total expenditure because, for the economy as a whole, every dollar spent by a buyer is a dollar of income for a seller, so income must equal expenditure."},
 {q:"Using examples, explain three things that are NOT counted in GDP, and why.",
  keys:[["Used goods (not newly produced)",/used|second.?hand|resale/i],["Non-market activities (housework, childcare)",/housework|childcare|non.?market|unpaid/i],["Intermediate goods (double counting)",/intermediate|double/i],["Transfer payments or production abroad",/transfer|social security|abroad|another country|canada/i]],
  model:"Used goods, such as a used car, aren’t counted because they were produced and counted in an earlier year. Non-market activities like housework and childcare aren’t counted because they have no market price. Intermediate goods, such as steel sold to Ford, aren’t counted separately because their value is already included in the final good, so counting them would double count. Transfer payments like Social Security also aren’t counted, since no good or service is produced in exchange."},
 {q:"List the four components of GDP and give an example of each. Where does a newly built house go?",
  keys:[["Consumption + example",/consum/i],["Investment + example",/invest/i],["Government purchases + example",/government/i],["Net exports + example",/net export|export/i],["New house is investment",/(new|newly).{0,20}(house|home).{0,40}invest|invest.{0,60}(house|home)/i]],
  model:"GDP = C + I + G + NX. Consumption is household spending on goods and services, like groceries or a haircut. Investment is spending on capital equipment, structures and inventories, like a new factory. Government purchases are spending by federal, state and local governments on goods and services, including workers’ salaries, like police salaries. Net exports are exports minus imports, like Boeing selling planes abroad. By convention, a newly built house counts as investment."},
 {q:"Explain why buying an imported Porsche doesn’t change U.S. GDP, but selling Boeing planes abroad raises it.",
  keys:[["Porsche raises consumption",/consum.{0,40}(rise|increas|up)/i],["Import lowers net exports by the same amount",/import.{0,60}(subtract|lower|reduc|fall|net export)/i],["GDP unchanged; income earned abroad",/unchanged|no change|doesn.t change|german/i],["Boeing export raises NX and GDP",/export.{0,60}(rais|increas|add)|boeing/i]],
  model:"When you buy a $100,000 Porsche, U.S. consumption rises by $100,000, but it’s an import, so net exports fall by $100,000 and U.S. GDP is unchanged. That’s correct, because the income was earned by a German firm. When Boeing sells $100 million of planes to British Airways, U.S. exports and net exports rise by $100 million, so U.S. GDP rises, because a U.S. firm earned that income."},
 {q:"Distinguish real GDP from nominal GDP, define the GDP deflator, and explain what happens to each if all prices rise but quantities stay the same.",
  keys:[["Nominal uses current prices",/nominal.{0,60}current/i],["Real uses base-year (constant) prices",/real.{0,60}(base|constant)/i],["Deflator = nominal ÷ real × 100",/nominal\s?(÷|\/|divided by)\s?real/i],["Prices rise: nominal and deflator up, real unchanged",/real.{0,30}(unchanged|same|not change|doesn.t change)/i]],
  model:"Nominal GDP values this year’s output at current prices, while real GDP values it at constant base-year prices, correcting for inflation. The GDP deflator equals nominal GDP divided by real GDP, times 100. If all prices rise but quantities stay the same, nominal GDP rises, real GDP is unchanged, and the GDP deflator rises; the percentage rise in the deflator is the inflation rate."},
 {q:"Describe how the CPI is computed and how to calculate the inflation rate from it.",
  keys:[["Fix a basket from consumer surveys",/basket|survey/i],["Record prices and cost the basket each year",/price|cost/i],["CPI = cost this year ÷ base-year cost × 100",/base.?year/i],["Inflation = (CPI now − CPI before) ÷ CPI before × 100",/(cpi|index).{0,40}(−|-|minus).{0,40}(÷|\/|divided)/i]],
  model:"The Bureau of Labor Statistics surveys consumers to fix a basket of goods, records the price of each good each year, and computes the cost of the basket each year. Choosing a base year, the CPI equals the cost of the basket in the current year divided by its cost in the base year, times 100. The inflation rate equals the CPI this year minus the CPI last year, divided by the CPI last year, times 100."},
 {q:"Using the lecture’s numbers, was President Hoover’s 1931 salary of $75,000 larger or smaller than President Bush’s 2007 salary of $400,000 after adjusting for inflation? Show your work.",
  keys:[["Formula: value × (CPI 2007 ÷ CPI 1931)",/cpi.{0,30}(÷|\/|divided).{0,30}cpi|207\s?(÷|\/)\s?15\.2/i],["Uses 207 and 15.2",/207.{0,40}15\.2|15\.2.{0,40}207/],["About $1.02 million",/1[.,]0[0-9]|1,021|1\.02/],["Larger: more than twice",/larger|bigger|more than|twice|greater/i]],
  model:"Value in 2007 dollars = value in 1931 dollars × (CPI 2007 ÷ CPI 1931) = $75,000 × (207 ÷ 15.2) ≈ $1,021,382. So after adjusting for inflation, Hoover’s salary was larger, more than twice President Bush’s 2007 salary of $400,000."},
 {q:"Explain the difference between nominal and real interest rates with an example, including what happens under deflation.",
  keys:[["Real = nominal − inflation",/real.{0,40}(=|equals).{0,20}nominal.{0,20}(−|-|minus)/i],["Numerical example",/\d+\s?%/],["Real can be negative",/negative/i],["Under deflation, real > nominal",/deflation/i]],
  model:"The nominal interest rate is not corrected for inflation, while the real interest rate is: real rate = nominal rate − inflation rate. If you deposit $1,000 at 10% and inflation is 3%, you have 10% more dollars but each buys 3% less, so your real return is 7%. If inflation were 12%, the real rate would be −2%. Under inflation, the nominal rate is bigger than the real rate; under deflation, the real rate is bigger, because dollars gain value over time."}
];
const WTAG = [1,1,2,2,3,4,5,6];
