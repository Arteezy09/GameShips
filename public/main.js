(function() {

  var socket = io();

  var field= [];

  field[0] = document.getElementById('field1');
  field[1] = document.getElementById('field2');

  for (var i = 0; i < 100; i++) {
    field[0].innerHTML+='<div class="square1"></div>'
    field[1].innerHTML+='<div class="square2"></div>'
  }

  var squares = [];

  squares[0] = document.getElementsByClassName('square1');
  squares[1] = document.getElementsByClassName('square2');

  var alter = document.getElementById('alter');

  alter.addEventListener('click', function() {     // поменять расположение кораблей
    Game.placeShips();
  });

  field[1].addEventListener('click', function(event) {     // выстрел (клик по полю оппонента)

    if (Game.status == 1 && Game.turn == 1 && event.target.innerHTML != 'X') {

        event.target.innerHTML = 'X'; 

        outer: for (var index = 0; index < 100; index++) {
          if (event.target == squares[1][index]) {
            for (var j = 0; j < Game.target.length; j++) {
              if (index == Game.target[j]) {
                socket.emit('click', { room: Game.room, index: index, turn: 0 });
                break outer;
              }
            }
            socket.emit('click', { room: Game.room, index: index, turn: 1 });
            Game.turn = 0;
            $('#text').html(`Ход оппонента!`);
            break;
          }
        }

        Game.updateField();
        Game.endGame();

    }

  });

  var ships = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1];  // все корабли игрока и их длина

  $('#infoText').hide();


/*-----------------------------------------------------------------------------------------------------------------------*/


  var Game = {

    room: '',    // комната игры
    name: '',    // имя игрока
    ships: [],   // массив - номера квадратов на сетке, где располагаются корабли игрока
    target: [],  // массив - номера квадратов на сетке, где располагаются корабли противника
    status: 0,   // статус игры
    turn: 0,     // ход игрока


    placeShip(i) {     // функция, которая случайно ставит корабль игрока на сетку. Возвращает true, если 
                       // поставленный корабль удовлетворяет всем требованиям расположения в игре
      var horizontal = Math.random() < 0.5;
      var rand_square = Math.floor(Math.random() * 100);
    
      var x = rand_square % 10;
      var y = (rand_square - (rand_square % 10))/10;
    
      var left = 0;
      var right = 0;
      var top = 0;
      var bottom = 0;
    
      if (x == 0) left = -1;
      if (10 - x == ships[i]) right = -1;
      if (y == 0) top = -1;
      if (10 - y == ships[i]) bottom = -1;
    
      if (horizontal == true) {
        if (10 - x >= ships[i]) {
    
          if (y == 0) {
            for (var j = 0; j < ships[i] + 2 + left + right; j++) {
              if (squares[0][rand_square - 1 + j - left].style.background == "red" ||  
                  squares[0][rand_square - 1 + j - left + 10].style.background == "red") {
      
                  return false;
              }
            }         
          }
          else if (y == 9) {
            for (var j = 0; j < ships[i] + 2 + left + right; j++) {
              if (squares[0][rand_square - 1 + j - left].style.background == "red" || 
                  squares[0][rand_square - 1 + j - left - 10].style.background == "red") {
      
                  return false;
              }
            }         
          }
          else {
            for (var j = 0; j < ships[i] + 2 + left + right; j++) {
              if (squares[0][rand_square - 1 + j - left].style.background == "red" || 
                  squares[0][rand_square - 1 + j - left - 10].style.background == "red" || 
                  squares[0][rand_square - 1 + j - left + 10].style.background == "red") {
      
                  return false;
              }
            }         
          }
              
          for (var j = 0; j < ships[i]; j++) {
            squares[0][rand_square + j].style.background = "red";
            this.ships.push(rand_square + j);
          }
    
          return true;
        } 
        else {
    
          return false;
        }
      }
      else {  
        if (10 - y >= ships[i]) {
    
          if (x == 0) {
            for (var j = 0; j < ships[i] + 2 + top + bottom; j++) {
              if (squares[0][rand_square - 10 + j*10 - top*10].style.background == "red" ||  
                  squares[0][rand_square - 10 + j*10 - top*10 + 1].style.background == "red") {
      
                  return false;
              }
            }  
          }
          else if (x == 9) {
            for (var j = 0; j < ships[i] + 2 + top + bottom; j++) {
              if (squares[0][rand_square - 10 + j*10 - top*10].style.background == "red" || 
                  squares[0][rand_square - 10 + j*10 - top*10 - 1].style.background == "red") {
      
                  return false;
              }
            }  
          }
          else {
            for (var j = 0; j < ships[i] + 2 + top + bottom; j++) {
              if (squares[0][rand_square - 10 + j*10 - top*10].style.background == "red" || 
                  squares[0][rand_square - 10 + j*10 - top*10 - 1].style.background == "red" || 
                  squares[0][rand_square - 10 + j*10 - top*10 + 1].style.background == "red") {
      
                  return false;
              }
            }  
          }
    
          for (var j = 0; j < ships[i]; j++) {
            squares[0][rand_square + j*10].style.background = "red";
            this.ships.push(rand_square + j*10);
          } 
    
          return true;
        }
        else 
    
          return false;
      } 
    },
    
    
    placeShips() {     // функция, расставляющая корабли игрока случайно на сетку 
                       // (сначала 4-х палубный корабль, потом 3-х палубные, 2-х палубные и 1 палубные корабли)
      for (var i = 0; i < 100; i++) {
        squares[0][i].style.background = "#29B6F6";
      };
      this.ships.splice(0, 20);
      for (var i = 0; i < ships.length; i++) {
        while(!this.placeShip(i)) {
        }
      }
    },


    updateField() {     // функция, которая закрашивает поле оппонента в зависимости от ходов игрока

      if(squares[1][this.target[0]].innerHTML == 'X') 
        squares[1][this.target[0]].style.background = "orange";
      if(squares[1][this.target[1]].innerHTML == 'X') 
        squares[1][this.target[1]].style.background = "orange";
      if(squares[1][this.target[2]].innerHTML == 'X') 
        squares[1][this.target[2]].style.background = "orange";
      if(squares[1][this.target[3]].innerHTML == 'X') 
        squares[1][this.target[3]].style.background = "orange";
      if (squares[1][this.target[0]].innerHTML == 'X' && squares[1][this.target[1]].innerHTML == 'X' && squares[1][this.target[2]].innerHTML == 'X' && squares[1][this.target[3]].innerHTML == 'X') {
        squares[1][this.target[0]].style.background = "red";
        squares[1][this.target[1]].style.background = "red";
        squares[1][this.target[2]].style.background = "red";
        squares[1][this.target[3]].style.background = "red";
      } 
      
      if(squares[1][this.target[4]].innerHTML == 'X') 
        squares[1][this.target[4]].style.background = "orange";
      if(squares[1][this.target[5]].innerHTML == 'X') 
        squares[1][this.target[5]].style.background = "orange";
      if(squares[1][this.target[6]].innerHTML == 'X') 
        squares[1][this.target[6]].style.background = "orange";
      if (squares[1][this.target[4]].innerHTML == 'X' && squares[1][this.target[5]].innerHTML == 'X' && squares[1][this.target[6]].innerHTML == 'X') {
        squares[1][this.target[4]].style.background = "red";
        squares[1][this.target[5]].style.background = "red";
        squares[1][this.target[6]].style.background = "red";
      }
    
      if(squares[1][this.target[7]].innerHTML == 'X') 
        squares[1][this.target[7]].style.background = "orange";
      if(squares[1][this.target[8]].innerHTML == 'X') 
        squares[1][this.target[8]].style.background = "orange";
      if(squares[1][this.target[9]].innerHTML == 'X') 
        squares[1][this.target[9]].style.background = "orange";  
      if (squares[1][this.target[7]].innerHTML == 'X' && squares[1][this.target[8]].innerHTML == 'X' && squares[1][this.target[9]].innerHTML == 'X') {
        squares[1][this.target[7]].style.background = "red";
        squares[1][this.target[8]].style.background = "red";
        squares[1][this.target[9]].style.background = "red";
      }
    
      if(squares[1][this.target[10]].innerHTML == 'X') 
        squares[1][this.target[10]].style.background = "orange";
      if(squares[1][this.target[11]].innerHTML == 'X') 
        squares[1][this.target[11]].style.background = "orange";  
      if (squares[1][this.target[10]].innerHTML == 'X' && squares[1][this.target[11]].innerHTML == 'X') {
        squares[1][this.target[10]].style.background = "red";
        squares[1][this.target[11]].style.background = "red";
      }
    
      if(squares[1][this.target[12]].innerHTML == 'X') 
        squares[1][this.target[12]].style.background = "orange";
      if(squares[1][this.target[13]].innerHTML == 'X') 
        squares[1][this.target[13]].style.background = "orange";    
      if (squares[1][this.target[12]].innerHTML == 'X' && squares[1][this.target[13]].innerHTML == 'X') {
        squares[1][this.target[12]].style.background = "red";
        squares[1][this.target[13]].style.background = "red";
      }
    
      if(squares[1][this.target[14]].innerHTML == 'X') 
        squares[1][this.target[14]].style.background = "orange";
      if(squares[1][this.target[15]].innerHTML == 'X') 
        squares[1][this.target[15]].style.background = "orange";    
      if (squares[1][this.target[14]].innerHTML == 'X' && squares[1][this.target[15]].innerHTML == 'X') {
        squares[1][this.target[14]].style.background = "red";
        squares[1][this.target[15]].style.background = "red";
      }
    
      if (squares[1][this.target[16]].innerHTML == 'X') {
        squares[1][this.target[16]].style.background = "red";
      }
    
      if (squares[1][this.target[17]].innerHTML == 'X') {
        squares[1][this.target[17]].style.background = "red";
      }
    
      if (squares[1][this.target[18]].innerHTML == 'X') {
        squares[1][this.target[18]].style.background = "red";
      }
    
      if (squares[1][this.target[19]].innerHTML == 'X') {
        squares[1][this.target[19]].style.background = "red";
      }  
    },


    endGame() {     // функция, которая проверяет были ли сбиты все корабли оппонента или нет

      var count = 0;
      for (var i = 0; i < this.target.length; i++) {
        if(squares[1][this.target[i]].innerHTML == 'X') {
          count++;
        }
      }
      if(count == 20) {
        socket.emit('endGame', { room: Game.room });
      }   
    }

  }

  Game.placeShips();

  
/*-----------------------------------------------------------------------------------------------------------------------*/

  
  $('#newGame').on('click', () => {     // кнопка "создать игру"

    var name = $('#newName').val();
    if (!name) {
      alert('Введите своё имя!');
      return;
    }
    Game.name = name;
    socket.emit('join1', { arr: Game.ships }); 
    $('#options').hide();
    $('#infoText').show();
  });


  $('#joinGame').on('click', () => {     // кнопка "войти в игру"

    var name = $('#joinName').val();
    var room = $('#room').val();
    if (!name) {
      alert('Введите своё имя!');
      return;
    }
    if (!room) {
      alert('Введите номер комнаты!');
      return;
    }
    Game.name = name;
    socket.emit('join2', { room: room, arr: Game.ships });
    $('#options').hide();
    $('#infoText').show();
  });


  socket.on('newGame', (data) => {

    Game.room = data.room;
    Game.target = data.arr; 
    Game.turn = data.turn;
    Game.status = 1;

    if (Game.turn == 1) 
      $('#text').html(`${Game.name}, ваш ход!`);   
    else 
      $('#text').html(`Ход оппонента!`);
  });


  socket.on('click', (data) => {

    squares[0][data.index].innerHTML = 'X';
    Game.turn = data.turn;

    if (Game.turn == 1) 
      $('#text').html(`${Game.name}, ваш ход!`);
    else 
      $('#text').html(`Ход оппонента!`);
  });


  socket.on('message', (data) => {
    alert(data.message);
  });


  socket.on('room', (data) => {
    $('#text').html(`Добро пожаловать ${Game.name}! Номер комнаты - ${data.room}. Ожидайте 2 игрока`);
  });


  socket.on('endGame', (data) => {

    Game.status = 0;
    if(data.win == 1) 
      $('#text').html(`Поздравляем! Вы победили!`);
    else 
      $('#text').html(`Вы проиграли! Увы!`);
  });


}());

