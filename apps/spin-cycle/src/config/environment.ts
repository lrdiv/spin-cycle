export default () => {
  return {
    debugWorker: process.env.DEBUG_WORKER === '1',
  };
};
