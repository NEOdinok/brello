import { createEvent, createStore } from "effector";
import { persist } from "effector-storage/local";

export function createFlag({
  fieldName,
  initial = null,
}: {
  fieldName: string;
  initial?: boolean | null;
}) {
  const $isSet = createStore<boolean | null>(initial);

  const toggle = createEvent();
  const set = createEvent<boolean>();
  const reset = createEvent();

  const enable = createEvent();
  const disable = createEvent();
  const clear = createEvent();

  persist({ store: $isSet, key: `f:${fieldName}` });

  $isSet.on(toggle, (flag) => !flag);
  $isSet.on(set, (_, flag) => flag);
  $isSet.reset(reset);
  $isSet.on(enable, () => true);
  $isSet.on(disable, () => false);
  $isSet.on(clear, () => null);

  return {
    $isSet,
    toggle,
    set,
    reset,
    enable,
    disable,
    clear,
  };
}
