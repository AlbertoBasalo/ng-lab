export function setLocalStorage(key: string, value: object) {
  if (!window) return;
  window.localStorage.setItem(key, JSON.stringify(value));
}
export function getLocalStorage(key: string) {
  if (!window) return null;
  const value = window.localStorage.getItem(key);
  return value ? JSON.parse(value) : null;
}
export function removeLocalStorage(key: string) {
  if (!window) return;
  window.localStorage.removeItem(key);
}
export function displayAlert(alert: { title: string; message: string }) {
  if (!window) return;
  window.alert(`${alert.title}\n${alert.message}`);
}
