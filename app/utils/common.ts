export function btos(str: string) {
    return Buffer.from(str, 'base64').toString('utf8');
}

export function stob(str: string) {
    return Buffer.from(str).toString('base64');
}