/**
 * @class EZ3.Screen
 * @constructor
 * @param {EZ3.Vector2} position
 * @param {EZ3.Vector2} size
 */
EZ3.Screen = function(position, size) {
  /**
   * @property {EZ3.Vector2} position
   */
  this.position = position;
  /**
   * @property {EZ3.Vector2} size
   */
  this.size = size;
  /**
   * @property {EZ3.RequestManager} load
   */
  this.load = new EZ3.RequestManager();
  /**
   * @property {EZ3.Scene} scene
   */
  this.scene = new EZ3.Scene();
  /**
   * @property {EZ3.Camera} camera
   */
  this.camera = null;
  /**
   * @property {EZ3.World} world
   */
  this.world = null;
};
