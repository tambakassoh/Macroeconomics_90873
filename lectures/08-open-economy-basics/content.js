/* Lecture 8: Open-Economy Macroeconomics: Basic Concepts — lab content (loaded after assets/lab.js) */

const CARDS = [
 ["Closed economy","An economy that does not interact with other economies in the world.","No imports, no exports, no foreign investment."],
 ["Open economy","An economy that interacts freely with other economies around the world.","The U.S. buys and sells goods and assets abroad."],
 ["Exports","Goods and services produced at home and sold abroad.","A Boeing jet sold to Japan Airlines."],
 ["Imports","Goods and services produced abroad and sold at home.","A Toyota bought in Ohio."],
 ["Net exports","NX = value of exports − value of imports. Also called the trade balance.","Exports $3.0 trillion, imports $3.9 trillion: NX = −$0.9 trillion."],
 ["Trade deficit","When imports are greater than exports (NX < 0).","The U.S. has run trade deficits since about 1980."],
 ["Trade surplus","When exports are greater than imports (NX > 0).","Germany and China often run surpluses."],
 ["Balanced trade","When exports equal imports (NX = 0).",""],
 ["Net capital outflow","NCO = domestic residents’ purchases of foreign assets − foreigners’ purchases of domestic assets. Also called net foreign investment.","An American buys Toyota stock (+); a Japanese fund buys U.S. bonds (−)."],
 ["Foreign direct investment","Capital investment that is owned and actively managed by a foreign entity.","McDonald’s opens a restaurant in Moscow."],
 ["Foreign portfolio investment","Buying foreign stocks or bonds, supplying loanable funds to a foreign firm without managing it.","An American buys shares of a Japanese company."],
 ["NX = NCO","Every international transaction trades a good for an asset, so net exports always equal net capital outflow.","Boeing sells a jet for yen: NX rises and so does NCO."],
 ["S = I + NCO","National saving equals domestic investment plus net capital outflow.","If S < I, foreigners finance part of investment and NCO < 0."],
 ["Nominal exchange rate","The rate at which one country’s currency trades for another. Here: foreign currency per dollar.","e = 120 yen per dollar."],
 ["Appreciation","An increase in the value of a currency, measured by how much foreign currency it buys.","The dollar goes from 120 to 140 yen."],
 ["Depreciation","A decrease in the value of a currency, measured by how much foreign currency it buys.","The dollar goes from 120 to 100 yen."],
 ["Real exchange rate","The rate at which one country’s goods trade for another’s: (e × P) ÷ P*.","0.75 Japanese Big Macs per U.S. Big Mac."],
 ["Law of one price","The idea that a good should sell for the same price in all markets.","Coffee can’t stay $4 in Seattle and $5 in Boston if shipping is free."],
 ["Arbitrage","Buying a good where it is cheap and selling it where it is expensive to make a quick profit.","Buy coffee in Seattle, sell it in Boston."],
 ["Purchasing-power parity","The theory that a unit of any currency should buy the same quantity of goods in every country, so e = P* ÷ P.","A $24,000 Ford costs 720,000 rubles → e = 30 rubles per dollar."]
];
const CNOTE = {
 "Purchasing-power parity":"📘 Textbook model. It works best for long-run trends, not day-to-day exchange rates.",
 "Nominal exchange rate":"🕒 Today: exchange rates change every day. Check a current source for live rates."
};

const TB = new Set(["c7a","c7b","q17","q18","q19","q20"]);
const TODAY = {};

/* ---------- small helpers for this lecture ---------- */
const T = v => (v < 0 ? "−$" : "$") + Math.abs(+v.toFixed(2)) + " trillion";
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
      if (ok){
        if (first){ right++; body.querySelector(".tally span:last-child").textContent = right + " right"; }
        body.querySelectorAll(".choice").forEach(x => x.disabled = true); b.classList.add("right");
        body.querySelector(".fb").innerHTML = `<div class="why"><b class="ok">Yes.</b> ${items[k][2]}</div>`;
        const nb = h("button","btn","Next"); nb.type = "button"; nb.style.marginTop = "10px"; nb.onclick = () => { k++; draw(); }; body.appendChild(nb);
      } else {
        first = false; b.classList.add("wrong"); b.disabled = true;
        body.querySelector(".fb").innerHTML = `<div class="why"><b class="no">Not quite.</b> ${hintFn(items[k])} Try again.</div>`;
      }
    });
  };
  draw();
}
const kv = (label, val) => `<div class="info" style="display:flex;justify-content:space-between;gap:10px;padding:8px 12px"><span style="color:var(--ink)">${label}</span><b style="margin:0;white-space:nowrap">${val}</b></div>`;

/* ---------- graphics ---------- */
function figNX(el){
  el.innerHTML = `<div class="figt">Exports, imports and the trade balance</div><p class="figsub">Move the sliders (trillions of dollars per year).</p>
    <label for="nx-x" style="display:flex;justify-content:space-between"><span>Exports</span><b class="nx-xv"></b></label><input type="range" id="nx-x" min="1" max="5" step="0.1" value="3">
    <label for="nx-m" style="display:flex;justify-content:space-between"><span>Imports</span><b class="nx-mv"></b></label><input type="range" id="nx-m" min="1" max="5" step="0.1" value="3.9">
    <div class="lrow" style="grid-template-columns:72px 1fr 110px"><span>Exports</span><span class="b nx-xb" style="background:var(--note)"></span><span class="v nx-xt"></span></div>
    <div class="lrow" style="grid-template-columns:72px 1fr 110px"><span>Imports</span><span class="b nx-mb" style="background:var(--gold)"></span><span class="v nx-mt"></span></div>
    <div style="display:flex;justify-content:space-between;align-items:baseline;margin-top:10px"><span>Net exports (NX)</span><span class="bignum nx-v"></span></div>
    <p class="cap nx-cap" aria-live="polite"></p>`;
  const x = el.querySelector("#nx-x"), m = el.querySelector("#nx-m");
  const up = () => { const X = +x.value, M = +m.value, nx = +(X-M).toFixed(1);
    el.querySelector(".nx-xv").textContent = T(X); el.querySelector(".nx-mv").textContent = T(M);
    el.querySelector(".nx-xb").style.width = X*20 + "%"; el.querySelector(".nx-mb").style.width = M*20 + "%";
    el.querySelector(".nx-xt").textContent = "$" + X + "T"; el.querySelector(".nx-mt").textContent = "$" + M + "T";
    const v = el.querySelector(".nx-v"); v.textContent = (nx > 0 ? "+" : "") + T(nx); v.style.color = nx < 0 ? "var(--wrong)" : nx > 0 ? "var(--right)" : "var(--note)";
    el.querySelector(".nx-cap").innerHTML = nx < 0 ? `Imports are bigger than exports: a <b>trade deficit</b> of ${T(-nx)}.` : nx > 0 ? `Exports are bigger than imports: a <b>trade surplus</b> of ${T(nx)}.` : `Exports equal imports: <b>balanced trade</b>.`; };
  x.oninput = up; m.oninput = up; up();
}
function figNXEvents(el){
  sortActivity(el, "What happens to U.S. net exports?", "From the lecture’s Active Learning, plus a few more.", [
    ["Canada goes into a recession.","d","Canadians have less income, so they buy fewer U.S. exports. NX falls."],
    ["U.S. shoppers decide to buy “Made in the U.S.A.”","u","Americans buy fewer imports, so NX rises."],
    ["Prices in Mexico rise faster than prices in the U.S.","u","U.S. goods look cheaper: exports to Mexico rise and imports fall. NX rises."],
    ["U.S. incomes rise in a boom.","d","Americans buy more of everything, including imports. NX falls."],
    ["Japanese viewers start streaming far more U.S. films.","u","That’s more U.S. service exports. NX rises."]
  ], [["u","NX rises ↑"],["d","NX falls ↓"]], () => "Ask: does this change exports or imports, and which way?");
}
function figNCO(el){
  sortActivity(el, "Which way does U.S. NCO move?", "NCO = Americans buying foreign assets − foreigners buying U.S. assets.", [
    ["McDonald’s opens a restaurant in Moscow.","u","Americans acquire a foreign asset they actively manage: <b>foreign direct investment</b>. NCO rises."],
    ["An American buys shares of Toyota.","u","Americans buy a foreign asset: <b>foreign portfolio investment</b>. NCO rises."],
    ["A Japanese pension fund buys U.S. Treasury bonds.","d","Foreigners buy a U.S. asset, so NCO falls (a capital inflow)."],
    ["Honda builds and runs a factory in Ohio.","d","Foreign direct investment <i>into</i> the U.S. NCO falls."],
    ["A U.S. mutual fund buys German government bonds.","u","Portfolio investment abroad. NCO rises."]
  ], [["u","NCO rises ↑"],["d","NCO falls ↓"]], () => "Who is buying the asset, and where is the asset?");
}
function figIdentity(el){
  let mode = "keep";
  const SEQ = {
    keep:[{nx:100, nco:0, a:"Boeing sells a jet to Japan Airlines for ¥ worth $100 million.", cap:"U.S. exports rise by $100 million, so <b>NX = +100</b>. But Boeing was paid in yen…"},
          {nx:100, nco:100, a:"Boeing keeps the yen in a Japanese bank.", cap:"Holding yen means owning a <b>foreign asset</b>, so <b>NCO = +100</b>. NX = NCO."}],
    stock:[{nx:100, nco:0, a:"Boeing sells a jet to Japan Airlines for ¥ worth $100 million.", cap:"<b>NX = +100</b>. What will Boeing do with the yen?"},
           {nx:100, nco:100, a:"Boeing uses the yen to buy Sony stock.", cap:"Sony stock is a foreign asset: <b>NCO = +100</b>. Again NX = NCO."}],
    swap:[{nx:100, nco:0, a:"Boeing sells a jet to Japan Airlines for ¥ worth $100 million.", cap:"<b>NX = +100</b>."},
          {nx:100, nco:100, a:"Boeing trades the yen to a U.S. firm for dollars.", cap:"Now that U.S. firm holds the foreign asset (yen): <b>NCO = +100</b>."},
          {nx:0, nco:0, a:"The U.S. firm spends the yen on Japanese machines.", cap:"Those machines are <b>imports</b> (−100), so NX falls back to 0, and the yen asset is gone, so NCO is 0 too. <b>Still NX = NCO.</b>"}]
  };
  const top = `<div class="seg" role="group" aria-label="What happens to the yen" style="grid-template-columns:1fr 1fr 1fr"><button type="button" aria-pressed="true" data-m="keep">Keep yen</button><button type="button" aria-pressed="false" data-m="stock">Buy stock</button><button type="button" aria-pressed="false" data-m="swap">Swap & import</button></div>`;
  const sp = stepper(el, {title:"Why net exports always equal net capital outflow", top, n:() => SEQ[mode].length, draw:(i, st) => {
    const s = SEQ[mode][i];
    st.innerHTML = `<div class="tx tx-ok pop" style="margin-top:0">✈️ <span>${s.a}</span></div>
      <div class="orgrow" style="margin-top:10px"><div class="node"><small>Net exports (NX)</small><b class="pop" style="font-size:24px">${s.nx > 0 ? "+" : ""}${s.nx}</b><small>$ million</small></div><div class="node gold"><small>Net capital outflow (NCO)</small><b class="pop" style="font-size:24px">${s.nco > 0 ? "+" : ""}${s.nco}</b><small>$ million</small></div></div>`;
    return s.cap;
  }});
  el.querySelectorAll(".seg button").forEach(b => b.onclick = () => { mode = b.dataset.m; el.querySelectorAll(".seg button").forEach(x => x.setAttribute("aria-pressed", x === b)); sp.reset(); });
}
function figSI(el){
  el.innerHTML = `<div class="figt">Saving, investment and the trade balance</div><p class="figsub">S = I + NCO, and NCO = NX. Shares of GDP.</p>
    <label for="si-s" style="display:flex;justify-content:space-between"><span>National saving (S)</span><b class="si-sv"></b></label><input type="range" id="si-s" min="10" max="25" step="1" value="17">
    <label for="si-i" style="display:flex;justify-content:space-between"><span>Domestic investment (I)</span><b class="si-iv"></b></label><input type="range" id="si-i" min="10" max="25" step="1" value="21">
    <div class="lrow" style="grid-template-columns:90px 1fr 50px"><span>Saving</span><span class="b si-sb" style="background:var(--note)"></span><span class="v si-st"></span></div>
    <div class="lrow" style="grid-template-columns:90px 1fr 50px"><span>Investment</span><span class="b si-ib" style="background:var(--gold)"></span><span class="v si-it"></span></div>
    <div class="orgrow" style="margin-top:10px"><div class="node"><small>NCO = S − I</small><b class="si-n" style="font-size:22px"></b></div><div class="node"><small>NX (trade balance)</small><b class="si-x" style="font-size:22px"></b></div></div>
    <p class="cap si-cap" aria-live="polite"></p>`;
  const s = el.querySelector("#si-s"), i = el.querySelector("#si-i");
  const up = () => { const S = +s.value, I = +i.value, n = S - I;
    el.querySelector(".si-sv").textContent = S + "%"; el.querySelector(".si-iv").textContent = I + "%";
    el.querySelector(".si-sb").style.width = S*4 + "%"; el.querySelector(".si-ib").style.width = I*4 + "%";
    el.querySelector(".si-st").textContent = S + "%"; el.querySelector(".si-it").textContent = I + "%";
    el.querySelector(".si-n").textContent = (n > 0 ? "+" : "") + n + "%"; el.querySelector(".si-x").textContent = (n > 0 ? "+" : "") + n + "%";
    el.querySelector(".si-cap").innerHTML = n < 0 ? `Investment is bigger than saving. Foreigners finance the gap of ${-n}% of GDP by buying U.S. assets: a <b>capital inflow</b> (NCO < 0) and a <b>trade deficit</b> (NX < 0). This is the U.S. pattern since about 1980.` :
      n > 0 ? `Saving is bigger than investment. The extra ${n}% of GDP flows abroad as <b>net capital outflow</b>, matched by a <b>trade surplus</b>.` : `Saving equals investment: NCO = 0 and trade is balanced.`; };
  s.oninput = up; i.oninput = up; up();
}
function figE(el){
  el.innerHTML = `<div class="figt">The dollar in yen</div><p class="figsub">e = yen per dollar. Start at ¥120 per $ and move it.</p>
    <label for="e-s" style="display:flex;justify-content:space-between"><span>Exchange rate (e)</span><b class="e-v"></b></label><input type="range" id="e-s" min="80" max="160" step="10" value="120">
    <div class="stack">${["$1 buys","A $20 U.S. T-shirt costs Japanese buyers","A ¥3,000 Japanese lunch costs Americans"].map((t,k) => `<div class="info" style="display:flex;justify-content:space-between;gap:10px;padding:8px 12px"><span style="color:var(--ink)">${t}</span><b class="e-r${k}" style="margin:0;white-space:nowrap"></b></div>`).join("")}</div>
    <p class="cap e-cap" aria-live="polite"></p>`;
  const s = el.querySelector("#e-s");
  const up = () => { const e = +s.value;
    el.querySelector(".e-v").textContent = "¥" + e + " per $";
    el.querySelector(".e-r0").textContent = "¥" + e; el.querySelector(".e-r1").textContent = "¥" + (20*e).toLocaleString("en-US"); el.querySelector(".e-r2").textContent = $$(+(3000/e).toFixed(2));
    el.querySelector(".e-cap").innerHTML = e === 120 ? "The starting point. Move the slider to see the dollar appreciate or depreciate." :
      e > 120 ? `The dollar <b>appreciated</b> (it buys more yen). Japanese lunches got cheaper for Americans, but U.S. T-shirts got pricier in Japan, so <b>U.S. exports are harder to sell</b>.` :
      `The dollar <b>depreciated</b> (it buys fewer yen). U.S. T-shirts got cheaper in Japan, so <b>U.S. exports are easier to sell</b>, while Japanese goods cost Americans more.`; };
  s.oninput = up; up();
}
function figReal(el){
  const PRE = {mac:{e:120,P:2.5,Ps:400,us:"U.S. Big Mac",fo:"Japanese Big Mac",cur:"yen",sym:"¥"}, latte:{e:10,P:3,Ps:24,us:"U.S. latte",fo:"Mexican latte",cur:"pesos",sym:""}};
  let k = "mac";
  el.innerHTML = `<div class="figt">Compute a real exchange rate</div>
    <div class="seg" role="group" aria-label="Example"><button type="button" aria-pressed="true" data-k="mac">Big Mac (yen)</button><button type="button" aria-pressed="false" data-k="latte">Latte (pesos)</button></div>
    <div class="orgrow"><label class="small">e (foreign per $)<input type="number" class="re-e" inputmode="decimal" style="width:100%;font:600 17px var(--sans);padding:8px;border:1.5px solid var(--border);border-radius:8px;background:var(--surface);color:var(--ink)"></label>
      <label class="small">U.S. price P ($)<input type="number" class="re-p" step="0.25" inputmode="decimal" style="width:100%;font:600 17px var(--sans);padding:8px;border:1.5px solid var(--border);border-radius:8px;background:var(--surface);color:var(--ink)"></label></div>
    <label class="small" style="display:block;margin-top:8px">Foreign price P* <span class="re-cur"></span><input type="number" class="re-ps" inputmode="decimal" style="width:100%;font:600 17px var(--sans);padding:8px;border:1.5px solid var(--border);border-radius:8px;background:var(--surface);color:var(--ink)"></label>
    <div class="derive re-steps" style="margin-top:12px"></div><p class="cap re-cap" aria-live="polite"></p>`;
  const E = el.querySelector(".re-e"), Pp = el.querySelector(".re-p"), Ps = el.querySelector(".re-ps");
  const load = () => { const p = PRE[k]; E.value = p.e; Pp.value = p.P; Ps.value = p.Ps; el.querySelector(".re-cur").textContent = "(" + p.cur + ")"; up(); };
  const up = () => { const p = PRE[k], e = +E.value, P = +Pp.value, s = +Ps.value; if (!(e > 0 && P > 0 && s > 0)) return;
    const fp = e*P, r = fp/s;
    el.querySelector(".re-steps").innerHTML = `Step 1: e × P = ${e} × $${P} = <b>${+fp.toFixed(2)} ${p.cur}</b> for a ${p.us}<br>Step 2: (e × P) ÷ P* = ${+fp.toFixed(2)} ÷ ${s} = <b>${+r.toFixed(3)}</b>`;
    el.querySelector(".re-cap").innerHTML = `Real exchange rate = <b>${+r.toFixed(2)} ${p.fo}s per ${p.us}</b>. To buy one ${p.us}, a foreigner gives up what would buy ${+r.toFixed(2)} ${p.fo}s at home. ${r > 1 ? "U.S. goods are relatively expensive." : r < 1 ? "U.S. goods are relatively cheap." : "Prices are equal: purchasing-power parity holds."}`; };
  [E,Pp,Ps].forEach(x => x.oninput = up);
  el.querySelectorAll(".seg button").forEach(b => b.onclick = () => { k = b.dataset.k; el.querySelectorAll(".seg button").forEach(x => x.setAttribute("aria-pressed", x === b)); load(); });
  load();
}
function figArb(el){
  const ST = [[4,5,"Coffee sells for $4 a pound in Seattle and $5 in Boston, and shipping is free."],[4.25,4.75,"Traders <b>buy in Seattle</b> (raising the price there) and <b>sell in Boston</b> (lowering the price there). That’s <b>arbitrage</b>."],[4.5,4.5,"They keep going until the prices are equal. One good, one price: the <b>law of one price</b>."]];
  stepper(el, {title:"Arbitrage: Seattle vs Boston coffee", n:() => ST.length, draw:(i, st) => {
    const [a,b] = ST[i];
    st.innerHTML = `<div class="lrow" style="grid-template-columns:80px 1fr 60px"><span>☕ Seattle</span><span class="b" style="width:${a*18}%;transition:width .5s"></span><span class="v">${$$(a)}</span></div>
      <div class="lrow" style="grid-template-columns:80px 1fr 60px"><span>☕ Boston</span><span class="b" style="width:${b*18}%;background:var(--gold);transition:width .5s"></span><span class="v">${$$(b)}</span></div>
      <p class="small" style="margin:10px 0 0">Profit per pound from arbitrage: <b>${$$(+(b-a).toFixed(2))}</b></p>`;
    return ST[i][2];
  }});
}
function figPPP(el){
  el.innerHTML = `<div class="figt"><span class="modeltag">📘 Textbook model, as in the lecture</span><br>PPP: what should the exchange rate be?</div>
    <p class="figsub">If a basket costs the same everywhere, e × P = P*, so <b>e = P* ÷ P</b>.</p>
    <div class="derive">Ford Escape: P = $24,000 in the U.S., P* = 720,000 rubles in Russia<br>e = 720,000 ÷ 24,000 = <b>30 rubles per dollar</b></div>
    <h3>Inflation moves exchange rates</h3>
    <p class="figsub">Start at 20 pesos per dollar. Choose yearly inflation in each country for 5 years.</p>
    <label for="pp-u" style="display:flex;justify-content:space-between"><span>U.S. inflation</span><b class="pp-uv"></b></label><input type="range" id="pp-u" min="0" max="10" step="1" value="2">
    <label for="pp-m" style="display:flex;justify-content:space-between"><span>Mexico inflation</span><b class="pp-mv"></b></label><input type="range" id="pp-m" min="0" max="30" step="1" value="10">
    <div style="display:flex;justify-content:space-between;align-items:baseline"><span>PPP exchange rate after 5 years</span><span class="bignum pp-e"></span></div>
    <p class="cap pp-cap" aria-live="polite"></p>`;
  const u = el.querySelector("#pp-u"), m = el.querySelector("#pp-m");
  const up = () => { const pu = +u.value, pm = +m.value, e = 20*Math.pow((1+pm/100)/(1+pu/100), 5);
    el.querySelector(".pp-uv").textContent = pu + "%"; el.querySelector(".pp-mv").textContent = pm + "%"; el.querySelector(".pp-e").textContent = e.toFixed(1) + " pesos/$";
    el.querySelector(".pp-cap").innerHTML = pm > pu ? `Mexican prices (P*) rise faster than U.S. prices (P), so e = P*/P rises: <b>the dollar appreciates</b> and <b>the peso depreciates</b>. Higher inflation → a weaker currency.` :
      pm < pu ? `U.S. prices rise faster, so e falls: <b>the dollar depreciates</b> against the peso.` : `Equal inflation: the exchange rate stays at 20.`; };
  u.oninput = up; m.oninput = up; up();
}
function figTradable(el){
  sortActivity(el, "Easy to trade across borders?", "PPP only works well for goods that can be shipped and arbitraged.", [
    ["A haircut","n","You can’t ship a haircut, so price gaps can’t be arbitraged away."],
    ["Crude oil","t","Shipped worldwide; its price is very similar everywhere."],
    ["A movie ticket","n","A service used locally. Prices can differ a lot between cities and countries."],
    ["Wheat","t","A standard commodity traded globally."],
    ["A restaurant dinner","n","Prepared and eaten locally."],
    ["Smartphones","t","Easy to ship, though taxes and brands still create some differences."]
  ], [["t","Easy to trade"],["n","Hard to trade"]], () => "Could you buy it in one country and resell it in another?");
}


/* ---------- historical charts (data embedded in the Lecture 8 PowerPoint, quarterly, % of GDP) ---------- */
const HIST = {"trade":{"EXP/Y":{"x":1960.0,"y":[4.93,5.25,5.1,5.25,5.21,5.08,4.95,5.03,4.91,5.26,4.92,4.79,4.83,5.3,4.9,5.08,5.26,5.28,5.19,5.36,4.76,5.52,5.09,5.28,5.11,5.32,5.09,5.25,5.38,5.29,5.07,5.15,5.17,5.24,5.38,5.26,4.58,5.52,5.35,5.62,5.59,5.87,5.74,5.8,5.75,5.64,5.74,5.24,5.76,5.48,5.72,5.91,6.29,6.7,7.02,7.52,8.07,8.53,8.36,8.8,9.01,8.52,8.07,8.31,8.1,8.13,8.26,8.28,8.02,8.07,7.86,7.48,7.66,8.19,8.19,8.5,8.59,8.74,9.01,9.54,9.86,10.17,10.22,10.03,10.01,10.0,9.52,9.54,9.21,9.09,8.54,8.01,8.01,7.83,7.76,7.77,7.7,7.74,7.69,7.65,7.42,7.26,6.94,7.04,7.12,7.1,7.13,7.37,7.3,7.57,7.8,8.02,8.45,8.68,8.8,8.87,9.03,9.27,9.19,9.22,9.42,9.42,9.5,9.73,9.77,9.93,9.98,10.13,10.13,9.97,10.04,9.91,9.86,9.88,9.74,9.86,9.85,10.03,10.34,10.46,10.68,10.84,11.14,11.12,11.1,11.01,10.89,11.27,11.3,11.54,11.59,11.39,11.21,10.9,10.58,10.72,10.48,10.5,10.62,10.7,10.84,10.95,11.17,10.98,10.79,10.26,9.68,9.26,9.27,9.49,9.54,9.4,9.3,9.19,9.25,9.62,9.82,9.94,9.92,10.09,10.2,10.37,10.27,10.46,10.73,10.91,10.97,11.3,11.43,11.56,11.94,12.33,12.7,13.3,13.31,11.99,10.83,10.83,11.21,11.84,12.17,12.47,12.54,12.95,13.34]},"IMP/Y":{"x":1960.0,"y":[4.42,4.47,4.33,4.14,4.11,4.06,4.24,4.25,4.22,4.27,4.25,4.31,4.18,4.24,4.28,4.23,4.16,4.2,4.24,4.34,4.1,4.48,4.41,4.54,4.54,4.64,4.82,4.81,4.82,4.74,4.72,4.89,5.05,5.02,5.24,5.15,4.56,5.4,5.26,5.29,5.26,5.34,5.37,5.5,5.35,5.66,5.75,5.38,6.07,5.83,5.93,6.16,6.4,6.53,6.55,6.89,7.63,8.71,8.83,8.8,7.96,7.18,7.34,7.51,7.84,8.15,8.48,8.63,9.1,9.13,8.85,8.88,9.46,9.18,9.21,9.18,9.33,9.62,9.9,10.55,11.17,10.73,10.02,10.26,10.48,10.44,9.75,10.0,9.72,9.23,9.45,8.9,8.73,9.13,9.57,9.71,10.19,10.41,10.3,10.32,9.65,10.02,9.73,10.16,10.03,10.04,10.23,10.31,10.36,10.72,10.86,11.01,10.97,10.79,10.75,10.94,10.94,10.92,10.56,10.72,10.98,10.6,10.77,11.07,10.55,10.3,10.3,10.48,10.43,10.47,10.61,10.6,10.69,10.82,10.75,10.93,11.01,11.32,11.69,11.87,12.14,12.35,12.15,12.05,12.26,12.22,12.34,12.37,12.62,12.56,12.73,12.76,12.77,12.76,12.55,12.68,12.8,13.21,13.63,13.85,14.53,14.61,15.12,15.02,14.68,13.79,13.24,12.7,12.84,13.43,13.61,13.86,13.92,13.77,13.69,14.08,14.53,15.09,15.24,15.75,15.67,15.89,16.03,16.57,16.61,16.76,16.96,16.55,16.68,16.77,16.91,17.2,17.86,18.5,18.57,16.13,13.5,13.22,14.1,14.82,15.49,16.17,16.27,16.28,17.15]}},"saving":{"S/Y":{"x":1960.0,"y":[17.44,15.94,15.67,14.11,14.41,15.06,15.71,15.77,16.21,16.07,15.78,14.95,15.67,16.15,15.84,16.24,16.61,16.33,16.23,16.5,17.29,17.4,17.18,17.03,17.67,17.43,16.68,16.88,16.37,15.58,15.7,15.84,15.73,16.08,15.35,15.53,16.23,16.07,16.19,15.68,15.15,15.43,15.22,14.45,16.0,15.96,16.09,15.42,15.93,16.51,16.79,16.73,17.31,18.13,17.85,18.61,17.31,16.81,15.76,16.48,14.98,14.85,15.03,15.25,15.77,16.13,15.92,15.83,15.76,16.64,17.32,16.86,16.66,17.95,18.31,18.89,18.79,18.63,18.26,17.77,17.23,16.69,16.12,16.85,17.99,17.44,18.42,17.76,16.02,16.24,15.24,13.69,13.96,14.26,14.29,15.43,16.14,16.15,16.34,15.78,15.26,14.85,14.29,14.53,14.52,14.09,13.21,13.28,13.53,13.23,13.09,14.17,13.6,14.1,14.11,13.98,14.59,14.46,14.35,14.04,13.85,14.04,13.54,12.59,12.63,12.79,13.02,13.35,12.79,13.25,13.15,13.27,13.4,13.29,13.09,13.55,13.92,14.42,13.97,14.4,14.43,13.89,14.1,14.4,14.15,14.54,14.77,14.89,14.9,15.71,15.68,15.49,15.82,15.06,15.13,15.36,15.36,14.63,14.48,14.54,13.71,14.54,13.93,13.7,12.85,12.97,12.65,11.75,11.94,11.6,11.35,10.97,10.73,10.67,11.07,11.51,11.27,11.46,11.43,11.34,11.74,11.38,11.24,11.51,11.84,11.77,11.36,11.55,11.26,11.41,11.36,10.95,10.19,9.81,9.31,9.28,9.0,8.52,8.08,8.48,8.72,8.93,9.2,8.91,8.61]},"I/Y":{"x":1960.0,"y":[16.91,15.15,14.88,13.0,13.31,14.06,15.0,14.97,15.52,15.07,15.14,14.5,15.02,15.09,15.23,15.37,15.5,15.27,15.29,15.48,16.63,16.35,16.51,16.29,17.09,16.76,16.42,16.45,15.81,15.04,15.35,15.59,15.59,15.86,15.2,15.42,16.2,15.95,16.09,15.34,14.82,14.9,14.86,14.14,15.6,15.98,16.1,15.56,16.23,16.85,17.0,16.97,17.41,17.94,17.39,17.99,16.88,16.99,16.21,16.47,13.94,13.51,14.3,14.45,15.51,16.16,16.13,16.18,16.85,17.7,18.32,18.26,18.46,18.94,19.33,19.57,19.53,19.51,19.15,18.78,18.55,17.24,15.92,17.08,18.45,17.88,18.66,18.22,16.53,16.38,16.15,14.58,14.69,15.57,16.1,17.37,18.64,18.82,18.95,18.45,17.49,17.61,17.08,17.65,17.43,17.02,16.31,16.22,16.59,16.38,16.15,17.16,16.12,16.22,16.06,16.05,16.49,16.1,15.73,15.54,15.42,15.22,14.82,13.93,13.4,13.15,13.35,13.69,13.09,13.75,13.72,13.96,14.23,14.23,14.11,14.62,15.09,15.71,15.32,15.81,15.88,15.4,15.11,15.34,15.32,15.74,16.21,15.99,16.23,16.73,16.82,16.86,17.38,16.92,17.1,17.32,17.68,17.34,17.49,17.69,17.39,18.2,17.89,17.74,16.74,16.5,16.21,15.2,15.51,15.55,15.42,15.43,15.35,15.25,15.5,15.97,15.98,16.61,16.75,16.99,17.21,16.9,17.0,17.62,17.72,17.62,17.35,16.8,16.52,16.63,16.34,15.82,15.35,15.0,14.58,13.43,11.68,10.9,10.97,11.47,12.04,12.63,12.93,12.25,12.42]},"NCO/Y":{"x":1960.0,"y":[0.53,0.8,0.79,1.11,1.1,1.0,0.71,0.8,0.69,0.99,0.64,0.46,0.65,1.06,0.61,0.87,1.11,1.06,0.94,1.02,0.66,1.05,0.68,0.74,0.58,0.67,0.26,0.43,0.56,0.54,0.35,0.26,0.14,0.22,0.15,0.11,0.03,0.12,0.1,0.34,0.33,0.53,0.36,0.3,0.4,-0.02,-0.01,-0.14,-0.3,-0.34,-0.21,-0.24,-0.1,0.19,0.46,0.62,0.44,-0.18,-0.46,0.01,1.04,1.35,0.72,0.81,0.26,-0.03,-0.22,-0.35,-1.09,-1.06,-1.0,-1.4,-1.8,-0.99,-1.02,-0.68,-0.74,-0.88,-0.89,-1.01,-1.31,-0.55,0.2,-0.23,-0.47,-0.44,-0.24,-0.46,-0.51,-0.14,-0.91,-0.89,-0.72,-1.31,-1.82,-1.94,-2.5,-2.67,-2.61,-2.67,-2.23,-2.76,-2.79,-3.12,-2.91,-2.94,-3.1,-2.94,-3.06,-3.15,-3.06,-2.99,-2.51,-2.12,-1.95,-2.07,-1.91,-1.64,-1.38,-1.5,-1.56,-1.18,-1.27,-1.34,-0.77,-0.36,-0.32,-0.35,-0.3,-0.49,-0.57,-0.7,-0.83,-0.94,-1.02,-1.08,-1.17,-1.29,-1.36,-1.41,-1.45,-1.5,-1.01,-0.94,-1.17,-1.2,-1.45,-1.1,-1.33,-1.02,-1.14,-1.37,-1.56,-1.86,-1.97,-1.96,-2.32,-2.71,-3.01,-3.15,-3.69,-3.66,-3.95,-4.05,-3.89,-3.53,-3.56,-3.45,-3.57,-3.94,-4.07,-4.46,-4.63,-4.58,-4.44,-4.46,-4.71,-5.15,-5.32,-5.65,-5.47,-5.51,-5.76,-6.11,-5.88,-5.85,-5.99,-5.25,-5.26,-5.22,-4.98,-4.87,-5.15,-5.2,-5.27,-4.15,-2.67,-2.39,-2.89,-2.99,-3.32,-3.7,-3.73,-3.33,-3.81]}}};
function figHist(el, key){
  const C = key === "trade"
    ? {title:"U.S. exports and imports, 1960–2011", sub:"Data from the lecture’s chart. Percent of GDP.", ser:[["EXP/Y","Exports","var(--note)"],["IMP/Y","Imports","var(--gold)"]], start:1990}
    : {title:"U.S. saving, investment and NCO, 1960–2011", sub:"Data from the lecture’s chart. Percent of GDP.", ser:[["S/Y","Saving","var(--note)"],["I/Y","Investment","var(--gold)"],["NCO/Y","NCO","var(--wrong)"]], start:2006};
  const D = HIST[key], on = {}; C.ser.forEach(s => on[s[0]] = true);
  const yr = i => D[C.ser[0][0]].x + i*0.25, N = D[C.ser[0][0]].y.length;
  el.innerHTML = `<div class="figt">${C.title}</div><p class="figsub">${C.sub} Tap a series to hide or show it, and slide to explore a year.</p>
    <div class="rchips">${C.ser.map(s => `<button type="button" class="chipbtn" aria-pressed="true" data-s="${s[0]}"><span style="display:inline-block;width:12px;height:4px;background:${s[2]};vertical-align:middle;margin-right:6px"></span>${s[1]}</button>`).join("")}</div>
    <div class="hc-c"></div>
    <label style="display:flex;justify-content:space-between" for="hc-y-${key}"><span>Year</span><b class="hc-yv"></b></label>
    <input type="range" id="hc-y-${key}" min="1960" max="2011" step="1" value="${C.start}">
    <div class="stack hc-v"></div><p class="small muted">Historical figures from the Lecture 8 slides; the data end in 2011.</p>`;
  const sl = el.querySelector("input");
  const draw = () => {
    const Y0 = +sl.value, idx = Math.min(N-1, Math.round((Y0 - yr(0))*4));
    const act = C.ser.filter(s => on[s[0]]); const all = act.flatMap(s => D[s[0]].y);
    let lo = Math.min(0, ...(all.length ? all : [0])), hi = Math.max(...(all.length ? all : [1]));
    lo = Math.floor(lo/4)*4; hi = Math.ceil(hi/4)*4; if (hi === lo) hi = lo + 4;
    const w = 340, h = 220, L = 34, R = 10, T = 12, B = 26, X = t => L + (t-1960)/51*(w-L-R), Yp = v => T + (hi-v)/(hi-lo)*(h-T-B);
    const ticks = []; for (let v = lo; v <= hi; v += (hi-lo > 16 ? 8 : 4)) ticks.push(v);
    const lines = act.map(s => `<polyline points="${D[s[0]].y.map((v,i) => `${X(yr(i)).toFixed(1)},${Yp(v).toFixed(1)}`).join(" ")}" style="fill:none;stroke:${s[2]};stroke-width:2"/>`).join("");
    const dots = act.map(s => `<circle cx="${X(yr(idx))}" cy="${Yp(D[s[0]].y[idx])}" r="4.5" style="fill:${s[2]};stroke:var(--surface);stroke-width:2"/>`).join("");
    el.querySelector(".hc-c").innerHTML = `<svg class="chart" viewBox="0 0 ${w} ${h}" role="img" aria-label="${C.title}">
      ${ticks.map(v => `<line x1="${L}" y1="${Yp(v)}" x2="${w-R}" y2="${Yp(v)}" style="stroke:${v === 0 ? "var(--muted)" : "var(--line)"};stroke-width:1"/><text x="${L-4}" y="${Yp(v)+4}" text-anchor="end" class="sm">${v}%</text>`).join("")}
      ${[1960,1970,1980,1990,2000,2010].map(t => `<text x="${X(t)}" y="${h-8}" text-anchor="middle" class="sm">${t}</text>`).join("")}
      <line x1="${X(yr(idx))}" y1="${T}" x2="${X(yr(idx))}" y2="${h-B}" style="stroke:var(--ink);stroke-width:1;stroke-dasharray:3 3"/>
      ${lines}${dots}</svg>`;
    el.querySelector(".hc-yv").textContent = Y0;
    const val = k => D[k].y[idx];
    let rows = C.ser.map(s => kv(s[1], val(s[0]).toFixed(1) + "% of GDP"));
    if (key === "trade"){ const nx = val("EXP/Y") - val("IMP/Y"); rows.push(kv("Net exports (exports − imports)", `<span style="color:${nx < 0 ? "var(--wrong)" : "var(--right)"}">${nx > 0 ? "+" : ""}${nx.toFixed(1)}% of GDP</span>`)); }
    else { const gap = val("S/Y") - val("I/Y"); rows.push(kv("Saving − investment", `<span style="color:${gap < 0 ? "var(--wrong)" : "var(--right)"}">${gap > 0 ? "+" : ""}${gap.toFixed(1)}% of GDP</span>`)); }
    el.querySelector(".hc-v").innerHTML = rows.join("");
  };
  el.querySelectorAll(".chipbtn").forEach(b => b.onclick = () => { const k = b.dataset.s; if (on[k] && Object.values(on).filter(Boolean).length === 1) return; on[k] = !on[k]; b.setAttribute("aria-pressed", on[k]); draw(); });
  sl.oninput = draw; draw();
}

/* ---------- lessons ---------- */
const STEPS = [
 { title:"Open economies and net exports", html:`
   <p>One of economics’ big principles: <b>trade can make everyone better off</b>. This lecture introduces the basic ideas of international macroeconomics.</p>
   <div class="stack">
     <div class="info"><b>${g("Closed economy","Closed economy")}</b><span>Doesn’t interact with other economies.</span></div>
     <div class="info"><b>${g("Open economy","Open economy")}</b><span>Trades goods and assets freely with the world.</span></div>
   </div>
   <p>${g("Exports")} are made at home and sold abroad; ${g("Imports")} are made abroad and sold at home.</p>
   <div class="formula">Net exports (NX) = exports − imports</div>
   <div class="fig" data-fig="nx"></div>
   <p>Things that move NX: tastes for foreign vs domestic goods, prices at home and abroad, incomes at home and abroad, exchange rates, transportation costs, and government policies.</p>
   <div class="fig" data-fig="nxev"></div>
   <p>The U.S. economy has become much more open: exports and imports have grown as a share of GDP, and imports have outpaced exports since about 1980.</p>
   <div class="fig" data-fig="histtrade"></div>`,
   check:[
    {id:"c1a", q:"A country exports $2 trillion and imports $2.5 trillion. It has…", a:1,
     o:[["A trade surplus of $0.5 trillion","A surplus means exports are bigger. Which is bigger here?"],["A trade deficit of $0.5 trillion","Correct. NX = 2 − 2.5 = −0.5."],["Balanced trade","That needs exports to equal imports."]],
     hint:"NX = exports − imports. Is it positive or negative?", more:"A negative NX is a trade deficit."},
    {id:"c1b", q:"Canada falls into a recession. U.S. net exports…", a:0,
     o:[["Fall","Correct. Canadians buy fewer U.S. exports."],["Rise","A recession lowers incomes. Would Canadians buy more U.S. goods?"],["Don’t change","Canada is a major buyer of U.S. goods. Something changes."]],
     hint:"Which side changes: U.S. exports or U.S. imports?", more:"Foreign incomes are one of the main things that move NX."}
   ]},
 { title:"The flow of capital", html:`
   <p>Countries also trade <b>assets</b>: stocks, bonds, factories, bank deposits.</p>
   <div class="formula">NCO = Americans buying foreign assets − foreigners buying U.S. assets</div>
   <p>${g("Net capital outflow")} (NCO) is also called net foreign investment. It comes in two forms:</p>
   <div class="stack">
     <div class="info"><b>${g("Foreign direct investment","Foreign direct investment")}</b><span>You actively run it: McDonald’s opens a restaurant in Moscow.</span></div>
     <div class="info"><b>${g("Foreign portfolio investment","Foreign portfolio investment")}</b><span>You just buy stocks or bonds, lending to a foreign firm.</span></div>
   </div>
   <div class="fig" data-fig="nco"></div>
   <p><b>NCO > 0</b> is a capital <b>outflow</b>; <b>NCO < 0</b> is a capital <b>inflow</b>. NCO depends on real interest rates at home and abroad, the risks of holding foreign assets, and government rules on foreign ownership.</p>`,
   check:[
    {id:"c2a", q:"A German company buys a U.S. software firm and runs it. For the U.S., this is…", a:2,
     o:[["Foreign portfolio investment that raises U.S. NCO","They manage the firm, and they’re buying a U.S. asset. Recheck both parts."],["Foreign direct investment that raises U.S. NCO","It is direct investment, but who is buying a U.S. asset?"],["Foreign direct investment that lowers U.S. NCO","Correct. Foreigners buying U.S. assets lowers U.S. NCO."]],
     hint:"Two questions: do they manage it (direct vs portfolio)? Who buys whose asset?", more:"For Germany, the same deal raises German NCO."},
    {id:"c2b", q:"If U.S. NCO is negative, then…", a:1,
     o:[["Americans buy more foreign assets than foreigners buy U.S. assets","That would make NCO positive."],["Foreigners buy more U.S. assets than Americans buy foreign assets","Correct. That’s a capital inflow."],["The U.S. has a trade surplus","Lesson 3 links NCO to NX. A negative NCO goes with a deficit."]],
     hint:"NCO = (Americans buying abroad) − (foreigners buying here).", more:"The U.S. has had negative NCO for decades."}
   ]},
 { title:"Why NX always equals NCO", html:`
   <div class="formula">NCO = NX</div>
   <p>This is an <b>accounting identity</b>: every international sale of a good is paid for with an asset, so any change in NX is matched by the same change in NCO.</p>
   <div class="fig" data-fig="identity"></div>`,
   check:[
    {id:"c3a", q:"Boeing sells a jet to Japan and keeps the yen. What happens?", a:0,
     o:[["NX and NCO both rise by the jet’s value","Correct. An export, plus a foreign asset (yen)."],["NX rises but NCO doesn’t change","Holding yen is holding a foreign asset. Does that count?"],["NCO rises but NX doesn’t change","The jet is an export. What does that do to NX?"]],
     hint:"Count two things: the jet sold, and the yen received.", more:"Whatever Boeing does next, NX and NCO stay equal."},
    {id:"c3b", q:"A country has a trade deficit of $500 billion. Its NCO is…", a:2,
     o:[["+$500 billion","NCO equals NX, including the sign."],["Zero","A deficit is nonzero NX, so NCO is nonzero too."],["−$500 billion","Correct. NCO = NX = −500: a capital inflow."]],
     hint:"NCO = NX. Is NX positive or negative with a deficit?", more:"Foreigners use the dollars they earn to buy U.S. assets."}
   ]},
 { title:"Saving, investment and the trade deficit", html:`
   <div class="derive">Y = C + I + G + NX<br>Y − C − G = I + NX<br>S = I + NX &nbsp;&nbsp;(since S = Y − C − G)<br><b>S = I + NCO</b> &nbsp;&nbsp;(since NX = NCO)</div>
   <p>A country’s saving can pay for investment at home <b>or</b> buy assets abroad.</p>
   <div class="fig" data-fig="si"></div>
   <h3>Case study: the U.S. trade deficit</h3>
   <p>The lecture’s chart shows U.S. saving falling below investment from the 1980s on, with NCO turning negative.</p>
   <div class="fig" data-fig="histsaving"></div>
   <div class="stack">
     <div class="info"><b>Why U.S. saving fell short</b><span>1980s and early 2000s: big government budget deficits and low private saving. 1990s: saving rose, but investment rose even faster in the tech boom.</span></div>
     <div class="info"><b>Is it a problem?</b><span>Not necessarily. Like a person, a country can borrow for good reasons (investment) or bad ones. A trade deficit may be a symptom of a problem rather than a problem itself.</span></div>
   </div>
   ${tn("At the end of 2009, foreigners owned $2.7 trillion more U.S. assets than Americans owned abroad, making the U.S. “the world’s biggest debtor nation.”","By early 2026 that gap had grown to about $21 trillion, according to the Bureau of Economic Analysis. The lecture’s point still holds: these are mostly private investments, made freely, not government debts.")}`,
   check:[
    {id:"c4a", q:"National saving is 18% of GDP and investment is 22%. NCO is…", a:1,
     o:[["+4% of GDP","S − I = 18 − 22. Check the sign."],["−4% of GDP","Correct. Foreigners finance the gap."],["40% of GDP","NCO is the difference, not the sum."]],
     hint:"NCO = S − I.", more:"Negative NCO goes with a trade deficit of the same size."},
    {id:"c4b", q:"Which is NOT true of a country with a trade deficit?", a:2,
     o:[["Exports < imports","That’s the definition of a deficit, so it is true."],["NCO < 0","NCO = NX < 0, so it is true."],["Investment < saving","Correct, this is false. A deficit means S − I < 0, so investment is greater than saving."]],
     hint:"Use S − I = NX. If NX < 0, which is bigger, S or I?", more:"This was a clicker question in the lecture."}
   ]},
 { title:"Nominal exchange rates", html:`
   <p>The ${g("Nominal exchange rate","nominal exchange rate")} e is the rate at which two currencies trade. We write it as <b>foreign currency per dollar</b>.</p>
   <div class="stack">
     <div class="info"><b>${g("Appreciation","Appreciation")}</b><span>The dollar buys <b>more</b> foreign currency.</span></div>
     <div class="info"><b>${g("Depreciation","Depreciation")}</b><span>The dollar buys <b>less</b> foreign currency.</span></div>
   </div>
   <div class="fig" data-fig="e"></div>
   <p>A strong dollar is often seen as national strength, and a weak one as weakness. But appreciation makes it <b>harder</b> to sell goods abroad, and depreciation makes it <b>easier</b>.</p>
   ${tn("Lists rates per US$ for May 2011 and Nov 2024, such as 81.67 and 151.80 yen.","Exchange rates change every day. Use the lecture’s numbers for practice, and check a live source for today’s rates.")}`,
   check:[
    {id:"c5a", q:"The rate goes from 100 to 125 yen per dollar. The dollar has…", a:0,
     o:[["Appreciated","Correct. Each dollar now buys more yen."],["Depreciated","Does $1 buy more or fewer yen than before?"],["Stayed the same","The number of yen per dollar changed."]],
     hint:"More yen per dollar means the dollar is worth…?", more:"And the yen has depreciated against the dollar."},
    {id:"c5b", q:"The dollar depreciates. U.S. exports become…", a:1,
     o:[["Harder to sell abroad","A weaker dollar makes U.S. goods cheaper for foreigners."],["Easier to sell abroad","Correct. Foreigners need less of their currency to buy U.S. goods."],["Unaffected","Prices to foreign buyers change with the exchange rate."]],
     hint:"Try the slider: what happens to the T-shirt’s yen price when e falls?", more:"That’s why depreciation isn’t simply “weakness.”"}
   ]},
 { title:"The real exchange rate", html:`
   <p>The ${g("Real exchange rate","real exchange rate")} tells you how many foreign <b>goods</b> one domestic good trades for.</p>
   <div class="formula">Real exchange rate = (e × P) ÷ P*</div>
   <p>P is the U.S. price (in $), P* is the foreign price (in foreign currency), and e is foreign currency per dollar.</p>
   <div class="fig" data-fig="real"></div>
   <p>With many goods, P and P* are price levels such as the CPI. If the U.S. real exchange rate <b>appreciates</b>, U.S. goods become more expensive relative to foreign goods.</p>`,
   check:[
    {id:"c6a", q:"e = 10 pesos/$, P = $3, P* = 24 pesos. What is the price of the U.S. latte in pesos?", a:1,
     o:[["3","That’s the dollar price. Convert it to pesos."],["30","Correct. 10 × 3 = 30 pesos."],["24","That’s the Mexican latte’s price."]],
     hint:"Price in pesos = e × P.", more:"That’s Step 1 of the real exchange rate."},
    {id:"c6b", q:"Using the same numbers, the real exchange rate is…", a:2,
     o:[["0.8 Mexican lattes per U.S. latte","That’s 24 ÷ 30. The U.S. price goes on top."],["30 Mexican lattes per U.S. latte","30 is the peso price, not the real rate."],["1.25 Mexican lattes per U.S. latte","Correct. 30 ÷ 24 = 1.25."]],
     hint:"(e × P) ÷ P* = 30 ÷ 24.", more:"A U.S. latte costs a Mexican buyer the same as 1.25 Mexican lattes."}
   ]},
 { title:"The law of one price and PPP", html:`
   <p>The ${g("Law of one price","law of one price")}: a good should sell for the same price everywhere, because ${g("Arbitrage","arbitrage")} removes the gaps.</p>
   <div class="fig" data-fig="arb"></div>
   <p>${g("Purchasing-power parity")} applies this to whole currencies: a dollar should buy the same basket everywhere. Then e × P = P*, which gives:</p>
   <div class="formula">e = P* ÷ P</div>
   <div class="fig" data-fig="ppp"></div>`,
   check:[
    {id:"c7a", q:"A Ford costs $24,000 in the U.S. and 720,000 rubles in Russia. Under PPP, e is…", a:3,
     o:[["24,000","That’s the U.S. price."],["24","Check the division: 720,000 ÷ 24,000."],["3","Off by a factor of ten. Redo the division."],["30 rubles per dollar","Correct. 720,000 ÷ 24,000 = 30."]],
     hint:"e = P* ÷ P.", more:"This was a clicker question in the lecture."},
    {id:"c7b", q:"Under PPP, if inflation is higher in Mexico than in the U.S., the dollar…", a:0,
     o:[["Appreciates against the peso","Correct. P* rises faster than P, so e = P*/P rises."],["Depreciates against the peso","Which price level rises faster, P or P*?"],["Doesn’t change","Different inflation rates make e change over time."]],
     hint:"e = P* ÷ P. Which one grows faster?", more:"High-inflation countries tend to have depreciating currencies."}
   ]},
 { title:"Where PPP falls short", html:`
   <p>Two reasons exchange rates don’t always equalize prices:</p>
   <div class="stack">
     <div class="info"><b>1. Many goods can’t easily be traded</b><span>Haircuts, movie tickets: price gaps can’t be arbitraged away.</span></div>
     <div class="info"><b>2. Goods aren’t perfect substitutes</b><span>Some people prefer Toyotas, others Chevys. Price gaps can reflect tastes.</span></div>
   </div>
   <div class="fig" data-fig="tradable"></div>
   <p>Still, PPP works well for <b>long-run trends</b>. Across 31 countries from 1993 to 2003, those with higher inflation (like Ukraine and Romania) saw their currencies depreciate faster against the dollar than low-inflation countries (like Japan and Canada).</p>`,
   check:[
    {id:"c8a", q:"Why might haircuts cost much more in Tokyo than in Mexico City, even with PPP?", a:1,
     o:[["Because PPP always holds exactly","If it held exactly, prices would be equal."],["Haircuts can’t be traded, so arbitrage can’t close the gap","Correct."],["Because exchange rates are fixed","Rates move. The issue is the good itself."]],
     hint:"Could you buy a haircut in one city and resell it in the other?", more:"Non-traded goods are a big reason PPP fails in the short run."},
    {id:"c8b", q:"PPP is most useful for explaining…", a:2,
     o:[["Day-to-day exchange rate moves","Short-run moves are noisy and often ignore PPP."],["The price of haircuts","Haircuts aren’t traded, so PPP says little."],["Long-run trends, like high-inflation currencies depreciating","Correct. The 31-country data support this."]],
     hint:"Look back at the 31-country evidence.", more:"Over long periods, inflation differences show up in exchange rates."}
   ]}
];
const FIGS = { histtrade:el => figHist(el,"trade"), histsaving:el => figHist(el,"saving"), nx:figNX, nxev:figNXEvents, nco:figNCO, identity:figIdentity, si:figSI, e:figE, real:figReal, arb:figArb, ppp:figPPP, tradable:figTradable };

/* ---------- self-check ---------- */
const QUIZ = [
 {id:"q1", L:0, q:"Net exports equal…", a:1, hint:"The trade balance.", o:[["Exports + imports","That’s total trade, not the balance."],["Exports − imports","Right."],["Imports − exports","That flips the sign."],["Saving − exports","Saving relates to NCO, not this definition."]], more:"NX is also called the trade balance."},
 {id:"q2", L:0, q:"An open economy is one that…", a:2, hint:"Open to what?", o:[["Has no government","Openness is about other countries."],["Has a trade surplus","Open economies can have deficits too."],["Interacts freely with other economies","Right."],["Has free markets at home","That’s a different idea."]], more:"The U.S. has become more open over time."},
 {id:"q3", L:0, q:"U.S. consumers decide to buy more American-made products. U.S. NX…", a:0, hint:"What happens to imports?", o:[["Rises","Right. Imports fall."],["Falls","Fewer imports raises NX."],["Is unchanged","Imports changed, so NX changes."],["Becomes zero","It moves, but not necessarily to zero."]], more:"Tastes are one influence on NX."},
 {id:"q4", L:0, q:"Which does NOT directly influence net exports?", a:3, hint:"Look at the lecture’s list.", o:[["Exchange rates","They change how expensive goods are abroad."],["Incomes abroad","Foreign incomes drive demand for exports."],["Transportation costs","These affect what’s worth trading."],["The color of the national flag","Right. Not an economic influence."]], more:"Tastes, prices, incomes, exchange rates, transport costs, policy."},
 {id:"q5", L:0, q:"A trade surplus means…", a:1, hint:"Surplus = more of what?", o:[["Imports > exports","That’s a deficit."],["Exports > imports","Right."],["Saving < investment","That goes with a deficit."],["NCO < 0","A surplus goes with NCO > 0."]], more:"NX > 0."},
 {id:"q6", L:1, q:"Net capital outflow equals…", a:0, hint:"Our purchases of their assets minus…", o:[["Domestic purchases of foreign assets − foreign purchases of domestic assets","Right."],["Exports − imports","That’s NX (which equals NCO, but isn’t its definition)."],["Foreign purchases of domestic assets − domestic purchases of foreign assets","That flips the sign."],["Saving + investment","S − I equals NCO, not S + I."]], more:"Also called net foreign investment."},
 {id:"q7", L:1, q:"An American buys bonds issued by a Brazilian company. This is…", a:2, hint:"Do they manage the company?", o:[["Foreign direct investment","Direct investment means actively managing the asset."],["A U.S. import","Assets bought aren’t goods imported."],["Foreign portfolio investment, raising U.S. NCO","Right."],["A capital inflow to the U.S.","Money flows out to buy a foreign asset."]], more:"Portfolio investment supplies loanable funds abroad."},
 {id:"q8", L:1, q:"Which would tend to raise U.S. NCO?", a:1, hint:"What makes foreign assets more attractive?", o:[["Higher real interest rates in the U.S.","That attracts money into the U.S., lowering NCO."],["Higher real interest rates abroad","Right. Foreign assets pay more."],["More political risk abroad","Risk makes foreign assets less attractive."],["Rules limiting U.S. ownership of foreign assets","Rules like this reduce NCO."]], more:"NCO depends on returns, risks and policies."},
 {id:"q9", L:2, q:"Why is NCO always equal to NX?", a:0, hint:"What does a foreign buyer pay with?", o:[["Every sale of a good abroad is paid for with an asset","Right. It’s an accounting identity."],["The government forces them to be equal","No law is needed: it’s accounting."],["Because exchange rates adjust instantly","The identity holds whatever exchange rates do."],["It only holds under PPP","It always holds, PPP or not."]], more:"Boeing’s yen are the asset side of its jet export."},
 {id:"q10", L:3, q:"From Y = C + I + G + NX, national saving S equals…", a:2, hint:"S = Y − C − G.", o:[["I − NX","Check the sign of NX."],["C + G","That’s spending, not saving."],["I + NCO","Right (since NX = NCO)."],["NX − I","Rearrange carefully."]], more:"Saving funds investment at home or assets abroad."},
 {id:"q11", L:3, q:"If a country’s saving is less than its investment…", a:1, hint:"Who finances the gap?", o:[["NCO > 0 and it has a trade surplus","That happens when saving exceeds investment."],["NCO < 0 and it has a trade deficit","Right. Foreigners finance the gap."],["NX = 0","Only if S = I."],["It must have a recession","Not necessarily."]], more:"This describes the U.S. since about 1980."},
 {id:"q12", L:3, q:"According to the lecture, a trade deficit is…", a:3, hint:"Remember the comparison to a person borrowing.", o:[["Always a sign of economic weakness","The lecture argues it depends on why."],["Impossible in an open economy","Many open economies run deficits."],["Always good for growth","Borrowing can be for good or bad reasons."],["Not necessarily a problem, but may be a symptom of one","Right."]], more:"Borrowing to invest can pay off; borrowing to consume may not."},
 {id:"q13", L:4, q:"The exchange rate changes from 0.90 to 0.80 euros per dollar. The dollar has…", a:1, hint:"Does $1 buy more or fewer euros?", o:[["Appreciated","It buys fewer euros now."],["Depreciated","Right."],["Not changed","The rate moved."],["Become a euro","Not quite!"]], more:"U.S. goods are now cheaper in Europe."},
 {id:"q14", L:4, q:"A dollar appreciation makes it…", a:0, hint:"What happens to U.S. prices in foreign currency?", o:[["Harder for the U.S. to sell exports","Right. U.S. goods cost foreigners more."],["Easier for the U.S. to sell exports","That’s what depreciation does."],["Cheaper for foreigners to buy U.S. goods","They need more of their currency per dollar."],["No different for trade","Exchange rates affect trade."]], more:"But imports become cheaper for Americans."},
 {id:"q15", L:5, q:"The real exchange rate formula is…", a:2, hint:"Convert the U.S. price into foreign currency, then compare.", o:[["P ÷ (e × P*)","That flips it."],["e ÷ (P × P*)","Not a meaningful ratio."],["(e × P) ÷ P*","Right."],["P* − P","Exchange rates are ratios, not differences."]], more:"Foreign goods per unit of domestic good."},
 {id:"q16", L:5, q:"A Big Mac costs $2.50 in the U.S. and ¥400 in Japan; e = 120 ¥/$. The real exchange rate is…", a:1, hint:"Step 1: 120 × 2.50. Step 2: divide by 400.", o:[["1.33","That’s 400 ÷ 300; the U.S. price goes on top."],["0.75 Japanese Big Macs per U.S. Big Mac","Right. 300 ÷ 400 = 0.75."],["300","That’s the yen price of a U.S. Big Mac."],["48","Check: e × P = 300, not 48."]], more:"U.S. Big Macs are relatively cheap here."},
 {id:"q17", L:6, q:"The law of one price relies on…", a:0, hint:"Buy low, sell high.", o:[["Arbitrage","Right."],["Government price controls","Markets, not controls, close the gap."],["Inflation","Inflation isn’t the mechanism."],["Trade deficits","Not related."]], more:"Arbitrage pushes prices together."},
 {id:"q18", L:6, q:"Under PPP, the nominal exchange rate equals…", a:1, hint:"Set e × P = P*.", o:[["P ÷ P*","Upside down."],["P* ÷ P","Right."],["P × P*","Not a ratio of price levels."],["The real exchange rate","Under PPP the real rate is 1, not e."]], more:"The ratio of price levels."},
 {id:"q19", L:6, q:"Under PPP, U.S. inflation is higher than Japan’s. The dollar should…", a:1, hint:"Which price level rises faster?", o:[["Appreciate against the yen","U.S. prices rise faster, so P grows."],["Depreciate against the yen","Right. e = P*/P falls."],["Stay fixed","Different inflation changes e."],["Become worthless","Just depreciate gradually."]], more:"Higher inflation, weaker currency."},
 {id:"q20", L:7, q:"Which is a reason PPP doesn’t hold exactly?", a:3, hint:"Two reasons were given in the lecture.", o:[["Arbitrage is too fast","Fast arbitrage would make PPP hold better."],["All goods are identical","If they were, PPP would hold better."],["Exchange rates never change","They do change."],["Many goods, like haircuts, can’t be traded","Right."]], more:"The other reason: goods aren’t perfect substitutes."}
];
const ROUNDS = [["Round 1","Net exports",0],["Round 2","Capital flows and NX = NCO",5],["Round 3","Saving, investment, exchange rates",10],["Round 4","Real rates and PPP",15],["Mixed round","5 random questions",-1],["My weak spots","Questions you’ve missed before, mixed up",-2],["Number drills","Real exchange rates, PPP and S − I with new numbers",-3]];
function genDrill(){
  const pick = a => a[Math.floor(Math.random()*a.length)];
  const kind = Math.floor(Math.random()*3); let q, o, L, hint;
  if (kind === 0){
    const e = pick([5,10,20,100,120]), P = pick([2,3,4,5]), Ps = pick([e*P/2, e*P*0.8, e*P, e*P*1.25, e*P*2].map(x => Math.round(x))); const r = e*P/Ps;
    q = `e = ${e} per $, U.S. price P = $${P}, foreign price P* = ${Ps}. What is the real exchange rate?`; L = 5; hint = "(e × P) ÷ P*.";
    o = [[String(+r.toFixed(2)),`Right. ${e*P} ÷ ${Ps} = ${+r.toFixed(2)}.`],[String(+(Ps/(e*P)).toFixed(2)),"That’s flipped. The U.S. price in foreign currency goes on top."],[String(e*P),"That’s Step 1 only (the foreign-currency price of the U.S. good)."],[String(+(P/Ps).toFixed(3)),"You left out e."]];
  } else if (kind === 1){
    const P = pick([10,20,40,50,100]), e = pick([3,8,15,30,80]); const Ps = P*e;
    q = `Under PPP, a basket costs $${P} in the U.S. and ${Ps.toLocaleString("en-US")} in foreign currency abroad. What should e be?`; L = 6; hint = "e = P* ÷ P.";
    o = [[String(e),`Right. ${Ps} ÷ ${P} = ${e}.`],[String(+(P/Ps).toFixed(4)),"That’s P ÷ P*, upside down."],[String(Ps*P),"Multiply? No, divide."],[String(e*10),"Check the division again."]];
  } else {
    const S = pick([14,16,18,20,22]), I = pick([15,17,19,21,23]); const n = S - I;
    q = `Saving is ${S}% of GDP and investment is ${I}% of GDP. What is NCO (as % of GDP)?`; L = 3; hint = "NCO = S − I, and it equals NX.";
    o = [[(n > 0 ? "+" : "") + n + "%",`Right. ${S} − ${I} = ${n}. ${n < 0 ? "Capital inflow and a trade deficit." : "Capital outflow and a trade surplus."}`],[(-n > 0 ? "+" : "") + (-n) + "%","Check the order: S − I."],[(S+I) + "%","NCO is the difference, not the sum."]];
  }
  const seen = new Set(); o = o.filter(x => !seen.has(x[0]) && seen.add(x[0]));
  return {id:"gen", gen:true, L, q, o, a:0, hint, more:"New numbers every round. Keep going until it feels automatic."};
}

/* ---------- short answers ---------- */
const WRITE = [
 {q:"Define net exports and explain the difference between a trade deficit, a trade surplus and balanced trade.",
  keys:[["NX = exports − imports",/export.{0,20}(−|-|minus).{0,10}import/i],["Deficit: imports exceed exports",/deficit.{0,60}(import.{0,20}(exceed|greater|more|>)|export.{0,20}(less|<))/i],["Surplus: exports exceed imports",/surplus.{0,60}(export.{0,20}(exceed|greater|more|>)|import.{0,20}(less|<))/i],["Balanced: exports equal imports",/balanced.{0,60}(equal|=|same)/i]],
  model:"Net exports (the trade balance) equal the value of exports minus the value of imports. A trade deficit means imports exceed exports (NX < 0), a trade surplus means exports exceed imports (NX > 0), and balanced trade means exports equal imports (NX = 0)."},
 {q:"List four variables that influence a country’s net exports and explain one of them.",
  keys:[["Preferences/tastes",/prefer|taste/i],["Prices at home and abroad",/price/i],["Incomes at home and abroad",/income/i],["Exchange rates, transport costs or policies",/exchange rate|transport|polic/i]],
  model:"Net exports depend on consumers’ preferences for foreign and domestic goods, prices of goods at home and abroad, incomes at home and abroad, exchange rates, transportation costs and government policies. For example, if Canada enters a recession, Canadian incomes fall, Canadians buy fewer U.S. goods, and U.S. net exports fall."},
 {q:"Define net capital outflow and distinguish foreign direct investment from foreign portfolio investment, with an example of each.",
  keys:[["NCO definition",/(purchas|buy).{0,40}foreign assets.{0,60}(minus|−|-|less).{0,40}(foreign|foreigners)/i],["Direct investment: actively managed",/direct.{0,80}(manag|run|operat|own)/i],["Portfolio investment: stocks or bonds",/portfolio.{0,80}(stock|bond|share)/i],["Examples",/mcdonald|factory|plant|restaurant|toyota|share|bond/i]],
  model:"Net capital outflow is domestic residents’ purchases of foreign assets minus foreigners’ purchases of domestic assets. Foreign direct investment means the investor actively manages the foreign asset, such as McDonald’s opening a restaurant in Moscow. Foreign portfolio investment means buying foreign stocks or bonds without managing the firm, such as an American buying shares of Toyota."},
 {q:"Explain why net exports always equal net capital outflow, using an example.",
  keys:[["Accounting identity",/identity|always equal|must equal/i],["A sale of goods is paid with an asset/currency",/(paid|pay|payment).{0,40}(currency|asset|yen|euro)|asset/i],["Example showing both rise",/(boeing|jet|export).{0,200}(nco|asset)/i],["Same amount",/same amount|equal amount|by the same/i]],
  model:"NX = NCO is an accounting identity: every international transaction trades a good or service for an asset. If Boeing sells a $100 million jet to Japan, U.S. exports and NX rise by $100 million. Japan pays in yen, a foreign asset, so U.S. NCO also rises by $100 million. Whatever Boeing does with the yen, NX and NCO change by the same amount."},
 {q:"Derive S = I + NCO from the national income identity and explain what it means when S < I.",
  keys:[["Y = C + I + G + NX",/y\s?=\s?c\s?\+\s?i\s?\+\s?g\s?\+\s?nx/i],["S = Y − C − G",/s\s?=\s?y\s?(−|-)\s?c\s?(−|-)\s?g/i],["S = I + NCO (using NX = NCO)",/s\s?=\s?i\s?\+\s?nco/i],["S < I: foreigners finance investment, NCO < 0, trade deficit",/(foreign).{0,60}(financ|borrow|fund)|nco\s?<\s?0|deficit/i]],
  model:"Start with Y = C + I + G + NX. Subtract C and G: Y − C − G = I + NX. Since national saving S = Y − C − G, S = I + NX, and since NX = NCO, S = I + NCO. If S < I, NCO is negative: foreigners are financing part of the country’s investment by buying its assets, and the country runs a trade deficit."},
 {q:"Is the U.S. trade deficit necessarily a problem? Explain using the lecture’s case study.",
  keys:[["Deficit means I > S, borrowing from abroad",/(invest).{0,40}(exceed|greater|more|>).{0,20}sav|borrow/i],["Causes: budget deficits/low saving or investment boom",/budget deficit|low.{0,10}saving|investment boom|technology|1990/i],["Good vs bad reasons, like a person",/(good|bad) reason|like a person|symptom/i],["Not necessarily a problem",/not necessarily|depends/i]],
  model:"A trade deficit means investment exceeds national saving, so the U.S. borrows the difference from foreigners. In the 1980s and early 2000s this came from large government budget deficits and low private saving; in the 1990s, investment grew faster than saving during the tech boom. Like a person, a country can borrow for good reasons, such as investing in productive capital, or bad ones. So a trade deficit is not necessarily a problem, though it may be a symptom of one, such as low saving."},
 {q:"Define the nominal and real exchange rates. Compute the real exchange rate for the lecture’s latte example (e = 10 pesos/$, P = $3, P* = 24 pesos) and interpret it.",
  keys:[["Nominal: rate currencies trade",/nominal.{0,60}(currenc)/i],["Real: rate goods trade, (e × P)/P*",/real.{0,80}(goods|e\s?[×x*]\s?p)/i],["Computes 30 ÷ 24 = 1.25",/1\.25/],["Interpretation in lattes",/latte/i]],
  model:"The nominal exchange rate is the rate at which one currency trades for another; the real exchange rate is the rate at which one country’s goods trade for another’s, equal to (e × P) ÷ P*. A U.S. latte costs 10 × $3 = 30 pesos, and a Mexican latte costs 24 pesos, so the real exchange rate is 30 ÷ 24 = 1.25 Mexican lattes per U.S. latte: buying one U.S. latte costs a Mexican consumer as much as 1.25 lattes at home."},
 {q:"Explain purchasing-power parity, derive e = P*/P, and describe its two main limitations.",
  keys:[["A currency buys the same goods everywhere / law of one price",/same (quantity|amount|basket)|law of one price/i],["e = P*/P",/e\s?=\s?p\*\s?\/\s?p|p\*\s?÷\s?p/i],["Non-traded goods",/trad(ed|able)|haircut|movie/i],["Imperfect substitutes / tastes",/substitut|taste|prefer/i]],
  model:"Purchasing-power parity says a unit of any currency should buy the same quantity of goods in every country, based on the law of one price and arbitrage. If a basket costs P dollars in the U.S. and P* in foreign currency, PPP means e × P = P*, so e = P*/P. It fails in the short run because many goods, like haircuts, can’t be traded, and because foreign and domestic goods aren’t perfect substitutes. It still explains long-run trends well."},
 {q:"According to PPP, what happens to the dollar if Mexico has higher inflation than the U.S.? Explain and give the evidence from the lecture.",
  keys:[["P* rises faster than P",/(p\*|mexican prices|prices in mexico).{0,40}(faster|more)/i],["e = P*/P rises",/e\s?(rises|increases|goes up)|p\*\s?\/\s?p/i],["Dollar appreciates / peso depreciates",/dollar.{0,20}apprecia|peso.{0,20}deprecia/i],["Evidence: high-inflation countries depreciate (31 countries)",/31|cross.?section|high.?inflation.{0,60}deprecia/i]],
  model:"Under PPP, e = P*/P. If Mexico’s inflation is higher, Mexican prices P* rise faster than U.S. prices P, so e (pesos per dollar) rises: the dollar appreciates and the peso depreciates. The lecture’s data on 31 countries from 1993 to 2003 support this: countries with higher inflation, such as Ukraine and Romania, saw their currencies depreciate faster against the dollar."}
];
const WTAG = [0,0,1,2,3,3,5,6,6];
