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
   <div class="fig" data-fig="nxev"></div>`,
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
const FIGS = { nx:figNX, nxev:figNXEvents, nco:figNCO, identity:figIdentity, si:figSI, e:figE, real:figReal, arb:figArb, ppp:figPPP, tradable:figTradable };

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
