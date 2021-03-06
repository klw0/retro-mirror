/**
 * Converts a base64 encoded string to a byte array (Uint8Array).
 */
export function base64ToByteArray(base64) {
    let decodedData = atob(base64);
    let byteArray = new Uint8Array(decodedData.length);

    for (let i = 0; i < decodedData.length; i++) {
        byteArray[i] = decodedData.charCodeAt(i);
    }

    return byteArray;
}

/**
 * Converts a byte array (Uint8Array) to a base64 encoded string.
 */
export function byteArrayToBase64(byteArray) {
    let encodedData = '';

    for (let charCode of byteArray) {
        encodedData += String.fromCharCode(charCode);
    }

    return btoa(encodedData);
}
