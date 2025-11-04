import axios from 'axios'
import {RootPathGoogleAddress} from './Config'

const Get = (type,path) => {
    let promise = ''
    if (type === 1){
        promise = new Promise((resolve,reject) => {            
            axios({
                method: 'GET',
                url: `${RootPathGoogleAddress}${path}`,
                })
                .then((ResponseJson) => {
                    // console.log(ResponseJson.data)
                    resolve(ResponseJson.data)    
                }),(err) => {
                    reject(err);
                }
        })
    }
    return promise ;
}

export default Get;