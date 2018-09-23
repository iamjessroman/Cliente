var i = 0;

function trace() {
  try {
    console.log.apply(console, arguments);
  } catch (e) {
    try {
      console.log(Array.prototype.slice.apply(arguments));
    } catch (e) {}
  }
}

function loadImage(src, callback) {
  $('<img />').attr('src', src).load(function() {
    TestCanvas.init(this);
    callback && callback();
  });
}

function initFilter(filter_name) {
  //TestCanvas.reset();
  gui.clear();
  var filterConfig = filters[filter_name];
  filterConfig.init(filterConfig);
  filterConfig.gui(filterConfig);
  filterConfig.apply(filterConfig);
  if (filterConfig.use_gui !== false) {
    gui.add({
      reset: function() {
        gui.reset();
        //TestCanvas.reset();
        filterConfig.init(filterConfig);
        filterConfig.apply(filterConfig);
      }
    }, 'reset');
  }
}
// Globals
var gui;
var TestCanvas = {
  init: function(img) {
    this.canvas = $('#output')[0];
    this.canvas.width = img.width;
    this.canvas.height = img.height;
    this.context = this.canvas.getContext('2d');
    this.context.drawImage(img, 0, 0);
    this.defaultImage = this.context.getImageData(0, 0, img.width, img.height);
  },
  apply: function(filter_name, args) {
    if (!this.context) {
      return;
    }
    args.unshift(this.defaultImage);
    var start_time = new Date().getTime();
    var result = ImageFilters[filter_name].apply(ImageFilters, args);
    var elapsed_time = new Date().getTime() - start_time;
    trace(filter_name + " " + elapsed_time + " ms");
    $("#timer").html(elapsed_time + " ms");
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    try {
      this.context.putImageData(result, 0, 0);
    } catch (e) {
      trace(e);
    }
  },
  reset: function() {
    if (!this.context) {
      return;
    }
    this.context.putImageData(this.defaultImage, 0, 0);
  }
};
var filters = {
  Original: {
    use_gui: false,
    init: function(self) {},
    gui: function(self) {},
    apply: function(self) {
      TestCanvas.reset();
    }
  },
  Binarize: {
    init: function(self) {
      self.threshold = 0.5;
    },
    gui: function(self) {
      gui.add(self, 'threshold').min(0).max(1).step(0.01).onFinishChange(function(v) {
        self.apply(self);
      });
    },
    apply: function(self) {
      TestCanvas.apply('Binarize', [
        self.threshold
      ]);
    }
  },
  BoxBlur: {
    init: function(self) {
      self.hRadius = 3;
      self.vRadius = 3;
      self.quality = 2;
    },
    gui: function(self) {
      gui.add(self, 'hRadius').name('H Radius').min(1).max(20).step(1).onFinishChange(function(v) {
        self.apply(self);
      });
      gui.add(self, 'vRadius').name('V Radius').min(1).max(20).step(1).onFinishChange(function(v) {
        self.apply(self);
      });
      gui.add(self, 'quality').name('Quality').min(1).max(10).step(1).onFinishChange(function(v) {
        self.apply(self);
      });
    },
    apply: function(self) {
      TestCanvas.apply('BoxBlur', [
        self.hRadius,
        self.vRadius,
        self.quality
      ]);
    }
  },
  GaussianBlur: {
    init: function(self) {
      self.strength = 2;
    },
    gui: function(self) {
      gui.add(self, 'strength').min(1).max(4).step(1).onFinishChange(function(v) {
        self.apply(self);
      });
    },
    apply: function(self) {
      TestCanvas.apply('GaussianBlur', [
        self.strength
      ]);
    }
  },
  StackBlur: {
    init: function(self) {
      self.radius = 6;
    },
    gui: function(self) {
      gui.add(self, 'radius').min(1).max(40).step(1).onFinishChange(function(v) {
        self.apply(self);
      });
    },
    apply: function(self) {
      TestCanvas.apply('StackBlur', [
        self.radius
      ]);
    }
  },
  BrightnessContrastGimp: {
    init: function(self) {
      self.brightness = 0;
      self.contrast = 0;
    },
    gui: function(self) {
      gui.add(self, 'brightness').min(-100).max(100).step(1).onFinishChange(function(v) {
        self.apply(self);
      });
      gui.add(self, 'contrast').min(-100).max(100).step(1).onFinishChange(function(v) {
        self.apply(self);
      });
    },
    apply: function(self) {
      TestCanvas.apply('BrightnessContrastGimp', [
        self.brightness,
        self.contrast
      ]);
    }
  },
  BrightnessContrastPhotoshop: {
    init: function(self) {
      self.brightness = 0;
      self.contrast = 0;
    },
    gui: function(self) {
      gui.add(self, 'brightness').min(-100).max(100).step(1).onFinishChange(function(v) {
        self.apply(self);
      });
      gui.add(self, 'contrast').min(-100).max(100).step(1).onFinishChange(function(v) {
        self.apply(self);
      });
    },
    apply: function(self) {
      TestCanvas.apply('BrightnessContrastPhotoshop', [
        self.brightness,
        self.contrast
      ]);
    }
  },
  Channels: {
    use_gui: false,
    Red: function() {
      this.channel = 1;
      this.apply(this);
    },
    Green: function() {
      this.channel = 2;
      this.apply(this);
    },
    Blue: function() {
      this.channel = 3;
      this.apply(this);
    },
    init: function(self) {
      self.channel = 1;
    },
    gui: function(self) {
      gui.add(self, 'Red');
      gui.add(self, 'Green');
      gui.add(self, 'Blue');
    },
    apply: function(self) {
      TestCanvas.apply('Channels', [
        self.channel
      ]);
    }
  },
  ColorTransformFilter: {
    init: function(self) {
      self.redMultiplier = 1;
      self.greenMultiplier = 1;
      self.blueMultiplier = 1;
      self.alphaMultiplier = 1;
      self.redOffset = 0;
      self.greenOffset = 0;
      self.blueOffset = 0;
      self.alphaOffset = 0;
    },
    gui: function(self) {
      gui.add(self, 'redMultiplier').min(0).max(5).step(0.01).onFinishChange(function(v) {
        self.apply(self);
      });
      gui.add(self, 'greenMultiplier').min(0).max(5).step(0.01).onFinishChange(function(v) {
        self.apply(self);
      });
      gui.add(self, 'blueMultiplier').min(0).max(5).step(0.01).onFinishChange(function(v) {
        self.apply(self);
      });
      /*
      gui.add(self, 'alphaMultiplier').min(0).max(5).step(0.01).onFinishChange(function(v) {
          self.apply(self);
      });
      */
      gui.add(self, 'redOffset').min(-255).max(255).step(1).onFinishChange(function(v) {
        self.apply(self);
      });
      gui.add(self, 'greenOffset').min(-255).max(255).step(1).onFinishChange(function(v) {
        self.apply(self);
      });
      gui.add(self, 'blueOffset').min(-255).max(255).step(1).onFinishChange(function(v) {
        self.apply(self);
      });
      /*
      gui.add(self, 'alphaOffset').min(-255).max(255).step(1).onFinishChange(function(v) {
          self.apply(self);
      });
      */
    },
    apply: function(self) {
      TestCanvas.apply('ColorTransformFilter', [
        self.redMultiplier,
        self.greenMultiplier,
        self.blueMultiplier,
        self.alphaMultiplier,
        self.redOffset,
        self.greenOffset,
        self.blueOffset,
        self.alphaOffset
      ]);
    }
  },
  Desaturate: {
    use_gui: false,
    init: function(self) {},
    gui: function(self) {},
    apply: function(self) {
      TestCanvas.apply('Desaturate', []);
    }
  },
  Dither: {
    init: function(self) {
      self.levels = 8;
    },
    gui: function(self) {
      gui.add(self, 'levels').min(2).max(32).step(1).onFinishChange(function(v) {
        self.apply(self);
      });
    },
    apply: function(self) {
      TestCanvas.apply('Dither', [
        self.levels
      ]);
    }
  },
  Edge: {
    use_gui: false,
    init: function(self) {},
    gui: function(self) {},
    apply: function(self) {
      TestCanvas.apply('Edge', []);
    }
  },
  Emboss: {
    use_gui: false,
    init: function(self) {},
    gui: function(self) {},
    apply: function(self) {
      TestCanvas.apply('Emboss', []);
    }
  },
  Enrich: {
    use_gui: false,
    init: function(self) {},
    gui: function(self) {},
    apply: function(self) {
      TestCanvas.apply('Enrich', []);
    }
  },
  Flip: {
    use_gui: false,
    horizontal: function() {
      this.is_vertical = false;
      this.apply(this);
    },
    vertical: function() {
      this.is_vertical = true;
      this.apply(this);
    },
    init: function(self) {
      self.is_vertical = false;
    },
    gui: function(self) {
      gui.add(self, 'horizontal');
      gui.add(self, 'vertical');
    },
    apply: function(self) {
      TestCanvas.apply('Flip', [
        self.is_vertical
      ]);
    }
  },
  Gamma: {
    init: function(self) {
      self.gamma = 1;
    },
    gui: function(self) {
      gui.add(self, 'gamma').min(0).max(3).step(0.1).onFinishChange(function(v) {
        self.apply(self);
      });
    },
    apply: function(self) {
      TestCanvas.apply('Gamma', [
        self.gamma
      ]);
    }
  },
  GrayScale: {
    use_gui: false,
    init: function(self) {},
    gui: function(self) {},
    apply: function(self) {
      TestCanvas.apply('GrayScale', []);
    }
  },
  HSLAdjustment: {
    init: function(self) {
      self.H = 0;
      self.S = 0;
      self.L = 0;
    },
    gui: function(self) {
      gui.add(self, 'H').min(-180).max(180).step(1).onFinishChange(function(v) {
        self.apply(self);
      });
      gui.add(self, 'S').min(-100).max(100).step(1).onFinishChange(function(v) {
        self.apply(self);
      });
      gui.add(self, 'L').min(-100).max(100).step(1).onFinishChange(function(v) {
        self.apply(self);
      });
    },
    apply: function(self) {
      TestCanvas.apply('HSLAdjustment', [
        self.H,
        self.S,
        self.L
      ]);
    }
  },
  Invert: {
    use_gui: false,
    init: function(self) {},
    gui: function(self) {},
    apply: function(self) {
      TestCanvas.apply('Invert', []);
    }
  },
  Mosaic: {
    init: function(self) {
      self.size = 10;
    },
    gui: function(self) {
      gui.add(self, 'size').min(1).max(100).step(1).onFinishChange(function(v) {
        self.apply(self);
      });
    },
    apply: function(self) {
      TestCanvas.apply('Mosaic', [
        self.size
      ]);
    }
  },
  Oil: {
    init: function(self) {
      self.range = 2;
      self.levels = 32;
    },
    gui: function(self) {
      gui.add(self, 'range').min(1).max(5).step(1).onFinishChange(function(v) {
        self.apply(self);
      });
      gui.add(self, 'levels').min(1).max(256).step(1).onFinishChange(function(v) {
        self.apply(self);
      });
    },
    apply: function(self) {
      TestCanvas.apply('Oil', [
        self.range,
        self.levels
      ]);
    }
  },
  Posterize: {
    init: function(self) {
      self.levels = 8;
    },
    gui: function(self) {
      gui.add(self, 'levels').min(2).max(32).step(1).onFinishChange(function(v) {
        self.apply(self);
      });
    },
    apply: function(self) {
      TestCanvas.apply('Posterize', [
        self.levels
      ]);
    }
  },
  Rescale: {
    init: function(self) {
      self.scale = 2;
    },
    gui: function(self) {
      gui.add(self, 'scale').min(0.0).max(5.0).step(0.1).onFinishChange(function(v) {
        self.apply(self);
      });
    },
    apply: function(self) {
      TestCanvas.apply('Rescale', [
        self.scale
      ]);
    }
  },
  ResizeNearestNeighbor: {
    init: function(self) {
      self.width = TestCanvas.canvas.width;
      self.height = TestCanvas.canvas.height;
      self.ratio = self.width / self.height;
      self.keep_ratio = true;
    },
    gui: function(self) {
      var widthController = gui.add(self, 'width').min(self.width / 10).max(self.width * 2).step(1).onFinishChange(function(v) {
        if (self.keep_ratio) {
          heightController.setValue(self.width / self.ratio + 0.5 | 0);
        }
        self.apply(self);
      });
      var heightController = gui.add(self, 'height').min(self.height / 10).max(self.height * 2).step(1).onFinishChange(function(v) {
        if (self.keep_ratio) {
          widthController.setValue(self.height * self.ratio + 0.5 | 0);
        }
        self.apply(self);
      });
      gui.add(self, 'keep_ratio').name('Keep Ratio').onChange(function(v) {
        if (self.keep_ratio) {
          heightController.setValue(self.width / self.ratio + 0.5 | 0);
          self.apply(self);
        }
      });
    },
    apply: function(self) {
      TestCanvas.apply('ResizeNearestNeighbor', [
        self.width,
        self.height
      ]);
    }
  },
  Resize: {
    init: function(self) {
      self.width = TestCanvas.canvas.width;
      self.height = TestCanvas.canvas.height;
      self.ratio = self.width / self.height;
      self.keep_ratio = true;
    },
    gui: function(self) {
      var widthController = gui.add(self, 'width').min(self.width / 10).max(self.width * 2).step(1).onFinishChange(function(v) {
        if (self.keep_ratio) {
          heightController.setValue(self.width / self.ratio + 0.5 | 0);
        }
        self.apply(self);
      });
      var heightController = gui.add(self, 'height').min(self.height / 10).max(self.height * 2).step(1).onFinishChange(function(v) {
        if (self.keep_ratio) {
          widthController.setValue(self.height * self.ratio + 0.5 | 0);
        }
        self.apply(self);
      });
      gui.add(self, 'keep_ratio').name('Keep Ratio').onChange(function(v) {
        if (self.keep_ratio) {
          heightController.setValue(self.width / self.ratio + 0.5 | 0);
          self.apply(self);
        }
      });
    },
    apply: function(self) {
      TestCanvas.apply('Resize', [
        self.width,
        self.height
      ]);
    }
  },
  ResizeBuiltin: {
    init: function(self) {
      self.width = TestCanvas.canvas.width;
      self.height = TestCanvas.canvas.height;
      self.ratio = self.width / self.height;
      self.keep_ratio = true;
    },
    gui: function(self) {
      var widthController = gui.add(self, 'width').min(self.width / 10).max(self.width * 2).step(1).onFinishChange(function(v) {
        if (self.keep_ratio) {
          heightController.setValue(self.width / self.ratio + 0.5 | 0);
        }
        self.apply(self);
      });
      var heightController = gui.add(self, 'height').min(self.height / 10).max(self.height * 2).step(1).onFinishChange(function(v) {
        if (self.keep_ratio) {
          widthController.setValue(self.height * self.ratio + 0.5 | 0);
        }
        self.apply(self);
      });
      gui.add(self, 'keep_ratio').name('Keep Ratio').onChange(function(v) {
        if (self.keep_ratio) {
          heightController.setValue(self.width / self.ratio + 0.5 | 0);
          self.apply(self);
        }
      });
    },
    apply: function(self) {
      TestCanvas.apply('ResizeBuiltin', [
        self.width,
        self.height
      ]);
    }
  },
  Sepia: {
    use_gui: false,
    init: function(self) {},
    gui: function(self) {},
    apply: function(self) {
      TestCanvas.apply('Sepia', []);
    }
  },
  Sharpen: {
    init: function(self) {
      self.factor = 3;
    },
    gui: function(self) {
      gui.add(self, 'factor').min(1).max(10).step(0.1).onFinishChange(function(v) {
        self.apply(self);
      });
    },
    apply: function(self) {
      TestCanvas.apply('Sharpen', [
        self.factor
      ]);
    }
  },
  Solarize: {
    use_gui: false,
    init: function(self) {},
    gui: function(self) {},
    apply: function(self) {
      TestCanvas.apply('Solarize', []);
    }
  },
  Transpose: {
    use_gui: false,
    init: function(self) {},
    gui: function(self) {},
    apply: function(self) {
      TestCanvas.apply('Transpose', []);
    }
  },
  Twril: {
    init: function(self) {
      self.centerX = 0.5;
      self.centerY = 0.5;
      self.radius = Math.min(TestCanvas.canvas.width, TestCanvas.canvas.height) / 3 | 0;
      self.angle = 360;
      self.edge = 0;
      self.smooth = true;
    },
    gui: function(self) {
      gui.add(self, 'centerX').min(0).max(1).step(0.01).onFinishChange(function(v) {
        self.apply(self);
      });
      gui.add(self, 'centerY').min(0).max(1).step(0.01).onFinishChange(function(v) {
        self.apply(self);
      });
      gui.add(self, 'radius').min(10).max(Math.max(TestCanvas.canvas.width, TestCanvas.canvas.height) / 2 | 0).step(1).onFinishChange(function(v) {
        self.apply(self);
      });
      gui.add(self, 'angle').min(-720).max(720).step(1).onFinishChange(function(v) {
        self.apply(self);
      });
      gui.add(self, 'edge').options({
        'Transparent': 0,
        'Clamp': 1,
        'Wrap': 2
      }).onChange(function(v) {
        self.apply(self);
      });
      /*
      gui.add(self, 'smooth').onChange(function(v) {
          self.apply(self);
      });
      */
    },
    apply: function(self) {
      TestCanvas.apply('Twril', [
        self.centerX,
        self.centerY,
        self.radius,
        self.angle,
        self.edge,
        self.smooth
      ]);
    }
  },
}
$(function() {
  // init gui library
  gui = new DAT.GUI();
  // init url form
  $('#form_submit').click(function() {
    var url = $('#form_url').val();
    if (url) {
      url = encodeURIComponent(url);
      $('#form_submit').val('Loading...');
      loadImage('./p.php?u=' + url, function() {
        initFilter(current_filter);
        $('#form_submit').val('Submit');
      });
    }
  });
  // init select list
  // $("#filter_list").attr('size', $("#filter_list").children().size());
  var current_filter = $("#filter_list").val();
  if (!current_filter) {
    $('#filter_list option:eq(0)').attr('selected', 'selected');
    current_filter = $("#filter_list").val();
  }
  setInterval(function() {
    var selected_filter = $("#filter_list").val();
    if (selected_filter && selected_filter !== current_filter) {
      current_filter = selected_filter;
      initFilter(current_filter);
    }
  }, 20);
  // load default image
});