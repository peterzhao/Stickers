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

stickers.Wall = function(attrs){
  var self = this;
  if(!attrs) attrs = {};
  self.stickers = ko.observableArray([]);
  self.newSticker = ko.observable(new stickers.Sticker());

  self.load = function(){
    $.getJSON("/stickers", function(data){
      self.stickers.removeAll();
      _.each(data, function(stickerData){
        self.stickers.push(new stickers.Sticker(stickerData));
      });
    });
  };

  self.addSticker = function(){
    self.newSticker(new stickers.Sticker());
  };

  self.createSticker = function(){
    self.stickers.push(self.newSticker());
    self.newSticker().save();
  }
};
