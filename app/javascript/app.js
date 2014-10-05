'use strict';

var app = angular.module('PartyTriviaApp', []).run(function($rootScope) {
    $rootScope.UTIL = {
        cloneArrayItems: function(arr) {
            if (arr.length > 5) {
                return arr;
            }
            var out = [];
            for (var i = 0; i < 2; i++) {
                for (var j = 0; j < arr.length; j++) {
                    out.push(arr[j]);
                }
            }
            return out;
        },
        shuffle: function(o) {
            for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
            return o;
        }
    }
});