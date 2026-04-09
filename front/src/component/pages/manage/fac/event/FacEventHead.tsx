import styled from 'styled-components';

const FacEventHead = () => (
  <StyledHead>
    <StyledTitle>이벤트 발생 <span>리스트</span></StyledTitle>
  </StyledHead>
);

export default FacEventHead;

const StyledHead = styled.div`
  flex-wrap: wrap;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 8px;
  padding: 15px 24px;
`;

const StyledTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  span {
    padding-left: 6px;
    font-size: 22px;
    font-weight: 200;
    background: linear-gradient(270deg, #7a45ff 0%, #9c7bff 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;
