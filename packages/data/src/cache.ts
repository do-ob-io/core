import { cachify } from '@do-ob/core';

export enum CACHE {
  SYSTEM = 'SYSTEM',
  ASSIGNMENT_PREFIX = 'ASSIGNMENT_',
  ROLES_PREFIX = 'ROLES_',
  PERMITS_PREFIX = 'PERMITS_',
}

export const cacheKey = {
  system() {
    return CACHE.SYSTEM;
  },
  assignments($subject: string) {
    return `${CACHE.ASSIGNMENT_PREFIX}${$subject}`;
  },
  roles($subject: string) {
    return `${CACHE.ROLES_PREFIX}${$subject}`;
  },
  permits($subject: string) {
    return `${CACHE.PERMITS_PREFIX}${$subject}`;
  }
};

export const cache = cachify();
