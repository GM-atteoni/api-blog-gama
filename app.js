const Hapi = require('hapi');
const Joi = require('joi');
const Mongoose = require('mongoose');

const server = new Hapi.Server({ "host": "localhost", "port": 3000 });

Mongoose.connect("mongodb+srv://avenger:avenger@cluster0-gpsta.mongodb.net/avengers?retryWrites=true&w=majority",  
{ 
    useNewUrlParser: true, 
    useUnifiedTopology: true
});

const db = Mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Conected');
});

const PostModel = Mongoose.model("post", { 
    assunto: String,
    corpo: String,
    criadoEm: Date
})

server.route({
    method: "GET",
    path: "/posts",
    handler: async (request, h) => {
        try {
            let posts = await PostModel.find().exec();
            return h.response(posts);
        } catch (error) {
            return h.response(error).code(500);
        }
    }
})

server.route({
    method: "GET",
    path: "/posts/{id}",
    handler: async (request, h) => {
        try {
            let post = await await PostModel.findById(request.params.id).exec();
            return h.response(post);
        } catch (error) {
            return h.response(error).code(500);
        }
    }
})

server.start();