const express = require('express');
const User = require('../models/User');
const Artefact = require('../models/Artefact');
require('dotenv/config');
//const Item = require('../models/Item');

const router = express.Router();


router.post('/add', (req, res) => {
    const newArtefact = new Artefact(
        {
            name: req.body.name,
            ratings: {}
        }
    )
    newArtefact.save()
        .then(item => res.json(item))
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

            res.json(output)
        }
    })
});

/*
//adding a new item
router.post('/:userId', (req, res) => {
    User.findOne({_id: req.params.userId}).then( foundUser => {
        const newPost = new Item({
            name: req.body.name,
            category: req.body.category,
            warrantyPeriod: req.body.warrantyPeriod,
            sellerName: req.body.sellerName,
            sellerEmail: req.body.sellerEmail,
            amount: req.body.amount,
            location: req.body.location,
            user: foundUser
        })
        newPost
        .save()
        .then(item => res.json(item))
        .catch(err => console.log(err))
    })
    
 });

 //getting all itme of the user
router.get('/:userId', (req, res) => {
    User.findOne({_id: req.params.userId}).then( foundUser => {
        
        Item.find({user : foundUser})
        .then(items => res.json({"items" : items}))
        .catch(err => console.log(err))
    })
    
});

//getting one item by id
router.get('/one/:itemId', (req, res) => {
    Item.findOne({_id: req.params.itemId})
        .then( item => res.json(item))
        .catch(err => console.log(err))
});

//delete an item
router.delete('/:itemId', (req, res) => {
    Item.remove({_id : req.params.itemId})
        .then(item => res.json(item))
        .catch(err => console.log(err))
    }
);

//update an item
router.patch('/:itemId', (req, res) => {
    Item.update(
                    {_id : req.params.itemId}, 
                    {$set: 
                        {name: req.body.name,
                        category: req.body.category,
                        warrantyPeriod: req.body.warrantyPeriod,
                        sellerName: req.body.sellerName,
                        sellerEmail: req.body.sellerEmail,
                        amount: req.body.amount}
                    }
                )
        .then(item => res.json(item))
        .catch(err => console.log(err))
    }
);
*/


module.exports = router;