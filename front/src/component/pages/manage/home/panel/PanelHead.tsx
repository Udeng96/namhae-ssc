import styled from 'styled-components';

interface Props {
  znNm: string;
  facCnt: number;
}

const PanelHead = ({ znNm, facCnt }: Props) => {
  return (
    <StyledPanelHead>
      <StyledPanelHeadNm>{znNm}</StyledPanelHeadNm>
      <StyledPanelHeadCnt>{facCnt}</StyledPanelHeadCnt>
    </StyledPanelHead>
  );
};

export default PanelHead;

const StyledPanelHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const StyledPanelHeadNm = styled.h3`
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: 700;
  color: #fff;
  text-shadow: 0px 0px 3px rgba(0, 0, 0, 0.3);

  &::after {
    content: '';
    display: inline-block;
    width: 12px;
    height: 18px;
    margin-left: 2px;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='18' viewBox='0 0 12 18' fill='none'%3E%3Cpath d='M4 4L9 9L4 14' stroke='white' stroke-width='1.75'/%3E%3C/svg%3E")
      no-repeat center / contain;
  }
`;

const StyledPanelHeadCnt = styled.p`
  display: flex;
  align-items: center;
  gap: 0 6px;
  color: #fff;
  text-shadow: 0px 0px 3px rgba(0, 0, 0, 0.3);
  font-size: 18px;
  font-weight: 700;
  text-align: right;

  &::before {
    content: '경로당 수';
    display: block;
    font-size: 13px;
    font-weight: 400;
    text-align: right;
  }
`;
