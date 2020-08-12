// Importing DataBase model from model/greeting
const GreetingModel = require("../model/greeting.mdl");
const emit=require('../lib/emailutility')
const emitter=emit.emitter;
/**
 * It saves the greeting message into the database
 * @param {person} name  Its the greeting message followed by name of the person
 */
exports.saveMessage = (params,welcomeMessage) => {
  // console.log("Getting called from services" + params);
  // Took name as closure inside the generateMessage function and saving into the database
  let greetingmessage;
  async function generateMessage() {
    /**
     * Creating Object of the greeting Message
     */
     greetingmessage = new GreetingModel({
      firstname:params.name,
      lastname: params.sname,
      message: welcomeMessage,
    });
    /**
     * Saving the created Object into the database by using save function
     */
    const savedmessage = await greetingmessage.save();
 
    console.log(savedmessage);
    
  }

  // Calling the synchronous function above
  generateMessage();
  emitter.emit("sendEmail",JSON.stringify(greetingmessage)+'has been added');
};

/**
 * exporting the function to get all the names present in the data base
 */
exports.getNames =async (res) => {
  /**
   * Calling function which contains feature to get all the greeting
   * messages from the data base.
   */
    await GreetingModel.find({}).select('message')
      .then((data) => {
        res.send(data)
       
      })
      .catch((err) => {
       res.status(500).send("Error Occured while retrieving messages")
        debugger
      });

      emitter.emit("sendEmail",'All welcome messages are retrieved');
};


/**
 * 
 * @param {Http Request Object} req 
 * @param {Http Response Object} res 
 * @description Used to display welcomemessages based on ID supplied
 */

exports.getById=async (req,res)=>{
  const message=await GreetingModel.findById(req.params.id).then(data=>{
    // message=data.message

    res.send({message:data.message});
    console.log(data)
    console.log("Printing from service find by ID")
  emitter.emit("sendEmail",`details of ID ( ${req.params.id})  is been retrieved`);

  }
  ).catch(err=>{
    res.status(500).send("Not able to fetch Messages")
  });
}


exports.updatemessage= async (req,res)=>{
  const id=req.params.id
  const messages=req.params.message
  GreetingModel.findByIdAndUpdate(id,{"message":messages},function(err,result){
    if(err){
      res.status(500).send("Not able to update Message")
    }else{
      res.send(result)
      emitter.emit("sendEmail",`Welcome message of ID ( ${id}) is updated to ${messages} `);
    }
  })
 

}

exports.deleteID=async (req,res)=>{
    const id=req.params.id;
    GreetingModel.findByIdAndRemove(id,function(err,result){
      if(err){
        res.status(500).send("Not able to delete Message")
      }else{
        res.send(result);
        emitter.emit("sendEmail",`ID ( ${id}) is been deleted `);
      }
    })


}