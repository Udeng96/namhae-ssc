import styled from 'styled-components';
import { useSocialStore } from '@/component/stores/socialStore';
import { useShallow } from 'zustand/react/shallow';
import moment from 'moment';
import { SOCIAL_IMAGE } from '@/component/lib/socialImage';

const EventPopup = () => {
  const { eventSocketData } = useSocialStore(
    useShallow((s) => ({ eventSocketData: s.eventSocketData })),
  );

  if (!eventSocketData) return null;

  return (
    <StyledEventPopup>
      <StyledEventBox>
        <StyledNotiInfo>
          <StyledEventContent>
            <StyledEventTitle>
              <i />
              <p>{eventSocketData.message.contentTitle}</p>
            </StyledEventTitle>
          </StyledEventContent>
          <StyledEventInfoItem>
            <StyledEventInfoItemTitle>발생 일시</StyledEventInfoItemTitle>
            <StyledEventInfoItemVal>
              {moment(eventSocketData.message.outbDtm, 'YYYYMMDDHHmmssSSS').format(
                'MM월 DD일 HH:mm',
              )}
            </StyledEventInfoItemVal>
          </StyledEventInfoItem>
          <StyledNotiTriangleLineBox>
            <StyledNotiTriangleLine />
            <StyledNotiTriangleLine />
            <StyledNotiTriangleLine />
          </StyledNotiTriangleLineBox>
          <StyledNotiInfo>{eventSocketData.message.contentCntn}</StyledNotiInfo>
        </StyledNotiInfo>
      </StyledEventBox>
    </StyledEventPopup>
  );
};

export default EventPopup;

const StyledEventPopup = styled.div`
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  width: 100%; height: 100%;
  background-color: rgba(0, 0, 0, 0.33);
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledEventBox = styled.div`
  display: flex;
  width: 904px;
  padding: 96px 0 120px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 56px;
  border: 6px solid #F0516C;
  background: #FFF;
  box-shadow: 0 30px 60px 0 rgba(0, 0, 0, 0.20);
`;

const StyledEventContent = styled.div`
  width: 904px;
  display: flex;
  flex-direction: column;
  gap: 48px;
  align-items: center;
`;

const StyledEventTitle = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;

  i {
    width: 120px;
    height: 120px;
    background: url("${SOCIAL_IMAGE.EVENT.TITLE_ICON}") no-repeat 100%;
  }

  p {
    color: #D63E58;
    font-size: 72px;
    font-weight: 600;
  }
`;

const StyledEventInfoItem = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  gap: 16px;
  flex-direction: column;
  align-items: center;
`;

const StyledEventInfoItemTitle = styled.div`
  width: 138px;
  height: 47px;
  padding: 15px 24.5px;
  border-radius: 60px;
  background: rgba(15, 18, 35, 0.10);
  font-size: 22px;
  font-weight: 400;
  color: #0F1223;
  display: flex;
  align-items: center;
`;

const StyledEventInfoItemVal = styled.div`
  width: 100%;
  height: 36px;
  color: #0F1223;
  text-align: center;
  font-size: 28px;
  font-weight: 600;
`;

const StyledNotiTriangleLineBox = styled.div`
  width: 48px;
  height: 48px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
`;

const StyledNotiTriangleLine = styled.div`
  height: 3px;
  background-color: #7A45FF;

  &:first-child  { width: 40px; opacity: 1; }
  &:nth-child(2) { width: 24px; opacity: 0.75; }
  &:nth-child(3) { width: 8px;  opacity: 0.5; }
`;

const StyledNotiInfo = styled.div`
  display: flex;
  flex-direction: column;
  width: 764px;
  font-size: 44px;
  justify-content: center;
  align-items: center;
  line-height: 65px;
  text-align: center;
  color: #0F1223;
  white-space: pre-line;
  gap: 48px;
`;
