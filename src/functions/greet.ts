export const greet = (name: string): string => `Hello, ${name}!`;
export const greet_all =  function*(list:string[]){
    let itr = 0;
    for(;itr<list.length;itr++){
        yield greet(list[itr]);
    }
    return undefined;
 }
export default greet;
