//--------------------Tool-------------------------
; (function (window, undefined) {
    var Tool = {
        getRandom: function (min, max) {
            var min = Math.ceil(min);
            var max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1) + min);
        },
        getRandomColor: function () {
            return 'rgb(' + this.getRandom(0, 255) + ',' + this.getRandom(0, 255) + ',' + this.getRandom(0, 255) + ')';
        },
    };

    window.Tool = Tool;
})(window, undefined);

//------------------Food-----------------------

; (function (window, undefined) {

    function Food(optional) {
        optional = optional || {};
        this.width = optional.width || 20;
        this.heigth = optional.heigth || 20;
        this.x = optional.x || 0;
        this.y = optional.y || 0;
        this.foodArr = [];
        this.map = optional.map;
    };

    Food.prototype.render = function () {
        for (var i = 0; i < this.foodArr.length; i++) {
            this.map.removeChild(this.foodArr[i]);
        };
        this.foodArr.length = 0;
        var x = this.map.offsetWidth / this.width;
        var y = this.map.offsetHeight / this.heigth;
        var food = document.createElement('div');
        food.style.width = this.width + 'px';
        food.style.height = this.heigth + 'px';
        food.style.backgroundColor = Tool.getRandomColor();
        food.style.position = 'absolute';
        food.style.boxSizing = 'border-box';
        food.style.border = '1px solid #fff';
        food.style.zIndex = '1';
        food.style.left = this.width * Tool.getRandom(0, x - 1) + 'px';
        food.style.top = this.heigth * Tool.getRandom(0, y - 1) + 'px';
        this.map.appendChild(food);
        this.foodArr.push(food);
    }
    window.Food = Food;
})(window, undefined);

//------------------Snake-----------------------

; (function (window, undefined) {
    function Snake(optional) {
        optional = optional || {};
        this.width = optional.width || 20;
        this.heigth = optional.heigth || 20;
        this.direction = optional.direction || 'rigth';
        this.arr = [];
        this.MoveTime = null;
        this.map = optional.map;
        this.body = [
            { x: 4, y: 2, color: Tool.getRandomColor() },
            { x: 3, y: 2, color: Tool.getRandomColor() },
            { x: 2, y: 2, color: Tool.getRandomColor() }
        ]
    };

    Snake.prototype.render = function () {
        var x = this.map.offsetWidth / this.width;
        var y = this.map.offsetHeight / this.heigth;

        for (var i = 0; i < this.arr.length; i++) {
            this.map.removeChild(this.arr[i]);
        };

        this.arr.length = 0;
        for (var i = 0; i < this.body.length; i++) {
            var div = document.createElement('div');
            div.style.width = this.width + 'px';
            div.style.height = this.heigth + 'px';
            div.style.backgroundColor = this.body[i].color;
            div.style.position = 'absolute';
            div.style.left = this.width * this.body[i].x + 'px';
            div.style.top = this.heigth * this.body[i].y + 'px';
            this.map.appendChild(div);
            this.arr.push(div);
        };
    }

    Snake.prototype.move = function () {
        for (var i = this.body.length - 1; i > 0; i--) {
            this.body[i].x = this.body[i - 1].x;
            this.body[i].y = this.body[i - 1].y;
        };
        switch (this.direction) {
            case 'rigth': {
                this.body[0].x += 1;
                break;
            }
            case 'left': {
                this.body[0].x -= 1;
                break;
            }
            case 'top': {
                this.body[0].y -= 1;
                break;
            }
            case 'bottom': {
                this.body[0].y += 1;
                break;
            }
        }
        this.render();
    };


    window.Snake = Snake;
})(window, undefined);

//------------------Game-----------------------

; (function (window, undefined) {
    function Game() {
        this.map = document.getElementById('map');
        this.food = new Food({ map: this.map });
        this.snake = new Snake({ map: this.map });
    };


    Game.prototype.cycleMove = function () {
        this.MoveTime = setInterval(function () {
            this.snakeMove();
        }.bind(this), 150);
    };

    Game.prototype.control = function () {
        onkeydown = function (e) {
            e = e || window.event;
            var code = e.keyCode || e.which || e.charCode;
            var snake = this.snake;
            switch (code) {
                case 87: {
                    if (snake.direction != 'bottom') {
                        snake.direction = 'top';
                        this.snakeMove();
                    }
                    break;
                }
                case 83: {
                    if (snake.direction != 'top') {
                        snake.direction = 'bottom';
                        this.snakeMove();
                    }
                    break;
                }
                case 65: {
                    if (snake.direction != 'rigth') {
                        snake.direction = 'left';
                        this.snakeMove();
                    }
                    break;
                }
                case 68: {
                    if (snake.direction != 'left') {
                        snake.direction = 'rigth';
                        this.snakeMove();
                    }
                    break;
                }
            }

        }.bind(this);
    };

    Game.prototype.snakeMove = function () {
        this.snake.move();
        this.gameJudgment();
        clearInterval(this.MoveTime);
        this.cycleMove();
    };

    Game.prototype.gameJudgment = function () {
        var snake = this.snake;
        var x = snake.map.offsetWidth / snake.width;
        var y = snake.map.offsetHeight / snake.heigth;
        if (snake.body[0].x == x || snake.body[0].y == y || snake.body[0].x < 0 || snake.body[0].y < 0) {
            alert('游戏失败');
            this.snakeMove = '';
            clearInterval(this.MoveTime);
        }

        for (var i = 1; i < snake.arr.length; i++) {
            if (snake.arr[0].offsetLeft == snake.arr[i].offsetLeft && snake.arr[0].offsetTop == snake.arr[i].offsetTop) {
                alert('游戏失败');
                this.snakeMove = '';
                clearInterval(this.MoveTime);
                break;
            }
        };

        if (snake.arr[0].offsetLeft == this.food.foodArr[0].offsetLeft && snake.arr[0].offsetTop == this.food.foodArr[0].offsetTop) {
            var body = snake.body;
            body.push({ x: body[body.length - 1].x, y: body[body.length - 1].y, color: this.food.foodArr[0].style.backgroundColor });
            this.food.render();
        }
    };

    Game.prototype.begin = function () {
        this.cycleMove();
        this.control();
        this.food.render();
    };

    window.Game = Game;

})(window, undefined);

//-----------------main-------------------
; (function (window, undefined) {
    var game = new Game();
    game.begin();
})(window, undefined);





