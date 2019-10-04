const registry : Array<{[id:string]: any}> = [];

export function register(module:{[id:string]: any}) {
    registry.push(module);
}

export function getRegistered(): Array<{[id:string]: any}> {
    return registry;
}
