/**

Used Packages:
    remove autopublish,
    add ian:bootstrap-3,
    add iron:router,
    add ian:accounts-ui-bootstrap-3,
    add sacha:spin,
    add accounts-password,
    add dbarrett:dropzonejs
    ? meteorhacks:kadira
*/

FuncProvider = {
    // проверяем что userId на самом деле автор данного документа
    ownsDocument: function (userId, doc) {
        return doc && doc.userId === userId;
    },
    requireLogin: function () {
        if (!Meteor.user()) {
            if (Meteor.loggingIn()) {
                this.render(this.loadingTemplate);
            } else {
                this.render('accessDenied');
            }
        } else {
            this.next();
        }
    },
    ownObject: function () {
        return this.userId == Meteor.userId();
    },
    realtyAdvertTypes: function () {
        return [
            {_id: " ", title: " "},
            {_id: "sell", title: "Продам"},
            {_id: "rent", title: "Cдам"},
            {_id: "irent", title: "Сниму"},
            {_id: "buy", title: "Куплю"}
        ]
    },
    realtyRooms: function(){
        return [
            {_id: " ", title: " "},
            {_id: "1", title: "1"},
            {_id: "2", title: "2"},
            {_id: "3", title: "3"},
            {_id: "4+", title: "4+"}
        ]
    },
    realtyType:function(){
         return [ 
                  {_id:" ",title:" "},
                  {_id:"apartment",title:"Квартира, комната"},
                  {_id:"house",title:"Дома дачи котеджи"},
                  {_id:"parcel",title:"Земельные участки"},
                  {_id:"garage",title:"Гаражи и машиноместа"},
                  {_id:"business",title:"Коммерческая"},
                  {_id:"foreign",title:"За рубежом"}
        ];
    },
    selectedOption: function (parent) {
        return (this._id === parent) ? 'selected' : '';
    },
    realtyPopulate: function (e) {
        return  {            
            text: $(e.target).find('[name=text]').val(),
            name: $(e.target).find('[name=name]').val(),
            cityId: $(e.target).find('[name=cityId]').val(),
            age: $(e.target).find('[name=age]').val(),
            floor:$(e.target).find('[name=floor]').val(),
            floorCount:$(e.target).find('[name=floorCount]').val(),
            rentTime:$(e.target).find('[name=rentTime]').val(),
            houseType:$(e.target).find('[name=houseType]').val(),
            distanceToCity:$(e.target).find('[name=distanceToCity]').val(),
            plotArea:$(e.target).find('[name=plotArea]').val(),
            location:$(e.target).find('[name=location]').val(),
            landСategory:$(e.target).find('[name=landСategory]').val(),
            garageType:$(e.target).find('[name=garageType]').val(),
            businessType:$(e.target).find('[name=businessType]').val(),
            foreignType:$(e.target).find('[name=foreignType]').val(),
            countryId:$(e.target).find('[name=countryId]').val(),
            phone: $(e.target).find('[name=phone]').val(),
            realtyType: $(e.target).find('[name=realtyType]').val(),
            realtyAdvertType: $(e.target).find('[name=realtyAdvertType]').val(),
            address: $(e.target).find('[name=address]').val(),
            area: $(e.target).find('[name=area]').val(),
            roomsId: $(e.target).find('[name=roomsId]').val(),
            price: $(e.target).find('[name=price]').val(),
            video: $(e.target).find('[name=video]').val()
        };
    },

    saveRealtyImages: function (file, realtyId) {
      saveImgId = null;  
      if (file) {
            var meteoruser = Meteor.userId();
            var reader = new FileReader();
            reader.onload = function (e) {
              var countImages = Images.find({realtyId:realtyId}).count()
              if(countImages<5 && file.size<1048576){
                   saveImgId = Images.insert({src: e.target.result, userId: meteoruser, date: new Date(), realtyId: realtyId});
              }
            };
            reader.readAsDataURL(file);
        }
        return saveImgId;
    },
    visibleRealtyFormOptions: function(){
        var rt = Session.get('realtyTypeForm');
        var at = Session.get('advertTypeForm');
        if(rt==="undefined") { rt = ''; }
        if(at==="undefined") { at = ''; }
        
        var currentState = rt+at;
        var arrManipulateIds = [
          {id:"countryIdBlock",visible:["foreignsell","foreignrent","foreignirent","foreignbuy"]},
          {id:"addressBlock",visible:["apartmentsell","apartmentrent","businesssell","businessrent"]},
          {id:"ageBlock",visible:["apartmentsell"]},
          {id:"floorBlock",visible:["apartmentsell","apartmentrent"]},
          {id:"floorCountBlock",visible:["apartmentsell","apartmentrent","housesell","houserent"]},
          {id:"rentTimeBlock",visible:["apartmentrent","apartmentirent","foreignrent","foreignirent",
                                       "houserent","houseirent","businessbuy"]},
          {id:"plotAreaBlock",visible:["housesell","houserent","parcelsell","parcelrent"]},
          {id:"houseTypeBlock",visible:["housesell","houserent","housebuy","houseirent"]},
          {id:"distanceToCityBlock",visible:["housesell","houserent","parcelsell","parcelrent"]},          
          {id:"locationBlock",visible:["housebuy","houseirent","parcelirent","parcelbuy"]},
          {id:"landСategoryBlock",visible:["parcelsell","parcelrent","parcelirent","parcelbuy"]},
          {id:"garageTypeBlock",visible:["garagesell","garagerent","garageirent","garagebuy"]},
          {id:"businessTypeBlock",visible:["businesssell","businessrent","businessirent","businessbuy"]},
          {id:"foreignTypeBlock",visible:["foreignsell","foreignrent","foreignirent","foreignbuy"]},
          {id:"roomsIdBlock",visible:["apartmentsell","apartmentrent","apartmentirent","apartmentbuy"]},
          {id:"areaBlock",visible:[
            "apartmentsell","apartmentrent","businesssell",
            "housesell","houserent","businessrent","businessbuy",
            "garagesell","garagerent"]},
        ];
         
        function in_array(what, where) {
            for(var i=0; i<where.length; i++)
                if(what == where[i])
                    return true;
            return false;
        }
        
        arrManipulateIds.map(function(item){  
            if(in_array(currentState,item.visible)){
//                 console.log($("#"+item.id));
                $("#"+item.id).css("display","block");   
            } else {  
//                console.log($("#"+item.id));
                $("#"+item.id).css("display","none"); 
            }      
        }); 
    }
};


////// COLLECTIONS  //////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////
City = new Meteor.Collection('city');
Country = new Meteor.Collection('country');
Images = new Meteor.Collection('images');
Images.allow({
    insert: function (userId, doc) {
        return Meteor.userId();
    },
    update: FuncProvider.ownsDocument,
    remove: FuncProvider.ownsDocument
});

Realty = new Meteor.Collection('realty');
Realty.allow({
    update: FuncProvider.ownsDocument,
    remove: FuncProvider.ownsDocument
});

Realty.deny({ 
    update: function (userId, realty, fieldNames) {
        // разрешаем редактировать только следующие три поля:
        return (_.without(fieldNames, 'text', 'name','foreignType','countryId',
                          'garageType','businessType',
                          'plotArea','location',
                          'houseType','distanceToCity','landСategory',
                          'cityId', 'address', 
                          'floor', 'floorCount', 'rentTime',
                          'area', 'age','roomsId', 'phone', 'realtyType',
                          'realtyAdvertType', 'price', 'video').length > 0);
    }
});

Meteor.methods({
    realtyInsert: function (realtyAttributes) {
        check(Meteor.userId(), String);
        check(realtyAttributes, {           
            text: String,
            name: String,
            cityId: String,
            age: String,
            floor: String,
            floorCount: String,
            rentTime:String,
            houseType:String,
            distanceToCity:String,
            plotArea:String,
            location:String,
            landСategory: String,
            businessType: String,
            garageType:String,
            foreignType: String,
            countryId: String,
            phone: String,
            realtyType: String,
            realtyAdvertType: String,
            address: String,
            area: String,
            roomsId: String,
            price: String,
            video: String
        });

        var realtyWithSameLink = Realty.findOne({text: realtyAttributes.text});
        if (realtyWithSameLink) {
            return {
                realtyExists: true,
                _id: realtyWithSameLink._id 
            }
        }
        var user = Meteor.user();
        var realty = _.extend(realtyAttributes, {
            userId: user._id,
            author: user.emails[0].address,
            submitted: new Date()
        });

        realtyId = Realty.insert(realty);
        return { _id: realtyId};
    }
});


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////SERVER///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
if (Meteor.isServer) {

//Kadira.connect('yPXMabmbd45TaK9k7', '7ba399a3-0cb2-4b2a-be73-88c32c8584ba');




////// PUBLICATIONS ///////////////////////////////////////////////////////////////////////////////// /////////////////////////////////////////////////////////////////////////////////////////////////////
Meteor.publish('realty', function () {
    return Realty.find();
});

Meteor.publish('images', function () {
    return Images.find();
});
Meteor.publish('city', function () {
    return City.find();
});
Meteor.publish('country', function () {
    return Country.find();
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


///// FIXTURES /////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
    
    if (City.find().count() === 0) {
      City.insert({title: ' '});
      City.insert({title: 'Москва'});
      City.insert({title: 'Санкт-Петербург'});
    }
  
   if (Country.find().count() === 0) {
      Country.insert({title: ' '});
      Country.insert({title: 'Россия'});
      Country.insert({title: 'Не Россия'});
    }
}/////// END SERVER /////////////////////////////////////////////////////////////////


//CLIENT/////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
if (Meteor.isClient) {







///////////// ROUTER /////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
    Router.configure({
        layoutTemplate: 'layout',
        loadingTemplate: 'loading',
        waitOn: function () {
            return [
                Meteor.subscribe('realty'),
                Meteor.subscribe('images'),
                Meteor.subscribe('city'),
                Meteor.subscribe('country'),
            ];
        }
    });

    Router.map(function () {

        this.route('realtyList', {
              path: '/',
              onBeforeAction: function (pause) {                 
                    this.render('loading'); 
                    this.next();
              }
        }); 
        this.route('realtyPage', {
            path: '/realty/:_id',
            data: function () {
                return Realty.findOne(this.params._id);
            },
            onBeforeAction: function (pause) {                 
              this.render('loading'); 
              this.next();
            }
        });
        this.route('/submit', {name: 'realtySubmit'});
        this.route('realtyEdit', {
            path: '/realty/:_id/edit',
            data: function () {
                return Realty.findOne(this.params._id);
            },
        });
        this.route('addImages',{
              path:"/addImages/:_id",
              data: function(){
                return Realty.findOne(this.params._id);
            },
        });

    });

    Router.onBeforeAction(FuncProvider.requireLogin, {only: 'realtySubmit'});
    Router.onBeforeAction('loading');

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////


/////// TEMPLATES ///////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////

    Template.realtyItem.helpers({
        ownPost: FuncProvider.ownObject,
        realtyType: FuncProvider.realtyType,
        images: function () {
              var i = 0
              var Img = Images.find({realtyId: this._id}).map(function(a){ a.id=i++; a.active = ""; return a; });
              Img[0].active = "active";
              return Img;
        },
        htmlvideo: function () {
            return this.video;
        },
        isList: function () {
            return Router.current().route.getName() !== 'realtyList';
        }
    });
              
  

    Template.realtyItem.events({
        'click #delete-realty': function (e) {
            e.preventDefault();
            if (confirm("Вы уверены что хотите удалить?")) {
                Realty.remove(this._id);
                Images.remove({realtyId: this._id});
            }
        }
    });

    Template.realtyList.helpers({
        realty: function () {
            return Realty.find({}, {sort: {submitted: -1}});
        }
    });

    Template.realtyForm.helpers({      
        cityAll: function(){
            return City.find();
        },        
    });
  
    Template.realtyFormOptions.helpers({
        realtyRooms: FuncProvider.realtyRooms,
        ageAll: [{_id:" ",title: " "},{_id:"new",title: "Новое жилье"},{_id:"old",title: "Вторичное жилье"}],
        floorAll: function(){
            var floor = [{_id : " ",title: " "}];
            for(i=1;i<101;i++){
              floor.push({_id:"floor"+i,title:i});
            }
            return floor;
        },
        floorCountAll:function(){
          var floorCount = [{_id : " ",title : " "}];
            for(i=1;i<101;i++){
              floorCount.push({_id:"floorCount"+i,title:i});
            }
            return floorCount;
        },
        countryAll: function(){
            return Country.find();
        }, 
        rentTimeAll:[{_id:" ",title:" "},{_id:"hours",title:"Почасовая"},{_id:"month",title:"Помесячная"},{_id:"long",title:"Надолго"}],
        houseTypeAll:[{_id:" ",title:" "},{_id:"house",title:"Дом"},{_id:"cottage",title:"Котедж"},{_id:"townhouse",title:"Таунхаус"}],
        locationAll:[{_id:" ",title:" "},{_id:"inCity",title:"В городе"},{_id:"outCity",title:"За городом"}],
        landСategoryAll:[{_id:" ",title:" "},{_id:"sh",title:"C/Х земли"},{_id:"colony",title:"Земли поселений"}],
        garageTypeAll:[{_id:" ",title:" "},{_id:"garage",title:"Гараж"},{_id:"carplace",title:"Машиноместо"}],
        businessTypeAll:[{_id:" ",title:" "},{_id:"shop",title:"Магазин"},{_id:"storage",title:"Склад"}],
        foreignTypeAll:[{_id:" ",title:" "},{_id:"house",title:"Дом"},{_id:"willage",title:"Вилла"}],
    });
  
    Template.realtyFormOptions.rendered = function(){
        var rt = Session.get('realtyTypeForm');
        var at = Session.get('advertTypeForm');
    };

    Template.realtyForm.events({
      'click #some':function(e,template){     
        e.preventDefault();
      }
    });
  
    Template.advertType.events({
      'click label':function(e,template){  
        e.preventDefault();
        var id = $(e.target).find('input').attr('id');
        Session.set('advertTypeForm',id);
        $("input#realtyAdvertType").val(id);
        FuncProvider.visibleRealtyFormOptions();
      }
    });

    Template.realtyTypeOptions.events({
      'click label':function(e,template){     
        e.preventDefault();
        var id = $(e.target).find('input').attr('id');
        Session.set('realtyTypeForm',id); 
        $("input#realtyType").val(id);
        FuncProvider.visibleRealtyFormOptions();
      }
    });

    Template.realtyTypeOptions.rendered = function(){
        
    };

    Template.advertType.rendered = function(){
        
    };

    Template.optionRooms.helpers({
        selected: FuncProvider.selectedOption
    });  
    Template.optionCity.helpers({
        selected: FuncProvider.selectedOption
    });
    Template.optionCountry.helpers({
        selected: FuncProvider.selectedOption
    });
    Template.optionAge.helpers({
        selected: FuncProvider.selectedOption
    });
    Template.optionFloor.helpers({
        selected: FuncProvider.selectedOption
    });
    Template.optionFloorCount.helpers({
        selected: FuncProvider.selectedOption
    });
    Template.optionRentTime.helpers({
        selected: FuncProvider.selectedOption
    });
    Template.optionHouseType.helpers({
        selected: FuncProvider.selectedOption
    });
    Template.optionLocation.helpers({
        selected: FuncProvider.selectedOption
    });
    Template.optionLandСategory.helpers({
        selected: FuncProvider.selectedOption
    });
    Template.optionGarageType.helpers({
        selected: FuncProvider.selectedOption
    });
    Template.optionBusinessType.helpers({
        selected: FuncProvider.selectedOption
    });
    
          
    Template.optionForeignType.helpers({
        selected: FuncProvider.selectedOption
    });

    Template.realtySubmit.events({
        'submit form': function (e, template) {
            e.preventDefault();
            
            var realty = FuncProvider.realtyPopulate(e);

            Meteor.call('realtyInsert', realty, function (error, result) {
                // отобразить ошибку пользователю и прерваться
                if (error)
                    return alert(error.reason);

                // show this result but route anyway
                if (result.realtyExists)
                    alert('This link has already been realty');

//                 var file = template.find('#realtyfileinput').files[0];
//                 FuncProvider.saveRealtyImages(file, result._id);

//                 Router.go('realtyPage', {_id: result._id});
                 Router.go('addImages', {_id: result._id});
            });
        }
    });

    Template.realtySubmit.rendered = function(){
         Session.set('realtyTypeForm',"");
         Session.set('advertTypeForm',"");
    };

    Template.realtyEdit.events({
        'submit form': function (e, template) {
            e.preventDefault();

            var currentRealtyId = this._id;
            var realtyProperties = FuncProvider.realtyPopulate(e);

//             var file = template.find('#realtyfileinput').files[0];
//             FuncProvider.saveRealtyImages(file, currentRealtyId);

            Realty.update(currentRealtyId, {$set: realtyProperties}, function (error) {
                if (error) {
                    alert(error.reason);
                } else {
//                     Router.go('realtyPage', {_id: currentRealtyId});
                    Router.go('addImages', {_id: currentRealtyId});
                }
            });
        }
    });

    Template.realtyEdit.rendered = function(){ 
        Session.set('advertTypeForm',this.data.realtyAdvertType);
        Session.set('realtyTypeForm',this.data.realtyType); 
//       console.log(this.data.realtyAdvertType);
//       console.log(this.data.realtyType);
        $("input#"+this.data.realtyType).parent().click();
        $("input#"+this.data.realtyAdvertType).parent().click(); 
    };
          
    Template.addImages.events({
        'click #next-button': function (e, template) {
            e.preventDefault();
            Router.go('realtyPage', {_id: this._id});
        }
      
    });

    Template.addImages.helpers({
        images: function(){
          return Images.find({realtyId:this._id});
        }
    });
          
    Template.addImages.rendered = function(){
      
        var realtyId = this.data._id;
        var countImages = Images.find({realtyId:realtyId}).count();
        var arrayOfImageIds = [];
        Dropzone.autoDiscover = false;
        Dropzone.createImageThumbnails = true;
        var dropzone = new Dropzone("form#dropzone", {
                acceptedFiles: ".jpeg,.jpg,.png,.gif,.JPEG,.JPG,.PNG,.GIF",
                dictDefaultMessage: "Добавьте изображение",
                dictFileTooBig: "Файл слишком большой",
                dictMaxFilesExceeded: "Вы можете ддобавить не более 5 изображений",
                dictRemoveFile:"Удалить",
                dictCancelUpload:"Отмена",
                clickable: true,
                maxFiles: 5,
                enqueueForUpload: true,
                maxFilesize: 1,
                uploadMultiple: false, 
                addRemoveLinks: true,
                init: function() {
                                 
                  this.on("uploadprogress", function(file,progress,totalBytes) {
//                     console.log("File progress", progress);
                    if(progress===100){
                      //$("#next-button").fadeIn(1000);
                      this.removeFile(file);
//                        console.log("All progress");
//                       console.log(arrayOfImageIds);
                    }
                  });
                  this.on("queuecomplete",function(files){
//                     console.log(files);
//                     $("#next-button").fadeIn(1000);
                    
                  });
                  this.on("addedfile",function(file){
                      FuncProvider.saveRealtyImages(file, realtyId);                   
                  });
                  this.on("removedfile", function(file) {
//                      
                  });
                },
                maxfilesexceeded: function(file) {
                    this.removeFile(file);
                },
//                 accept: function(file, done){
//                     var id = FuncProvider.saveRealtyImages(file, realtyId);
//                     console.log(id);
//                     arrayOfImageIds[file.name] = id;
//                     done();
//                 }
        });
    }
    
   Template.editImages.events({
     'click #delete-edit-images':function(){
       Images.remove(this._id);
     }
   });

    Deps.autorun(function () {
      var connected = Meteor.status().connected;     
      Session.set("connected", connected);
    });
    

    Template.connection_tpl.helpers({
      connection_status:function () {
          return Session.get("connected") ? true : false;
      }
    });

}///// END CLIENT //////////////////////////
