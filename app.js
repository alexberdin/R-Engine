/** 

Used Packages:
    remove autopublish,
    add ian:bootstrap-3,
    add iron:router, multiply:iron-router-progress
    add ian:accounts-ui-bootstrap-3,
    add sacha:spin,
    add accounts-password,
    add dbarrett:dropzonejs
    ? meteorhacks:kadira
    add aldeed:autoform
    add aldeed:collection2
    add natestrauser:select2 
    add zimme:select2-bootstrap3-css
    add aldeed:autoform-select2
    add ongoworks:security
    add meteorhacks:fast-render
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
    realtyRooms: [
       {value: "1", label: "1"},
       {value: "2", label: "2"},
       {value: "3", label: "3"},
       {value: "4+", label: "4+"}
    ],
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
    ageAll: [ 
       {value:"new",label: "Новое жилье"},
       {value:"old",label: "Вторичное жилье"}
    ],
    floorAll: function(){
      var floor = [];
      for(i=1;i<101;i++){
        floor.push({value:"floor"+i,label:i});
      }
      return floor;
    },
    floorCountAll:function(){
      var floorCount = [];
      for(i=1;i<101;i++){
        floorCount.push({value:"floorCount"+i,label:i});
      }
      return floorCount;
    },
    countryAll: function(){
      return Country.find();
    }, 
    rentTimeAll:[
      {value:"hours",label:"Почасовая"},
      {value:"month",label:"Помесячная"},
      {value:"long",label:"Надолго"}
    ],
    houseTypeAll:[
      {value:"house",label:"Дом"},
      {value:"cottage",label:"Котедж"},
      {value:"townhouse",label:"Таунхаус"}
    ],
    locationAll:[
      {value:"inCity",label:"В городе"},
      {value:"outCity",label:"За городом"}
    ],
    landСategoryAll:[
      {value:"sh",label:"C/Х земли"},
      {value:"colony",label:"Земли поселений"}
    ],
    garageTypeAll:[
      {value:"garage",label:"Гараж"},
      {value:"carplace",label:"Машиноместо"}
    ],
    businessTypeAll:[
      {value:"shop",label:"Магазин"},
      {value:"storage",label:"Склад"}
    ],
    foreignTypeAll:[
      {value:"house",label:"Дом"},
      {value:"willage",label:"Вилла"}
    ],
    realtyPopulate: function (e) {
        var formData = e.target;
        return  {            
            text: formData.text.value,
            name: formData.name.value,
            cityId: formData.cityId.value,
            age: formData.age.value,
            floor:formData.floor.value,
            floorCount:formData.floorCount.value,
            rentTime:formData.rentTime.value,
            houseType:formData.houseType.value,
            distanceToCity:formData.distanceToCity.value,
            plotArea:formData.plotArea.value,
            location:formData.location.value,
            landСategory:formData.landСategory.value,
            garageType:formData.garageType.value,
            businessType:formData.businessType.value,
            foreignType:formData.foreignType.value,
            countryId:formData.countryId.value,
            phone: formData.phone.value,
            realtyType: formData.realtyType.value,
            realtyAdvertType: formData.realtyAdvertType.value,
            address:formData.address.value,
            area: formData.area.value,
            roomsId: formData.roomsId.value,
            price: formData.price.value,
            video: formData.video.value,
        };
    },
    options:function(CollName){
        var options = [];
        CollName.find().map(function(item){
           options.push({label:item.label,value:item.value});
        });
        return options;
    },
    saveRealtyImages: function (file, realtyId) {
      if (file) {
            var meteoruser = Meteor.userId();
            var reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function (e) {
              var countImages = Images.find({realtyId:realtyId}).count()
              if(countImages<5 && file.size<1048576){ // 1 mb
                   Images.insert({src: e.target.result, userId: meteoruser, date: new Date(), realtyId: realtyId});
              }
           };            
        }
    },
    visibleRealtyFormOptions: function(){
        var rt = Session.get('realtyTypeForm');
        var at = Session.get('advertTypeForm');
        if(rt==="undefined") { rt = ''; }
        if(at==="undefined") { at = ''; }
        
        var currentState = rt+at;
        var arrManipulateIds = [
          {id:"countryIdBlock",visible:[
            "foreignsell",
            "foreignrent",
            "foreignirent",
            "foreignbuy"
          ]},
          {id:"addressBlock",visible:[
            "apartmentsell",
            "apartmentrent",
            "businesssell",
            "businessrent"
          ]},
          {id:"ageBlock",visible:[
            "apartmentsell"
          ]},
          {id:"floorBlock",visible:[
            "apartmentsell",
            "apartmentrent"
          ]},
          {id:"floorCountBlock",visible:[
            "apartmentsell",
            "apartmentrent",
            "housesell",
            "houserent"
          ]},
          {id:"rentTimeBlock",visible:[
            "apartmentrent",
            "apartmentirent",
            "foreignrent",
            "foreignirent",
            "houserent",
            "houseirent",
            "businessbuy"
          ]},
          {id:"plotAreaBlock",visible:[
            "housesell",
            "houserent",
            "parcelsell",
            "parcelrent"
          ]},
          {id:"houseTypeBlock",visible:[
            "housesell",
            "houserent",
            "housebuy",
            "houseirent"
          ]},
          {id:"distanceToCityBlock",visible:[
            "housesell",
            "houserent",
            "parcelsell",
            "parcelrent"
          ]},          
          {id:"locationBlock",visible:[
            "housebuy",
            "houseirent",
            "parcelirent",
            "parcelbuy"
          ]},
          {id:"landСategoryBlock",visible:[
            "parcelsell",
            "parcelrent",
            "parcelirent",
            "parcelbuy"
          ]},
          {id:"garageTypeBlock",visible:[
            "garagesell",
            "garagerent",
            "garageirent",
            "garagebuy"
          ]},
          {id:"businessTypeBlock",visible:[
            "businesssell",
            "businessrent",
            "businessirent",
            "businessbuy"
          ]},
          {id:"foreignTypeBlock",visible:[
            "foreignsell",
            "foreignrent",
            "foreignirent",
            "foreignbuy"
          ]},
          {id:"roomsIdBlock",visible:[
            "apartmentsell",
            "apartmentrent",
            "apartmentirent",
            "apartmentbuy"
          ]},
          {id:"areaBlock",visible:[
            "apartmentsell",
            "apartmentrent",
            "businesssell",
            "housesell",
            "houserent",
            "businessrent",
            "businessbuy",
            "garagesell",
            "garagerent"
          ]},
        ];
                
        arrManipulateIds.map(function(item){  
            if(FuncProvider.inArray(currentState,item.visible)){
                $("#"+item.id).css("display","block");                   
            } else {  
                $("#"+item.id).css("display","none"); 
            }      
        }); 
    },
    inArray: function(what, where) {
            for(var i=0; i<where.length; i++)
                if(what == where[i])
                    return true;
            return false;
    }
};


////// COLLECTIONS  //////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////
City = new Meteor.Collection('city');
Country = new Meteor.Collection('country');
Images = new Meteor.Collection('images');
Realty = new Meteor.Collection('realty');

NR = new Meteor.Collection('NR');
NR.attachSchema(new SimpleSchema({
  
  text: {
    type: String,
    label: "Общее описание:",
    max: 200,
    optional: true,
  },
  name: {
    type: String,
    label: "Ваше имя:",
    max: 200,
    optional: true,
  },
  cityId: {
    label: "Город:",
    type: String,
    optional: true,
    autoform: {
      type: "select",
      firstOption: "(Выберите город)",
      options: function () {        
        return FuncProvider.options(City);
      } 
    }
  },
  age: {
    type: String,
    max: 200,
    optional: true,
    autoform: {
      label: "Тип (возраст):", 
      type: "select",
      firstOption: "(Выберите тип)",
      options: function () {        
        return FuncProvider.ageAll;
      } 
    }
  },
  floor:{
    type: String,
    label: "Этаж:",
    optional: true,
    autoform: {
      type: "select",
      firstOption: "(Выберите этаж)",
      options: function () {        
        return FuncProvider.floorAll();
      }
    }
  },
  floorCount:{
    type: String,
    label: "Этажей:",
    max: 200,
    optional: true,
    autoform: {
      type: "select",
      firstOption: "(Выберите этаж)",
      options: function () {        
        return FuncProvider.floorCountAll();
      }
    }
  },
  rentTime:{
    type: String,
    label: "Тип аренды:",
    max: 200,
    optional: true,
    autoform: {
      type: "select",
      firstOption: "(Выберите этаж)",
      options: function () {        
        return FuncProvider.rentTimeAll;
      }
    }
  },
  houseType:{
    type: String,
    label: "Тип (дома):",
    max: 200,
    optional: true,
    autoform: {
      type: "select",
      firstOption: "(Выберите тип)",
      options: function () {        
        return FuncProvider.houseTypeAll;
      }
    }
  },
  distanceToCity:{
    type: String,
    label: "Расстояние до города:",
    max: 200,
    optional: true,
  },
  plotArea:{
    type: String,
    label: "Площадь участка:",
    max: 200,
    optional: true,
  },
  location:{
    type: String,
    label: "Местонахождение:",
    max: 200,
    optional: true,
    autoform: {
      type: "select",
      firstOption: "(Выберите местонахождение)",
      options: function () {        
        return FuncProvider.locationAll;
      }
    }
  },
  landСategory:{
    type: String,
    label: "Категория земель:",
    max: 200,
    optional: true,
    autoform: {
      type: "select",
      firstOption: "(Выберите категорию земель)",
      options: function () {        
        return FuncProvider.landСategoryAll;
      }
    }
  },
  garageType:{
    type: String,
    label: "Тип (гараж):",
    max: 200,
    optional: true,
    autoform: {
      type: "select",
      firstOption: "(Выберите тип)",
      options: function () {        
        return FuncProvider.garageTypeAll;
      }
    }
  },
  businessType:{
    type: String,
    label: "Тип (коммерческий):",
    max: 200,
    optional: true,
    autoform: {
      type: "select",
      firstOption: "(Выберите тип)",
      options: function () {        
        return FuncProvider.businessTypeAll;
      }
    }
  },
  foreignType:{
    type: String,
    label: "Тип (зарубежная):",
    max: 200,
    optional: true,
    autoform: {
      type: "select",
      firstOption: "(Выберите тип)",
      options: function () {        
        return FuncProvider.foreignTypeAll;
      }
    }
  },
  countryId:{
    type: String,
    label: "Страна:",
    max: 200,
    optional: true,
    autoform: {
      type: "select",
      firstOption: "(Выберите страну)",
      options: function () {        
        return FuncProvider.options(Country);
      }
    }
  },
  phone: {
    type: String,
    label: "Телефон:",
    max: 200,
    optional: true,
  },
  realtyType: {
    type: String,
    label: "Тип недвижимости:",
    max: 200,
    optional: true,
    autoform: {
      id:'realtyType'
    }
  },
  realtyAdvertType:{
    type: String,
    label: "Тип продажи:",
    max: 200,
    optional: true,
    autoform: {
      id:'realtyAdvertType'
    }
  },
  address:{
    type: String,
    label: "Адрес:",
    max: 200,
    optional: true,
  },
  area: {
    type: String,
    label: "Площадь:",
    max: 200,
    optional: true,
  },
  roomsId: {
    type: String,
    label: "Комнат:",
    max: 200,
    optional: true,
    autoform: {
      type: "select",
      firstOption: "(Выберите количество комнат)",
      options: function () {        
        return FuncProvider.realtyRooms; 
      }
    }
  },
  price: {
    type: String,
    label: "Цена:",
    max: 200,
    optional: true,
  },
  video: {
    type: String,
    label: "Видео:",
    max: 200,
    optional: true,
  },
}));

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

        var user = Meteor.user();
        var realty = _.extend(realtyAttributes, {
            userId: user._id,
            author: user.emails[0].address,
            submitted: new Date()
        });

        realtyId = Realty.insert(realty);
        return { _id: realtyId};
    },
});


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////SERVER///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
if (Meteor.isServer) {

//Kadira.connect('yPXMabmbd45TaK9k7', '7ba399a3-0cb2-4b2a-be73-88c32c8584ba'); // debug app

////// PERMISSIONS ///////////////////////
Security.permit(['insert', 'update', 'remove']).collections(
  [NR,City,Country,Images,Realty]
).apply();

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
Meteor.publish('NR', function(options) {
  return NR.find({}, options);
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


   


///// FIXTURES /////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
  
    if (NR.find().count() < 50) {
      for (i=0;i<50;i++) {
          NR.insert({text: 'Текст '+i});
      }
    }
  
    if (City.find().count() === 0) {
      City.insert({label: 'Москва',value: 'Москва'});
      City.insert({label: 'Санкт-Петербург',value: 'Санкт-Петербург'});
      City.insert({label: 'Екатеринбург',value: 'Екатеринбург'});
    }
  
   if (Country.find().count() === 0) {
      Country.insert({label: 'Россия',value: 'Россия'});
      Country.insert({label: 'Казахстан',value: 'Казахстан'});
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
//                 Meteor.subscribe('NR'),
            ];
        },
        fastRender: true,
    });
              
    NRListController = RouteController.extend({
        template: 'nrList',
        increment: 25,
        limit: function() {
          return parseInt(this.params.nrLimit) || this.increment;
        },
        findOptions: function() {
          return {limit: this.limit()};
        },
        onBeforeAction: function() {
            this.NRSub = Meteor.subscribe('NR', this.findOptions());
            this.next();
        },
        NR: function() {
          return NR.find({}, this.findOptions());
        },
        data: function() {
            var hasMore = this.NR().fetch().length === this.limit();
            var nextPath = this.route.path({nrLimit: this.limit() + this.increment});
            return {
              NR: this.NR(),
              ready: this.NRSub,
              nextPath: hasMore ? nextPath : null
            };
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
            },
            fastRender: true, 
        });
        this.route('/submit', {name: 'realtySubmit'});
        this.route('updateNR', {
            path: '/realty/:_id/edit',
            data: function () {
              Meteor.subscribe('NR');
//                 return Realty.findOne(this.params._id);
              return NR.findOne(this.params._id);
                
            },
            disableProgress: true
        });
        this.route('addImages',{
              path:"/addImages/:_id",
              data: function(){
                  Meteor.subscribe('NR');
//                 return Realty.findOne(this.params._id);
                return NR.findOne(this.params._id);
            },
            disableProgress: true
        });
        this.route('insertNR',{
              path:"/nrPanel"
        });
        this.route('nrList',{
              path:"/nrList/:nrLimit?",             
              controller: NRListController
        });
              
    });

    Router.onBeforeAction(FuncProvider.requireLogin, {only: 'realtySubmit'});
    Router.onBeforeAction('loading');

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////

  
/////// TEMPLATES ///////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////

              
    Template.nrList.helpers({
        NR:function(){
           return NR.find({});
        },
     });
              
                          
              
              
    Template.realtyItem.helpers({
        ownPost: true,//FuncProvider.ownObject,
        realtyType: FuncProvider.realtyType,
        images: function () {
              var i = 0
              var Img = Images.find({realtyId: this._id}).map(function(a){ a.id=i++; a.active = null; return a; });
              if(Img){
                  Img[0].active = "active";
              }
              return Img || null;
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
//                 Realty.remove(this._id);
              NR.remove(this._id);
                Images.remove({realtyId: this._id});
            }
        }
    });

    Template.realtyList.helpers({
        realty: function () {
            return NR.find({}, {sort: {submitted: -1}});
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
                 Router.go('addImages', {_id: result._id});
            });
        }
    });

    Template.realtySubmit.rendered = function(){
         Session.set('realtyTypeForm',"");
         Session.set('advertTypeForm',"");
    };

    Template.realtyEdit.events({
//         'submit form': function (e, template) {
//             e.preventDefault();

//             var currentRealtyId = this._id;
//             var realtyProperties = FuncProvider.realtyPopulate(e);
//             Realty.update(currentRealtyId, {$set: realtyProperties}, function (error) {
//                 if (error) {
//                     alert(error.reason);
//                 } else {
//                     Router.go('addImages', {_id: currentRealtyId});
//                 }
//             });
//         }
    });

//     Template.realtyEdit.rendered = function(){ 
    Template.insertNR.rendered = function(){ 
        Session.set('realtyTypeForm',"");
        Session.set('advertTypeForm',"");
    };
    
    Template.updateNR.rendered = function(){ 
        Session.set('advertTypeForm',this.data.realtyAdvertType);
        Session.set('realtyTypeForm',this.data.realtyType); 
        $("input#"+this.data.realtyType).parent().click();
        $("input#"+this.data.realtyAdvertType).parent().click(); 
    };
          
    Template.addImages.events({
        'click #next-button': function (e, template) {
            e.preventDefault();
//             Router.go('realtyPage', {_id: this._id});
              Router.go('nrList');
        }
      
    });

    Template.addImages.helpers({
        images: function(){
          return Images.find({realtyId:this._id});
        }
    });
          
    Template.addImages.rendered = function(){
        
         console.log(this.data);
        var realtyId = this.data._id;
        var countImages = Images.find({realtyId:realtyId}).count();
        var arrayOfImageIds = [];
        Dropzone.autoDiscover = false;
        Dropzone.createImageThumbnails = true;
        var dropzone = new Dropzone("form#dropzone", {
                acceptedFiles: ".jpeg,.jpg,.png,.gif,.JPEG,.JPG,.PNG,.GIF",
                dictDefaultMessage: "Добавьте изображение",
                dictFileTooBig: "Файл слишком большой",
                dictMaxFilesExceeded: "Вы можете добавить не более 5 изображений",
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
                    if(progress===100){
                      this.removeFile(file);
                    }
                  });
                  this.on("addedfile",function(file){
                      FuncProvider.saveRealtyImages(file, realtyId);                   
                  });
                },
                maxfilesexceeded: function(file) {
                    this.removeFile(file);
                },
        });
    }
    
   Template.editImages.events({
     'click #delete-edit-images':function(){
       Images.remove(this._id);
     }
   });

  
    Template.insertNR.helpers({
        typeForm: 'insert',
//             typeForm: 'update',
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
  
  
  
  
  
  
  
AutoForm.addHooks(['insertNR','updateNR'], {
    after: {
      insert: function(error, result) {
        if (error) {
          console.log("Insert Error:", error);
        } else {
//           console.log("Insert Result:", result);
             Router.go('addImages', {_id: result});
        }
      },
      update: function(error,result,temp) {
        if (error) {
          console.log("Update Error:", error);             
        } else {
//           console.log("Update Result",error,result,temp);
             Router.go('addImages', {_id: temp.data.doc._id});
        }
      }
    }
  });

  
  
  
  
//   Template.registerHelper("currentFieldValue", function () {
//       var valueIns = AutoForm.getFieldValue("insertBookForm", "year");
//       console.log(valueIns);
//       return valueIns=="2014";
//   });
  
  
  
  FuncProvider.visibleRealtyFormOptions();
  

}///// END CLIENT //////////////////////////
