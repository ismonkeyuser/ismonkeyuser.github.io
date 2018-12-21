webpackJsonp([0],{

/***/ 434:
/*!***************************!*\
  !*** multi ./src/main.ts ***!
  \***************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! /Users/cstefanache/Projects/Personal/phaser3-typescript-webpack/src/main.ts */435);


/***/ }),

/***/ 435:
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

__webpack_require__(/*! phaser */ 210);
var width = 520,
    height = 200,
    tile_size = 32,
    firstJump = 100,
    secondJump = 200,
    sx = 50;
var score = 0;
var scoreText;
var velocity = -300;
var started = false;
var config = {
  type: Phaser.AUTO,
  parent: 'container',
  width: width,
  height: height,
  backgroundColor: '#ffe5a8',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: {
        y: 800
      },
      debug: false
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};
var cursors;
var jumptimer = 0;
var platforms;
var ennemiesLayer;
var decoLayer;
new Phaser.Game(config);

function preload() {
  this.load.spritesheet('spreadsheet', '/assets/sprites/sprites.png', {
    frameWidth: tile_size,
    frameHeight: tile_size
  });
  this.load.spritesheet('spreadsheet_w', '/assets/sprites/sprites_w.png', {
    frameWidth: tile_size * 2,
    frameHeight: tile_size
  });
}
stlet touchup = false;
function create() {
  var _this = this;

  var el = document.getElementsByTagName("canvas")[0];
  el.addEventListener("touchstart", () => {touchup = true}, false);
  el.addEventListener("touchend", () => {touchup = false}, false);

  decoLayer = this.physics.add.group();
  this.player = this.physics.add.sprite(sx, 100, 'player');
  this.player.setBounce(0.1);
  scoreText = this.add.text(5, 5, 'Press [Up] to start', {
    fontSize: '14px',
    fill: '#000'
  });
  platforms = this.physics.add.group();
  ennemiesLayer = this.physics.add.group();
  this.anims.create({
    key: 'run',
    frames: this.anims.generateFrameNumbers('spreadsheet', {
      start: 0,
      end: 3
    }),
    frameRate: 16,
    repeat: -1
  });
  this.anims.create({
    key: 'jump',
    frames: this.anims.generateFrameNumbers('spreadsheet', {
      start: 4,
      end: 4
    }),
    frameRate: 16,
    repeat: 0
  });
  this.anims.create({
    key: 'standing',
    frames: this.anims.generateFrameNumbers('spreadsheet', {
      start: 2,
      end: 2
    }),
    repeat: -1
  });
  this.player.anims.play('standing', true);
  cursors = this.input.keyboard.createCursorKeys();

  for (var i = 0; i < width / tile_size; i++) {
    var c = platforms.create(i * tile_size, height, 'spreadsheet', 5);
    c.body.immovable = true;
    c.body.allowGravity = false;
    c.body.enableBody = true;
  }

  this.physics.add.collider(this.player, ennemiesLayer, function (p, e) {
    if (p.body.touching.right) {
      _this.scene.pause();
      started = false;
      setTimeout(function () {
        started = true;
        score = 0;
        scoreText.setText('Press [Up] to start');

        _this.scene.restart();
      }, 3000);
    }
  });
  this.physics.add.collider(this.player, platforms);
}

var ennemies = [];
var decos = [];
var lastCreated = -1;

function update() {
  var _a = this,
      player = _a.player,
      time = _a.time;

  if (started) {
    if (ennemies.length < 3 && this.time.now - lastCreated > -velocity + width / 2 && Math.random() < .04) {
      lastCreated = this.time.now;
      var h = height - tile_size;
      var left;

      if (Math.random() < 0.5) {
        left = ennemiesLayer.create(width, h, 'spreadsheet_w', Math.floor(Math.random() * 3));
      } else {
        left = ennemiesLayer.create(width, h, 'spreadsheet', 11 + Math.floor(Math.random() * 2));
      }

      left.body.allowGravity = false;
      left.body.enableBody = true;
      left.body.velocity.x = velocity;
      ennemies.push([left]);
    }

    score += 0.1;
    scoreText.setText('Score: ' + Math.floor(score));

    if (Math.random() < 0.01 && decos.length < 3) {
      var dec = decoLayer.create(width, Math.floor(Math.random() * (height - tile_size * 2 / tile_size)) * tile_size, 'spreadsheet', 7 + Math.floor(Math.random() * 3));
      dec.body.allowGravity = false;
      dec.body.velocity.x = velocity;
      decos.push(dec);
    }

    decos = decos.filter(function (deco) {
      var destroy = deco.x < -tile_size * 2;

      if (destroy) {
        deco.destroy();
      }

      return !destroy;
    });
    ennemies = ennemies.filter(function (enemyArr) {
      var destroy = enemyArr[0].x < -tile_size * 2;

      if (destroy) {
        enemyArr.forEach(function (enemy) {
          return enemy.destroy();
        });
      }

      return !destroy;
    });
  }

  if (this.player.body.touching.down && started) {
    this.player.anims.play('run', true);
  }

  if ((cursors.up.isDown || touchup) && player.body.touching.down) {
    started = true;
    this.player.anims.play('jump', false);
    jumptimer = time.now;
    player.body.velocity.y = -firstJump;
  } else if ((cursors.up.isDown || touchup) && jumptimer != 0) {
    if (time.now - jumptimer > 300) {
      jumptimer = 0;
    } else {
      player.body.velocity.y = -secondJump;
    }
  } else if (jumptimer != 0) {
    jumptimer = 0;
  }
}

/***/ })

},[434]);
//# sourceMappingURL=bundle.js.map