/** Browser-only RSA-OAEP (SHA-256) + Base64URL for GTC site-visit proof. */

function pemToDer(pem) {
  const base64 = String(pem)
    .replace('-----BEGIN PUBLIC KEY-----', '')
    .replace('-----END PUBLIC KEY-----', '')
    .replace(/\s+/g, '');
  return Uint8Array.from(atob(base64), (ch) => ch.charCodeAt(0));
}

function bytesToBase64Url(bytes) {
  const b64 = btoa(Array.from(bytes, (byte) => String.fromCharCode(byte)).join(''));
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

/**
 * @param {{ public_key: string }} key
 * @param {string} jsonPlaintext
 * @returns {Promise<string>} Base64URL ciphertext
 */
export async function rsaOaepEncryptJson(key, jsonPlaintext) {
  const der = pemToDer(key.public_key);
  const publicKey = await crypto.subtle.importKey('spki', der, { name: 'RSA-OAEP', hash: 'SHA-256' }, false, ['encrypt']);

  const bits = publicKey.algorithm.modulusLength;
  if (!Number.isFinite(bits) || bits < 2048) throw new Error('UNSUPPORTED_RSA_KEY');

  const plaintext = new TextEncoder().encode(jsonPlaintext);
  const maxLen = bits / 8 - 2 * 32 - 2;
  if (plaintext.byteLength > maxLen) throw new Error('RSA_PLAINTEXT_TOO_LONG');

  const encrypted = await crypto.subtle.encrypt({ name: 'RSA-OAEP' }, publicKey, plaintext);
  return bytesToBase64Url(new Uint8Array(encrypted));
}