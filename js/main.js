'use strict';

(function () {

  var map = document.querySelector('.map');

  function getRandom(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }

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

  var disablePage = function () {
    disableFilterForm();
    window.form.disable();
  };

  var enablePage = function () {
    map.classList.remove('map--faded');
    window.form.enable();
    disableFilterForm(false);
  };

  disablePage();

  var similarAdvertisements = getSimilarAdvertisements();
  window.map.addAdvertisments(similarAdvertisements);

  window.pointer.create('.map__pin--main');

  window.pointer.onKeyDown(function (evt) {
    if (evt.key === 'Enter') {
      enablePage();
    }
  });

  window.pointer.onMouseDown(function (evt) {
    var mainButton = 0;
    if (evt.button === mainButton) {
      enablePage();
    }
  });

  window.pointer.onMove(function (coord) {
    window.form.setAddress(coord.X, coord.Y);
  });

})();
