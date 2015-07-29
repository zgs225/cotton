(function() {
  'use strict';

  function Game() {}

  Game.prototype = {
    create: function () {
      this.game.physics.startSystem(Phaser.Physics.ARCADE);

      this.game.add.sprite(0, 0, 'sky');

      this.createPlatforms();
      this.createPlayer();
      this.createStars();
      this.createScoreText();

      this.input.onDown.add(this.onInputDown, this);
    },

    createScoreText: function () {
      this.score = 0;
      this.scoreText = this.game.add.text(16, 16, 'score: 0', {fontSize: '32px', fill: '#000'});
    },

    createPlatforms: function () {
      this.platforms = this.game.add.group();
      this.platforms.enableBody = true;

      var groud = this.platforms.create(0, this.game.world.height - 64, 'ground');
      groud.scale.setTo(2, 2);
      groud.body.immovable = true;

      var ledge = this.platforms.create(400, 400, 'ground');
      ledge.body.immovable = true;
      ledge = this.platforms.create(-150, 250, 'ground');
      ledge.body.immovable = true;
    },

    createStars: function () {
      this.stars = this.game.add.group();
      this.stars.enableBody = true;

      for (var i = 0; i < 12; i ++) {
        var star = this.stars.create(i * 70, 0, 'star');
        star.body.gravity.y = i + 10;
        star.body.bounce.y = 0.7 + Math.random() * 0.2;
      }
    },

    movement: function () {
      var cursors = this.game.input.keyboard.createCursorKeys();
      this.player.body.velocity.x = 0;

      if (cursors.left.isDown) {
        this.player.body.velocity.x = -150;
        this.player.animations.play('left');
      }
      else if (cursors.right.isDown) {
        this.player.body.velocity.x = 150;
        this.player.animations.play('right');
      }
      else {
        this.player.animations.stop();
        this.player.frame = 4;
      }

      if (cursors.up.isDown && this.player.body.touching.down) {
        this.player.body.velocity.y = -350;
      }
    },

    createPlayer: function () {
      this.player = this.game.add.sprite(32, this.game.world.height - 150, 'dude');
      this.game.physics.arcade.enable(this.player);
      this.player.body.bounce.y = 0.2;
      this.player.body.gravity.y = 300;
      this.player.body.collideWorldBounds = true;

      this.player.animations.add('left', [0, 1, 2, 3], 10, true);
      this.player.animations.add('right', [5, 6, 7, 8], 10, true);
    },

    update: function () {
      this.game.physics.arcade.collide(this.player, this.platforms);
      this.game.physics.arcade.collide(this.stars, this.platforms);
      this.movement();
      this.game.physics.arcade.overlap(this.player, this.stars, this.collectStar, null, this);
    },

    collectStar: function (player, star) {
      star.kill();
      this.score += 10;
      this.scoreText.text = 'score: ' + this.score;
    },

    onInputDown: function () {
      this.game.state.start('menu');
    }
  };

  window['cotton'] = window['cotton'] || {};
  window['cotton'].Game = Game;
}());
