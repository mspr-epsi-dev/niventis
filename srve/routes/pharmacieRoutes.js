const express = require('express');
const router = express.Router();
const Pharmacie = require('../models/pharmacieModel');
const route = require('./routeProperties');
const pharmacieMockup = require('../test/pharmacieMockup.json');

var contentTypeJson = {"Content-Type": "application/json"};

//save body of the request as an pharmacie entity
/**
 * @body (req.body) : JSON object
 */
router.post(route.pharmacies, (req, res) => {

    try {

        var pharmacie = new Pharmacie(req.body);
    
        pharmacie.save((err, doc) => {
    
            if(err){
    
                if(err.name){

                    var msg = "the ressource you sent is incorrectly formed";
                    res.status(400, contentTypeJson).send({message :msg});
                    
                }
    
            }else{

                var msg = "Pharmacie successfuly added !";
                res.status(200, contentTypeJson).send({message : msg, doc});
    
            }
    
        });

    } catch (err) {
        
        var msg = "something wen wrong on our side... sorry duuuuude";
        res.status(500, contentTypeJson).send({message : msg, error});

    }

});

//return all pharmacies in the database
router.get(route.pharmacies, (req, res) => {
    
    Pharmacie.find({}, (error, doc) => {
        if(error){

            res.status(500, contentTypeJson).send(err);

        }else{
            
            if(doc){
                
                res.status(200, contentTypeJson).send(doc)
                
            }else{

                var msg = "No pharmacie found";
                res.status(404, contentTypeJson).send({message :msg});

            }
        }

    })


});

//return pharmacie corresponding to the id specified in the request paramater
router.get(route.pharmacies + "/:id", (req, res) => {
    
    var id = req.params.id;

    Pharmacie.findById(id, (err,doc) => {

        if(err){

            var msg = "incorrect pharmacie id, check the id property";
            res.status(400, contentTypeJson).send({message :msg});

        }else{

            if(doc){

                res.status(200, contentTypeJson).send(doc);

            }else{

                var msg = "No pharmacie found, check the id property";
                res.status(404, contentTypeJson).send({message :msg});

            }

        }

    });


});

//update pharmacie entity with the body of the request, using the request parameter to target it
/**
 * @requestParam : id => id of the entity to update
 * @return(body of the response) : JSON => return the updated document
 */
router.put(route.pharmacies + "/:id", (req, res) => {

    var id = req.params.id

    //check if there is a query parameter
    if(!id || typeof id == 'undefined'){
        
        var msg = "missing id parameter in request";
        res.status(400, contentTypeJson).send({message :msg});

    } else {

        //first check if the id exist on database
        Pharmacie.findById(id, (err,doc) => {

            if(err){
    
                var msg = "incorrect pharmacie id, check the id property";
                res.status(400, contentTypeJson).send({message :msg});
    
            }else if(!doc){

                var msg = "No pharmacie found, check the id property";
                res.status(400, contentTypeJson).send({message :msg});
                
            } else {

                //if the id exist, it's been updated
                Pharmacie.findOneAndUpdate(req.query.id, req.body,{new: true}, (err, doc) => {

                    if(err){
        
                        var msg = "something went wrong while trying to update document";
                        res.status(500, contentTypeJson).send({message :msg});
        
                    } else {

                        var doesExist = true;
                        //check if req.body field exist in schema, if not doesExist => false
                        for(var property in req.body){
                            if( !pharmacieMockup.hasOwnProperty(property) ){

                                doesExist = false;

                            }
                            
                        }

                        if(doesExist == false){

                            var msg = "the ressource you sent is incorrectly formed";
                            res.status(400, contentTypeJson).send({ message :msg });

                        } else {

                            var msg = "successfully updated document !";
                            res.status(200, contentTypeJson).send({message :msg, newDocument: doc});

                        }
                        
                    }
        
                });

            }
    
        });

    }

})

router.delete(route.pharmacies + "/:id", (req,res) => {

    var id = req.params.id;

    Pharmacie.findOneAndDelete({_id: id}, (err, doc) =>{

        if(err){

            var msg = "the id is incorrectly formed";
            res.status(400, contentTypeJson).send({message :msg, error : err});

        }else{

            if(doc){

                var msg = "Pharmacie successfuly deleted !";
                res.status(200, contentTypeJson).send({message :msg});

            }else{

                var msg = "Pharmacie id doesn't exist or has been already deleted";
                res.status(404, contentTypeJson).send({message :msg});

            }

        }
    });

});

module.exports = router;