angular.module('app.database-service', ['ionic'])

    .service('databaseService', function() {

        this.users = [{
            id:1,
            username: "soham",
            displayName: "Soham Murphy",
            profilePictureURL: "./img/soham.jpg",
            createdAt: new Date()
        }, {
            id:2,
            username: "jack",
            displayName: "Jack Payne",
            profilePictureURL: "./img/jack.jpg",
            createdAt: new Date()
        }, {
            id:3,
            username: "ella",
            displayName: "Ella Ellis",
            profilePictureURL: "./img/ella.jpg",
            createdAt: new Date()
        }];

        this.posts = [{
            id: 1,
            userId: 1,
            imageURL: "./img/image-1.jpeg",
            message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
            commentsCount: 2,
            likesCount: 1,
            createdAt: new Date()
        }, {
            id: 7,
            userId: 2,
            imageURL: "./img/image-2.jpeg",
            message: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
            commentsCount: 0,
            likesCount: 1,
            createdAt: new Date('January 17, 2017 09:43:00')
        }, {
            id: 150,
            userId: 1,
            imageURL: "./img/image-3.jpeg",
            message: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
            commentsCount: 1,
            likesCount: 0,
            createdAt: new Date('January 10, 2017 17:31:00')
        }];

        this.likes = [{
            id:1,
            postId: 1,
            fromUserId: 1,
            createdAt: new Date()
        }, {
            id:2,
            postId: 7,
            fromUserId: 2,
            createdAt: new Date()
        }];

        this.comments = [{
            id:1,
            postId: 1,
            fromUserId: 1,
            message: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.",
            createdAt: new Date()
        }, {
            id:2,
            postId: 1,
            fromUserId: 2,
            message: "Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet.",
            createdAt: new Date()
        }, {
            id:2,
            postId: 150,
            fromUserId: 3,
            message: "Consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem",
            createdAt: new Date()
        }];
    })
