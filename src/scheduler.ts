import { DateTime } from 'luxon'

export function schedule(timestamp: DateTime, task: () => Promise<void>) {
  const diff = timestamp.diffNow().as('milliseconds');
  const id = setTimeout(async () => {
    try {
      await task();
    } catch (err: any) {
      console.error("Error while executing scheduled task:", err);
    }
  }, diff);
  return () => {
    clearTimeout(id);
  };
}

/** Decorator for scheduling a task multiple times a day. */
export function daily(...times: string[]) {
  const terms = times.map(todayAt).sort((a, b) => a.toMillis() - b.toMillis());
  const cycle = () => {
    const curr = terms.shift()!;
    terms.push(curr.plus({ days: 1 }));
    return curr;
  }

  return (task: () => Promise<void>, { runNow = false }: { runNow?: boolean } = {}) => {
    const _task = () => task().catch(err => console.error("Error while executing daily-scheduled task:", err));
    if (runNow) _task();

    while (terms[0] < DateTime.now()) cycle();

    let terminator: () => void;
    const wrapper = async () => {
      await _task();
      terminator = schedule(cycle(), wrapper);
    }
    terminator = schedule(cycle(), wrapper);
    return () => terminator();
  };
}

export function interval(seconds: number, task: () => Promise<void>, { runNow = false }: { runNow?: boolean } = {}) {
  const _task = () => task().catch(err => console.error("Error while executing interval-scheduled task:", err));
  if (runNow) _task();

  let term = DateTime.now().plus({ seconds });
  let terminator: () => void;
  const wrapper = async () => {
    await _task();
    term = term.plus({ seconds });
    terminator = schedule(term, wrapper);
  }
  terminator = schedule(term, wrapper);

  return () => terminator();
}

const isValidTime = (time: string) => /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/.test(time);

function todayAt(time: string) {
  if (!isValidTime(time)) throw Error(`Invalid time: ${time}`);
  const [hours, minutes, seconds] = time.split(':').map(Number) as [number, number, number];
  return DateTime.now().startOf('day').plus({ hours, minutes, seconds });
}
