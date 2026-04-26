import type { Visa } from "../../generated/prisma/client";

export type VisaChainVisa = Pick<
  Visa,
  | "id"
  | "name"
  | "type"
  | "countries"
  | "expires"
  | "validFrom"
  | "renewedFromId"
>;

export type VisaChainGroup = {
  primary: VisaChainVisa;
  history: VisaChainVisa[];
};

const getPrimarySortValue = (visa: VisaChainVisa) =>
  visa.expires?.getTime() ?? Number.MAX_SAFE_INTEGER;

export const buildVisaChainGroups = (
  visas: VisaChainVisa[]
): VisaChainGroup[] => {
  const byId = new Map(visas.map((visa) => [visa.id, visa]));
  const referenced = new Set(
    visas.flatMap((visa) => (visa.renewedFromId ? [visa.renewedFromId] : []))
  );
  const visited = new Set<string>();
  const groups: VisaChainGroup[] = [];

  const addChain = (leaf: VisaChainVisa) => {
    if (visited.has(leaf.id)) {
      return;
    }

    const chain: VisaChainVisa[] = [leaf];
    visited.add(leaf.id);
    let current: VisaChainVisa = leaf;

    while (current.renewedFromId) {
      const previous = byId.get(current.renewedFromId);
      if (!previous || visited.has(previous.id)) {
        break;
      }
      chain.push(previous);
      visited.add(previous.id);
      current = previous;
    }

    groups.push({
      primary: chain[0],
      history: chain.slice(1),
    });
  };

  visas
    .filter((visa) => !referenced.has(visa.id))
    .forEach((leaf) => addChain(leaf));

  visas.forEach((visa) => addChain(visa));

  return groups.sort((left, right) => {
    const primaryDelta =
      getPrimarySortValue(right.primary) - getPrimarySortValue(left.primary);
    if (primaryDelta !== 0) {
      return primaryDelta;
    }

    const validFromDelta =
      right.primary.validFrom.getTime() - left.primary.validFrom.getTime();
    if (validFromDelta !== 0) {
      return validFromDelta;
    }

    return left.primary.name.localeCompare(right.primary.name);
  });
};
