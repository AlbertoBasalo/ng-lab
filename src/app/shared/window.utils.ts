export function setLocalStorage(key: string, value: object) {
  if (window === undefined) return;
  window.localStorage.setItem(key, JSON.stringify(value));
}
export function getLocalStorage(key: string) {
  try {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    return null;
  }
}
export function removeLocalStorage(key: string) {
  try {
    window.localStorage.removeItem(key);
    return true;
  } catch (error) {
    return null;
  }
}
export function displayAlert(alert: { title: string; message: string }) {
  try {
    window.alert(`${alert.title}\n${alert.message}`);
  } catch (error) {
    console.error('unhandled error', alert);
  }
}
