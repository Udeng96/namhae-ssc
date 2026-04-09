import styled from 'styled-components';

const HomeHeader = () => {
  return (
    <StyledHomeHeader>
      <StyledHomeHeaderTitle>
        남해군 스마트 경로당
        <span>Dashboard</span>
      </StyledHomeHeaderTitle>
      <p>지역별 상황 이벤트 및 시설물 이상 현황</p>
    </StyledHomeHeader>
  );
};

export default HomeHeader;

const StyledHomeHeader = styled.div`
  position: absolute;
  top: 56px;
  left: 40px;
  display: flex;
  flex-direction: column;
  gap: 25px 0;
  z-index: 1;

  p {
    font-size: 13px;
    color: #e3e0fa;
    line-height: 18px;
  }
`;

const StyledHomeHeaderTitle = styled.h2`
  font-size: 28px;
  font-weight: 500;
  letter-spacing: -0.84px;
  background: linear-gradient(90deg, #fff 0%, #f0f1ff 100%);
  background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;

  span {
    display: block;
    margin-top: 8px;
    font-size: 30px;
    font-weight: 100;
    letter-spacing: 6.9px;
    background: linear-gradient(90deg, #9cffff 0%, #1c86ff 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;
