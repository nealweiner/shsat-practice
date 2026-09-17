// Voucher signing, shared by the SHSAT apps (rewards.js) and the parent page (parent.html).
// Same scheme as the ISEE / Grammar Fix-It apps, different secret: a code is a 4-char
// nonce plus a 6-char signature over nonce + item type + secret.

var VOUCHER_SECRET = 'SHS4T-V4UGHN-2026!qZr9-mK';
var VOUCHER_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
var PARENT_URL = 'https://nealweiner.github.io/shsat-practice/parent.html';

var STORE_ITEMS = [
  { id: 'screen15', code: '1', name: '15 min screen time', minutes: 15, icon: '📱', cost: 100 },
  { id: 'screen30', code: '2', name: '30 min screen time', minutes: 30, icon: '📱', cost: 180 },
  { id: 'screen60', code: '3', name: '1 hour screen time', minutes: 60, icon: '🖥️', cost: 320 },
  { id: 'late15',   code: '4', name: 'After 8 PM (15 min)', minutes: 15, icon: '🌙', cost: 150, note: 'After 8 PM' }
];
function storeItem(id){ return STORE_ITEMS.find(function(i){ return i.id === id; }); }

function voucherHash(nonce, typeCode) {
  var input = nonce + '|' + typeCode + '|' + VOUCHER_SECRET;
  var h1 = 2166136261;
  for (var i = 0; i < input.length; i++) { h1 ^= input.charCodeAt(i); h1 = Math.imul(h1, 16777619); }
  h1 = h1 >>> 0;
  var input2 = input + '|' + String(h1), h2 = 2166136261;
  for (var j = 0; j < input2.length; j++) { h2 ^= input2.charCodeAt(j); h2 = Math.imul(h2, 16777619); }
  h2 = h2 >>> 0;
  var sig = '', v1 = h1, v2 = h2;
  for (var k = 0; k < 3; k++) { sig += VOUCHER_CHARS.charAt(v1 % 30); v1 = Math.floor(v1 / 30); }
  for (k = 0; k < 3; k++) { sig += VOUCHER_CHARS.charAt(v2 % 30); v2 = Math.floor(v2 / 30); }
  return sig;
}

function generateSignedVoucherCode(itemId) {
  var item = storeItem(itemId);
  if (!item) throw new Error('Unknown item: ' + itemId);
  var nonce = '';
  for (var i = 0; i < 4; i++) nonce += VOUCHER_CHARS.charAt(Math.floor(Math.random() * 30));
  return nonce + voucherHash(nonce, item.code);
}

// Returns the store item for a valid code, or null.
function verifyVoucherCode(code) {
  if (!code || code.length !== 10) return null;
  for (var i = 0; i < code.length; i++) if (VOUCHER_CHARS.indexOf(code.charAt(i)) === -1) return null;
  var nonce = code.substring(0, 4), sig = code.substring(4);
  for (var k = 0; k < STORE_ITEMS.length; k++)
    if (voucherHash(nonce, STORE_ITEMS[k].code) === sig) return STORE_ITEMS[k];
  return null;
}
