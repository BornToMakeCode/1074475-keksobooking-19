'use strict';

(function () {

  function getRandom(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }

  var getSimilarAdvertisements = function () {

    var PHOTO_SOURCES = [
      'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
      'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
      'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
    ];
    var advertisements = [];
    var appartmentType = ['palace', 'flat', 'house', 'bungalo'];
    var timeslot = ['12:00', '13:00', '14:00'];
    var features = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];

    for (var index = 1; index <= 8; index++) {

      advertisements.push(
          {
            'author': {
              'avatar': 'img/avatars/user0' + index + '.png'
            },
            'offer': {
              'title': 'Предложение №' + index,
              'address': '600, 350',
              'price': getRandom(100, 300),
              'type': appartmentType[Math.floor(Math.random() * 4)],
              'rooms': getRandom(1, 6),
              'guests': getRandom(1, 8),
              'checkin': timeslot[getRandom(0, 2)],
              'checkout': timeslot[getRandom(0, 2)],
              'features': [features[getRandom(0, 2)], features[getRandom(3, 5)]],
              'description': 'Описание предложения №' + index,
              'photos': PHOTO_SOURCES
            },

            'location': {
              'x': getRandom(200, 500),
              'y': getRandom(130, 630)
            }
          });
    }

    return advertisements;
  };

  var createPinForAdvertisement = function (advertisement) {

    var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

    var pinElement = pinTemplate.cloneNode(true);

    pinElement.style.left = advertisement.location.x + 'px';
    pinElement.style.top = advertisement.location.y + 'px';

    pinElement.firstChild.src = advertisement.author.avatar;
    pinElement.firstChild.alt = advertisement.offer.title;

    return pinElement;
  };

  var createAdvertisementCard = function (advertisement) {

    var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');

    var cardElement = cardTemplate.cloneNode(true);

    cardElement.querySelector('.popup__text--address').textContent = advertisement.offer.address;
    cardElement.querySelector('.popup__text--price').textContent = advertisement.offer.price + '₽/ночь';
    cardElement.querySelector('.popup__type').textContent = advertisement.offer.type;
    cardElement.querySelector('.popup__text--capacity').textContent = advertisement.offer.rooms + ' комнаты для ' + advertisement.offer.guests + ' гостей';
    cardElement.querySelector('.popup__text--time').textContent = 'заезд после ' + advertisement.offer.checkin + ', выезд до ' + advertisement.offer.checkout;
    cardElement.querySelector('.popup__description').textContent = advertisement.offer.description;
    cardElement.querySelector('.popup__avatar').src = advertisement.author.avatar;

    var featuresContainer = cardElement.querySelector('.popup__features');

    if (!advertisement.offer.features.includes('wifi')) {

      featuresContainer.querySelector('.popup__feature--wifi').remove();
    }
    if (!advertisement.offer.features.includes('dishwasher')) {

      featuresContainer.querySelector('.popup__feature--dishwasher').remove();
    }
    if (!advertisement.offer.features.includes('parking')) {

      featuresContainer.querySelector('.popup__feature--parking').remove();
    }
    if (!advertisement.offer.features.includes('washer')) {

      featuresContainer.querySelector('.popup__feature--washer').remove();
    }
    if (!advertisement.offer.features.includes('elevator')) {

      featuresContainer.querySelector('.popup__feature--elevator').remove();
    }
    if (!advertisement.offer.features.includes('conditioner')) {

      featuresContainer.querySelector('.popup__feature--conditioner').remove();
    }

    var photosContainer = cardElement.querySelector('.popup__photos');

    var photosFragment = document.createDocumentFragment();

    for (var index = 0; index < advertisement.offer.photos.length; index++) {
      var imgElement = photosContainer.querySelector('.popup__photo').cloneNode(true);
      imgElement.src = advertisement.offer.photos[index];
      photosFragment.appendChild(imgElement);
    }


    photosContainer.querySelector('.popup__photo').remove();
    photosContainer.appendChild(photosFragment);

    return cardElement;
  };

  var generatePins = function () {
    var similarAdvertisements = getSimilarAdvertisements();

    var advertisementPinsFragment = document.createDocumentFragment();

    for (var index = 0; index < similarAdvertisements.length; index++) {

      var pin = createPinForAdvertisement(similarAdvertisements[index]);
      advertisementPinsFragment.appendChild(pin);
    }

    var pinsContainer = document.querySelector('.map__pins');

    pinsContainer.appendChild(advertisementPinsFragment);
  };

  var generateAdvertisementCards = function () {
    var similarAdvertisements = getSimilarAdvertisements();

    var advertisementCardsFragment = document.createDocumentFragment();

    for (var index = 0; index < similarAdvertisements.length; index++) {

      var pin = createAdvertisementCard(similarAdvertisements[index]);
      advertisementCardsFragment.appendChild(pin);
    }

    var mapContainer = document.querySelector('.map');
    var filtersContainer = document.querySelector('.map__filters-container');

    mapContainer.insertBefore(advertisementCardsFragment, filtersContainer);
  };

  generatePins();
  generateAdvertisementCards();

  document.querySelector('.map').classList.remove('map--faded');
})();
