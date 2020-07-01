const recup = require('./proj.js');

const truck = {
  capacity: 50,
  fuelComsuption: 10
};

const company = {
  money: 100,
  truckAvailable: 1,
  fuelPrice: 1
};

const getGainFromOffer = (offer) => {
  return offer.pricePerBox * offer.boxes;
};

const marketPlace = (offer) => {
  console.log(
    '[ OFFER %s ] price per box : %s | boxes : %s | travel : %s',
    offer.id,
    offer.pricePerBox,
    offer.boxes,
    offer.travel
  );

  new Promise((resolve, reject) => {
    const travelCost =
      (offer.travel / truck.fuelComsuption) * company.fuelPrice;

    if (company.money > 500) {
      company.truckAvailable++;
      company.money -= 500;
    }

    if (
      offer.boxes <= truck.capacity &&
      travelCost < company.money &&
      getGainFromOffer(offer) > travelCost &&
      company.truckAvailable > 0
    ) {
      company.money -= travelCost;
      resolve(offer);
    } else {
      reject(offer);
    }
  }).then(acceptOffer, refuseOffer);
};

const acceptOffer = (offer) => {
  company.truckAvailable--;

  console.log('\u001B[32m[ OFFER %s ] ACCEPTED\u001B[0m', offer.id);

  const travelTime = offer.travel * 10;
  setTimeout(gainMoney, travelTime, offer);
};

const gainMoney = (offer) => {
  const gain = getGainFromOffer(offer);
  console.log('[ OFFER %s ] END ( gain = %s )', offer.id, gain);
  company.truckAvailable++;
  company.money += gain;

  console.log(
    '\u001B[33m[ COMPANY STATUS ] truck available : %s | money : %s\u001B[0m',
    company.truckAvailable,
    company.money
  );
};

const refuseOffer = (offer) => {
  console.log('\u001B[31m[ OFFER %s ] REFUSED\u001B[0m', offer.id);
};

recup.marketEvent.on('New Offer', (offer) => marketPlace(offer));

recup.launchEmitter();
