'use strict';

(function () {

  function getRandom(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }

  var getSimilarAdvertisements = function () {

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
              'features': features[getRandom(0, 5)],
              'description': 'Описание предложения №' + index,
              'photos': ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg']
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

  generatePins();

  document.querySelector('.map').classList.remove('map--faded');
})();
