(function(angular) {
	
	'use strict';

	var app = angular.module('app', ['ngRoute', 'LocalStorageModule']);
	
	app.config(function ($routeProvider, $locationProvider, localStorageServiceProvider) {
	
		$locationProvider.html5Mode(true).hashPrefix('!');
		
		$routeProvider
		.when('/', {
			templateUrl: '/app/template/index.tpl',
			controller: 'index_ctrl'
		})
		.when('/basket/', {
			templateUrl: '/app/template/basket.tpl',
			controller: 'basket_ctrl'
		})
		.otherwise({
			controller: '404_ctrl',
			template: '<div style="padding:15px;">Страница не найдена</div>',
		});
		
		localStorageServiceProvider.setPrefix('ang_shop');
		
	});
	
	app.run(function (basketFactory) {
		basketFactory.init();
	});
	
	app.controller('index_ctrl', function ($scope, pageFactory, annFactory, basketFactory) {
		
		$scope.ann_array = annFactory.getAll();
		pageFactory.set({title:'Главная', id: 'index'});
		
		$scope.addToBasket=function(id){
			basketFactory.addToBasket({id: id, qty:1});
			$scope.ann_array[id].in_basket = 1;
		}
		
	});
	
	app.controller('basket_ctrl', function ($scope, pageFactory, basketFactory) {

		pageFactory.set({title:'Корзина', id: 'basket'});
		
		$scope.basket = basketFactory.getBasket();
		
		$scope.clearBasket=function(){
			basketFactory.clearBasket()
		}
		
		$scope.deleteFromBasket=function(id){
			basketFactory.deleteFromBasket(id);
		}
		
	});
	
	app.controller('404_ctrl', function (pageFactory) {
		pageFactory.set({title:'Страница не найдена', id: 'page_404'});
	});
	
	app.controller('main_ctrl', function ($scope, pageFactory, basketFactory) {
		$scope.page = pageFactory;
	});
	
	app.filter("number_format", function () {
		return function (value) {
			return fn.numeric_format(value, ' ');
		};
	});
	
	app.directive('inputAmount', function(basketFactory) {	
		return {
			scope: {
				ann_id:'@annId',
				qty:'@qty',
			},
			template: '<input type="text" value="1" maxlength="2" ng-model="qty" ng-keydown="disableCharInput($event);" ng-keyup="checkUpdateBasketItem()" />',
			replace: true,
			controller: function($scope, $element){
				$scope.disableCharInput=function(event){
				
					if (
						event.keyCode && event.keyCode!=37 
						&&
						event.keyCode && event.keyCode!=39 
						&&
						event.keyCode && event.keyCode!=8 
						&&
						event.keyCode && event.keyCode!=46 
						&&
						(event.keyCode < 96 || event.keyCode > 105)
						&&
						(event.keyCode < 48 || event.keyCode > 57)
						)
					{
						event.preventDefault();
						return false;
					}
				}
				$scope.checkUpdateBasketItem=function(){
					
					var item=basketFactory.getBasketItem($scope.ann_id);

					if($scope.qty==''){
						$scope.qty = 1;
					}
					if($scope.qty==0){
						$scope.qty = item.qty;
					}
					if($scope.qty==item.qty){
						return;
					}
					$scope.updateBasketItem();
				}
				$scope.updateBasketItem=function(){
					basketFactory.updateBasketItem({id:$scope.ann_id, qty:$scope.qty});
				}
			}
		}
	});
	
	app.factory('pageFactory', function() {
		var data = {};
		data.title = 'CMS Shop';
		data.page_id = '';
		return {
			title: function() { 
				return data.title; 
			},
			id: function() { 
				return data.id; 
			},
			set: function(config) {
				data.title = config.title + ' | CMS Shop '; 
				data.id = config.id; 
			}
		};
	});
	
	app.factory('annFactory', function($injector){
	
		{// init
			var factory = {};
			var ann_array = {};
			ann_array[1] = {id: 1, name: 'Беговая дорожка - Classic AMMITY CLASSIC ATM 518 TFT', price: '84900'}
			ann_array[2] = {id: 2, name: 'Беговая дорожка - Classic AMMITY CLASSIC ATM 520 TFT', price: '99990'}
			ann_array[3] = {id: 3, name: 'Беговая дорожка - Classic AMMITY CLASSIC ATM 520 TFT W', price: '103990'}
			ann_array[4] = {id: 4, name: 'Беговая дорожка - Classic AMMITY CLASSIC ATM 522 TFT', price: '104990'}
			ann_array[5] = {id: 5, name: 'Беговая дорожка - Classic+ AMMITY CLASSIC+ ATM 720 TFT+', price: '114990'}
			ann_array[6] = {id: 6, name: 'Беговая дорожка - Classic+ AMMITY CLASSIC+ ATM 722 TFT+', price: '124990'}
			ann_array[7] = {id: 7, name: 'Эллиптический тренажёр - Aero AMMITY AERO AE 401', price: '39990'}
			ann_array[8] = {id: 8, name: 'Эллиптический тренажёр - Aero AMMITY AERO AE 402', price: '44990'}
			ann_array[9] = {id: 9, name: 'Эллиптический тренажёр - Aero AMMITY AERO AE 403', price: '49990'}
			ann_array[10] = {id: 10, name: 'Эллиптический тренажёр - Dream AMMITY DREAM DE 20', price: '69990'}
			ann_array[11] = {id: 11, name: 'Эллиптический тренажёр - Dream AMMITY DREAM DE 30', price: '74990'}
			ann_array[12] = {id: 12, name: 'Велотренажёр - Dream AMMITY DREAM DB 30', price: '37990'}
			ann_array[13] = {id: 13, name: 'Велотренажёр - Dream AMMITY DREAM DB 40', price: '41990'}
			ann_array[14] = {id: 14, name: 'Аксессуары - Accessoires AMMITY ACCESSOIRES BMACF-200', price: '2990'}
			ann_array[15] = {id: 15, name: 'Аксессуары - Accessoires AMMITY ACCESSOIRES Коврик AMMITY 2000', price: '2300'}
			ann_array[16] = {id: 16, name: 'Аксессуары - Accessoires AMMITY ACCESSOIRES Коврик AMMITY 1300', price: '3190'}
		}

		factory.getAll=getAll;
		factory.getById=getById;

		function getAll(){
			_checkInBasket();
			return ann_array;
		}
		function getById(id){
			return ann_array[id];
		}
		function _checkInBasket(){

			for(var i in ann_array) {
				if (!ann_array.hasOwnProperty(i)) continue;
				ann_array[i].in_basket = 0;
			}
			
			var basketFactory = $injector.get('basketFactory');
			var basket = basketFactory.getBasket();
			var arr = basket.ann_array;
			for(var i in arr) {
				if (!arr.hasOwnProperty(i)) continue;
				if(ann_array[arr[i].id]){
					ann_array[arr[i].id].in_basket = 1;
				}
			}
		}
		
		return factory;
	})
	
	app.factory('basketFactory', function(annFactory, localStorageService){
	
		{// init
			var factory={};
			var basket={};
			basket.ann_array={};
			basket.summa=0;
			
			factory.addToBasket=addToBasket;
			factory.updateBasketItem=updateBasketItem;
			factory.deleteFromBasket=deleteFromBasket;
			factory.getBasket=getBasket;
			factory.getBasketItem=getBasketItem;
			factory.init=init;
			factory.clearBasket=clearBasket;
		}
		
		function addToBasket(config){
			var ann_item = annFactory.getById(config.id);
		
			basket.ann_array[config.id] = ann_item;
			basket.ann_array[config.id].qty = config.qty;
			basket.ann_array[config.id].summa = config.qty*ann_item.price;
			_countBasketSumma();
			_updateStorageItem({mode:'add', qty:config.qty, id:config.id});
		}
		function updateBasketItem(config){

			basket.ann_array[config.id].qty = config.qty;
			_countBasketSumma();
			_updateStorageItem({mode:'update', qty:config.qty, id:config.id});
		}
		function deleteFromBasket(id){

			delete( basket.ann_array[id] )
			_countBasketSumma();
			_updateStorageItem({mode:'delete', id:id});
		}
		function getBasket(){
			return basket;
		}
		function getBasketItem(id){
			return basket.ann_array[id];
		}
		function init(){
			
			var key_array = localStorageService.keys();
			for(var i=0;i<key_array.length;i++){
				var item = localStorageService.get(key_array[i]);
				var ann_item = annFactory.getById(item.id);
				ann_item.qty = item.qty;
				basket.ann_array[item.id] = ann_item;
			}
			_countBasketSumma();
		}
		function clearBasket(){
			basket.ann_array={};
			basket.summa=0;
			localStorageService.clearAll();
		}
		
		function _countBasketSumma(){
			var arr = basket.ann_array;
			var summa = 0;
			for(var i in arr) {
				if (!arr.hasOwnProperty(i)) continue;
				var item_summa = arr[i].qty  * arr[i].price;
				basket.ann_array[arr[i].id].summa = item_summa;
				summa = summa + item_summa;
			}
			basket.summa = summa;
		}
		
		function _updateStorageItem(config){
			var prefix = 'ann_item_';
			if(config.mode=='add'){
				localStorageService.set( prefix + config.id, {id: config.id, qty:config.qty} );
			}
			if(config.mode=='delete'){
				localStorageService.remove( prefix + config.id );
			}
			if(config.mode=='update'){
				localStorageService.set( prefix + config.id, {id: config.id, qty:config.qty} );
			}
		}
		
		return factory;
	});
  
})(window.angular);