module.exports.copyAllProperties = function(src, dest) {
    const props = [];

    for(
        let objectToInspect = src;
        objectToInspect !== null;
        objectToInspect = Object.getPrototypeOf(objectToInspect)
    )
        Array.prototype.push.apply(props, Object.getOwnPropertyNames(objectToInspect));

    props.forEach(function(key) {
        if(key.slice(0, 2) === '__')
            return; // ignore things like __proto__

        dest[key] = src[key];
    });

    return dest;
};
