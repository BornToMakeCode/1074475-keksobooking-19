'use strict';

(function () {

  var DEBOUNCE_INTERVAL = 500;
  var Key = {
    'ENTER': 'Enter',
    'ESCAPE': 'Escape'
  };
  var RequestStatusCode = {
    OK: 200
  };
  var previousTimeout;

  var debounce = function (callback) {
    var parameters = arguments;
    if (previousTimeout) {
      window.clearTimeout(previousTimeout);
    }
    previousTimeout = window.setTimeout(function () {
      callback.apply(null, parameters);
    }, DEBOUNCE_INTERVAL);
  };

  window.utils = {
    Key: Key,
    RequestStatusCode: RequestStatusCode,
    debounce: debounce
  };
})();
