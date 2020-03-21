'use strict';

(function () {

  function getRandom(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }

  var pinButton = document.querySelector('.map__pin--main');
  var adForm = document.querySelector('.ad-form');
  var adFormSubmitButton = adForm.querySelector('.ad-form__submit');
  var adFormResetButton = adForm.querySelector('.ad-form__reset');
  var adFormTitle = adForm.querySelector('#title');
  var adFormAddress = adForm.querySelector('#address');
  var adFormType = adForm.querySelector('#type');
  var adFormPrice = adForm.querySelector('#price');
  var adFormTimein = adForm.querySelector('#timein');
  var adFormTimeout = adForm.querySelector('#timeout');
  var adFormRoomNumber = adForm.querySelector('#room_number');
  var adFormCapacity = adForm.querySelector('#capacity');
  var adFormDescription = adForm.querySelector('#description');
  var adFormImages = adForm.querySelector('#images');
  var adFormFeatures = {
    'wifi': adForm.querySelector('#feature-wifi'),
    'dishwasher': adForm.querySelector('#feature-dishwasher'),
    'parking': adForm.querySelector('#feature-parking'),
    'washer': adForm.querySelector('#feature-washer'),
    'elevator': adForm.querySelector('#feature-elevator'),
    'conditioner': adForm.querySelector('#feature-conditioner')
  };
  var isAdFormDisabled = adForm.classList.contains('ad-form--disabled');
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

  var disableFilterForm = function (isDisabled) {
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

  var disableForm = function (isDisabled) {
    var shouldBeDisabled = typeof isDisabled === 'boolean' ? isDisabled : true;

    if (shouldBeDisabled) {
      if (!isAdFormDisabled) {
        adForm.classList.add('ad-form--disabled');
      }
    } else {
      adForm.classList.remove('ad-form--disabled');
    }

    adFormTitle.disabled = shouldBeDisabled;
    adFormAddress.disabled = shouldBeDisabled;
    adFormType.disabled = shouldBeDisabled;
    adFormPrice.disabled = shouldBeDisabled;
    adFormTimein.disabled = shouldBeDisabled;
    adFormTimeout.disabled = shouldBeDisabled;
    adFormRoomNumber.disabled = shouldBeDisabled;
    adFormCapacity.disabled = shouldBeDisabled;
    adFormDescription.disabled = shouldBeDisabled;
    adFormImages.disabled = shouldBeDisabled;
    adFormFeatures.wifi.disabled = shouldBeDisabled;
    adFormFeatures.dishwasher.disabled = shouldBeDisabled;
    adFormFeatures.parking.disabled = shouldBeDisabled;
    adFormFeatures.washer.disabled = shouldBeDisabled;
    adFormFeatures.elevator.disabled = shouldBeDisabled;
    adFormFeatures.conditioner.disabled = shouldBeDisabled;
    adFormSubmitButton.disabled = shouldBeDisabled;
    adFormResetButton.disabled = shouldBeDisabled;
  };


  var disablePage = function () {
    disableFilterForm();
    disableForm();
  };

  var enablePage = function () {
    disableFilterForm(false);
    disableForm(false);
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

  var areCapacityAndRoomNumberValid = function () {
    var result = false;

    var capacityNumber = Number(adFormCapacity.value);
    var roomsNumber = Number(adFormRoomNumber.value);

    if (capacityNumber === 0) {
      result = roomsNumber === 100;
    } else if (roomsNumber === 100) {
      result = capacityNumber === 0;
    } else {
      result = capacityNumber <= roomsNumber;
    }

    return result;
  };

  var onRoomNumberSubmit = function () {
    adFormRoomNumber.setCustomValidity('');
    adFormCapacity.setCustomValidity('');

    if (!areCapacityAndRoomNumberValid()) {
      adFormRoomNumber.setCustomValidity('Количество комнат не может быть меньше количества мест');
      adFormRoomNumber.reportValidity();
    }
  };

  var onCapacitySubmit = function () {
    adFormCapacity.setCustomValidity('');
    adFormRoomNumber.setCustomValidity('');

    if (!areCapacityAndRoomNumberValid()) {
      adFormCapacity.setCustomValidity('Количество мест не может превышать количество комнат');
      adFormCapacity.reportValidity();
    }
  };

  var onAdFormSubmit = function (evt) {
    onRoomNumberSubmit();
    onCapacitySubmit();
    if (!adForm.checkValidity()) {
      evt.preventDefault();
    }
  };

  adForm.addEventListener('submit',onAdFormSubmit);
  adFormCapacity.addEventListener('change', onCapacitySubmit);
  adFormRoomNumber.addEventListener('change', onRoomNumberSubmit);
  pinButton.addEventListener('keydown', onPinButtonEnter);
  pinButton.addEventListener('mousedown', onPinButtonClick);

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
