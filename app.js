const Hapi = require('hapi');
const Joi = require('joi');
const Mongoose = require('mongoose');

const porta = process.env.PORT || 8080;

const server = new Hapi.Server({ "port": porta });

Mongoose.connect("mongodb+srv://avenger:avenger@cluster0-gpsta.mongodb.net/avengers?retryWrites=true&w=majority",  
{ 
    useNewUrlParser: true, 
    useUnifiedTopology: true
});

const PostModel = Mongoose.model("post", { 
    titulo: String,
    subTitulo: String,
    corpo: String,
    keyWords: [
        {
            keyWord: String
        }
    ],
    author: String,
    criadoEm: Date
})

server.route({
    method: "POST",
    path: "/post",
    options: {
        validate: {
            payload: {
                assunto: Joi.string().required(),
                corpo: Joi.string().required(),
                criadoEm: Joi.optional()
            }
        }
    },
    handler: async (request, h) => {
        try {
            request.payload.criadoEm = new Date();
            let post = new PostModel(request.payload);
            let result = await post.save();
            return h.response(result);
        } catch (error) {
            return h.response(error).code(500);
        }
    }
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
    path: "/post/{id}",
    handler: async (request, h) => {
        try {
            let post = await PostModel.findById(request.params.id).exec();
            return h.response(post);
        } catch (error) {
            return h.response(error).code(500);
        }
    }
})

server.start();