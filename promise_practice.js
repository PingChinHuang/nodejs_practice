//const promise = require('promise');

const promise = new Promise((resolveParam, rejectParam) => {
  //resolveParam(2);
  //rejectParam(new Error('error!'));
  throw new Error('rejected');
});

promise.then((value) => {
  console.log('1');
  console.log(value);
  return value + 1;
}).then((value) => {
    console.log('2');
  console.log(value);
  return value + 2;
}).catch((err) => {
  console.log(err.message);
}).then(value => {
    console.log('3');
  console.log(value);
  return value + 3;
});
