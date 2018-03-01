'use strict';

chatView.controller('mainController', ['$scope', '$http', 'socket', function($scope, $http, socket)
{
  // Initialize variables needed.
  $scope.newUser = {};
  $scope.newMessage = {};
  $scope.selectedUser = '';

  var phoneNumbers = $scope.phoneNumbers = {
    numbers: [],
    from: ''
  };

  // Set SelectedUser as the one with the most recent message to you.
  // Order users by last message created on (should be done in Routes.js)

  // Delete all by pressing this button.
  $scope.deleteAll = function() {
    // console.log('deleting');
    $http.delete('/api')
      .success(function(data) {
        $scope.users = data;
      })
      .error(function(data) {
        console.log('Error: ' + data);
      });
  };

  // When landing on the page, get all chats and a few pieces of each chat history.
  // You need to access the Nodejs API here.
  // Load only the Messages where your number is either the 'to' or the 'from'.
  $http.get('/api/users')
    .success(function(data) {
      // console.log(data);
      $scope.users = data;
      $scope.selectedUser = data[0].phone_number;
      // Also need to active.
    })
    .error(function(data) {
      console.log('Error: ' + data);
    });

  $http.get('/api/numbers')
    .success(function(data) {
      phoneNumbers.numbers = data;
      phoneNumbers.from = phoneNumbers.numbers[0].phone_number;
    })
    .error(function(data) {
      console.log('Error: ' + data);
    });

  // Adding a new user.
  $scope.addUser = function() {
    var postLoad = {}
    postLoad.firstName = $scope.newUser.firstName;
    postLoad.lastName = $scope.newUser.lastName;
    postLoad.phoneNumber = $scope.newUser.phoneNumber;
    postLoad.school = $scope.newUser.school;
    postLoad.position = $scope.newUser.position;
    $http.post('/api/user', postLoad)
      .success(function(data) {
        $('input').val('Test was sent');
        console.log(data);
        $scope.users = data;
        // console.log(data);
      })
      .error(function(data) {
        console.log('Error: ' + data);
      });
  };

  // When submitting a chat message, send the text to the node API
  // Node API will then send call function to send it via Twilio
  // and to save it to MongoDB.
  $scope.sendMessage = function() {
    var postLoad = {};
    postLoad.to = $('#user').attr('data-phone-number');
    postLoad.body = $scope.newMessage.body;
    postLoad.from = phoneNumbers.from;

    $http.post('/api/message', postLoad)
      .success(function(data) {
        $scope.newMessage.body = '';
        $('input#message-body').val('');
        // Manually update the chat box. TODO.
        $scope.users = data;
        // console.log('new data: ' + data);
        // console.log('message received');
      })
      .error(function(data) {
        console.log('Error: ' + data);
      });
  };

  $scope.deleteMessage = function(id) {
    $http.delete('/api/message/' + id)
      .success(function(data) {
        $scope.messages = data;
        // console.log(data);
      })
      .error(function(data) {
        console.log('Error: ' + data);
      });
  };

  // Receiving data from server and pushing to front-end.
  socket.on('users', function(data) {
    $scope.users = data;
    console.log('we are receiving an inbound SMS from Twilio.');
    
    // Data is an array of objects.
    // 

    // Check the data. Pass it through the unicode.
    // for(var i = 0; i < data.length; i++) {
    //   for(var j = 0; j < data[i].chat.length; j++ ) {
    //     data[i].chat[j].body = minEmoji(data[i].chat[j].body);
    //   };
    // };
    // var preUnicode = $('.message').text();
    // $('.message').text(minEmoji(preUnicode));
    // console.log('pre unicode: ' + preUnicode);
    // console.log('post unicode: ' + minEmoji(preUnicode));
  });
}]);