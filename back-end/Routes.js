const apis = [
    {url:"/auth",path:"./v1/Authentication"},         // working on version 1 API
     {url: "/users",path: "./v1/Users"}     // working on version 1 API
]

const apiRoutes =(app)=>{

   return apis.map((module)=>app.use(module.url,require(module.path)));
};


module.exports = apiRoutes;