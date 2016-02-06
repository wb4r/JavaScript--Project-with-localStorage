function loadData() {

  // UTILITIES

  String.prototype.last = function(str) {
    return str.slice(-1);     //string.last(string)
  }

  String.prototype.matchesPattern = function(key) {
    if (Number.isInteger(+key[0]) && Number.isInteger(+key.last(key)) && key.contains(",")) {
      return true;
    } else { return false }
  }
  String.prototype.contains = function(it) {
    return this.indexOf(it) != -1;
  };

  //

  var total_items = [],
      total_lists = [],
      firstArray = [],
      string = "list-nr-",
      arrayOfListKeys = [];

  function getListsKeys() {
    firstArray = _.keys(localStorage, function(lskey) {return lskey})
    _.each(firstArray, function(each) {
      if (each.contains(string)) {
        arrayOfListKeys.push(each);
      }
    })
  }

  getListsKeys();

  _.each(arrayOfListKeys, function(akIndex) {
      total_lists.push(JSON.parse(localStorage.getItem(akIndex)))
  })

  var arrayOfItemKeys = [];
  function getItemsKey() {
    firstArray = _.keys(localStorage, function(ikey) {return ikey})
    _.each(firstArray, function(each) {
      if (String.prototype.matchesPattern(each)) {
        arrayOfItemKeys.push(each);
      }
    })
  }
  getItemsKey();

  _.each(arrayOfItemKeys, function(akIndex) {
      total_items.push(JSON.parse(localStorage.getItem(akIndex)))
  })

  return [total_lists, total_items];
};
