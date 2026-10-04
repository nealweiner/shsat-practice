// Activity log shared by the SHSAT apps. Every answer and every finished session is
// kept on this device (localStorage 'shsat:log') and, when LOG_URL is set in
// config.js, posted to the Google Apps Script endpoint that feeds the parent page.
// Needs config.js loaded first (LOG_URL may be '').
var LOG_MAX_LOCAL = 20000;
var APP_NAME = /Grammar/.test(document.title) ? 'grammar' : 'practice';
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
  fetch(LOG_URL, { method: 'POST', mode: 'no-cors', keepalive: true, headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(q) })
    .then(function(){ lset('queue', lget('queue', []).slice(q.length)); })
    .catch(function(){})
    .then(function(){ flushing = false; });
}
window.addEventListener('load', flushLog);

// Active-time clock: counts seconds while the tab is in front and there was input in the
// last minute, so reading a passage counts but a tab left open does not. Sent as
// kind 'time' rows (secs = seconds since the last time row), summed per day by parent.html.
var ACT_IDLE_MS = 60 * 1000, ACT_TICK = 5, actLast = Date.now(), actUnsent = 0;
['keydown', 'pointerdown', 'scroll', 'touchstart', 'input'].forEach(function(ev){ addEventListener(ev, function(){ actLast = Date.now(); }, { passive: true }); });
function sendTime(){
  if (!actUnsent) return;
  var n = actUnsent; actUnsent = 0;
  logEvents([{ app: APP_NAME, kind: 'time', tag: 'active', secs: n }]);
}
setInterval(function(){
  if (document.hidden || Date.now() - actLast > ACT_IDLE_MS) return;
  actUnsent += ACT_TICK;
  if (actUnsent >= 60) sendTime();
}, ACT_TICK * 1000);
addEventListener('visibilitychange', function(){ if (document.hidden) sendTime(); });
addEventListener('pagehide', sendTime);

// Any uncaught error goes to the log too, so a crash on his device is visible on the sheet.
addEventListener('error', function(ev){
  try { logEvents([{ app: APP_NAME, kind: 'error', title: String(ev.message || ev.error || 'error').slice(0, 200), block: String((ev.error && ev.error.stack) || (ev.filename + ':' + ev.lineno)).slice(0, 300) }]); } catch (e) {}
});
addEventListener('unhandledrejection', function(ev){
  try { logEvents([{ app: APP_NAME, kind: 'error', title: 'unhandled: ' + String(ev.reason && (ev.reason.message || ev.reason)).slice(0, 200) }]); } catch (e) {}
});
