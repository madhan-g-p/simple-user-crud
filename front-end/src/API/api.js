
export const fetchData = async(...payload) => {
   
    return await new Promise(async(resolve,reject)=>{
                await fetch(...payload)
                        .then((res)=>res.json())
                        .then(resolve)
                        .catch(resolve)
            })
}