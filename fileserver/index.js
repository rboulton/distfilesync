const {Store} = require('./store');
const {Api} = require('./api');

(async () => {
  const store = new Store();
  const api = new Api(store);
  console.log('Initialising...');

  await store.init();
  await api.init();

  console.log('Running...');
  api.run();
})().catch(err => {
  console.log(err);
});
