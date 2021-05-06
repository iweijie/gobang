import findBastPoints from './index';

// Post data to parent thread

// Respond to message from parent thread
self.addEventListener('message', event => {
  const { token, ...other } = event.data;
  const index = findBastPoints(other);
  // console.log('index', index);
  self.postMessage({ index, token });
});
