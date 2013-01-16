describe("stickersViewModel", function(){
  it("should add new sticker to the default lane", function(){
     var wall = new stickers.Wall({statuses: ['new', 'done']});
     wall.setNewSticker();
     wall.editingSticker().title("hi");
     wall.saveEditingSticker();
     expect(wall.lanes()[0].stickers().length).toBe(1);
     expect(wall.lanes()[0].stickers()[0].title()).toBe('hi');
     expect(ajaxOptions.type).toEqual("POST");
     expect(ajaxOptions.url).toEqual("/sticker");
     expect(ajaxOptions.data).toBe('{"status":"new","title":"hi"}');

     ajaxOptions.success({_id: "1234", __v:0, lastModified:'2012-12-25T10:26:00Z'});

     expect(wall.lanes()[0].stickers()[0]._id()).toBe('1234');
     expect(wall.lanes()[0].stickers()[0].__v()).toBe(0);
     expect(wall.lanes()[0].stickers()[0].lastModified()).toBe('2012-12-25T10:26:00Z');

  });

  it("should change status", function(){
    var wall = new stickers.Wall({statuses: ['new', 'done']});
    var sticker = new stickers.Sticker({status:'new', _id:'123'});
    wall.add(sticker);
    expect(wall.lanes()[0].stickers().length).toBe(1);
    expect(wall.lanes()[1].stickers().length).toBe(0);

    spyOn(sticker, 'save');

    wall.changeStatus(sticker._id(), 'done');
    expect(wall.lanes()[0].stickers().length).toBe(0);
    expect(wall.lanes()[1].stickers().length).toBe(1);
    expect(sticker.status()).toBe('done');

    expect(sticker.save).toHaveBeenCalled();
  });

  it("should pull changes from server", function(){
    var wall = new stickers.Wall({statuses: ['new', 'done']});

    wall.pullUpdate();

    expect(ajaxOptions.type).toBe('GET');
    expect(ajaxOptions.url).toBe('/stickers');//first pulling without lastModified

    var sticker1 = {status: 'done', title: 'sticker1', _id: '1', lastModified:'2013-01-02T20:48:17.884Z', __v:0, body: 'body1'};
    var sticker2 = {status: 'new', title: 'sticker2', _id: '2', lastModified:'2013-01-13T08:22:01.884Z', __v:1, body: 'body2'};
    var sticker3 = {status: 'done', title: 'sticker3', _id: '3', lastModified:'2013-01-10T05:50:23Z', __v:1, body:'body3'};

    ajaxOptions.success([sticker1, sticker2, sticker3]);

    expect(wall.lanes()[0].stickers().length).toBe(1);
    expect(wall.lanes()[1].stickers().length).toBe(2);
    expect(wall.lanes()[0].stickers()[0].title()).toBe('sticker2');
    expect(wall.lanes()[1].stickers()[0].title()).toBe('sticker1');
    expect(wall.lanes()[1].stickers()[1].title()).toBe('sticker3');
    expect(wall.lanes()[1].stickers()[1].body()).toBe('body3');
    expect(wall.lanes()[1].stickers()[1].__v()).toBe(1);
    expect(wall.lanes()[1].stickers()[1].lastModified()).toBe('2013-01-10T05:50:23Z');

    wall.lanes()[1].stickers()[0].__v(1);
    wall.lanes()[1].stickers()[0].body('body13');

    wall.pullUpdate();
    expect(ajaxOptions.url).toBe('/stickers?lastModified=2013-01-13T08:22:01.884Z');


    var sticker12 = {status: 'done', title: 'sticker1', _id: '1', lastModified:'2013-01-13T08:22:02.033Z', __v:1, body: 'body12'};//update by local but pull from server again, it should be ignored by checing version.
    var sticker4 = {status: 'new', title: 'sticker4', _id: '4', lastModified:'2013-01-13T08:22:02.011Z'}; //new
    var sticker22 = {status: 'done', title: 'sticker2', _id: '2', lastModified:'2013-01-13T08:22:022Z'};  //update status
    var sticker32 = {status: 'done', title: 'sticker31', _id: '3', lastModified:'2013-01-13T08:22:02.001Z'}; //update title
    
    ajaxOptions.success([sticker12, sticker4, sticker22, sticker32]);

    expect(wall.lanes()[0].stickers().length).toBe(1);
    expect(wall.lanes()[1].stickers().length).toBe(3);
    expect(wall.lanes()[0].stickers()[0].title()).toBe('sticker4');
    expect(wall.lanes()[1].stickers()[0].title()).toBe('sticker1');
    expect(wall.lanes()[1].stickers()[1].title()).toBe('sticker31');
    expect(wall.lanes()[1].stickers()[2].title()).toBe('sticker2');
    expect(wall.lanes()[1].stickers()[0].body()).toBe('body13');

    wall.pullUpdate();
    expect(ajaxOptions.url).toBe('/stickers?lastModified=2013-01-13T08:22:02.033Z');
  });
});
