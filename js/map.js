'use strict';

(function () {

  var mapContainer = document.querySelector('.map');
  var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
  var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');
  var filtersContainer = document.querySelector('.map__filters-container');

  var createAdvertisementCard = function (advertisement) {
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

  var showAdvertisementCard = function (advertisement) {
    var selectedAddCard = mapContainer.querySelector('.map__card');
    if (selectedAddCard !== null) {
      selectedAddCard.remove();
    }

    var advertisementCard = createAdvertisementCard(advertisement);
    var onCloseAdButtonClick = function () {
      advertisementCard.remove();
      removePinHighlight();
    };

    var onOpenedAdKeydown = function (evt) {
      if (evt.key === window.utils.Key.ESCAPE) {
        advertisementCard.remove();
        removePinHighlight();
        document.removeEventListener('keydown', onOpenedAdKeydown);
      }
    };

    var closeAdButton = advertisementCard.querySelector('.popup__close');
    document.addEventListener('keydown', onOpenedAdKeydown);
    closeAdButton.addEventListener('click', onCloseAdButtonClick);
    var advertisementCardsFragment = document.createDocumentFragment();
    advertisementCardsFragment.appendChild(advertisementCard);
    mapContainer.insertBefore(advertisementCardsFragment, filtersContainer);
  };

  var highlightPin = function (pin) {
    removePinHighlight();
    pin.classList.add('map__pin--active');
  };

  var removePinHighlight = function () {
    var selectedPin = document.querySelector('.map__pin--active');
    if (selectedPin !== null) {
      selectedPin.classList.remove('map__pin--active');
    }
  };

  var addPin = function (advertisement) {
    var pinElement = pinTemplate.cloneNode(true);
    pinElement.style.left = advertisement.location.x + 'px';
    pinElement.style.top = advertisement.location.y + 'px';
    pinElement.firstChild.src = advertisement.author.avatar;
    pinElement.firstChild.alt = advertisement.offer.title;

    var onPinClick = function () {
      highlightPin(pinElement);
      showAdvertisementCard(advertisement);
    };

    var onPinEnter = function (evt) {
      if (evt.key === window.utils.Key.ENTER) {
        highlightPin(pinElement);
        showAdvertisementCard(advertisement);
      }
    };
    pinElement.addEventListener('keydown', onPinEnter);
    pinElement.addEventListener('click', onPinClick);

    return pinElement;
  };

  var addAdvertisments = function (pins) {
    var pinsFragment = document.createDocumentFragment();

    for (var index = 0; index < pins.length; index++) {
      var pin = addPin(pins[index]);
      pinsFragment.appendChild(pin);
    }

    var pinsContainer = document.querySelector('.map__pins');
    pinsContainer.appendChild(pinsFragment);
  };

  window.map = {
    addAdvertisments: addAdvertisments
  };
})();
