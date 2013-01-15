if(typeof stickers === "undefined") stickers = {};

stickers.Sticker = function(attrs){
  var self = this;
  if(!attrs) attrs = {};
  self._id = ko.observable(attrs._id);
  self.status = ko.observable(attrs.status);
  self.title = ko.observable(attrs.title);
  self.save = function(){
    $.ajax({
            url: "/sticker",
            contentType: 'application/json; charset=utf-8',
            type: "POST",
            data: ko.toJSON(self),
            dataType: "json",
            success: function(result) {
               self._id(result._id); 
              }
            });

  };
  var statusEventsubscriber = null;
  self.registerStatusEvent = function(handler){
    if(statusEventsubscriber) statusEventsubscriber.dispose();
    statusEventsubscriber = self.status.subscribe(function(newStatus){
      handler(self);
    });
  }
};

stickers.Lane = function(title){
  var self = this;
  self.title = ko.observable(title);
  self.stickers = ko.observableArray([]);
  self.getSticker = function(id){
    return _.find(this.stickers(), function(sticker){
      return sticker._id() == id;
    });
  }
}

stickers.Wall = function(attrs){
  var self = this;
  if(!attrs) attrs = {};
  self.statuses = attrs.statuses || ['Pending', 'In BA', 'Ready for Dev', 'In Dev', 'Ready for QA', 'In QA', 'Ready for Sign off', 'Completed'];//Todo: read from wall settings.
  self.defaultStatus = self.statuses[0];//Todo: read from wall settings

  self.lanes = ko.observableArray(_.map(self.statuses, function(status){ return new stickers.Lane(status);}));
  self.defaultLane = _.find(self.lanes(), function(lane){return lane.title() == self.defaultStatus});

  self.newSticker = ko.observable(new stickers.Sticker({status: self.defaultStatus}));

 
  
  self.load = function(){
    $.ajax({
        url: "/stickers",
        type: "GET",
        success: function(data){
          _.each(data, function(stickerData){
            var sticker = new stickers.Sticker(stickerData);
            self.addToWall(sticker);
        });
        }
    });
  };

  

  self.resetNewSticker = function(){
    self.newSticker(new stickers.Sticker({status: self.defaultStatus}));
  };

  self.createSticker = function(){
    self.addToWall(self.newSticker());
    self.newSticker().save();
  }

  self.changeStatus = function(id, status){
    var sticker = getSticker(id);
    sticker.status(status);
    sticker.save(); 
  }

  self.addToWall = function(sticker){
     moveToLane(sticker);
     sticker.registerStatusEvent(moveToLane);
  }

  function getSticker(id){
    for(var laneIndex in self.lanes()){
      var sticker = self.lanes()[laneIndex].getSticker(id);
      if(sticker) return sticker;
    }
    return null;
  }

  function getLane(status){
    return _.find(self.lanes(), function(lane){
      return lane.title() == status;
    });
  }

  function getLaneBySticker(sticker){
    return _.find(self.lanes(), function(lane){
      return _.contains(lane.stickers(), sticker);
    });
  }

 
  function moveToLane(sticker){
     var originalLane = getLaneBySticker(sticker);
     if(originalLane) originalLane.stickers.remove(sticker);

    var newLane = getLane(sticker.status());
    if(newLane) newLane.stickers.push(sticker);
  }

 };
