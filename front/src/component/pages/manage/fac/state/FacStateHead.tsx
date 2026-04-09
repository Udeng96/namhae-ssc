import styled from 'styled-components';
import moment from 'moment';
import { useMutation } from '@tanstack/react-query';
import { useShallow } from 'zustand/react/shallow';
import { FAC_IMAGE } from '@/component/lib/facImage';
import { useFacStore } from '@/component/stores/facStore';
import { useHomeStore } from '@/component/stores/homeStore';
import { fetchFacState } from '@/component/api/facApi';
import { FAC_TOAST } from '@/component/constants/facConst';
import { ScFacType } from '@/component/types/fac';

const FacStateHead = () => {
  const { selectFac, facList, setFacList, setSelectFac, setToastKey } = useFacStore(
    useShallow((state) => ({
      selectFac:    state.selectFac,
      facList:      state.facList,
      setFacList:   state.actions.setFacList,
      setSelectFac: state.actions.setSelectFac,
      setToastKey:  state.actions.setToastKey,
    })),
  );

  const { scFacs, setScFacs } = useHomeStore(
    useShallow((state) => ({
      scFacs:    state.scFacs,
      setScFacs: state.actions.setScFacs,
    })),
  );

  const reloadMutation = useMutation({
    mutationFn: (scId: string) => fetchFacState(scId),
    onSuccess: (res) => {
      if (!res?.data) {
        setToastKey(FAC_TOAST.RELOAD_FAILURE);
        return;
      }
      const updated: ScFacType = res.data;
      setFacList(facList.map((f) => (f.mgtNo === updated.mgtNo ? updated : f)));
      setScFacs(scFacs.map((f) => (f.mgtNo === updated.mgtNo ? updated : f)));
      setSelectFac(updated);
      setToastKey(FAC_TOAST.RELOAD_SUCCESS);
    },
    onError: () => setToastKey(FAC_TOAST.RELOAD_FAILURE),
  });

  const handleReload = () => {
    if (selectFac) reloadMutation.mutate(selectFac.mgtNo);
  };

  return (
    <StyledHead>
      <StyledNm>{selectFac ? selectFac.facNm : '경로당'} <span>상세정보</span></StyledNm>
      <StyledReloadBtn onClick={handleReload}>
        <div />
        Reload
      </StyledReloadBtn>
      <StyledInfo>
        <StyledAddr><i />{selectFac ? selectFac.posNm : '-'}</StyledAddr>
        <StyledDtm>Update : {moment().format('YYYY-MM-DD HH:mm:ss')}</StyledDtm>
      </StyledInfo>
    </StyledHead>
  );
};

export default FacStateHead;

const StyledHead = styled.div`
  flex-wrap: wrap;
  padding: 7px 16px 17px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
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

const StyledReloadBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 68px;
  height: 22px;
  font-size: 12px;
  font-weight: 400;
  color: #7a45ff;
  border-radius: 4px;
  div {
    display: inline-block;
    width: 16px;
    height: 16px;
    margin-right: 3px;
    background-size: 100%;
    background-image: url('${FAC_IMAGE.STATE.RELOAD.BASE}');
  }
  &:hover {
    color: #9c7bff;
    div { background-image: url('${FAC_IMAGE.STATE.RELOAD.HOVER}'); }
  }
`;

const StyledInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-top: 30px;
  padding: 0;
`;

const StyledAddr = styled.div`
  display: flex;
  align-items: center;
  font-size: 11px;
  font-weight: 400;
  color: #f2f4fc;
  i {
    display: inline-block;
    width: 18px;
    height: 18px;
    margin-right: 6px;
    background-size: 100%;
    background-image: url('${FAC_IMAGE.STATE.ADDR}');
  }
`;

const StyledDtm = styled.div`
  margin-left: auto;
  font-size: 11px;
  font-weight: 300;
  color: #a8afbd;
`;
