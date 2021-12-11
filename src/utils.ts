// correct typical mistakes in repository paths
function clean_repository_path(repository_path : string){
    repository_path = repository_path.replace(/\\/g, "\/")
        .replace("/.git/", "")
        .replace("/.git", "");

    if(repository_path.endsWith("\/"))
        repository_path = repository_path.slice(0, -1);

    return repository_path;
}

export default {
    clean_repository_path: clean_repository_path
};