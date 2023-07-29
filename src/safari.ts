import type { Result } from './results.js'
import type { Log } from './types.js'

export type Report = {
  title: string;
  category: string;
  message: string;
  logs: Log[];
}

export interface Reporter {
  report(reports: Report[]): Promise<Result<void, Error>>;
}

class Safari {
  #reporters = new Set<Reporter>();

  addReporter = (reporter: Reporter) => {
    this.#reporters.add(reporter);
    return this;
  }

  report = async (...reports: Report[]) => {
    await Promise.all([...this.#reporters].map(reporter => reporter.report(reports)));
  }
}
export default new Safari();
