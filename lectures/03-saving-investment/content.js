/* Lecture 3: Saving, Investment and the Financial System — lab content (loaded after assets/lab.js) */

const CARDS = [
 ["Financial system","The institutions that help match one person’s saving with another person’s investment.",""],
 ["Savers and borrowers","Savers spend less than they earn and supply funds; borrowers spend more than they earn and demand funds.",""],
 ["Financial markets","Institutions through which savers supply funds directly to borrowers: direct finance.","The bond market and the stock market."],
 ["Bond","A certificate of indebtedness that specifies the borrower’s obligations to the bondholder: maturity date and interest rate.","Ford: $1,000, 5%, maturing in 2030 → $50 a year, then $1,000 back."],
 ["Term","The length of time until a bond matures. Longer-term bonds usually pay higher interest.",""],
 ["Credit risk","The probability that the borrower fails to pay interest or principal (default). Riskier bonds pay higher interest.","Junk bonds pay the most; U.S. government bonds the least."],
 ["Municipal bonds","Bonds issued by state and local governments. Their interest is exempt from federal income tax, so they pay lower rates.",""],
 ["Stock","A claim to partial ownership in a firm and a share of its profits, paid partly as dividends.","1,000,000 shares → each owns 1/1,000,000 of the business."],
 ["Debt finance vs equity finance","Raising money by selling bonds (debt) vs selling stock (equity).",""],
 ["Stock index","An average of stock prices.","The Dow Jones (30 major firms) and the S&P 500 (500 large firms)."],
 ["Financial intermediaries","Institutions through which savers supply funds indirectly to borrowers: indirect finance.","Banks and mutual funds."],
 ["Bank","Takes deposits and makes loans, profiting by charging more on loans than it pays on deposits. Deposits also serve as a medium of exchange.",""],
 ["Mutual fund","Sells shares to savers and buys a portfolio of stocks and bonds, offering diversification and professional management.",""],
 ["Diversification","Spreading savings across many assets so a loss on any one matters less.",""],
 ["National saving","S = Y − C − G: income not consumed by households or bought by the government. In a closed economy, S = I.",""],
 ["Private saving","Y − T − C: what households have left after taxes and consumption.",""],
 ["Public saving","T − G: tax revenue left after government purchases.","Positive = budget surplus; negative = budget deficit."],
 ["Market for loanable funds","Where savers supply funds and borrowers demand them. The interest rate balances the two.",""],
 ["Crowding out","A fall in investment caused by government borrowing pushing up interest rates.",""],
 ["Government debt","The total of government bonds outstanding: the accumulation of past deficits.",""]
];
const CNOTE = {
 "Government debt":"🕒 Today: federal debt held by the public is around 100% of GDP, its highest since just after World War II."
};
const TB = new Set(["c6a","c6b","c7a","c7b","q14","q15","q16","q17","q18"]);
const TODAY = {};

/* ---------- helpers ---------- */
const kv = (label, val) => `<div class="info" style="display:flex;justify-content:space-between;gap:10px;padding:8px 12px"><span style="color:var(--ink)">${label}</span><b style="margin:0;white-space:nowrap">${val}</b></div>`;
const bn = v => (v < 0 ? "−$" : "$") + Math.abs(+v.toFixed(2)) + " billion";
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
const numIn = (cls, val) => `<input type="text" class="${cls}" value="${val}" inputmode="decimal" autocomplete="off" style="width:100%;min-width:0;font:600 16px var(--sans);padding:6px 4px;text-align:center;border:1.5px solid var(--border);border-radius:8px;background:var(--surface);color:var(--ink)">`;

/* ---------- loanable funds diagram ----------
   Supply (saving):     Q = 10 + sS + 10r
   Demand (investment): Q = 110 + dS − 10r          equilibrium r = 5%, Q = 60 */
const lfEq = (sS, dS) => { const r = (100 + dS - sS)/20; return {r, Q:10 + sS + 10*r}; };
function lf(o){
  const w = 340, hh = 230, L = 40, R = 12, T = 14, B = 30, X = q => L + q/120*(w-L-R), Y = r => (hh-B) - r/10*(hh-T-B);
  const line = (pts, col, faded, label, at) => { const P = pts.filter(p => p[0] >= 0 && p[0] <= 120 && p[1] >= 0 && p[1] <= 10); const lp = at === "start" ? P[0] : P[P.length-1];
    let lx = X(lp[0]) + 4, anc = "start"; if (lx > w - 40){ lx = X(lp[0]) - 4; anc = "end"; }
    return `<polyline points="${P.map(p => `${X(p[0]).toFixed(1)},${Y(p[1]).toFixed(1)}`).join(" ")}" style="fill:none;stroke:${faded ? "var(--border)" : col};stroke-width:${faded ? 2 : 3}${faded ? ";stroke-dasharray:6 5" : ""}"/>` + (label ? `<text x="${lx}" y="${Math.max(26, Y(lp[1]) - 6)}" text-anchor="${anc}" class="sm halo" style="font-weight:700;fill:${faded ? "var(--muted)" : col}">${label}</text>` : ""); };
  const rs = []; for (let r = 0.2; r <= 9.8; r += 0.2) rs.push(r);
  let out = "";
  (o.s || []).forEach(s => out += line(rs.map(r => [10 + s.sh + 10*r, r]), "var(--note)", s.faded, s.label));
  (o.d || []).forEach(d => out += line(rs.map(r => [110 + d.sh - 10*r, r]), "var(--gold)", d.faded, d.label, "start"));
  const pts = (o.pts || []).map(p => `<line x1="${L}" y1="${Y(p.r)}" x2="${X(p.Q)}" y2="${Y(p.r)}" style="stroke:var(--muted);stroke-dasharray:3 3"/><line x1="${X(p.Q)}" y1="${Y(p.r)}" x2="${X(p.Q)}" y2="${hh-B}" style="stroke:var(--muted);stroke-dasharray:3 3"/>
    <text x="${L-4}" y="${Y(p.r)+4}" text-anchor="end" class="sm" style="font-weight:700">${+p.r.toFixed(1)}%</text><text x="${X(p.Q)}" y="${hh-B+14}" text-anchor="middle" class="sm" style="font-weight:700">${+p.Q.toFixed(0)}</text>
    <circle cx="${X(p.Q)}" cy="${Y(p.r)}" r="5.5" style="fill:${p.old ? "var(--surface)" : "var(--wrong)"};stroke:${p.old ? "var(--muted)" : "var(--surface)"};stroke-width:2"/>`).join("");
  const gap = o.gap ? `<line x1="${X(o.gap.a)}" y1="${Y(o.gap.r)}" x2="${X(o.gap.b)}" y2="${Y(o.gap.r)}" style="stroke:var(--wrong);stroke-width:3"/><text x="${(X(o.gap.a)+X(o.gap.b))/2}" y="${Y(o.gap.r)-8}" text-anchor="middle" class="sm halo" style="font-weight:700;fill:var(--wrong)">${o.gap.label}</text><text x="${L-4}" y="${Y(o.gap.r)+4}" text-anchor="end" class="sm" style="font-weight:700">${o.gap.r}%</text>` : "";
  return `<svg class="chart" viewBox="0 0 ${w} ${hh}" role="img" aria-label="Market for loanable funds">
    <line x1="${L}" y1="${T}" x2="${L}" y2="${hh-B}" style="stroke:var(--ink);stroke-width:1.5"/><line x1="${L}" y1="${hh-B}" x2="${w-R}" y2="${hh-B}" style="stroke:var(--ink);stroke-width:1.5"/>
    <text x="${L+4}" y="${T+10}" class="sm mute">interest rate</text><text x="${w-R}" y="${hh-4}" text-anchor="end" class="sm mute">loanable funds ($ billions)</text>
    ${out}${gap}${pts}</svg>`;
}

/* ---------- graphics ---------- */
function figFinSort(el){
  sortActivity(el, "Direct or indirect finance?", "Do savers supply funds directly to borrowers (financial markets), or through a middleman (financial intermediaries)?", [
    ["You buy a bond newly issued by Ford.","d","Buying a bond directly from the borrower: the bond market, direct finance."],
    ["You deposit your paycheck in a bank, which lends it to a small business.","i","The bank stands between you and the borrower: indirect finance."],
    ["You buy newly issued shares of a company’s stock.","d","The stock market: direct finance (equity)."],
    ["You buy shares of a mutual fund that holds 300 stocks.","i","The fund pools savers’ money and picks the assets: a financial intermediary."],
    ["A city sells municipal bonds to residents.","d","Savers lend directly to the city through the bond market."]
  ], [["d","Direct (financial market)"],["i","Indirect (intermediary)"]], () => "Does a middleman decide where your money goes?");
}
function figBond(el){
  el.innerHTML = `<div class="figt">How a bond pays you</div><p class="figsub">The lecture’s example: Ford issues a $1,000 bond at 5%, maturing in 2030. Change the numbers.</p>
    <div class="orgrow"><label class="small">Principal ($)${numIn("bd-p", 1000)}</label><label class="small">Interest rate (%)${numIn("bd-r", 5)}</label></div>
    <label for="bd-t" style="display:flex;justify-content:space-between;margin-top:8px"><span>Term (years)</span><b class="bd-tv"></b></label><input type="range" id="bd-t" min="1" max="10" step="1" value="5">
    <div class="bd-rows"></div><div class="stack bd-v" style="margin-top:8px"></div><p class="cap bd-cap" aria-live="polite"></p>`;
  const P = el.querySelector(".bd-p"), Rt = el.querySelector(".bd-r"), Tm = el.querySelector("#bd-t");
  const up = () => { const p = +P.value || 0, r = +Rt.value || 0, t = +Tm.value, c = p*r/100;
    el.querySelector(".bd-tv").textContent = t;
    el.querySelector(".bd-rows").innerHTML = Array.from({length:t}, (_,i) => { const amt = c + (i === t-1 ? p : 0), big = Math.max(c + p, 1); return `<div class="lrow" style="grid-template-columns:64px 1fr 84px"><span>Year ${i+1}</span><span class="b" style="width:${amt/big*100}%;background:${i === t-1 ? "var(--gold)" : "var(--note)"}"></span><span class="v">$${amt.toLocaleString("en-US",{maximumFractionDigits:2})}</span></div>`; }).join("");
    el.querySelector(".bd-v").innerHTML = kv("Interest each year", "$" + c.toLocaleString("en-US",{maximumFractionDigits:2})) + kv("Total received", "$" + (c*t + p).toLocaleString("en-US",{maximumFractionDigits:2}));
    el.querySelector(".bd-cap").innerHTML = `You lend $${p.toLocaleString("en-US")} and get $${c.toLocaleString("en-US",{maximumFractionDigits:2})} of interest every year. In year ${t}, the bond <b>matures</b>: you get the last interest payment <b>plus</b> your principal back.`; };
  [P, Rt].forEach(x => x.oninput = up); Tm.oninput = up; up();
}
function figBondRates(el){
  sortActivity(el, "Which bond pays the higher interest rate?", "Use the three characteristics: term, credit risk, tax treatment.", [
    ["A 30-year bond, or a 6-month bond from the same borrower?","a","Longer term: bondholders wait longer for their principal, so they’re paid more."],
    ["A U.S. Treasury bond, or a junk bond from a shaky company?","b","Higher credit risk: lenders need extra interest to compensate for possible default."],
    ["A corporate bond, or a municipal bond with the same risk and term?","a","Municipal bond interest is exempt from federal income tax, so munis can pay less."],
    ["A bond from a strong blue-chip firm, or one from a firm close to bankruptcy?","b","More default risk, higher interest."]
  ], [["a","The first one"],["b","The second one"]], () => "Which one makes the lender wait longer, take more risk, or pay more tax?");
}
function figStockBond(el){
  let yr = 1;
  el.innerHTML = `<div class="figt">Bondholder vs stockholder</div><p class="figsub">You hold either a $1,000 Ford bond at 5%, or $1,000 of Ford stock. How does Ford’s year affect you?</p>
    <div class="seg" role="group" aria-label="Ford's profits" style="grid-template-columns:repeat(3,1fr)"><button type="button" aria-pressed="false" data-y="0" style="font-size:14px;padding:8px 4px">Bad year</button><button type="button" aria-pressed="true" data-y="1" style="font-size:14px;padding:8px 4px">Normal year</button><button type="button" aria-pressed="false" data-y="2" style="font-size:14px;padding:8px 4px">Great year</button></div>
    <div class="orgrow sb-b"></div><p class="cap sb-cap"></p>`;
  const draw = () => { const div = [10, 50, 120][yr], price = [700, 1000, 1400][yr];
    el.querySelector(".sb-b").innerHTML = `<div class="node"><div style="font-size:26px">📜</div><b>Bond (debt)</b><small>Interest: <b>$50</b><br>Principal back: <b>$1,000</b></small></div><div class="node gold"><div style="font-size:26px">📈</div><b>Stock (equity)</b><small>Dividend: <b>$${div}</b><br>Value now: <b>$${price.toLocaleString("en-US")}</b></small></div>`;
    el.querySelector(".sb-cap").innerHTML = yr === 0 ? "In a bad year, the bondholder still gets a fixed $50 and the principal back (unless Ford goes bankrupt), while the stockholder’s dividend and share price fall." :
      yr === 2 ? "In a great year, the stockholder shares in the higher profits, but the bondholder still gets only $50. That’s the downside of fixed payments." :
      "Bonds pay a fixed amount; stocks give you a share of the profits, up or down. (Numbers are illustrative.)"; };
  el.querySelectorAll(".seg button").forEach(b => b.onclick = () => { yr = +b.dataset.y; el.querySelectorAll(".seg button").forEach(x => x.setAttribute("aria-pressed", x === b)); draw(); });
  draw();
}
function figBank(el){
  el.innerHTML = `<div class="figt">How a bank makes money</div><p class="figsub">Savers deposit $1 million. The bank lends it all out. Set the rates.</p>
    <label for="bk-d" style="display:flex;justify-content:space-between"><span>Rate paid on deposits</span><b class="bk-dv"></b></label><input type="range" id="bk-d" min="0" max="6" step="0.5" value="2">
    <label for="bk-l" style="display:flex;justify-content:space-between"><span>Rate charged on loans</span><b class="bk-lv"></b></label><input type="range" id="bk-l" min="1" max="12" step="0.5" value="6">
    <div class="stack bk-v"></div><p class="cap bk-cap" aria-live="polite"></p>`;
  const d = el.querySelector("#bk-d"), l = el.querySelector("#bk-l");
  const up = () => { const D = +d.value, Lr = +l.value, earn = 10000*Lr, pay = 10000*D, sp = earn - pay;
    el.querySelector(".bk-dv").textContent = D + "%"; el.querySelector(".bk-lv").textContent = Lr + "%";
    el.querySelector(".bk-v").innerHTML = kv("Interest earned on loans", "$" + earn.toLocaleString("en-US")) + kv("Interest paid to depositors", "$" + pay.toLocaleString("en-US")) + kv("Left to cover costs and profit", `<span style="color:${sp > 0 ? "var(--right)" : "var(--wrong)"}">${sp < 0 ? "−" : ""}$${Math.abs(sp).toLocaleString("en-US")}</span>`);
    el.querySelector(".bk-cap").innerHTML = sp > 0 ? `The bank covers its costs and profits from the <b>spread</b>: ${Lr}% − ${D}% = ${(Lr-D).toFixed(1)} percentage points. The money still belongs to the depositors; the bank is the middleman.` : "If the bank charges borrowers no more than it pays depositors, it can’t cover its costs."; };
  d.oninput = up; l.oninput = up; up();
}
function figDiversify(el){
  el.innerHTML = `<div class="figt">Why mutual funds diversify</div><p class="figsub">You invest $10,000, split evenly across some number of stocks. One company collapses and its stock becomes worthless.</p>
    <label for="dv-n" style="display:flex;justify-content:space-between"><span>Number of stocks you own</span><b class="dv-nv"></b></label><input type="range" id="dv-n" min="1" max="100" step="1" value="1">
    <div class="dv-dots" style="font-size:12px;line-height:1.5;margin:8px 0;word-break:break-all" aria-hidden="true"></div>
    <div style="display:flex;justify-content:space-between;align-items:baseline"><span>Money left</span><span class="bignum dv-v"></span></div><div class="meter"><span class="dv-b"></span></div>
    <p class="cap dv-cap" aria-live="polite"></p>`;
  const s = el.querySelector("#dv-n");
  const up = () => { const n = +s.value, left = 10000*(1 - 1/n);
    el.querySelector(".dv-nv").textContent = n;
    el.querySelector(".dv-dots").innerHTML = "🟥" + "🟩".repeat(Math.min(n-1, 99));
    el.querySelector(".dv-v").textContent = "$" + Math.round(left).toLocaleString("en-US"); el.querySelector(".dv-b").style.width = (left/100) + "%";
    el.querySelector(".dv-cap").innerHTML = n === 1 ? "With everything in one stock, one collapse wipes you out." : `Spread across ${n} stocks, one collapse costs you only ${(100/n).toFixed(n > 10 ? 1 : 0)}% of your savings. A mutual fund makes this <b>diversification</b> easy, and adds a professional manager to pick the assets.`; };
  s.oninput = up; up();
}
function figAccounts(el){
  const D0 = {Y:15, C:9, G:1.5, T:1};
  el.innerHTML = `<div class="figt">Saving and investment in a closed economy</div><p class="figsub">The lecture’s example (billions of dollars). Change any number.</p>
    <div class="orgrow" style="grid-template-columns:repeat(4,1fr)">${["Y","C","G","T"].map(k => `<label class="small" style="text-align:center">${k}${numIn("ac-" + k, D0[k])}</label>`).join("")}</div>
    <div class="derive ac-f" style="margin-top:10px"></div><p class="cap ac-cap" aria-live="polite"></p><button type="button" class="btn ghost ac-reset" style="margin-top:8px">Back to the lecture’s numbers</button>`;
  const v = k => +el.querySelector(".ac-" + k).value || 0;
  const up = () => { const Y = v("Y"), C = v("C"), G = v("G"), T = v("T"), I = Y - C - G, S = I, pr = Y - T - C, pu = T - G;
    el.querySelector(".ac-f").innerHTML = `Investment I = Y − C − G = ${Y} − ${C} − ${G} = <b>${bn(I)}</b><br>National saving S = Y − C − G = <b>${bn(S)}</b> (= I)<br>Private saving = Y − T − C = ${Y} − ${T} − ${C} = <b>${bn(pr)}</b><br>Public saving = T − G = ${T} − ${G} = <b>${bn(pu)}</b>`;
    el.querySelector(".ac-cap").innerHTML = `Private saving (${bn(pr)}) plus public saving (${bn(pu)}) = national saving (${bn(S)}). ` + (pu < 0 ? `Public saving is negative: the government runs a <b>budget deficit</b> of ${bn(-pu)}.` : pu > 0 ? `Public saving is positive: a <b>budget surplus</b>.` : "Public saving is zero: a <b>balanced budget</b>."); };
  el.querySelectorAll(".orgrow input").forEach(x => x.oninput = up);
  el.querySelector(".ac-reset").onclick = () => { Object.keys(D0).forEach(k => el.querySelector(".ac-" + k).value = D0[k]); up(); };
  up();
}
function figLF(el){
  el.innerHTML = `<div class="figt"><span class="modeltag">📘 Textbook model, as in the lecture</span><br>The market for loanable funds</div><p class="figsub">Supply comes from saving; demand comes from investment. Try the lecture’s 3% and 7% cases.</p>
    <label for="lf-r" style="display:flex;justify-content:space-between"><span>Interest rate</span><b class="lf-rv"></b></label><input type="range" id="lf-r" min="2" max="8" step="1" value="5">
    <div class="lf-c"></div><p class="cap lf-cap" aria-live="polite"></p>`;
  const s = el.querySelector("#lf-r");
  const up = () => { const r = +s.value, Sq = 10 + 10*r, Dq = 110 - 10*r;
    el.querySelector(".lf-rv").textContent = r + "%";
    el.querySelector(".lf-c").innerHTML = lf({s:[{sh:0, label:"Supply (saving)"}], d:[{sh:0, label:"Demand (investment)"}], pts: r === 5 ? [{r:5, Q:60}] : [], gap: r === 5 ? null : {a:Math.min(Sq,Dq), b:Math.max(Sq,Dq), r, label: r < 5 ? "Shortage" : "Surplus"}});
    el.querySelector(".lf-cap").innerHTML = r === 5 ? "<b>Equilibrium</b> at 5%: saving and investment are both $60 billion." :
      r < 5 ? `At ${r}%, borrowers want $${Dq} billion but savers offer only $${Sq} billion: a <b>shortage</b>. The interest rate is pushed <b>up</b>, encouraging saving and discouraging borrowing, back to 5%.` :
      `At ${r}%, savers offer $${Sq} billion but borrowers want only $${Dq} billion: a <b>surplus</b>. The interest rate is pushed <b>down</b>, back to 5%. This is the “invisible hand” matching saving and investment.`; };
  s.oninput = up; up();
}
function figPolicies(el){
  let K = "save";
  const SC = {
    save:{t:"Saving incentives (bigger tax-advantaged retirement accounts)", sS:20, dS:0, steps:["Start at equilibrium: r = 5%, $60 billion.","Step 1–2: higher after-tax returns make saving more attractive, so <b>supply shifts right</b>.","Step 3: the interest rate <b>falls</b> to 4% and the quantity of loanable funds (saving and investment) <b>rises</b> to $70 billion."]},
    inv:{t:"Investment incentives (an investment tax credit)", sS:0, dS:20, steps:["Start at equilibrium: r = 5%, $60 billion.","Step 1–2: firms want to borrow more at every rate to build factories and buy equipment, so <b>demand shifts right</b>.","Step 3: the interest rate <b>rises</b> to 6% and the quantity of loanable funds <b>rises</b> to $70 billion."]},
    def:{t:"A government budget deficit", sS:-20, dS:0, steps:["Start with a balanced budget: r = 5%, $60 billion.","Step 1–2: the deficit is negative public saving, so national saving falls and <b>supply shifts left</b>.","Step 3: the interest rate <b>rises</b> to 6% and the quantity falls to $50 billion. Fewer families buy homes and fewer firms invest: <b>crowding out</b>."]}
  };
  const top = `<div class="seg" role="group" aria-label="Policy" style="grid-template-columns:repeat(3,1fr)"><button type="button" aria-pressed="true" data-k="save" style="font-size:14px;padding:8px 4px">Saving incentive</button><button type="button" aria-pressed="false" data-k="inv" style="font-size:14px;padding:8px 4px">Investment incentive</button><button type="button" aria-pressed="false" data-k="def" style="font-size:14px;padding:8px 4px">Budget deficit</button></div>`;
  const sp = stepper(el, {title:'<span class="modeltag">📘 Textbook model, as in the lecture</span><br>Policies in the loanable funds market', top, n:() => 3, draw:(i, st) => {
    const s = SC[K], e = lfEq(s.sS, s.dS);
    const o = i === 0 ? {s:[{sh:0, label:"S"}], d:[{sh:0, label:"D"}], pts:[{r:5, Q:60}]} :
      {s: s.sS ? [{sh:0, label:"S₁", faded:true},{sh:s.sS, label:"S₂"}] : [{sh:0, label:"S"}], d: s.dS ? [{sh:0, label:"D₁", faded:true},{sh:s.dS, label:"D₂"}] : [{sh:0, label:"D"}], pts: i === 1 ? [{r:5, Q:60, old:true}] : [{r:5, Q:60, old:true},{r:e.r, Q:e.Q}]};
    st.innerHTML = `<div class="scen" style="font-size:16px">${s.t}</div>` + lf(o);
    return s.steps[i];
  }});
  el.querySelectorAll(".seg button").forEach(b => b.onclick = () => { K = b.dataset.k; el.querySelectorAll(".seg button").forEach(x => x.setAttribute("aria-pressed", x === b)); sp.reset(); });
}

/* ---------- lessons ---------- */
const STEPS = [
 { title:"The financial system", html:`
   <p>Saving funds investment, investment builds capital, and capital raises productivity. But at any moment, some people want to save while others want to borrow and invest. The ${g("Financial system","financial system")} matches them.</p>
   <div class="stack">
     <div class="info"><b>${g("Savers and borrowers","Savers")}</b><span>Spend less than they earn; supply funds, expecting them back with interest.</span></div>
     <div class="info"><b>Borrowers</b><span>Spend more than they earn; demand funds, expecting to repay with interest.</span></div>
   </div>
   <div class="stack">
     <div class="info"><b>${g("Financial markets","Financial markets")}: direct finance</b><span>The bond market and the stock market.</span></div>
     <div class="info"><b>${g("Financial intermediaries","Financial intermediaries")}: indirect finance</b><span>Banks and mutual funds.</span></div>
   </div>
   <div class="fig" data-fig="finsort"></div>`,
   check:[
    {id:"c1a", q:"Buying a bond directly from a company is an example of…", a:0,
     o:[["Direct finance through a financial market","Correct."],["Indirect finance through an intermediary","No middleman stands between you and the company."],["Government spending","It’s a private loan to a company."]],
     hint:"Is there a middleman?", more:"Banks and mutual funds are indirect finance."},
    {id:"c1b", q:"The main job of the financial system is to…", a:2,
     o:[["Print money","That’s the central bank’s job, covered in Lecture 6."],["Collect taxes","That’s the government."],["Move funds from savers to borrowers","Correct."]],
     hint:"Who has extra funds, and who needs them?", more:"That’s how saving becomes investment."}
   ]},
 { title:"The bond market", html:`
   <p>A ${g("Bond","bond")} is a certificate of indebtedness. It specifies the <b>maturity date</b> (when the principal is repaid) and the <b>interest rate</b> paid until then.</p>
   <div class="fig" data-fig="bond"></div>
   <h3>Three characteristics that set the interest rate</h3>
   <div class="stack">
     <div class="info"><b>${g("Term")}</b><span>Longer-term bonds usually pay more, to compensate for waiting longer.</span></div>
     <div class="info"><b>${g("Credit risk","Credit risk")}</b><span>The chance of default. U.S. government bonds pay the least; junk bonds pay the most.</span></div>
     <div class="info"><b>Tax treatment</b><span>${g("Municipal bonds","Municipal bonds")}’ interest is free of federal income tax, so they pay lower rates.</span></div>
   </div>
   <div class="fig" data-fig="bondrates"></div>`,
   check:[
    {id:"c2a", q:"A $1,000 bond pays 5% a year for 3 years. What do you receive in year 3?", a:2,
     o:[["$50","That’s each year’s interest, but in the last year something else comes back too."],["$1,000","You also get that year’s interest."],["$1,050","Correct. The last $50 of interest plus the $1,000 principal."]],
     hint:"Slide the term to 3 years and look at the last bar.", more:"Total received: $1,150."},
    {id:"c2b", q:"Why do junk bonds pay higher interest than U.S. Treasury bonds?", a:1,
     o:[["Because they have longer terms","Term isn’t what makes a bond ‘junk.’"],["Because their credit risk is higher","Correct. Lenders need extra pay for the chance of default."],["Because their interest is tax-free","That’s municipal bonds, which pay less."]],
     hint:"What does ‘junk’ say about the issuer?", more:"Treasuries are considered very safe."}
   ]},
 { title:"The stock market", html:`
   <p>A ${g("Stock","stock")} is a claim to partial ownership in a firm and a share of its profits. If a company issues 1,000,000 shares, each share is a claim to 1/1,000,000 of the business. Firms pay some profits as <b>dividends</b>.</p>
   <p>Selling stock to raise money is <b>equity finance</b>; selling bonds is <b>debt finance</b>.</p>
   <div class="fig" data-fig="stockbond"></div>
   <p>The U.S. bond market is actually bigger than the stock market, but stock prices get more attention, because they’re closely tied to firms’ profits and the economy’s health. ${g("Stock index","Stock indexes")} like the Dow Jones Industrial Average (30 major firms) and the S&P 500 (500 large firms) track them.</p>`,
   check:[
    {id:"c3a", q:"The main advantage of a bond over a stock, for a saver, is…", a:0,
     o:[["Fixed interest and the principal back (barring bankruptcy)","Correct."],["Sharing in rising profits","That’s the stock’s advantage."],["Ownership of the firm","Bondholders are lenders, not owners."]],
     hint:"Toggle to a bad year.", more:"The downside: payments stay fixed even when profits soar."},
    {id:"c3b", q:"A company sells new shares of stock to build a factory. This is…", a:1,
     o:[["Debt finance","Debt finance means selling bonds."],["Equity finance","Correct."],["Indirect finance","Stock sold directly to savers is direct finance."]],
     hint:"Equity = ownership.", more:"Bonds are debt finance."}
   ]},
 { title:"Financial intermediaries", html:`
   <p>Through intermediaries, savers supply funds <b>indirectly</b>. The money still belongs to the savers.</p>
   <h3>${g("Bank","Banks")}</h3>
   <p>Banks charge more on loans than they pay on deposits. Deposits also work as a medium of exchange (you can write checks) as well as a store of value.</p>
   <div class="fig" data-fig="bank"></div>
   <h3>${g("Mutual fund","Mutual funds")}</h3>
   <p>Mutual funds sell shares to savers and use the money to buy a portfolio of stocks and bonds. Why not buy them yourself? <b>${g("Diversification")}</b>, and a professional manager.</p>
   <div class="fig" data-fig="div"></div>`,
   check:[
    {id:"c4a", q:"How does a bank cover its costs and earn a profit?", a:2,
     o:[["By keeping depositors’ money","The deposits still belong to depositors."],["By charging fees to the government","Not the main source."],["By charging a higher interest rate on loans than it pays on deposits","Correct."]],
     hint:"Look at the spread in the bank graphic.", more:"The difference is called the spread."},
    {id:"c4b", q:"The main benefit of a mutual fund’s diversification is that…", a:1,
     o:[["It guarantees high returns","No investment guarantees returns."],["A big loss on one stock or bond matters less","Correct."],["It avoids all taxes","Not the point of diversification."]],
     hint:"Slide from 1 stock to 50.", more:"Plus professional management."}
   ]},
 { title:"Saving and investment in the national accounts", html:`
   <p>In a closed economy (no trade, NX = 0), Y = C + I + G. Rearranged:</p>
   <div class="derive">Y − C − G = I<br>${g("National saving","National saving")}: S = Y − C − G<br><b>So S = I</b></div>
   <p>Let T be taxes minus transfer payments. Then national saving splits into two parts:</p>
   <div class="formula">S = (Y − T − C) + (T − G)</div>
   <div class="stack">
     <div class="info"><b>${g("Private saving","Private saving")} = Y − T − C</b><span>What households keep after taxes and consumption.</span></div>
     <div class="info"><b>${g("Public saving","Public saving")} = T − G</b><span>Positive: a budget surplus. Negative: a budget deficit.</span></div>
   </div>
   <div class="fig" data-fig="accounts"></div>`,
   check:[
    {id:"c5a", q:"Y = 15, C = 9, G = 1.5. In a closed economy, investment is…", a:1,
     o:[["$6 billion","That’s Y − C. Subtract G too."],["$4.5 billion","Correct. 15 − 9 − 1.5."],["$5 billion","That’s private saving."]],
     hint:"I = Y − C − G.", more:"And national saving S equals I."},
    {id:"c5b", q:"T = 1 and G = 1.5. Public saving is…", a:0,
     o:[["−$0.5 billion: a budget deficit","Correct."],["+$0.5 billion: a surplus","Check the order: T − G."],["$2.5 billion","Subtract, don’t add."]],
     hint:"Public saving = T − G.", more:"The lecture calls this “unfortunately realistic.”"}
   ]},
 { title:"The market for loanable funds", html:`
   <p>For any one person, saving doesn’t have to equal investment. For the whole economy, it must. What coordinates millions of decisions? The ${g("Market for loanable funds","market for loanable funds")}.</p>
   <div class="stack">
     <div class="info"><b>Supply comes from saving</b><span>A higher interest rate makes saving more attractive, so supply slopes up.</span></div>
     <div class="info"><b>Demand comes from investment</b><span>Households buying homes, firms buying equipment. A higher rate makes borrowing less attractive, so demand slopes down.</span></div>
   </div>
   <div class="fig" data-fig="lf"></div>`,
   check:[
    {id:"c6a", q:"If the interest rate is below equilibrium…", a:2,
     o:[["There’s a surplus of funds and the rate falls","At a low rate, borrowers want more than savers offer."],["Nothing happens","A shortage creates pressure."],["There’s a shortage of funds and the rate rises","Correct."]],
     hint:"Try 3% on the slider.", more:"Saving rises and borrowing falls until they match."},
    {id:"c6b", q:"In the market for loanable funds, the demand curve comes from…", a:1,
     o:[["Saving","Saving is supply."],["Investment","Correct: households buying homes and firms buying capital."],["Tax revenue","Taxes affect public saving, on the supply side."]],
     hint:"Who wants to borrow?", more:"Demand slopes down: higher rates discourage borrowing."}
   ]},
 { title:"Policies and the loanable funds market", html:`
   <p>For any policy, ask: (1) does it shift supply or demand? (2) Which way? (3) What happens to the equilibrium?</p>
   <div class="fig" data-fig="policies"></div>
   <h3>U.S. government debt</h3>
   <p>${g("Government debt","Government debt")} is the total of bonds outstanding from past deficits. Historically, debt rose during wars to pay for military spending, then fell as the government ran surpluses afterward. An exception: debt began rising again after President Reagan’s 1981 tax cuts, and has shown little sign of returning to zero.</p>
   ${tn("Debt began rising again after 1981 and shows little sign of returning to zero.","Federal debt held by the public is now around 100% of GDP, its highest level since just after World War II, after large deficits in the 2008–2009 recession and the 2020 pandemic.")}
   <p><b>Conclusion:</b> financial institutions let some people save and others borrow; in the economy as a whole saving equals investment, and the market for loanable funds coordinates individual decisions so they match.</p>`,
   check:[
    {id:"c7a", q:"A budget deficit, starting from a balanced budget, causes…", a:0,
     o:[["Supply to shift left, the interest rate to rise, and investment to fall","Correct: crowding out."],["Demand to shift right and the interest rate to rise","The deficit reduces saving, which is supply."],["The interest rate to fall","Less saving makes funds scarcer."]],
     hint:"A deficit is negative public saving. Which curve is saving?", more:"That fall in investment is crowding out."},
    {id:"c7b", q:"An investment tax credit causes the equilibrium interest rate to ___ and the quantity of loanable funds to ___.", a:2,
     o:[["Fall; rise","That’s a saving incentive."],["Rise; fall","That’s a budget deficit."],["Rise; rise","Correct. Demand shifts right."]],
     hint:"Use the ‘Investment incentive’ tab.", more:"Both saving and investment increase."}
   ]}
];
const FIGS = { finsort:figFinSort, bond:figBond, bondrates:figBondRates, stockbond:figStockBond, bank:figBank, div:figDiversify, accounts:figAccounts, lf:figLF, policies:figPolicies };

/* ---------- self-check ---------- */
const QUIZ = [
 {id:"q1", L:0, q:"Financial markets are institutions through which savers supply funds…", a:0, hint:"Direct or indirect?", o:[["Directly to borrowers","Right."],["Indirectly through banks","That’s intermediaries."],["Only to the government","They lend to firms too."],["Only abroad","Mostly domestic."]], more:"Bonds and stocks."},
 {id:"q2", L:0, q:"Which is a financial intermediary?", a:2, hint:"A middleman.", o:[["The stock market","A financial market."],["The bond market","A financial market."],["A mutual fund","Right."],["The Dow Jones index","An index, not an institution."]], more:"Banks are the other main example."},
 {id:"q3", L:1, q:"A bond’s principal is…", a:1, hint:"The amount borrowed.", o:[["The interest paid each year","That’s the coupon."],["The amount borrowed, repaid at maturity","Right."],["The bond’s market price today","Not the definition."],["The tax on interest","No."]], more:"Ford’s bond: $1,000."},
 {id:"q4", L:1, q:"Typically, longer-term bonds pay…", a:0, hint:"Waiting longer.", o:[["Higher interest","Right."],["Lower interest","Lenders want more for waiting."],["No interest","They pay interest."],["The same as short-term","Not typically."]], more:"To compensate for waiting."},
 {id:"q5", L:1, q:"Municipal bonds pay lower interest because…", a:3, hint:"Tax treatment.", o:[["They’re riskier","Risk would raise the rate."],["They have longer terms","Term isn’t the reason."],["They’re issued by banks","They’re issued by state and local governments."],["Their interest is exempt from federal income tax","Right."]], more:"Savers accept a lower rate."},
 {id:"q6", L:1, q:"Credit risk is…", a:1, hint:"Default.", o:[["The bond’s term","Different characteristic."],["The probability the borrower fails to pay","Right."],["The tax on interest","Different characteristic."],["The bond’s face value","No."]], more:"Higher risk, higher interest."},
 {id:"q7", L:2, q:"A stock represents…", a:2, hint:"Ownership.", o:[["A loan to the firm","That’s a bond."],["A bank deposit","No."],["Partial ownership of a firm","Right."],["A government guarantee","No."]], more:"And a claim on profits."},
 {id:"q8", L:2, q:"Selling bonds to raise money is called…", a:0, hint:"Bonds are debt.", o:[["Debt finance","Right."],["Equity finance","That’s selling stock."],["Indirect finance","Selling bonds directly is direct finance."],["Public saving","No."]], more:"Selling stock is equity finance."},
 {id:"q9", L:2, q:"The S&P 500 is…", a:3, hint:"An average.", o:[["A bank","No."],["A bond","No."],["A mutual fund","Some funds track it, but it isn’t one."],["A stock index of 500 large U.S. firms","Right."]], more:"The Dow tracks 30 firms."},
 {id:"q10", L:3, q:"Bank deposits serve as…", a:1, hint:"Two functions of money.", o:[["Only a store of value","You can also pay with them."],["Both a medium of exchange and a store of value","Right."],["Only a unit of account","Not the point."],["Neither","They do both."]], more:"Because you can write checks."},
 {id:"q11", L:3, q:"Why might a saver buy a mutual fund instead of individual stocks?", a:0, hint:"Two reasons.", o:[["Diversification and professional management","Right."],["Guaranteed returns","No guarantees."],["No risk at all","Risk is reduced, not eliminated."],["Higher interest than banks always","Not guaranteed."]], more:"A fall in one stock matters less."},
 {id:"q12", L:4, q:"In a closed economy, national saving equals…", a:2, hint:"Rearrange Y = C + I + G.", o:[["Y − C","Subtract G too."],["T − G","That’s public saving."],["Y − C − G, which equals I","Right."],["C + G","No."]], more:"S = I always holds."},
 {id:"q13", L:4, q:"Private saving equals…", a:1, hint:"Households after taxes and consumption.", o:[["T − G","Public saving."],["Y − T − C","Right."],["Y − C − G","National saving."],["I − S","No."]], more:"National = private + public."},
 {id:"q14", L:5, q:"The supply of loanable funds comes from…", a:3, hint:"Who has funds to lend?", o:[["Investment","That’s demand."],["Government spending","Not directly."],["Borrowers","They demand funds."],["Saving","Right."]], more:"Higher rates encourage saving."},
 {id:"q15", L:5, q:"If the interest rate is above equilibrium…", a:0, hint:"Savers offer more than borrowers want.", o:[["There’s a surplus of funds and the rate falls","Right."],["There’s a shortage and the rate rises","That’s below equilibrium."],["Investment rises","Higher rates lower investment."],["Saving falls","Higher rates raise saving."]], more:"The rate falls back to equilibrium."},
 {id:"q16", L:6, q:"A tax incentive for retirement saving…", a:2, hint:"It changes savers’ returns.", o:[["Shifts demand right and raises r","It affects savers, not borrowers."],["Shifts supply left","It encourages saving."],["Shifts supply right, lowering r and raising investment","Right."],["Has no effect","It raises after-tax returns."]], more:"Policy 1 in the lecture."},
 {id:"q17", L:6, q:"Crowding out refers to…", a:1, hint:"Government borrowing and interest rates.", o:[["Too many savers","No."],["Lower investment caused by government borrowing raising interest rates","Right."],["Banks refusing loans","Not the definition."],["Higher saving from tax cuts","No."]], more:"Caused by budget deficits."},
 {id:"q18", L:6, q:"Historically, U.S. government debt as a share of GDP rose mainly during…", a:3, hint:"Military spending.", o:[["Stock booms","Not in the lecture."],["Periods of surpluses","Debt falls then."],["Recessions only","Wars were the main story."],["Wars","Right."]], more:"With an exception after 1981."},
 {id:"q19", L:4, q:"If the government runs a budget surplus, public saving is…", a:0, hint:"T − G when T > G.", o:[["Positive","Right."],["Negative","That’s a deficit."],["Zero","That’s a balanced budget."],["Equal to investment","National saving equals investment, not public saving alone."]], more:"A surplus can be used to retire government debt."},
 {id:"q20", L:5, q:"In the market for loanable funds, the price is…", a:2, hint:"What adjusts to balance saving and borrowing?", o:[["The price level","That’s for goods markets."],["The exchange rate","That’s the foreign-exchange market."],["The interest rate","Right."],["Wages","That’s the labor market."]], more:"It’s the price of borrowing and the reward for saving."}
];
const ROUNDS = [["Round 1","The financial system and bonds",0],["Round 2","Stocks and intermediaries",5],["Round 3","National accounts and loanable funds",10],["Round 4","Loanable funds and policies",15],["Mixed round","5 random questions",-1],["My weak spots","Questions you’ve missed before, mixed up",-2],["Number drills","Saving, investment and bond problems with new numbers",-3]];
function genDrill(){
  const pick = a => a[Math.floor(Math.random()*a.length)];
  const kind = Math.floor(Math.random()*3); let q, o, L, hint;
  const Y = pick([10,12,15,20]), C = pick([6,7,8]), G = pick([1,1.5,2,2.5]), T = pick([0.5,1,1.5,2,3]);
  if (kind === 0){ const I = +(Y-C-G).toFixed(2); q = `Closed economy: Y = ${Y}, C = ${C}, G = ${G} (billions). What is investment?`; L = 4; hint = "I = Y − C − G.";
    o = [[bn(I),`Right. ${Y} − ${C} − ${G}.`],[bn(Y-C),"Subtract G too."],[bn(Y-C+G),"G is subtracted, not added."],[bn(+(Y-T-C).toFixed(2)),"That’s private saving; it uses T, not G."]]; }
  else if (kind === 1){ const pu = +(T-G).toFixed(2), pr = +(Y-T-C).toFixed(2);
    if (Math.random() < 0.5){ q = `Y = ${Y}, C = ${C}, T = ${T} (billions). What is private saving?`; L = 4; hint = "Private saving = Y − T − C.";
      o = [[bn(pr),`Right. ${Y} − ${T} − ${C}.`],[bn(Y-C),"Subtract taxes too."],[bn(+(Y-C-G).toFixed(2)),"That’s national saving."]]; }
    else { q = `T = ${T} and G = ${G} (billions). What is public saving?`; L = 4; hint = "Public saving = T − G.";
      o = [[bn(pu) + (pu < 0 ? " (deficit)" : pu > 0 ? " (surplus)" : " (balanced)"),`Right. ${T} − ${G}.`],[bn(-pu),"Check the order: T − G."],[bn(T+G),"Subtract, don’t add."]]; } }
  else { const P = pick([1000,5000,10000]), r = pick([2,3,4,5,6,8]), t = pick([2,3,5,10]); const c = P*r/100;
    q = `A $${P.toLocaleString("en-US")} bond pays ${r}% a year for ${t} years. How much do you receive in total?`; L = 1; hint = "Interest each year × years, plus the principal.";
    o = [["$" + (c*t + P).toLocaleString("en-US"),`Right. $${c.toLocaleString("en-US")} × ${t} + $${P.toLocaleString("en-US")}.`],["$" + (c*t).toLocaleString("en-US"),"Don’t forget the principal at maturity."],["$" + (P + c).toLocaleString("en-US"),"Interest is paid every year, not once."],["$" + Math.round(P*Math.pow(1+r/100,t)).toLocaleString("en-US"),"This bond pays interest out each year; it doesn’t compound."]]; }
  const seen = new Set(); o = o.filter(x => !seen.has(x[0]) && seen.add(x[0]));
  return {id:"gen", gen:true, L, q, o, a:0, hint, more:"New numbers every round."};
}

/* ---------- short answers ---------- */
const WRITE = [
 {q:"Explain the difference between financial markets and financial intermediaries, with two examples of each.",
  keys:[["Markets: direct finance",/direct/i],["Bond and stock markets",/bond.{0,40}stock|stock.{0,40}bond/i],["Intermediaries: indirect finance",/indirect/i],["Banks and mutual funds",/bank.{0,60}mutual|mutual.{0,60}bank/i]],
  model:"Financial markets are institutions through which savers supply funds directly to borrowers (direct finance); the most important are the bond market and the stock market. Financial intermediaries are institutions through which savers supply funds indirectly to borrowers (indirect finance); the most important are banks and mutual funds."},
 {q:"Describe the three characteristics of bonds and how each affects the interest rate.",
  keys:[["Term: longer → higher",/term|maturity/i],["Credit risk: riskier → higher (junk bonds)",/credit risk|default|junk/i],["Tax treatment: municipal → lower",/tax|municipal/i],["Direction of each effect",/higher|lower/i]],
  model:"A bond’s term is the time until maturity; longer-term bonds usually pay higher interest because bondholders wait longer for their principal. Credit risk is the probability of default; riskier bonds, such as junk bonds, pay higher interest than safe U.S. government bonds. Tax treatment matters too: municipal bonds’ interest is exempt from federal income tax, so they pay lower interest rates."},
 {q:"From a saver’s point of view, compare the advantages and disadvantages of bonds and stocks.",
  keys:[["Bond: fixed interest, principal back",/fixed|principal/i],["Bond downside: doesn’t rise with profits",/(profit).{0,60}(fixed|same|not)|even if/i],["Stock: dividends/price rise with profits",/(dividend|price).{0,60}(rise|increas).{0,40}profit|share.{0,30}profit/i],["Stock downside: falls with profits",/(fall|decreas|lower).{0,40}(profit)/i]],
  model:"A bond pays a fixed rate of interest and returns the principal for sure, except in the rare case of bankruptcy, but its payments stay fixed even if the firm’s profits rise. A stock’s dividends, and therefore its price, rise when the firm earns higher profits, but they fall when profits fall. Bonds offer more certainty; stocks offer a share in the firm’s success, with more risk."},
 {q:"Explain how banks earn profits and why savers use mutual funds instead of buying stocks and bonds themselves.",
  keys:[["Banks charge more on loans than they pay on deposits",/(loan).{0,60}(higher|more).{0,40}deposit|spread/i],["Deposits: medium of exchange and store of value",/medium of exchange|check/i],["Mutual funds diversify",/diversif/i],["Professional manager",/professional|manager/i]],
  model:"Banks cover their costs and earn profits by charging a higher interest rate on loans than they pay on deposits. Their deposits also serve as a medium of exchange, since savers can write checks, as well as a store of value. Mutual funds sell shares and buy a portfolio of many stocks and bonds, so a sharp fall in any one asset matters less (diversification), and they let savers delegate selection to a professional money manager."},
 {q:"Show why saving equals investment in a closed economy, and divide national saving into private and public saving.",
  keys:[["Y = C + I + G",/y\s?=\s?c\s?\+\s?i\s?\+\s?g/i],["S = Y − C − G = I",/s\s?=\s?y\s?(−|-)\s?c\s?(−|-)\s?g|s\s?=\s?i/i],["Private saving = Y − T − C",/y\s?(−|-)\s?t\s?(−|-)\s?c/i],["Public saving = T − G (surplus/deficit)",/t\s?(−|-)\s?g/i]],
  model:"In a closed economy, Y = C + I + G. Rearranging, Y − C − G = I. National saving is S = Y − C − G, so S = I. With T as taxes minus transfers, S = (Y − T − C) + (T − G): private saving, Y − T − C, is what households keep after taxes and consumption; public saving, T − G, is tax revenue left after government purchases. Positive public saving is a budget surplus; negative is a budget deficit."},
 {q:"Using the lecture’s numbers (Y = 15, C = 9, G = 1.5, T = 1, in billions), find investment, national saving, private saving and public saving.",
  keys:[["I = 4.5",/4\.5/],["S = 4.5",/s.{0,30}4\.5|saving.{0,40}4\.5/i],["Private saving = 5",/private.{0,40}\b5\b/i],["Public saving = −0.5 (deficit)",/(−|-)\s?\$?\s?0?\.5|deficit/i]],
  model:"Investment I = Y − C − G = 15 − 9 − 1.5 = $4.5 billion. National saving S = Y − C − G = $4.5 billion, equal to investment. Private saving = Y − T − C = 15 − 1 − 9 = $5 billion. Public saving = T − G = 1 − 1.5 = −$0.5 billion, so the government runs a budget deficit."},
 {q:"Explain how the market for loanable funds coordinates saving and investment, including what happens if the interest rate is too low or too high.",
  keys:[["Supply from saving, slopes up",/supply.{0,60}sav/i],["Demand from investment, slopes down",/demand.{0,60}invest/i],["Too low: shortage, rate rises",/(below|too low|3).{0,80}(shortage|rise|up)/i],["Too high: surplus, rate falls",/(above|too high|7).{0,80}(surplus|fall|down)/i]],
  model:"Savers supply loanable funds, and a higher interest rate makes saving more attractive, so supply slopes upward. Borrowers who want to invest demand funds, and a higher rate makes borrowing less attractive, so demand slopes downward. If the rate is below equilibrium, demand exceeds supply, and the shortage pushes the rate up; if it is above equilibrium, supply exceeds demand, and the surplus pushes it down. The interest rate adjusts until saving equals investment, coordinating individual decisions like an invisible hand."},
 {q:"Analyze the effects of a government budget deficit on the market for loanable funds, and explain crowding out.",
  keys:[["Deficit lowers public and national saving",/(public|national) saving.{0,30}(fall|decreas|lower|reduc)|negative public saving/i],["Supply shifts left",/supply.{0,30}left/i],["Interest rate rises, quantity falls",/(interest|rate).{0,20}(rise|increas)/i],["Investment falls: crowding out",/crowd/i]],
  model:"Starting from a balanced budget, a budget deficit means negative public saving, which reduces national saving. The supply of loanable funds shifts left, so the equilibrium interest rate rises and the quantity of loanable funds falls. At the higher interest rate, fewer families buy new homes and fewer firms buy new capital: investment falls. This reduction in investment caused by government borrowing is called crowding out."}
];
const WTAG = [0,1,2,3,4,4,5,6];
