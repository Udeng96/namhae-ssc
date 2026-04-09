import styled from 'styled-components';
import { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';
import {
  CommonToast, CommonToastClsBtn, CommonToastHide,
  CommonToastIconNorm, CommonToastIconWarn, CommonToastShow,
} from '@/component/lib/css';
import { useFileStore } from '@/component/stores/fileStore';
import { FILE_TOAST_TYPE } from '@/component/constants/scheConst';

const FileToast = () => {
  const { fileToast, setFileToast } = useFileStore(
    useShallow((s) => ({
      fileToast:    s.fileToast,
      setFileToast: s.actions.setFileToast,
    })),
  );

  useEffect(() => {
    if (fileToast !== FILE_TOAST_TYPE.NONE) {
      const timer = setTimeout(() => setFileToast(FILE_TOAST_TYPE.NONE), 2000);
      return () => clearTimeout(timer);
    }
  }, [fileToast]);

  const close = () => setFileToast(FILE_TOAST_TYPE.NONE);

  const TOASTS: { type: string; msg: string; warn: boolean }[] = [
    { type: FILE_TOAST_TYPE.SIZE,         msg: '최대 업로드 용량을 초과했습니다.',           warn: true  },
    { type: FILE_TOAST_TYPE.FILE_TYPE,    msg: '허용되지 않는 파일 형식입니다.',             warn: true  },
    { type: FILE_TOAST_TYPE.DUPLICATED,   msg: '중복된 파일명입니다. 파일명을 확인해 주세요.', warn: true  },
    { type: FILE_TOAST_TYPE.FILE_FAILURE, msg: '업로드 실패하였습니다.',                      warn: true  },
    { type: FILE_TOAST_TYPE.SUCCESS,      msg: '업로드가 완료되었습니다.',                    warn: false },
  ];

  return (
    <>
      {TOASTS.map(({ type, msg, warn }) => (
        <StyledToast key={type} $isOpened={fileToast === type} $isWarn={warn}>
          <i />
          <p>{msg}</p>
          <StyledClsBtn onClick={close} />
        </StyledToast>
      ))}
    </>
  );
};

export default FileToast;

const StyledToast = styled.div<{ $isOpened: boolean; $isWarn: boolean }>`
  ${CommonToast}
  i { ${({ $isWarn }) => ($isWarn ? CommonToastIconWarn : CommonToastIconNorm)} }
  border: 1px solid ${({ $isWarn }) => ($isWarn ? '#F65569' : '#7A45FF')};
  ${({ $isOpened }) => ($isOpened ? CommonToastShow : CommonToastHide)}
`;

const StyledClsBtn = styled.button`${CommonToastClsBtn}`;
