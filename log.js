// Activity log shared by the SHSAT apps. Every answer and every finished session is
// kept on this device (localStorage 'shsat:log') and, when LOG_URL is set in
// config.js, posted to the Google Apps Script endpoint that feeds the parent page.
// Needs config.js loaded first (LOG_URL may be '').
var LOG_MAX_LOCAL = 5000;
function lget(k, d){ try { var v = localStorage.getItem('shsat:' + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } }
function lset(k, v){ try { localStorage.setItem('shsat:' + k, JSON.stringify(v)); } catch (e) {} }
function deviceId(){
  var id = lget('device', '');
  if (!id) { id = Math.random().toString(36).slice(2, 8); lset('device', id); }
  return id;
}
function newSessionId(){ return Date.now().toString(36) + Math.random().toString(36).slice(2, 5); }

// Fields: ts, app, device, session, kind ('answer'|'session'), form, block, n, tag,
// chosen, correct, ok, secs, score, title. Missing ones are sent as ''.
function logEvents(events){
  var now = new Date().toISOString(), dev = deviceId();
  events = events.map(function(e){ return Object.assign({ ts: now, device: dev }, e); });
  var local = lget('log', []).concat(events);
  lset('log', local.slice(-LOG_MAX_LOCAL));
  if (typeof LOG_URL === 'string' && LOG_URL) {
    lset('queue', lget('queue', []).concat(events));
    flushLog();
  }
}
var flushing = false;
function flushLog(){
  var q = lget('queue', []);
  if (flushing || !q.length || !LOG_URL) return;
  flushing = true;
  // text/plain avoids a CORS preflight; Apps Script reads the raw body.
  fetch(LOG_URL, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(q) })
    .then(function(){ lset('queue', lget('queue', []).slice(q.length)); })
    .catch(function(){})
    .then(function(){ flushing = false; });
}
window.addEventListener('load', flushLog);
