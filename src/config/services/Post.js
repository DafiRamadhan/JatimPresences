import axios from 'axios';
import {fetch} from 'react-native-ssl-pinning';
import {RootPathJP, HeadersAPIJP} from './Config';
import {JSHmac, CONSTANTS} from 'react-native-hash';
import base64 from 'react-native-base64';

const Post = (path, data) => {
  return new Promise((resolve, reject) => {
    let timest = new Date().getTime();
    //console.log('MENTAH : ',JSON.stringify(data).replace(/\s/g, '').replace(/\r?\n|\r/g,"").toUpperCase().replace(/\\\//g, "") + timest)
    JSHmac(
      JSON.stringify(data)
        .replace(/\s/g, '')
        .replace(/\r?\n|\r/g, '')
        .toUpperCase()
        .replace(/\\\//g, '') + timest,
      '7pgkr6wtdzDOSnB7k9ZqDPEjSlubFLAkhpqKUdKcotr8aCNiJegMg9SGtHyGfD',
      CONSTANTS.HmacAlgorithms.HmacSHA256,
    ).then(HMAC => {
      // console.log(`${RootPathJP}${path}`)
      // console.log('BodyData : ',JSON.stringify(data))
      axios({
        method: 'POST',
        url: `${RootPathJP}${path}`,
        headers: {
          Accept: 'application/json',
          Authorization: 'Basic SkFUSU1QUkVTRU5DRTo4bUczSCohYyMz',
          'X-Signature': HMAC.toUpperCase(),
          'X-Timestamp': timest.toString(),
        },
        data: data,
        timeout: 30000,
      })
        .then(ResponseJson => {
          resolve(ResponseJson.data);
        })
        .catch(err => reject(err));
    });
  });
};

export default Post;
