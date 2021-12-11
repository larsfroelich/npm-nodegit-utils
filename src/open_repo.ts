const nodegit = require("nodegit");
import git_repository_cache from "./git_repository_cache";
import utils from "./utils";
import path from "path";

export default async function open_repo (repo_path : string) {
    repo_path = utils.clean_repository_path(repo_path);

    if(await git_repository_cache.exists_repository_by_path_in_cache(repo_path)){
        return git_repository_cache.get_repository_by_path(repo_path);
    }else{
        let repo = await nodegit.Repository.open(path.join(repo_path, "/.git"));
        if(repo_path.startsWith(process.env.REPOS_FOLDER_PATH)) {
            self.git.repos[
                repo_path
                    .replace(process.env.REPOS_FOLDER_PATH.endsWith("\\") ? process.env.REPOS_FOLDER_PATH : process.env.REPOS_FOLDER_PATH + "\\", "")
                    .replace("/.git/", "")
                    .replace("/git", "")
            ] = repo;
        }
        return repo;
    }
}