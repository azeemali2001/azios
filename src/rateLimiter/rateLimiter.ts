let queue: Function[] = [];
let activeRequests = 0;

export function schedule(task: Function, limit: number) {

  return new Promise((resolve, reject) => {

    const run = async () => {

      activeRequests++;

      try {
        const result = await task();
        resolve(result);
      } catch (err) {
        reject(err);
      }

      activeRequests--;

      if (queue.length) {
        const next = queue.shift();
        next && next();
      }

    };

    if (activeRequests < limit) {
      run();
    } else {
      queue.push(run);
    }

  });

}