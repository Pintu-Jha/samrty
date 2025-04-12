export default THEME_COLOR = 'light'


export const DataMode = {
  LOCAL: 'local',
  REMOTE: 'remote'
};

export const SearchMode = {
  CONTAINS: 'contains',
  STARTS_WITH: 'startsWith',
  EXACT: 'exact'
};
  
  // Cache strategy: store in memory or in AsyncStorage
  export const CacheStrategy = {
    NONE: 'none',
    MEMORY: 'memory',
    STORAGE: 'storage',
  };
  
  // Some numeric defaults
  export const PAGE_SIZE = 20;          
  export const API_TIMEOUT = 10000;      
  export const MAX_RETRIES = 3;        
  export const RETRY_DELAY = 1000;   
  export const CACHE_EXPIRY = 1000 * 60 * 5; 
  export const DEBOUNCE_DELAY = 300;

