import { useGroups } from "@/state/groups.js";
import { useProjects } from "@/state/projects.js";
import { useSpaces } from "@/state/spaces.js";
import { createViewResolver } from "../view-resolver-factory.js";

export default createViewResolver(async route => {
  const spaces = useSpaces();
  const projects = useProjects();
  const groups = useGroups();

  spaces.setCurrentSpace(+route.params.spaceID);
  projects.loadSpaceProjects(spaces.currentSpace.value);

  projects.setCurrentProject(+route.params.projectID);
  await projects.loadProjectUsers(projects.currentProject.value);
  await groups.loadProjectGroups(projects.currentProject.value);

  groups.setCurrentGroup(+route.params.groupID);
});
