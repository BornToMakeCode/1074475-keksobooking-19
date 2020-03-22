'use strict';

(function () {
  var map = document.querySelector('.map');
  var me;

  var create = function (selector) {
    me = document.querySelector(selector);
  };

  var onKeyDown = function (handler) {
    me.addEventListener('keydown', function (evt) {
      handler(evt);
    });
  };

  var onMouseDown = function (handler) {
    me.addEventListener('mousedown', function (evt) {
      handler(evt);
    });
  };

  var onMove = function (handler) {
    me.addEventListener('mousedown', function (mouseDownEvent) {

      mouseDownEvent.preventDefault();

      var startCoordinates = {
        x: mouseDownEvent.clientX,
        y: mouseDownEvent.clientY
      };

      var onMouseMove = function (moveEvt) {
        moveEvt.preventDefault();


        var shift = {
          x: startCoordinates.x - moveEvt.clientX,
          y: startCoordinates.y - moveEvt.clientY
        };

        startCoordinates = {
          x: moveEvt.clientX,
          y: moveEvt.clientY
        };

        me.style.top = (me.offsetTop - shift.y) + 'px';
        me.style.left = (me.offsetLeft - shift.x) + 'px';

        handler({'X': (me.offsetTop - shift.y), 'Y': (me.offsetLeft - shift.x)});

      };

      var pinMouseUpHandler = function () {
        map.removeEventListener('mousemove', onMouseMove);
        map.removeEventListener('mouseup', pinMouseUpHandler);
      };

      map.addEventListener('mousemove', onMouseMove);
      map.addEventListener('mouseup', pinMouseUpHandler);

    });
  };

  window.pin = {
    create: create,
    onMove: onMove,
    onKeyDown: onKeyDown,
    onMouseDown: onMouseDown
  };
})();

