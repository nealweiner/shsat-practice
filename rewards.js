// Shared XP ledger and screen-time store for the SHSAT apps. Both apps use the same
// localStorage keys, so on one origin (GitHub Pages) the balance is shared between them.
// Needs voucher-crypto.js loaded first.
var XP_PER_QUESTION = 5;
function rget(k, d){ try { var v = localStorage.getItem('shsat:' + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } }
function rset(k, v){ try { localStorage.setItem('shsat:' + k, JSON.stringify(v)); } catch (e) {} }
function xpBalance(){ return rget('xp', 0); }

function addXP(n, why){
  if (!n) return;
  rset('xp', xpBalance() + n); rset('xpTotal', rget('xpTotal', 0) + n);
  var t = document.createElement('div');
  t.className = 'xp-toast'; t.textContent = '+' + n + ' XP' + (why ? ' · ' + why : '');
  document.body.appendChild(t);
  setTimeout(function(){ t.classList.add('show'); }, 20);
  setTimeout(function(){ t.classList.remove('show'); setTimeout(function(){ t.remove(); }, 400); }, 2600);
}

// Prices climb 25% per purchase of the same item within a day, as in the other apps.
function todayStr(){ return new Date().toISOString().slice(0, 10); }
function purchaseCounts(){ var c = rget('purchases', {}); return c.date === todayStr() ? c : { date: todayStr(), counts: {} }; }
function price(item){ var n = purchaseCounts().counts[item.id] || 0; return Math.round(item.cost * (1 + n * 0.25)); }

function buyItem(id){
  var item = storeItem(id), cost = price(item);
  if (xpBalance() < cost) { alert('Not enough XP yet.'); return; }
  rset('xp', xpBalance() - cost);
  var pc = purchaseCounts(); pc.counts[id] = (pc.counts[id] || 0) + 1; rset('purchases', pc);
  var vs = rget('vouchers', []);
  vs.push({ code: generateSignedVoucherCode(id), itemId: id, cost: cost, date: new Date().toISOString(), emailed: false });
  rset('vouchers', vs);
  renderStore();
  if (!rget('parentmail', '')) alert('Voucher created. Add a parent email under the store to send it.');
}

function emailVoucher(code){
  var vs = rget('vouchers', []), v = vs.find(function(x){ return x.code === code; });
  var to = rget('parentmail', '');
  if (!v) return;
  if (!to) { alert('Add a parent email first.'); return; }
  var item = storeItem(v.itemId), who = rget('childname', '') || 'Your child';
  var when = new Date(v.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  var body = who + ' earned screen time by studying for the SHSAT.\n\nVoucher code: ' + v.code + '\nFor: ' + item.name +
    '\nEarned: ' + when + '\n\nVerify it at ' + PARENT_URL + ' (or open parent.html next to the app).';
  location.href = 'mailto:' + encodeURIComponent(to) + '?subject=' + encodeURIComponent('Screen time voucher: ' + item.name) + '&body=' + encodeURIComponent(body);
  v.emailed = true; rset('vouchers', vs); renderStore();
}

function saveParentMail(v){ rset('parentmail', v.trim()); }
function saveChildName(v){ rset('childname', v.trim()); }

// Renders the store into #store if that element exists. Call after any XP change.
function renderStore(){
  var el = document.getElementById('store');
  if (!el) return;
  var xp = xpBalance(), vs = rget('vouchers', []).slice().reverse();
  var h = '<div class="store-head"><b>Screen time store</b><span class="store-xp">' + xp + ' XP</span></div>' +
    '<div class="store-meta">' + XP_PER_QUESTION + ' XP per question answered, plus bonuses for finishing a session. Prices rise 25% each time you buy the same item in a day.</div>' +
    '<div class="store-items">';
  STORE_ITEMS.forEach(function(it){
    var p = price(it), ok = xp >= p;
    h += '<div class="store-item"><div class="store-icon">' + it.icon + '</div><div class="store-name">' + it.name + '</div>' +
      '<div class="store-cost">' + p + ' XP</div><button class="store-buy" ' + (ok ? '' : 'disabled') + ' onclick="buyItem(\'' + it.id + '\')">' + (ok ? 'Buy' : 'Not yet') + '</button></div>';
  });
  h += '</div>';
  if (vs.length) {
    h += '<div class="store-sub">Vouchers</div>';
    vs.slice(0, 8).forEach(function(v){
      var it = storeItem(v.itemId);
      h += '<div class="voucher"><code>' + v.code + '</code><span>' + it.name + '</span><span class="store-meta">' + new Date(v.date).toLocaleDateString() + '</span>' +
        '<button class="store-buy" onclick="emailVoucher(\'' + v.code + '\')">' + (v.emailed ? 'Email again' : 'Email to parent') + '</button></div>';
    });
  }
  h += '<div class="store-settings"><label>Your name <input type="text" value="' + (rget('childname', '') || '').replace(/"/g, '&quot;') + '" onchange="saveChildName(this.value)"></label>' +
    '<label>Parent email <input type="email" value="' + (rget('parentmail', '') || '').replace(/"/g, '&quot;') + '" onchange="saveParentMail(this.value)"></label></div>';
  el.innerHTML = h;
}

(function(){
  var css = document.createElement('style');
  css.textContent =
    '.xp-toast{position:fixed;right:16px;bottom:16px;background:#1a4d2e;color:#fff;padding:10px 16px;border-radius:8px;font:600 15px system-ui,sans-serif;opacity:0;transform:translateY(10px);transition:all .3s;z-index:99}' +
    '.xp-toast.show{opacity:1;transform:none}' +
    '.store-head{display:flex;justify-content:space-between;align-items:baseline;font-size:18px}' +
    '.store-xp{font:700 20px system-ui,sans-serif;color:#b8860b}' +
    '.store-meta{font:13px system-ui,sans-serif;color:#6b6355;margin:4px 0 10px}' +
    '.store-items{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px}' +
    '.store-item{border:1px solid #ddd6c9;border-radius:10px;padding:12px;text-align:center;background:#fff}' +
    '.store-icon{font-size:26px}.store-name{font-size:14px;margin:4px 0}.store-cost{font:700 14px system-ui,sans-serif;color:#b8860b;margin-bottom:8px}' +
    '.store-buy{font:500 13px system-ui,sans-serif;padding:5px 12px;border-radius:6px;border:1px solid #1a4d2e;background:#1a4d2e;color:#fff;cursor:pointer}' +
    '.store-buy:disabled{opacity:.35;cursor:not-allowed}' +
    '.store-sub{font:600 13px system-ui,sans-serif;text-transform:uppercase;letter-spacing:.05em;margin:14px 0 4px;color:#6b6355}' +
    '.voucher{display:flex;gap:12px;align-items:center;flex-wrap:wrap;padding:8px 0;border-top:1px solid #ddd6c9;font-size:14px}' +
    '.voucher code{font:700 16px ui-monospace,Menlo,monospace;letter-spacing:.08em}' +
    '.store-settings{display:flex;gap:16px;flex-wrap:wrap;margin-top:14px;font:13px system-ui,sans-serif;color:#6b6355}' +
    '.store-settings input{display:block;font:15px inherit;padding:6px 8px;border:1px solid #ddd6c9;border-radius:6px;min-width:220px}';
  document.head.appendChild(css);
})();
