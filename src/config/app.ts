// ici je mets tout en rapport avec les routes des APIS
import {authenticate} from "./db"

export function init(){
    authenticate();
}