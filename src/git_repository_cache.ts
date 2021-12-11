import nodegit from "nodegit";
import fs from "fs/promises";
import path from "path";

// holds references to currently opened git repositories
const GIT_REPOSITORY_CACHE : { [key: string] : nodegit.Repository } = {};

// used to identify a repository uniquely in the filesystem
// checks for existence of the repository, then returns inode+partitionNr of the repository's index as string
async function folder_path_to_folder_id(cleaned_folder_path : string){
    let stat = await fs.stat(cleaned_folder_path);

    if (!stat.isDirectory())
        return Promise.reject("Path to repository is not a directory!");

    if(! await fs.stat(path.join(cleaned_folder_path, ".git", "index"))
            .then(res=>res.isFile())
            .catch(()=>{return false;}) )
        return Promise.reject("No repository found at path!");

    let index_stat = await fs.stat(path.join(cleaned_folder_path, ".git", "index"));

    // use a combination of the index file's inode and partition nr to uniquely identify this git-repo
    return index_stat.ino.toString() + index_stat.dev.toString();
}

// get a repository from cache by specifying its path
// expects path to be cleaned, rejects promise if repository doesn't exist in cache
async function get_repository_by_path(cleaned_folder_path : string){
    let folder_id = await folder_path_to_folder_id(cleaned_folder_path);
    if(Object.keys(GIT_REPOSITORY_CACHE).includes(folder_id))
        return Promise.resolve(GIT_REPOSITORY_CACHE[folder_id]);
    return Promise.reject("Repository not found in cache");
}

// set a repository in cache by specifying its path and its repository-object
// expects path to be cleaned, rejects promise if repository already exists in cache
async function set_repository_by_path(cleaned_folder_path : string){
    let folder_id = await folder_path_to_folder_id(cleaned_folder_path);
    if(Object.keys(GIT_REPOSITORY_CACHE).includes(folder_id))
        return Promise.resolve(GIT_REPOSITORY_CACHE[folder_id]);
    return Promise.reject("Repository not found in cache");
}

// clear repository from cache by specifying its path
// expects path to be cleaned, rejects promise if repository isn't found
async function clear_repository_by_path(cleaned_folder_path : string){
    let folder_id = await folder_path_to_folder_id(cleaned_folder_path);
    if(!Object.keys(GIT_REPOSITORY_CACHE).includes(folder_id))
        return Promise.resolve(true); // repository doesn't exist in cache, so it must already be cleared

    GIT_REPOSITORY_CACHE[folder_id].free()
    return Promise.reject("Repository not found in cache");
}

// get a repository from cache by specifying its path
// expects path to be cleaned, always resolves promise with either true or false respectively
async function exists_repository_by_path_in_cache(cleaned_folder_path : string){
    let folder_id = await folder_path_to_folder_id(cleaned_folder_path).catch(()=>"");
    return Object.keys(GIT_REPOSITORY_CACHE).includes(folder_id);
}

export default {
    get_repository_by_path: get_repository_by_path,
    set_repository_by_path: set_repository_by_path,
    clear_repository_by_path: clear_repository_by_path,
    exists_repository_by_path_in_cache: exists_repository_by_path_in_cache
};
