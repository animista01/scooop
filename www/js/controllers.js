angular.module('scooop.controllers', [])

.controller('ListsCtrl', function ($scope, $ionicModal, $timeout, $ionicSlideBoxDelegate, Channels, $ionicLoading){
    $scope.searchBy = function (){
        $ionicLoading.show();
        if($scope.searchBy.channelId){
            var result = Channels.getChannelById($scope.searchBy.channelId);
            result.then(function (data){
                console.log(data)
                if(data.status == 200){
                    $scope.playlist = data.playlist;
                    $ionicLoading.hide();
                }else{
                    $ionicLoading.show({
                        template: '<i class="icon ion-close-round"></i><p>' + data.message + '</p>',
                        duration: 2500,
                        showBackdrop: false
                    });
                }
            }, function (err){
                $ionicLoading.show({
                    template: '<p>Algo malo ocurrió</p>',
                    duration: 1500,
                    showBackdrop: false
                });
            });
        }
    }

	// $scope.resources = [
	// 	{
	// 		'type': 'image',
	// 		'src': 'http://ionicframework.com/img/docs/nevermind.jpg',
 //            'duration': 5000
	// 	}, {
 //            'type': 'video',
 //            'src': 'img/coffee.MOV'
 //        }, {
	// 		'type': 'image',
	// 		'src': 'img/pic2.jpg',
 //            'duration': 10000
	// 	}, {
	// 		'type': 'image',
	// 		'src': 'img/pic3.jpg',
 //            'duration': 12000
	// 	}, {
 //            'type': 'video',
 //            'src': 'img/coffee.MOV'
 //        }
	// ];

	$scope.mediaToShow = {};
	$scope.showMedia = function (){
        $ionicLoading.show();
        $scope.showModal('templates/media-popover.html');
    }

    $scope.showModal = function (templateUrl){
        $ionicModal.fromTemplateUrl(templateUrl, {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal){
            $scope.modal = modal;
            $scope.modal.show();
            $timeout(function(){ $scope.player(0);}, 100);
        });
    }
    // Close the modal
    $scope.closeModal = function (){
        $scope.modal.hide();
        $scope.modal.remove()
    };

    $scope.player = function (index){
        console.log($scope.playlist[$scope.searchBy.channelId][index])
        if($scope.playlist[$scope.searchBy.channelId][index].tipo === "image"){
            $ionicLoading.hide();

            $timeout(function(){
                var position = $ionicSlideBoxDelegate.currentIndex();
                var total = $ionicSlideBoxDelegate.slidesCount();
                //Aun queda media
                if( (total - position) > 1 ){
                    $ionicSlideBoxDelegate.next();
                }
            }, $scope.playlist[$scope.searchBy.channelId][index].duration);
        }else{
            var video = document.getElementById(index);
            $ionicLoading.hide();
            video.play();
            video.onended = function (e){
                var position = $ionicSlideBoxDelegate.currentIndex();
                var total = $ionicSlideBoxDelegate.slidesCount();
                //Aun queda media
                if( (total - position) > 1 ){
                    $ionicSlideBoxDelegate.next();
                }
            };
        }
    }
})

.controller('ChatsCtrl', function ($scope, Chats){
  $scope.chats = Chats.all();
  $scope.remove = function (chat){
    Chats.remove(chat);
  }
})

.controller('ChatDetailCtrl', function ($scope, $stateParams, Chats){
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function ($scope){
  $scope.settings = {
    enableFriends: true
  };
});
