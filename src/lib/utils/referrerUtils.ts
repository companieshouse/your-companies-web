export const redirectPage = (referrer: string|undefined, hrefA:string, hrefC:string):boolean => {
    if (referrer === hrefA) {
        console.log("Returned false");
        return false;
    } else {
        console.log("Returned true");
        return true;
    }

};
