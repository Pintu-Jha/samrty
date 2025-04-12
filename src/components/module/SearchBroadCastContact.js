import React, { useCallback, useRef } from 'react';
import { useSearchBroadCastGroupMemberMutation } from '../../api/slice/broadCastGroupSlice';
import { DataMode } from '../../utils/constant';
import BroadCastGroupDetailColum from '../colums/BroadCastGroupDetailColum';
import ContainerComponent from '../common/ContainerComponent';
import DynamicSearch from '../common/DynamicSearch';

const SearchBroadCastContact = ({route}) => {
  const {name} = route?.params;
  const dynamicSearchRef = useRef(null);

  const [triggerSearchContact] = useSearchBroadCastGroupMemberMutation();

  const fetchSearchResultsAPI = useCallback(
    async (query, page = 1, limit = 20, signal) => {
      try {
        const payload = {
          name: name,
          search_query: query,
        };
        const response = await triggerSearchContact(payload, {signal}).unwrap();
        // console.log(response);
        
        const results = response?.data ?? [];
        const hasMore = results.length === limit;
        const total = results.length;
        return {results, hasMore, total};
      } catch (error) {
        if (error.name === 'AbortError') {
          console.log('Search request aborted');
          return {results: [], hasMore: false};
        }
        console.error('Search Error:', error);
        return {results: [], hasMore: false, error: error.message};
      }
    },
    [triggerSearchContact],
  );

  return (
    <ContainerComponent noPadding useScrollView={false}>
      <DynamicSearch
        ref={dynamicSearchRef}
        data={[]}
        dataMode={DataMode.REMOTE}
        searchKeys={['enable', 'group_member', 'mobile_no', 'contact_name']}
        fetchSearchResults={fetchSearchResultsAPI}
        placeholder="Search Contact..."
        minCharacters={1}
        isgoBackArrowShow={true}
        renderCustomItem={({item}) => <BroadCastGroupDetailColum item={item} />}
      />
    </ContainerComponent>
  );
};

export default SearchBroadCastContact;
