const recup = require('./proj.js');

const secondPerTravelUnit = 0.01;

const truck = {
  capacity: 50,
  fuelComsuption: 10
};

const company = {
  money: 100,
  truckAvailable: 1,
  fuelPrice: 1
};

const displayCompanyStatus = (message) => {
  console.log(
    '\u001B[33m[ COMPANY STATUS ] %s ( truck available : %s | money : %s )\u001B[0m',
    message,
    company.truckAvailable,
    company.money
  );
};

const getGainFromOffer = (offer) => {
  return offer.pricePerBox * offer.boxes;
};

const getCostFromOffer = (offer) => {
  return (offer.travel / truck.fuelComsuption) * company.fuelPrice * 2;
};

const marketPlace = (offer) => {
  // Dispay the new offer
  console.log(
    '[ OFFER %s ] price per box : %s | boxes : %s | travel : %s',
    offer.id,
    offer.pricePerBox,
    offer.boxes,
    offer.travel
  );

  new Promise((resolve, reject) => {
    const travelCost = getCostFromOffer(offer);

    // Buy a new truck for the company if enough money
    if (company.money > 1000) {
      company.truckAvailable++;
      company.money -= 500;

      displayCompanyStatus('JUST BUY NEW TRUCK');
    }

    if (
      // Is truck enough box capacity
      offer.boxes <= truck.capacity &&
      // Is enough money company to pay the travel
      travelCost < company.money &&
      // Are the gains higher than the costs
      getGainFromOffer(offer) > travelCost &&
      // Are trucks available
      company.truckAvailable > 0
    ) {
      // Pay for the necessary fuel
      company.money -= travelCost;

      // Then accept offer
      resolve(offer);
    } else {
      // On not
      reject(offer);
    }
  }).then(acceptOffer, refuseOffer);
};

const acceptOffer = (offer) => {
  console.log('\u001B[32m[ OFFER %s ] ACCEPTED\u001B[0m', offer.id);

  // Truck leave the parking from the company
  company.truckAvailable--;

  // Compute the travel time
  const travelTime = offer.travel * secondPerTravelUnit * 1000 * 2;

  setTimeout(gainMoney, travelTime, offer);
};

const gainMoney = (offer) => {
  // Compute gain from the offer
  const gain = getGainFromOffer(offer);
  console.log('[ OFFER %s ] END ( gain = %s )', offer.id, gain);

  // Truck back to parking
  company.truckAvailable++;

  // PAY DAY !!!
  company.money += gain;

  // COMPANY STATUS
  displayCompanyStatus('PAY DAY !!!');
};

const refuseOffer = (offer) => {
  console.log('\u001B[31m[ OFFER %s ] REFUSED\u001B[0m', offer.id);
};

recup.marketEvent.on('New Offer', (offer) => marketPlace(offer));

recup.launchEmitter();
