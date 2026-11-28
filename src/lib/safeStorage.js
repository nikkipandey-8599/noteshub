export const readStorage=(key,fallback=null)=>{try{return localStorage.getItem(key)??fallback}catch{return fallback}};
export const writeStorage=(key,value)=>{try{localStorage.setItem(key,value);return true}catch{return false}};
