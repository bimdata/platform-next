import { reactive, readonly, toRefs } from "vue";
import OrganizationService from "@/services/OrganizationService.js";
import SubscriptionService from "@/services/SubscriptionService.js";
import { useOrganizations } from "@/state/organizations.js";
import { useSpaces } from "@/state/spaces.js";
import { delay } from "@/utils/async.js";

const state = reactive({
  currentOrga: null,
  currentSpace: null,
  organizationsSubscriptions: {},
  spacesSubscriptions: {}
});

const setCurrentOrga = id => {
  const { userOrganizations } = useOrganizations();
  const orga = userOrganizations.value.find(orga => orga.id === id);
  state.currentOrga = orga;
  return orga;
};

const setCurrentSpace = id => {
  const { userSpaces } = useSpaces();
  const space = userSpaces.value.find(space => space.id === id);
  state.currentOrga = space.organization;
  state.currentSpace = space;
  return space;
};

const loadOrganizationSubscriptions = async orga => {
  const subscriptions =
    await SubscriptionService.fetchOrganizationSubscriptions(orga);
  state.organizationsSubscriptions[orga.id] = subscriptions;
  return subscriptions;
};

const loadSpaceSubscriptions = async space => {
  const subscriptions = await SubscriptionService.fetchSpaceSubscriptions(
    space
  );
  state.spacesSubscriptions[space.id] = subscriptions;
  return subscriptions;
};

const loadAllSpacesSubscriptions = async () => {
  const { userOrganizations, getOrganizationSpaces } = useOrganizations();
  const spaces = userOrganizations.value.flatMap(orga =>
    getOrganizationSpaces(orga)
  );
  return (
    await Promise.all(spaces.map(space => loadSpaceSubscriptions(space)))
  ).reduce((acc, subscriptions) => acc.concat(subscriptions), []);
};

const loadSubscriptionPayments = (orga, space, subscription) => {
  return SubscriptionService.fetchSubscriptionPayments(
    orga,
    space,
    subscription
  );
};

const fetchSpaceInformation = space => {
  return SubscriptionService.fetchSpaceInformation(space);
};

const getSpaceSubscriptions = space => {
  return readonly(state.spacesSubscriptions[space?.id] || []);
};

const getSpaceActiveSubscription = space => {
  return getSpaceSubscriptions(space).find(sub => sub.status === "active");
};

const getPlatformSubscriptionLink = space => {
  return SubscriptionService.createPlatformSubscription(space);
};

/**
 * This method takes a space as a parameter and checks the list of spaces
 * of its organization every 2 seconds until one of them is found to have
 * the same name. As space names are unique in a given organization this
 * will mean that the space (given as a parameter) has been created.
 * Then it return that space.
 *
 * @param {Object} space
 * @returns {Object}
 */
const waitForCreatedSpace = async space => {
  let spaces = [];
  do {
    // Retrieve organization spaces from API
    spaces = await OrganizationService.fetchOrganizationSpaces(
      space.organization
    );
    await delay(2000); // wait 2s
  } while (!spaces.some(s => s.name === space.name));

  const newSpace = spaces.find(s => s.name === space.name);
  const { softCreateSpace } = useSpaces();
  softCreateSpace({ ...newSpace, isAdmin: true });

  return newSpace;
};

const createDatapackSubscription = (space, quantity) => {
  return SubscriptionService.createDatapackSubscription(space, quantity);
};

const updateDatapackSubscription = (space, datapack, quantity) => {
  return SubscriptionService.updateDatapackSubscription(
    space,
    datapack,
    quantity
  );
};

export function useSubscriptions() {
  const readonlyState = readonly(state);
  return {
    // References
    ...toRefs(readonlyState),
    // Methods
    setCurrentOrga,
    setCurrentSpace,
    loadOrganizationSubscriptions,
    loadSpaceSubscriptions,
    loadAllSpacesSubscriptions,
    loadSubscriptionPayments,
    fetchSpaceInformation,
    getSpaceSubscriptions,
    getSpaceActiveSubscription,
    getPlatformSubscriptionLink,
    waitForCreatedSpace,
    createDatapackSubscription,
    updateDatapackSubscription
  };
}
