'use strict';

(function () {

  var mapContainer = document.querySelector('.map');
  var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
  var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');
  var filtersContainer = document.querySelector('.map__filters-container');

  var filterForm = document.querySelector('.map__filters');
  var filterFormType = filterForm.querySelector('#housing-type');
  var filterFormPrice = filterForm.querySelector('#housing-price');
  var filterFormRoomNumber = filterForm.querySelector('#housing-rooms');
  var filterFormCapacity = filterForm.querySelector('#housing-guests');
  var filterFormFeatures = {
    'wifi': filterForm.querySelector('#filter-wifi'),
    'dishwasher': filterForm.querySelector('#filter-dishwasher'),
    'parking': filterForm.querySelector('#filter-parking'),
    'washer': filterForm.querySelector('#filter-washer'),
    'elevator': filterForm.querySelector('#filter-elevator'),
    'conditioner': filterForm.querySelector('#filter-conditioner')
  };

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

  var removeOpenedAdvertisementCard = function () {
    var openedAdvertisementCard = mapContainer.querySelector('.map__card');
    if (openedAdvertisementCard !== null) {
      openedAdvertisementCard.remove();
    }
  };

  var showAdvertisementCard = function (advertisement) {
    removeOpenedAdvertisementCard();

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

  var removeAdvertisments = function () {
    var pinsContainer = document.querySelector('.map__pins');
    var pointer = document.querySelector('.map__pin--main');
    var overlay = document.querySelector('.map__overlay');
    var pinsFragment = document.createDocumentFragment();
    pinsFragment.appendChild(overlay);
    pinsFragment.appendChild(pointer);
    pinsContainer.innerHTML = '';
    pinsContainer.append(pinsFragment);
  };

  var disableFilter = function (isDisabled) {
    var shouldBeDisabled = typeof isDisabled === 'boolean' ? isDisabled : true;

    filterFormType.disabled = shouldBeDisabled;
    filterFormPrice.disabled = shouldBeDisabled;
    filterFormRoomNumber.disabled = shouldBeDisabled;
    filterFormCapacity.disabled = shouldBeDisabled;
    filterFormFeatures.wifi.disabled = shouldBeDisabled;
    filterFormFeatures.dishwasher.disabled = shouldBeDisabled;
    filterFormFeatures.parking.disabled = shouldBeDisabled;
    filterFormFeatures.washer.disabled = shouldBeDisabled;
    filterFormFeatures.elevator.disabled = shouldBeDisabled;
    filterFormFeatures.conditioner.disabled = shouldBeDisabled;
  };

  var enable = function () {
    disableFilter(false);
  };

  var disable = function () {
    disableFilter();
  };

  var reset = function () {
    removeAdvertisments();
    disable();
  };

  var onTypeChange = function (handler) {
    filterFormType.addEventListener('change', function () {
      removeOpenedAdvertisementCard();
      handler(filterFormType.value);
    });
  };

  var onPriceChange = function (handler) {
    filterFormPrice.addEventListener('change', function () {
      removeOpenedAdvertisementCard();
      handler(filterFormPrice.value);
    });
  };

  var onRoomNumberChange = function (handler) {
    filterFormRoomNumber.addEventListener('change', function () {
      removeOpenedAdvertisementCard();
      handler(filterFormRoomNumber.value);
    });
  };

  var onCapacityChange = function (handler) {
    filterFormCapacity.addEventListener('change', function () {
      removeOpenedAdvertisementCard();
      handler(filterFormCapacity.value);
    });
  };

  var onFeaturesChange = function (handler) {

    document.querySelector('.map__features').addEventListener('mousedown', function (evt) {
      var mainButton = 0;
      if (evt.button === mainButton) {
        var a = document.querySelectorAll('.map__checkbox')[0].checked;
        console.log(a);
      }
    });
  };

  var filter = {
    onTypeChange: onTypeChange,
    onPriceChange: onPriceChange,
    onRoomNumberChange: onRoomNumberChange,
    onCapacityChange: onCapacityChange,
    onFeaturesChange: onFeaturesChange
  };

  window.map = {
    disable: disable,
    enable: enable,
    reset: reset,
    addAdvertisments: addAdvertisments,
    removeAdvertisments: removeAdvertisments,
    filter: filter
  };
})();
