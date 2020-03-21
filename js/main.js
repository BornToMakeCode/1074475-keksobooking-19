'use strict';

(function () {

  function getRandom(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }

  var pinButton = document.querySelector('.map__pin--main');
  var AdvertisementForm = function () {
    var formElement = document.querySelector('.ad-form');

    this.submitButton = formElement.querySelector('.ad-form__submit');
    this.resetButton = formElement.querySelector('.ad-form__reset');
    this.isDisabled = formElement.classList.contains('ad-form--disabled');
    this.title = formElement.querySelector('#title');
    this.address = formElement.querySelector('#address');
    this.type = formElement.querySelector('#type');
    this.price = formElement.querySelector('#price');
    this.timein = formElement.querySelector('#timein');
    this.timeout = formElement.querySelector('#timeout');
    this.roomNumber = formElement.querySelector('#room_number');
    this.capacity = formElement.querySelector('#capacity');
    this.description = formElement.querySelector('#description');
    this.images = formElement.querySelector('#images');
    this.features = {
      'wifi': formElement.querySelector('#feature-wifi'),
      'dishwasher': formElement.querySelector('#feature-dishwasher'),
      'parking': formElement.querySelector('#feature-parking'),
      'washer': formElement.querySelector('#feature-washer'),
      'elevator': formElement.querySelector('#feature-elevator'),
      'conditioner': formElement.querySelector('#feature-conditioner')
    };

    this.onSubmit = function (handler) {
      formElement.addEventListener('submit', handler);
    };

    this.disable = function (isDisabled) {
      var shouldBeDisabled = typeof isDisabled === 'boolean' ? isDisabled : true;

      if (shouldBeDisabled) {
        if (!this.isDisabled) {
          formElement.classList.add('ad-form--disabled');
        }
      } else {
        formElement.classList.remove('ad-form--disabled');
      }

      this.title.disabled = shouldBeDisabled;
      this.address.disabled = shouldBeDisabled;
      this.type.disabled = shouldBeDisabled;
      this.price.disabled = shouldBeDisabled;
      this.timein.disabled = shouldBeDisabled;
      this.timeout.disabled = shouldBeDisabled;
      this.roomNumber.disabled = shouldBeDisabled;
      this.capacity.disabled = shouldBeDisabled;
      this.description.disabled = shouldBeDisabled;
      this.images.disabled = shouldBeDisabled;
      this.features.wifi.disabled = shouldBeDisabled;
      this.features.dishwasher.disabled = shouldBeDisabled;
      this.features.parking.disabled = shouldBeDisabled;
      this.features.washer.disabled = shouldBeDisabled;
      this.features.elevator.disabled = shouldBeDisabled;
      this.features.conditioner.disabled = shouldBeDisabled;
      this.submitButton.disabled = shouldBeDisabled;
      this.resetButton.disabled = shouldBeDisabled;
    };

    this.areRoomWidthCapacityValid = function () {
      var result = false;
      if (this.roomNumber.value === '100' || this.capacity.value === '0') {
        result = this.capacity.value === '0' && this.roomNumber.value === '100';
      } else {
        result = this.roomNumber.value >= this.capacity.value;
      }
      return result;
    };

    this.isRoomNumberValid = function () {
      var result = false;
      switch (this.capacity.value) {
        case '0':
          result = this.roomNumber.value === '100';
          break;
        default:
          result = this.roomNumber.value >= this.capacity.value;
          break;
      }
      return result;
    };

    this.isCapacityValid = function () {
      var result = false;
      switch (this.roomNumber.value) {
        case '100':
          result = this.capacity.value === '0';
          break;
        default:
          result = this.capacity.value <= this.roomNumber.value;
          break;
      }
      return result;
    };
  };

  var FilterForm = function () {
    var formElement = document.querySelector('.map__filters');

    this.type = formElement.querySelector('#housing-type');
    this.price = formElement.querySelector('#housing-price');
    this.roomNumber = formElement.querySelector('#housing-rooms');
    this.capacity = formElement.querySelector('#housing-guests');
    this.features = {
      'wifi': formElement.querySelector('#filter-wifi'),
      'dishwasher': formElement.querySelector('#filter-dishwasher'),
      'parking': formElement.querySelector('#filter-parking'),
      'washer': formElement.querySelector('#filter-washer'),
      'elevator': formElement.querySelector('#filter-elevator'),
      'conditioner': formElement.querySelector('#filter-conditioner')
    };

    this.disable = function (isDisabled) {
      var shouldBeDisabled = typeof isDisabled === 'boolean' ? isDisabled : true;

      this.type.disabled = shouldBeDisabled;
      this.price.disabled = shouldBeDisabled;
      this.roomNumber.disabled = shouldBeDisabled;
      this.capacity.disabled = shouldBeDisabled;
      this.features.wifi.disabled = shouldBeDisabled;
      this.features.dishwasher.disabled = shouldBeDisabled;
      this.features.parking.disabled = shouldBeDisabled;
      this.features.washer.disabled = shouldBeDisabled;
      this.features.elevator.disabled = shouldBeDisabled;
      this.features.conditioner.disabled = shouldBeDisabled;
    };
  };
  var newAdvertisement = new AdvertisementForm();
  var newFilter = new FilterForm();

  var disablePage = function () {
    newAdvertisement.disable();
    newFilter.disable();
  };

  var enablePage = function () {
    newAdvertisement.disable(false);
    newFilter.disable(false);
  };

  var onPinButtonClick = function (evt) {
    var mainButton = 0;

    if (evt.button === mainButton) {
      enablePage();
    }
  };

  var onPinButtonEnter = function (evt) {
    if (evt.key === 'Enter') {
      enablePage();
    }
  };

  var onPinButtonMove = function (evt) {
    var mainButton = 0;
    // 44px + 22px - pins height

    if (evt.button === mainButton) {
      // debugger;
    }
  };

  var onRoomNumberSubmit = function () {
    if (!newAdvertisement.isRoomNumberValid()) {
      newAdvertisement.roomNumber.setCustomValidity('Количество комнат не может быть меньше количества мест');
    } else {
      newAdvertisement.roomNumber.setCustomValidity('');
    }
  };

  var onCapacitySubmit = function () {
    if (!newAdvertisement.isCapacityValid()) {
      newAdvertisement.capacity.setCustomValidity('Количество мест не может превышать количество комнат');
    } else {
      newAdvertisement.capacity.setCustomValidity('');
    }
  };

  pinButton.addEventListener('keydown', onPinButtonEnter);
  pinButton.addEventListener('mousedown', onPinButtonClick);
  pinButton.addEventListener('mousedown', onPinButtonMove);
  newAdvertisement.onSubmit(onRoomNumberSubmit);
  newAdvertisement.onSubmit(onCapacitySubmit);

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

  disablePage();
  generatePins();
  generateAdvertisementCards();
  document.querySelector('.map').classList.remove('map--faded');
})();
