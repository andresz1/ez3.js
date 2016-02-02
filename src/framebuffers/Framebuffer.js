/**
 * @class EZ3.Framebuffer
 * @constructor
 * @param {EZ3.Vector2} size
 */
EZ3.Framebuffer = function(size) {
  /**
   * @property {WebGLId} _id
   * @private
   */
  this._id = null;
  /**
   * @property {Object} _cache
   * @private
   */
  this._cache = {};

  /**
   * @property {EZ3.Vector2} size
   */
  this.size = size;
  /**
   * @property {EZ3.TargetTexture|EZ3.TargetCubemap} texture
   */
  this.texture = null;
};

EZ3.Framebuffer.prototype.constructor = EZ3.Framebuffer;

/**
 * @method EZ3.Framebuffer#bind
 * @param {WebGLContext} gl
 * @param {EZ3.RendererState} state
 */
EZ3.Framebuffer.prototype.bind = function(gl, state) {
  if (!this._id)
    this._id = gl.createFramebuffer();

  gl.bindFramebuffer(gl.FRAMEBUFFER, this._id);
  state.viewport(new EZ3.Vector2(), this.size);
};

/**
 * @method EZ3.Framebuffer#update
 * @param {WebGLContext} gl
 */
EZ3.Framebuffer.prototype.update = function(gl) {
  this.texture.bind(gl);
  this.texture.update(gl);
  this.texture.attach(gl);

  if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE)
    console.warn('EZ3.Framebuffer.update: update is not completed.');
};

/**
 * @method EZ3.Framebuffer#bind
 * @static
 * @param {WebGLContext} gl
 */
EZ3.Framebuffer.unbind = function(gl) {
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
};
