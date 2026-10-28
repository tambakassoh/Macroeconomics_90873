/* Lecture 7: Money Growth and Inflation — lab content (loaded after assets/lab.js) */

/* ---------- terms ---------- */
const CARDS = [
 ["Inflation","An increase in the overall level of prices, measured by the CPI or the GDP deflator.","An ice cream cone cost 5 cents in 1931 and costs several dollars today."],
 ["Deflation","A decrease in the overall level of prices.","Common in the 19th century; a threat again in the 2008–2009 recession."],
 ["Hyperinflation","Extremely high inflation.","A German newspaper rose from 0.3 marks to 70,000,000 marks in under two years."],
 ["Price level","P: the number of dollars needed to buy a basket of goods and services.","If the basket costs $50, P = 50 dollars per basket."],
 ["Value of money","1/P: the number of baskets of goods one dollar buys. When P rises, the value of money falls.","If P doubles, each dollar buys half as much."],
 ["Quantity theory of money","The theory that the quantity of money determines the price level, and the growth rate of money determines the inflation rate.","Traced back to David Hume; later championed by Milton Friedman."],
 ["Money demand","How much wealth people want to hold as money. It slopes downward against the value of money.","When prices are high (1/P low), people need more dollars to buy the same things."],
 ["Money supply","The quantity of money, set by the Fed and the banking system. Drawn as a vertical line.","It doesn’t depend on the value of money."],
 ["Monetary equilibrium","The value of money (and price level) where money supply equals money demand.","Where the vertical supply line crosses the demand curve."],
 ["Monetary injection","An increase in the money supply, for example through open-market purchases.","The supply line shifts right; the value of money falls; P rises."],
 ["Nominal variables","Variables measured in units of money.","Nominal GDP, the CPI, your $20-an-hour wage."],
 ["Real variables","Variables measured in physical units, corrected for inflation.","Real GDP, the unemployment rate, the real wage."],
 ["Classical dichotomy","The idea of separating economic variables into nominal and real groups.","Proposed by David Hume and his contemporaries."],
 ["Monetary neutrality","The idea that changes in the money supply don’t affect real variables.","Doubling money doubles prices but leaves output unchanged, in the long run."],
 ["Velocity of money","How many times each dollar is spent in a year: V = (P × Y) ÷ M.","Pizza economy: $1,000 of spending with $50 of money means V = 20."],
 ["Quantity equation","M × V = P × Y: money times velocity equals nominal GDP.","With V and Y fixed, raising M raises P."],
 ["Inflation tax","The revenue a government raises by creating money. It works like a tax on everyone who holds money.","Common during and after wars."],
 ["Nominal interest rate","The interest rate as usually reported, not corrected for inflation.","A bank pays 7% a year."],
 ["Real interest rate","The interest rate corrected for inflation: nominal rate − inflation rate.","7% nominal with 3% inflation is a 4% real rate."],
 ["Fisher effect","The one-for-one rise in the nominal interest rate when inflation rises, leaving the real rate unchanged.","Named after economist Irving Fisher."],
 ["Shoe-leather costs","The resources wasted when inflation pushes people to hold less money, like extra trips to the bank.","In Bolivia’s 1985 hyperinflation, people spent their pay immediately."],
 ["Menu costs","The costs of changing prices.","A restaurant printing new menus."],
 ["Relative-price variability","When prices change only now and then, inflation makes relative prices drift, misleading buyers and sellers.","A restaurant’s prices look high in January and cheap by December."],
 ["Inflation-induced tax distortions","Taxes on nominal income rise with inflation, lowering the after-tax real return to saving.","With 8% inflation, a saver’s after-tax real return falls from 3% to 1%."],
 ["Arbitrary redistribution of wealth","Unexpected inflation moves wealth between borrowers and lenders.","Lower-than-expected inflation helps the bank; higher helps the borrower."]
];
const CNOTE = {
 "Inflation":"🕒 Today: the Fed targets 2% inflation a year. U.S. inflation passed 9% in mid-2022 before falling back.",
 "Monetary neutrality":"📘 Long-run classical model. Most economists accept it in the long run; in the short run, money can affect output.",
 "Velocity of money":"🕒 Today: velocity has been less stable in recent decades than in the lecture’s chart.",
 "Quantity theory of money":"📘 Long-run classical model. It explains inflation over years, not month to month."
};

/* ---------- textbook-model labels on questions ---------- */
const TB = new Set(["c3a","c3b","c4b","c5a","c5b","q8","q9","q10","q11","q12"]);
const TODAY = {
 c5a:"velocity has moved around more since 2008 than in the lecture’s chart, but the long-run link between money growth and inflation still holds.",
 q11:"velocity has moved around more since 2008 than in the lecture’s chart, but the long-run link between money growth and inflation still holds."
};

/* ---------- shared money-market chart ---------- */
// Demand: value of money v = 40 / M (so doubling M halves v and doubles P).
const MMx = M => 50 + M*2.7, MMy = v => 220 - v*95;
function mmSVG(o){
  const pts = []; for (let M = 20; M <= 100; M += 2) pts.push(`${MMx(M).toFixed(1)},${MMy(40/M).toFixed(1)}`);
  const ms = (o.ms || []).map(s => `<line x1="${MMx(s.M)}" y1="${MMy(2.1)}" x2="${MMx(s.M)}" y2="220" style="stroke:${s.color || "var(--note)"};stroke-width:3${s.dash ? ";stroke-dasharray:6 5" : ""}"/><text x="${MMx(s.M)+4}" y="${MMy(2.1)+12}" class="sm" style="font-weight:700">${s.label}</text>`).join("");
  const line = o.v ? `<line x1="50" y1="${MMy(o.v)}" x2="320" y2="${MMy(o.v)}" style="stroke:var(--gold);stroke-width:2;stroke-dasharray:4 4"/>` : "";
  const gap = o.gap ? `<line x1="${MMx(o.gap[0])}" y1="${MMy(o.v)-8}" x2="${MMx(o.gap[1])}" y2="${MMy(o.v)-8}" style="stroke:var(--wrong);stroke-width:2.5" marker-start="url(#mmA)" marker-end="url(#mmA)"/><text x="${(MMx(o.gap[0])+MMx(o.gap[1]))/2}" y="${MMy(o.v)-16}" text-anchor="middle" class="sm halo" style="font-weight:700;fill:var(--wrong)">${o.gapLabel}</text>` : "";
  const dots = (o.dots || []).map(d => `<circle cx="${MMx(d.M)}" cy="${MMy(40/d.M)}" r="6" style="fill:var(--gold);stroke:var(--surface);stroke-width:2"/><text x="${MMx(d.M)+9}" y="${MMy(40/d.M)+18}" class="sm halo" style="font-weight:700">${d.label}</text>`).join("");
  const arrow = o.slide ? `<path d="M${MMx(o.slide[0])} ${MMy(40/o.slide[0])} Q ${MMx((o.slide[0]+o.slide[1])/2)+6} ${MMy(40/((o.slide[0]+o.slide[1])/2))+10} ${MMx(o.slide[1])} ${MMy(40/o.slide[1])}" style="stroke:var(--wrong);stroke-width:2.5;fill:none" marker-end="url(#mmA)"/>` : "";
  return `<svg class="chart" viewBox="0 0 340 262" role="img" aria-label="${o.aria}">
    <defs><marker id="mmA" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" style="fill:var(--wrong)"/></marker></defs>
    <line x1="50" y1="14" x2="50" y2="220" style="stroke:var(--ink);stroke-width:1.5"/><line x1="50" y1="220" x2="325" y2="220" style="stroke:var(--ink);stroke-width:1.5"/>
    <line x1="325" y1="14" x2="325" y2="220" style="stroke:var(--border);stroke-width:1"/>
    <text x="8" y="14" class="sm" style="font-weight:700">1/P</text><text x="8" y="30" class="sm mute">high</text><text x="8" y="216" class="sm mute">low</text>
    <text x="300" y="14" class="sm" style="font-weight:700">P</text><text x="290" y="30" class="sm mute">low</text>
    <text x="38" y="${MMy(1)+4}" text-anchor="end" class="sm">1</text><text x="38" y="${MMy(0.5)+4}" text-anchor="end" class="sm">½</text>
    <text x="330" y="${MMy(1)+4}" class="sm">1</text><text x="330" y="${MMy(0.5)+4}" class="sm">2</text>
    <text x="185" y="248" text-anchor="middle" class="sm" style="font-weight:700">Quantity of money</text>
    <polyline points="${pts.join(" ")}" style="fill:none;stroke:var(--gold);stroke-width:3"/>
    <text x="${MMx(23)+10}" y="${MMy(40/23)+4}" class="sm halo" style="font-weight:700;fill:var(--gold)">Money demand</text>
    ${line}${ms}${gap}${arrow}${dots}
  </svg>`;
}

/* ---------- graphics ---------- */
function figValue(el){
  el.innerHTML = `<div class="figt">What is a dollar worth?</div><p class="figsub">Slide the price of a basket of groceries. You have $100.</p>
    <label for="pv-s" style="display:flex;justify-content:space-between"><span>Price of one basket (P)</span><b class="pv-p"></b></label>
    <input type="range" id="pv-s" min="10" max="100" step="10" value="20">
    <div class="pv-bask" style="font-size:28px;line-height:1.3;margin:8px 0;min-height:44px" aria-hidden="true"></div>
    <div class="eq"><span>$100 buys <b class="pv-n"></b> baskets</span><span>$1 buys <b class="pv-v"></b> of a basket (1/P)</span></div>
    <p class="cap pv-cap" aria-live="polite"></p>`;
  const s = el.querySelector("#pv-s");
  const up = () => {
    const P = +s.value, n = 100/P, v = 1/P;
    el.querySelector(".pv-p").textContent = $$(P);
    el.querySelector(".pv-n").textContent = +n.toFixed(2);
    el.querySelector(".pv-v").textContent = +v.toFixed(3);
    el.querySelector(".pv-bask").textContent = "🧺".repeat(Math.floor(n)) + (n % 1 >= 0.5 ? "◐" : "");
    el.querySelector(".pv-cap").innerHTML = P === 20 ? "At $20 a basket, your $100 buys 5 baskets. Raise the price and watch your money buy less." :
      `At ${$$(P)} a basket, the same $100 buys only ${+n.toFixed(2)}. Prices went up, so <b>the value of money (1/P) went down</b>. That is what inflation means.`;
  };
  s.oninput = up; up();
}

function figMM(el){
  const ST = {
    hi:{v:1.4, gap:[40/1.4,40], label:"Excess supply", cap:"Here the value of money is <b>too high</b> (prices too low). People want to hold only ~29 units of money, but there are 40. With extra money, they spend it, pushing prices <b>up</b> and the value of money <b>down</b>."},
    eq:{v:1, cap:"<b>Equilibrium.</b> At this value of money, people want to hold exactly the 40 units the Fed supplies. Nothing pushes prices up or down."},
    lo:{v:0.7, gap:[40,40/0.7], label:"Excess demand", cap:"Here the value of money is <b>too low</b> (prices too high). People want ~57 units of money to buy things at these prices, but only 40 exist. They spend less, so prices fall and the value of money rises."}
  };
  el.innerHTML = `<div class="figt">The market for money</div><p class="figsub">Left axis: value of money (1/P). Right axis: price level (P), which runs the opposite way.</p>
    <div class="rchips"><button type="button" class="chipbtn" data-k="hi" aria-pressed="false">Value too high</button><button type="button" class="chipbtn" data-k="eq" aria-pressed="true">Equilibrium</button><button type="button" class="chipbtn" data-k="lo" aria-pressed="false">Value too low</button></div>
    <div class="mm-c"></div><p class="cap mm-cap" aria-live="polite"></p>`;
  const draw = k => {
    const s = ST[k];
    el.querySelector(".mm-c").innerHTML = mmSVG({aria:"Money supply and money demand diagram", ms:[{M:40,label:"MS"}], v:s.v, gap:s.gap, gapLabel:s.label, dots: k === "eq" ? [{M:40,label:"A"}] : []});
    el.querySelector(".mm-cap").innerHTML = s.cap;
  };
  el.querySelectorAll(".chipbtn").forEach(b => b.onclick = () => { el.querySelectorAll(".chipbtn").forEach(x => x.setAttribute("aria-pressed", x === b)); draw(b.dataset.k); });
  draw("eq");
}

function figInject(el){
  const ST = [
    {o:{ms:[{M:40,label:"MS₁"}], dots:[{M:40,label:"A"}]}, cap:"Start at equilibrium A. Money supply is 40, the value of money is 1, and the price level P is 1."},
    {o:{ms:[{M:40,label:"MS₁",dash:true,color:"var(--border)"},{M:80,label:"MS₂"}], v:1, gap:[40,80], gapLabel:"Excess supply", dots:[{M:40,label:"A"}]}, cap:"The Fed <b>doubles</b> the money supply to 80. At the old prices, people now hold more money than they want: an <b>excess supply</b> of money."},
    {o:{ms:[{M:40,label:"MS₁",dash:true,color:"var(--border)"},{M:80,label:"MS₂"}], slide:[40,76], dots:[{M:40,label:"A"}]}, cap:"People spend the extra money, or deposit it and banks lend it out. More spending on the same goods pushes <b>prices up</b>, so the value of money slides <b>down</b> the demand curve."},
    {o:{ms:[{M:40,label:"MS₁",dash:true,color:"var(--border)"},{M:80,label:"MS₂"}], dots:[{M:40,label:"A"},{M:80,label:"B"}]}, cap:"New equilibrium B: the value of money fell from 1 to ½, so the <b>price level doubled</b> from 1 to 2. Twice the money, twice the prices: the <b>quantity theory of money</b>."}
  ];
  stepper(el, {title:'<span class="modeltag">📘 Textbook model, as in the lecture</span><br>What happens when the Fed adds money', sub:"Tap Next to watch the adjustment.", n:() => ST.length, draw:(i, st) => {
    st.innerHTML = mmSVG(Object.assign({aria:"Money market after a monetary injection, step " + (i+1)}, ST[i].o));
    return ST[i].cap;
  }});
}

function figSortNR(el){
  const IT = [
    ["Nominal GDP","n","Measured in dollars: the dollar value of everything produced."],
    ["Real GDP","r","Corrected for inflation: the amount of goods and services produced."],
    ["The CPI","n","It counts how many dollars a basket costs."],
    ["The unemployment rate","r","A percentage of people, not dollars."],
    ["Your wage: $20 an hour","n","Measured in dollars."],
    ["Your real wage: what $20 an hour can buy","r","Measured in goods, corrected for prices."],
    ["The nominal interest rate on a loan","n","Not corrected for inflation."],
    ["The real interest rate","r","Corrected for inflation: nominal minus inflation."]
  ];
  let k = 0, right = 0, first = true;
  el.innerHTML = `<div class="figt">Sort it: nominal or real?</div><p class="figsub">Nominal = measured in dollars. Real = measured in goods or people.</p><div class="sbody"></div>`;
  const body = el.querySelector(".sbody");
  const draw = () => {
    if (k >= IT.length){ body.innerHTML = `<div class="scen pop"><b>${right} of ${IT.length}</b> on the first try.<br><span class="small muted">Ask: is it counted in dollars (nominal), or in things and people (real)?</span></div><button class="btn ghost" type="button">Sort again</button>`; body.querySelector("button").onclick = () => { k = 0; right = 0; draw(); }; return; }
    first = true;
    body.innerHTML = `<div class="tally"><span>Item ${k+1} of ${IT.length}</span><span>${right} right</span></div><div class="scen pop">${IT[k][0]}</div>
      <div class="choices" style="grid-template-columns:1fr 1fr"><button type="button" class="choice" data-z="n">Nominal ($)</button><button type="button" class="choice" data-z="r">Real (goods)</button></div><div class="fb"></div>`;
    body.querySelectorAll(".choice").forEach(b => b.onclick = () => {
      const ok = b.dataset.z === IT[k][1];
      if (ok){
        if (first){ right++; body.querySelector(".tally span:last-child").textContent = right + " right"; }
        body.querySelectorAll(".choice").forEach(x => x.disabled = true); b.classList.add("right");
        body.querySelector(".fb").innerHTML = `<div class="why"><b class="ok">Yes.</b> ${IT[k][2]}</div>`;
        const nb = h("button","btn","Next item"); nb.type = "button"; nb.style.marginTop = "10px"; nb.onclick = () => { k++; draw(); }; body.appendChild(nb);
      } else {
        first = false; b.classList.add("wrong"); b.disabled = true;
        body.querySelector(".fb").innerHTML = `<div class="why"><b class="no">Not quite.</b> Is this counted in dollars, or in goods and people? Try again.</div>`;
      }
    });
  };
  draw();
}

function figRuler(el){
  const ST = [
    {rows:[["Your height","72 inches","6 feet"],["Money supply","$100 million",""],["Price of a pizza","$10",""],["Pizzas produced","100",""]], cap:"Start: you’re 6 feet tall. The economy has $100 million of money, pizzas cost $10, and it makes 100 pizzas."},
    {rows:[["Your height","72 inches","<b>12 feet</b>"],["Money supply","$100 million",""],["Price of a pizza","$10",""],["Pizzas produced","100",""]], cap:"Now redefine a foot as 6 inches. You’re suddenly “12 feet” tall. Are you any taller? No. Only the <b>measuring unit</b> changed."},
    {rows:[["Your height","72 inches","12 feet"],["Money supply","<b>$200 million</b>",""],["Price of a pizza","<b>$20</b>",""],["Pizzas produced","<b>100</b>",""]], cap:"Same with money. Double the money supply and prices double, but the economy still makes <b>100 pizzas</b>. Nominal values changed; real values didn’t. That is <b>monetary neutrality</b>."}
  ];
  stepper(el, {title:'<span class="modeltag">📘 Long-run classical model</span><br>Hume’s ruler: changing the unit doesn’t change the thing', n:() => ST.length, draw:(i, st) => {
    st.innerHTML = `<div class="stack">${ST[i].rows.map(r => `<div class="info" style="display:flex;justify-content:space-between;gap:10px"><b style="margin:0">${r[0]}</b><span style="color:var(--ink);text-align:right">${r[1]}${r[2] ? " = " + r[2] : ""}</span></div>`).join("")}</div>`;
    return ST[i].cap;
  }});
}

function figQE(el){
  el.innerHTML = `<div class="figt"><span class="modeltag">📘 Textbook model, as in the lecture</span><br>The pizza economy: M × V = P × Y</div>
    <p class="figsub">Start: $50 of money, each dollar spent 20 times, 100 pizzas. Change one thing at a time.</p>
    <label style="display:flex;justify-content:space-between" for="qe-m"><span>Money supply (M)</span><b class="qe-mv"></b></label><input type="range" id="qe-m" min="25" max="200" step="25" value="50">
    <label style="display:flex;justify-content:space-between" for="qe-v"><span>Velocity (V) <span class="small muted">usually stable</span></span><b class="qe-vv"></b></label><input type="range" id="qe-v" min="10" max="40" step="5" value="20">
    <label style="display:flex;justify-content:space-between" for="qe-y"><span>Pizzas produced (Y) <span class="small muted">set by workers, ovens, skills</span></span><b class="qe-yv"></b></label><input type="range" id="qe-y" min="50" max="200" step="25" value="100">
    <div class="eq" style="font-size:16px"><span class="qe-l"></span>=<span class="qe-r"></span></div>
    <div style="display:flex;justify-content:space-between;align-items:baseline;margin-top:8px"><span>Price of a pizza (P)</span><span class="bignum qe-p"></span></div>
    <div class="meter gold"><span class="qe-b"></span></div>
    <p class="cap qe-cap" aria-live="polite"></p><button type="button" class="btn ghost qe-reset" style="margin-top:10px">Back to the start</button>`;
  const m = el.querySelector("#qe-m"), v = el.querySelector("#qe-v"), y = el.querySelector("#qe-y");
  const up = () => {
    const M = +m.value, V = +v.value, Y = +y.value, P = M*V/Y;
    el.querySelector(".qe-mv").textContent = $$(M); el.querySelector(".qe-vv").textContent = V; el.querySelector(".qe-yv").textContent = Y;
    el.querySelector(".qe-l").innerHTML = `${$$(M)} × ${V} = <b>${$$(M*V)}</b>`;
    el.querySelector(".qe-r").innerHTML = `${$$(+P.toFixed(2))} × ${Y} = <b>${$$(M*V)}</b>`;
    el.querySelector(".qe-p").textContent = $$(+P.toFixed(2)); el.querySelector(".qe-b").style.width = Math.min(100, P/80*100) + "%";
    let c;
    if (M === 50 && V === 20 && Y === 100) c = "Total spending is $1,000, but there are only $50 of money, so each dollar changes hands <b>20 times</b>. A pizza costs <b>$10</b>.";
    else if (V === 20 && Y === 100) c = `Money is ${+(M/50).toFixed(2)}× the start, and V and Y didn’t change, so the price is ${+(M/50).toFixed(2)}× too: <b>${$$(+P.toFixed(2))}</b>. More money, same pizzas → <b>inflation</b>.`;
    else if (M === 50 && V === 20) c = `More pizzas with the same spending means each pizza costs less: <b>${$$(+P.toFixed(2))}</b>. Real output is set by resources, not money.`;
    else if (M === 50 && Y === 100) c = `Faster spending raises P too. That’s why the quantity theory needs <b>stable velocity</b>.`;
    else c = `P = (M × V) ÷ Y = (${M} × ${V}) ÷ ${Y} = <b>${$$(+P.toFixed(2))}</b>.`;
    el.querySelector(".qe-cap").innerHTML = c;
  };
  [m,v,y].forEach(x => x.oninput = up);
  el.querySelector(".qe-reset").onclick = () => { m.value = 50; v.value = 20; y.value = 100; up(); };
  up();
}

function figHyper(el){
  const ST = [
    {pills:[["War or crisis: huge spending needs",""]], cap:"A government needs to pay for large spending, often during or after a war."},
    {pills:[["War or crisis: huge spending needs",""],["Can’t raise enough taxes","down"]], cap:"For political or practical reasons, it can’t collect enough through normal taxes."},
    {pills:[["War or crisis: huge spending needs",""],["Can’t raise enough taxes","down"],["Prints new money to pay its bills","up"]], cap:"So it pays with <b>newly created money</b>."},
    {pills:[["War or crisis: huge spending needs",""],["Can’t raise enough taxes","down"],["Prints new money to pay its bills","up"],["Money supply soars → prices soar","up"]], cap:"The money supply grows extremely fast, so prices rise extremely fast: <b>hyperinflation</b>."},
    {pills:[["War or crisis: huge spending needs",""],["Can’t raise enough taxes","down"],["Prints new money to pay its bills","up"],["Money supply soars → prices soar","up"],["Everyone’s cash buys less = the inflation tax","down"]], cap:"Everyone holding money loses buying power. That loss is the <b>inflation tax</b>: the government gains what money holders lose."}
  ];
  stepper(el, {title:"How a hyperinflation starts", n:() => ST.length, draw:(i, st) => {
    st.innerHTML = `<div style="display:grid;gap:6px">${ST[i].pills.map((p,k) => `<div class="pill ${p[1]} ${k === ST[i].pills.length-1 ? "pop" : ""}" style="border-radius:10px;padding:10px 12px;font-size:15px">${k+1}. ${p[0]}</div>`).join("")}</div>`;
    return ST[i].cap;
  }});
}

function figPaper(el){
  const pos = x => ((Math.log10(x) + 1) / 9 * 100);
  el.innerHTML = `<div class="figt">The price of a German newspaper</div><p class="figsub">From the lecture. Each step on this scale is 10 times bigger than the last.</p>
    <div class="lrow" style="grid-template-columns:96px 1fr"><span>Jan 1921</span><span class="b" style="width:${pos(0.3)}%"></span></div><div class="small" style="margin:0 0 10px 104px">0.3 marks</div>
    <div class="lrow" style="grid-template-columns:96px 1fr"><span>Under 2 years later</span><span class="b" style="width:${pos(7e7)}%;background:var(--wrong)"></span></div><div class="small" style="margin:0 0 10px 104px">70,000,000 marks</div>
    <p class="cap">That’s about <b>233 million times</b> higher. In all four hyperinflations in the lecture, prices rose with the money supply, and stopped when money growth stopped.</p>`;
}

function figCash(el){
  el.innerHTML = `<div class="figt">The inflation tax on your cash</div><p class="figsub">You keep $100 in cash for a year. Choose the inflation rate.</p>
    <label for="ct-s" style="display:flex;justify-content:space-between"><span>Inflation this year</span><b class="ct-r"></b></label>
    <input type="range" id="ct-s" min="0" max="100" step="2" value="2">
    <div style="display:flex;justify-content:space-between;align-items:baseline"><span>Buying power left</span><span class="bignum ct-v"></span></div>
    <div class="meter"><span class="ct-b"></span></div><p class="cap ct-cap" aria-live="polite"></p>`;
  const s = el.querySelector("#ct-s");
  const up = () => { const r = +s.value, left = 100/(1+r/100);
    el.querySelector(".ct-r").textContent = r + "%"; el.querySelector(".ct-v").textContent = $$(+left.toFixed(2)); el.querySelector(".ct-b").style.width = left + "%";
    el.querySelector(".ct-cap").innerHTML = `Your $100 now buys what ${$$(+left.toFixed(2))} bought last year. You lost <b>${$$(+(100-left).toFixed(2))}</b> of buying power without paying any bill: that’s the inflation tax.`; };
  s.oninput = up; up();
}

function figFisher(el){
  let mode = "lr";
  el.innerHTML = `<div class="figt">Nominal rate = real rate + inflation</div>
    <div class="seg" role="group" aria-label="View"><button type="button" aria-pressed="true" data-m="lr">Long run: Fisher effect</button><button type="button" aria-pressed="false" data-m="sv">Your savings account</button></div>
    <label for="fi-s" style="display:flex;justify-content:space-between"><span>Inflation rate</span><b class="fi-r"></b></label>
    <input type="range" id="fi-s" min="0" max="10" step="1" value="3">
    <div class="fi-bars" style="margin:10px 0"></div><p class="cap fi-cap" aria-live="polite"></p>`;
  const s = el.querySelector("#fi-s");
  const bar = (label, val, color) => `<div class="lrow" style="grid-template-columns:110px 1fr 54px"><span>${label}</span><span class="b" style="width:${Math.max(0,val)*7}%;background:${color}"></span><span class="v">${val}%</span></div>`;
  const up = () => {
    const pi = +s.value; el.querySelector(".fi-r").textContent = pi + "%";
    if (mode === "lr"){
      el.querySelector(".fi-bars").innerHTML = bar("Real rate", 4, "var(--note)") + bar("Inflation", pi, "var(--gold)") + bar("Nominal rate", 4+pi, "var(--ink)");
      el.querySelector(".fi-cap").innerHTML = `In the long run, money growth doesn’t change the real rate (4% here). So when inflation is ${pi}%, the nominal rate is 4 + ${pi} = <b>${4+pi}%</b>. Inflation and nominal rates rise one for one: the <b>Fisher effect</b>.`;
    } else {
      const real = 7 - pi;
      el.querySelector(".fi-bars").innerHTML = bar("Bank pays", 7, "var(--ink)") + bar("Inflation", pi, "var(--gold)") + bar("Real return", real, real >= 0 ? "var(--note)" : "var(--wrong)");
      el.querySelector(".fi-cap").innerHTML = `The bank pays 7%. You deposit $100 and get $107. With ${pi}% inflation, your real gain is 7 − ${pi} = <b>${real}%</b>${real < 0 ? ": you actually lost buying power" : ""}.`;
    }
  };
  el.querySelectorAll(".seg button").forEach(b => b.onclick = () => { mode = b.dataset.m; el.querySelectorAll(".seg button").forEach(x => x.setAttribute("aria-pressed", x === b)); up(); });
  s.oninput = up; up();
}

function figCosts(el){
  const C = [
    ["🧾","“Inflation eats my paycheck”","A myth, mostly. Prices rise, but wages and incomes rise too. Under monetary neutrality, real income is unchanged.","myth"],
    ["👟","Shoe-leather costs","People hold less cash and go to the bank more often. Tiny at 2%, huge in a hyperinflation.",""],
    ["📋","Menu costs","Firms spend time and money changing prices: new menus, price tags, catalogs.",""],
    ["⚖️","Relative-price variability","Prices that change only now and then drift out of line, so markets allocate resources badly.",""],
    ["🏛️","Tax distortions","Taxes on nominal income rise with inflation, cutting the real reward for saving.",""],
    ["📏","Confusion and inconvenience","A dollar that keeps shrinking is like a foot that keeps changing length: hard to compare over time.",""],
    ["🔀","Arbitrary redistribution","Surprise inflation moves wealth between borrowers and lenders, with no regard to who deserves it.",""]
  ];
  el.innerHTML = `<div class="figt">What does inflation really cost?</div><p class="figsub">Tap each card. One of them is a common myth.</p>
    <div class="choices" style="grid-template-columns:repeat(auto-fit,minmax(140px,1fr))">${C.map((c,i) => `<button type="button" class="choice" data-i="${i}" style="text-align:left"><span style="font-size:24px">${c[0]}</span><br>${c[1]}</button>`).join("")}</div>
    <p class="cap cs-cap" aria-live="polite">Tap a card to learn about it.</p>`;
  el.querySelectorAll(".choice").forEach(b => b.onclick = () => {
    el.querySelectorAll(".choice").forEach(x => x.classList.remove("right","wrong"));
    const c = C[+b.dataset.i]; b.classList.add(c[3] === "myth" ? "wrong" : "right");
    el.querySelector(".cs-cap").innerHTML = `<b>${c[3] === "myth" ? "Myth: " : ""}${c[1]}.</b> ${c[2]}`;
  });
}

function figShoe(el){
  el.innerHTML = `<div class="figt">Bolivia, 1985: why people rushed to spend</div><p class="figsub">Prices rose about 38,000% that year, roughly 1.65% every day. How long do you hold your pay?</p>
    <label for="sh-s" style="display:flex;justify-content:space-between"><span>Days you hold your pay</span><b class="sh-d"></b></label>
    <input type="range" id="sh-s" min="1" max="30" step="1" value="7">
    <div style="display:flex;justify-content:space-between;align-items:baseline"><span>Prices rose by</span><span class="bignum sh-v"></span></div>
    <div class="meter gold"><span class="sh-b"></span></div><p class="cap sh-cap" aria-live="polite"></p>`;
  const s = el.querySelector("#sh-s");
  const up = () => { const d = +s.value, r = (Math.pow(1.0165, d) - 1)*100;
    el.querySelector(".sh-d").textContent = d + (d === 1 ? " day" : " days"); el.querySelector(".sh-v").textContent = r.toFixed(1) + "%";
    el.querySelector(".sh-b").style.width = Math.min(100, r/65*100) + "%";
    el.querySelector(".sh-cap").innerHTML = d === 7 ? "In a week, prices rise about <b>12%</b>: your paycheck buys noticeably less. People spent their pay or swapped it for dollars right away. All that running around is the <b>shoe-leather cost</b>." :
      `After ${d} ${d === 1 ? "day" : "days"}, prices are up <b>${r.toFixed(1)}%</b>. The longer you hold cash, the more it loses, so people make many more trips to spend or exchange money.`; };
  s.oninput = up; up();
}

function figMenu(el){
  el.innerHTML = `<div class="figt">One menu, a whole year of inflation</div><p class="figsub">The restaurant prints its menu once a year at $10 a meal. Prices everywhere else rise 1% a month.</p>
    <label for="mn-s" style="display:flex;justify-content:space-between"><span>Month</span><b class="mn-m"></b></label>
    <input type="range" id="mn-s" min="0" max="12" step="1" value="0">
    <div class="lrow" style="grid-template-columns:120px 1fr 60px"><span>Menu price</span><span class="b" style="width:50%"></span><span class="v">$10.00</span></div>
    <div class="lrow" style="grid-template-columns:120px 1fr 60px"><span>Same meal in<br>start-of-year $</span><span class="b mn-b" style="background:var(--gold)"></span><span class="v mn-v"></span></div>
    <p class="cap mn-cap" aria-live="polite"></p>`;
  const s = el.querySelector("#mn-s");
  const up = () => { const m = +s.value, rel = 10/Math.pow(1.01, m);
    el.querySelector(".mn-m").textContent = m === 0 ? "January (new menu)" : "Month " + m;
    el.querySelector(".mn-b").style.width = (rel*5) + "%"; el.querySelector(".mn-v").textContent = $$(+rel.toFixed(2));
    el.querySelector(".mn-cap").innerHTML = m === 0 ? "Right after printing, the meal is priced on the high side. Slide through the year." :
      `By month ${m}, the meal is really worth only <b>${$$(+rel.toFixed(2))}</b> in start-of-year money, so it has become <b>cheap relative to everything else</b>, even though nothing about the food’s cost changed. Customers get the wrong signal: <b>relative-price variability</b>.`; };
  s.oninput = up; up();
}

function figTax(el){
  el.innerHTML = `<div class="figt">Taxes on savings, with and without inflation</div><p class="figsub">Real interest rate 4%, tax on interest income 25% (the lecture’s Table 1). Choose the inflation rate.</p>
    <label for="tx-s" style="display:flex;justify-content:space-between"><span>Inflation rate</span><b class="tx-r"></b></label>
    <input type="range" id="tx-s" min="0" max="10" step="1" value="0">
    <div class="tx-rows stack"></div><div style="display:flex;justify-content:space-between;align-items:baseline"><span>Your after-tax real return</span><span class="bignum tx-v"></span></div>
    <div class="meter"><span class="tx-b"></span></div><p class="cap tx-cap" aria-live="polite"></p>`;
  const s = el.querySelector("#tx-s");
  const up = () => { const pi = +s.value, nom = 4+pi, tax = nom*0.25, atn = nom-tax, atr = atn-pi;
    el.querySelector(".tx-r").textContent = pi + "%";
    el.querySelector(".tx-rows").innerHTML = [["Nominal interest rate (4 + inflation)", nom], ["Tax paid (25% of nominal)", -tax], ["After-tax nominal rate", atn], ["Minus inflation", -pi]].map(r => `<div class="info" style="display:flex;justify-content:space-between;padding:8px 12px"><span style="color:var(--ink)">${r[0]}</span><b style="margin:0">${r[1] < 0 ? "−" : ""}${Math.abs(+r[1].toFixed(2))}%</b></div>`).join("");
    el.querySelector(".tx-v").textContent = (+atr.toFixed(2)) + "%"; el.querySelector(".tx-b").style.width = Math.max(0, atr/3*100) + "%";
    el.querySelector(".tx-cap").innerHTML = pi === 0 ? "With no inflation, you keep a <b>3%</b> real return after tax." :
      `The tax is charged on the whole nominal rate, including the part that only makes up for inflation. Your after-tax real return falls to <b>${+atr.toFixed(2)}%</b>, so people save less. ${pi === 8 ? "That’s the lecture’s 8% case: 3% shrinks to 1%." : ""}`; };
  s.oninput = up; up();
}

function figLoan(el){
  el.innerHTML = `<div class="figt">A mortgage and a surprise</div><p class="figsub">You borrow at 7%, expecting 3% inflation, so you expect to pay a 4% real rate. What if inflation turns out different?</p>
    <label for="ln-s" style="display:flex;justify-content:space-between"><span>Actual inflation</span><b class="ln-r"></b></label>
    <input type="range" id="ln-s" min="-2" max="8" step="1" value="3">
    <div style="display:flex;justify-content:space-between;align-items:baseline"><span>Real rate you actually pay</span><span class="bignum ln-v"></span></div>
    <div class="orgrow" style="margin-top:8px"><div class="node ln-you"><div style="font-size:26px">🏠</div><b>You (borrower)</b><small class="ln-ys"></small></div><div class="node ln-bank"><div style="font-size:26px">🏦</div><b>The bank (lender)</b><small class="ln-bs"></small></div></div>
    <p class="cap ln-cap" aria-live="polite"></p>`;
  const s = el.querySelector("#ln-s");
  const up = () => { const pi = +s.value, real = 7 - pi;
    el.querySelector(".ln-r").textContent = pi + "%"; el.querySelector(".ln-v").textContent = real + "%";
    const you = el.querySelector(".ln-you"), bank = el.querySelector(".ln-bank");
    you.className = "node ln-you " + (pi > 3 ? "hot" : pi < 3 ? "dim" : ""); bank.className = "node ln-bank " + (pi < 3 ? "hot" : pi > 3 ? "dim" : "");
    el.querySelector(".ln-ys").textContent = pi > 3 ? "Wins" : pi < 3 ? "Loses" : "As expected"; el.querySelector(".ln-bs").textContent = pi < 3 ? "Wins" : pi > 3 ? "Loses" : "As expected";
    el.querySelector(".ln-cap").innerHTML = pi === 3 ? "Inflation came in as expected: you pay the 4% real rate everyone planned on." :
      pi < 0 ? `<b>Deflation!</b> Prices fall ${-pi}%, so you repay in dollars that are worth more: a <b>${real}%</b> real rate. This is why deflation can be worse than inflation, especially for borrowers already struggling in a downturn.` :
      pi < 3 ? `Inflation was lower than expected, so you pay a <b>${real}%</b> real rate. <b>The bank wins, you lose.</b>` :
      `Inflation was higher than expected, so you pay only <b>${real}%</b> in real terms. <b>You win, the bank loses.</b>`; };
  s.oninput = up; up();
}

/* ---------- lessons ---------- */
const STEPS = [
 { title:"What inflation is", html:`
   <p>In 1931, Babe Ruth earned $80,000 a year, an ice cream cone cost 5 cents, and a movie ticket cost a quarter. Prices have risen a lot since then.</p>
   <div class="stack">
     <div class="info"><b>${g("Inflation")}</b><span>The overall level of prices rises.</span></div>
     <div class="info"><b>${g("Deflation")}</b><span>The overall level of prices falls.</span></div>
     <div class="info"><b>${g("Hyperinflation")}</b><span>Extremely high inflation, like Germany after World War I.</span></div>
   </div>
   <p>Here’s the key idea of this lecture: when ice cream costs more, it’s usually not because ice cream got better. It’s because <b>dollars became less valuable</b>.</p>
   <div class="formula">P = dollars per basket &nbsp;·&nbsp; 1/P = baskets per dollar</div>
   <p>The ${g("Price level","price level")} P is the dollar price of goods. Flip it over and 1/P is the goods price of a dollar: the ${g("Value of money","value of money")}.</p>
   <div class="fig" data-fig="value"></div>
   ${tn("Inflation is “currently about 2 percent per year,” down from over 7% in the 1970s.","U.S. inflation jumped above 9% in mid-2022, the highest in about 40 years, then came back down. The Fed’s goal is 2% a year. For the latest figure, check the CPI at bls.gov.")}`,
   check:[
    {id:"c1a", q:"An ice cream cone costs much more today than in 1931. The best explanation is…", a:1,
     o:[["Ice cream cones are much better today","Maybe a little, but not 50 times better. Think about what changed for every good at once."],
        ["Dollars have become less valuable","Yes. When nearly all prices rise, it’s the value of money that fell."],
        ["People like ice cream more today","Tastes change slowly and wouldn’t raise every other price too."]],
     hint:"Movie tickets, salaries and ice cream all rose. What do they have in common?", more:"That’s the heart of the quantity theory: inflation is about the value of money, not the value of goods."},
    {id:"c1b", q:"The price level P doubles. What happens to the value of money, 1/P?", a:0,
     o:[["It falls by half","Correct. If baskets cost twice as many dollars, each dollar buys half as much."],
        ["It doubles","P and 1/P move in opposite directions. If P goes up, can 1/P go up too?"],
        ["It stays the same","Try the slider: did your $100 buy the same number of baskets when the price changed?"]],
     hint:"Use the slider: what happened to the baskets when the price went up?", more:"Inflation is a fall in the value of money."}
   ]},
 { title:"Money supply and money demand", html:`
   <p>We can treat money like any other good, with a supply and a demand. Its “price” is the value of money, 1/P.</p>
   <div class="stack">
     <div class="info"><b>${g("Money supply","Money supply")}: a vertical line</b><span>The Fed and the banks decide how much money exists. It doesn’t depend on the value of money.</span></div>
     <div class="info"><b>${g("Money demand","Money demand")}: slopes downward</b><span>When prices are high (1/P low), people need more dollars to buy the same things, so they want to hold more money.</span></div>
   </div>
   <div class="fig" data-fig="mm"></div>
   <p>Where they cross is ${g("Monetary equilibrium","monetary equilibrium")}. It sets the value of money, and so the price level.</p>`,
   check:[
    {id:"c2a", q:"Why is the money supply curve vertical?", a:1,
     o:[["People always want the same amount of money","That describes demand, not supply. Who decides how much money exists?"],
        ["The Fed (and banks) fix the quantity, whatever the value of money","Yes. The amount of money doesn’t respond to 1/P."],
        ["Prices never change","Prices do change; the supply line just doesn’t depend on them."]],
     hint:"Who controls how much money is in the economy?", more:"Because supply is fixed, shifts in it are what move the price level in this model."},
    {id:"c2b", q:"At the current value of money, people hold more money than they want. What happens next?", a:0,
     o:[["They spend it, so prices rise and the value of money falls","Correct. Extra money gets spent, pushing P up until people are happy holding it."],
        ["They hold it, so prices fall","Holding more than you want isn’t stable. What do people do with extra money?"],
        ["Nothing changes","An imbalance creates pressure. Try the ‘Value too high’ button again."]],
     hint:"Tap ‘Value too high’. What did people do with their extra money?", more:"That’s an excess supply of money: it pushes prices up."}
   ]},
 { title:"When the Fed adds money", html:`
   <p>Suppose the Fed increases the money supply, for example by buying bonds (Lecture 6). Watch what happens to prices.</p>
   <div class="fig" data-fig="inject"></div>
   <p>This is the ${g("Quantity theory of money","quantity theory of money")}: the quantity of money determines the price level, and the <b>growth</b> of money determines the <b>inflation rate</b>.</p>`,
   check:[
    {id:"c3a", q:"The Fed doubles the money supply. In this model, the price level…", a:2,
     o:[["Stays the same","The supply line moved. Did the equilibrium stay put?"],
        ["Falls by half","That’s what happens to the value of money, 1/P. What about P itself?"],
        ["Doubles","Yes. Twice the money, twice the prices; the value of money halves."]],
     hint:"Compare points A and B. What happened to P on the right-hand axis?", more:"Money growth → inflation. That’s the core result of Lecture 7."},
    {id:"c3b", q:"Right after the injection, why do prices start rising?", a:1,
     o:[["Firms’ costs suddenly go up","Nothing about production changed. Look at what people now hold."],
        ["People have more money than they want, so they spend it","Correct. More spending on the same goods bids up prices."],
        ["The Fed raises prices directly","The Fed controls money, not prices. Prices rise through spending."]],
     hint:"Step 2 showed an ‘excess supply’. What do people do with extra money?", more:"Some spend directly; some deposit it and banks lend it out. Either way, spending rises."}
   ]},
 { title:"Real vs nominal: money’s neutrality", html:`
   <p>David Hume split economic variables into two groups. This is the ${g("Classical dichotomy","classical dichotomy")}.</p>
   <div class="stack">
     <div class="info"><b>${g("Nominal variables","Nominal variables")}</b><span>Measured in dollars.</span></div>
     <div class="info"><b>${g("Real variables","Real variables")}</b><span>Measured in goods or people.</span></div>
   </div>
   <div class="fig" data-fig="sortnr"></div>
   <p>${g("Monetary neutrality","Monetary neutrality")} says changing the money supply changes nominal variables but <b>not real ones</b>.</p>
   <div class="fig" data-fig="ruler"></div>
   <p class="small muted">Hume agreed prices might take time to adjust. Most economists today accept neutrality in the <b>long run</b>; Lectures 10 and 11 cover the short run.</p>`,
   check:[
    {id:"c4a", q:"Which is a real variable?", a:2,
     o:[["Nominal GDP","It’s measured in dollars, so it’s nominal."],
        ["The CPI","It counts the dollars needed to buy a basket. Is that dollars or goods?"],
        ["The unemployment rate","Yes. It’s a share of people, not dollars."]],
     hint:"Ask: is it counted in dollars, or in things and people?", more:"Real GDP and the real wage are real variables too."},
    {id:"c4b", q:"Under monetary neutrality, doubling the money supply would…", a:1,
     o:[["Double real GDP","Real output depends on workers, capital and technology. Did those change?"],
        ["Double prices but leave real GDP unchanged","Correct. Like redefining a foot, the units change but the economy doesn’t."],
        ["Leave prices unchanged","Doubling the money supply changes nominal variables. Which ones?"]],
     hint:"Think of the ruler: did you get taller when a foot became 6 inches?", more:"This is a long-run idea. In the short run, money can affect output."}
   ]},
 { title:"Velocity and the quantity equation", html:`
   <p>The ${g("Velocity of money","velocity of money")} is how many times a typical dollar is spent in a year.</p>
   <div class="formula">V = (P × Y) ÷ M</div>
   <p>Y is real GDP, P is the price level (GDP deflator), so P × Y is nominal GDP. Rearranged, this is the ${g("Quantity equation","quantity equation")}:</p>
   <div class="formula">M × V = P × Y</div>
   <div class="fig" data-fig="qe"></div>
   <h3>Why this explains inflation</h3>
   <div class="stack">
     <div class="info"><b>1. V is fairly stable</b><span>So more M means more nominal spending, P × Y.</span></div>
     <div class="info"><b>2. Y is set by real resources</b><span>Labor, capital, natural resources and technology, not money.</span></div>
     <div class="info"><b>3. So P must rise</b><span>Extra money shows up as higher prices: inflation.</span></div>
   </div>
   ${tn("Velocity (shown in the lecture’s chart since 1960) “has remained relatively stable.”","Velocity has moved around much more since the 2008 crisis, and fell sharply in 2020 when people held far more money. The long-run link between money growth and inflation is still the key lesson.")}`,
   check:[
    {id:"c5a", q:"In the pizza economy, M = $50, P = $10 and Y = 100 pizzas. What is velocity?", a:1,
     o:[["5","Check the formula: V = (P × Y) ÷ M. What is P × Y?"],
        ["20","Correct. (10 × 100) ÷ 50 = 1,000 ÷ 50 = 20."],
        ["500","That’s M × P. Velocity divides nominal spending by the money supply."]],
     hint:"Total spending is P × Y. How many times must $50 be spent to cover it?", more:"Each dollar changes hands 20 times a year."},
    {id:"c5b", q:"If V and Y don’t change and M rises 10%, then P…", a:0,
     o:[["Rises 10%","Correct. M × V must equal P × Y, so with V and Y fixed, P moves with M."],
        ["Falls 10%","More money on the left side has to be matched on the right. Can P fall?"],
        ["Stays the same","Then M × V would no longer equal P × Y. Something on the right must rise."]],
     hint:"Use the sliders: change only M and watch P.", more:"That’s the quantity theory in one line."}
   ]},
 { title:"The inflation tax and hyperinflation", html:`
   <p>Why would any country let prices rise millions of times over?</p>
   <div class="fig" data-fig="hyper"></div>
   <p>The ${g("Inflation tax","inflation tax")} is the revenue a government gets by printing money. Nobody gets a bill, but everyone holding money pays.</p>
   <div class="fig" data-fig="cash"></div>
   <div class="fig" data-fig="paper"></div>`,
   check:[
    {id:"c6a", q:"Hyperinflations usually start because a government…", a:1,
     o:[["Cuts its spending","Cutting spending reduces the need for money. What creates the need?"],
        ["Prints money to pay for spending it can’t fund with taxes","Correct. Often during or after a war."],
        ["Raises income taxes","Raising taxes would be the alternative to printing money."]],
     hint:"Follow the steps in the chain. Where does the new money come from?", more:"All four hyperinflations in the lecture followed World War I."},
    {id:"c6b", q:"Who pays the inflation tax?", a:2,
     o:[["Only people with high incomes","It isn’t based on income. What exactly loses value?"],
        ["Only businesses","Businesses hold money, but so does everyone else."],
        ["Everyone who holds money","Correct. As prices rise, every dollar held buys less."]],
     hint:"Use the cash slider: what lost value?", more:"That’s why people try to hold as little money as possible during a hyperinflation."}
   ]},
 { title:"The Fisher effect", html:`
   <div class="stack">
     <div class="info"><b>${g("Nominal interest rate","Nominal interest rate")}</b><span>The rate the bank quotes, not corrected for inflation.</span></div>
     <div class="info"><b>${g("Real interest rate","Real interest rate")}</b><span>Corrected for inflation.</span></div>
   </div>
   <div class="formula">Real rate = Nominal rate − Inflation</div>
   <p>Example: the bank pays 7%. You deposit $100 and get $107. Inflation is 3%, so your real return is 7 − 3 = <b>4%</b>.</p>
   <div class="fig" data-fig="fisher"></div>
   <p>Rearranged: nominal rate = real rate + inflation. Monetary neutrality says money growth doesn’t change the real rate, so higher inflation raises the nominal rate one for one. This is the ${g("Fisher effect")}. In U.S. data since 1960, inflation and nominal interest rates move together.</p>`,
   check:[
    {id:"c7a", q:"A bank pays 5% and inflation is 2%. What is the real interest rate?", a:1,
     o:[["7%","That adds them. The real rate takes inflation away."],
        ["3%","Correct. 5% − 2% = 3%."],
        ["2.5%","Real rate = nominal − inflation. No division needed."]],
     hint:"Real = nominal − inflation.", more:"Your money grows 5%, but prices grow 2%, so your buying power grows 3%."},
    {id:"c7b", q:"Money growth pushes inflation up from 2% to 6% in the long run. The Fisher effect predicts the nominal interest rate will…", a:0,
     o:[["Rise by about 4 percentage points","Correct. The real rate stays put, so the nominal rate rises with inflation."],
        ["Fall by 4 points","Lenders would be paid back in cheaper dollars. Would they accept less?"],
        ["Stay the same","Then the real rate would fall. Does neutrality allow that in the long run?"]],
     hint:"Nominal = real + inflation, and the real rate doesn’t change.", more:"In the long run, high-inflation countries have high nominal interest rates."}
   ]},
 { title:"The costs of inflation", html:`
   <p>Most people dislike inflation. But which costs are real?</p>
   <div class="fig" data-fig="costs"></div>
   <h3>Shoe-leather costs</h3>
   <p>${g("Shoe-leather costs","Shoe-leather costs")} come from holding less money and making more trips to the bank.</p>
   <div class="fig" data-fig="shoe"></div>
   <h3>Menu costs and relative prices</h3>
   <p>${g("Menu costs","Menu costs")} are the costs of changing prices. Because firms don’t change prices constantly, inflation causes ${g("Relative-price variability","relative-price variability")}.</p>
   <div class="fig" data-fig="menu"></div>`,
   check:[
    {id:"c8a", q:"“Inflation erodes my income’s purchasing power.” Why do economists call this mostly a fallacy?", a:1,
     o:[["Inflation never affects anyone","Some costs are real; this particular one is the misunderstanding."],
        ["Wages and incomes rise along with prices","Correct. Under neutrality, real income stays the same."],
        ["Prices don’t really rise","Prices do rise. What else rises at the same time?"]],
     hint:"Your wage is also a price. What happens to it?", more:"The real costs are the others: shoe leather, menus, taxes, confusion, redistribution."},
    {id:"c8b", q:"Shoe-leather costs are biggest when…", a:2,
     o:[["Inflation is about 2%","At low inflation they’re tiny. When would holding cash really hurt?"],
        ["Prices are stable","With stable prices, there’s no reason to rush to the bank."],
        ["There is hyperinflation","Correct. In Bolivia, prices rose about 12% a week, so people rushed to spend."]],
     hint:"Use the Bolivia slider: when does holding cash hurt most?", more:"Most inflation costs are small at low rates and grow quickly at high rates."}
   ]},
 { title:"Taxes, redistribution and deflation", html:`
   <h3>Inflation-induced tax distortions</h3>
   <p>Taxes are charged on <b>nominal</b> interest, even the part that only makes up for inflation. These are ${g("Inflation-induced tax distortions","inflation-induced tax distortions")}.</p>
   <div class="fig" data-fig="tax"></div>
   <h3>Arbitrary redistribution of wealth</h3>
   <p>When inflation turns out different from what people expected, wealth moves between borrowers and lenders: an ${g("Arbitrary redistribution of wealth","arbitrary redistribution")}.</p>
   <div class="fig" data-fig="loan"></div>
   <p>Inflation is bad, but <b>deflation may be worse</b>. It hurts borrowers, such as farmers in the Great Depression and homeowners more recently, who are often already suffering in a downturn.</p>`,
   check:[
    {id:"c9a", q:"Real rate 4%, tax 25%. Why does a saver keep less real return when inflation is 8% instead of 0%?", a:0,
     o:[["The tax is charged on the higher nominal interest, including the inflation part","Correct. At 12% nominal, tax is 3%, leaving 9% − 8% inflation = 1% real."],
        ["The tax rate rises with inflation","The tax rate stays 25%. What does it apply to?"],
        ["The real interest rate falls","The real rate is 4% in both cases. Look at what gets taxed."]],
     hint:"In the tax slider, compare the ‘Tax paid’ row at 0% and 8% inflation.", more:"That’s why even moderate inflation can discourage saving."},
    {id:"c9b", q:"You borrowed at 7% expecting 3% inflation. Inflation turns out to be 1%. Who wins?", a:1,
     o:[["You, the borrower","You now pay a 6% real rate, higher than planned. Is that a win?"],
        ["The bank, the lender","Correct. You repay in dollars worth more than expected."],
        ["Nobody; it cancels out","Across the whole economy it nets out, but for this loan someone gains."]],
     hint:"Real rate paid = 7% − actual inflation. Is that more or less than 4%?", more:"Unexpected deflation is even harsher for borrowers."}
   ]}
];
const FIGS = { value:figValue, mm:figMM, inject:figInject, sortnr:figSortNR, ruler:figRuler, qe:figQE, hyper:figHyper, cash:figCash, paper:figPaper, fisher:figFisher, costs:figCosts, shoe:figShoe, menu:figMenu, tax:figTax, loan:figLoan };

/* ---------- self-check ---------- */
const QUIZ = [
 {id:"q1", L:0, q:"Inflation means…", a:1, hint:"Is it about one good, or prices in general?", o:[["The price of one good rises","One price rising is a relative price change. Inflation is broader."],["The overall price level rises","Right. Measured by the CPI or GDP deflator."],["The value of money rises","When prices rise, does each dollar buy more or less?"],["Interest rates rise","Interest rates may follow inflation, but they aren’t inflation."]], more:"Equivalently: the value of money falls."},
 {id:"q2", L:0, q:"If the price level P is 4, the value of money 1/P is…", a:2, hint:"Flip P over.", o:[["4","That’s P itself."],["−4","Values of money can’t be negative."],["0.25","Right. 1 ÷ 4 = 0.25 baskets per dollar."],["16","That squares P. Value of money is 1 divided by P."]], more:"When P rises, 1/P falls."},
 {id:"q3", L:0, q:"A period of falling prices is called…", a:1, hint:"The opposite of inflation.", o:[["Disinflation","Disinflation means inflation slowing, while prices still rise."],["Deflation","Right. The price level falls."],["Hyperinflation","That’s the opposite: extremely fast rising prices."],["Stagnation","That describes slow growth, not prices."]], more:"The U.S. faced a deflation threat in 2008–2009."},
 {id:"q4", L:1, q:"In the money market, the vertical axis on the left shows…", a:1, hint:"What is the ‘price’ of money?", o:[["The price level P","P is on the right axis, running the other way."],["The value of money, 1/P","Right. Money’s price is how many goods a dollar buys."],["The interest rate","That’s a different diagram (Lecture 11)."],["Real GDP","GDP isn’t on this diagram."]], more:"High 1/P means low P."},
 {id:"q5", L:1, q:"Why does money demand slope downward against 1/P?", a:0, hint:"When things cost more, how many dollars do you need?", o:[["When 1/P is low, prices are high, so people need more money","Right. Higher prices mean more dollars per purchase."],["People dislike money","Demand reflects what people need for buying, not feelings."],["The Fed sets demand","The Fed sets supply. Demand comes from households and firms."],["Because supply is vertical","The shape of supply doesn’t determine the shape of demand."]], more:"Supply is vertical; demand slopes down."},
 {id:"q6", L:2, q:"After a monetary injection, the immediate imbalance is…", a:1, hint:"At the old prices, compare what people hold with what they want.", o:[["An excess demand for money","At old prices people now hold more than they want, not less."],["An excess supply of money","Right. That extra money gets spent, pushing prices up."],["A shortage of goods","Goods didn’t disappear; spending on them rose."],["No imbalance","The supply line moved. Something is out of balance."]], more:"Spending raises P until people are happy holding the new money."},
 {id:"q7", L:2, q:"According to the quantity theory, the inflation rate is determined mainly by…", a:2, hint:"Level of money → price level. Growth of money → ?", o:[["The level of interest rates","Interest rates respond to inflation (Fisher), not the other way."],["Wage demands by unions","Wages are prices too; the theory looks at money."],["The growth rate of the money supply","Right. Faster money growth → higher inflation."],["Population growth","That affects real variables, not the price level."]], more:"Both theory and evidence point to excess money growth as the main cause of inflation."},
 {id:"q8", L:3, q:"Which pair is (nominal, real)?", a:0, hint:"Nominal = dollars; real = goods or people.", o:[["(Nominal GDP, real GDP)","Right."],["(Unemployment rate, CPI)","The unemployment rate is real; the CPI is nominal. That’s backwards."],["(Real wage, nominal wage)","That’s real first, then nominal."],["(Real interest rate, nominal interest rate)","Again reversed."]], more:"The classical dichotomy separates these two groups."},
 {id:"q9", L:3, q:"Monetary neutrality says that changes in the money supply…", a:1, hint:"Think of the ruler analogy.", o:[["Affect real variables but not nominal ones","It’s the other way around."],["Don’t affect real variables","Right, at least in the long run."],["Affect nothing at all","Prices change. Those are nominal variables."],["Always cause recessions","Neutrality says real output isn’t affected in the long run."]], more:"Most economists accept neutrality in the long run, not the short run."},
 {id:"q10", L:4, q:"In the quantity equation M × V = P × Y, P × Y is…", a:2, hint:"Price times quantity of output.", o:[["Real GDP","Real GDP is Y alone."],["The money supply","That’s M."],["Nominal GDP","Right. The dollar value of output."],["Velocity","That’s V."]], more:"So M × V equals total dollar spending."},
 {id:"q11", L:4, q:"The quantity theory needs which assumption about velocity?", a:1, hint:"If V jumped around, would more M reliably raise spending?", o:[["Velocity grows as fast as money","Then prices wouldn’t be tied to money in a predictable way."],["Velocity is fairly stable","Right. Then more M means more nominal GDP."],["Velocity is zero","Then no money would ever be spent."],["Velocity equals real GDP","V is a rate of spending, not output."]], more:"Stable V + fixed Y → P moves with M."},
 {id:"q12", L:4, q:"M = $200, V = 5, Y = 100. What is P?", a:1, hint:"P = (M × V) ÷ Y.", o:[["$5","That’s V. Use all three numbers."],["$10","Right. (200 × 5) ÷ 100 = 10."],["$40","That’s M ÷ V. Check the formula."],["$1,000","That’s M × V, total spending, not the price."]], more:"Double M and P would double to $20."},
 {id:"q13", L:5, q:"The inflation tax is…", a:0, hint:"Who gains when the government prints money to pay its bills?", o:[["Revenue the government raises by creating money","Right. Money holders lose buying power."],["A sales tax that rises with prices","It isn’t a formal tax law."],["Interest paid on government bonds","That’s a cost of borrowing, not money creation."],["A tax on interest income","That’s the tax distortion in lesson 9."]], more:"It falls on everyone who holds money."},
 {id:"q14", L:5, q:"Many hyperinflations happened during or after…", a:2, hint:"When do governments face huge bills they can’t tax for?", o:[["Stock market booms","Booms don’t usually force governments to print money."],["Periods of low spending","Low spending reduces the need to print money."],["Wars","Right. All four in the lecture followed World War I."],["Elections","Elections don’t typically cause hyperinflation."]], more:"And hyperinflations ended when money growth stopped."},
 {id:"q15", L:6, q:"The nominal rate is 9% and inflation is 4%. The real rate is…", a:1, hint:"Real = nominal − inflation.", o:[["13%","That adds them."],["5%","Right."],["2.25%","No division: subtract."],["−5%","Check the order: 9 − 4."]], more:"Your buying power grows 5% a year."},
 {id:"q16", L:6, q:"The Fisher effect says that in the long run, higher inflation leads to…", a:0, hint:"Nominal = real + inflation, with the real rate fixed.", o:[["A higher nominal interest rate","Right, one for one."],["A higher real interest rate","Neutrality keeps the real rate unchanged."],["A lower nominal interest rate","Lenders would demand more, not less."],["No change in interest rates","The nominal rate must rise to keep the real rate the same."]], more:"U.S. data since 1960 show inflation and nominal rates moving together."},
 {id:"q17", L:7, q:"Shoe-leather costs refer to…", a:1, hint:"Think of walking to the bank.", o:[["The cost of printing new menus","That’s menu costs."],["Resources wasted when people hold less cash and visit the bank more","Right."],["The cost of new shoes rising","It’s a metaphor, not about shoe prices."],["Taxes on savings","That’s a tax distortion."]], more:"Small at low inflation; large in a hyperinflation."},
 {id:"q18", L:7, q:"A restaurant changes its menu once a year while inflation runs all year. By December, its meals are…", a:2, hint:"The menu price is fixed while other prices rise.", o:[["Expensive relative to other goods","That’s true right after the menu is printed, in January."],["Unchanged in relative price","Other prices kept rising. Did the menu price?"],["Cheap relative to other goods","Right. That’s relative-price variability."],["Free","Not quite!"]], more:"Prices then give misleading signals about costs."},
 {id:"q19", L:8, q:"Real rate 4%, tax 25%, inflation 8%. The after-tax real return is…", a:1, hint:"Nominal 12%, tax 3%, after-tax 9%, minus inflation.", o:[["3%","That’s the zero-inflation case."],["1%","Right. 9% − 8% = 1%."],["9%","That’s after tax but before subtracting inflation."],["−1%","Check: 12% − 3% tax = 9%; 9% − 8% = ?"]], more:"Inflation raises the tax burden on saving."},
 {id:"q20", L:8, q:"Unexpectedly high inflation tends to help…", a:0, hint:"Who repays in cheaper dollars?", o:[["Borrowers","Right. They repay with dollars worth less than expected."],["Lenders","Lenders receive cheaper dollars. Is that good for them?"],["Everyone equally","Someone gains and someone loses."],["Savers holding cash","Cash loses value faster."]], more:"Unexpected deflation does the reverse, and can hurt struggling borrowers badly."}
];
const ROUNDS = [["Round 1","Inflation and the money market",0],["Round 2","Injections, neutrality, velocity",5],["Round 3","Velocity, inflation tax, Fisher",10],["Round 4","The costs of inflation",15],["Mixed round","5 random questions",-1],["My weak spots","Questions you’ve missed before, mixed up",-2],["Equation drills","Quantity equation and Fisher problems with new numbers",-3]];
function genDrill(){
  const pick = a => a[Math.floor(Math.random()*a.length)];
  const kind = Math.floor(Math.random()*3);
  let q, o, L, hint;
  if (kind === 0){
    const M = pick([50,100,200,400]), V = pick([2,4,5,10]), Y = pick([50,100,200]); const P = M*V/Y;
    q = `M = ${$$(M)}, V = ${V}, Y = ${Y}. What is the price level P?`; L = 4; hint = "P = (M × V) ÷ Y.";
    o = [[$$(+P.toFixed(2)),`Right. (${M} × ${V}) ÷ ${Y} = ${+P.toFixed(2)}.`],[$$(M*V),"That’s M × V, total spending. Divide by Y."],[$$(+(M/Y).toFixed(2)),"That leaves out velocity."],[$$(+(Y/(M*V)).toFixed(3)),"That’s flipped. Spending goes on top."]];
  } else if (kind === 1){
    const P = pick([2,5,10]), Y = pick([100,200,500]), M = pick([100,250,500]); const V = P*Y/M;
    q = `Nominal GDP is P × Y = ${P} × ${Y}, and the money supply is ${$$(M)}. What is velocity?`; L = 4; hint = "V = (P × Y) ÷ M.";
    o = [[String(+V.toFixed(2)),`Right. ${P*Y} ÷ ${M} = ${+V.toFixed(2)}.`],[String(+(M/(P*Y)).toFixed(3)),"That’s flipped. Spending goes on top."],[String(P*Y),"That’s nominal GDP itself. Divide by M."],[String(+(Y/M).toFixed(2)),"That leaves out the price level."]];
  } else {
    const n = pick([3,4,5,6,7,8,9,10,12]), pi = pick([1,2,3,4,5,6]); const r = n - pi;
    q = `A loan’s nominal rate is ${n}% and inflation is ${pi}%. What is the real interest rate?`; L = 6; hint = "Real = nominal − inflation.";
    o = [[r + "%",`Right. ${n} − ${pi} = ${r}%.`],[(n+pi) + "%","That adds inflation. The real rate subtracts it."],[(+(n/pi).toFixed(2)) + "%","No division: subtract."],[(pi-n) + "%","Check the order: nominal minus inflation."]];
  }
  const seen = new Set(); o = o.filter(x => !seen.has(x[0]) && seen.add(x[0]));
  return {id:"gen", gen:true, L, q, o, a:0, hint, more:"New numbers every round. Keep going until it feels automatic."};
}

/* ---------- short answers ---------- */
const WRITE = [
 {q:"Explain the difference between the price level P and the value of money 1/P. What happens to the value of money during inflation?",
  keys:[["P is the number of dollars needed to buy a basket of goods",/dollars?.{0,30}(basket|goods)|price level/i],["1/P is the goods a dollar can buy (value of money)",/1\s?\/\s?p|value of money|goods.{0,20}(per|a|one) dollar/i],["Inflation lowers the value of money",/(inflation|p rises|prices rise).{0,60}(value of money|1\/p).{0,20}(fall|decreas|lower|drop|less)|(value of money|1\/p).{0,30}(fall|decreas|lower|drop)/i]],
  model:"The price level P is the number of dollars needed to buy a basket of goods and services. Its inverse, 1/P, is the number of baskets one dollar can buy: the value of money. During inflation P rises, so 1/P falls: each dollar buys less."},
 {q:"Using the supply and demand for money, explain why an increase in the money supply raises the price level.",
  keys:[["Money supply is vertical (set by the Fed)",/vertical|fixed|set by the fed|fed (sets|controls)/i],["Money demand slopes downward",/demand.{0,30}(slope|downward)/i],["At old prices there is an excess supply of money",/excess supply|more money than (they|people) (want|need)/i],["People spend it, so prices rise / value of money falls",/(spend|spending).{0,60}(price|p\b).{0,20}(rise|increas|up)|value of money.{0,20}(fall|decreas)/i]],
  model:"The money supply is a vertical line set by the Fed; money demand slopes downward against the value of money 1/P. When the Fed increases the money supply, at the old price level people hold more money than they want, an excess supply. They spend it (or deposit it and banks lend it), which pushes prices up. The value of money falls until a new equilibrium is reached with a higher price level."},
 {q:"What is the classical dichotomy? Give two nominal and two real variables.",
  keys:[["Separates nominal and real variables",/nominal.{0,40}real|real.{0,40}nominal/i],["Nominal = measured in money",/(nominal).{0,40}(dollar|money|monetary)/i],["Real = measured in goods/physical units",/(real).{0,40}(goods|physical|units|corrected)/i],["Correct examples",/(nominal gdp|cpi|nominal wage|nominal interest).{0,200}(real gdp|unemployment|real wage|real interest)|(real gdp|unemployment|real wage|real interest).{0,200}(nominal gdp|cpi|nominal wage|nominal interest)/i]],
  model:"The classical dichotomy is the separation of economic variables into nominal variables, measured in units of money, and real variables, measured in physical units. Nominal examples are nominal GDP and the CPI; real examples are real GDP and the unemployment rate."},
 {q:"Explain monetary neutrality using Hume’s example of redefining a foot.",
  keys:[["Money changes don’t affect real variables",/(not|don.t|doesn.t|no) (affect|change).{0,30}real|real.{0,40}(unchanged|unaffected|same)/i],["Doubling money doubles prices",/doubl.{0,60}(price|p\b)/i],["Foot analogy: unit changes, height doesn’t",/(foot|feet|inch).{0,120}(same|not.{0,10}taller|unit)/i],["Holds in the long run",/long run/i]],
  model:"Monetary neutrality says changes in the money supply don’t affect real variables. If the money supply doubles, prices double, but the economy produces the same goods and services. It’s like redefining a foot as 6 inches: everyone becomes ‘twice as tall’ in feet but is physically the same height. Most economists accept neutrality in the long run."},
 {q:"Write the quantity equation, define each term, and explain how it shows that money growth causes inflation.",
  keys:[["M × V = P × Y",/m\s?[×x*]\s?v\s?=\s?p\s?[×x*]\s?y/i],["Defines terms (velocity, real GDP, price level)",/velocity.{0,200}(real gdp|output)|(real gdp|output).{0,200}velocity/i],["Velocity is stable",/(velocity|v).{0,20}(stable|constant)/i],["Y set by resources, so P rises",/(labor|capital|resources|factors|technology)/i]],
  model:"The quantity equation is M × V = P × Y, where M is the money supply, V is velocity (how many times a dollar is spent per year), P is the price level and Y is real GDP, so P × Y is nominal GDP. Velocity is fairly stable, so an increase in M raises nominal GDP. Real GDP is determined by labor, capital, natural resources and technology, not by money. So the extra spending shows up as a higher price level: inflation."},
 {q:"What is the inflation tax, and why do hyperinflations usually occur?",
  keys:[["Revenue from printing/creating money",/(print|creat).{0,20}money|money creation/i],["Paid by money holders (money loses value)",/(hold|holders).{0,40}money|money.{0,40}(lose|loses|value)/i],["Government can’t raise enough through taxes",/(can.t|cannot|unable|not able).{0,40}tax/i],["Often during or after war",/war/i]],
  model:"The inflation tax is the revenue a government raises by creating money. As prices rise, money loses value, so everyone holding money effectively pays. Hyperinflations usually happen when a government must finance large spending, often during or after a war, but cannot raise enough through normal taxes, so it prints money."},
 {q:"Explain the Fisher effect with a numerical example.",
  keys:[["Real = nominal − inflation (or nominal = real + inflation)",/(real).{0,30}(=|equals).{0,30}nominal|nominal.{0,30}(=|equals).{0,30}real/i],["Real rate unchanged by money growth",/real (interest )?rate.{0,40}(unchanged|same|not change|doesn.t change|constant)/i],["Higher inflation → higher nominal rate one for one",/(inflation).{0,60}(nominal).{0,30}(rise|increas|higher|up)/i],["A numerical example",/\d+\s?%/]],
  model:"The real interest rate equals the nominal rate minus inflation, so the nominal rate equals the real rate plus inflation. Under monetary neutrality, money growth doesn’t change the real rate. So if inflation rises from 2% to 5% and the real rate stays at 3%, the nominal rate rises from 5% to 8%. Nominal interest rates move one for one with inflation: the Fisher effect."},
 {q:"Describe three costs of inflation and explain why the ‘loss of purchasing power’ argument is mostly a fallacy.",
  keys:[["Wages/incomes rise with prices",/(wage|income).{0,40}(rise|increas|go up)/i],["Shoe-leather costs",/shoe.?leather|trips to the bank|atm/i],["Menu costs or relative-price variability",/menu|relative.?price/i],["Tax distortions, confusion, or redistribution",/tax|confus|redistribut|borrower|lender/i]],
  model:"Many people think inflation erodes purchasing power, but nominal wages and incomes rise along with prices, so real incomes are unchanged under monetary neutrality. Real costs include shoe-leather costs (resources spent holding less cash), menu costs (the cost of changing prices) and relative-price variability (prices drifting out of line, misallocating resources). Inflation also distorts taxes, causes confusion, and redistributes wealth arbitrarily."},
 {q:"Explain how inflation interacts with taxes to reduce saving, using the lecture’s example.",
  keys:[["Real rate 4%, so nominal is 4% or 12%",/12\s?%|4\s?%/],["Tax is on nominal interest",/nominal.{0,40}tax|tax.{0,40}nominal/i],["After-tax real return 3% vs 1%",/3\s?%.{0,80}1\s?%|1\s?%.{0,80}3\s?%/],["Less saving",/sav(e|ing).{0,30}(less|lower|discourag|reduc)|(less|lower|discourag|reduc).{0,30}sav/i]],
  model:"Suppose the real interest rate is 4% and interest income is taxed at 25%. With zero inflation, the nominal rate is 4%, tax is 1%, and the after-tax real return is 3%. With 8% inflation, the Fisher effect makes the nominal rate 12%; tax is 3%, leaving 9% after tax, and subtracting 8% inflation gives only a 1% real return. Because the tax falls on nominal interest, inflation lowers the reward for saving, so people save less."},
 {q:"Why does unexpected inflation redistribute wealth? Why might deflation be even worse?",
  keys:[["Loans are set in nominal terms with expected inflation",/expect/i],["Higher-than-expected inflation helps borrowers / hurts lenders",/(higher|more).{0,40}(borrower|debtor).{0,20}(win|gain|benefit|help)|lender.{0,20}(lose|hurt)/i],["Lower-than-expected helps lenders",/(lower|less).{0,60}(lender|bank).{0,20}(win|gain|benefit)|borrower.{0,20}(lose|hurt)/i],["Deflation hurts borrowers in downturns",/deflation.{0,80}(borrower|debt|farmer|homeowner)/i]],
  model:"Loans are set in nominal terms based on expected inflation. If you borrow at 7% expecting 3% inflation, you expect a 4% real rate. If inflation turns out to be 1%, your real rate is 6%: the bank wins and you lose. If inflation is 5%, your real rate is 2%: you win and the bank loses. Deflation can be worse because it raises the real burden of debts, hurting borrowers such as farmers in the Great Depression and homeowners, who are often already struggling in a downturn."}
];
const WTAG = [0,1,3,3,4,5,6,7,8];
