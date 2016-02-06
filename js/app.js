$(document).ready(function() {

  var listsCounter = 0,
      total_items = [],
      total_lists_obj = [],
      list_of_lists = [],

      currentListObject = {},
      currentItemObject = {},
      currentItemsArray = [];

  // NEW ITEM COSNTRUCTOR
  function NewItem(parent_list) {
    this.id = total_items.length;
    this.nr = parent_list.items.length + 1;
    this.description = "";
    this.parent = parent_list.nr;
    this.parentid = "list-nr-" + parent_list.nr;
    this.title = "New Task";
    this.status = "pending";
    this.content = "Item " + this.nr + " for List " + parent_list.nr;
    total_items.push(this);
  };

  // NEW LIST CONSTRUCTOR
  function NewList(){
    this.nr = total_lists_obj.length + 1;
    this.title = "List " + this.nr;
    this.id = "list-nr-0" + this.nr;
    this.status = "pending";
    this.items = [];
    this.addItem = function() {
      this.items.push(new NewItem(this));
    };
    listsCounter += 1;
    total_lists_obj.push(this);
  };

  var addItem = function() {
    this.items.push(new NewItem(this));
  }

  var render = function(currentListObject) {
    currentListObject = currentListObject || new NewList();

    function displayIt(self) {
      self.append("<li id='" + currentListObject.id + "' class='list' data-index=" + currentListObject.nr + "><a href='#'>" + currentListObject.title + "</a></li>");
      var addCurrentToListOfLists = (function() {
        list_of_lists.push(currentListObject);
      })();
    }

    if (currentListObject.status === "pending") {
      displayIt($("#ol-of-pending-lists"));
    } else if (currentListObject.status === "completed") {
      displayIt($("#ol-of-completed-lists"));
    }
  }

  function showList(self) {
    currentListObject = total_lists_obj[self.id.slice(-2) -1];
    currentItemsArray = [];

    if (currentListObject.status === "completed") {
      $("#add-new-todo").addClass("trashed-list")
    }
    if (currentListObject.status === "pending") {
      $("#add-new-todo").removeClass("trashed-list")
    }

    extractArrayForHandlebars(currentListObject);
    callHb();

    _.each(currentListObject.items, function(e) {
        // console.log(this);
        switchClass(e);
    });
    $("#list-title").text(currentListObject.title)
  };

  function switchClass(element) {
    if (element.status === "completed") {
      $("#" + element.id).find("label").addClass("lined-through");
    };
    if (element.status === "pending") {
      $("#" + element.id).find("label").removeClass("lined-through");
    }
  };

  function callHb() {
    var items_DB = {};
    items_DB.items = [];
    items_DB.items = currentItemsArray;

    Handlebars.registerPartial("item", $("#item").html());
    var items_template = Handlebars.compile($("#items").html());

    $("#ol-items li").remove();
    $("#ol-items").append(items_template(items_DB));
  }

  // EXTRACT ARRAY OF OBJECTS FROM LIST TO HB
  function extractArrayForHandlebars(currentListObject) {
    var realIndex = currentListObject.nr - 1;
    var arrayWithItems = list_of_lists[realIndex].items;

    return currentItemsArray = _.each(arrayWithItems, function(e) {
      currentItemsArray.push(e);
    });
  }

  // SWITCH BT PENDING & COMPLETED
  function switchStatus(object) {
    if (item.status === "pending") {
      item.status = "completed";
    } else if (item.status === "completed") {
      item.status = "pending";
    }
    // return object;
  }

  // CLICK FOR NEW LIST
  $("#add-pending-list").on("click", function(){
    // console.log(list_of_lists.length);
    if (list_of_lists.length <= 8) {
      render();
    } else if (list_of_lists.length >= 8) {
      alert("Your list is full.");
    }

  });

  // CLICK LIST LEFT SIDE - SHOW ON RIGHT SIDE
  $(document).on("click", ".list", function() {
    showList(this);
  });

  // ADD ITEM TO LIST
  $(document).on("click", "#add-new-todo", function() {
    currentListObject = list_of_lists[currentListObject.id.slice(-1) -1];
    if (currentListObject.status === "completed") {
      return;
    }
    if (currentListObject.status === "pending") {
      currentListObject.addItem();
      showList(currentListObject);
    }
  });

  // ONE CLICK ON ITEM
  $(document).on("click", ".checkbox", function() {
    var clickedInput = $(this).parent().find('input:checkbox').select();
    var parentLi = $(this).closest("li");
    var itemId = +parentLi.attr("id");

    currentItemObject = _.findWhere(total_items, {id: itemId})
    clickedInput.parent().find("label").toggleClass("lined-through");

    _.each(currentListObject.items, function(item) {
        if (item.id === currentItemObject.id) {
            switchStatus(item);
            if (item.status === "pending") {
              item.status = "completed";
            } else if (item.status === "completed") {
              item.status = "pending";
            }
        };
    });

    switchStatus(currentItemObject);
  });

  // MODAL FOR DESCRIPTION
  $(document).on("click", ".glyphicon-in-item-description", function() {
    itemId = +$(this).attr("id").slice(-1);
    currentItemObject = _.findWhere(total_items, {id: itemId});
    $("#textarea-desc").val(currentItemObject.description);
    $('#themodal').modal(function() {
    });
  })

  // SAVE DESCRIPTION ON MODAL
  $(document).on("click", "#save-btn", function() {
    var btn = $(this)
    currentItemObject.description = $("#textarea-desc").val();
    $(this).addClass("btn-saved");
    $(this).text("Saved!");

    setTimeout(function() {
      btn.removeClass("btn-saved").text("Save");
    }, 800);
  })

  // CLICK ON MODIFY ITEM
  $(document).on("click", ".glyphicon-in-item", function() {
    var parentLi = $(this).closest("li"),
        $label = $(this).parent().parent().parent().find("label"),
        inputText = $label.parent().find("input").last();

    currentItemObject = _.findWhere(total_items, {id: +parentLi.attr("id")})
    inputText.show();
    $label.hide();
    inputText.focus();

    // Saves Description content on focusOut
    inputText.on("focusout", function() {
      $label.text(inputText.val());
      currentItemObject.title = inputText.val()
      inputText.hide();
      $label.show();
    })

    _.each(currentListObject.items, function(item) {
        if (item.id === currentItemObject.id) {
            item.title = currentItemObject.title;
        };
    });
  })

  // TRASH ITEM
  $(document).on("click", ".glyphicon-in-item-trash", function() {
    var parentLi = $(this).closest("li");
    var itemId = +parentLi.attr("id");

    currentItemObject = _.findWhere(total_items, {id: itemId});
    var i = 0;
    _.each(total_items, function(item) {
        if (item === currentItemObject) {
            total_items.splice(i, 1);
        };
        i++;
    });

    for (var i = 0; i < total_lists_obj[currentItemObject.parent -1].items.length; i++) {
      if (total_lists_obj[currentItemObject.parent -1].items[i].id === currentItemObject.id) {
        total_lists_obj[currentItemObject.parent -1].items.splice(i, 1)
      }
    }
    parentLi.remove();
  })

  // TRASH LIST
  $(document).on("click", "#trash-it", function() {
    $("#ol-of-completed-lists").append($("#" + currentListObject.id));
    currentListObject.status = "completed";
    if (String.prototype.last(currentListObject.title) !== "!") {
      currentListObject.title = currentListObject.title + " - Completed!";
    }
  })

  // SAVE ON LOCALSTORAGE
  $(window).unload(function() {
    function saveItemsInLS() {
      _.each(total_items, function(e) {
        localStorage.setItem([e.id, e.parent], JSON.stringify(e));
      })
    }

    function saveListsInLS() {
      _.each(total_lists_obj, function(e) {
        localStorage.setItem(e.id, JSON.stringify(e));
      })
    }

    saveItemsInLS();
    saveListsInLS();
  });

  // LOAD FROM localStorage-comms.js
  total_lists_obj = loadData()[0];
  total_items = loadData()[1];

  _.each(total_lists_obj, function(list) {
    list.addItem = function() {
      this.items.push(new NewItem(this));
    }
  })

  // DELETE LOCALSTORAGE
  $(document).on("click", "#delete-ls", function() {
    listsCounter = 0;
    total_items = [];
    total_lists_obj = [];
    list_of_lists = [];
    currentListObject = {};
    currentItemObject = {};
    currentItemsArray = [];
    localStorage.clear();
    window.location.reload(false);
  })

  // FINAL RENDER OF LISTS
  function renderEachListIndividually() {
    _.each(total_lists_obj, function(e) {
      render(e)
    })
  }

  renderEachListIndividually()
});
