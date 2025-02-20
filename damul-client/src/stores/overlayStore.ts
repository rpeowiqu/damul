import { create } from "zustand";

interface OverlayStore {
  overlaySet: Set<string>;
  keyStack: string[];
  openOverlay: (key: string) => void;
  closeOverlay: (key: string, onClose?: () => void) => void;
}

const useOverlayStore = create<OverlayStore>()((set, get) => ({
  overlaySet: new Set(),
  keyStack: [],
  openOverlay: (key) =>
    set((state) => {
      const newSet = new Set(state.overlaySet);
      newSet.add(key);
      const newStack = [...state.keyStack, key];
      history.pushState(null, "", window.location.pathname);

      return { overlaySet: newSet, keyStack: newStack };
    }),
  closeOverlay: (key: string, onClose?: () => void) =>
    set((state) => {
      const lastKey = get().keyStack[get().keyStack.length - 1];
      if (key !== lastKey) {
        return state;
      }

      const newSet = new Set(state.overlaySet);
      newSet.delete(key);
      const newStack = state.keyStack.slice(0, -1);
      onClose?.();

      return { overlaySet: newSet, keyStack: newStack };
    }),
}));

export default useOverlayStore;
