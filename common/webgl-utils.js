var WebGLUtils = {
  setupWebGL: function (canvas) {
    var context = WebGLUtils.create3DContext(canvas);
    if (!context) {
      alert("WebGL não suportado");
    }
    return context;
  },

  create3DContext: function (canvas) {
    var names = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];
    var context = null;
    for (var i = 0; i < names.length; ++i) {
      try {
        context = canvas.getContext(names[i]);
      } catch (e) {}
      if (context) {
        break;
      }
    }
    return context;
  }
};