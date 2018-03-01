var chatView = angular.module('chatView', []);

function mainController($scope, $http) {
    // When landing on the page, get all chats and a few pieces of each chat history.
    // You need to access the Nodejs API here.
    // Load only the Messages where your number is either the 'to' or the 'from'.
    $http.get('/api/messages')
        .success(function(data) {
            $scope.messages = data;
            console.log(data);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

    // When submitting a chat message, send the text to the node API
    // Node API will then send call function to send it via Twilio
    // and to save it to MongoDB.
    $scope.sendMessage = function() {
        // Make sure $scope.formData has the 'to' field.
        var postLoad = {};
        postLoad.formData = $scope.formData;
        postLoad.toData = $scope.toData;
        $http.post('/api/message', postLoad)
            .success(function(data) {
                $('input').val('');
                $scope.messages = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    // delete a todo after checking it
    $scope.deleteMessage = function(id) {
        $http.delete('/api/message/' + id)
            .success(function(data) {
                $scope.messages = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

}