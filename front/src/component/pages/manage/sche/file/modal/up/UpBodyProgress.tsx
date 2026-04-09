import styled from 'styled-components';

interface Props { upPer: number; nm: string; size: number; }

const UpBodyProgress = ({ upPer, nm, size }: Props) => (
  <StyledProgress>
    <StyledWrap>
      <StyledNm>{nm}</StyledNm>
      <StyledSize>{(size / 1024 / 1024).toFixed(1)}MB</StyledSize>
      <StyledBar>
        <progress value={upPer} max={100} />
        <span>{upPer}%</span>
      </StyledBar>
    </StyledWrap>
  </StyledProgress>
);

export default UpBodyProgress;

const StyledProgress = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 444px;
  height: 136px;
  border-radius: 12px;
  border: 1px solid #2A2E54;
  background-color: #12172E;
`;

const StyledWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const StyledNm = styled.p`
  width: 382px;
  text-align: center;
  font-size: 12px;
  color: #F2F4FC;
  line-height: 1.2;
`;

const StyledSize = styled.p`
  margin-top: 2px;
  font-size: 10px;
  font-weight: 300;
  color: #9C7BFF;
`;

const StyledBar = styled.div`
  display: flex;
  align-items: center;
  gap: 0 8px;
  margin: 12px 0;

  progress {
    appearance: none;
    width: 200px;
    height: 8px;
    -webkit-appearance: none;

    &::-webkit-progress-bar {
      border-radius: 4px;
      background: linear-gradient(180deg, #070B1E 0%, #333954 100%);
    }
    &::-webkit-progress-value {
      border-radius: 4px;
      background: linear-gradient(180deg, #9C7BFF 0%, #543FAF 100%);
      box-shadow: 0 2px 4px rgba(122,69,255,.33);
    }
  }

  span { font-size: 17px; color: #F2F4FC; }
`;
