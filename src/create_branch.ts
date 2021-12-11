import nodegit from "nodegit";

export default function create_branch(path, branch_name){
    open_repo(self, path)
        .then(async (repo)=>
            repo.createBranch(branch_name, await repo.getHeadCommit(), false)
                .then((branch)=>repo.checkoutBranch(branch))
                .then(()=>repo.getRemote('origin')))
        .then(remote=>remote.push(["refs/heads/" + branch_name + ":refs/heads/" + branch_name], self.git.build_remote_options().fetchOpts))
        .then(()=>console.log("Successfully created and pushed new branch '" + branch_name + "'"))
        .catch((e)=>{
            console.log("Error while creating new branch: " + e);
            return Promise.reject(e);
        });
}