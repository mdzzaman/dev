/// <reference path="../View/Container/Content/ContentMainBar/_PersonWidget.html" />

mainModule.controller('homeController', ['$scope', '$http', '$element', 'lazyLoadingCSS', 'controllerService', function ($scope, $http, $element, lazyLoadingCSS, controllerService) {
    $scope.mainBodyView = 'Content/Scripts/View/_Container.html';
    $scope.headerView = 'Content/Scripts/View/Container/_Header.html';
    $scope.contentViewurl = 'Content/Scripts/View/Container/_Content.html';
    $scope.contentMenuBae = 'Content/Scripts/View/Container/Content/_ContentMainBar.html';
    $scope.contentSideBae = 'Content/Scripts/View/Container/Content/_SideBar.html';
    $scope.postSummaryView = 'Content/Scripts/View/Container/Content/ContentMainBar/_PostSummaryWidget.html';
    $scope.writePost = 'Content/Scripts/View/Container/Content/ContentMainBar/_WritePost.html';
    $scope.personWidget = 'Content/Scripts/View/Container/Content/ContentMainBar/_PersonWidget.html';

    $scope.model = {
        newPostText: '',
        posts: [{PostId:0, "postUser": "new name", "totalLikes": 0, userPic: 'UserAvatar.png', "text": "asdasd", "createdAt": "30 May 2014 18:04", CommentCount: 0, isLike: false}],
        personWidgets: []
    };
    var model = $scope.model;
    controllerService.set('homeController', $scope);
    $scope.getButtonText = function (user, evt) {
        if (user.isRequested) {
            return 'Confirm';
        } else if (user.isMyFriend) {
            return 'Unfriend';
        } else {
            return 'Add Friend';
        }
    }
    $scope.sendRequest = function (user, evt) {
        if (user.isRequested) {
            var responsePromise = $http.post('/Api/User/PostAcceptRequest', { Name: user.userId }, {});
            responsePromise.success(function (dataFromServer, status, headers, config) {
                //after success here to
                $(evt.target).closest('.divPersonWidget').animate({ opacity: 0 }, 400, function () {
                    var personWidgets = [];
                    for (var i = 0; i < model.personWidgets.length; i++) {
                        if (model.personWidgets[i].id != user.id) {
                            personWidgets.push(model.personWidgets[i]);
                        }
                    }
                    var scope = angular.element($("#body")).scope();
                    scope.$apply(function () {
                        model.personWidgets = personWidgets;
                    });
                });
                //Htere
            });
            responsePromise.error(function (data, status, headers, config) {
                //Handle Error
            });
        } else if (user.isMyFriend) {
            var responsePromise = $http.post('/Api/User/PostRemoveFriend', { Name: user.userId }, {});
            responsePromise.success(function (dataFromServer, status, headers, config) {
                //after success here to
                $(evt.target).closest('.divPersonWidget').animate({ opacity: 0 }, 400, function () {
                    var personWidgets = [];
                    for (var i = 0; i < model.personWidgets.length; i++) {
                        if (model.personWidgets[i].id != user.id) {
                            personWidgets.push(model.personWidgets[i]);
                        }
                    }
                    var scope = angular.element($("#body")).scope();
                    scope.$apply(function () {
                        model.personWidgets = personWidgets;
                    });
                });
                //Htere
            });
            responsePromise.error(function (data, status, headers, config) {
                //Handle Error
            });
        } else {
            var responsePromise = $http.post('/Api/User/PostAddRequest', { Name: user.userId }, {});
            responsePromise.success(function (dataFromServer, status, headers, config) {
                //after success here to
                $(evt.target).closest('.divPersonWidget').animate({ opacity: 0 }, 400, function () {
                    var personWidgets = [];
                    for (var i = 0; i < model.personWidgets.length; i++) {
                        if (model.personWidgets[i].id != user.id) {
                            personWidgets.push(model.personWidgets[i]);
                        }
                    }
                    var scope = angular.element($("#body")).scope();
                    scope.$apply(function () {
                        model.personWidgets = personWidgets;
                    });
                });
                //Htere
            });
            responsePromise.error(function (data, status, headers, config) {
                //Handle Error
            });
        }
        
    }
    $scope.cancelRequest = function (user, evt) {
        var responsePromise = $http.post('/Api/User/PostCancelRequest', { Name: user.userId }, {});
        responsePromise.success(function (dataFromServer, status, headers, config) {
            //after success here to
            $(evt.target).closest('.divPersonWidget').animate({ opacity: 0 }, 400, function () {
                var personWidgets = [];
                for (var i = 0; i < model.personWidgets.length; i++) {
                    if (model.personWidgets[i].id != user.id) {
                        personWidgets.push(model.personWidgets[i]);
                    }
                }
                var scope = angular.element($("#body")).scope();
                scope.$apply(function () {
                    model.personWidgets = personWidgets;
                });
            });
            //Htere
        });
        responsePromise.error(function (data, status, headers, config) {
            //Handle Error
        });
    }

    $scope.replaceToHTML = function (text) {
        return text.replace(/\n/, '<br/>');
    };
    $scope.addPost = function () {
        if (model.newPostText) {
            var post = { text: model.newPostText };

            var responsePromise = $http.post('/Api/UserPost/PostAddStatus', post, {});
            responsePromise.success(function (dataFromServer, status, headers, config) {

                var posts = [dataFromServer];
                for (var i = 0; i < model.posts.length; i++) {
                    posts.push(model.posts[i]);
                }
                model.posts = posts;
                model.newPostText = '';
            });
            responsePromise.error(function (data, status, headers, config) {
                //Handle Error
            });
        };
    }
    $scope.ShowUserProfile = function (userID) {
        if (userID == "own") {
            userID = UserProfile.userId;
        }
        var userSettingController = controllerService.get('userSettingController');
        userSettingController.showUserProfile(userID);
    }
    $scope.showUserHome = function () {
        var homeController = controllerService.get('homeController');
        homeController.mainBodyView = 'Content/Scripts/View/_Container.html';
        homeController.headerView = 'Content/Scripts/View/Container/_Header.html';
        homeController.contentViewurl = 'Content/Scripts/View/Container/_Content.html';
        homeController.contentMenuBae = 'Content/Scripts/View/Container/Content/_ContentMainBar.html';
        homeController.contentSideBae = 'Content/Scripts/View/Container/Content/_SideBar.html';
        homeController.postSummaryView = 'Content/Scripts/View/Container/Content/ContentMainBar/_PostSummaryWidget.html';
        homeController.writePost = 'Content/Scripts/View/Container/Content/ContentMainBar/_WritePost.html';
        homeController.personWidget = 'Content/Scripts/View/Container/Content/ContentMainBar/_PersonWidget.html';
    }
    $scope.showPendingUser = function () {
        var responsePromise = $http.post('/Api/User/PostLoadPendingFriends', {}, {});
        responsePromise.success(function (dataFromServer, status, headers, config) {
            var homeController = controllerService.get('homeController');
            homeController.postSummaryView = '';
            homeController.writePost = '';
            homeController.model.personWidgets = dataFromServer;
            homeController.mainBodyView = 'Content/Scripts/View/_Container.html';
            homeController.headerView = 'Content/Scripts/View/Container/_Header.html';
            homeController.contentViewurl = 'Content/Scripts/View/Container/_Content.html';
            homeController.contentMenuBae = 'Content/Scripts/View/Container/Content/_ContentMainBar.html';
            homeController.contentSideBae = 'Content/Scripts/View/Container/Content/_SideBar.html';
            homeController.writePost = 'Content/Scripts/View/Container/Content/ContentMainBar/_WritePost.html';
            homeController.personWidget = 'Content/Scripts/View/Container/Content/ContentMainBar/_PersonWidget.html';
            
        });
        responsePromise.error(function (data, status, headers, config) {
            //Handle Error
        });
        
    }
    $scope.showFriends = function () {
        var responsePromise = $http.post('/Api/User/PostLoadMyFriends', {}, {});
        responsePromise.success(function (dataFromServer, status, headers, config) {
            var homeController = controllerService.get('homeController');
            homeController.model.personWidgets = dataFromServer;
            homeController.postSummaryView = '';
            homeController.writePost = '';
            homeController.model.personWidgets = dataFromServer;
            homeController.mainBodyView = 'Content/Scripts/View/_Container.html';
            homeController.headerView = 'Content/Scripts/View/Container/_Header.html';
            homeController.contentViewurl = 'Content/Scripts/View/Container/_Content.html';
            homeController.contentMenuBae = 'Content/Scripts/View/Container/Content/_ContentMainBar.html';
            homeController.contentSideBae = 'Content/Scripts/View/Container/Content/_SideBar.html';
            homeController.writePost = 'Content/Scripts/View/Container/Content/ContentMainBar/_WritePost.html';
            homeController.personWidget = 'Content/Scripts/View/Container/Content/ContentMainBar/_PersonWidget.html';
        });
    }

    var responsePromise = $http.post('/Api/UserPost/PostLoadPosts', {}, {});
    responsePromise.success(function (dataFromServer, status, headers, config) {
        $scope.model.posts = dataFromServer;
    });
}]);
mainModule.controller('userSettingController', ['$scope', '$http', '$element', 'lazyLoadingCSS', 'controllerService', function ($scope, $http, $element, lazyLoadingCSS, controllerService) {
    $scope.userSettingPartial = 'Content/Scripts/View/_TopBar.html';
    $scope.searchBar = 'Content/Scripts/View/_Search.html';
    $scope.menuView = '';
    if (UserProfile) {
        $scope.userFullName = UserProfile.Name;
        $scope.menuView = 'Content/Scripts/View/TopBar/userSettingMenu.html';
    }
    controllerService.set('userSettingController', $scope);
    $scope.logOut = function () {
        var model = {};
        //model[UserProfile.AntiForgeryToken.name]=UserProfile.AntiForgeryToken.value;
        var responsePromise = $http.post('/Account/LogOff', model, {
            
        });
        responsePromise.success(function (dataFromServer, status, headers, config) {
            location.href='/'
        });
        responsePromise.error(function (data, status, headers, config) {
            alert('error');
        });
    }
    $scope.showUserProfile = function (userID) {
        if (userID == "own") {
            userID = UserProfile.userId;
        }
        var homeController = controllerService.get('homeController');
        homeController.userID = userID;
        homeController.contentMenuBae = 'Content/Scripts/View/UserProfile/userProfile.html';
    }
}]);
mainModule.controller('userProfileController', ['$scope', '$http', '$element', 'lazyLoadingCSS', 'controllerService', function ($scope, $http, $element, lazyLoadingCSS, controllerService) {
    controllerService.set('userProfileController', $scope);
    $scope.model = { isEdit: false, Name: '', Email: '', Password: '', confirmPassword: '', Location: '', isEditable: false, };
    var model = $scope.model;
    $scope.showEdit = function () {
        $scope.model.isEdit = true;
    };
    $scope.submitForm = function () {
        var subminModel = model;

        var flag = true;
        flag = model.Name.length > 100 ? false : flag;
        flag = model.Password.length > 20 || model.Password.length < 5 ? false : flag;
        flag = model.Location.length > 200 ? false : flag;
        flag = model.Password != model.confirmPassword ? false : flag;
        $scope.model.isEdit = false;
        if (flag) {
            var responsePromise = $http.post('/Api/User/PostEditBasicInfo', model, {});
            responsePromise.success(function (dataFromServer, status, headers, config) {

            });
            responsePromise.error(function (data, status, headers, config) {
                //Handle Error
            });
        }



    };
    $scope.showUserHome = function () {
        var homeController = controllerService.get('homeController');
        homeController.mainBodyView = 'Content/Scripts/View/_Container.html';
        homeController.headerView = 'Content/Scripts/View/Container/_Header.html';
        homeController.contentViewurl = 'Content/Scripts/View/Container/_Content.html';
        homeController.contentMenuBae = 'Content/Scripts/View/Container/Content/_ContentMainBar.html';
        homeController.contentSideBae = 'Content/Scripts/View/Container/Content/_SideBar.html';
        homeController.postSummaryView = 'Content/Scripts/View/Container/Content/ContentMainBar/_PostSummaryWidget.html';
        homeController.writePost = 'Content/Scripts/View/Container/Content/ContentMainBar/_WritePost.html';
        homeController.personWidget = '';
    };
    var responsePromise = $http.post('/Api/User/PostBasicFridnInfo', { name1: controllerService.get('homeController').userID }, {});
    responsePromise.success(function (dataFromServer, status, headers, config) {
        model.Name = dataFromServer.name;
        model.Password = dataFromServer.password;
        model.Email = dataFromServer.email;
        model.confirmPassword = dataFromServer.password;
        model.Location = dataFromServer.location;
        model.isEditable = model.email != UserProfile.email;

    });
    responsePromise.error(function (data, status, headers, config) {
        //Handle Error
    });
}]);
mainModule.controller('footerController', ['$scope', '$http', '$element', 'lazyLoadingCSS', 'controllerService', function ($scope, $http, $element, lazyLoadingCSS, controllerService) {
    controllerService.set('footerController', $scope);
    $scope.footerPartial = 'Content/Scripts/View/_Footer.html';
    $scope.load = function () {

    }
}]);
mainModule.controller('searchController', ['$scope', '$http', '$element', 'lazyLoadingCSS', 'controllerService', function ($scope, $http, $element, lazyLoadingCSS, controllerService) {
    controllerService.set('searchController', $scope);
    $scope.model = { searchText: '' };
    var model = $scope.model;
    $scope.Search = function () {
        var homeController = controllerService.get('homeController');
        if (model.searchText) {
            //after success here to
            var searchModel = { Name: model.searchText };
            //Htere
            var responsePromise = $http.post('/Api/Search/PostUserSearch', searchModel, {});
            responsePromise.success(function (dataFromServer, status, headers, config) {
                homeController.postSummaryView = ''; 
                homeController.writePost = '';
                homeController.model.personWidgets = dataFromServer;
                homeController.mainBodyView = 'Content/Scripts/View/_Container.html';
                homeController.headerView = 'Content/Scripts/View/Container/_Header.html';
                homeController.contentViewurl = 'Content/Scripts/View/Container/_Content.html';
                homeController.contentMenuBae = 'Content/Scripts/View/Container/Content/_ContentMainBar.html';
                homeController.contentSideBae = 'Content/Scripts/View/Container/Content/_SideBar.html';
                homeController.writePost = 'Content/Scripts/View/Container/Content/ContentMainBar/_WritePost.html';
                homeController.personWidget = 'Content/Scripts/View/Container/Content/ContentMainBar/_PersonWidget.html';
            });
            responsePromise.error(function (data, status, headers, config) {
                //Handle Error
            });
        } else {
            homeController.postSummaryView = 'Content/Scripts/View/Container/Content/ContentMainBar/_PostSummaryWidget.html';
            homeController.writePost = 'Content/Scripts/View/Container/Content/ContentMainBar/_WritePost.html';
        }
    }
}]);
mainModule.controller('postController', ['$scope', '$http', '$element', 'lazyLoadingCSS', 'controllerService', function ($scope, $http, $element, lazyLoadingCSS, controllerService) {
    controllerService.set('postController', $scope);
    $scope.model = { searchText: '' };
    var model = $scope.model;
    $scope.Like = function (post, evt) {
        
        var responsePromise = $http.post('/Api/UserPost/PostLikePost', { Name1: post.postId }, {});
        responsePromise.success(function (dataFromServer, status, headers, config) {
            //after success here to
            var homeController = controllerService.get('homeController');
            var commentDetailController = controllerService.get('commentDetailController');
            if (post.isLike) {
                post.totalLikes--;
                if (commentDetailController && homeController.dataList.length) {
                    var newComments = [];
                    homeController.dataList = homeController.dataList || [];
                    for (var i = 0; i < homeController.dataList.length ; i++) {
                        if (UserProfile.userId.postId != homeController.dataList[i].postId) {
                            newComments.push(homeController.dataList[i]);
                        }
                    }
                    commentDetailController.model.comments = newComments;
                }
            } else {
                post.totalLikes++;
                if (commentDetailController && commentDetailController.model.comments && homeController.Type == 'Like') {
                    commentDetailController.model.comments.length || (commentDetailController.model.comments = []);
                    commentDetailController.model.comments.push({ "postUser": UserProfile.name, "userPic": UserProfile.userPic,userId: UserProfile.userId});
                }
            }

            post.isLike = !post.isLike;

            //Htere
        });
        responsePromise.error(function (data, status, headers, config) {
            //Handle Error
        });
    }
    $scope.Comment = function (post) {
        if (post.newCommentText) {
            
            var responsePromise = $http.post('/Api/UserPost/PostAddComment', { Name1: post.postId, Text: post.newCommentText }, {});
            responsePromise.success(function (dataFromServer, status, headers, config) {
                //after success here to
                post.commentCount++;
                post.newCommentText = ''
                dataFromServer.postUser = UserProfile.name;
                dataFromServer.userId = UserProfile.userId;
                dataFromServer.userPic = UserProfile.userPic;
                
                var homeController = controllerService.get('homeController');
                if (controllerService.get('commentDetailController') && controllerService.get('commentDetailController').model.comments && homeController.Type == 'Comment') {
                    controllerService.get('commentDetailController').model.comments.length || (controllerService.get('commentDetailController').model.comments = []);
                    controllerService.get('commentDetailController').model.comments.push(dataFromServer);
                }
                //Htere
            });
            responsePromise.error(function (data, status, headers, config) {
                //Handle Error
            });
        }
    }
    $scope.ViewCommentDetails = function (post) {
        model.post = post;
        $scope.model.postDetail = post;
        var homeController = controllerService.get('homeController');
        homeController.postDetail = post;
        homeController.Type = 'Comment';
       // homeController.dataList = [{ "postUser": "new name", "commentId": 'aaaaaaa', "totalLikes": 0, "userPic": 'UserAvatar.png', "text": "asdasd", "createdAt": "30 May 2014 18:04" }, { "postUser": "new name", "commentId": 'bbbbbbbb', "totalLikes": 0, "userPic": 'UserAvatar.png', "text": "new post", "createdAt": "30 May 2014 18:23" }];

        var responsePromise = $http.post('/Api/UserPost/PostLoadComments', { Name1: post.postId }, {});
        responsePromise.success(function (dataFromServer, status, headers, config) {
            homeController.dataList = dataFromServer;
            homeController.contentMenuBae = 'Content/Scripts/View/Container/_postDetail.html';
            //Htere
        });
        responsePromise.error(function (data, status, headers, config) {
            //Handle Error
        });

        
    }
    $scope.ViewLikeDetails = function (post) {
        model.post = post;
        $scope.model.postDetail = post;
        var homeController = controllerService.get('homeController');
        homeController.postDetail = post;
        homeController.Type = 'Like';
        //homeController.dataList = [{ "postUser": "new name", "commentId": 'aaaaaaa', "totalLikes": 0, "userPic": 'UserAvatar.png' }, { "postUser": "new name", "commentId": 'bbbbbbbb', "totalLikes": 0, "userPic": 'UserAvatar.png' }];
        var responsePromise = $http.post('/Api/UserPost/PostLoadPostLikes', { Name1: post.postId }, {});
        responsePromise.success(function (dataFromServer, status, headers, config) {
            homeController.dataList = dataFromServer;
            homeController.contentMenuBae = 'Content/Scripts/View/Container/_postDetail.html';
            //Htere
        });
        responsePromise.error(function (data, status, headers, config) {
            //Handle Error
        });
        
    }
    $scope.ShowUserProfile = function (userID) {
        var userSettingController = controllerService.get('userSettingController');
        userSettingController.showUserProfile(userID);
    }
    $scope.LikeText = function (isLike) {
        return isLike ? 'Unlike' : 'Like';
    }
}]);


mainModule.controller('postDetailController', ['$scope', '$http', '$element', 'lazyLoadingCSS', 'controllerService', function ($scope, $http, $element, lazyLoadingCSS, controllerService) {
    controllerService.set('postDetailController', $scope);
    $scope.commentView = 'Content/Scripts/View/Container/Content/ContentMainBar/_PersonListView.html';

    $scope.model = {
        headerText: 'People Who Like This',
        //postDetail: [{ "postUser": "new name", "commentId": 'aaaaaaa', "totalLikes": 0, "userPic": 'UserAvatar.png', "text": "asdasd", "createdAt": "30 May 2014 18:04", CommentCount: 0 }, { "postUser": "new name", "commentId": 'bbbbbbbb', "totalLikes": 0, "userPic": 'UserAvatar.png', "text": "new post", "createdAt": "30 May 2014 18:23", CommentCount: 0 }]
    };
    $scope.ShowUserProfile = function (userID) {
        var userSettingController = controllerService.get('userSettingController');
        userSettingController.showUserProfile(userID);
    }

    var model = $scope.model;
}]);
mainModule.controller('commentDetailController', ['$scope', '$http', '$element', 'lazyLoadingCSS', 'controllerService', function ($scope, $http, $element, lazyLoadingCSS, controllerService) {
    controllerService.set('commentDetailController', $scope);

    $scope.model = {
        headerText: 'People Who Like This',
        comments: controllerService.get('homeController').dataList
    };
    $scope.ShowUserProfile = function (userID) {
        var userSettingController = controllerService.get('userSettingController');
        userSettingController.showUserProfile(userID);
    }
    var model = $scope.model;

}]);
