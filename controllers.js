"use strict"

app.controller("QuestionsCtrl", function($scope, $http, $timeout) {
    
    var questionsLimit = 10;
    var loop;
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
        'slideIn' : false,
        'slideDown' : false,
        'fadeOut' : false
    }
    
    $scope.shifted          = true;
    $scope.showAnswer       = false;
    $scope.seenQuestions    = [];
    $scope.seenCategories   = [];
    $scope.count            = 0;
    $scope.TimeRemaining    = 20;
    
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
                
                $scope.resetAnimations();
                $scope.resetCountdown();
                $scope.shifted = true; 
                
                $timeout(function() {
                    $scope.animations.fadeOut = true;
                }, 1000);    
                
                $timeout(function() {
                    $scope.question = data[rnd];
                    $scope.seenQuestions.push($scope.question.id);
                    $scope.animations.slideIn = true;
                    $scope.animations.slideDown = true;
                    $scope.shifted = false; 
                }, 1000);
                
                $timeout(function() {
                    $scope.startCountdown();
                    $scope.sendAnswer();
                }, 3000);
                
                $scope.count++;
                
                loop = $timeout($scope.showQuestions, 25000);
                      
            });
    
    }
    
    $scope.showQuestions();
    
    $scope.sendAnswer = function() {
        var answer = $scope.question.correct;
        var $audio = angular.element( document.querySelector('#answer_' + answer + '_audio'));
        $audio[0].play();
        console.log('The correct answer is: ' + answer);
    }
    
    $scope.startCountdown = function() {
        if ($scope.TimeRemaining == 0) {
            $timeout.cancel(timer);
            return;
        }
        timer = $timeout($scope.startCountdown, 1000);
        $scope.TimeRemaining--;
    }
    
    $scope.resetAnimations = function() {
        for (var k in $scope.animations) {
            if ($scope.animations.hasOwnProperty(k)) {
                $scope.animations[k] = false;        
            }
        }
    }
    
    $scope.resetCountdown = function() {
        $timeout.cancel(timer);
        $scope.TimeRemaining = 20;
    }
    
    
    
    // $timeout.cancel(promise);
    
});
