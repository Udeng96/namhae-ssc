import styled from 'styled-components';
import { useShallow } from 'zustand/react/shallow';
import { useFacStore } from '@/component/stores/facStore';
import Spinner from '@/component/pages/manage/common/Spinner';
import FireEventArea from './event/FireEventArea';
import FireGis from './gis/FireGis';
import FireLastEvent from './event/modal/last/FireLastEvent';
import FireConfPopup from './conf/FireConfPopup';
import FireToast      from './FireToast';
import FireEventAlarm from './alarm/FireEventAlarm';

const FireRoot = (props: { isShow: boolean }) => {
  const { crimeCctvs, scCctvs } = useFacStore(
    useShallow((state) => ({
      crimeCctvs: state.crimeCctvs,
      scCctvs:    state.scCctvs,
    })),
  );

  return (
    <StyledFireRoot $isShow={props.isShow}>
      <FireEventAlarm />
      {props.isShow && (
        <>
          {(crimeCctvs.length === 0 || scCctvs.length === 0) && <Spinner />}
          <FireEventArea />
          <FireGis />
          <FireLastEvent />
          <FireConfPopup />
          <FireToast />
        </>
      )}
    </StyledFireRoot>
  );
};

export default FireRoot;

const StyledFireRoot = styled.section<{ $isShow: boolean }>`
  display: ${({ $isShow }) => ($isShow ? 'block' : 'none')};
  position: relative;
  width: 100%;
  height: 100%;
`;
