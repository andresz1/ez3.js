EZ3.ShaderLib = {
  'basic' : {
      vertex: [
        'void main() {',
        ' gl_Position = modelViewProjectionMatrix * vec4(vertex, 1.0);',
        '}'
      ].join('\n'),
      fragment: [
        'uniform vec3 color;',
        'void main() {',
        ' gl_FragColor = vec4(color, 1.0);',
        '}'
      ].join('\n')
  }
};
