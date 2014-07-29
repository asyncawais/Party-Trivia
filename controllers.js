"use strict"

app.controller("MainController", function($scope) {
    $scope.test = function() {	
    
    }
});

app.controller("QuestionsCtrl", function($scope, $http, $timeout) {
    
    var questionsLimit = 10;
    var timer;
    
    $scope.question = {
        'id'             : '',
        'question'       : '',
        'answer_a'       : '',
        'answer_b'       : '',
        'answer_c'       : '',
        'answer_d'       : '',
        'correct'        : ''
    };
    
    $scope.animations = {
        'slideIn' : false
    }
    
    $scope.seenQuestions    = [];
    $scope.seenCategories   = [];
    
    $scope.count = 0;
    
    $scope.showQuestions = function() {
        
        var httpRequest = $http({
                
                method  : 'POST',
                url     : 'questions.json'
                
            }).success(function(data, status) {
            
                if ($scope.count == questionsLimit) {
                    console.log('quiz ended');
                    return;
                }
                
                var rnd = Math.round(Math.random() * (data.length-1));
                
                if ($scope.seenQuestions.indexOf(data[rnd].id) != -1) {
                    $scope.showQuestions();
                    return;                
                }
                
                $timeout($scope.startCountdown, 1000);
                $timeout($scope.stopCountdown, 20000);
                
                $scope.animations.slideIn = true;
                
                $timeout(function() { 
                    $scope.question = data[rnd];
                    $scope.seenQuestions.push($scope.question.id);
                    $scope.animations.slideIn = false;
                }, 1000);
                
                $scope.count++;
                
                $timeout($scope.sendAnswer, 1000);
                $timeout($scope.showQuestions, 21000);
                      
            });
        
    }
    
    $scope.showQuestions();
    
    $scope.sendAnswer = function() {
        var answer = $scope.question.correct;
        var $audio = angular.element( document.querySelector('#answer_' + answer + '_audio'));
        $audio[0].play();
        console.log('The correct answer is: ' + answer);
    }
    
    $scope.TimeRemaining = 20;
    
    $scope.startCountdown = function() {
        if (!$scope.TimeRemaining) {
            $scope.TimeRemaining = 20;    
        }
        timer = $timeout($scope.startCountdown, 1000);
        $scope.TimeRemaining--;
        return;
    }
    
    $scope.stopCountdown = function() {
        $scope.TimeRemaining = 0;
        $timeout.cancel(timer);    
    }
    
    
    
    // $timeout.cancel(promise);
    
});
