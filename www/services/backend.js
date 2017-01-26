angular.module('app.backend-services', ['ionic', 'app.database-service'])

    .service('usersService', function(databaseService) {

        var _currentUser = null;

        this.autoLogin = function() {
            _currentUser = this.getUserById(1);
        }

        this.getCurrentUser = function() {
            return _currentUser;
        }

        this.getUserById = function(userId) {
            var usersById = this.getUsersById();
            var user = usersById[userId];
            if (!user) {
                console.error('User with id ' + userId + ' not found.');
                return null;
            } else {
                return user;
            }
        }

        this.getUsersById = function() {
            var usersById = {}
            var users = databaseService.users;
            angular.forEach(users, function(user) {
                if (!('id' in user)) {
                    console.error('Missing id for user ' + user);
                    return;
                }
                if (user.id in usersById) {
                    console.error('Duplicate user for id ' + user.id + ' : ' + usersById[user.id] + ' and ' + user);
                    return;
                }
                usersById[user.id] = user;
            });
            return usersById;
        }

        this.currentUserLikesPost = function(postId) {
            var currentUserLikesPost = false;
            var currentUser = this.getCurrentUser();
            if (currentUser == null) {
                return false;
            }

            angular.forEach(databaseService.likes, function(like) {
                if(!('postId' in like)) {
                    console.error('Missing postId for like ' + like);
                    return;
                }
                if(!('fromUserId' in like)) {
                    console.error('Missing fromUserId for like ' + like);
                    return;
                }
                if (like.postId == postId && like.fromUserId == currentUser.id) {
                    currentUserLikesPost = true;
                }
            });
            return currentUserLikesPost;
        }

    })

    .service('postsService', function(databaseService, usersService) {

        this.getPosts = function() {

            var posts = angular.copy(databaseService.posts);
            var usersById = usersService.getUsersById();

            angular.forEach(posts, function(post) {
                if(!('userId' in post)) {
                    console.error('Missing userId for post ' + post);
                    post.user = {}
                    return;
                }
                if (post.userId in usersById) {
                    post.user = usersById[post.userId]
                } else {
                    console.error('Missing user with id ' + post.userId + ' for post ' + post);
                    post.user = { id: post.userId }
                }
                delete post.userId
                post.likedByCurrentUser = usersService.currentUserLikesPost(post.id);
            });

            return posts;
        }

        this.updatePost = function(postId, callback)
        {
            var foundPost = null;
            angular.forEach(databaseService.posts, function(post) {
                if(!('id' in post)) {
                    console.error('Missing id for post ' + post);
                    return;
                }
                if(!('userId' in post)) {
                    console.error('Missing userId for post ' + post);
                    return;
                }
                if (post.id != postId) {
                    return;
                }
                if (foundPost != null) {
                    console.error('Duplicate post with id ' + post.id);
                    return;
                }
                foundPost = post;
            });
            callback(foundPost);
        }

    })

    .service('likesService', function(databaseService, usersService, postsService) {

        this.getLikes = function(postId) {

            var usersById = usersService.getUsersById();
            var likes = [];

            angular.forEach(databaseService.likes, function(like) {
                if(!('postId' in like)) {
                    console.error('Missing postId for like ' + like);
                    return;
                }
                if (like.postId != postId) {
                    return;
                }
                if(!('fromUserId' in like)) {
                    console.error('Missing fromUserId for like ' + like);
                    return;
                }
                if(!(like.fromUserId in usersById)) {
                    console.error('Missing user with id ' + like.fromUserId + ' for like ' + like);
                    return;
                }
                var likeCopy = angular.copy(like);
                likeCopy.fromUser = usersById[likeCopy.fromUserId];
                delete likeCopy.fromUserId;

                likes.push(likeCopy);
            });

            return likes;
        }

        this.likePost = function(postId) {
            var likeObject = null;
            var currentUser = usersService.getCurrentUser();
            if (currentUser == null) {
                return null;
            }

            angular.forEach(databaseService.likes, function(like) {
                if(!('postId' in like)) {
                    console.error('Missing postId for like ' + like);
                    return;
                }
                if(!('fromUserId' in like)) {
                    console.error('Missing fromUserId for like ' + like);
                    return;
                }
                if (like.postId == postId && like.fromUserId == currentUser.id) {
                    console.error('A like object already exists : ' + like);
                    likeObject = like;
                }
            });

            if (likeObject == null) {
                likeObject = {
                    id: Math.floor(Math.random() * Math.pow(2, 32)),
                    postId: postId,
                    fromUserId: currentUser.id,
                    createdAt: new Date()
                };
                databaseService.likes.push(likeObject);
                postsService.updatePost(postId, function(post) {
                    post.likesCount += 1;
                });
            }

            return likeObject;
        }

        this.unlikePost = function(postId) {
            var currentUser = usersService.getCurrentUser();
            if (currentUser == null) {
                return false;
            }
            var newLikesArray = [];
            var removedElements = [];

            angular.forEach(databaseService.likes, function(like) {
                if(!('postId' in like)) {
                    console.error('Missing postId for like ' + like);
                    return;
                }
                if(!('fromUserId' in like)) {
                    console.error('Missing fromUserId for like ' + like);
                    return;
                }
                if (like.postId == postId && like.fromUserId == currentUser.id) {
                    removedElements.push(like);
                } else {
                    newLikesArray.push(like);
                }
            });
            if (removedElements.length != 1) {
                console.error('Removed ' + removedElements.length + ' like objects drom database.');
            }
            databaseService.likes = newLikesArray;
            postsService.updatePost(postId, function(post) {
                post.likesCount -= removedElements.length;
            });

            return (removedElements.length >= 1);
        }
    })

    .service('commentsService', function(databaseService, usersService, postsService) {

        this.getComments = function(postId) {

            var usersById = usersService.getUsersById();
            var comments = [];

            angular.forEach(databaseService.comments, function(comment) {
                if(!('postId' in comment)) {
                    console.error('Missing postId for comment ' + comment);
                    return;
                }
                if (comment.postId != postId) {
                    return;
                }
                if(!('fromUserId' in comment)) {
                    console.error('Missing fromUserId for comment ' + comment);
                    return;
                }
                if(!(comment.fromUserId in usersById)) {
                    console.error('Missing user with id ' + comment.fromUserId + ' for comment ' + comment);
                    return;
                }
                var commentCopy = angular.copy(comment);
                commentCopy.fromUser = usersById[commentCopy.fromUserId];
                delete commentCopy.fromUserId;

                comments.push(commentCopy);
            });

            return comments;
        }

        this.sendComment = function(message, postId) {

            var currentUser = usersService.getCurrentUser();
            if (currentUser == null) {
                return false;
            }
            var newComment = {
                id: Math.floor(Math.random() * Math.pow(2, 32)),
                postId: postId,
                fromUserId: currentUser.id,
                message: message,
                createdAt: new Date()
            }

            databaseService.comments.push(newComment);
            postsService.updatePost(postId, function(post) {
                post.commentsCount += 1;
            });

            newComment = angular.copy(newComment);
            newComment.fromUser = usersService.getUserById(newComment.fromUserId);
            delete newComment.fromUserId;

            return newComment;
        }

        this.deleteComment = function(commentToDelete) {

            var currentUser = usersService.getCurrentUser();
            if (currentUser == null) {
                return false;
            }
            var newCommentsArray = [];
            var removedElements = [];

            angular.forEach(databaseService.comments, function(comment) {
                if(!('id' in comment)) {
                    console.error('Missing id for comment ' + comment);
                    return;
                }
                if (comment.id == commentToDelete.id && comment.fromUserId == currentUser.id) {
                    removedElements.push(comment);
                } else {
                    newCommentsArray.push(comment);
                }
            });
            if (removedElements.length != 1) {
                console.error('Removed ' + removedElements.length + ' comment objects drom database');
            }
            databaseService.comments = newCommentsArray;
            postsService.updatePost(commentToDelete.postId, function(post) {
                post.commentsCount -= removedElements.length;
            });

            return (removedElements.length >= 1);
        }

    })
