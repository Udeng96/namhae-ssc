import styled from 'styled-components';
import { EVENT_IMAGE } from '@/component/lib/eventImage';
import FacSearchArea from './FacSearchArea';

const FacSearch = () => (
  <StyledBox>
    <StyledHead>
      <StyledTitle><i />시설물 검색 조건 설정</StyledTitle>
    </StyledHead>
    <FacSearchArea />
  </StyledBox>
);

export default FacSearch;

const StyledBox = styled.div`
  padding: 0 32px 24px;
`;

const StyledHead = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
`;

const StyledTitle = styled.h3`
  display: flex;
  align-items: center;
  font-size: 15px;
  font-weight: 500;
  color: #f2f4fc;

  i {
    display: inline-block;
    width: 20px;
    height: 20px;
    margin-right: 6px;
    margin-top: -5px;
    background-size: 100%;
    background-image: url('${EVENT_IMAGE.CONTENT.SEARCH.ICON}');
  }
`;
