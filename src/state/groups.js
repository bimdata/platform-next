import { reactive, readonly, toRefs } from "vue";
import GroupService from "@/services/GroupService.js";

const state = reactive({
  projectGroups: [],
  currentGroup: null
});

const setCurrentGroup = id => {
  state.currentGroup =
    state.projectGroups.find(group => group.id === id) || null;
  return readonly(state.currentGroup);
};

const loadProjectGroups = async project => {
  let groups = [];
  if (project.isAdmin) {
    groups = await GroupService.fetchProjectGroups(project);
    groups.sort((a, b) => (a.name < b.name ? -1 : 1));
  }
  state.projectGroups = groups;
  return groups;
};

const createGroup = async (project, group) => {
  const newGroup = await GroupService.createGroup(project, group);
  state.projectGroups = [newGroup].concat(state.projectGroups);
  return newGroup;
};

const updateGroup = async (project, group) => {
  const newGroup = await GroupService.updateGroup(project, group);
  softUpdateGroup(newGroup);
  return newGroup;
};

const addGroupMembers = async (project, group, membersToAdd) => {
  const addedMembers = await GroupService.addGroupMembers(
    project,
    group,
    membersToAdd
  );
  const members = group.members.concat(addedMembers);
  softUpdateGroup({ ...group, members });
  return addedMembers;
};

const removeGroupMembers = async (project, group, membersToRemove) => {
  const removedMembers = await GroupService.removeGroupMembers(
    project,
    group,
    membersToRemove
  );
  const removedMemberIDs = removedMembers.map(member => member.id);
  const members = group.members.filter(
    member => !removedMemberIDs.includes(member.id)
  );
  softUpdateGroup({ ...group, members });
  return removedMembers;
};

const updateGroupMembers = async (project, group, members) => {
  const oldMemberIDs = group.members.map(member => member.id);
  const newMemberIDs = members.map(member => member.id);

  // Add members that are in new list but were not in old list
  const membersToAdd = members.filter(
    member => !oldMemberIDs.includes(member.id)
  );
  const addedMembers = await GroupService.addGroupMembers(
    project,
    group,
    membersToAdd
  );

  // Remove members that were in old list but are not in new list
  const membersToRemove = group.members.filter(
    member => !newMemberIDs.includes(member.id)
  );
  const removedMembers = await GroupService.removeGroupMembers(
    project,
    group,
    membersToRemove
  );

  softUpdateGroup({ ...group, members });
  return { addedMembers, removedMembers };
};

const updateGroupPermission = async (project, folder, group, permission) => {
  return await GroupService.updateGroupPermission(
    project,
    folder,
    group,
    permission
  );
};

const softUpdateGroup = group => {
  state.projectGroups = state.projectGroups.map(g =>
    g.id === group.id ? { ...g, ...group } : g
  );
  return group;
};

const deleteGroup = async (project, group) => {
  await GroupService.deleteGroup(project, group);
  softDeleteGroup(group);
  return group;
};

const softDeleteGroup = group => {
  state.projectGroups = state.projectGroups.filter(g => g.id !== group.id);
  return group;
};

export function useGroups() {
  const readOnlyState = readonly(state);
  return {
    // References
    ...toRefs(readOnlyState),
    // Methods
    setCurrentGroup,
    loadProjectGroups,
    createGroup,
    updateGroup,
    addGroupMembers,
    removeGroupMembers,
    updateGroupMembers,
    updateGroupPermission,
    softUpdateGroup,
    deleteGroup,
    softDeleteGroup
  };
}
