const ld = require('../node_modules/lodash/index');
const moment = require('../node_modules/moment/moment');
const setMetadata = require('../ms-users/lib/utils/updateMetadata.js');

module.exports = exports = function mixPlan(username, audience) {
  const id = 'free';
  const plan = {
    plan: {
      name: 'free',
      description: 'Default free plan',
      type: 'infinite',
      state: 'active',
      payment_definitions: [{
        name: 'free',
        type: 'regular',
        frequency: 'month',
        frequency_interval: '1',
        cycles: '0',
        amount: {currency: 'USD', value: '0'}
      }],
      id: 'free',
      hidden: false
    },
    subs: [{
      name: 'month',
      models: 100,
      price: 0.5,
      definition: {
        name: 'free',
        type: 'regular',
        frequency: 'month',
        frequency_interval: '1',
        cycles: '0',
        amount: {currency: 'USD', value: '0'}
      }
    }],
    alias: 'free',
    hidden: false
  };

  const subscription = ld.findWhere(plan.subs, {name: 'month'});
  const nextCycle = moment().add(1, 'month').format();
  const update = {
    username,
    audience,
    metadata: {
      '$set': {
        plan: id,
        agreement: id,
        nextCycle,
        models: subscription.models,
        modelPrice: subscription.price,
      },
    },
  };

  return setMetadata.call(this, update);
};
