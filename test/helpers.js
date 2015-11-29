// Shouldn't display the notifier's output during tests
process.env.DISABLE_NOTIFIER = true;

exports.copyAllProperties = function(src, dest) {
    var objectToInspect;
    var result = [];

    for(
        objectToInspect = src;
        objectToInspect !== null;
        objectToInspect = Object.getPrototypeOf(objectToInspect)) {
        result = result.concat(Object.getOwnPropertyNames(objectToInspect));
    }

    result.forEach(function(key) {
        if(key.slice(0, 2) === '__')
            return; // ignore things like __proto__

        dest[key] = src[key];
    });

    return dest;
};
