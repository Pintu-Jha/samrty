import debounce from 'lodash/debounce';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNetworkStatus } from '../../provider/NetworkStatusProvider';
import CacheManager from '../../utils/cacheManager';
import {
  API_TIMEOUT,
  CACHE_EXPIRY,
  DataMode,
  DEBOUNCE_DELAY,
  MAX_RETRIES,
  PAGE_SIZE,
  RETRY_DELAY,
  SearchMode,
} from '../../utils/constant';
import { parseResponse } from '../../utils/helperFunctions';

export const useSearch = ({
  initialData = [],
  searchKeys = [],
  searchMode = SearchMode.CONTAINS,
  caseSensitive = false,
  filterFunction,
  sortResults = false,
  dataMode = DataMode.LOCAL,
  fetchDefaultData,
  fetchSearchResults,
  onSearchChange,
  enableCache = true,
  cacheStrategy = 'memory',
  cacheExpiry = CACHE_EXPIRY,
  transformResult,
  timeout = API_TIMEOUT,
  retryCount = MAX_RETRIES,
  retryDelay = RETRY_DELAY,
  onError,
  onInitialLoad,
  minCharacters = 1,
  showAllDataOnEmptyQuery = false,
  selectedFilter,
}) => {
  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [defaultData, setDefaultData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [defaultDataPage, setDefaultDataPage] = useState(1);
  const [hasMoreDefaultData, setHasMoreDefaultData] = useState(true);
  const [isLoadingMoreDefaultData, setIsLoadingMoreDefaultData] =
    useState(false);
  const [cacheStats, setCacheStats] = useState(null);

  // Refs
  const isConnected = useNetworkStatus();
  const abortControllerRef = useRef(null);
  const isMountedRef = useRef(true);
  const initialDataRef = useRef(initialData);
  const totalItemsRef = useRef(0);
  const latestQueryRef = useRef(searchQuery);
  const selectedFilterRef = useRef(selectedFilter);

  useEffect(() => {
    initialDataRef.current = initialData;
    if (dataMode === DataMode.LOCAL) {
      setDefaultData(initialData);
      if (!searchQuery.trim()) {
        setSearchResults(initialData);
      }
    }
  }, [initialData, dataMode, searchQuery]);

  // Always update latest query
  useEffect(() => {
    latestQueryRef.current = searchQuery;
  }, [searchQuery]);

  // Cache helpers
  const getCachedResults = useCallback(
    async (query, page) => {
      if (!enableCache) return null;
      const cacheKey = `${query}_${page}`;
      return CacheManager.get(cacheKey, cacheStrategy);
    },
    [enableCache, cacheStrategy],
  );

  const setCachedResults = useCallback(
    async (query, page, data) => {
      if (!enableCache) return;
      const cacheKey = `${query}_${page}`;
      await CacheManager.set(cacheKey, data, cacheStrategy, cacheExpiry);
    },
    [enableCache, cacheStrategy, cacheExpiry],
  );

  const updateCacheStats = useCallback(async () => {
    if (!enableCache) return;
    const stats = await CacheManager.getStats(cacheStrategy);
    setCacheStats(stats);
  }, [enableCache, cacheStrategy]);

  // Local search implementation
  const localSearch = useCallback(
    (text, sourceData, page = 1) => {
      if (!sourceData?.length) return {results: [], hasMore: false};

      const compareText = caseSensitive ? text : text.toLowerCase();
      let filteredResults = sourceData.filter(item =>
        searchKeys.some(key => {
          const itemValue = String(item[key] || '');
          const compareValue = caseSensitive
            ? itemValue
            : itemValue.toLowerCase();

          switch (searchMode) {
            case SearchMode.STARTS_WITH:
              return compareValue.startsWith(compareText);
            case SearchMode.EXACT:
              return compareValue === compareText;
            default:
              return compareValue.includes(compareText);
          }
        }),
      );

      if (filterFunction) {
        filteredResults = filterFunction(filteredResults);
      }

      if (sortResults) {
        filteredResults.sort((a, b) =>
          String(a[searchKeys[0]]).localeCompare(String(b[searchKeys[0]])),
        );
      }

      const startIndex = (page - 1) * PAGE_SIZE;
      const endIndex = startIndex + PAGE_SIZE;
      const paginatedResults = filteredResults.slice(startIndex, endIndex);
      const hasMore = endIndex < filteredResults.length;

      return {results: paginatedResults, hasMore};
    },
    [caseSensitive, filterFunction, searchKeys, searchMode, sortResults],
  );

  // API request helper with retry logic
  const makeRequest = useCallback(
    async (requestFn, ...args) => {
      let lastError;
      for (let i = 0; i <= retryCount; i++) {
        try {
          console.log(...args);

          const response = await Promise.race([
            requestFn(...args),
            new Promise((_, reject) =>
              setTimeout(() => reject(new Error('Request timeout')), timeout),
            ),
          ]);
          const normalizedResponse = parseResponse(response);
          return normalizedResponse;
        } catch (err) {
          lastError = err;
          if (i < retryCount) {
            await new Promise(resolve =>
              setTimeout(resolve, retryDelay * (i + 1)),
            );
          }
        }
      }
      throw lastError;
    },
    [retryCount, retryDelay, timeout],
  );

  // Load default data (with pagination)
  const loadDefaultData = useCallback(
    async (page = defaultDataPage, loadingMore = false) => {
      if (!isConnected && dataMode === DataMode.REMOTE) {
        setError('No internet connection');
        return;
      }

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      const controller = new AbortController();
      abortControllerRef.current = controller;

      if (!loadingMore) setIsLoading(true);
      else setIsLoadingMoreDefaultData(true);

      try {
        let results, hasMore, total;

        if (dataMode === DataMode.LOCAL) {
          const startIndex = (page - 1) * PAGE_SIZE;
          const endIndex = startIndex + PAGE_SIZE;
          results = initialDataRef.current.slice(startIndex, endIndex);
          total = initialDataRef.current.length;
          hasMore = endIndex < total;
        } else if (fetchDefaultData) {
          const response = await makeRequest(
            fetchDefaultData,
            page,
            PAGE_SIZE,
            controller.signal,
          );
          results = response.results;
          hasMore = response.hasMore;
          total = response.total;
        } else {
          results = [];
          hasMore = false;
          total = 0;
        }

        if (!isMountedRef.current) return;
        if (transformResult) results = results.map(transformResult);

        setDefaultData(prev => (page === 1 ? results : [...prev, ...results]));
        totalItemsRef.current = total;
        setHasMoreDefaultData(hasMore);
        onInitialLoad?.(results, total);
      } catch (err) {
        if (!isMountedRef.current) return;
        if (err.name === 'AbortError') return;
        const errorMessage = err.message || 'Failed to load default data';
        setError(errorMessage);
        onError?.(errorMessage);
      } finally {
        if (!isMountedRef.current) return;
        loadingMore ? setIsLoadingMoreDefaultData(false) : setIsLoading(false);
      }
    },
    [
      dataMode,
      defaultDataPage,
      fetchDefaultData,
      isConnected,
      makeRequest,
      onError,
      onInitialLoad,
      transformResult,
    ],
  );

  // Create the debounced search function only once using a ref.
  // This function contains the full search logic (both local and remote).
  const debouncedSearchRef = useRef(null);
  if (!debouncedSearchRef.current) {
    debouncedSearchRef.current = debounce(
      async (text, page = 1, loadingMore = false) => {
        const trimmedText = text.trim();
        console.log('Current filter:', selectedFilterRef.current);


        // Check if the query length is below the threshold.
        if (trimmedText.length < minCharacters && !selectedFilterRef.current) {
          setSearchResults([]);
          setHasMoreData(false);
          if (!loadingMore) setIsLoading(false);
          else setIsLoadingMore(false);
          return;
        }

        if (!isConnected && dataMode === DataMode.REMOTE) {
          setError('No internet connection');
          if (!loadingMore) setIsLoading(false);
          else setIsLoadingMore(false);
          return;
        }

        // Abort any previous search.
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }
        const controller = new AbortController();
        abortControllerRef.current = controller;

        if (!loadingMore) setIsLoading(true);
        else setIsLoadingMore(true);
        setError(null);

        // For local mode, use the local search function.
        if (dataMode === DataMode.LOCAL) {
          const {results, hasMore} = localSearch(
            trimmedText,
            initialDataRef.current,
            page,
          );
          if (trimmedText !== latestQueryRef.current) return;
          setSearchResults(prev =>
            page === 1 ? results : [...prev, ...results],
          );
          setHasMoreData(hasMore);
          setIsLoading(false);
          onSearchChange?.(results, trimmedText);
          return;
        }

        // For remote mode:
        try {
          const cachedResults = await getCachedResults(trimmedText, page);
          if (cachedResults) {
            if (trimmedText !== latestQueryRef.current) return;
            setSearchResults(prev =>
              page === 1
                ? cachedResults.data.data
                : [...prev, ...cachedResults.data.data],
            );
            setHasMoreData(cachedResults.hasMore);
            await updateCacheStats();
            loadingMore ? setIsLoadingMore(false) : setIsLoading(false);
            onSearchChange?.(cachedResults.data, trimmedText);
            return;
          }

          // Pass the current value of selectedFilter via the ref.
          const response = await makeRequest(
            fetchSearchResults,
            trimmedText,
            page,
            PAGE_SIZE,
            controller.signal,
            selectedFilterRef.current,
          );

          let {results, hasMore} = response;
          if (trimmedText !== latestQueryRef.current) return;

          if (transformResult) {
            results = results.map(transformResult);
          }
          await setCachedResults(trimmedText, page, {data: results, hasMore});
          setSearchResults(prev =>
            page === 1 ? results : [...prev, ...results],
          );
          setHasMoreData(hasMore);
          onSearchChange?.(results, trimmedText);
          await updateCacheStats();
        } catch (err) {
          if (!isMountedRef.current) return;
          if (err.name === 'AbortError') return;
          const errorMessage = err.message || 'Search failed';
          setError(errorMessage);
          onError?.(errorMessage);
        } finally {
          if (!isMountedRef.current) return;
          loadingMore ? setIsLoadingMore(false) : setIsLoading(false);
        }
      },
      DEBOUNCE_DELAY,
    );
  }

  // Handler to load more search results (pagination)
  const loadMoreResults = useCallback(() => {
    if (!isLoadingMore && hasMoreData) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      debouncedSearchRef.current(searchQuery, nextPage, true);
    }
  }, [currentPage, hasMoreData, isLoadingMore, searchQuery]);

  // Handler to load more default data (pagination)
  const loadMoreDefaultData = useCallback(() => {
    if (!isLoadingMoreDefaultData && hasMoreDefaultData) {
      const nextPage = defaultDataPage + 1;
      setDefaultDataPage(nextPage);
      loadDefaultData(nextPage, true);
    }
  }, [
    defaultDataPage,
    hasMoreDefaultData,
    isLoadingMoreDefaultData,
    loadDefaultData,
  ]);


  // Listen for changes in the search query.
  // Instead of re-creating the debounced function, we call the stable one from our ref.
  useEffect(() => {
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery.length >= minCharacters || selectedFilterRef.current) {
      setCurrentPage(1);
      debouncedSearchRef.current(trimmedQuery, 1, false);
    } else {
      if (dataMode === DataMode.LOCAL) {
        setSearchResults(initialDataRef.current);
        setHasMoreData(false);
      } else if (dataMode === DataMode.REMOTE && !showAllDataOnEmptyQuery) {
        setSearchResults([]);
        setHasMoreData(false);
      } else if (showAllDataOnEmptyQuery) {
        setSearchResults(
          dataMode === DataMode.LOCAL ? initialDataRef.current : defaultData,
        );
        setHasMoreData(dataMode === DataMode.LOCAL);
      }
    }
  }, [
    searchQuery,
    selectedFilter,
    dataMode,
    defaultData,
    minCharacters,
    showAllDataOnEmptyQuery,
  ]);

  // Monitor cache health and clean if necessary
  useEffect(() => {
    if (!enableCache || !cacheStats) return;
    if (cacheStats.expiredEntries > cacheStats.validEntries) {
      CacheManager.cleanExpiredCache(cacheStrategy);
    }
  }, [enableCache, cacheStats, cacheStrategy]);

  const clearCache = useCallback(async () => {
    if (!enableCache) return;
    await CacheManager.clear(cacheStrategy);
    await updateCacheStats();
  }, [enableCache, cacheStrategy, updateCacheStats]);

  // Update cache stats periodically
  useEffect(() => {
    if (!enableCache) return;
    updateCacheStats();
    const statsInterval = setInterval(updateCacheStats, 60000);
    return () => clearInterval(statsInterval);
  }, [enableCache, updateCacheStats]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (debouncedSearchRef.current && debouncedSearchRef.current.cancel) {
        debouncedSearchRef.current.cancel();
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (enableCache) {
        CacheManager.clear(cacheStrategy);
      }
    };
  }, [enableCache, cacheStrategy]);

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    isLoading,
    error,
    hasMoreData,
    loadMoreResults,
    isLoadingMore,
    defaultData,
    hasMoreDefaultData,
    loadMoreDefaultData,
    isLoadingMoreDefaultData,
    defaultDataPage,
    totalItems: totalItemsRef.current,
    cacheStats,
    clearCache,
    updateCacheStats,
    isConnected,
  };
};

export default useSearch;
