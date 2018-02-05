let scope = {};

(scope=>{
    //let scope.smth will create "public" variable accessible by scope.smth
    //let smth will create local valiable not accessible in console

    console.log(2)    


})(scope);