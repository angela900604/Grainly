/** Short invite codes without ambiguous 0/O/1/I */
const ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";

export function randomInviteCode(length = 6): string {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  let out = "";
  for (let i = 0; i < length; i++) {
    out += ALPHABET[bytes[i]! % ALPHABET.length];
  }
  return out;
}
