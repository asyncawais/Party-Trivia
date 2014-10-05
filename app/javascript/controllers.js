"use strict"

app.controller("QuestionsCtrl", function($scope, $http, $timeout) {

    var questionsLimit = 8;
    var loop;
    var timer;

    var countdown = (function() {

        var $canvas = document.getElementById('cc-countdown');

        var context = $canvas.getContext('2d'),
            x  = $canvas.width / 2, y = $canvas.height / 2,
            radius = 60;

        var lineWidth = '20';

        return {
            draw:function() {

                var total = 20;
                var elapsed = 20; // Seconds elapsed
                var seg = 2 / total;

                var startAngle = 1.5 * Math.PI;
                var endAngle = ((1.5)+(elapsed * seg)) * Math.PI;



                context.beginPath();
                context.arc(x, y, radius, startAngle, endAngle, false);
                context.lineWidth = lineWidth;
                context.strokeStyle = "green";
                context.stroke();

            },
            animate: function() {

                var total = 20;
                var elapsed = 20; // Seconds elapsed
                var seg = 2 / total;

                var startAngle = 1.5 * Math.PI;
                var endAngle = ((1.5)+(elapsed * seg)) * Math.PI;

                var i = setInterval(function() {
                    elapsed -= ((1000/60) / 1000);
                    endAngle = ((1.5)+(elapsed * seg)) * Math.PI;
                    context.beginPath();
                    context.arc(x, y, radius, startAngle, endAngle, true);
                    context.lineWidth = lineWidth;
                    context.strokeStyle = "#aaaaaa";
                    context.stroke();

                    if (elapsed < 0) {
                        clearInterval(i);
                        elapsed = 20;
                    }

                }, 1000/60);




            },
            reset: function() {
                context.clearRect(0, 0, $canvas.width, $canvas.height);
                this.draw();
            }
        }
    }());

    countdown.draw();

    $scope.question = { "id": "", "question": "", "answer_a": "", "answer_b": "", "answer_c": "", "answer_d": "", "correct": "" };
    $scope.animations = {
        'slideIn': false,
        'slideDown': false,
        'fadeOut': false
    };
    $scope.shifted = true;
    $scope.showAnswer = false;
    $scope.seenQuestions = [];
    $scope.seenCategories = [];
    $scope.categories = $scope.UTIL.shuffle(['Entertainment', 'Geography', 'Science', 'Sport']);
    $scope.showCategory = $scope.categories[0];
    $scope.count = 0;
    $scope.TimeRemaining = 20;
    $scope.gameState = '';
    $scope.showQuestions = function() {
        var httpRequest = $http({
            method: 'POST',
            url: 'questions.json'
        }).success(function(data, status) {
            if ($scope.count == questionsLimit) {
                $scope.gameState = 'Game Over';
                console.log('Game Over');
                return;
            }
            var rnd = Math.round(Math.random() * (data.length - 1));
            if ($scope.seenQuestions.indexOf(data[rnd].id) != -1) {
                $scope.showQuestions();
                return;
            }
            if (data[rnd].template != $scope.showCategory) {
                $scope.showQuestions();
                return;
            }
            $scope.resetAnimations();
            $scope.resetCountdown();
            countdown.reset();
            $scope.shifted = true;
            $scope.showAnswer = false;
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
                countdown.animate();
                $scope.sendAnswer();
            }, 3000);
            $timeout(function() {
                $scope.showAnswer = true;
            }, 23000);
            console.log('count ' + $scope.count);
            $scope.count++;
            if ($scope.count > 0 && $scope.count % 2 == 0) { /* Change category after every nth item */
                $scope.showCategory = $scope.categories[$scope.count / 2];
            }
            loop = $timeout($scope.showQuestions, 26000);
        });
    };

    $timeout(function() {
        $scope.showQuestions();
    }, 1000);

    $scope.sendAnswer = function() {
        var answer = $scope.question.correct.toUpperCase();
        var $audio = angular.element(document.querySelector('#answer_' + answer + '_audio'));
        //$audio[0].play();
        console.log('The correct answer is: ' + answer);
    };

    $scope.startCountdown = function() {
        if ($scope.TimeRemaining == 0) {
            $timeout.cancel(timer);
            return;
        }
        timer = $timeout($scope.startCountdown, 1000);
        $scope.TimeRemaining--;
    };

    $scope.resetAnimations = function() {
        for (var k in $scope.animations) {
            if ($scope.animations.hasOwnProperty(k)) {
                $scope.animations[k] = false;
            }
        }
    };

    $scope.resetCountdown = function() {
        $timeout.cancel(timer);
        $scope.TimeRemaining = 20;
    };






    // $timeout.cancel(promise);
});