'use strict';

(function () {
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
  adFormAddress.readOnly = true;

  var disable = function (isDisabled) {
    var shouldBeDisabled = typeof isDisabled === 'boolean' ? isDisabled : true;
    var isAdFormDisabled = adForm.classList.contains('ad-form--disabled');
    if (shouldBeDisabled) {
      if (!isAdFormDisabled) {
        adForm.classList.add('ad-form--disabled');
      }
    } else {
      adForm.classList.remove('ad-form--disabled');
    }

    adFormTitle.disabled = shouldBeDisabled;
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

  var enable = function () {
    disable(false);
  };

  var setAddress = function (left, top) {
    adFormAddress.value = left + ', ' + top;
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

  var validateAdTitle = function () {
    adFormTitle.setCustomValidity('');

    if (adFormTitle.validity.valueMissing) {
      adFormTitle.setCustomValidity('Заголовок не может быть пустым');
    } else if (adFormTitle.validity.tooShort) {
      adFormTitle.setCustomValidity('Минимальная длина заголовка равна 30 символам');
    } else if (adFormTitle.validity.tooLong) {
      adFormTitle.setCustomValidity('Максимальная длина заголовка равна 100 символам');
    } else if (adFormTitle.validity.valueMissing) {
      adFormTitle.setCustomValidity('Заголовок обязателен для заполнения');
    }
    adFormTitle.reportValidity();
  };

  var validateAdPrice = function () {
    var price = Number(adFormPrice.value);
    adFormPrice.setCustomValidity('');

    switch (adFormType.value) {
      case 'bungalo':
        if (price < 0) {
          adFormPrice.setCustomValidity('Минимальная цена за ночь для бунгало не может быть меньше 0');
        }
        break;
      case 'flat':
        if (price < 1000) {
          adFormPrice.setCustomValidity('Минимальная цена за ночь для квартиры не может быть меньше 1 000');
        }
        break;
      case 'house':
        if (price < 5000) {
          adFormPrice.setCustomValidity('Минимальная цена за ночь для дома не может быть меньше 5 000');
        }
        break;
      case 'palace':
        if (price < 10000) {
          adFormPrice.setCustomValidity('Минимальная цена за ночь для дворца не может быть меньше 10 000');
        }
        break;
    }
    adFormPrice.reportValidity();
  };

  var validateAdRoomNumber = function () {
    adFormRoomNumber.setCustomValidity('');
    adFormCapacity.setCustomValidity('');

    if (!areCapacityAndRoomNumberValid()) {
      adFormRoomNumber.setCustomValidity('Количество комнат не может быть меньше количества мест');
      adFormRoomNumber.reportValidity();
    }
  };

  var validateAdCapacity = function () {
    adFormCapacity.setCustomValidity('');
    adFormRoomNumber.setCustomValidity('');

    if (!areCapacityAndRoomNumberValid()) {
      adFormCapacity.setCustomValidity('Количество мест не может превышать количество комнат');
      adFormCapacity.reportValidity();
    }
  };

  var onTitleBlur = function () {
    validateAdTitle();
  };

  var onAdPriceInput = function () {
    validateAdPrice();
  };

  var onAdFormTypeChange = function () {
    switch (adFormType.value) {
      case 'bungalo':
        adFormPrice.placeholder = 0;
        break;
      case 'flat':
        adFormPrice.placeholder = 1000;
        break;
      case 'house':
        adFormPrice.placeholder = 5000;
        break;
      case 'palace':
        adFormPrice.placeholder = 10000;
        break;
    }
    adFormPrice.reportValidity();
  };

  var onAdFormTimeinChange = function () {
    adFormTimeout.value = adFormTimein.value;
  };

  var onAdFormTimeoutChange = function () {
    adFormTimein.value = adFormTimeout.value;
  };

  var onRoomNumberChange = function () {
    validateAdRoomNumber();
  };

  var onCapacityChange = function () {
    validateAdCapacity();
  };

  var onSubmit = function (handler) {
    adForm.addEventListener('submit', function (evt) {
      validateAdTitle();
      validateAdPrice();
      validateAdRoomNumber();
      validateAdCapacity();

      evt.preventDefault();
      if (!adForm.checkValidity()) {
        evt.preventDefault();
      } else {
        window.xhr.post({url: 'https://js.dump.academy/keksobooking', data: new FormData(adForm)},
            function (response) {
              handler(response);
              adForm.reset();
            }, function (response) {
              handler(response);
            });
      }
    });
  };

  var onReset = function (handler) {
    adForm.addEventListener('reset', function () {
      handler();
    });
  };

  adFormTitle.addEventListener('blur', onTitleBlur);
  adFormPrice.addEventListener('input', onAdPriceInput);
  adFormType.addEventListener('change', onAdFormTypeChange);
  adFormTimein.addEventListener('change', onAdFormTimeinChange);
  adFormTimeout.addEventListener('change', onAdFormTimeoutChange);
  adFormCapacity.addEventListener('change', onCapacityChange);
  adFormRoomNumber.addEventListener('change', onRoomNumberChange);

  window.form = {
    disable: disable,
    enable: enable,
    setAddress: setAddress,
    onSubmit: onSubmit,
    onReset: onReset
  };
})();
