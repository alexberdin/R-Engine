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
  userId: {
    type: String,
    label: "user id",
    max: 200,
    optional: true, // todo false 
  }
}));


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////SERVER///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
if (Meteor.isServer) {

//Kadira.connect('yPXMabmbd45TaK9k7', '7ba399a3-0cb2-4b2a-be73-88c32c8584ba'); // debug app

////// PERMISSIONS ///////////////////////
Security.permit(['insert', 'update', 'remove']).collections(
  [NR,City,Country,Images]
).apply();

////// PUBLICATIONS ///////////////////////////////////////////////////////////////////////////////// /////////////////////////////////////////////////////////////////////////////////////////////////////

Meteor.publish('images', function () {
    return Images.find();
});
Meteor.publish('city', function () {
    return City.find();
});
Meteor.publish('country', function () {
    return Country.find();
});
Meteor.publish('NR', function(options,find) {
   return NR.find(find, options);
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


   


///// FIXTURES /////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
  
    if (NR.find().count() < 5) {
      for (i=0;i<5;i++) {
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
                Meteor.subscribe('images'),
                Meteor.subscribe('city'),
                Meteor.subscribe('country'),
            ];
        },
        fastRender: true,
    });
              
    NRListController = RouteController.extend({
        template: 'nrList',
        increment: 2,
        limit: function() {
          return parseInt(this.params.nrLimit) || this.increment;
        },
        findOptions: function() {
          return {limit: this.limit()};
        },
        searchOptions:function () {
            return (Session.get('sellSearch') === true) ? {userId:Meteor.userId()} : {}; 
        },
        onBeforeAction: function() {
            this.NRSub = Meteor.subscribe('NR', this.findOptions(),this.searchOptions());
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
        this.route('updateNR', {
            path: '/realty/:_id/edit',
            data: function () {
              Meteor.subscribe('NR',{},{});
              return NR.findOne(this.params._id);
                
            },
            disableProgress: true
        });
        this.route('addImages',{
              path:"/addImages/:_id",
              waitOn: function () {
                  return [Meteor.subscribe('NR',{},{})];
              },
              data: function(){                 
                  return NR.findOne(this.params._id);                  
              },
              disableProgress: true
        });
        this.route('insertNR',{
              path:"/nrPanel"
        });
        this.route('nrList',{
              path:"/:nrLimit?",             
              controller: NRListController
        });
              
    });

//     Router.onBeforeAction(FuncProvider.requireLogin, {only: 'realtySubmit'});
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
                console.log(this._id);
                NR.remove(this._id);
                Images.remove({realtyId: this._id});
            }
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
              Router.go('nrList');
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
    
    Template.searchPanel.events({
        'click #lsellSearch':function (e,template){
            e.preventDefault();
            Session.set('sellSearch',true); 
            console.log('test');
        }
    });
    
    Template.editImages.events({
      'click #delete-edit-images':function(){
        Images.remove(this._id);
      }
    });
  
    Template.insertNR.helpers({
        typeForm: 'insert',
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
      before: {
          insert: function(doc, template) {
               console.log(doc);
               doc.userId = Meteor.userId();
               return doc;
          }
      },
      after: {
        insert: function(error, result) {
          if (error) {
              console.log("Insert Error:", error);
          } else {
               console.log(result); 
               Router.go('addImages', {_id: result});
          }
        },
        update: function(error,result,temp) {
          if (error) {
              console.log("Update Error:", error);             
          } else {
               console.log(temp.data.doc);
               Router.go('addImages', {_id: temp.data.doc._id});
          }
        }
      }
    }); 
  
  FuncProvider.visibleRealtyFormOptions();
  
}///// END CLIENT //////////////////////////
