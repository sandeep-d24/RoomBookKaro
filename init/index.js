const mongoose= require("mongoose");
const initData= require("./data.js");
const Listing= require("../models/listing.js");

MONGO_URL="mongodb://127.0.0.1:27017/wanderlost";

main()
    .then(()=>{
        console.log("connected to DB");
    })
    .catch((err)=>{
        console.log(err);
    });

async function main(){
    await mongoose.connect(MONGO_URL);
}

const initDB= async()=>{
    await Listing.deleteMany({});
    initData.data= initData.data.map((obj)=> ({...obj, owner: "685025a278901b9bb20bed4f"}));
    await Listing.insertMany(initData.data);
    console.log("data was initialised");
};

initDB();