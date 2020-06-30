const marketEvent = new (require('events').EventEmitter)();

let offerId = 0;

const emitter_ = () => {
  marketEvent.emit('New Offer', {
    id: offerId++,
    pricePerBox: Math.ceil(Math.random() * 10),
    boxes: Math.floor(Math.random() * 100),
    travel: Math.floor(Math.random() * 1000)
  });
};

const launchEmitter = () => {
  emitter_();
  setTimeout(launchEmitter, Math.random() * 10000);
};

/* END - A VIRER */

module.exports = {launchEmitter, marketEvent};
