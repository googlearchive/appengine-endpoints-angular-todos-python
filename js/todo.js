//
// Copyright 2014 Google Inc. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//


// This is a slightly modified version of Angular.js todo list demo
// from https://angularjs.org/#add-some-control.
// It uses the resource plugin to talk to an App Engine JSON backend.
// For more complicated use cases, such as OAuth 2.0 support, you'll likely
// want to use Google's JS client:
// https://developers.google.com/appengine/docs/python/endpoints/consume_js
angular.module('todo', ['ngResource'])
  .factory('Todo', function($resource) {
    var Todo = $resource('/_ah/api/todo/v1/todos/:id', {id: '@id'}, {
      query: {method: 'GET', isArray: false},
      update: {method: 'PUT'}
    });
    return Todo;
  })
  .controller('TodoCtrl', function($scope, Todo) {
    Todo.query(function(response) {
      $scope.todos = [];
      angular.forEach(response.items, function(item) {
        var todo = new Todo();
        todo.text = item.text;
        todo.done = item.done;
        todo.id = item.id;
        $scope.todos.push(todo);
      });
    });

    $scope.addTodo = function() {
      var todo = new Todo();
      todo.text = $scope.todoText;
      todo.done = false;
      todo.$save();
      $scope.todos.push(todo);
      $scope.todoText = '';
    };

    $scope.change = function(todo) {
      todo.$update();
    }

    $scope.remaining = function() {
      var count = 0;
      angular.forEach($scope.todos, function(todo) {
        count += todo.done ? 0 : 1;
      });
      return count;
    };

    $scope.archive = function() {
      $scope.todos = $scope.todos.filter(function(todo) {
        return !todo.done;
      })
    };
  });
