import CryptoJS from 'crypto-js';

// Derive encryption key from user's password
export function deriveKey(password: string, salt: string): string {
  return CryptoJS.PBKDF2(password, salt, {
    keySize: 256 / 32,
    iterations: 10000,
  }).toString();
}

// Generate random salt
export function generateSalt(): string {
  return CryptoJS.lib.WordArray.random(128 / 8).toString();
}

// Encrypt data
export function encrypt(data: string, key: string): string {
  return CryptoJS.AES.encrypt(data, key).toString();
}

// Decrypt data
export function decrypt(encryptedData: string, key: string): string {
  const bytes = CryptoJS.AES.decrypt(encryptedData, key);
  return bytes.toString(CryptoJS.enc.Utf8);
}

// Encrypt vault item
export interface VaultItemData {
  title: string;
  username: string;
  password: string;
  url: string;
  notes: string;
}

export function encryptVaultItem(
  item: VaultItemData,
  masterPassword: string
): { encrypted: string; salt: string } {
  const salt = generateSalt();
  const key = deriveKey(masterPassword, salt);
  const dataString = JSON.stringify(item);
  const encrypted = encrypt(dataString, key);
  
  return { encrypted, salt };
}

// Decrypt vault item
export function decryptVaultItem(
  encryptedData: string,
  salt: string,
  masterPassword: string
): VaultItemData {
  const key = deriveKey(masterPassword, salt);
  const decrypted = decrypt(encryptedData, key);
  return JSON.parse(decrypted);
}