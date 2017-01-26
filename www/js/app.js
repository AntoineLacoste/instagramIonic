// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('instagram', ['ionic', 'app.data-service'])

    .run(function($ionicPlatform) {
        $ionicPlatform.ready(function() {
            if(window.cordova && window.cordova.plugins.Keyboard) {

                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

                cordova.plugins.Keyboard.disableScroll(true);
            }
            if(window.StatusBar) {
                StatusBar.styleDefault();
            }
        });
    })

    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('root', {
                url: '/root',
                abstract: true,
                templateUrl: 'menu.html',
                controller: 'HomeController'
            })

            .state('root.profile', {
                url: '/profile',
                views: {
                    profileView: {
                        templateUrl: 'profile.html',
                        controller: 'ProfileController'
                    }
                }
            })

            .state('root.addPost', {
                url: '/addPost',
                views: {
                    addPostView: {
                        templateUrl: 'addPost.html',
                        controller: 'PostController'
                    }
                }
            })

            .state('root.imageList', {
                url: '/imageList',
                views: {
                    imageListView: {
                        templateUrl: 'imageList.html',
                        controller: 'imageListController'
                    }
                }
            })

            .state('root.comments', {
                url: '/comments/:postId',
                views: {
                    imageListView: {
                        templateUrl: 'comments.html',
                        controller: 'commentsController'
                    }
                }
            })

            .state('root.likes', {
                url: '/likes/:postId',
                views: {
                    imageListView: {
                        templateUrl: 'likes.html',
                        controller: 'likesController'
                    }
                }
            })

        $urlRouterProvider.otherwise('/root/imageList');
    })

    .controller('HomeController', ['$scope', 'dataService', function ($scope, dataService) {
        //autologin in home controller to have the user always connected in all the others controllers
        dataService.autoLogin();
    }])

    .controller('imageListController', ['$scope', 'dataService', function ($scope, dataService) {

        $scope.$on("$ionicView.beforeEnter", function(event, data){
            $scope.doRefresh();
        });


        // $scope.likeButtonDisabled = false;
        $scope.doRefresh = function() {
            // $scope.likeButtonDisabled = true;
            dataService.getPosts().then(function (posts) {
                // console.log(posts);
                $scope.posts = posts;
                $scope.$broadcast('scroll.refreshComplete');
                $scope.likeButtonDisabled = false;
            }, function (err) {
                console.log(err);
            });
        };

        $scope.doRefresh();

        $scope.unlikeOrLikePost = function (post) {
            if(post.likedByCurrentUser){
                $scope.unlikePost(post);
            }
            else{
                $scope.likePost(post);
            }
        };

        $scope.likePost = function (post) {
            post.likedByCurrentUser = true;
            post.likesCount += 1;
            dataService.likePost(post.id).then(function () {
            }, function (err) {
                post.likedByCurrentUser = false;
                post.likesCount -= 1;
            });
        }

        $scope.unlikePost = function (post) {
            post.likedByCurrentUser = false;
            post.likesCount -= 1;
            dataService.unlikePost(post.id).then(function () {
                console.log(post.likedByCurrentUser);
            }, function (err) {
                post.likedByCurrentUser = true;
                post.likesCount += 1;
            });
        }
    }])

    .controller('likesController', ['$scope', 'dataService','$stateParams', function ($scope, dataService, $stateParams) {
        $scope.doRefresh = function() {
            dataService.getLikes($stateParams.postId).then(function (likes) {
                $scope.likes = likes;
                $scope.$broadcast('scroll.refreshComplete');
            }, function (err) {
                console.log(err);
            })
        };

        $scope.doRefresh();
    }])

    .controller('commentsController', ['$scope', 'dataService','$stateParams', '$ionicPopup', function ($scope, dataService, $stateParams, $ionicPopup) {
        $scope.doRefresh = function() {
            $scope.postId = $stateParams.postId;
            $scope.currentUser = dataService.getCurrentUser();
            dataService.getComments($stateParams.postId).then(function (comments) {
                $scope.comments = comments;
                $scope.$broadcast('scroll.refreshComplete');
            }, function (err) {
                console.log(err);
            })
        };

        $scope.doRefresh();

        $scope.postComment = function(){
            dataService.sendComment($scope.commentText, $scope.postId).then(function () {
                $scope.commentText = "";
                $scope.doRefresh();
            }, function (err) {
                console.log(err);
            })
        }

        $scope.deleteComment = function (comment) {
                var confirmPopup = $ionicPopup.confirm({
                    title: 'Delete comment',
                    template: 'Are you sure you want to delete this comment?'
                });

                confirmPopup.then(function(res) {
                    if(res) {
                        dataService.deleteComment(comment).then(function () {
                            $scope.doRefresh();
                        }, function (err) {
                            console.log(err);
                        });
                    } else {
                    }
                });
        };
    }])

    .controller('PostController', ['$scope', 'dataService', function ($scope, dataService) {
    }])

    .controller('ProfileController', ['$scope', 'dataService', function ($scope, dataService) {
    }])