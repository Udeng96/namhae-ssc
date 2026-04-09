import styled from 'styled-components';

const FacListHead = () => (
  <StyledHead>
    <StyledNm>시설물<span>Dashboard</span></StyledNm>
  </StyledHead>
);

export default FacListHead;

const StyledHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px 24px;
`;

const StyledNm = styled.h2`
  font-size: 20px;
  font-weight: 600;

  span {
    padding-left: 6px;
    font-size: 22px;
    font-weight: 200;
    background: linear-gradient(270deg, #7a45ff 0%, #9c7bff 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;
