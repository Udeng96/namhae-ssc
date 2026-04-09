import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import moment from 'moment';
import { useCommonStore } from '@/component/stores/commonStore';
import { useFileStore }   from '@/component/stores/fileStore';
import { useScheStore }   from '@/component/stores/scheStore';
import { BASE_URL, API } from '@/component/lib/urls';
import { FILE_TOAST_TYPE, SCHE_MODAL_TYPE, SCHE_TYPE } from '@/component/constants/scheConst';
import UpBodySelectBtn from '@/component/pages/manage/sche/file/modal/up/UpBodySelectBtn';
import UpBodyProgress  from '@/component/pages/manage/sche/file/modal/up/UpBodyProgress';
import UpBodyNotice    from '@/component/pages/manage/sche/file/modal/up/UpBodyNotice';
import UpBodyInfo      from '@/component/pages/manage/sche/file/modal/up/UpBodyInfo';

interface Props {
  isRequestUp: boolean;
  setIsRequestUp: React.Dispatch<React.SetStateAction<boolean>>;
}

const UpBody = ({ isRequestUp, setIsRequestUp }: Props) => {
  const setModal   = useCommonStore((s) => s.actions.setModal);
  const activeType = useScheStore((s) => s.activeType);

  const { selectFile, setSelectFile, setRequestState, setFileToast } = useFileStore(
    useShallow((s) => ({
      selectFile:      s.selectFile,
      setSelectFile:   s.actions.setSelectFile,
      setRequestState: s.actions.setRequestState,
      setFileToast:    s.actions.setFileToast,
    })),
  );

  const [duration, setDuration] = useState('00:00:00');
  const [upPer,    setUpPer]    = useState(0);

  // ── 영상 파일의 재생 시간 계산 ───────────────────────
  useEffect(() => {
    if (!selectFile || selectFile.type.includes('image')) {
      setDuration('00:00:00');
      return;
    }

    const video = document.createElement('video');
    video.src = URL.createObjectURL(selectFile);

    const timer = setInterval(() => {
      if (video.readyState === 4) {
        const h = Math.floor(video.duration / 3600);
        const m = Math.floor((video.duration % 3600) / 60);
        const s = Math.floor(video.duration % 60);
        setDuration([h, m, s].map((v) => String(v).padStart(2, '0')).join(':'));
        clearInterval(timer);
        URL.revokeObjectURL(video.src);
      }
    }, 100);

    return () => {
      clearInterval(timer);
      URL.revokeObjectURL(video.src);
    };
  }, [selectFile]);

  // ── 이미지 치수 계산 ────────────────────────────────
  const getImageDimensions = (file: File): Promise<{ width: number; height: number }> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => resolve({ width: img.width, height: img.height });
        img.onerror = reject;
        img.src = e.target!.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  // ── 업로드 뮤테이션 ─────────────────────────────────
  const upMutation = useMutation(
    async () => {
      const formData = new FormData();
      formData.append('file', selectFile!);

      const isVideo = selectFile!.type.includes('video');
      let fileParam = {
        fileId:       '',
        fileNm:       selectFile!.name,
        fileType:     selectFile!.type,
        uploadDtm:    moment().format('YYYYMMDDHHmmss'),
        fileDuration: duration,
        normalYn:     activeType === SCHE_TYPE.CONTENT ? '0' : '1',
        width:        '0',
        height:       '0',
      };

      if (!isVideo) {
        const { width, height } = await getImageDimensions(selectFile!);
        fileParam = { ...fileParam, width: String(width), height: String(height) };
      }

      const { data } = await axios.post(BASE_URL + API.FILE.UPLOAD, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        params:  fileParam,
        onUploadProgress: (e) => {
          setUpPer(Math.round((e.loaded * 100) / e.total!));
        },
      });
      return data as string;
    },
    {
      onSuccess: (data) => {
        const toastMap: Record<string, string> = {
          SIZE:             FILE_TOAST_TYPE.SIZE,
          FILE_TYPE:        FILE_TOAST_TYPE.FILE_TYPE,
          DUPLICATED:       FILE_TOAST_TYPE.DUPLICATED,
          FILE_UPLOAD_FAILURE: FILE_TOAST_TYPE.FILE_FAILURE,
        };

        if (data === 'SUCCESS') {
          setFileToast(FILE_TOAST_TYPE.SUCCESS);
          setTimeout(() => {
            setSelectFile(null);
            setUpPer(0);
            setRequestState('all');
            setIsRequestUp(false);
          }, 300);
          setModal(SCHE_MODAL_TYPE.NONE);
        } else {
          setFileToast(toastMap[data] ?? FILE_TOAST_TYPE.FILE_FAILURE);
          setModal(SCHE_MODAL_TYPE.NONE);
          setIsRequestUp(false);
        }
      },
      onError: (err) => {
        if (axios.isAxiosError(err)) {
          const status  = err.response?.status;
          const message = err.response?.data?.message ?? '';
          if (status === 500 && message.includes('Maximum upload size exceeded')) {
            setFileToast(FILE_TOAST_TYPE.SIZE);
          } else if (status === 413) {
            setFileToast(FILE_TOAST_TYPE.SIZE);
          } else {
            setFileToast(FILE_TOAST_TYPE.FILE_FAILURE);
          }
        } else {
          setFileToast(FILE_TOAST_TYPE.FILE_FAILURE);
        }
        setSelectFile(null);
        setUpPer(0);
        setModal(SCHE_MODAL_TYPE.NONE);
        setIsRequestUp(false);
      },
    },
  );

  useEffect(() => {
    if (isRequestUp) upMutation.mutate();
  }, [isRequestUp]);

  return (
    <StyledBody>
      {isRequestUp && selectFile
        ? <UpBodyProgress upPer={upPer} nm={selectFile.name} size={selectFile.size} />
        : <UpBodySelectBtn />
      }
      <UpBodyNotice isContent={activeType === SCHE_TYPE.CONTENT} />
      {selectFile && <UpBodyInfo fileNm={selectFile.name} />}
    </StyledBody>
  );
};

export default UpBody;

const StyledBody = styled.div`
  position: relative;
  padding: 24px 32px;
  font-size: 17px;
  color: #F2F4FC;

  &::before, &::after {
    content: '';
    display: block;
    position: absolute;
    left: 0;
    width: 100%;
    height: 1px;
  }
  &::before { top: 0;    background: linear-gradient(90deg, #543FAF, #2A2E54); }
  &::after  { bottom: 0; background: linear-gradient(90deg, #2A2E54, #543FAF); }
`;
