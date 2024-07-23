export class GameConstants {
  // 1m = 10

  static readonly WORLD_WIDTH = 500; // common irl
  static readonly WORLD_HEIGHT = 1000; // common irl

  static readonly CHAR_HEIGHT = 60; // remember to modify the collision detection

  static readonly CHAR_WIDTH = 60;

  static readonly CHAR_MOVE_SPEED = 200;

  static readonly CHAR_FLY_SPEED = 1000;

  static readonly CHAR_FLY_TIME = 2;
  
  static readonly FALL_SPEED = 600;

  static readonly JUMP_SPEED = 600;

  static readonly PLATFORM_WIDTH = 80;

  static readonly PLATFORM_HEIGHT = 20;

  static readonly PLATFORM_DISTANCE = 100;

  static readonly PLATFORM_DISTANCE_MIN = 10;

  static readonly PLATFORM_DISTANCE_MAX = 25;

  static readonly PLATFORM_MOVE_SPEED = 150;

  static readonly ACCELERATOR = 1.5;

  static readonly DECELERATOR = 1.2;

  static readonly DECELERATOR_BIG = 0.5;

  static readonly DECELERATOR_SUPER = 0.3;

  static readonly BOOSTER_HEIGHT = 50;

  static readonly BOOSTER_WIDTH = 50;
}
