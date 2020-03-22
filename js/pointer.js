'use strict';

(function () {
  var TOP_MIN = 130;
  var BOTTOM_MAX = 630;
  var HEIGHT = 40;
  var WIDTH = 40;
  var map = document.querySelector('.map');
  var me;

  var create = function (selector) {
    me = document.querySelector(selector);
  };

  var canBeMoved = function (desiredLeft, desiredTop) {
    if (desiredTop >= TOP_MIN - HEIGHT
    && desiredTop <= BOTTOM_MAX - HEIGHT
    && desiredLeft >= 0 - WIDTH / 2
    && desiredLeft <= map.offsetWidth - WIDTH / 2) {
      return true;
    }

    return false;
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

        var desiredLeft = (me.offsetLeft - shift.x);
        var desiredTop = (me.offsetTop - shift.y);

        if (canBeMoved(desiredLeft, desiredTop)) {
          startCoordinates = {
            x: moveEvt.clientX,
            y: moveEvt.clientY
          };

          me.style.left = desiredLeft + 'px';
          me.style.top = desiredTop + 'px';

          handler({'X': desiredLeft, 'Y': desiredLeft});
        }

      };

      var onMouseUp = function () {
        map.removeEventListener('mousemove', onMouseMove);
        map.removeEventListener('mouseup', onMouseUp);
      };

      map.addEventListener('mousemove', onMouseMove);
      map.addEventListener('mouseup', onMouseUp);

    });
  };

  window.pointer = {
    create: create,
    onMove: onMove,
    onKeyDown: onKeyDown,
    onMouseDown: onMouseDown
  };
})();

