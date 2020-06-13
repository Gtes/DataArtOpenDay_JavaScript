'use strict'

const users = [{
    id: 'as23',
    nick: 'Octopus',
    firstName: 'John',
    LastName: 'Dou'
}, {
    id: 'as25',
    nick: 'Star',
    firstName: 'Andy',
    LastName: 'Lee'
}, {
    id: 'as77',
    nick: 'Wally',
    firstName: 'Liza',
    LastName: 'Corty'
}]


function arrToObj(arr) {
    const resultObj = {}

    for (let arrElement of arr) {
        resultObj[arrElement.id] = arrElement;
    }

    return resultObj;
}

console.log(arrToObj(users));