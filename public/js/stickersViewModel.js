if(typeof stickers === "undefined") stickers = {};

stickers.Sticker = function(attrs){
  var self = this;
  if(!attrs) attrs = {};
  self._id = ko.observable(attrs._id);
  self.status = ko.observable(attrs.status);
  self.title = ko.observable(attrs.title);

  self.save = function(){
    jQuery.ajax({
            url: "/sticker",
            contentType: 'application/json; charset=utf-8',
            type: "POST",
            data: ko.toJSON(self),
            dataType: "json",
            success: function(result) {
               self.id(result._id); 
              }
            });

  };
};

stickers.Lane = function(title){
  var self = this;
  self.title = ko.observable(title);
  self.stickers = ko.observableArray([]);
}

stickers.Wall = function(attrs){
  var self = this;
  if(!attrs) attrs = {};
  self.statuses = ['Pending', 'In BA', 'Ready for Dev', 'In Dev', 'Ready for QA', 'In QA', 'Ready for Sign off', 'Completed'];//Todo: read from wall settings.
  self.defaultStatus = self.statuses[0];//Todo: read from wall settings

  self.lanes = ko.observableArray(_.map(self.statuses, function(status){ return new stickers.Lane(status);}));
  self.defaultLane = _.find(self.lanes(), function(lane){return lane.title() == self.defaultStatus});

  self.newSticker = ko.observable(new stickers.Sticker({status: self.defaultStatus}));

  self.load = function(){
    $.getJSON("/stickers", function(data){
      var groupedStickers = _.groupBy(data, 'status');
      
      for(var status in groupedStickers){
        var matchedLane = _.find(self.lanes(), function(lane){ return lane.title() == status; });
        if(matchedLane){
          _.each(groupedStickers[status], function(stickerData){
            matchedLane.stickers.push(new stickers.Sticker(stickerData));
          }); 
        }
        
      }
    });
  };

  self.addSticker = function(){
    self.newSticker(new stickers.Sticker({status: self.defaultStatus}));
  };

  self.createSticker = function(){
    self.defaultLane.stickers.push(self.newSticker());
    self.newSticker().save();
  }
};
