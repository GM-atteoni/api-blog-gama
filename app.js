const Hapi = require('hapi');
const Joi = require('joi');
const Mongoose = require('mongoose');

const porta = process.env.PORT || 8080;

const server = new Hapi.Server({ "port": porta, routes: { cors: true } });

Mongoose.connect('mongodb+srv://avenger:avenger@cluster0-gpsta.mongodb.net/avengers?retryWrites=true&w=majority',  
{ 
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useFindAndModify: false 
});

const PostModel = Mongoose.model("post", { 
    titulo: String,
    subTitulo: String,
    corpo: String,
    keyWord: String,
    author: String,
    criadoEm: Date
})

server.route({
    method: "POST",
    path: "/post",
    options: {
        validate: {
            payload: {
                titulo: Joi.string().required(),
                subTitulo: Joi.string().required(),
                corpo: Joi.string().required(),
                author: Joi.string().required(),
                keyWord: Joi.string().required(),
                criadoEm: Joi.optional()    
            },
            failAction: (request, h, error) => {
                return error.isJoi ? h.response(error.details[0]).takeover() : h.response(error).takeover();
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
    method: "PUT",
    path: "/post/{id}",
    options: {
        validate: {
            payload: {
                titulo: Joi.string().optional(),
                subTitulo: Joi.string().optional(),
                corpo: Joi.string().optional(),
                author: Joi.string().optional(),
                keyWord: Joi.string().optional(),
                criadoEm: Joi.optional()    
            },
            failAction: (request, h, error) => {
                return error.isJoi ? h.response(error.details[0]).takeover() : h.response(error).takeover();
            }
        }
    },
    handler: async (request, h) => {
        try {
            request.payload.criadoEm = new Date();
            let posts = await PostModel.findByIdAndUpdate(request.params.id, request.payload, {new: true}).exec();
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

server.route({
    method: "DELETE",
    path: "/post/{id}",
    handler: async (request, h) => {
        try {
            let post = await PostModel.findByIdAndDelete(request.params.id).exec();
            return h.response(post);
        } catch (error) {
            return h.response(error).code(500);
        }
    }
})

server.start();