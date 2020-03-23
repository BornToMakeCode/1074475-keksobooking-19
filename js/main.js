'use strict';

(function () {

  var map = document.querySelector('.map');
  var advertisments;

  var disablePage = function () {
    map.classList.add('map--faded');
    window.map.reset();
    window.map.disable();
    window.form.disable();
    window.form.setAddress(580, 410);
    window.pointer.setCoordinates({x: 580, y: 410});
  };

  var enablePage = function () {
    window.map.addAdvertisments(advertisments.slice(0, 5));
    map.classList.remove('map--faded');
    window.map.enable();
    window.form.enable();
  };

  disablePage();

  window.pointer.onKeyDown(function (evt) {
    if (evt.key === window.utils.Key.ENTER) {
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

  var fiter = {};

  var filterAdvertisments = function () {
    return advertisments.filter(function (element) {
      var isTypeMatch = true;
      var isPriceMatch = true;
      var isRoomNumberMatch = true;
      var isCapacityMatch = true;
      var isFeaturesMatch = true;
      if (fiter.type) {
        isTypeMatch = fiter.type === 'any' || element.offer.type === fiter.type;
      }
      if (fiter.price) {
        switch (fiter.price) {
          case 'middle':
            isPriceMatch = element.offer.price > 10000 && element.offer.price < 50000;
            break;
          case 'low':
            isPriceMatch = element.offer.price < 10000;
            break;
          case 'high':
            isPriceMatch = element.offer.price > 50000;
            break;
          default:
            isPriceMatch = true;
        }
      }
      if (fiter.roomNumber) {
        isRoomNumberMatch = fiter.roomNumber === 'any' || element.offer.rooms === Number(fiter.roomNumber);
      }
      if (fiter.capacity) {
        isCapacityMatch = fiter.capacity === 'any' || element.offer.guests === Number(fiter.capacity);
      }
      if (fiter.features) {
        isFeaturesMatch = fiter.features.every(function (el) {
          return element.offer.features.includes(el);
        });
      }

      return isTypeMatch && isPriceMatch && isRoomNumberMatch && isCapacityMatch && isFeaturesMatch;

    }).slice(0, 5);
  };

  window.map.filter.onTypeChange(function (value) {
    fiter.type = value;
    window.map.removeAdvertisments();
    window.map.addAdvertisments(filterAdvertisments());
  });

  window.map.filter.onPriceChange(function (value) {
    fiter.price = value;
    window.map.removeAdvertisments();
    window.map.addAdvertisments(filterAdvertisments());
  });

  window.map.filter.onRoomNumberChange(function (value) {
    fiter.roomNumber = value;
    window.map.removeAdvertisments();
    window.map.addAdvertisments(filterAdvertisments());
  });

  window.map.filter.onCapacityChange(function (value) {
    fiter.capacity = value;
    window.map.removeAdvertisments();
    window.map.addAdvertisments(filterAdvertisments());
  });

  window.map.filter.onFeaturesChange(function (value) {
    fiter.features = value;
    window.map.removeAdvertisments();
    window.map.addAdvertisments(filterAdvertisments());
  });

  window.xhr.get({url: 'https://js.dump.academy/keksobooking/data'},
      function (response) {
        advertisments = response.data;
      }, function () {
      });

  var showSubmitResultMessage = function (messageType) {
    var template = document.querySelector('#' + messageType).content.querySelector('.' + messageType);
    var message = template.cloneNode(true);
    document.querySelector('main').appendChild(message);

    var onWindowClick = function () {
      message.remove();
      document.removeEventListener('click', onWindowClick);
      document.removeEventListener('keydown', onWindowKeydown);
    };

    var onWindowKeydown = function (evt) {
      if (evt.key === window.utils.Key.ESCAPE) {
        message.remove();
      }
      document.removeEventListener('click', onWindowClick);
      document.removeEventListener('keydown', onWindowKeydown);
    };

    document.addEventListener('click', onWindowClick);
    document.addEventListener('keydown', onWindowKeydown);
  };

  window.form.onSubmit(function (response) {
    if (response.status === window.utils.RequestStatusCode.OK) {
      showSubmitResultMessage('success');
    } else {
      showSubmitResultMessage('error');
    }
  });

  window.form.onReset(function () {
    disablePage();
    window.map.reset();
  });

})();
