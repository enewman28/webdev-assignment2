# webdev-assignment2

To run: pull reopository and run commands specified in commands.md.
.env with MongoDB connection URL ommitted, containing secret

REGISGTER AND LOGIN

/api/user

/api/user/register -- registers a new user, and adds it to underlying MongoDB database

/api/uuser/login -- produces an auth key to be used for authenticated operations

PIAZZA POSTS

/api/posts

GET - unauthenticated. Can get list of all posts, and also search by ID.

POST - authenticated. Before a post is made, must check if current user is authenticated, then adds to post database with title, description, and like count.

PUT - authenticated. First check if current user logged in has an ID that matches that of the post's creator. Then info is validated and updated.

DELETE - authenticated. First check if current user logged in has an ID that matches that of the post's creator. Then info is deleted.

Evidence of working operation is shown in tests folder of the repository, omitting the specific key for security purposes. However middleware was developed alongside tutorial so it does work.
