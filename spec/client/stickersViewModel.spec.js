describe("stickersViewModel", function(){
  it("should load stickers to wall", function(){
    var wall = new stickers.Wall({statuses: ['new', 'done']});
    wall.load();
    expect(ajaxOptions.type).toEqual("GET");
    expect(ajaxOptions.url).toEqual("/stickers");
    expect(wall.lanes().length).toBe(2);
    expect(wall.lanes()[0].title()).toBe('new');
    expect(wall.lanes()[1].title()).toBe('done');

    var sticker1 = {status: 'done', title: 'sticker1', _id: '1'};
    var sticker2 = {status: 'new', title: 'sticker2', _id: '2'};
    var sticker3 = {status: 'done', title: 'sticker3', _id: '3'};
    var sticker4 = {status: 'notDefinedOnWall', title: 'sticker4', _id: '4'};//this one will be ignored
    var serverData = [sticker1, sticker2, sticker3, sticker4]

    ajaxOptions.success(serverData);//mimic calling back from server
    
    expect(wall.lanes()[0].stickers().length).toBe(1);
    expect(wall.lanes()[1].stickers().length).toBe(2);
    expect(wall.lanes()[0].stickers()[0].title()).toBe('sticker2');
    expect(wall.lanes()[1].stickers()[0].title()).toBe('sticker1');
    expect(wall.lanes()[1].stickers()[1].title()).toBe('sticker3');

    wall.lanes()[0].stickers()[0].status('done');//change status of sticker
    expect(wall.lanes()[0].stickers().length).toBe(0);
    expect(wall.lanes()[1].stickers().length).toBe(3);//should switch lanes

  }); 

  it("should add new sticker to the default lane", function(){
     var wall = new stickers.Wall({statuses: ['new', 'done']});
     wall.newSticker().title("hi");
     wall.createSticker();
     expect(wall.lanes()[0].stickers().length).toBe(1);
     expect(wall.lanes()[0].stickers()[0].title()).toBe('hi');
     expect(ajaxOptions.type).toEqual("POST");
     expect(ajaxOptions.url).toEqual("/sticker");
     expect(ajaxOptions.data).toBe('{"status":"new","title":"hi"}');

     ajaxOptions.success({_id: "1234"});

     expect(wall.lanes()[0].stickers()[0]._id()).toBe('1234');

  });

  it("should change status", function(){
    var wall = new stickers.Wall({statuses: ['new', 'done']});
    var sticker = new stickers.Sticker({status:'new', _id:'123'});
    wall.addToWall(sticker);
    expect(wall.lanes()[0].stickers().length).toBe(1);
    expect(wall.lanes()[1].stickers().length).toBe(0);

    spyOn(sticker, 'save');

    wall.changeStatus(sticker._id(), 'done');
    expect(wall.lanes()[0].stickers().length).toBe(0);
    expect(wall.lanes()[1].stickers().length).toBe(1);
    expect(sticker.status()).toBe('done');

    expect(sticker.save).toHaveBeenCalled();
  });
});
