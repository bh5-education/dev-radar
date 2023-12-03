const axios = require('axios');
const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parserStringAsArray');

// Funções : INDEX, SHOW, STORE, UPDATE, DESTROY

module.exports = {
    async index(request, response){
        const devs = await Dev.find();

        return response.json(devs);
    },

    // Cria um novo Dev caso não exista
    async store(request, response){
        const { github_username, techs, latitude, longitude } =  request.body;

        let dev = await Dev.findOne({github_username});

        if(!dev){
            const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`);
    
            const {name = login, avatar_url, bio} = apiResponse.data;
    
            const techsArray = parseStringAsArray(techs);
    
            const location = {
                type : 'Point',
                coordinates : [longitude, latitude],
            };
    
            dev = await Dev.create({
                github_username,
                name,
                avatar_url,
                bio,
                techs : techsArray,
                location,
            });
        }
    
        return response.json(dev);
    },

    // Em Desenvolvimento !!
    async update(request, response){
        const { github_username, techs, latitude, longitude } = request.body;

        let dev = await Dev.findOne({github_username});

        if(dev){
            const techsArray = parseStringAsArray(techs);

            const location = {
                type : 'Point',
                coordinates : [longitude, latitude],
            };

            dev = await Dev.update(
                {github_username},
                {
                    $set: {"techs" : techsArray, "location" : location},
                },
            );
        }
        return response.json(dev);
    },

    // Em Desenvolvimento !!
    async destroy(){

    },
};