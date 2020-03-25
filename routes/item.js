const express = require('express');
const Artefact = require('../models/Artefact');
require('dotenv/config');


const router = express.Router();


router.post('/add', (req, res) => {
    const newArtefact = new Artefact(
        {
            name: req.body.name,
            description: req.body.description,
            materials: req.body.materials,
            location: req.body.location,
            tips: req.body.tips,
            image: req.body.image,
            ratings: {}
        }
    )
    newArtefact.save()
        .then(item => res.json(item))
        .catch(err => console.log(err))

});

router.get('/getAll', (req, res) => {
    Artefact.find()
        .then(artefacts => {
            if(artefacts){
                res.json(artefacts)
            }
            else{
                res.status(400).json({"message": "No artefacts found"})
            }
        })
        .catch(err => console.log(err))

});

router.post('/rate', (req, res) => {
    Artefact.findOne({
        name: req.body.name
    }).then (foundItem => {
        if(foundItem){
            foundItem.ratings.set(req.body.userID, req.body.userRating)
            foundItem.save()
                .then(item => res.json(item))
                .catch(err => console.log(err))
        }
        else{
            res.status(400).json({"message": "Artefact does not exist"})
        }
    })
});

router.post('/generate', (req, res) => {
    let alike = []; //stores the users with matched ratings
    let output = []; //stores the recomended artefact(s)
    Artefact.find({}, (err, result) => {
        if(err) {
            res.json(err)
        }
        else{
            const mainUser = req.body.userID
            for(let x in result){
                
                //alike.push(result[x].ratings)
                let ratingsMap = result[x].ratings
                //console.log(ratingsMap.get(`${mainUser}`))
                if(ratingsMap.has(mainUser)){
                    const mainUserRating = ratingsMap.get(`${mainUser}`);

                    //console.log(ratingsMap)
                    ratingsMap.forEach((value, key) => {
                        if (value == mainUserRating && key != mainUser){
                            alike.push([key, value])
                        }
                    });
                }   
            }

            for(let x in result){
                
                let ratingsMap = result[x].ratings
                //console.log(ratingsMap.get(`${mainUser}`))
                if (!(ratingsMap.has(mainUser))){
                    for (let ap in alike){
                        if (alike[ap][1] == ratingsMap.get(alike[ap][0])){
                            output.push(result[x].name)
                        }
                    }
                }
            }

            let uniqueOutput = (output) => output.filter((v,i) => output.indexOf(v) === i)
            res.json(uniqueOutput(output));
            //res.json(output)
        }
    })
});


module.exports = router;