(function() {
  'use strict';

  angular
    .module('macbethApp')
    .factory('utility', utility);

  utility.$inject = [];

  function utility() {
    function titleCase(str) {
      str = str.toLowerCase().split(' ');
      console.log(str);

      newWords = [];

      for (let word of str) {
        newWords.push(word.charAt(0).toUpperCase() + word.slice(1));
      }
      console.log(newWords);
      newWords = newWords.join(' ');
      console.log(newWords);
      return newWords;
    }      
  }
})();