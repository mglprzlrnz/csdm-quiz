class LocalStorageService {

  set(key, value) {
    const normalizedValue = JSON.stringify(value);
    localStorage.setItem(key, normalizedValue);
  }
  remove(key) {
    localStorage.removeItem(key);
  }
  get(key) {
    const normalizedValue = localStorage.getItem(key);
    return JSON.parse(normalizedValue, (_, value) => {
      if (value === null) {
        return undefined;
      }
      return value;
    }, 0);
  }
  dispose() {
    localStorage.clear();
  }
}
export const localStorageService = new LocalStorageService();
