import { beforeEach, describe, expect, it } from "vitest";
import {
  clearAllPendingFlows,
  clearPendingFlow,
  createResendDeadline,
  getPendingFlow,
  getRemainingSeconds,
  savePendingFlow,
} from "./authFlow";

const store = {};

const mockStorage = {
  setItem: (key, value) => {
    store[key] = String(value);
  },
  getItem: (key) => (Object.prototype.hasOwnProperty.call(store, key) ? store[key] : null),
  removeItem: (key) => {
    delete store[key];
  },
  clear: () => {
    Object.keys(store).forEach((key) => delete store[key]);
  },
};

describe("auth flow persistence", () => {
  beforeEach(() => {
    global.localStorage = mockStorage;
    mockStorage.clear();
  });

  it("stores and restores pending registration", () => {
    const payload = { email: "demo@example.com", purpose: "registration" };
    savePendingFlow("registration", payload);

    expect(getPendingFlow("registration")).toEqual(payload);
  });

  it("clears specific and all pending flows", () => {
    savePendingFlow("registration", { email: "a@example.com" });
    savePendingFlow("login", { email: "b@example.com" });

    clearPendingFlow("registration");
    expect(getPendingFlow("registration")).toBeNull();
    expect(getPendingFlow("login")).toEqual({ email: "b@example.com" });

    clearAllPendingFlows();
    expect(getPendingFlow("login")).toBeNull();
  });

  it("computes resend countdown", () => {
    const deadline = createResendDeadline(3);
    const remaining = getRemainingSeconds(deadline);

    expect(remaining).toBeGreaterThanOrEqual(2);
    expect(remaining).toBeLessThanOrEqual(3);
  });
});
