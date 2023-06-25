export namespace Env {
    export let TEST: boolean = false;
    export const DEBUG: boolean = true;
    export const PORT: number = 8088;
    export const HOST: string = "localhost";
    export const ROOT_DIR: string = __dirname;
    export const STORAGE: string = "memory" // "local" - save in local files | "memory" - save in memory (with Map<>)
    export const STORAGE_DIR: string = ROOT_DIR + "/storage";
}