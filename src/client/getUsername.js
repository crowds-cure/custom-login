import { animals, adjectives } from './animalsAdjectives.js';

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

function getUsername() {
    var randomAnimalIndex = Math.floor(getRandomArbitrary(0, animals.length));
    var randomAdjIndex = Math.floor(getRandomArbitrary(0, adjectives.length));
    var name = adjectives[randomAdjIndex] + '.' + animals[randomAnimalIndex];

    return name.replace(/[-_ ]/g, ".").toLowerCase();;
}

export default getUsername;