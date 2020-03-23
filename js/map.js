'use strict';

(function () {
  var offerType = {
    palace: 'Дворец',
    flat: 'Квартира',
    house: 'Дом',
    bungalo: 'Бунгало'
  };
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

    var addressElement = cardElement.querySelector('.popup__text--address');
    var priceElement = cardElement.querySelector('.popup__text--price');
    var typeElement = cardElement.querySelector('.popup__type');
    var roomNumberElement = cardElement.querySelector('.popup__text--capacity');
    var timeElement = cardElement.querySelector('.popup__text--time');
    var descriptionElement = cardElement.querySelector('.popup__description');
    var avatarElement = cardElement.querySelector('.popup__avatar');

    if (advertisement.offer.address) {
      addressElement.textContent = advertisement.offer.address;
    } else {
      addressElement.remove();
    }
    if (advertisement.offer.price !== undefined) {
      priceElement.textContent = advertisement.offer.price + '₽/ночь';
    } else {
      priceElement.remove();
    }
    if (advertisement.offer.type && offerType[advertisement.offer.type]) {
      typeElement.textContent = offerType[advertisement.offer.type];
    } else {
      typeElement.remove();
    }
    if (advertisement.offer.rooms !== undefined && advertisement.offer.guests !== undefined) {
      roomNumberElement.textContent = advertisement.offer.guests === 0 ?
        'Не для гостей' :
        advertisement.offer.rooms + ' комнаты для ' + advertisement.offer.guests + ' гостей';
    } else {
      roomNumberElement.remove();
    }
    if (advertisement.offer.checkin && advertisement.offer.checkout) {
      timeElement.textContent = 'Заезд после ' + advertisement.offer.checkin + ', выезд до ' + advertisement.offer.checkout;
    } else {
      timeElement.remove();
    }
    if (advertisement.offer.description) {
      descriptionElement.textContent = advertisement.offer.description;
    } else {
      descriptionElement.remove();
    }
    if (advertisement.offer.type) {
      avatarElement.src = advertisement.author.avatar;
    } else {
      avatarElement.remove();
    }

    var featuresContainer = cardElement.querySelector('.popup__features');
    if (advertisement.offer.features && advertisement.offer.features.length > 0) {
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
    } else {
      featuresContainer.remove();
    }

    var photosContainer = cardElement.querySelector('.popup__photos');

    if (advertisement.offer.photos.length > 0) {
      var photosFragment = document.createDocumentFragment();

      for (var index = 0; index < advertisement.offer.photos.length; index++) {
        var imgElement = photosContainer.querySelector('.popup__photo').cloneNode(true);
        imgElement.src = advertisement.offer.photos[index];
        photosFragment.appendChild(imgElement);
      }

      photosContainer.querySelector('.popup__photo').remove();
      photosContainer.appendChild(photosFragment);
    } else {
      photosContainer.remove();
    }

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

  var onFillterValueChange = function (changedValue, handler) {
    window.utils.debounce(function () {
      removeOpenedAdvertisementCard();
      handler(changedValue);
    });
  };

  var onTypeChange = function (handler) {
    filterFormType.addEventListener('change', function () {
      onFillterValueChange(filterFormType.value, handler);
    });
  };

  var onPriceChange = function (handler) {
    filterFormPrice.addEventListener('change', function () {

      onFillterValueChange(filterFormPrice.value, handler);
    });
  };

  var onRoomNumberChange = function (handler) {
    filterFormRoomNumber.addEventListener('change', function () {

      onFillterValueChange(filterFormRoomNumber.value, handler);
    });
  };

  var onCapacityChange = function (handler) {
    filterFormCapacity.addEventListener('change', function () {

      onFillterValueChange(filterFormCapacity.value, handler);
    });
  };

  var onFeaturesChange = function (handler) {
    filterForm.querySelector('.map__features').addEventListener('change', function () {
      var checkedNodes = document.querySelectorAll('.map__checkbox:checked');
      var selectedFeatures = Array.from(checkedNodes, function (element) {
        return element.value;
      });

      onFillterValueChange(selectedFeatures, handler);
    });
  };

  var enable = function () {
    disableFilter(false);
  };

  var disable = function () {
    disableFilter();
  };

  var reset = function () {
    removeAdvertisments();
    removeOpenedAdvertisementCard();
    filterForm.reset();
    disable();
  };

  var mapFilter = {
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
    filter: mapFilter
  };
})();
