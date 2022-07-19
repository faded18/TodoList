//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose=require("mongoose");

const app = express();

app.set('view engine', 'ejs');
mongoose.connect("mongodb://localhost:27017/todolistDB",{useNewUrlParser:true});
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// const items = ["Buy Food", "Cook Food", "Eat Food"];
// const workItems = [];


const itemSchema={
name:String

}

const Items=mongoose.model("Item",itemSchema);
const item1=new Items({
  name:"Welocme"
})
const item2=new Items({
  name:"Helo"
})
const item3=new Items({
  name:"Good morning"
})
const arrai=[item1,item2,item3];

const workSchema={
name:String,
work:[itemSchema]

}
const Work=mongoose.model('Work',workSchema);

app.get("/:customName",function(req,res){
const customName=req.params.customName;

Work.findOne({name:customName},function(err,elem){
if(!err){
  if(!elem){
    const list=new Work({
      name:customName,
      work:arrai
      
      })
      list.save()
      res.redirect("/" + customName)}
  else{
    res.render("list", {listTitle: elem.name, newListItems:elem.work })
  }}
}
)
})


app.get("/", function(req, res) {

const day = date.getDate();
Items.find({},function(err,foundelem){
if(foundelem.length===0){
  Items.insertMany(arrai,function(err){
    if(err){console.log(err);}
    else
    {console.log("Successfully added");}})
    res.redirect("/");}
else{
      res.render("list", {listTitle: day, newListItems:foundelem });
    }
  
  


})});


// MOngoose array dlete elem=pull method




app.post("/", function(req, res){

  const item = req.body.newItem;
const itemname= new Items({
  name:item
})
itemname.save();
res.redirect('/')
  
});



app.get("/about", function(req, res){
  res.render("about");
});
app.post('/delete',function(req,res){
const delet=req.body.check
Items.findByIdAndRemove(delet,function(err){
if(err){console.log(err)}else{
  console.log("deleted")
}
res.redirect('/')
})

})
app.listen(3000, function() {
  console.log("Server started on port 3000");
});
