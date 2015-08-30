/**
 * @class ShaderBuilder
 */

EZ3.ShaderBuilder = function() {

};

EZ3.ShaderBuilder.prototype.constructor = EZ3.ShaderBuilder;

EZ3.ShaderBuilder.prototype.build = function(material) {
  this._buildVertex(material);
  this._buildFragment(material);
};

EZ3.ShaderBuilder.prototype._buildVertex = function(material) {
  if(material instanceof EZ3.BasicMaterial) {

    material.vertex = [
      'precision highp float;',

      'attribute vec3 vertex;',
      'attribute vec2 uv;',

      'uniform mat4 mvpMatrix;',

      'varying highp vec2 texCoordinates;',

      'void main(){',
        'texCoordinates = uv;',
        'gl_Position = mvpMatrix * vec4(vertex, 1.0);',
      '}'
    ].join('\n');

  }else if(material instanceof EZ3.BlinnPhongMaterial) {

    material.vertex = [
      'precision highp float',

    ].join('\n');

  }else if(material instanceof EZ3.FlatMaterial) {

    material.vertex = [

    ].join('\n');

  }else if(material instanceof EZ3.GouraudMaterial) {

    material.vertex = [

    ].join('\n');

  }else if(material instanceof EZ3.MultiTexturingMaterial) {

    material.vertex = [

    ].join('\n');

  }else if(material instanceof EZ3.NormalMappingMaterial) {

    material.vertex = [

    ].join('\n');

  }else if(material instanceof EZ3.ParallaxMappingMaterial) {

    material.vertex = [

    ].join('\n');

  }else if(material instanceof EZ3.PhongMaterial) {

    material.vertex = [

    ].join('\n');

  }else if(material instanceof EZ3.ReflectionMaterial) {

    material.vertex = [

    ].join('\n');

  }else if(material instanceof EZ3.RefractionMaterial) {

    material.vertex = [

    ].join('\n');

  }
};

EZ3.ShaderBuilder.prototype._buildFragment = function(material) {
  if(material instanceof EZ3.BasicMaterial) {

    material.fragment = [
      'precision highp float;',

      'uniform vec3 color;',
      'uniform bool hasDiffuseTexture;',
      'uniform sampler2D diffuseTexture;',

      'varying highp vec2 texCoordinates;',

      'void main() {',
        'if(hasDiffuseTexture) {',
        ' gl_FragColor = vec4(color, 1.0) * texture2D(diffuseTexture, texCoordinates);',
        '}else{',
        ' gl_FragColor = vec4(color, 1.0);',
        '}',
      '}'
    ].join('\n');

  }else if(material instanceof EZ3.BlinnPhongMaterial) {

    material.fragment = [

    ].join('\n');

  }else if(material instanceof EZ3.FlatMaterial) {

    material.fragment = [

    ].join('\n');

  }else if(material instanceof EZ3.GouraudMaterial) {

    material.fragment = [

    ].join('\n');

  }else if(material instanceof EZ3.MultiTexturingMaterial) {

    material.fragment = [

    ].join('\n');

  }else if(material instanceof EZ3.NormalMappingMaterial) {

    material.fragment = [

    ].join('\n');

  }else if(material instanceof EZ3.ParallaxMappingMaterial) {

    material.fragment = [

    ].join('\n');

  }else if(material instanceof EZ3.PhongMaterial) {

    material.fragment = [

    ].join('\n');

  }else if(material instanceof EZ3.ReflectionMaterial) {

    material.fragment = [

    ].join('\n');

  }else if(material instanceof EZ3.RefractionMaterial) {

    material.fragment = [

    ].join('\n');

  }
};
