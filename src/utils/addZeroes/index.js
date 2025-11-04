const addZeroes =(num) => {
    var value = Number(num);      
    var res = num.split(".");     
    if(res.length == 1 || res[1].length < 3) { 
        value = value.toFixed(2);
    }
    return value;
}

export default addZeroes;