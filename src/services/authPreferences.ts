import AsyncStorage from '@react-native-async-storage/async-storage';

const LAST_LOGIN_EMAIL_KEY = 'stayventory:last-login-email';

export async function getLastLoginEmail() {
  return AsyncStorage.getItem(LAST_LOGIN_EMAIL_KEY);
}

export async function setLastLoginEmail(email: string) {
  return AsyncStorage.setItem(LAST_LOGIN_EMAIL_KEY, email.trim().toLowerCase());
}
