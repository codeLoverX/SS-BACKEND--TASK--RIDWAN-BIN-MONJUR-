# Steps to start:

1. Use Docker-compose for MongoDB database
2. npm install
3. npm run start
4. Mutations and queries are stord in the "all client queries and mutations for tester" for the tester's benefit
5. Try getAll(), getById()
6. Sign up with Role 'Normal' and login. You can get get jwt token in both cookie and response
7. Try getAll(), getById()
8. Sign up with Role 'Admin' and login. 
9. Try addMovie(), deleteMovie(), updateMovie

TODO: If you want to create new actor with Movie, pass
    {
      "newActorDetails": {
        "name": "Ridwan"
        }
    },

    Or, pass ID from the database to use existing actor.
    Please get an actor from database as this one will not work

    { "existingActorId": "649872528eddf2a8e6be5bc0" }

    TODO: If you want to create new director with Movie, pass
    {
      "newDirectorDetails": {
        "name": "New Director"
    }
    Or, pass ID from the database to use existing director
    Please get a director from database as this one will not work

    { "existingDirectorId": "649872528eddf2a8e6be5bc0" }