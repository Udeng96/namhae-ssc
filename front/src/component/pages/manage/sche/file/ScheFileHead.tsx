import styled from 'styled-components';
import { SCHE_IMAGE } from '@/component/lib/scheImage';
import { useCommonStore } from '@/component/stores/commonStore';
import { FILE_MODAL_TYPE } from '@/component/constants/scheConst';

const ScheFileHead = () => {
  const setModal = useCommonStore((s) => s.actions.setModal);

  return (
    <StyledHead>
      <i />
      <h3>파일 리스트</h3>
      <StyledUpBtn onClick={() => setModal(FILE_MODAL_TYPE.UP)}>
        <i />
        파일 업로드
      </StyledUpBtn>
    </StyledHead>
  );
};

export default ScheFileHead;

const StyledHead = styled.div`
  display: flex;
  align-items: center;
  height: 56px;
  padding: 0 24px 0 22px;
  border-bottom: solid 1px #222A47;

  > i {
    display: inline-block;
    width: 20px;
    height: 20px;
    margin-right: 6px;
    background: url("${SCHE_IMAGE.FILE.HEAD.TITLE_ICON}") no-repeat center / 100%;
  }

  h3 {
    font-size: 16px;
    font-weight: 500;
    color: #F2F4FC;
  }
`;

const StyledUpBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 108px;
  height: 32px;
  margin-left: auto;
  font-size: 12px;
  font-weight: 500;
  color: #F2F4FC;
  border-radius: 6px;
  background: #2A2E54;
  cursor: pointer;

  &:hover { background-color: #3E4165; }

  i {
    display: inline-block;
    width: 18px;
    height: 18px;
    margin-right: 6px;
    background: url("${SCHE_IMAGE.FILE.HEAD.UPLOAD_ICON}") no-repeat center / 100%;
  }
`;
