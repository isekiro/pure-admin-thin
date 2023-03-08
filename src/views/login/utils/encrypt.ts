import JSEncrypt from "jsencrypt";

export const publicKey = `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDbOYcY8HbDaNM9ooYXoc9s+R5o
R05ZL1BsVKadQBgOVH/kj7PQuD+ABEFVgB6rJNi287fRuZeZR+MCoG72H+AYsAhR
sEaB5SuI7gDEstXuTyjhx5bz0wUujbDK4VMgRfPO6MQo+A0c95OadDEvEQDG3KBQ
wLXapv+ZfsjG7NgdawIDAQAB
-----END PUBLIC KEY-----`;

const encryptor = new JSEncrypt();

export const encryptorFunc = (password: string) => {
  // 设置公钥
  encryptor.setPublicKey(publicKey);
  // 加密密码
  const encPassword = encryptor.encrypt(password);
  return encPassword;
};
