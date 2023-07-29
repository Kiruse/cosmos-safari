
export type Result<T, E> = Ok<T> | Err<E>;
export type Ok<T> = T extends void ? { ok: true } : { ok: true, value: T };
export type Err<E> = E extends void ? { ok: false } : { ok: false, error: E };

export function Ok(): Ok<void>;
export function Ok<T>(value: T): Ok<T>;
export function Ok() {
  if (arguments.length) {
    return { ok: true, value: arguments[0] };
  } else {
    return { ok: true };
  }
}

export function Err(): Err<void>;
export function Err<E>(error: E): Err<E>;
export function Err() {
  if (arguments.length) {
    return { ok: false, error: arguments[0] };
  } else {
    return { ok: false };
  }
}
