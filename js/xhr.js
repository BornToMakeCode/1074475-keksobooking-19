'use strict';

(function () {

  var Method = {
    GET: 'GET',
    POST: 'POST'
  };

  var NotImplementedException = function (message) {
    this.name = 'Отсутствие имплементации';
    this.message = message;
  };

  var sendRequest = function (options) {
    var request = new XMLHttpRequest();
    request.responseType = 'json';
    request.timeout = options.timeout || 1000;

    request.open(options.method, options.url);

    request.addEventListener('load', function () {
      if (request.status === 200) {
        options.onSuccess(request.response);
      } else {
        options.onError(request);
      }
    });

    request.addEventListener('timeout', function () {
      options.onError(request);
    });

    request.addEventListener('error', function () {
      options.onError(request);
    });

    switch (options.method) {
      case Method.GET:
        request.send();
        break;
      case Method.POST:
        request.send(request.data);
        break;
      default:
        throw new NotImplementedException('Отсутствует реализация метода ' + options.method);
    }

  };

  var get = function (request, onSuccess, onError) {
    sendRequest({method: Method.GET, url: request.url, onSuccess: onSuccess, onError: onError});
  };

  var post = function (request, onSuccess, onError) {
    sendRequest({method: Method.POST, url: request.url, data: request.data, onSuccess: onSuccess, onError: onError});
  };

  window.xhr = {
    get: get,
    post: post
  };
})();
