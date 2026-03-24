const FLOW_KEYS = {
  registration: "pendingRegistration",
  login: "pendingLogin",
  reset: "pendingReset",
};

export const savePendingFlow = (type, payload) => {
  const key = FLOW_KEYS[type];
  if (!key) return;
  localStorage.setItem(key, JSON.stringify(payload));
};

export const getPendingFlow = (type) => {
  const key = FLOW_KEYS[type];
  if (!key) return null;
  const raw = localStorage.getItem(key);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch (_) {
    localStorage.removeItem(key);
    return null;
  }
};

export const clearPendingFlow = (type) => {
  const key = FLOW_KEYS[type];
  if (!key) return;
  localStorage.removeItem(key);
};

export const clearAllPendingFlows = () => {
  Object.values(FLOW_KEYS).forEach((key) => localStorage.removeItem(key));
};

export const createResendDeadline = (seconds = 60) => Date.now() + seconds * 1000;

export const getRemainingSeconds = (deadline) => {
  if (!deadline) return 0;
  const diff = Math.floor((Number(deadline) - Date.now()) / 1000);
  return diff > 0 ? diff : 0;
};
