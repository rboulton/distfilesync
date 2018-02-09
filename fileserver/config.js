const nconf = require('nconf');

class Config {
  constructor() {
    nconf.argv().env({
      separator: '__',
      parseValues: true
    });
    const env = nconf.get('NODE_ENV') || 'development';
    nconf.file(env, './config/' + env.toLowerCase() + '.json');
    nconf.file('default', './config/default.json');
  }

  get(key) {
    return nconf.get(key);
  }
}

module.exports = new Config();
