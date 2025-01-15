export const getRange = (start: number, end: number, step: number = 1): number[] => {
  return Array.from({ length: Math.ceil((end - start) / step) }, (_, i) => start + i * step);
};

export const sleep = (seconds: number): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), seconds * 1000);
  });
};

export const AM_CRON_EXPRESSION: string = '0 15 * * *';
export const TEST_CRON_EXPRESSION: string = '*/2 * * * *';
