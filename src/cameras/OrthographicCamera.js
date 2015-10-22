/**
 * @class OrthographicCamera
 * @extends Camera
 */

EZ3.OrthographicCamera = function() {
  EZ3.Camera.call(this);
};

EZ3.OrthographicCamera.prototype = Object.create(EZ3.Camera.prototype);
EZ3.OrthographicCamera.prototype.constructor = EZ3.OrthographicCamera;

EZ3.OrthographicCamera.prototype.view = function() {

};

EZ3.OrthographicCamera.prototype.projection = function() {

};
