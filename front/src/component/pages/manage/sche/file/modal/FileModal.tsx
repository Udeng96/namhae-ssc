import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { useShallow }   from 'zustand/react/shallow';
import { useMutation }  from '@tanstack/react-query';
import {
  CommonModal, CommonModalDimmed, CommonModalHide, CommonModalShow, CommonModalWrap,
} from '@/component/lib/css';
import { useCommonStore } from '@/component/stores/commonStore';
import { useFileStore }   from '@/component/stores/fileStore';
import { deleteFile }     from '@/component/api/fileApi';
import { FILE_MODAL_TYPE, SCHE_MODAL_TYPE } from '@/component/constants/scheConst';
import FileModalHead from '@/component/pages/manage/sche/file/modal/FileModalHead';
import FileModalFoot from '@/component/pages/manage/sche/file/modal/FileModalFoot';
import FileDelBody   from '@/component/pages/manage/sche/file/modal/del/FileDelBody';
import UpBody        from '@/component/pages/manage/sche/file/modal/up/UpBody';

const FileModal = () => {
  const { modal, setModal } = useCommonStore(
    useShallow((s) => ({ modal: s.modal, setModal: s.actions.setModal })),
  );
  const { selectFile, setSelectFile, deleteFile: delFile, setDeleteFile, setRequestState } =
    useFileStore(
      useShallow((s) => ({
        selectFile:      s.selectFile,
        setSelectFile:   s.actions.setSelectFile,
        deleteFile:      s.deleteFile,
        setDeleteFile:   s.actions.setDeleteFile,
        setRequestState: s.actions.setRequestState,
      })),
    );

  const [isUp,         setIsUp]         = useState(false);
  const [isRequestUp,  setIsRequestUp]  = useState(false);
  const [isRequestDel, setIsRequestDel] = useState(false);

  // ── 업로드 vs 삭제 모드 전환 ─────────────────────────
  useEffect(() => {
    if (modal === FILE_MODAL_TYPE.UP) {
      setIsUp(true);
    } else if (modal === FILE_MODAL_TYPE.DEL) {
      setIsUp(false);
    } else {
      // 모달이 닫힐 때 지연 초기화
      setTimeout(() => {
        setIsUp(false);
        setSelectFile(null);
      }, 700);
    }
  }, [modal]);

  // ── 파일 삭제 요청 ───────────────────────────────────
  const delFileMutation = useMutation(
    async () => {
      const res = await deleteFile(delFile!.fileId);
      return res.data;
    },
    {
      onSuccess: (data) => {
        if (data === 'SUCCESS') {
          setDeleteFile(null);
          setModal(SCHE_MODAL_TYPE.NONE);
          setIsRequestDel(false);
          setRequestState('all');
        }
      },
    },
  );

  useEffect(() => {
    if (delFile && isRequestDel) {
      delFileMutation.mutate();
    }
  }, [isRequestDel, delFile]);

  const isOpen = modal === FILE_MODAL_TYPE.UP || modal === FILE_MODAL_TYPE.DEL;

  return (
    <StyledModal $isOpen={isOpen}>
      <StyledDimmed />
      <StyledWrap>
        <StyledBox>
          <FileModalHead isUp={isUp} />
          {isUp
            ? <UpBody isRequestUp={isRequestUp} setIsRequestUp={setIsRequestUp} />
            : <FileDelBody />
          }
          <FileModalFoot
            isUp={isUp}
            setIsRequestUp={setIsRequestUp}
            setIsRequestDel={setIsRequestDel}
          />
        </StyledBox>
      </StyledWrap>
    </StyledModal>
  );
};

export default FileModal;

const StyledModal = styled.div<{ $isOpen: boolean }>`
  ${CommonModal};
  ${({ $isOpen }) => ($isOpen ? CommonModalShow : CommonModalHide)};
`;
const StyledDimmed = styled.div`${CommonModalDimmed}`;
const StyledWrap   = styled.div`${CommonModalWrap}`;
const StyledBox    = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-radius: 20px;
  border: 1px solid #7A45FF;
  background: #0F1223;
  box-shadow: 0 12px 20px 4px rgba(0,0,0,.32);
`;
