var fs = require('fs');
var os = require('os');
var path = require('path');
var util = require('./ci-util');

// build only what's changed, do that later. It happens upstream anyways, not here.


// If this flag is set we want to stage the per task nuget files.
// After this is fully working we can refactor again and clean up all the aggregate code.
// Trying to make this code change in such a way that we only need to delete aggregate 
//      files later and not redo any of the nuget package per task code.
if (process.env.DISTRIBUTEDTASK_USE_PERTASK_NUGET) {
    console.log('> Zipping nuget package per task');

    // mkdir _package/per-task-layout
    console.log('> Creating folder _package/per-task-layout');
    fs.mkdirSync(util.perTaskLayoutPath);

    // TODO: Below this line needs to be refactored for the per task nuget setup.

    // TODO: I think we need to make changes here but start with this and see where it goes.
    console.log('> Linking aggregate layout content to per-task-layout path, may need to change this');
    util.linkAggregateLayoutContent(util.milestoneLayoutPath, util.perTaskLayoutPath, /*release:*/'', /*commit:*/refs.head.commit, taskDestMap);


    // Iterate all the folders inside util.perTaskLayoutPath and create a nuspec file, pack, and create push.cmd
    console.log('> Iterating all folders in per-task-layout');

    fs.readdirSync(util.perTaskLayoutPath) // walk each item in the aggregate layout
        .forEach(function (taskName) {
            var taskPath = path.join(util.perTaskLayoutPath, taskName);
            console.log('> Task path: ' + taskPath);

            // // create the nuspec file for task
            console.log();
            console.log('> Generating .nuspec file');

            // TODO: Also load from task.json
            var taskVersion = 00001;

            var contents = '<?xml version="1.0" encoding="utf-8"?>' + os.EOL;
            contents += '<package xmlns="http://schemas.microsoft.com/packaging/2010/07/nuspec.xsd">' + os.EOL;
            contents += '   <metadata>' + os.EOL;
            contents += '      <id>' + taskName + '</id>' + os.EOL;
            contents += '      <version>' + taskVersion + '</version>' + os.EOL;
            contents += '      <authors>bigbldt</authors>' + os.EOL;
            contents += '      <owners>bigbldt,Microsoft</owners>' + os.EOL;
            contents += '      <requireLicenseAcceptance>false</requireLicenseAcceptance>' + os.EOL;
            contents += '      <description>For VSS internal use only</description>' + os.EOL;
            contents += '      <tags>VSSInternal</tags>' + os.EOL;
            contents += '   </metadata>' + os.EOL;
            contents += '</package>' + os.EOL;

            // Careful, what about major version in folder names? Need to parse task.json and use that.... maybe
            var taskNuspecPath = path.join(taskPath, 'Mseng.MS.TF.Build.Tasks.' + taskName + '.nuspec');
            fs.writeFileSync(taskNuspecPath, contents);

            // // pack
            console.log('> packing nuget package for task ' + taskName);
            // fs.mkdirSync(util.publishLayoutPath);
            // process.chdir(util.publishLayoutPath);
            // util.run(`nuget pack "${util.aggregateNuspecPath}" -BasePath "${util.aggregatePackSourcePath}" -NoDefaultExcludes`, /*inheritStreams:*/true);

            // // create push.cmd
            console.log('> creating push.cmd for task ' + taskName);
            // fs.writeFileSync(util.publishPushCmdPath, `nuget.exe push Mseng.MS.TF.Build.Tasks.${process.env.AGGREGATE_VERSION}.nupkg -source "${process.env.AGGREGATE_TASKS_FEED_URL}" -apikey Skyrise`);





            // if (!fs.statSync(itemPath).isDirectory()) { // skip files
            //     return;
            // }

            // // load the task.json
            // var taskPath = path.join(itemPath, 'task.json');
            // var task = JSON.parse(fs.readFileSync(taskPath));
            // if (typeof task.version.Major != 'number') {
            //     throw new Error(`Expected task.version.Major/Minor/Patch to be a number (${taskPath})`);
            // }

            // util.assert(task.id, `task.id (${taskPath})`);
            // if (typeof task.id != 'string') {
            //     throw new Error(`Expected id to be a string (${taskPath})`);
            // }

            // // validate GUID + Major version is unique
            // var key = task.id + task.version.Major;
            // if (majorVersions[key]) {
            //     throw new Error(`Tasks GUID + Major version must be unique within the aggregate layout. Task 1: ${majorVersions[key]}; task 2: ${taskPath}`);
            // }

            // majorVersions[key] = taskPath;
        });


    console.log('> ');

    console.log('> ');

    console.log('> ');
}
