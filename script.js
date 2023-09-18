window.onload = function(){
    var canvasWidth = 900;
    var canvasHeigth = 600;
    var blockSize = 30;
    var ctx;
    var delay = 100;
    var snakee;
    var applee;
    var score;
    var widthInBlock = canvasWidth/blockSize;
    var heightInBlock = canvasHeigth/blockSize;





    function init(){
        var canvas = document.createElement('canvas');
        canvas.width = canvasWidth;
        canvas.height = canvasHeigth;
        canvas.style.border = "30px solid gray";
        canvas.style.margin = "0 auto";
        canvas.style.display = "block";
        canvas.style.backgroundColor = "#ddd"
        document.body.appendChild(canvas);
        ctx = canvas.getContext('2d');
        snakee = new Snake([[6,4], [5,4], [4,4], [3,4], [2,4]], "rigth");
        applee = new Apple([10,10]);
        score = 0;
        refrechCanvas();
        drawBlock();
    };

    function refrechCanvas(){
        snakee.advance();
        if(snakee.checkCollision()){
            gameOver();
        }else{
            if(snakee.isEatingApple(applee)){
                score++;
                snakee.ateApple = true;
                do{
                    applee.setNewPosition();
                }
                while(applee.isOnSnake(snakee));


            }
            ctx.clearRect(0,0,canvasWidth,canvasHeigth);
            drawScore();
            snakee.draw();
            applee.draw();
            setTimeout(refrechCanvas,delay);
        }
        
    };

    function gameOver(){
        ctx.save();
        ctx.font = "bold 65px sans-serif";
        ctx.fillStyle = "#000";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.strokeStyle = "white";
        ctx.lineWidth = 5;
        var centreX = canvasWidth / 2;
        var centreY = canvasHeigth / 2;
        ctx.strokeText("Game over" , centreX, centreY - 180);
        ctx.fillText("Game over" , centreX, centreY - 180);
        ctx.font = "bold 30px sans-serif";
        ctx.strokeText("Appyuer sur le touche Espace pour rejouer", centreX, centreY - 120)
        ctx.fillText("Appyuer sur le touche Espace pour rejouer", centreX, centreY - 120)
        ctx.restore();
    };

    function restart(){
        snakee = new Snake([[6,4], [5,4], [4,4], [3,4], [2,4]], "rigth");
        applee = new Apple([10,10]);
        score = 0;
        refrechCanvas();
    }

    function drawScore(){
        ctx.save();
        ctx.font = "bold 150px sans-serif"
        ctx.fillStyle = "gray";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        var centreX = canvasWidth / 2;
        var centreY = canvasHeigth / 2;

        ctx.fillText(score.toString() , centreX, centreY);
        ctx.restore();  
    }

    function drawBlock(ctx, position){
        var x = position[0] * blockSize;
        var y = position[1] * blockSize;
        ctx.fillRect(x, y, blockSize, blockSize);
    };

    function Snake(body, direction){
        this.body = body;
        this.direction = direction;
        this.ateApple = false;
        this.draw = function () {
            ctx.save();
            ctx.fillStyle = "#ff0000";
            for (var i = 0; i < this.body.length; i++) {
                drawBlock(ctx, this.body[i]);
            }
            ctx.restore();

        };

        this.advance= function(){
            var nextPosition = this.body[0].slice();//slice=micopier
            switch (this.direction) {
                case "left":
                    nextPosition[0] -= 1
                    break;
                case "rigth":
                    nextPosition[0] += 1
                    break;
                case "down":
                    nextPosition[1] += 1
                    break;
                case "up":
                    nextPosition[1] -= 1
                    break;
                default:
                    throw("Invalide direction");
            
            }
            this.body.unshift(nextPosition); //miajouter anle nextPosition any am 1er place
            if(!this.ateApple)
               this.body.pop(); //mamafa anle derrier element
            else
               this.ateApple = false;
        };

        this.setDirection = function (newDirection) {
            var allodDirection;//direction permis
            switch (this.direction) {
                case "left":
                case "rigth":
                    allodDirection = ["up", "down"]
                    break;
                case "down":
                case "up":
                    allodDirection = ["left", "rigth"]
                    break; 
                    default:
                        throw("Invalide direction");
            }
            if(allodDirection.indexOf(newDirection) > -1){
                this.direction = newDirection;
            };

        };

        this.checkCollision = function(){
            var wallCollision = false;// mivoka ny canvas
            var snakeCollision = false;//miodina @tenany
            var head = this.body[0];
            var rest = this.body.slice(1);
            var snakeX = head[0];
            var snakeY = head[1];
            var minX = 0;
            var minY = 0;
            var maxX = widthInBlock - 1;
            var maxY = heightInBlock - 1;
            var isNotBetweenHorizontalWalls = snakeX < minX || snakeX > maxX ;
            var isNotBetweenVerticallWalls = snakeY < minY || snakeY > maxY ;
            if(isNotBetweenHorizontalWalls || isNotBetweenVerticallWalls){
                wallCollision = true;
            }

            for (var i= 0; i < rest.length; i++) {
                if(snakeX ===  rest[i][0] && snakeY ===  rest[i][1]){
                    snakeCollision = true;
                }
            }
            
            return wallCollision || snakeCollision;

        };
        this.isEatingApple = function(appleToEat){
            var head = this.body[0];
            if(head[0] === appleToEat.position[0] && head[1] === appleToEat.position[1])
                return true;
            else
                return false;
        }


    };


    function Apple(position){
        this.position = position;
        this.draw = function(){
            ctx.save();
            ctx.fillStyle = "#33cc33";
            ctx.beginPath();//cercle
            var raduis = blockSize/2;
            var x = this.position[0]*blockSize + raduis;
            var y = this.position[1]*blockSize + raduis;
            ctx.arc(x,y, raduis, 0, Math.PI*2, true);
            ctx.fill();
            ctx.restore();

        };

        this.setNewPosition = function(){
            var newX = Math.round(Math.random() * (widthInBlock - 1));
            var newY = Math.round(Math.random() * (heightInBlock - 1)); 
            this.position = [newX, newY];
        };

        this.isOnSnake = function(snakeToCheck){
            var isOnSnake = false;
            for (var i = 0; i < snakeToCheck.body.length; i++) {
                if(this.position[0] === snakeToCheck.body[i][0] && this.position[1] === snakeToCheck.body[i][1]){
                    isOnSnake = true;
                }
            }
            return isOnSnake;
        }
    }


    document.onkeydown = function handleKeyDown(e){
        var key = e.keyCode;//manome code ny touche ze avy tsidrina
        var newDirection;
        switch (key) {
            case 37: 
                newDirection = "left";
                break;
            case 38: 
                newDirection = "up";
                break;
            case 39: 
                newDirection = "rigth";
                break;
            case 40: 
                newDirection = "down";
                break;
            case 32:
                restart();
                return;
            default:
                return;
        }
        snakee.setDirection(newDirection);
    }

    

    init();
    

    
}

